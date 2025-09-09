const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

async function runSeed() {
  try {
    console.log("Iniciando seed do banco de dados...");

    // Conectar diretamente ao banco SQLite
    const dbPath = path.join(__dirname, "../database/database.sqlite");
    console.log("Caminho do banco:", dbPath);

    const db = new sqlite3.Database(dbPath);

    // Verificar dados existentes antes
    console.log("\n=== DADOS ANTES DO SEED ===");
    await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
        if (err) reject(err);
        else {
          console.log(`Produtos existentes: ${row.count}`);
          resolve();
        }
      });
    });

    await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM clientes", (err, row) => {
        if (err) reject(err);
        else {
          console.log(`Clientes existentes: ${row.count}`);
          resolve();
        }
      });
    });

    // Executar seed
    console.log("\n=== EXECUTANDO SEED ===");
    const seedPath = path.join(__dirname, "../database/seed-data.sql");
    console.log("Caminho do seed:", seedPath);

    const seedSQL = fs.readFileSync(seedPath, "utf8");
    console.log("Conteúdo do arquivo SQL:");
    console.log(seedSQL);
    console.log("==================");

    // Melhor processamento do SQL
    const lines = seedSQL.split("\n");
    const statements = [];
    let currentStatement = "";

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Pular linhas vazias e comentários
      if (!trimmedLine || trimmedLine.startsWith("--")) {
        continue;
      }

      currentStatement += " " + trimmedLine;

      // Se a linha termina com ';', é o fim do statement
      if (trimmedLine.endsWith(";")) {
        statements.push(currentStatement.trim().slice(0, -1)); // Remove o ';'
        currentStatement = "";
      }
    }

    console.log(`Processados ${statements.length} statements:`);
    statements.forEach((stmt, i) => {
      console.log(`${i + 1}: ${stmt.substring(0, 50)}...`);
    });

    for (const [index, statement] of statements.entries()) {
      if (statement.trim()) {
        await new Promise((resolve, reject) => {
          console.log(`\nExecutando statement ${index + 1}:`);
          console.log(statement);

          db.run(statement, function (err) {
            if (err) {
              console.error(`Erro no statement ${index + 1}:`, err.message);
              // Não rejeitar em caso de erro de UNIQUE (dados já existem)
              if (err.message.includes("UNIQUE constraint failed")) {
                console.log("Registro já existe, continuando...");
                resolve();
              } else {
                reject(err);
              }
            } else {
              console.log(
                `Statement ${index + 1}: ${this.changes} linha(s) inserida(s)`
              );
              resolve();
            }
          });
        });
      }
    }

    // Verificar dados após seed
    console.log("\n=== DADOS APÓS SEED ===");
    await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM produtos", (err, row) => {
        if (err) reject(err);
        else {
          console.log(`Total de produtos: ${row.count}`);
          resolve();
        }
      });
    });

    await new Promise((resolve, reject) => {
      db.get("SELECT COUNT(*) as count FROM clientes", (err, row) => {
        if (err) reject(err);
        else {
          console.log(`Total de clientes: ${row.count}`);
          resolve();
        }
      });
    });

    // Fechar conexão
    await new Promise((resolve, reject) => {
      db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    console.log("\n✅ Seed executado com sucesso!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  }
}

runSeed();
