const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const testRoutes = require('./routes/testRoutes'); // APENAS DESENVOLVIMENTO

const app = express();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/test', testRoutes); // APENAS DESENVOLVIMENTO

// Rota de Teste
app.get('/', (req, res) => {
  res.send('API LGPD-Educa rodando com sucesso!');
});

const PORT = process.env.PORT || 3000; // Ele vai usar a porta que o Render mandar, ou 5000 localmente

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
