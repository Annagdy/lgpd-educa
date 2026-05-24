require('dotenv').config();
const { Client } = require('pg');

async function createDatabase() {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'pdsi_lgpd',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: 'postgres',
  });

  try {
    await client.connect();
    await client.query('CREATE DATABASE "lgpd-educa"');
    console.log('Banco lgpd-educa criado com sucesso.');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Banco lgpd-educa já existe.');
      return;
    }

    console.error('Erro ao criar banco:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

createDatabase();
