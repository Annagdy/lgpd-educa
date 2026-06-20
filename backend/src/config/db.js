const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

let query;

if (process.env.NODE_ENV === 'test' || process.env.DB_MOCK === 'true') {
  const usersMock = [];

  query = async (text, params = []) => {
    if (text.includes('SELECT * FROM users WHERE email = $1')) {
      const user = usersMock.find((item) => item.email === params[0]);
      return { rows: user ? [user] : [] };
    }

    if (text.includes('INSERT INTO users')) {
      const newUser = {
        id: usersMock.length + 1,
        username: params[0],
        email: params[1],
        password: params[2],
        is_email_verified: params[3],
      };
      usersMock.push(newUser);
      return { rows: [newUser], rowCount: 1 };
    }

    if (text.includes('UPDATE users SET is_email_verified = true')) {
      const userIndex = usersMock.findIndex((item) => item.email === params[0]);
      if (userIndex !== -1) {
        usersMock[userIndex].is_email_verified = true;
      }
      return { rows: [], rowCount: userIndex !== -1 ? 1 : 0 };
    }

    return { rows: [], rowCount: 0 };
  };
} else {
 const isRemote = (process.env.DATABASE_URL || '').includes('render.com') ||
                  (process.env.DATABASE_URL || '').includes('neon.tech') ||
                  (process.env.DATABASE_URL || '').includes('supabase');

 const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isRemote ? { rejectUnauthorized: false } : false,
});

  pool.on('error', (err) => {
    console.error('Erro inesperado no cliente do banco de dados', err);
  });

  query = (text, params) => pool.query(text, params);
}

module.exports = { query };
