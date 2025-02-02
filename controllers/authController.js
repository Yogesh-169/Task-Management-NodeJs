// const bcrypt = require('bcryptjs');
const User = require('../models/User');
// const saltRounds = process.env.SALT_ROUNDS || 10;

// Show the registration page
const showRegisterPage = (req, res) => {
  res.render('register');
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


  

module.exports = {
  showRegisterPage,
  handleRegistration,
  showLoginPage,
  handleLogin,
};
