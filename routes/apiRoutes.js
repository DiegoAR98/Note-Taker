const fs = require("fs"); // File System module to interact with the file system
const path = require("path"); // Path module to work with file and directory paths
const router = require("express").Router(); // Express Router to handle routes
const filePath = path.join(__dirname, "../db/db.json"); // Path to the JSON file where notes are stored
const { v4: uuidv4 } = require('uuid'); // UUID module to generate unique identifiers

// Function to read notes from the JSON file
function readNotes(callback) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            callback(err); // If there's an error, pass it to the callback
        } else {
            callback(null, JSON.parse(data)); // Otherwise, parse the data and pass it to the callback
        }
    });
}

// Function to write notes to the JSON file
function writeNotes(notes, callback) {
    fs.writeFile(filePath, JSON.stringify(notes), (err) => {
        callback(err); // Write the notes to the file and pass any error to the callback
    });
}

// GET route for retrieving notes
router.get("/notes", function (req, res) {
    readNotes((err, notes) => {
        if (err) {
            res.status(500).send("Error reading notes"); // Send an error response if there's an error
        } else {
            res.json(notes); // Send the notes as a JSON response
        }
    });
});

// POST route for adding a new note
router.post("/notes", function (req, res) {
    readNotes((err, notes) => {
        if (err) {
            res.status(500).send("Error reading notes"); // Send an error response if there's an error
            return;
        }
        const newNote = { ...req.body, id: uuidv4() }; // Create a new note with a unique ID
        notes.push(newNote); // Add the new note to the array
        writeNotes(notes, (writeErr) => {
            if (writeErr) {
                res.status(500).send("Error writing note"); // Send an error response if there's an error
            } else {
                res.json(newNote); // Send the new note as a JSON response
            }
        });
    });
});

// DELETE route for deleting a note
router.delete("/notes/:id", function (req, res) {
    readNotes((err, notes) => {
        if (err) {
            res.status(500).send("Error reading notes"); // Send an error response if there's an error
            return;
        }
        const updatedNotes = notes.filter(note => note.id !== req.params.id); // Filter out the note to delete
        writeNotes(updatedNotes, (writeErr) => {
            if (writeErr) {
                res.status(500).send("Error deleting note"); // Send an error response if there's an error
            } else {
                res.json({ message: "Note deleted" }); // Confirm deletion
            }
        });
    });
});

module.exports = router; // Export the router for use in other parts of the application
