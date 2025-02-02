const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const Task = require('../models/Task');

// Add authentication middleware
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Registration routes
router.get('/register', authController.showRegisterPage);
router.post('/register', authController.handleRegistration);

// Login routes
router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

// Admin routes with authentication check
// router.get('/admin', requireAuth, async (req, res) => {
//     try {
//         if (req.session.user.role !== 'admin') {
//             return res.status(403).send('Forbidden');
//         }
//         const users = await User.find();
//         const tasks = await Task.find().populate('assignedTo');
//         res.render('admin/admin', { users, tasks });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// });

router.get('/admin',requireAuth,authController.showAdminPage);

// Manage tasks route
// router.get('/manageusers', requireAuth, async (req, res) => {
//   try {
//     // Check if the user is an admin
//     if (req.session.user.role !== 'admin') {
//       return res.status(403).send('Forbidden');
//     }

//     // Fetch all tasks with assigned user details
//     const tasks = await Task.find().populate('assignedTo');
//     res.render('admin/manageuser', { tasks });
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).send('Internal server error');
//   }
// });

router.get('/manageusers', requireAuth,authController.handleManageUser);

// Task creation routes
// router.get('/create-task', requireAuth, async (req, res) => {
//     try {
//         const users = await User.find({ role: 'user' });
//         res.render('admin/createtask', { users });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// });
router.get('/create-task', requireAuth,authController.createTask);

// router.post('/create-task', requireAuth, async (req, res) => {
//     try {
//         const { taskName, taskDescription, assignedTo } = req.body;
//         const newTask = new Task({
//             name: taskName,
//             description: taskDescription,
//             assignedTo,
//             status: 'pending',
//             createdBy: req.session.user._id
//         });
//         await newTask.save();
//         res.redirect('/admin');
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// });

router.post('/create-task', requireAuth,authController.postCreateTask);

// User dashboard route
// router.get('/user', requireAuth, async (req, res) => {
//     try {
//         const tasks = await Task.find({ assignedTo: req.session.user._id });
//         res.render('user/user', { 
//             user: req.session.user,
//             tasks 
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// });

router.get('/user', requireAuth, authController.UserDashboard);

// Task status update routes
// router.get('/tasks/:id/edit', requireAuth, async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);
//         if (!task) {
//             return res.status(404).send('Task not found');
//         }
//         res.render('user/edit-task', { task });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// });

router.get('/tasks/:id/edit', requireAuth,authController.taskStatusUpdate);

// router.post('/tasks/:id/update', requireAuth, async (req, res) => {
//     try {
//         const task = await Task.findByIdAndUpdate(
//             req.params.id,
//             { status: req.body.status },
//             { new: true }
//         );
//         if (!task) {
//             return res.status(404).send('Task not found');
//         }
//         res.redirect('/user');
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).send('Internal server error');
//     }
// });

router.post('/tasks/:id/update', requireAuth,authController.posttaskUpdate);


// Task status update routes
// router.get('/utasks/:id/edit', requireAuth, async (req, res) => {
//   try {
//       const task = await Task.findById(req.params.id);
//       if (!task) {
//           return res.status(404).send('Task not found');
//       }
//       res.render('admin/edit-task', { task });
//   } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send('Internal server error');
//   }
// });
router.get('/utasks/:id/edit', requireAuth,authController.adminTaskUpdate);

// router.post('/utasks/:id/update', requireAuth, async (req, res) => {
//   try {
//       // Make sure to handle all fields in req.body (name, description, status, etc.)
//       const task = await Task.findByIdAndUpdate(
//         req.params.id,
//         {
//           name: req.body.name,
//           description: req.body.description,
//           status: req.body.status,  // Update other fields as needed
//         },
//         { new: true, runValidators: true } 
//       );
      
//       if (!task) {
//           return res.status(404).send('Task not found');
//       }
      
//       res.redirect('/admin'); // Or wherever you want to redirect after successful update
//   } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send('Internal server error');
//   }
// });
router.post('/utasks/:id/update', requireAuth, authController.postAdminTaskUpdate);


// router.delete('/utasks/:id', requireAuth, async (req, res) => {
//   try {
//       const task = await Task.findByIdAndDelete(req.params.id);
//       if (!task) {
//           return res.status(404).send('Task not found');
//       }
//       res.redirect('/admin'); // Redirect after deletion to the appropriate page
//   } catch (error) {
//       console.error('Error:', error);
//       res.status(500).send('Internal server error');
//   }
// });

router.delete('/utasks/:id', requireAuth, authController.adminDeleteTask);





module.exports = router;