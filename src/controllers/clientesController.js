const db = require('../models/database');

// Função auxiliar para validar token
function validarToken(req) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    throw { status: 401, erro: 'Token não fornecido' };
  }
  try {
    return JSON.parse(Buffer.from(token, 'base64').toString());
  } catch (err) {
    throw { status: 401, erro: 'Token inválido' };
  }
}

// Obter todos os clientes (vendedor vê apenas seus, admin vê todos)
exports.getAllClientes = (req, res) => {
  try {
    const userData = validarToken(req);
    
    let query = 'SELECT * FROM clientes';
    let params = [];
    
    // Vendedor vê apenas seus clientes
    if (userData.tipo === 'vendedor') {
      query += ' WHERE usuario_id = ?';
      params.push(userData.id);
    }
    
    query += ' ORDER BY data_criacao DESC';
    
    db.all(query, params, (err, rows) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar clientes', detalhes: err.message });
      }
      res.json(rows);
    });
  } catch (err) {
    res.status(err.status || 500).json({ erro: err.erro || 'Erro desconhecido' });
  }
};

// Obter cliente por ID
exports.getClienteById = (req, res) => {
  try {
    const userData = validarToken(req);
    const { id } = req.params;
    
    db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao buscar cliente', detalhes: err.message });
      }
      if (!row) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }
      
      // Vendedor só pode ver seus próprios clientes
      if (userData.tipo === 'vendedor' && row.usuario_id !== userData.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }
      
      res.json(row);
    });
  } catch (err) {
    res.status(err.status || 500).json({ erro: err.erro || 'Erro desconhecido' });
  }
};

// Criar novo cliente
exports.createCliente = (req, res) => {
  try {
    const userData = validarToken(req);
    const { cod_cliente, nome_contato, celular_ddd, quantidade_tanques } = req.body;

    if (!cod_cliente || !nome_contato || !celular_ddd || !quantidade_tanques) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const query = `
      INSERT INTO clientes (usuario_id, cod_cliente, nome_contato, celular_ddd, quantidade_tanques)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      query,
      [userData.id, cod_cliente, nome_contato, celular_ddd, quantidade_tanques],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ erro: 'Código de cliente já existe para este vendedor' });
          }
          return res.status(500).json({ erro: 'Erro ao criar cliente', detalhes: err.message });
        }
        res.status(201).json({ 
          id: this.lastID, 
          usuario_id: userData.id,
          cod_cliente, 
          nome_contato, 
          celular_ddd, 
          quantidade_tanques 
        });
      }
    );
  } catch (err) {
    res.status(err.status || 500).json({ erro: err.erro || 'Erro desconhecido' });
  }
};

// Atualizar cliente
exports.updateCliente = (req, res) => {
  try {
    const userData = validarToken(req);
    const { id } = req.params;
    const { nome_contato, celular_ddd, quantidade_tanques } = req.body;

    // Verificar se o cliente pertence ao usuário
    db.get('SELECT usuario_id FROM clientes WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao verificar cliente', detalhes: err.message });
      }
      
      if (!row) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      // Vendedor só pode atualizar seus próprios clientes
      if (userData.tipo === 'vendedor' && row.usuario_id !== userData.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      const query = `
        UPDATE clientes 
        SET nome_contato = ?, celular_ddd = ?, quantidade_tanques = ?, data_atualizacao = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.run(query, [nome_contato, celular_ddd, quantidade_tanques, id], function(err) {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao atualizar cliente', detalhes: err.message });
        }
        res.json({ mensagem: 'Cliente atualizado com sucesso' });
      });
    });
  } catch (err) {
    res.status(err.status || 500).json({ erro: err.erro || 'Erro desconhecido' });
  }
};

// Deletar cliente
exports.deleteCliente = (req, res) => {
  try {
    const userData = validarToken(req);
    const { id } = req.params;

    // Verificar se o cliente pertence ao usuário
    db.get('SELECT usuario_id FROM clientes WHERE id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao verificar cliente', detalhes: err.message });
      }
      
      if (!row) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      // Vendedor só pode deletar seus próprios clientes
      if (userData.tipo === 'vendedor' && row.usuario_id !== userData.id) {
        return res.status(403).json({ erro: 'Acesso negado' });
      }

      db.run('DELETE FROM clientes WHERE id = ?', [id], function(err) {
        if (err) {
          return res.status(500).json({ erro: 'Erro ao deletar cliente', detalhes: err.message });
        }
        res.json({ mensagem: 'Cliente deletado com sucesso' });
      });
    });
  } catch (err) {
    res.status(err.status || 500).json({ erro: err.erro || 'Erro desconhecido' });
  }
};
