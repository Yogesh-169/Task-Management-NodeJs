// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// View engine setup
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.iczxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use auth routes
app.use('/', authRoutes);


// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});