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
        foto_url TEXT,
        capacidade_litros INTEGER,
        condicao_plastico TEXT,
        tem_propulsora INTEGER,
        propulsora_lacre INTEGER,
        tem_mangueira INTEGER,
        tem_pistola INTEGER,
        pistola_digital_funcionando INTEGER,
        tem_bacia_contencao INTEGER,
        tem_lacre_seguranca INTEGER,
        interesse_continuar INTEGER,
        observacoes TEXT,
        data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
      )
    `);

    console.log('Tabelas criadas/verificadas com sucesso');
  });
}

module.exports = db;
