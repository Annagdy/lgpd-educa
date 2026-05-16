const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || 'pdsi_lgpd',
  database: process.env.DB_NAME     || 'lgpd-educa',
  port:     parseInt(process.env.DB_PORT) || 5432,
});

pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err);
});

module.exports = pool;
