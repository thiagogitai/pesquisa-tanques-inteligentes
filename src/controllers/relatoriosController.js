const db = require('../models/database');

// Obter todos os clientes com seus tanques e itens (apenas para admin)
exports.getAllClientesComDetalhes = (req, res) => {
  try {
    db.all(
      `SELECT 
        c.id, c.cod_cliente, c.nome_contato, c.celular_ddd, 
        c.quantidade_tanques, c.usuario_email, c.latitude, c.longitude, 
        c.criado_em,
        t.id as tanque_id, t.numero_tanque, t.capacidade, t.condicao_plastico,
        t.latitude as tanque_lat, t.longitude as tanque_lng,
        i.id as item_id, i.tipo_item, i.resposta, i.tem_foto, i.foto_url
       FROM clientes c
       LEFT JOIN tanques t ON c.id = t.cliente_id
       LEFT JOIN itens i ON t.id = i.tanque_id
       ORDER BY c.criado_em DESC, t.numero_tanque ASC`,
      [],
      (err, rows) => {
        if (err) {
          console.error('Erro ao buscar clientes:', err);
          return res.status(500).json({ erro: 'Erro ao buscar dados' });
        }

        // Agrupar dados hierarquicamente
        const clientesMap = {};
        rows.forEach(row => {
          if (!clientesMap[row.id]) {
            clientesMap[row.id] = {
              id: row.id,
              cod_cliente: row.cod_cliente,
              nome_contato: row.nome_contato,
              celular_ddd: row.celular_ddd,
              quantidade_tanques: row.quantidade_tanques,
              usuario_email: row.usuario_email,
              latitude: row.latitude,
              longitude: row.longitude,
              criado_em: row.criado_em,
              tanques: {}
            };
          }

          if (row.tanque_id && !clientesMap[row.id].tanques[row.tanque_id]) {
            clientesMap[row.id].tanques[row.tanque_id] = {
              id: row.tanque_id,
              numero_tanque: row.numero_tanque,
              capacidade: row.capacidade,
              condicao_plastico: row.condicao_plastico,
              latitude: row.tanque_lat,
              longitude: row.tanque_lng,
              itens: []
            };
          }

          if (row.item_id) {
            clientesMap[row.id].tanques[row.tanque_id].itens.push({
              id: row.item_id,
              tipo_item: row.tipo_item,
              resposta: row.resposta,
              tem_foto: row.tem_foto,
              foto_url: row.foto_url
            });
          }
        });

        // Converter para array e limpar tanques vazios
        const clientes = Object.values(clientesMap).map(cliente => ({
          ...cliente,
          tanques: Object.values(cliente.tanques)
        }));

        res.json(clientes);
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// Obter apenas clientes com coordenadas para mapa
exports.getClientesParaMapa = (req, res) => {
  try {
    db.all(
      `SELECT 
        c.id, c.cod_cliente, c.nome_contato, c.celular_ddd, 
        c.quantidade_tanques, c.usuario_email, c.latitude, c.longitude, 
        c.criado_em,
        COUNT(t.id) as total_tanques
       FROM clientes c
       LEFT JOIN tanques t ON c.id = t.cliente_id
       WHERE c.latitude IS NOT NULL AND c.longitude IS NOT NULL
       GROUP BY c.id
       ORDER BY c.criado_em DESC`,
      [],
      (err, rows) => {
        if (err) {
          console.error('Erro ao buscar clientes para mapa:', err);
          return res.status(500).json({ erro: 'Erro ao buscar dados' });
        }
        res.json(rows || []);
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// Obter estatísticas gerais
exports.getEstatisticas = (req, res) => {
  try {
    db.all(
      `SELECT 
        COUNT(DISTINCT c.id) as total_clientes,
        COUNT(DISTINCT t.id) as total_tanques,
        COUNT(DISTINCT c.usuario_email) as total_vendedores,
        SUM(CASE WHEN t.capacidade = '400' THEN 1 ELSE 0 END) as tanques_400l,
        SUM(CASE WHEN t.capacidade = '1000' THEN 1 ELSE 0 END) as tanques_1000l
       FROM clientes c
       LEFT JOIN tanques t ON c.id = t.cliente_id`,
      [],
      (err, rows) => {
        if (err) {
          console.error('Erro ao buscar estatísticas:', err);
          return res.status(500).json({ erro: 'Erro ao buscar dados' });
        }
        res.json(rows[0] || {});
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// Obter dados por vendedor
exports.getDadosPorVendedor = (req, res) => {
  try {
    db.all(
      `SELECT 
        c.usuario_email,
        COUNT(DISTINCT c.id) as total_clientes,
        COUNT(DISTINCT t.id) as total_tanques
       FROM clientes c
       LEFT JOIN tanques t ON c.id = t.cliente_id
       GROUP BY c.usuario_email
       ORDER BY total_clientes DESC`,
      [],
      (err, rows) => {
        if (err) {
          console.error('Erro ao buscar dados por vendedor:', err);
          return res.status(500).json({ erro: 'Erro ao buscar dados' });
        }
        res.json(rows || []);
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};

// Obter cliente específico com todos os detalhes
exports.getClienteDetalhado = (req, res) => {
  try {
    const { id } = req.params;

    db.get(
      `SELECT * FROM clientes WHERE id = ?`,
      [id],
      (err, cliente) => {
        if (err || !cliente) {
          return res.status(404).json({ erro: 'Cliente não encontrado' });
        }

        db.all(
          `SELECT 
            t.id, t.numero_tanque, t.capacidade, t.condicao_plastico,
            t.latitude, t.longitude, t.criado_em,
            i.id as item_id, i.tipo_item, i.resposta, i.tem_foto, i.foto_url
           FROM tanques t
           LEFT JOIN itens i ON t.id = i.tanque_id
           WHERE t.cliente_id = ?
           ORDER BY t.numero_tanque ASC`,
          [id],
          (err, rows) => {
            if (err) {
              return res.status(500).json({ erro: 'Erro ao buscar tanques' });
            }

            // Agrupar itens por tanque
            const tanquesMap = {};
            rows.forEach(row => {
              if (!tanquesMap[row.id]) {
                tanquesMap[row.id] = {
                  id: row.id,
                  numero_tanque: row.numero_tanque,
                  capacidade: row.capacidade,
                  condicao_plastico: row.condicao_plastico,
                  latitude: row.latitude,
                  longitude: row.longitude,
                  criado_em: row.criado_em,
                  itens: []
                };
              }

              if (row.item_id) {
                tanquesMap[row.id].itens.push({
                  id: row.item_id,
                  tipo_item: row.tipo_item,
                  resposta: row.resposta,
                  tem_foto: row.tem_foto,
                  foto_url: row.foto_url
                });
              }
            });

            res.json({
              ...cliente,
              tanques: Object.values(tanquesMap)
            });
          }
        );
      }
    );
  } catch (err) {
    console.error('Erro:', err);
    res.status(500).json({ erro: 'Erro no servidor' });
  }
};
