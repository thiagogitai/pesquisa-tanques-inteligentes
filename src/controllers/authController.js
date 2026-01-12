const db = require('../models/database');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura';

// Vendedores e admins pré-configurados
const USUARIOS = {
  'admin@evermax.com.br': { role: 'admin', nome: 'Administrador' },
  'vendedor1@evermax.com.br': { role: 'vendedor', nome: 'Vendedor 1' },
  'vendedor2@evermax.com.br': { role: 'vendedor', nome: 'Vendedor 2' },
};

// Login com email (sem senha)
exports.login = (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ erro: 'Email é obrigatório' });
    }

    const emailLower = email.toLowerCase().trim();
    const usuario = USUARIOS[emailLower];

    if (!usuario) {
      return res.status(401).json({ 
        erro: 'Email não autorizado. Contate o administrador.' 
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        email: emailLower, 
        role: usuario.role,
        nome: usuario.nome
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Salvar/atualizar usuário no banco
    db.run(
      `INSERT OR REPLACE INTO usuarios (email, role, nome, ultimo_acesso) 
       VALUES (?, ?, ?, datetime('now'))`,
      [emailLower, usuario.role, usuario.nome],
      (err) => {
        if (err) console.error('Erro ao salvar usuário:', err);
      }
    );

    res.json({
      success: true,
      token,
      usuario: {
        email: emailLower,
        role: usuario.role,
        nome: usuario.nome
      }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// Verificar token
exports.verificarToken = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ usuario: decoded });
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar autenticação
exports.autenticar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar se é admin
exports.verificarAdmin = (req, res, next) => {
  if (req.usuario?.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

// Logout
exports.logout = (req, res) => {
  res.json({ success: true, mensagem: 'Logout realizado' });
};
