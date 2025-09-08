const request = require("supertest");
const app = require("../../../app");
const TestDatabase = require("../helpers/TestDatabase");
const ApiTestHelper = require("../helpers/ApiTestHelper");
const clienteFixtures = require("../fixtures/clienteFixtures");

describe("ClienteController Integration Tests", () => {
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

  describe("POST /api/clientes", () => {
    test("deve criar cliente com dados válidos", async () => {
      const clienteData = clienteFixtures.clienteValido;

      const response = await apiHelper.createCliente(clienteData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.nome).toBe(clienteData.nome);
      expect(response.body.data.email).toBe(clienteData.email);
    });

    test("deve rejeitar cliente sem nome", async () => {
      const clienteData = clienteFixtures.clienteSemNome;

      const response = await apiHelper.createCliente(clienteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Nome do cliente é obrigatório");
    });

    test("deve rejeitar email inválido", async () => {
      const clienteData = clienteFixtures.clienteEmailInvalido;

      const response = await apiHelper.createCliente(clienteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("formato válido");
    });

    test("deve converter email para lowercase", async () => {
      const clienteData = {
        nome: "Cliente Teste",
        email: "CLIENTE@TESTE.COM",
      };

      const response = await apiHelper.createCliente(clienteData);

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe("cliente@teste.com");
    });
  });

  describe("GET /api/clientes", () => {
    beforeEach(async () => {
      // Criar clientes de teste
      await apiHelper.createCliente(clienteFixtures.clienteValido);
      await apiHelper.createCliente({
        nome: "João Silva",
        email: "joao@teste.com",
      });
    });

    test("deve listar todos os clientes", async () => {
      const response = await request(app).get("/api/clientes").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty("id");
      expect(response.body.data[0]).toHaveProperty("nome");
      expect(response.body.data[0]).toHaveProperty("email");
    });

    test("deve filtrar clientes por busca", async () => {
      const response = await request(app)
        .get("/api/clientes?search=João")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].nome).toBe("João Silva");
    });

    test("deve aplicar paginação", async () => {
      const response = await request(app)
        .get("/api/clientes?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe("GET /api/clientes/:id", () => {
    let clienteId;

    beforeEach(async () => {
      const response = await apiHelper.createCliente(
        clienteFixtures.clienteValido
      );
      clienteId = response.body.data.id;
    });

    test("deve buscar cliente por ID", async () => {
      const response = await request(app)
        .get(`/api/clientes/${clienteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(clienteId);
      expect(response.body.data.nome).toBe(clienteFixtures.clienteValido.nome);
    });

    test("deve retornar 404 para cliente inexistente", async () => {
      const response = await request(app).get("/api/clientes/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Cliente não encontrado");
    });

    test("deve rejeitar ID inválido", async () => {
      const response = await request(app)
        .get("/api/clientes/invalid")
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("ID deve ser um número válido");
    });
  });

  describe("PUT /api/clientes/:id", () => {
    let clienteId;

    beforeEach(async () => {
      const response = await apiHelper.createCliente(
        clienteFixtures.clienteValido
      );
      clienteId = response.body.data.id;
    });

    test("deve atualizar cliente com dados válidos", async () => {
      const dadosAtualizacao = clienteFixtures.dadosAtualizacao;

      const response = await request(app)
        .put(`/api/clientes/${clienteId}`)
        .send(dadosAtualizacao)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(clienteId);
      expect(response.body.data.nome).toBe(dadosAtualizacao.nome);
      expect(response.body.data.email).toBe(dadosAtualizacao.email);
    });

    test("deve rejeitar dados inválidos", async () => {
      const response = await request(app)
        .put(`/api/clientes/${clienteId}`)
        .send({ email: "email-invalido" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("formato válido");
    });

    test("deve retornar 404 para cliente inexistente", async () => {
      const response = await request(app)
        .put("/api/clientes/999")
        .send(clienteFixtures.dadosAtualizacao)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Cliente não encontrado");
    });
  });

  describe("DELETE /api/clientes/:id", () => {
    let clienteId;

    beforeEach(async () => {
      const response = await apiHelper.createCliente(
        clienteFixtures.clienteValido
      );
      clienteId = response.body.data.id;
    });

    test("deve deletar cliente existente", async () => {
      const response = await request(app)
        .delete(`/api/clientes/${clienteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("deletado com sucesso");

      // Verificar se foi realmente deletado
      await request(app).get(`/api/clientes/${clienteId}`).expect(404);
    });

    test("deve retornar 404 para cliente inexistente", async () => {
      const response = await request(app)
        .delete("/api/clientes/999")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Cliente não encontrado");
    });
  });

  describe("POST /api/clientes/email", () => {
    beforeEach(async () => {
      await apiHelper.createCliente(clienteFixtures.clienteValido);
    });

    test("deve buscar cliente por email", async () => {
      const response = await request(app)
        .post("/api/clientes/email")
        .send({ email: clienteFixtures.clienteValido.email })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(
        clienteFixtures.clienteValido.email
      );
      expect(response.body.data.nome).toBe(clienteFixtures.clienteValido.nome);
    });

    test("deve retornar 404 para email inexistente", async () => {
      const response = await request(app)
        .post("/api/clientes/email")
        .send({ email: "inexistente@teste.com" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("Cliente não encontrado");
    });

    test("deve rejeitar email inválido", async () => {
      const response = await request(app)
        .post("/api/clientes/email")
        .send({ email: "email-invalido" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain("formato válido");
    });
  });

  describe("validação de email único", () => {
    test("deve rejeitar email duplicado", async () => {
      // Criar primeiro cliente
      await apiHelper.createCliente(clienteFixtures.clienteValido);

      // Tentar criar segundo cliente com mesmo email
      const response = await apiHelper.createCliente({
        nome: "Cliente Duplicado",
        email: clienteFixtures.clienteValido.email,
      });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});
