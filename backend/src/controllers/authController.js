const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../config/database');

// ─── Mailer Setup ──────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT) || 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Helpers ───────────────────────────────────────────────────────
const generateToken = (payload, expiresIn = '7d') =>
  jwt.sign(payload, process.env.JWT_SECRET || 'lgpd_secret_dev', { expiresIn });

const sendConfirmationEmail = async (email, username, token) => {
  const confirmUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/confirm-email?token=${token}`;
  await transporter.sendMail({
    from: '"LGPD Educa" <noreply@lgpd-educa.com>',
    to: email,
    subject: 'Confirme seu e-mail — LGPD Educa',
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #aa3bff;">LGPD Educa</h2>
        <h3>Bem-vindo, ${username}!</h3>
        <p style="color: #555;">Por favor, clique no botão abaixo para ativar sua conta:</p>
        <a href="${confirmUrl}" style="
          display: inline-block;
          background: linear-gradient(135deg, #aa3bff, #9333ea);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          margin: 16px 0;
        ">Confirmar E-mail</a>
        <p style="color: #999; font-size: 13px;">
          Se você não criou uma conta, ignore este e-mail.<br>
          Link válido por 24 horas.
        </p>
      </div>
    `,
  });
};

// ─── Controllers ───────────────────────────────────────────────────

/**
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  try {
    // Check if email already exists
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'E-mail já cadastrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (username, email, password, is_verified)
       VALUES ($1, $2, $3, true)
       RETURNING id, username, email`,
      [username, email, hashedPassword]
    );

    return res.status(201).json({
      message: 'Conta criada com sucesso.',
      user: result.rows[0],
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha e-mail e senha.' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return res.json({
      message: 'Login realizado com sucesso.',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * GET /api/auth/confirm-email?token=xxx
 */
exports.confirmEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token inválido.' });
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE confirm_token = $1',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Token inválido ou já utilizado.' });
    }

    await pool.query(
      'UPDATE users SET is_verified = true, confirm_token = null WHERE confirm_token = $1',
      [token]
    );

    return res.json({ message: 'E-mail confirmado com sucesso! Você já pode fazer login.' });
  } catch (err) {
    console.error('Erro na confirmação de e-mail:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

/**
 * POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Informe o e-mail.' });
  }

  try {
    const result = await pool.query('SELECT id, username FROM users WHERE email = $1', [email]);

    // Always return success to prevent email enumeration
    if (result.rows.length === 0) {
      return res.json({ message: 'Se esse e-mail existir, você receberá as instruções em breve.' });
    }

    const { username } = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
      [resetToken, expiresAt, email]
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: '"LGPD Educa" <noreply@lgpd-educa.com>',
      to: email,
      subject: 'Recuperação de senha — LGPD Educa',
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #aa3bff;">LGPD Educa</h2>
          <h3>Olá, ${username}!</h3>
          <p style="color: #555;">Clique no botão abaixo para redefinir sua senha:</p>
          <a href="${resetUrl}" style="
            display: inline-block;
            background: linear-gradient(135deg, #aa3bff, #9333ea);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            margin: 16px 0;
          ">Redefinir Senha</a>
          <p style="color: #999; font-size: 13px;">Link válido por 1 hora.</p>
        </div>
      `,
    }).catch(err => console.error('Erro ao enviar e-mail de recuperação:', err));

    return res.json({ message: 'Se esse e-mail existir, você receberá as instruções em breve.' });
  } catch (err) {
    console.error('Erro no forgot-password:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
