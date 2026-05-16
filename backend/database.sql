-- Script de criação do banco de dados LGPD Educa (third_branch)
-- Execute no pgAdmin ou psql conectado ao banco "lgpd-educa"

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id                 SERIAL PRIMARY KEY,
  username           VARCHAR(100) NOT NULL,
  email              VARCHAR(100) UNIQUE NOT NULL,
  password           VARCHAR(255) NOT NULL,
  is_verified        BOOLEAN DEFAULT FALSE,
  confirm_token      VARCHAR(255),
  reset_token        VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

-- Índice no email para busca rápida
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Exemplo de usuário admin já verificado (para testes)
-- Senha: admin123 (hash bcrypt)
-- INSERT INTO users (username, email, password, is_verified)
-- VALUES ('Admin', 'admin@lgpd.com', '$2a$10$...', true);
