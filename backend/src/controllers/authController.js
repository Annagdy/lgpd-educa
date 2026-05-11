// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const db = require('../config/db');

// Configurar o serviço de e-mail (Transporter)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
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

    // Salva no banco de dados
    const query = `INSERT INTO users (username, email, password, is_email_verified) VALUES ($1, $2, $3, false)`;
    await db.query(query, [name, email, hashedPassword]);

    // Cria o token de confirmação
    const token = jwt.sign(
      { email: email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const confirmUrl = `http://localhost:5173/confirm-email?token=${token}`;

    // Tenta enviar o e-mail
    await transporter.sendMail({
      from: '"Suporte" <nao-responda@seuapp.com>',
      to: email,
      subject: "Confirme sua Conta",
      html: `<h3>Bem-vindo!</h3>
             <p>Por favor, clique no link abaixo para ativar sua conta:</p>
             <a href="${confirmUrl}">Confirmar E-mail</a>`
    });

    res.status(201).json({ message: "Usuário registrado com sucesso! Verifique seu e-mail." });
  } catch (error) {
    console.error("ERRO NO REGISTRO:", error.message);
    res.status(500).json({ error: "Erro ao registrar usuário. Verifique os logs do servidor." });
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

    // Verifica se ele confirmou o e-mail (is_email_verified)
    if (!user.is_email_verified) {
      return res.status(403).json({ error: "Por favor, confirme seu e-mail antes de fazer login." });
    }

    // Se tudo der certo, gera o token de login
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
      token: token,
      user: {
        id: user.id,
        name: user.username || user.email.split('@')[0],
        email: user.email
      }
    });

  } catch (error) {
    console.error("ERRO NO LOGIN:", error.message);
    res.status(500).json({ error: "Erro interno ao tentar fazer login." });
  }
};

// Rota para Confirmar E-mail
exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;

    console.log("Segredo usado para validar:", process.env.JWT_SECRET);
    console.log("Token recebido:", token);

    // Decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const result = await db.query(
      'UPDATE users SET is_email_verified = true WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "E-mail verificado com sucesso!" });

  } catch (error) {
    console.error("ERRO NO JWT:", error.message);
    return res.status(403).json({ error: "Token inválido ou expirado." });
  }
};