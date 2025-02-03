const User = require('../models/User');
const Task = require('../models/Task');

// Show the registration page
const showRegisterPage = (req, res) => {
  res.render('register');
};

// Show the login page
const showLoginPage = (req, res) => {
  res.render('login');
};

// Handle user registration
const handleRegistration = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('Email already exists');
    }

    // Create and save the new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.render('login');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal server error');
  }
};

// Handle user login
const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid username');
    }

    // Compare the password
    if (password !== user.password) {
      return res.status(400).send('Invalid password');
    }

    // Store user session
    req.session.user = {
      _id: user._id,
      username: user.username,
      role: user.role
    };

    // Redirect based on role
    res.redirect(user.role === 'admin' ? '/admin' : '/user');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal server error');
  }
};

// Show the admin dashboard
const showAdminPage = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }
    const users = await User.find();
    const tasks = await Task.find().populate('assignedTo');
    res.render('admin/admin', { users, tasks });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Manage users page
const handleManageUser = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }

    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
    const limit = 5; // Number of tasks per page
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments(); // Total number of tasks
    const tasks = await Task.find().populate('assignedTo').skip(skip).limit(limit);

    res.render('admin/manageuser', {
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Internal server error');
  }
};

// Show create task page
const createTask = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.render('admin/createtask', { users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Handle task creation
const postCreateTask = async (req, res) => {
  try {
    const { taskName, taskDescription, assignedTo } = req.body;
    const newTask = new Task({
      name: taskName,
      description: taskDescription,
      assignedTo,
      status: 'pending',
      createdBy: req.session.user._id
    });
    await newTask.save();
    res.redirect('/admin');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Show user dashboard with assigned tasks
const UserDashboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query parameters
    const limit = 5; // Number of tasks per page
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments({ assignedTo: req.session.user._id }); // Total number of tasks assigned to the user
    const tasks = await Task.find({ assignedTo: req.session.user._id })
      .skip(skip)
      .limit(limit);

    res.render('user/user', {
      user: req.session.user,
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit),
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Show task edit page for users
const taskStatusUpdate = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.render('user/edit-task', { task });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Handle task status update for users
const posttaskUpdate = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.redirect('/user');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Show task edit page for admin
const adminTaskUpdate = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.render('admin/edit-task', { task });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Handle task update for admin
const postAdminTaskUpdate = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.redirect('/admin');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Handle task deletion by admin
const adminDeleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send('Task not found');
    }
    res.redirect('/admin');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal server error');
  }
};

// Promote user to admin
const makeAdmin = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.role = 'admin';
    await user.save();

    res.redirect('/admin');
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).send('Internal server error');
  }
};

// Demote admin to user (except default admin)
const demotAdmin = async (req, res) => {
  try {
    if (req.session.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    if (user.username === 'admin') {
      return res.status(403).send('Default admin cannot be demoted');
    }

    user.role = 'user';
    await user.save();

    res.redirect('/admin');
  } catch (error) {
    console.error('Error demoting admin:', error);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  demotAdmin,
  makeAdmin,
  adminDeleteTask,
  postAdminTaskUpdate,
  adminTaskUpdate,
  posttaskUpdate,
  taskStatusUpdate,
  UserDashboard,
  postCreateTask,
  showRegisterPage,
  handleRegistration,
  showLoginPage,
  handleLogin,
  showAdminPage,
  handleManageUser,
  createTask
};
