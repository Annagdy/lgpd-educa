// backend/src/config/mailer.js
const nodemailer = require('nodemailer');

/**
 * Configuração do Mailtrap SMTP Transporter
 * Funciona tanto localmente quanto no Render.com
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.EMAIL_PORT || '2525'),
  secure: false, // Mailtrap usa STARTTLS (port 2525), não TLS (port 465)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: {
    maxConnections: 1,
  }
});

/**
 * Testa a conexão com o servidor SMTP
 */
async function testConnection() {
  try {
    await transporter.verify();
    console.log('✅ Conexão com Mailtrap verificada com sucesso!');
    return true;
  } catch (error) {
    console.error('❌ Erro na conexão com Mailtrap:', error.message);
    return false;
  }
}

/**
 * Envia email de confirmação
 */
async function sendConfirmationEmail(email, confirmUrl) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"LGPD Educa" <nao-responda@seuapp.com>',
      to: email,
      subject: "Confirme sua Conta - LGPD Educa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px;">
            Bem-vindo ao LGPD Educa!
          </h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Obrigado por se registrar. Para ativar sua conta, clique no botão abaixo:
          </p>
          <a href="${confirmUrl}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">
            ✓ Confirmar E-mail
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            ⏰ Este link expira em 24 horas.<br>
            Se você não criou esta conta, ignore este e-mail.
          </p>
        </div>
      `
    });
    console.log(`✅ E-mail de confirmação enviado para: ${email}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail para ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Envia email de recuperação de senha
 */
async function sendPasswordResetEmail(email, resetUrl) {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"LGPD Educa" <nao-responda@seuapp.com>',
      to: email,
      subject: "Recuperar Senha - LGPD Educa",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 3px solid #ffc107; padding-bottom: 10px;">
            Recuperar Senha
          </h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Recebemos uma solicitação para resetar sua senha. Clique no botão abaixo para criar uma nova senha:
          </p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #ffc107; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 20px 0;">
            🔐 Resetar Senha
          </a>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">
            ⏰ Este link expira em 1 hora.<br>
            Se você não solicitou esta mudança, ignore este e-mail.
          </p>
        </div>
      `
    });
    console.log(`✅ E-mail de reset de senha enviado para: ${email}`);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error(`❌ Erro ao enviar e-mail de reset para ${email}:`, error.message);
    return { success: false, error: error.message };
  }
}

module.exports = {
  transporter,
  testConnection,
  sendConfirmationEmail,
  sendPasswordResetEmail
};
