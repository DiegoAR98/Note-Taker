// Importing necessary modules
const express = require("express");
const path = require("path");
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");

// Creating an instance of express to set up the server
const app = express();

// Redirect requests to '/notes.html' to '/notes' (It was necessary to make the code work on /notes)
app.use((req, res, next) => {
    if (req.url === '/notes.html') {
      res.redirect(301, '/notes');
    } else {
      next();
    }
});

// Defining the port to be used by the server
const PORT = process.env.PORT || 3001;

// Middleware to parse URL-encoded data (from forms, etc.)
app.use(express.urlencoded({ extended: true }));

// Serving static files from the 'public' directory
app.use(express.static("public"));

// Middleware to parse JSON data (from API requests)
app.use(express.json());

// Using apiRoutes for any requests that start with '/api'
app.use("/api", apiRoutes);

// Using htmlRoutes for all other requests (to serve HTML pages)
app.use("/", htmlRoutes);

// Error handling middleware to catch and respond to any errors in the app
app.use((err, req, res, next) => {
    console.error(err); // Logging the error to the console
    res.status(500).send('Internal Server Error'); // Sending a 500 Internal Server Error response
});

// Starting the server to listen on the specified port
app.listen(PORT, function () {
    console.log(`App listening on PORT: ${PORT}`); // Logging the port number the server is listening on
});
