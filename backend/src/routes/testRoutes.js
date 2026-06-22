// backend/src/routes/testRoutes.js (OPCIONAL - apenas para debug)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mailer = require('../config/mailer');

/**
 * Rota de teste para gerar um token de confirmação válido
 * Uso: GET /api/test/generate-token?email=seu-email@gmail.com
 * 
 * ⚠️ REMOVA ESTA ROTA EM PRODUÇÃO!
 */
router.get('/generate-token', (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET || 'fallback_secret_mude_no_render',
      { expiresIn: '24h' }
    );

    const confirmUrl = `http://localhost:3000/api/auth/confirm-email?token=${token}`;

    return res.status(200).json({
      email,
      token,
      confirmUrl,
      message: 'Token gerado com sucesso! Clique no link acima para confirmar.'
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
