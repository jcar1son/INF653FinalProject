//required files and connections
require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions.js");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require('mongoose');
const connectDB = require("./config/dbConfig");

//connect mongodb
connectDB()

const PORT = process.env.PORT || 3000;

app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, '/public')));


//getting the index file
app.get('/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

//routes that wer use
app.use("/states", require("./routes/api/states.js"));

//checking for 404 errors
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"));
    } else if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("txt").send("404 Not Found");
    }
});

app.use(errorHandler);

//connecting to mongodb
mongoose.connection.once('open', () => {

    console.log("Connected to MongoDB");

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    
});


