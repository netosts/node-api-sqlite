/**
 * Dados de teste para clientes
 */
const clienteFixtures = {
  // Cliente válido
  clienteValido: {
    nome: "Cliente Teste",
    email: "cliente@teste.com",
  },

  // Cliente válido alternativo
  clienteValido2: {
    nome: "Outro Cliente",
    email: "outro@teste.com",
  },

  // Cliente sem nome
  clienteSemNome: {
    nome: "",
    email: "cliente@teste.com",
  },

  // Cliente sem email
  clienteSemEmail: {
    nome: "Cliente Teste",
  },

  // Cliente com email inválido
  clienteEmailInvalido: {
    nome: "Cliente Teste",
    email: "email-invalido",
  },

  // Cliente com email sem @
  clienteEmailSemArroba: {
    nome: "Cliente Teste",
    email: "emailsemarroba.com",
  },

  // Cliente com email sem domínio
  clienteEmailSemDominio: {
    nome: "Cliente Teste",
    email: "email@",
  },

  // Cliente com dados inválidos
  clienteDadosInvalidos: {
    nome: 123,
    email: 456,
  },

  // Cliente com nome muito longo
  clienteNomeLongo: {
    nome: "A".repeat(1000),
    email: "cliente@teste.com",
  },

  // Cliente com email muito longo
  clienteEmailLongo: {
    nome: "Cliente Teste",
    email: "a".repeat(240) + "@teste.com",
  },

  // Dados para atualização
  dadosAtualizacao: {
    nome: "Cliente Atualizado",
    email: "atualizado@teste.com",
  },

  // Email duplicado para testes
  emailDuplicado: "duplicado@teste.com",
};

module.exports = clienteFixtures;
