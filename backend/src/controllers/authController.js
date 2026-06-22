// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Configurar o serviço de e-mail (Transporter)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT || '2525'),
  secure: false, // Mailtrap usa STARTTLS, não TLS direto
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: {
    maxConnections: 1,
  }
});

// Rota para Registrar o Usuário
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, e-mail e senha são obrigatórios.' });
    }

    // Verifica se já existe usuário com esse e-mail
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Usuário já cadastrado com este e-mail.' });
    }

    // Criptografa a senha antes de salvar no banco
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Se SMTP não configurado, já verifica o e-mail automaticamente (ambiente local)
    const smtpConfigurado = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
    const autoVerificado = !smtpConfigurado;

    const query = `INSERT INTO users (username, email, password, is_email_verified) VALUES ($1, $2, $3, $4)`;
    await db.query(query, [name, email, hashedPassword, autoVerificado]);

    if (autoVerificado) {
      console.log(`[DEV] SMTP não configurado. Usuário ${email} verificado automaticamente.`);
      return res.status(201).json({ message: "Usuário registrado com sucesso! Você já pode fazer login." });
    }

    // Cria o token de confirmação
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET || 'fallback_secret_mude_no_render',
      { expiresIn: '24h' }
    );

    const frontendUrl = process.env.FRONTEND_URL || 'https://lgpd-educa-frontend.onrender.com';
    const confirmUrl = `${frontendUrl}/confirm-email?token=${token}`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || '"LGPD Educa" <nao-responda@seuapp.com>',
        to: email,
        subject: "Confirme sua Conta - LGPD Educa",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h3 style="color: #333;">Bem-vindo ao LGPD Educa!</h3>
            <p style="color: #666; font-size: 14px;">
              Obrigado por se registrar. Por favor, clique no link abaixo para ativar sua conta:
            </p>
            <a href="${confirmUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
              Confirmar E-mail
            </a>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Este link expira em 24 horas.
            </p>
          </div>
        `
      });
      console.log(`✅ E-mail de confirmação enviado para: ${email}`);
    } catch (mailError) {
      console.error("❌ ERRO ao enviar e-mail:", mailError.message);
      // Não bloqueia o registro mesmo se falhar o email
    }

    return res.status(201).json({ message: "Usuário registrado com sucesso! Verifique seu e-mail para ativar a conta." });
  } catch (error) {
    console.error("ERRO NO REGISTRO:", error.message);
    return res.status(500).json({ error: "Erro ao registrar usuário. Verifique os logs do servidor." });
  }
};


// Alias para compatibilidade com a rota POST /register via authController.cadastrar
exports.cadastrar = exports.register;

// Rota de Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    // Busca o usuário no banco de dados
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // Se o usuário não existir
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Compara a senha digitada com a senha criptografada do banco
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Senha incorreta." });
    }

    // Bloqueia login se e-mail não foi confirmado
    if (!user.is_email_verified) {
      return res.status(403).json({ error: "Por favor, confirme seu e-mail antes de fazer login. Verifique sua caixa de entrada." });
    }

    // Se tudo der certo, gera o token de login
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret_mude_no_render', { expiresIn: '8h' });

    return res.status(200).json({
      token: token,
      user: {
        id: user.id,
        name: user.username || user.email.split('@')[0],
        email: user.email
      }
    });

  } catch (error) {
    console.error("ERRO NO LOGIN:", error.message);
    return res.status(500).json({ error: "Erro interno ao tentar fazer login." });
  }
};

// Rota para Confirmar E-mail
exports.confirmEmail = async (req, res) => {
  try {
    // Aceita token tanto por query (?token=xxx) quanto por body ({token: xxx})
    const token = req.query.token || req.body.token;

    if (!token) {
      return res.status(400).json({ error: "Token não fornecido." });
    }

    console.log("Token recebido:", token);

    // Decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_mude_no_render');
    const email = decoded.email;

    console.log("Email decodificado:", email);

    const result = await db.query(
      'UPDATE users SET is_email_verified = true WHERE email = $1',
      [email]
    );

    console.log("Resultado da atualização:", result.rowCount);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Se for um GET direto (clique no link do email), redireciona
    if (req.method === 'GET') {
      const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${loginUrl}/login?verified=true`);
    }

    // Se for uma requisição AJAX/JSON, retorna JSON
    return res.status(200).json({ message: "E-mail verificado com sucesso!" });

  } catch (error) {
    console.error("ERRO NA CONFIRMAÇÃO:", error.message);
    
    // Se for um GET direto, redireciona para a página de erro
    if (req.method === 'GET') {
      const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${loginUrl}/login?error=token_invalido`);
    }

    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
};