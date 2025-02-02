// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Registration routes
router.get('/register', authController.showRegisterPage);
router.post('/register', authController.handleRegistration);

// Login routes
router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

router.get('/admin', (req, res) => {
  res.render('admin/admin'); // Render the admin page
});

router.get('/manageusers', (req, res) => {
  res.render('admin/manageuser'); // Render the admin page
});

router.get('/create-task', (req, res) => {
  res.render('admin/createtask'); // Render the admin page
});


// User page route
router.get('/user', (req, res) => {
  res.render('user'); // Render the user page
});


module.exports = router;