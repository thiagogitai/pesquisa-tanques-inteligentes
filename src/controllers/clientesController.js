const db = require('../models/database');

function getUsuario(req, res) {
  const usuario = req.usuario;
  if (!usuario) {
    res.status(401).json({ erro: 'Token não fornecido' });
    return null;
  }
  if (!usuario.id) {
    res.status(401).json({ erro: 'Sessão inválida. Faça login novamente.' });
    return null;
  }
  return usuario;
}

exports.getAllClientes = (req, res) => {
  const usuario = getUsuario(req, res);
  if (!usuario) return;

  let query = 'SELECT * FROM clientes';
  const params = [];

  if (usuario.role === 'vendedor') {
    query += ' WHERE usuario_id = ?';
    params.push(usuario.id);
  }

  query += ' ORDER BY data_criacao DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar clientes', detalhes: err.message });
    }
    res.json(rows);
  });
};

exports.getClienteById = (req, res) => {
  const usuario = getUsuario(req, res);
  if (!usuario) return;

  const { id } = req.params;

  db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar cliente', detalhes: err.message });
    }
    if (!row) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }

    if (usuario.role === 'vendedor' && row.usuario_id !== usuario.id) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }

    res.json(row);
  });
};

exports.createCliente = (req, res) => {
  const usuario = getUsuario(req, res);
  if (!usuario) return;

  const { cod_cliente, nome_contato, celular_ddd, quantidade_tanques } = req.body;

  if (!cod_cliente || !nome_contato || !celular_ddd || !quantidade_tanques) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  const query = `
    INSERT INTO clientes (usuario_id, cod_cliente, nome_contato, celular_ddd, quantidade_tanques)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [usuario.id, cod_cliente, nome_contato, celular_ddd, quantidade_tanques], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ erro: 'Código de cliente já existe para este vendedor' });
      }
      return res.status(500).json({ erro: 'Erro ao criar cliente', detalhes: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      usuario_id: usuario.id,
      cod_cliente,
      nome_contato,
      celular_ddd,
      quantidade_tanques
    });
  });
};

exports.updateCliente = (req, res) => {
  const { id } = req.params;
  const { nome_contato, celular_ddd, quantidade_tanques } = req.body;

  const query = `
    UPDATE clientes
    SET nome_contato = ?, celular_ddd = ?, quantidade_tanques = ?, data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [nome_contato, celular_ddd, quantidade_tanques, id], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar cliente', detalhes: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json({ mensagem: 'Cliente atualizado com sucesso' });
  });
};

exports.deleteCliente = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM clientes WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao deletar cliente', detalhes: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  });
};

