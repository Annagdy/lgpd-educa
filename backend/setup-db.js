#!/usr/bin/env node
/**
 * Script para inicializar o banco de dados PostgreSQL
 * Uso: node setup-db.js
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres', // Conectar ao banco padrão primeiro
  port: parseInt(process.env.DB_PORT || '5432'),
};

const targetDB = process.env.DB_NAME || 'lgpd_educa';

console.log('🔧 Inicializando banco de dados...\n');
console.log('📋 Configuração:');
console.log(`   Host: ${config.host}`);
console.log(`   User: ${config.user}`);
console.log(`   Database: ${targetDB}`);
console.log(`   Port: ${config.port}\n`);

async function setupDatabase() {
  const client = new Client(config);

  try {
    console.log('⏳ Conectando ao PostgreSQL (banco padrão)...');
    await client.connect();
    console.log('✅ Conectado com sucesso!\n');

    console.log(`⏳ Criando banco de dados "${targetDB}" se não existir...`);
    try {
      await client.query(`CREATE DATABASE ${targetDB};`);
      console.log(`✅ Banco de dados "${targetDB}" criado!\n`);
    } catch (err) {
      if (err.code === '42P04') {
        // 42P04 = banco já existe
        console.log(`✅ Banco de dados "${targetDB}" já existe!\n`);
      } else {
        throw err;
      }
    }

    await client.end();

    // 2. Conectar ao banco criado
    console.log(`⏳ Conectando ao banco de dados "${targetDB}"...`);
    config.database = targetDB;
    const mainClient = new Client(config);
    await mainClient.connect();
    console.log(`✅ Conectado ao banco "${targetDB}"!\n`);

    // 3. Ler e executar o arquivo SQL
    const sqlPath = path.join(__dirname, 'database', 'CREATE.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Executando scripts SQL...');
    await mainClient.query(sql);
    console.log('✅ Banco de dados inicializado com sucesso!\n');

    // 4. Verificar tabelas criadas
    console.log('📊 Verificando tabelas criadas...');
    const result = await mainClient.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    if (result.rows.length === 0) {
      console.log('⚠️  Nenhuma tabela foi criada!');
    } else {
      console.log('✅ Tabelas criadas:');
      result.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
    }

    await mainClient.end();

  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

setupDatabase().then(() => {
  console.log('\n✨ Processo finalizado!');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
