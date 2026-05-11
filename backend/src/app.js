const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);

// Rota de Teste
app.get('/', (req, res) => {
  res.send('API LGPD-Educa rodando com sucesso!');
});

module.exports = app;
