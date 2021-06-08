const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3456;
app.use(express.static(path.join(__dirname, './public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// GET routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public/index.html')))
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, './public/notes.html')));
app.get('/api/notes', (req, res) => {
    const noteList = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    res.send(noteList); 
});

// POST/DELETE routes
// save new note
app.post('/api/notes', (req, res) => {
    const noteList = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    let newNote = req.body;

    // "if entried in noteList and last noteList entry has an id, create id for save thats one more than the last."
    // if not, give id = 1.
    if (noteList.length > 0 && noteList[noteList.length - 1].id) {
        newNote.id = noteList[noteList.length - 1].id + 1;
    } else {
        newNote.id = 1;
    }
    noteList.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteList));
    res.send(newNote);
})

// save existing note
app.post('/api/notes/:id', (req, res) => {
    const noteList = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    // get id param as a number for update function.
    let noteId = Number(req.params.id);
    let note = req.body;
    let noteTitle = note.title;
    let noteText = note.text;

    // finds note with same note id as param from note list and creates a variable for it
    const update = (id, title, text, titleVal, textVal) => {
        let currNote = noteList.find(note => {
            return note.id == id;
        });

        // if both exist, change both values to posted values
        if (currNote && currNote[title]) {
            currNote[title] = titleVal;
            currNote[text] = textVal;
        }
    }
    update(noteId, "title", "text", noteTitle, noteText);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteList));
    res.send(noteList);
})

// delete note route
app.delete('/api/notes/:id', (req, res) => {
    const noteList = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    let noteId = Number(req.params.id);
    
    // splice from noteList array 1 item where the the index position is the note position where note id's match.
    noteList.splice(noteList.findIndex(e => e.id == noteId), 1);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteList));
    res.send();
})

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });