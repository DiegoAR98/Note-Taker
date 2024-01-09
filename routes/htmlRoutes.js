// Import necessary modules
const path = require("path"); // The 'path' module is used for working with file and directory paths
const router = require("express").Router(); // Create a new Router object for defining routes

// Define a route for the home page
router.get("/", function (req, res) {
    // When the root URL ('/') is accessed, send the 'index.html' file to the client
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Define a route for the notes page
router.get("/notes", function (req, res) {
    // When the '/notes' URL is accessed, send the 'notes.html' file to the client
    res.sendFile(path.join(__dirname, "../public/notes.html"));
});

// Define a catch-all route for any other requests
router.get("*", function (req, res) {
    // For any URL not defined above, redirect to the home page by sending 'index.html'
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Export the router so it can be used in other parts of the application
module.exports = router;
