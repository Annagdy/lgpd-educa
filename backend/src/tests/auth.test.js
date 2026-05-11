const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Mock do Banco de Dados
jest.mock('../config/db');

describe('Testes de Autenticação', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('deve cadastrar um novo usuário com sucesso', async () => {
      // Simula que o usuário não existe
      db.query.mockResolvedValueOnce({ rows: [] });
      // Simula a inserção bem-sucedida
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'João Silva', email: 'joao@email.com' }]
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          password: 'senha123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário cadastrado com sucesso!');
      expect(response.body.user).toHaveProperty('id');
    });

    it('deve falhar se o e-mail já estiver cadastrado', async () => {
      // Simula que o usuário já existe
      db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'João Silva',
          email: 'joao@email.com',
          password: 'senha123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Usuário já cadastrado com este e-mail.');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve realizar login com sucesso', async () => {
      const hashedPassword = await bcrypt.hash('senha123', 10);
      
      // Simula que o usuário foi encontrado
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, name: 'João', email: 'joao@email.com', password: hashedPassword }]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@email.com',
          password: 'senha123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.message).toBe('Login realizado com sucesso!');
    });

    it('deve falhar com senha incorreta', async () => {
      const hashedPassword = await bcrypt.hash('senha123', 10);
      
      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: 'joao@email.com', password: hashedPassword }]
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@email.com',
          password: 'senha_errada'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Credenciais inválidas.');
    });
  });
});
