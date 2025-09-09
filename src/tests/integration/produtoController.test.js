const request = require("supertest");
const app = require("../../../app");
const { getDatabase } = require("../../config/database");
const ApiTestHelper = require("../helpers/apiTestHelper");
const produtoFixtures = require("../fixtures/produtoFixtures");

describe("ProdutoController Integration Tests", () => {
  let apiHelper;

  beforeAll(async () => {
    apiHelper = new ApiTestHelper(app);
  });

  beforeEach(async () => {
    // Limpar tabelas antes de cada teste
    const db = getDatabase();
    if (db) {
      await new Promise((resolve) => {
        db.serialize(() => {
          db.run("DELETE FROM produtos");
          db.run("DELETE FROM clientes", resolve);
        });
      });
    }
  });

  describe("POST /produtos", () => {
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
      expect(response.body.error.message).toContain("Nome");
    });

    test("deve rejeitar preço inválido", async () => {
      const produtoData = produtoFixtures.produtoPrecoInvalido;

      const response = await apiHelper.createProduto(produtoData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Preço");
    });
  });

  describe("GET /produtos", () => {
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
      const response = await request(app).get("/produtos").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.produtos).toHaveLength(2);
      expect(response.body.data.produtos[0]).toHaveProperty("id");
      expect(response.body.data.produtos[0]).toHaveProperty("nome");
    });

    test("deve filtrar produtos por busca", async () => {
      const response = await request(app)
        .get("/produtos?search=Produto B")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.produtos).toHaveLength(1);
      expect(response.body.data.produtos[0].nome).toBe("Produto B");
    });

    test("deve aplicar paginação", async () => {
      const response = await request(app)
        .get("/produtos?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.produtos).toHaveLength(1);
    });
  });

  describe("GET /produtos/:id", () => {
    let produtoId;

    beforeEach(async () => {
      const response = await apiHelper.createProduto(
        produtoFixtures.produtoValido
      );
      produtoId = response.body.data.id;
    });

    test("deve buscar produto por ID", async () => {
      const response = await request(app)
        .get(`/produtos/${produtoId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(produtoId);
      expect(response.body.data.nome).toBe(produtoFixtures.produtoValido.nome);
    });

    test("deve retornar 404 para produto inexistente", async () => {
      const response = await request(app).get("/produtos/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Produto não encontrado");
    });

    test("deve rejeitar ID inválido", async () => {
      const response = await request(app).get("/produtos/invalid").expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("ID deve ser um número");
    });
  });

  describe("PUT /produtos/:id", () => {
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
        .put(`/produtos/${produtoId}`)
        .send(dadosAtualizacao)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("atualizado com sucesso");

      // Verificar se foi realmente atualizado
      const getResponse = await request(app)
        .get(`/produtos/${produtoId}`)
        .expect(200);

      expect(getResponse.body.data.nome).toBe(dadosAtualizacao.nome);
      expect(getResponse.body.data.preco).toBe(dadosAtualizacao.preco);
    });

    test("deve rejeitar dados inválidos", async () => {
      const response = await request(app)
        .put(`/produtos/${produtoId}`)
        .send({ preco: -10 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Preço");
    });

    test("deve retornar 404 para produto inexistente", async () => {
      const response = await request(app)
        .put("/produtos/999")
        .send(produtoFixtures.dadosAtualizacao)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Produto não encontrado");
    });
  });

  describe("DELETE /produtos/:id", () => {
    let produtoId;

    beforeEach(async () => {
      const response = await apiHelper.createProduto(
        produtoFixtures.produtoValido
      );
      produtoId = response.body.data.id;
    });

    test("deve deletar produto existente", async () => {
      const response = await request(app)
        .delete(`/produtos/${produtoId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("deletado com sucesso");

      // Verificar se foi realmente deletado
      await request(app).get(`/produtos/${produtoId}`).expect(404);
    });

    test("deve retornar 404 para produto inexistente", async () => {
      const response = await request(app).delete("/produtos/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Produto não encontrado");
    });
  });
});
