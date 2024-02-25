var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var cors = require('cors')
var mongoose = require('mongoose')
var passport = require('passport')

// Importing route handlers
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Create an instance of the Express application
var app = express();

// Enable Cross-Origin Resource Sharing (CORS) for requests from a specific origin
app.use(cors({origin:"https://localhost:3000", optionsSuccessStatus: 200}));

// Configure session management middleware
app.use(session({
  secret: 'KO329u39jaaDIW324K', // Secret used to sign the session ID cookie
  resave: false, // Don't save the session if it hasn't been modified
  saveUninitialized: false, // Don't save uninitialized sessions
}));

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB database
const mongoDB = "mongodb://localhost:27017/project"; // URL of the MongoDB database
mongoose.connect(mongoDB); // Establish the connection
mongoose.Promise = Promise; // Use native promises
const db = mongoose.connection;

// Handle MongoDB connection errors
db.on("error", console.error.bind(console, "MongoDB connection error"));

// Configure middleware for logging, JSON parsing, URL-encoded form data parsing, cookie parsing, and serving static files
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Route handlers
app.use('/api/', indexRouter); // Routes for the index
app.use('/api/users', usersRouter); // Routes for the users

// Export the configured Express app
module.exports = app;
