const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./models/database');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

function normalizeBasePath(input) {
  const raw = String(input || '').trim();
  if (!raw || raw === '/') return '';
  const withLeading = raw.startsWith('/') ? raw : `/${raw}`;
  return withLeading.replace(/\/+$/, '');
}

const BASE_PATH = normalizeBasePath(process.env.BASE_PATH);
const routePath = (p) => (BASE_PATH ? `${BASE_PATH}${p}` : p);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos estáticos
app.use(routePath('/'), express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use(routePath('/api'), apiRoutes);

// Servir arquivo HTML principal para todas as rotas (SPA)
app.get(routePath('/'), (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get(routePath('/formulario-tanques.html'), (req, res) => {
  res.sendFile(path.join(__dirname, '../public/formulario-tanques.html'));
});

app.get(routePath('/detalhes-cliente.html'), (req, res) => {
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
  const baseInfo = BASE_PATH || '/';
  console.log(`Servidor rodando em http://localhost:${PORT}${baseInfo}`);
});

module.exports = app;
