const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho para o arquivo do banco de dados
let dbPath;
let db;

if (process.env.NODE_ENV === "test") {
  // Para testes, usar banco em memória
  dbPath = ":memory:";
} else {
  dbPath = path.join(__dirname, "../../database", "database.sqlite");
}

// Função para criar conexão
const createConnection = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error("Erro ao conectar com o banco de dados:", err.message);
        reject(err);
      } else {
        if (process.env.NODE_ENV !== "test") {
          console.log("Conectado ao banco de dados SQLite.");
        }
        resolve();
      }
    });
  });
};

// Função para inicializar as tabelas
const initializeDatabase = async () => {
  if (!db) {
    await createConnection();
  }

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
            if (process.env.NODE_ENV !== "test") {
              console.log("Tabela produtos criada/verificada com sucesso.");
            }
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
            if (process.env.NODE_ENV !== "test") {
              console.log("Tabela clientes criada/verificada com sucesso.");
            }
            resolve();
          }
        }
      );
    });
  });
};

// Função para obter a instância do banco
const getDatabase = () => {
  return db;
};

module.exports = {
  db: () => db,
  initializeDatabase,
  getDatabase,
  createConnection,
};
