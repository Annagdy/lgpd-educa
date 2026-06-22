const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const mailer = require('../config/mailer');

// Rota de Cadastro: POST /api/auth/register
router.post('/register', authController.register);

// Rota de Login: POST /api/auth/login
router.post('/login', authController.login);

// Rota de Confirmação de E-mail: GET /api/auth/confirm-email?token=abc123 (clique direto)
// ou POST /api/auth/confirm-email (requisição AJAX)
router.get('/confirm-email', authController.confirmEmail);
router.post('/confirm-email', authController.confirmEmail);

// Rota de Teste de Email (apenas desenvolvimento)
router.post('/test-email', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Testa a conexão
    const connected = await mailer.testConnection();
    
    if (!connected) {
      return res.status(500).json({ error: 'Falha ao conectar ao Mailtrap' });
    }

    // Envia email de teste
    const result = await mailer.sendConfirmationEmail(
      email, 
      'https://seu-app.com/confirm?token=test123'
    );

    if (result.success) {
      return res.status(200).json({ 
        message: 'Email de teste enviado com sucesso!',
        messageId: result.messageId
      });
    } else {
      return res.status(500).json({ error: result.error });
    }
  } catch (error) {
    console.error('Erro ao testar email:', error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
