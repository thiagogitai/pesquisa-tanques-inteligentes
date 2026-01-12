const db = require('../models/database');

// Obter tanques de um cliente
exports.getTanquesByCliente = (req, res) => {
  const { cliente_id } = req.params;
  
  db.all('SELECT * FROM tanques WHERE cliente_id = ? ORDER BY numero_tanque', [cliente_id], (err, rows) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao buscar tanques', detalhes: err.message });
    }
    res.json(rows);
  });
};

// Criar novo tanque
exports.createTanque = (req, res) => {
  const {
    cliente_id,
    numero_tanque,
    foto_url,
    capacidade_litros,
    condicao_plastico,
    tem_propulsora,
    propulsora_lacre,
    tem_mangueira,
    tem_pistola,
    pistola_digital_funcionando,
    tem_bacia_contencao,
    tem_lacre_seguranca,
    interesse_continuar,
    observacoes
  } = req.body;

  if (!cliente_id || !numero_tanque) {
    return res.status(400).json({ erro: 'cliente_id e numero_tanque são obrigatórios' });
  }

  const query = `
    INSERT INTO tanques (
      cliente_id, numero_tanque, foto_url, capacidade_litros, condicao_plastico,
      tem_propulsora, propulsora_lacre, tem_mangueira, tem_pistola,
      pistola_digital_funcionando, tem_bacia_contencao, tem_lacre_seguranca,
      interesse_continuar, observacoes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      cliente_id, numero_tanque, foto_url, capacidade_litros, condicao_plastico,
      tem_propulsora, propulsora_lacre, tem_mangueira, tem_pistola,
      pistola_digital_funcionando, tem_bacia_contencao, tem_lacre_seguranca,
      interesse_continuar, observacoes
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao criar tanque', detalhes: err.message });
      }
      res.status(201).json({ 
        id: this.lastID,
        cliente_id,
        numero_tanque,
        mensagem: 'Tanque criado com sucesso'
      });
    }
  );
};

// Atualizar tanque
exports.updateTanque = (req, res) => {
  const { id } = req.params;
  const {
    foto_url,
    capacidade_litros,
    condicao_plastico,
    tem_propulsora,
    propulsora_lacre,
    tem_mangueira,
    tem_pistola,
    pistola_digital_funcionando,
    tem_bacia_contencao,
    tem_lacre_seguranca,
    interesse_continuar,
    observacoes
  } = req.body;

  const query = `
    UPDATE tanques SET
      foto_url = ?, capacidade_litros = ?, condicao_plastico = ?,
      tem_propulsora = ?, propulsora_lacre = ?, tem_mangueira = ?,
      tem_pistola = ?, pistola_digital_funcionando = ?,
      tem_bacia_contencao = ?, tem_lacre_seguranca = ?,
      interesse_continuar = ?, observacoes = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      foto_url, capacidade_litros, condicao_plastico,
      tem_propulsora, propulsora_lacre, tem_mangueira,
      tem_pistola, pistola_digital_funcionando,
      tem_bacia_contencao, tem_lacre_seguranca,
      interesse_continuar, observacoes, id
    ],
    function(err) {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao atualizar tanque', detalhes: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ erro: 'Tanque não encontrado' });
      }
      res.json({ mensagem: 'Tanque atualizado com sucesso' });
    }
  );
};

// Deletar tanque
exports.deleteTanque = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tanques WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao deletar tanque', detalhes: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ erro: 'Tanque não encontrado' });
    }
    res.json({ mensagem: 'Tanque deletado com sucesso' });
  });
};
