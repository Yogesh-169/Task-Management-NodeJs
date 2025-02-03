const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const path = require('path');
const methodOverride = require('method-override');


const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));  // This tells Express to look for ?_method=DELETE to override the POST method

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false, // Prevents creating empty sessions
  cookie: { secure: false } // Set to true if using HTTPS
}));

// View engine setup
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin:admin@cluster0.iczxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware to make session user available in views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Use auth routes
app.use('/', authRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
