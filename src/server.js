const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./models/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api', apiRoutes);

// Servir arquivo HTML principal para todas as rotas (SPA)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/formulario-tanques.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/formulario-tanques.html'));
});

app.get('/detalhes-cliente.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/detalhes-cliente.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({ 
    erro: 'Erro interno do servidor', 
    detalhes: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

module.exports = app;
