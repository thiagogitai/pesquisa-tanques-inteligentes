const db = require('../models/database');
const crypto = require('crypto');

// Função para hash de senha (simplificada - em produção usar bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Login
exports.login = (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
  }

  db.get(
    'SELECT * FROM usuarios WHERE email = ? AND ativo = 1',
    [email],
    (err, user) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar usuário', detalhes: err.message });
      }

      if (!user) {
        return res.status(401).json({ erro: 'Email ou senha incorretos' });
      }

      const senhaHash = hashPassword(senha);
      if (user.senha !== senhaHash) {
        return res.status(401).json({ erro: 'Email ou senha incorretos' });
      }

      // Simular token JWT (em produção usar jsonwebtoken)
      const token = Buffer.from(JSON.stringify({
        id: user.id,
        email: user.email,
        tipo: user.tipo,
        nome: user.nome
      })).toString('base64');

      res.json({
        token,
        usuario: {
          id: user.id,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        }
      });
    }
  );
};

// Registrar novo vendedor
exports.registrar = (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: 'Nome, email e senha são obrigatórios' });
  }

  const senhaHash = hashPassword(senha);

  db.run(
    'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
    [nome, email, senhaHash, 'vendedor'],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ erro: 'Email já cadastrado' });
        }
        return res.status(500).json({ erro: 'Erro ao registrar usuário', detalhes: err.message });
      }

      const token = Buffer.from(JSON.stringify({
        id: this.lastID,
        email,
        tipo: 'vendedor',
        nome
      })).toString('base64');

      res.status(201).json({
        token,
        usuario: {
          id: this.lastID,
          nome,
          email,
          tipo: 'vendedor'
        }
      });
    }
  );
};

// Obter usuário atual (validar token)
exports.me = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    res.json(userData);
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido' });
  }
};

// Listar usuários (apenas admin)
exports.listarUsuarios = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (userData.tipo !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    db.all('SELECT id, nome, email, tipo, ativo FROM usuarios', (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao listar usuários', detalhes: err.message });
      }
      res.json(rows);
    });
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido' });
  }
};

// Criar novo usuário (apenas admin)
exports.criarUsuario = (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const { nome, email, senha, tipo } = req.body;

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    
    if (userData.tipo !== 'admin') {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ erro: 'Nome, email, senha e tipo são obrigatórios' });
    }

    const senhaHash = hashPassword(senha);

    db.run(
      'INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, ?)',
      [nome, email, senhaHash, tipo],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
          }
          return res.status(500).json({ erro: 'Erro ao criar usuário', detalhes: err.message });
        }

        res.status(201).json({
          id: this.lastID,
          nome,
          email,
          tipo,
          mensagem: 'Usuário criado com sucesso'
        });
      }
    );
  } catch (err) {
    res.status(401).json({ erro: 'Token inválido' });
  }
};
