/**
 * Dados de teste para produtos
 */
const produtoFixtures = {
  // Produto válido
  produtoValido: {
    nome: "Produto Teste",
    preco: 99.99,
    estoque: 50,
  },

  // Produto válido alternativo
  produtoValido2: {
    nome: "Outro Produto",
    preco: 199.99,
    estoque: 25,
  },

  // Produto sem nome
  produtoSemNome: {
    nome: "",
    preco: 99.99,
    estoque: 50,
  },

  // Produto sem preço
  produtoSemPreco: {
    nome: "Produto Teste",
    estoque: 50,
  },

  // Produto com preço negativo
  produtoPrecoNegativo: {
    nome: "Produto Teste",
    preco: -10,
    estoque: 50,
  },

  // Produto com preço zero
  produtoPrecoZero: {
    nome: "Produto Teste",
    preco: 0,
    estoque: 50,
  },

  // Produto com estoque negativo
  produtoEstoqueNegativo: {
    nome: "Produto Teste",
    preco: 99.99,
    estoque: -5,
  },

  // Produto com dados inválidos
  produtoDadosInvalidos: {
    nome: 123,
    preco: "abc",
    estoque: "xyz",
  },

  // Produto com nome muito longo
  produtoNomeLongo: {
    nome: "A".repeat(1000),
    preco: 99.99,
    estoque: 50,
  },

  // Dados para atualização
  dadosAtualizacao: {
    nome: "Produto Atualizado",
    preco: 149.99,
    estoque: 75,
  },
};

module.exports = produtoFixtures;
