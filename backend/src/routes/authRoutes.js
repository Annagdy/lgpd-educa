const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// GET /api/auth/confirm-email?token=xxx
router.get('/confirm-email', authController.confirmEmail);

// POST /api/auth/forgot-password
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;
