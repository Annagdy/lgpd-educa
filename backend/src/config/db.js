const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

console.log('🕵️ --- DIAGNÓSTICO DO DOTENV ---');
console.log('Caminho procurado:', path.resolve(__dirname, '../.env'));
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD foi carregada?:', process.env.DB_PASSWORD ? '✅ SIM!' : '❌ NÃO! (Continua undefined)');
console.log('-------------------------------');

let query;

if (process.env.NODE_ENV === 'test' || process.env.DB_MOCK === 'true') {
  // Modo Mock (Em memória)
  console.log('⚠️ Utilizando Base de Dados em MEMÓRIA (Modo Mock)');
  
  const usersMock = []; 
  
  query = async (text, params) => {
    // Simula o SELECT (Usado no Login)
    if (text.includes('SELECT * FROM users WHERE email = $1')) {
      const user = usersMock.find(u => u.email === params[0]);
      return { rows: user ? [user] : [] };
    }
    
    // Simula o INSERT (Usado no Registo)
    if (text.includes('INSERT INTO users')) {
      const newUser = {
        id: usersMock.length + 1,
        username: params[0],
        email: params[1],
        password: params[2],
        is_email_verified: params[3] // Salva o status de verificação
      };
      usersMock.push(newUser);
      return { rows: [newUser] };
    }

    // Simula o UPDATE (Usado na Confirmação de E-mail)
    if (text.includes('UPDATE users SET is_email_verified = true')) {
      const userIndex = usersMock.findIndex(u => u.email === params[0]);
      if (userIndex !== -1) {
        usersMock[userIndex].is_email_verified = true;
      }
      return { rows: [] };
    }

    return { rows: [] };
  };
} else {
  // Modo Real (PostgreSQL)
  console.log('✅ Utilizando Base de Dados PostgreSQL (Modo Real)');
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  });

  pool.on('error', (err) => {
    console.error('Erro inesperado no cliente da base de dados', err);
  });

  query = (text, params) => pool.query(text, params);
}

module.exports = { query };