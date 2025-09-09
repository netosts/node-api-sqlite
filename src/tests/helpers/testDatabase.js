const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/**
 * Configuração de banco de dados para testes
 */
class TestDatabase {
  constructor() {
    // Usar banco em memória para testes
    this.dbPath = ":memory:";
    this.db = null;
  }

  /**
   * Configurar banco de dados para testes
   */
  async setup() {
    await this.connect();
    await this.createTables();
  }

  /**
   * Limpar e fechar conexão
   */
  async teardown() {
    await this.disconnect();
    // Banco em memória é automaticamente removido ao desconectar
  }

  /**
   * Conectar ao banco de teste
   */
  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Desconectar do banco
   */
  async disconnect() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  /**
   * Criar tabelas de teste
   */
  async createTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Criar tabela produtos
        this.db.run(
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
            if (err) reject(err);
          }
        );

        // Criar tabela clientes
        this.db.run(
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
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    });
  }

  /**
   * Limpar todas as tabelas
   */
  async clearTables() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        this.db.run("DELETE FROM produtos", (err) => {
          if (err) reject(err);
        });

        this.db.run("DELETE FROM clientes", (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  /**
   * Inserir dados de teste
   */
  async seedData() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Inserir produtos de teste
        const produtoStmt = this.db.prepare(
          "INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)"
        );
        produtoStmt.run("Produto Teste 1", 100.0, 10);
        produtoStmt.run("Produto Teste 2", 200.0, 20);
        produtoStmt.run("Produto Teste 3", 300.0, 30);
        produtoStmt.finalize();

        // Inserir clientes de teste
        const clienteStmt = this.db.prepare(
          "INSERT INTO clientes (nome, email) VALUES (?, ?)"
        );
        clienteStmt.run("Cliente Teste 1", "cliente1@teste.com");
        clienteStmt.run("Cliente Teste 2", "cliente2@teste.com");
        clienteStmt.run("Cliente Teste 3", "cliente3@teste.com");
        clienteStmt.finalize((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  /**
   * Executar query SQL personalizada
   */
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  /**
   * Obter instância do banco para uso direto
   */
  getDatabase() {
    return this.db;
  }
}

module.exports = TestDatabase;
