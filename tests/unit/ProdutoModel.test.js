const ProdutoModel = require("../../src/models/ProdutoModel");
const produtoFixtures = require("../fixtures/produtoFixtures");
const TestDatabase = require("../helpers/TestDatabase");

describe("ProdutoModel", () => {
  let testDb;

  beforeAll(async () => {
    testDb = new TestDatabase();
    await testDb.setup();
  });

  afterAll(async () => {
    await testDb.teardown();
  });

  beforeEach(async () => {
    await testDb.clearTables();
  });

  describe("create", () => {
    test("deve criar produto corretamente", async () => {
      const produtoData = produtoFixtures.produtoValido;

      const resultado = await ProdutoModel.create(produtoData);

      expect(resultado).toHaveProperty("id");
      expect(resultado.nome).toBe(produtoData.nome);
      expect(resultado.preco).toBe(produtoData.preco);
      expect(resultado.categoria).toBe(produtoData.categoria);
      expect(resultado.descricao).toBe(produtoData.descricao);
    });

    test("deve gerar ID automaticamente", async () => {
      const produto1 = await ProdutoModel.create(produtoFixtures.produtoValido);
      const produto2 = await ProdutoModel.create({
        ...produtoFixtures.produtoValido,
        nome: "Produto 2",
      });

      expect(produto1.id).toBeDefined();
      expect(produto2.id).toBeDefined();
      expect(produto2.id).toBe(produto1.id + 1);
    });

    test("deve definir created_at e updated_at", async () => {
      const produto = await ProdutoModel.create(produtoFixtures.produtoValido);

      expect(produto.created_at).toBeDefined();
      expect(produto.updated_at).toBeDefined();
      expect(produto.created_at).toBe(produto.updated_at);
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      // Criar produtos de teste
      await ProdutoModel.create(produtoFixtures.produtoValido);
      await ProdutoModel.create({
        ...produtoFixtures.produtoValido,
        nome: "Produto B",
        categoria: "Categoria B",
      });
      await ProdutoModel.create({
        ...produtoFixtures.produtoValido,
        nome: "Produto C",
        categoria: "Categoria C",
      });
    });

    test("deve retornar todos os produtos sem filtros", async () => {
      const produtos = await ProdutoModel.findAll();

      expect(produtos).toHaveLength(3);
      expect(produtos[0]).toHaveProperty("id");
      expect(produtos[0]).toHaveProperty("nome");
      expect(produtos[0]).toHaveProperty("preco");
    });

    test("deve filtrar por nome", async () => {
      const produtos = await ProdutoModel.findAll({ search: "Produto B" });

      expect(produtos).toHaveLength(1);
      expect(produtos[0].nome).toBe("Produto B");
    });

    test("deve filtrar por categoria", async () => {
      const produtos = await ProdutoModel.findAll({ categoria: "Categoria B" });

      expect(produtos).toHaveLength(1);
      expect(produtos[0].categoria).toBe("Categoria B");
    });

    test("deve aplicar limite e offset", async () => {
      const produtos = await ProdutoModel.findAll({ limit: 2, offset: 1 });

      expect(produtos).toHaveLength(2);
    });
  });

  describe("findById", () => {
    let produtoId;

    beforeEach(async () => {
      const produto = await ProdutoModel.create(produtoFixtures.produtoValido);
      produtoId = produto.id;
    });

    test("deve encontrar produto por ID", async () => {
      const produto = await ProdutoModel.findById(produtoId);

      expect(produto).toBeDefined();
      expect(produto.id).toBe(produtoId);
      expect(produto.nome).toBe(produtoFixtures.produtoValido.nome);
    });

    test("deve retornar null para ID inexistente", async () => {
      const produto = await ProdutoModel.findById(999);

      expect(produto).toBeNull();
    });
  });

  describe("update", () => {
    let produtoId;

    beforeEach(async () => {
      const produto = await ProdutoModel.create(produtoFixtures.produtoValido);
      produtoId = produto.id;
    });

    test("deve atualizar produto corretamente", async () => {
      const dadosAtualizacao = produtoFixtures.dadosAtualizacao;

      const produto = await ProdutoModel.update(produtoId, dadosAtualizacao);

      expect(produto).toBeDefined();
      expect(produto.id).toBe(produtoId);
      expect(produto.nome).toBe(dadosAtualizacao.nome);
      expect(produto.preco).toBe(dadosAtualizacao.preco);
      expect(produto.updated_at).not.toBe(produto.created_at);
    });

    test("deve atualizar apenas campos fornecidos", async () => {
      const originalProduto = await ProdutoModel.findById(produtoId);

      const produto = await ProdutoModel.update(produtoId, {
        nome: "Nome Atualizado",
      });

      expect(produto.nome).toBe("Nome Atualizado");
      expect(produto.preco).toBe(originalProduto.preco); // Deve manter valor original
      expect(produto.categoria).toBe(originalProduto.categoria);
    });

    test("deve retornar null para ID inexistente", async () => {
      const produto = await ProdutoModel.update(999, { nome: "Test" });

      expect(produto).toBeNull();
    });
  });

  describe("delete", () => {
    let produtoId;

    beforeEach(async () => {
      const produto = await ProdutoModel.create(produtoFixtures.produtoValido);
      produtoId = produto.id;
    });

    test("deve deletar produto corretamente", async () => {
      const resultado = await ProdutoModel.delete(produtoId);

      expect(resultado).toBe(true);

      // Verificar se foi realmente deletado
      const produto = await ProdutoModel.findById(produtoId);
      expect(produto).toBeNull();
    });

    test("deve retornar false para ID inexistente", async () => {
      const resultado = await ProdutoModel.delete(999);

      expect(resultado).toBe(false);
    });
  });

  describe("findByCategory", () => {
    beforeEach(async () => {
      await ProdutoModel.create({
        ...produtoFixtures.produtoValido,
        categoria: "Eletrônicos",
      });
      await ProdutoModel.create({
        ...produtoFixtures.produtoValido,
        nome: "Produto 2",
        categoria: "Eletrônicos",
      });
      await ProdutoModel.create({
        ...produtoFixtures.produtoValido,
        nome: "Produto 3",
        categoria: "Roupas",
      });
    });

    test("deve encontrar produtos por categoria", async () => {
      const produtos = await ProdutoModel.findByCategory("Eletrônicos");

      expect(produtos).toHaveLength(2);
      produtos.forEach((produto) => {
        expect(produto.categoria).toBe("Eletrônicos");
      });
    });

    test("deve retornar array vazio para categoria inexistente", async () => {
      const produtos = await ProdutoModel.findByCategory(
        "Categoria Inexistente"
      );

      expect(produtos).toHaveLength(0);
    });
  });
});
