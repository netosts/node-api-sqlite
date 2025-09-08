const request = require("supertest");
const app = require("../../../app");
const TestDatabase = require("../helpers/TestDatabase");
const ApiTestHelper = require("../helpers/ApiTestHelper");
const produtoFixtures = require("../fixtures/produtoFixtures");

describe("ProdutoController Integration Tests", () => {
  let testDb;
  let apiHelper;

  beforeAll(async () => {
    testDb = new TestDatabase();
    apiHelper = new ApiTestHelper(app);
    await testDb.setup();
  });

  afterAll(async () => {
    await testDb.teardown();
  });

  beforeEach(async () => {
    await testDb.clearTables();
  });

  describe("POST /api/produtos", () => {
    test("deve criar produto com dados válidos", async () => {
      const produtoData = produtoFixtures.produtoValido;

      const response = await apiHelper.createProduto(produtoData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.nome).toBe(produtoData.nome);
      expect(response.body.data.preco).toBe(produtoData.preco);
    });

    test("deve rejeitar produto sem nome", async () => {
      const produtoData = produtoFixtures.produtoSemNome;

      const response = await apiHelper.createProduto(produtoData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Nome do produto é obrigatório");
    });

    test("deve rejeitar preço inválido", async () => {
      const produtoData = produtoFixtures.produtoPrecoInvalido;

      const response = await apiHelper.createProduto(produtoData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        "Preço deve ser um número positivo"
      );
    });
  });

  describe("GET /api/produtos", () => {
    beforeEach(async () => {
      // Criar produtos de teste
      await apiHelper.createProduto(produtoFixtures.produtoValido);
      await apiHelper.createProduto({
        ...produtoFixtures.produtoValido,
        nome: "Produto B",
        categoria: "Categoria B",
      });
    });

    test("deve listar todos os produtos", async () => {
      const response = await request(app).get("/api/produtos").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty("id");
      expect(response.body.data[0]).toHaveProperty("nome");
    });

    test("deve filtrar produtos por busca", async () => {
      const response = await request(app)
        .get("/api/produtos?search=Produto B")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toBe("Produto B");
    });

    test("deve aplicar paginação", async () => {
      const response = await request(app)
        .get("/api/produtos?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe("GET /api/produtos/:id", () => {
    let produtoId;

    beforeEach(async () => {
      const response = await apiHelper.createProduto(
        produtoFixtures.produtoValido
      );
      produtoId = response.body.data.id;
    });

    test("deve buscar produto por ID", async () => {
      const response = await request(app)
        .get(`/api/produtos/${produtoId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(produtoId);
      expect(response.body.data.nome).toBe(produtoFixtures.produtoValido.nome);
    });

    test("deve retornar 404 para produto inexistente", async () => {
      const response = await request(app).get("/api/produtos/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Produto não encontrado");
    });

    test("deve rejeitar ID inválido", async () => {
      const response = await request(app)
        .get("/api/produtos/invalid")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("ID deve ser um número válido");
    });
  });

  describe("PUT /api/produtos/:id", () => {
    let produtoId;

    beforeEach(async () => {
      const response = await apiHelper.createProduto(
        produtoFixtures.produtoValido
      );
      produtoId = response.body.data.id;
    });

    test("deve atualizar produto com dados válidos", async () => {
      const dadosAtualizacao = produtoFixtures.dadosAtualizacao;

      const response = await request(app)
        .put(`/api/produtos/${produtoId}`)
        .send(dadosAtualizacao)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(produtoId);
      expect(response.body.data.nome).toBe(dadosAtualizacao.nome);
      expect(response.body.data.preco).toBe(dadosAtualizacao.preco);
    });

    test("deve rejeitar dados inválidos", async () => {
      const response = await request(app)
        .put(`/api/produtos/${produtoId}`)
        .send({ preco: -10 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain(
        "Preço deve ser um número positivo"
      );
    });

    test("deve retornar 404 para produto inexistente", async () => {
      const response = await request(app)
        .put("/api/produtos/999")
        .send(produtoFixtures.dadosAtualizacao)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Produto não encontrado");
    });
  });

  describe("DELETE /api/produtos/:id", () => {
    let produtoId;

    beforeEach(async () => {
      const response = await apiHelper.createProduto(
        produtoFixtures.produtoValido
      );
      produtoId = response.body.data.id;
    });

    test("deve deletar produto existente", async () => {
      const response = await request(app)
        .delete(`/api/produtos/${produtoId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("deletado com sucesso");

      // Verificar se foi realmente deletado
      await request(app).get(`/api/produtos/${produtoId}`).expect(404);
    });

    test("deve retornar 404 para produto inexistente", async () => {
      const response = await request(app)
        .delete("/api/produtos/999")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Produto não encontrado");
    });
  });

  describe("GET /api/produtos/categoria/:categoria", () => {
    beforeEach(async () => {
      await apiHelper.createProduto({
        ...produtoFixtures.produtoValido,
        categoria: "Eletrônicos",
      });
      await apiHelper.createProduto({
        ...produtoFixtures.produtoValido,
        nome: "Produto 2",
        categoria: "Eletrônicos",
      });
      await apiHelper.createProduto({
        ...produtoFixtures.produtoValido,
        nome: "Produto 3",
        categoria: "Roupas",
      });
    });

    test("deve buscar produtos por categoria", async () => {
      const response = await request(app)
        .get("/api/produtos/categoria/Eletrônicos")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((produto) => {
        expect(produto.categoria).toBe("Eletrônicos");
      });
    });

    test("deve retornar array vazio para categoria inexistente", async () => {
      const response = await request(app)
        .get("/api/produtos/categoria/CategoriaInexistente")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
    });
  });
});
