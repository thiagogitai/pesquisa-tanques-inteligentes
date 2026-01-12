const db = require('../models/database');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura';

// Email do admin (pode ser alterado conforme necessário)
const ADMIN_EMAIL = 'admin@evermax.com.br';

// Login com email (sem senha) - aceita qualquer email @evermax.com.br
exports.login = (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ erro: 'Email é obrigatório' });
    }

    const emailLower = email.toLowerCase().trim();

    // Validar domínio @evermax.com.br
    if (!emailLower.endsWith('@evermax.com.br')) {
      return res.status(401).json({ 
        erro: 'Apenas emails @evermax.com.br são permitidos' 
      });
    }

    // Determinar role baseado no email
    const role = emailLower === ADMIN_EMAIL ? 'admin' : 'vendedor';
    const nome = emailLower.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();

    // Gerar token JWT
    const token = jwt.sign(
      { 
        email: emailLower, 
        role: role,
        nome: nome
      },
      SECRET_KEY,
      { expiresIn: '7d' }
    );

    // Salvar/atualizar usuário no banco (criar se não existir)
    db.run(
      `INSERT OR REPLACE INTO usuarios (email, role, nome, ultimo_acesso) 
       VALUES (?, ?, ?, datetime('now'))`,
      [emailLower, role, nome],
      (err) => {
        if (err) console.error('Erro ao salvar usuário:', err);
      }
    );

    res.json({
      success: true,
      token,
      usuario: {
        email: emailLower,
        role: role,
        nome: nome
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
