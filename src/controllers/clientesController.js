const db = require('../models/database');

// Obter todos os clientes
exports.getAllClientes = (req, res) => {
  db.all('SELECT * FROM clientes ORDER BY data_criacao DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar clientes', detalhes: err.message });
    }
    res.json(rows);
  });
};

// Obter cliente por ID
exports.getClienteById = (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar cliente', detalhes: err.message });
    }
    if (!row) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json(row);
  });
};

// Criar novo cliente
exports.createCliente = (req, res) => {
  const { cod_cliente, nome_contato, celular_ddd, quantidade_tanques } = req.body;

  if (!cod_cliente || !nome_contato || !celular_ddd || !quantidade_tanques) {
    return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
  }

  const query = `
    INSERT INTO clientes (cod_cliente, nome_contato, celular_ddd, quantidade_tanques)
    VALUES (?, ?, ?, ?)
  `;

  db.run(query, [cod_cliente, nome_contato, celular_ddd, quantidade_tanques], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ erro: 'Código de cliente já existe' });
      }
      return res.status(500).json({ erro: 'Erro ao criar cliente', detalhes: err.message });
    }
    res.status(201).json({ 
      id: this.lastID, 
      cod_cliente, 
      nome_contato, 
      celular_ddd, 
      quantidade_tanques 
    });
  });
};

// Atualizar cliente
exports.updateCliente = (req, res) => {
  const { id } = req.params;
  const { nome_contato, celular_ddd, quantidade_tanques } = req.body;

  const query = `
    UPDATE clientes 
    SET nome_contato = ?, celular_ddd = ?, quantidade_tanques = ?, data_atualizacao = CURRENT_TIMESTAMP
    WHERE id = ?
  `;

  db.run(query, [nome_contato, celular_ddd, quantidade_tanques, id], function(err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao atualizar cliente', detalhes: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json({ mensagem: 'Cliente atualizado com sucesso' });
  });
};

// Deletar cliente
exports.deleteCliente = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM clientes WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao deletar cliente', detalhes: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Cliente não encontrado' });
    }
    res.json({ mensagem: 'Cliente deletado com sucesso' });
  });
};
