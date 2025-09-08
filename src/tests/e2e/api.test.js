const request = require("supertest");
const app = require("../../../app");
const TestDatabase = require("../helpers/TestDatabase");
const ApiTestHelper = require("../helpers/ApiTestHelper");
const produtoFixtures = require("../fixtures/produtoFixtures");
const clienteFixtures = require("../fixtures/clienteFixtures");

describe("API End-to-End Tests", () => {
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

  describe("Fluxo completo de produtos", () => {
    test("deve realizar CRUD completo de produtos", async () => {
      // 1. Criar produto
      const createResponse = await apiHelper.createProduto(
        produtoFixtures.produtoValido
      );
      expect(createResponse.status).toBe(201);

      const produtoId = createResponse.body.data.id;
      expect(produtoId).toBeDefined();

      // 2. Buscar produto criado
      const getResponse = await request(app)
        .get(`/api/produtos/${produtoId}`)
        .expect(200);

      expect(getResponse.body.data.nome).toBe(
        produtoFixtures.produtoValido.nome
      );

      // 3. Atualizar produto
      const updateData = produtoFixtures.dadosAtualizacao;
      const updateResponse = await request(app)
        .put(`/api/produtos/${produtoId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.data.nome).toBe(updateData.nome);
      expect(updateResponse.body.data.preco).toBe(updateData.preco);

      // 4. Verificar na listagem
      const listResponse = await request(app).get("/api/produtos").expect(200);

      expect(listResponse.body.data).toHaveLength(1);
      expect(listResponse.body.data[0].nome).toBe(updateData.nome);

      // 5. Deletar produto
      await request(app).delete(`/api/produtos/${produtoId}`).expect(200);

      // 6. Verificar que foi deletado
      await request(app).get(`/api/produtos/${produtoId}`).expect(404);
    });
  });

  describe("Fluxo completo de clientes", () => {
    test("deve realizar CRUD completo de clientes", async () => {
      // 1. Criar cliente
      const createResponse = await apiHelper.createCliente(
        clienteFixtures.clienteValido
      );
      expect(createResponse.status).toBe(201);

      const clienteId = createResponse.body.data.id;
      expect(clienteId).toBeDefined();

      // 2. Buscar cliente criado
      const getResponse = await request(app)
        .get(`/api/clientes/${clienteId}`)
        .expect(200);

      expect(getResponse.body.data.nome).toBe(
        clienteFixtures.clienteValido.nome
      );

      // 3. Buscar por email
      const emailResponse = await request(app)
        .post("/api/clientes/email")
        .send({ email: clienteFixtures.clienteValido.email })
        .expect(200);

      expect(emailResponse.body.data.id).toBe(clienteId);

      // 4. Atualizar cliente
      const updateData = clienteFixtures.dadosAtualizacao;
      const updateResponse = await request(app)
        .put(`/api/clientes/${clienteId}`)
        .send(updateData)
        .expect(200);

      expect(updateResponse.body.data.nome).toBe(updateData.nome);
      expect(updateResponse.body.data.email).toBe(updateData.email);

      // 5. Verificar na listagem
      const listResponse = await request(app).get("/api/clientes").expect(200);

      expect(listResponse.body.data).toHaveLength(1);
      expect(listResponse.body.data[0].nome).toBe(updateData.nome);

      // 6. Deletar cliente
      await request(app).delete(`/api/clientes/${clienteId}`).expect(200);

      // 7. Verificar que foi deletado
      await request(app).get(`/api/clientes/${clienteId}`).expect(404);
    });
  });

  describe("Cenários de busca e filtros", () => {
    beforeEach(async () => {
      // Criar dados de teste
      await apiHelper.createProduto({
        ...produtoFixtures.produtoValido,
        nome: "Smartphone Samsung",
        categoria: "Eletrônicos",
        preco: 1200.0,
      });

      await apiHelper.createProduto({
        ...produtoFixtures.produtoValido,
        nome: "Notebook Dell",
        categoria: "Eletrônicos",
        preco: 2500.0,
      });

      await apiHelper.createProduto({
        ...produtoFixtures.produtoValido,
        nome: "Camiseta Nike",
        categoria: "Roupas",
        preco: 89.9,
      });

      await apiHelper.createCliente({
        nome: "João Silva",
        email: "joao@teste.com",
      });

      await apiHelper.createCliente({
        nome: "Maria Santos",
        email: "maria@teste.com",
      });
    });

    test("deve filtrar produtos por categoria", async () => {
      const response = await request(app)
        .get("/api/produtos/categoria/Eletrônicos")
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      response.body.data.forEach((produto) => {
        expect(produto.categoria).toBe("Eletrônicos");
      });
    });

    test("deve buscar produtos por nome", async () => {
      const response = await request(app)
        .get("/api/produtos?search=Samsung")
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toContain("Samsung");
    });

    test("deve buscar clientes por nome", async () => {
      const response = await request(app)
        .get("/api/clientes?search=João")
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toBe("João Silva");
    });

    test("deve aplicar paginação corretamente", async () => {
      // Buscar primeira página
      const page1 = await request(app)
        .get("/api/produtos?page=1&limit=2")
        .expect(200);

      expect(page1.body.data).toHaveLength(2);

      // Buscar segunda página
      const page2 = await request(app)
        .get("/api/produtos?page=2&limit=2")
        .expect(200);

      expect(page2.body.data).toHaveLength(1);

      // Verificar que são produtos diferentes
      const ids1 = page1.body.data.map((p) => p.id);
      const ids2 = page2.body.data.map((p) => p.id);
      expect(ids1).not.toEqual(expect.arrayContaining(ids2));
    });
  });

  describe("Tratamento de erros", () => {
    test("deve retornar 404 para rotas inexistentes", async () => {
      const response = await request(app).get("/api/inexistente").expect(404);

      expect(response.body.success).toBe(false);
    });

    test("deve validar dados de entrada", async () => {
      // Produto inválido
      const produtoResponse = await request(app)
        .post("/api/produtos")
        .send({ nome: "", preco: "invalid" })
        .expect(400);

      expect(produtoResponse.body.success).toBe(false);

      // Cliente inválido
      const clienteResponse = await request(app)
        .post("/api/clientes")
        .send({ nome: "", email: "invalid-email" })
        .expect(400);

      expect(clienteResponse.body.success).toBe(false);
    });

    test("deve tratar IDs inválidos", async () => {
      await request(app).get("/api/produtos/invalid-id").expect(400);

      await request(app).get("/api/clientes/invalid-id").expect(400);
    });
  });

  describe("Validação de integridade de dados", () => {
    test("deve manter consistência após operações múltiplas", async () => {
      // Criar múltiplos produtos
      const produtos = [];
      for (let i = 1; i <= 5; i++) {
        const response = await apiHelper.createProduto({
          ...produtoFixtures.produtoValido,
          nome: `Produto ${i}`,
        });
        produtos.push(response.body.data);
      }

      // Verificar que todos foram criados
      const listResponse = await request(app).get("/api/produtos").expect(200);

      expect(listResponse.body.data).toHaveLength(5);

      // Deletar alguns produtos
      await request(app).delete(`/api/produtos/${produtos[0].id}`).expect(200);
      await request(app).delete(`/api/produtos/${produtos[2].id}`).expect(200);

      // Verificar contagem final
      const finalResponse = await request(app).get("/api/produtos").expect(200);

      expect(finalResponse.body.data).toHaveLength(3);
    });

    test("deve preservar dados após atualizações", async () => {
      const createResponse = await apiHelper.createProduto(
        produtoFixtures.produtoValido
      );
      const produtoId = createResponse.body.data.id;
      const originalCreatedAt = createResponse.body.data.created_at;

      // Aguardar um pouco para diferença de timestamp
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Atualizar produto
      await request(app)
        .put(`/api/produtos/${produtoId}`)
        .send({ nome: "Nome Atualizado" })
        .expect(200);

      // Verificar que created_at permaneceu igual e updated_at mudou
      const getResponse = await request(app)
        .get(`/api/produtos/${produtoId}`)
        .expect(200);

      expect(getResponse.body.data.created_at).toBe(originalCreatedAt);
      expect(getResponse.body.data.updated_at).not.toBe(originalCreatedAt);
      expect(getResponse.body.data.nome).toBe("Nome Atualizado");
    });
  });
});
