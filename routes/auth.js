const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const Task = require('../models/Task'); // Import Task Model

// Registration routes
router.get('/register', authController.showRegisterPage);
router.post('/register', authController.handleRegistration);

// Login routes
router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

router.get('/admin', (req, res) => {
  res.render('admin/admin'); // Render the admin page
});

router.get('/manageusers', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.render('admin/manageuser', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to render Create Task Page
router.get('/create-task', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.render('admin/createtask', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal server error');
  }
});

// Route to handle task creation
router.post('/create-task', async (req, res) => {
  const { taskName, taskDescription, assignedTo } = req.body;

  try {
    const newTask = new Task({
      name: taskName,
      description: taskDescription,
      assignedTo: assignedTo,
      status: 'pending'
    });
    await newTask.save();
    res.redirect('/admin'); // Redirect to admin dashboard
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).send('Internal server error');
  }
});

// User page route
router.get('/user', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.session.user._id });
    res.render('user/user', { tasks });
  } catch (error) {
    console.error('Error fetching user tasks:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
