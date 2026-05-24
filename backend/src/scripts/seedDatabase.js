const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function seedDatabase() {
  const sqlPath = path.resolve(__dirname, '../../database.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  try {
    await pool.query(sql);
    console.log('Banco alimentado com módulos e glossário com sucesso.');
  } catch (err) {
    console.error('Erro ao alimentar o banco:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seedDatabase();
