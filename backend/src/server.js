require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

app.use(cors({
  origin: [
    'https://lgpd-educa-frontend.onrender.com',
    'http://localhost:5173',                    // Mantém o localhost do Vite para quando testar na máquina local
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Necessário se você lida com cookies ou sessões
}));

// Importante: Se houver uma requisição do tipo OPTIONS (Preflight), o cors já responde aqui
app.options('*', cors());

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Configuração da Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
