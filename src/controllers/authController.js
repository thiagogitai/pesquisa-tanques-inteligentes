const db = require('../models/database');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'sua-chave-secreta-super-segura';

const ADMIN_EMAIL = 'admin@evermax.com.br';

function getUserTableColumns(callback) {
  db.all("PRAGMA table_info('usuarios')", [], (err, rows) => {
    if (err) return callback(err);
    const columns = new Set((rows || []).map((r) => r.name));
    callback(null, columns);
  });
}

exports.login = (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ erro: 'Email é obrigatório' });
    }

    const emailLower = email.toLowerCase().trim();

    if (!emailLower.endsWith('@evermax.com.br')) {
      return res.status(401).json({
        erro: 'Apenas emails @evermax.com.br são permitidos'
      });
    }

    const role = emailLower === ADMIN_EMAIL ? 'admin' : 'vendedor';
    const nome = emailLower.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();

    getUserTableColumns((schemaErr, columns) => {
      if (schemaErr) {
        console.error('Erro ao ler schema de usuarios:', schemaErr);
        return res.status(500).json({ erro: 'Erro no servidor' });
      }

      const hasRole = columns.has('role');
      const hasTipo = columns.has('tipo');
      const hasSenha = columns.has('senha');
      const hasUltimoAcesso = columns.has('ultimo_acesso');
      const hasAtivo = columns.has('ativo');
      const hasDataAtualizacao = columns.has('data_atualizacao');

      const insertCols = ['nome', 'email'];
      const insertVals = [nome, emailLower];

      if (hasRole) {
        insertCols.push('role');
        insertVals.push(role);
      } else if (hasTipo) {
        insertCols.push('tipo');
        insertVals.push(role);
      }

      if (hasSenha) {
        insertCols.push('senha');
        insertVals.push('SEM_SENHA');
      }

      if (hasAtivo) {
        insertCols.push('ativo');
        insertVals.push(1);
      }

      const insertSql = `INSERT OR IGNORE INTO usuarios (${insertCols.join(', ')}) VALUES (${insertCols
        .map(() => '?')
        .join(', ')})`;

      db.run(insertSql, insertVals, (insertErr) => {
        if (insertErr) {
          console.error('Erro ao criar usuario:', insertErr);
          return res.status(500).json({ erro: 'Erro no servidor' });
        }

        const updateParts = ['nome = ?'];
        const updateVals = [nome];

        if (hasRole) {
          updateParts.push('role = ?');
          updateVals.push(role);
        } else if (hasTipo) {
          updateParts.push('tipo = ?');
          updateVals.push(role);
        }

        if (hasUltimoAcesso) updateParts.push("ultimo_acesso = datetime('now')");
        if (hasDataAtualizacao) updateParts.push('data_atualizacao = CURRENT_TIMESTAMP');

        const updateSql = `UPDATE usuarios SET ${updateParts.join(', ')} WHERE email = ?`;
        updateVals.push(emailLower);

        db.run(updateSql, updateVals, (updateErr) => {
          if (updateErr) {
            console.error('Erro ao atualizar usuario:', updateErr);
            return res.status(500).json({ erro: 'Erro no servidor' });
          }

          db.get('SELECT * FROM usuarios WHERE email = ?', [emailLower], (getErr, row) => {
            if (getErr || !row) {
              console.error('Erro ao buscar usuario:', getErr);
              return res.status(500).json({ erro: 'Erro no servidor' });
            }

            const usuarioId = row.id;
            const usuarioRole = row.role || row.tipo || role;
            const usuarioNome = row.nome || nome;

            if (!usuarioId) {
              return res.status(500).json({ erro: 'Erro no servidor' });
            }

            const token = jwt.sign(
              {
                id: usuarioId,
                email: emailLower,
                role: usuarioRole,
                nome: usuarioNome
              },
              SECRET_KEY,
              { expiresIn: '7d' }
            );

            res.json({
              success: true,
              token,
              usuario: {
                id: usuarioId,
                email: emailLower,
                role: usuarioRole,
                nome: usuarioNome
              }
            });
          });
        });
      });
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

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

exports.verificarAdmin = (req, res, next) => {
  if (req.usuario?.role !== 'admin') {
    return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

exports.logout = (req, res) => {
  res.json({ success: true, mensagem: 'Logout realizado' });
};

