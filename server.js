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
app.post('/api/notes', (req, res) => {
    const noteList = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json')));
    let newNote = req.body;

    if (noteList.length > 0 && noteList[noteList.length - 1].id) {
        newNote.id = noteList[noteList.length - 1].id + 1;
    } else {
        newNote.id = 1;
    }

    noteList.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteList));
    res.send(newNote);
})

app.delete('./api/notes/:id', (req, res) => {
    const noteList = JSON.parse(fs.readFile(path.join(__dirname, './db/db.json')));
    let noteId = Number(req.params.id);

    for (let i = 0; i < noteList.length; i++) {
        if (noteList[i].id === noteId){
            noteList.splice(i, 1);
        }
    }

    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(noteList));
    res.send();
})

app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
  });