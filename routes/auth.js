const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const User = require('../models/User');
const Task = require('../models/Task');

// Authentication middleware to protect routes
const requireAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Authentication routes
router.get('/', authController.showLoginPage);
router.get('/register', authController.showRegisterPage);
router.post('/register', authController.handleRegistration);
router.get('/login', authController.showLoginPage);
router.post('/login', authController.handleLogin);

// Admin routes
router.get('/admin', requireAuth, authController.showAdminPage);
router.get('/manageusers', requireAuth, authController.handleManageUser);

// Task creation and management routes
router.get('/create-task', requireAuth, authController.createTask);
router.post('/create-task', requireAuth, authController.postCreateTask);

// User dashboard route
router.get('/user', requireAuth, authController.UserDashboard);

// User task status update routes
router.get('/tasks/:id/edit', requireAuth, authController.taskStatusUpdate);
router.post('/tasks/:id/update', requireAuth, authController.posttaskUpdate);

// Admin task management routes
router.get('/utasks/:id/edit', requireAuth, authController.adminTaskUpdate);
router.post('/utasks/:id/update', requireAuth, authController.postAdminTaskUpdate);
router.delete('/utasks/:id', requireAuth, authController.adminDeleteTask);

// Admin role management routes
router.post('/make-admin', authController.makeAdmin);
router.post('/demote-admin', authController.demotAdmin);

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/login'); // Redirect to login page after logout
    });
});

module.exports = router;
