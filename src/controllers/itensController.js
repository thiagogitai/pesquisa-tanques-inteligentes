const db = require('../models/database');

// Obter itens de um tanque
exports.getItensByTanque = (req, res) => {
  const { tanque_id } = req.params;
  
  db.all('SELECT * FROM itens_tanque WHERE tanque_id = ? ORDER BY id', [tanque_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar itens', detalhes: err.message });
    }
    res.json(rows);
  });
};

// Criar novo item
exports.createItem = (req, res) => {
  const {
    tanque_id,
    tipo_item,
    foto_url,
    resposta_sim_nao,
    resposta_texto,
    observacoes
  } = req.body;

  if (!tanque_id || !tipo_item) {
    return res.status(400).json({ erro: 'tanque_id e tipo_item são obrigatórios' });
  }

  const query = `
    INSERT INTO itens_tanque (
      tanque_id, tipo_item, foto_url, resposta_sim_nao, resposta_texto, observacoes
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [tanque_id, tipo_item, foto_url, resposta_sim_nao, resposta_texto, observacoes],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao criar item', detalhes: err.message });
      }
      res.status(201).json({ 
        id: this.lastID,
        tanque_id,
        tipo_item,
        mensagem: 'Item criado com sucesso'
      });
    }
  );
};

// Atualizar item
exports.updateItem = (req, res) => {
  const { id } = req.params;
  const {
    foto_url,
    resposta_sim_nao,
    resposta_texto,
    observacoes
  } = req.body;

  const query = `
    UPDATE itens_tanque SET
      foto_url = ?, resposta_sim_nao = ?, resposta_texto = ?, observacoes = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [foto_url, resposta_sim_nao, resposta_texto, observacoes, id],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao atualizar item', detalhes: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Item não encontrado' });
      }
      res.json({ mensagem: 'Item atualizado com sucesso' });
    }
  );
};

// Deletar item
exports.deleteItem = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM itens_tanque WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao deletar item', detalhes: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Item não encontrado' });
    }
    res.json({ mensagem: 'Item deletado com sucesso' });
  });
};
