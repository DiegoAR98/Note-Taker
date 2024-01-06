const fs = require("fs");
const path = require("path");
const router = require("express").Router();
const filePath = path.join(__dirname, "../db/db.json");
const { v4: uuidv4 } = require('uuid');

// Function to read notes from file
function readNotes(callback) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            callback(err);
        } else {
            callback(null, JSON.parse(data));
        }
    });
}

// Function to write notes to file
function writeNotes(notes, callback) {
    fs.writeFile(filePath, JSON.stringify(notes), (err) => {
        callback(err);
    });
}

// GET route for retrieving notes
router.get("/notes", function (req, res) {
    readNotes((err, notes) => {
        if (err) {
            res.status(500).send("Error reading notes");
        } else {
            res.json(notes);
        }
    });
});

// POST route for adding a new note
router.post("/notes", function (req, res) {
    readNotes((err, notes) => {
        if (err) {
            res.status(500).send("Error reading notes");
            return;
        }
        const newNote = { ...req.body, id: uuidv4() };
        notes.push(newNote);
        writeNotes(notes, (writeErr) => {
            if (writeErr) {
                res.status(500).send("Error writing note");
            } else {
                res.json(newNote);
            }
        });
    });
});

// DELETE route for deleting a note
router.delete("/notes/:id", function (req, res) {
    readNotes((err, notes) => {
        if (err) {
            res.status(500).send("Error reading notes");
            return;
        }
        const updatedNotes = notes.filter(note => note.id !== req.params.id);
        writeNotes(updatedNotes, (writeErr) => {
            if (writeErr) {
                res.status(500).send("Error deleting note");
            } else {
                res.json({ message: "Note deleted" });
            }
        });
    });
});

module.exports = router;
