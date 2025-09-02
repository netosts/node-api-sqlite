const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho para o arquivo do banco de dados
const dbPath = path.join(__dirname, "../../database", "database.sqlite");

// Criar conexão com o banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar com o banco de dados:", err.message);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

// Função para inicializar as tabelas
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Criar tabela produtos
      db.run(
        `
        CREATE TABLE IF NOT EXISTS produtos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          preco REAL NOT NULL,
          estoque INTEGER NOT NULL DEFAULT 0,
          data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            console.error("Erro ao criar tabela produtos:", err.message);
            reject(err);
          } else {
            console.log("Tabela produtos criada/verificada com sucesso.");
          }
        }
      );

      // Criar tabela clientes
      db.run(
        `
        CREATE TABLE IF NOT EXISTS clientes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `,
        (err) => {
          if (err) {
            console.error("Erro ao criar tabela clientes:", err.message);
            reject(err);
          } else {
            console.log("Tabela clientes criada/verificada com sucesso.");
            resolve();
          }
        }
      );
    });
  });
};

module.exports = {
  db,
  initializeDatabase,
};
