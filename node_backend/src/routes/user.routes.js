const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Protected route to get all users
router.get('/', authMiddleware.authenticate, userController.getAllUsers);

// 🧩 NEW: Delete user by ID
router.delete('/:id', authMiddleware.authenticate, userController.deleteUser);

// 🧩 New route: Update user role
router.patch('/:id/role', authMiddleware.authenticate, userController.updateUserRole);

module.exports = router;