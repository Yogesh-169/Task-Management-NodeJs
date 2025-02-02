
const User = require('../models/User');
const Task = require('../models/Task');


// Show the registration page
const showRegisterPage = (req, res) => {
  res.render('register');
};

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
}

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
    const newUser = new User({ username, email, password: password });
    await newUser.save();

    res.send('User registered successfully');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal server error');
  }
};

// Show the login page
const showLoginPage = (req, res) => {
  res.render('login');
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
    //   const isMatch = await bcrypt.compare(password, user.password);
      if (!password==user.password) {
        return res.status(400).send('Invalid password');
      }
      req.session.user = {
        _id: user._id,
        username: user.username,
        role: user.role
      };
  
      // Redirect based on role
      if (user.role === 'admin') {
        res.redirect('/admin');
      } else {
        res.redirect('/user');
      }
  
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal server error');
    }
  };


const handleManageUser =async (req, res) => {
  try {
    // Check if the user is an admin
    if (req.session.user.role !== 'admin') {
      return res.status(403).send('Forbidden');
    }

    // Fetch all tasks with assigned user details
    const tasks = await Task.find().populate('assignedTo');
    res.render('admin/manageuser', { tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Internal server error');
  }
};

const createTask = async (req, res) => {
  try {
      const users = await User.find({ role: 'user' });
      res.render('admin/createtask', { users });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
  }
};

const postCreateTask =async (req, res) => {
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

const UserDashboard = async (req, res) => {
  try {
      const tasks = await Task.find({ assignedTo: req.session.user._id });
      res.render('user/user', { 
          user: req.session.user,
          tasks 
      });
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
  }
};

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

const posttaskUpdate=async (req, res) => {
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

const adminTaskUpdate =  async (req, res) => {
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

const postAdminTaskUpdate =async (req, res) => {
  try {
      // Make sure to handle all fields in req.body (name, description, status, etc.)
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          description: req.body.description,
          status: req.body.status,  // Update other fields as needed
        },
        { new: true, runValidators: true } 
      );
      
      if (!task) {
          return res.status(404).send('Task not found');
      }
      
      res.redirect('/admin'); // Or wherever you want to redirect after successful update
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
  }
};

const adminDeleteTask = async (req, res) => {
  try {
      const task = await Task.findByIdAndDelete(req.params.id);
      if (!task) {
          return res.status(404).send('Task not found');
      }
      res.redirect('/admin'); // Redirect after deletion to the appropriate page
  } catch (error) {
      console.error('Error:', error);
      res.status(500).send('Internal server error');
  }
};



  

module.exports = {
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
