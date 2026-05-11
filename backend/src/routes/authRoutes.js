const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Cadastro: POST /api/auth/register
router.post('/register', authController.register);

// Rota de Login: POST /api/auth/login
router.post('/login', authController.login);

// Rota de Confirmação de E-mail: GET /api/auth/confirm-email?token=abc123
router.get('/confirm-email', authController.confirmEmail);

module.exports = router;
