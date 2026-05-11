const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rota de Cadastro: POST /api/auth/register
router.post('/register', authController.cadastrar);

// Rota de Login: POST /api/auth/login
router.post('/login', authController.login);

module.exports = router;
