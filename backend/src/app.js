const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

// Middlewares
app.use(cors({
  origin: [
    'https://lgpd-educa-frontend.onrender.com', // Substitua exatamente pela URL do seu frontend no Render
    'http://localhost:5173',                    // Mantém o localhost do Vite para quando você testar na sua máquina
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Necessário se você lida com cookies ou sessões
}));

// Importante: Se houver uma requisição do tipo OPTIONS (Preflight), o cors já responde aqui
app.options('*', cors());

app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Rota de Teste
app.get('/', (req, res) => {
  res.send('API LGPD-Educa rodando com sucesso!');
});

const PORT = process.env.PORT || 3000; // Ele vai usar a porta que o Render mandar, ou 5000 localmente

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
