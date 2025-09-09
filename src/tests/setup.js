const path = require("path");
const fs = require("fs");
const { initializeDatabase } = require("../config/database");

// Configurar ambiente de teste
process.env.NODE_ENV = "test";

// Limpar qualquer banco de teste anterior
beforeAll(async () => {
  // Inicializar banco de dados de teste
  await initializeDatabase();
});

// Limpeza após todos os testes
afterAll(async () => {
  // Limpeza final
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
