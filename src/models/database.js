const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../database.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados SQLite');
    initializeDatabase();
  }
});

function initializeDatabase() {
  db.serialize(() => {
    // Tabela de clientes
    db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cod_cliente TEXT UNIQUE NOT NULL,
        nome_contato TEXT NOT NULL,
        celular_ddd TEXT NOT NULL,
        quantidade_tanques INTEGER NOT NULL,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        data_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de tanques
    db.run(`
      CREATE TABLE IF NOT EXISTS tanques (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        numero_tanque INTEGER NOT NULL,
        capacidade_litros INTEGER,
        condicao_plastico TEXT,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      )
    `);

    // Tabela de itens do tanque (cada pergunta/item com sua foto)
    db.run(`
      CREATE TABLE IF NOT EXISTS itens_tanque (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tanque_id INTEGER NOT NULL,
        tipo_item TEXT NOT NULL,
        foto_url TEXT,
        resposta_sim_nao INTEGER,
        resposta_texto TEXT,
        observacoes TEXT,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (tanque_id) REFERENCES tanques(id) ON DELETE CASCADE
      )
    `);

    console.log('Tabelas criadas/verificadas com sucesso');
  });
}

module.exports = db;
