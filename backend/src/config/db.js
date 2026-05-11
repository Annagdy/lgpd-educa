const { Pool } = require('pg');
require('dotenv').config();

let query;

if (process.env.NODE_ENV === 'test' || process.env.DB_MOCK === 'true') {
  // Modo Mock (Em memória) para testes ou demonstração sem PostgreSQL
  console.log('⚠️ Utilizando Banco de Dados em MEMÓRIA (Modo Mock)');
  const users = [];
  
  query = async (text, params) => {
    if (text.includes('SELECT * FROM usuarios WHERE email = $1')) {
      const user = users.find(u => u.email === params[0]);
      return { rows: user ? [user] : [] };
    }
    if (text.includes('INSERT INTO usuarios')) {
      const newUser = {
        id: users.length + 1,
        name: params[0],
        email: params[1],
        password: params[2]
      };
      users.push(newUser);
      return { rows: [newUser] };
    }
    return { rows: [] };
  };
} else {
  // Modo Real (PostgreSQL)
  const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432,
  });

  pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do banco de dados', err);
  });

  query = (text, params) => pool.query(text, params);
}

module.exports = { query };
