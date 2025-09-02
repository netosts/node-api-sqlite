const ClienteModel = require("../../src/models/ClienteModel");
const clienteFixtures = require("../fixtures/clienteFixtures");
const TestDatabase = require("../helpers/TestDatabase");

describe("ClienteModel", () => {
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
    test("deve criar cliente corretamente", async () => {
      const clienteData = clienteFixtures.clienteValido;

      const resultado = await ClienteModel.create(clienteData);

      expect(resultado).toHaveProperty("id");
      expect(resultado.nome).toBe(clienteData.nome);
      expect(resultado.email).toBe(clienteData.email);
    });

    test("deve gerar ID automaticamente", async () => {
      const cliente1 = await ClienteModel.create(clienteFixtures.clienteValido);
      const cliente2 = await ClienteModel.create({
        ...clienteFixtures.clienteValido,
        email: "cliente2@teste.com",
      });

      expect(cliente1.id).toBeDefined();
      expect(cliente2.id).toBeDefined();
      expect(cliente2.id).toBe(cliente1.id + 1);
    });

    test("deve definir created_at e updated_at", async () => {
      const cliente = await ClienteModel.create(clienteFixtures.clienteValido);

      expect(cliente.created_at).toBeDefined();
      expect(cliente.updated_at).toBeDefined();
      expect(cliente.created_at).toBe(cliente.updated_at);
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      // Criar clientes de teste
      await ClienteModel.create(clienteFixtures.clienteValido);
      await ClienteModel.create({
        nome: "João Silva",
        email: "joao@teste.com",
      });
      await ClienteModel.create({
        nome: "Maria Santos",
        email: "maria@teste.com",
      });
    });

    test("deve retornar todos os clientes sem filtros", async () => {
      const clientes = await ClienteModel.findAll();

      expect(clientes).toHaveLength(3);
      expect(clientes[0]).toHaveProperty("id");
      expect(clientes[0]).toHaveProperty("nome");
      expect(clientes[0]).toHaveProperty("email");
    });

    test("deve filtrar por nome", async () => {
      const clientes = await ClienteModel.findAll({ search: "João" });

      expect(clientes).toHaveLength(1);
      expect(clientes[0].nome).toBe("João Silva");
    });

    test("deve filtrar por email", async () => {
      const clientes = await ClienteModel.findAll({
        search: "maria@teste.com",
      });

      expect(clientes).toHaveLength(1);
      expect(clientes[0].email).toBe("maria@teste.com");
    });

    test("deve aplicar limite e offset", async () => {
      const clientes = await ClienteModel.findAll({ limit: 2, offset: 1 });

      expect(clientes).toHaveLength(2);
    });

    test("deve buscar de forma case-insensitive", async () => {
      const clientes = await ClienteModel.findAll({ search: "JOÃO" });

      expect(clientes).toHaveLength(1);
      expect(clientes[0].nome).toBe("João Silva");
    });
  });

  describe("findById", () => {
    let clienteId;

    beforeEach(async () => {
      const cliente = await ClienteModel.create(clienteFixtures.clienteValido);
      clienteId = cliente.id;
    });

    test("deve encontrar cliente por ID", async () => {
      const cliente = await ClienteModel.findById(clienteId);

      expect(cliente).toBeDefined();
      expect(cliente.id).toBe(clienteId);
      expect(cliente.nome).toBe(clienteFixtures.clienteValido.nome);
    });

    test("deve retornar null para ID inexistente", async () => {
      const cliente = await ClienteModel.findById(999);

      expect(cliente).toBeNull();
    });
  });

  describe("findByEmail", () => {
    beforeEach(async () => {
      await ClienteModel.create(clienteFixtures.clienteValido);
    });

    test("deve encontrar cliente por email", async () => {
      const cliente = await ClienteModel.findByEmail(
        clienteFixtures.clienteValido.email
      );

      expect(cliente).toBeDefined();
      expect(cliente.email).toBe(clienteFixtures.clienteValido.email);
      expect(cliente.nome).toBe(clienteFixtures.clienteValido.nome);
    });

    test("deve retornar null para email inexistente", async () => {
      const cliente = await ClienteModel.findByEmail("inexistente@teste.com");

      expect(cliente).toBeNull();
    });

    test("deve buscar email de forma case-insensitive", async () => {
      const cliente = await ClienteModel.findByEmail(
        clienteFixtures.clienteValido.email.toUpperCase()
      );

      expect(cliente).toBeDefined();
      expect(cliente.email).toBe(clienteFixtures.clienteValido.email);
    });
  });

  describe("update", () => {
    let clienteId;

    beforeEach(async () => {
      const cliente = await ClienteModel.create(clienteFixtures.clienteValido);
      clienteId = cliente.id;
    });

    test("deve atualizar cliente corretamente", async () => {
      const dadosAtualizacao = clienteFixtures.dadosAtualizacao;

      const cliente = await ClienteModel.update(clienteId, dadosAtualizacao);

      expect(cliente).toBeDefined();
      expect(cliente.id).toBe(clienteId);
      expect(cliente.nome).toBe(dadosAtualizacao.nome);
      expect(cliente.email).toBe(dadosAtualizacao.email);
      expect(cliente.updated_at).not.toBe(cliente.created_at);
    });

    test("deve atualizar apenas campos fornecidos", async () => {
      const originalCliente = await ClienteModel.findById(clienteId);

      const cliente = await ClienteModel.update(clienteId, {
        nome: "Nome Atualizado",
      });

      expect(cliente.nome).toBe("Nome Atualizado");
      expect(cliente.email).toBe(originalCliente.email); // Deve manter valor original
    });

    test("deve retornar null para ID inexistente", async () => {
      const cliente = await ClienteModel.update(999, { nome: "Test" });

      expect(cliente).toBeNull();
    });
  });

  describe("delete", () => {
    let clienteId;

    beforeEach(async () => {
      const cliente = await ClienteModel.create(clienteFixtures.clienteValido);
      clienteId = cliente.id;
    });

    test("deve deletar cliente corretamente", async () => {
      const resultado = await ClienteModel.delete(clienteId);

      expect(resultado).toBe(true);

      // Verificar se foi realmente deletado
      const cliente = await ClienteModel.findById(clienteId);
      expect(cliente).toBeNull();
    });

    test("deve retornar false para ID inexistente", async () => {
      const resultado = await ClienteModel.delete(999);

      expect(resultado).toBe(false);
    });
  });

  describe("validação de email único", () => {
    test("deve permitir criar clientes com emails diferentes", async () => {
      await ClienteModel.create(clienteFixtures.clienteValido);

      const cliente2 = await ClienteModel.create({
        nome: "Outro Cliente",
        email: "outro@teste.com",
      });

      expect(cliente2).toBeDefined();
      expect(cliente2.email).toBe("outro@teste.com");
    });

    test("deve rejeitar email duplicado", async () => {
      await ClienteModel.create(clienteFixtures.clienteValido);

      await expect(
        ClienteModel.create({
          nome: "Cliente Duplicado",
          email: clienteFixtures.clienteValido.email,
        })
      ).rejects.toThrow();
    });
  });
});
