const path = require("path");
const fs = require("fs");

// Configurar ambiente de teste
process.env.NODE_ENV = "test";

// Configurar banco de dados de teste
const testDbPath = path.join(__dirname, "test-database.sqlite");

// Limpar banco de teste antes de cada suíte de testes
beforeAll(async () => {
  // Remover banco de teste se existir
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

// Limpar banco de teste após todos os testes
afterAll(async () => {
  // Remover banco de teste
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

// Configurações globais para testes
global.console = {
  ...console,
  // Suprimir logs durante testes (exceto erros)
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: console.error,
};
