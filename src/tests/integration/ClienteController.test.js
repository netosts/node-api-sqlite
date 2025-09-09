const request = require("supertest");
const app = require("../../../app");
const { getDatabase } = require("../../config/database");
const ApiTestHelper = require("../helpers/ApiTestHelper");
const clienteFixtures = require("../fixtures/clienteFixtures");

describe("ClienteController Integration Tests", () => {
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

  describe("POST /clientes", () => {
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
      expect(response.body.error.message).toContain("Nome");
    });

    test("deve rejeitar email inválido", async () => {
      const clienteData = clienteFixtures.clienteEmailInvalido;

      const response = await apiHelper.createCliente(clienteData);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("formato válido");
    });

    test("deve manter email como fornecido", async () => {
      const clienteData = {
        nome: "Cliente Teste",
        email: "CLIENTE@TESTE.COM",
      };

      const response = await apiHelper.createCliente(clienteData);

      expect(response.status).toBe(201);
      expect(response.body.data.email).toBe("CLIENTE@TESTE.COM");
    });
  });

  describe("GET /clientes", () => {
    beforeEach(async () => {
      // Criar clientes de teste
      await apiHelper.createCliente(clienteFixtures.clienteValido);
      await apiHelper.createCliente({
        nome: "João Silva",
        email: "joao@teste.com",
      });
    });

    test("deve listar todos os clientes", async () => {
      const response = await request(app).get("/clientes").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes).toHaveLength(2);
      expect(response.body.data.clientes[0]).toHaveProperty("id");
      expect(response.body.data.clientes[0]).toHaveProperty("nome");
      expect(response.body.data.clientes[0]).toHaveProperty("email");
    });

    test("deve filtrar clientes por busca", async () => {
      const response = await request(app)
        .get("/clientes")
        .query({ search: "João" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes).toHaveLength(1);
      expect(response.body.data.clientes[0].nome).toBe("João Silva");
    });

    test("deve aplicar paginação", async () => {
      const response = await request(app)
        .get("/clientes?page=1&limit=1")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.clientes).toHaveLength(1);
    });
  });

  describe("GET /clientes/:id", () => {
    let clienteId;

    beforeEach(async () => {
      const response = await apiHelper.createCliente(
        clienteFixtures.clienteValido
      );
      clienteId = response.body.data.id;
    });

    test("deve buscar cliente por ID", async () => {
      const response = await request(app)
        .get(`/clientes/${clienteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(clienteId);
      expect(response.body.data.nome).toBe(clienteFixtures.clienteValido.nome);
    });

    test("deve retornar 404 para cliente inexistente", async () => {
      const response = await request(app).get("/clientes/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Cliente não encontrado");
    });

    test("deve rejeitar ID inválido", async () => {
      const response = await request(app).get("/clientes/invalid").expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("ID deve ser um número");
    });
  });

  describe("PUT /clientes/:id", () => {
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
        .put(`/clientes/${clienteId}`)
        .send(dadosAtualizacao)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("atualizado com sucesso");

      // Verificar se foi realmente atualizado
      const getResponse = await request(app)
        .get(`/clientes/${clienteId}`)
        .expect(200);

      expect(getResponse.body.data.nome).toBe(dadosAtualizacao.nome);
      expect(getResponse.body.data.email).toBe(dadosAtualizacao.email);
    });

    test("deve rejeitar dados inválidos", async () => {
      const response = await request(app)
        .put(`/clientes/${clienteId}`)
        .send({ email: "email-invalido" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("formato válido");
    });

    test("deve retornar 404 para cliente inexistente", async () => {
      const response = await request(app)
        .put("/clientes/999")
        .send(clienteFixtures.dadosAtualizacao)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Cliente não encontrado");
    });
  });

  describe("DELETE /clientes/:id", () => {
    let clienteId;

    beforeEach(async () => {
      const response = await apiHelper.createCliente(
        clienteFixtures.clienteValido
      );
      clienteId = response.body.data.id;
    });

    test("deve deletar cliente existente", async () => {
      const response = await request(app)
        .delete(`/clientes/${clienteId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("deletado com sucesso");

      // Verificar se foi realmente deletado
      await request(app).get(`/clientes/${clienteId}`).expect(404);
    });

    test("deve retornar 404 para cliente inexistente", async () => {
      const response = await request(app).delete("/clientes/999").expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain("Cliente não encontrado");
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

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });
});
