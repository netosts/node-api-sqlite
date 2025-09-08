const ClienteRepository = require("../../repositories/ClienteRepository");
const TestDatabase = require("../helpers/TestDatabase");

describe("ClienteRepository", () => {
  let clienteRepository;
  let testDb;

  beforeEach(async () => {
    testDb = new TestDatabase();
    await testDb.setup();

    clienteRepository = new ClienteRepository();
  });

  afterEach(async () => {
    if (testDb) {
      await testDb.teardown();
    }
  });

  describe("create", () => {
    it("deve criar cliente com dados válidos", async () => {
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      const resultado = await clienteRepository.create(clienteData);

      expect(resultado).toMatchObject({
        id: expect.any(Number),
        nome: clienteData.nome,
        email: clienteData.email,
      });
    });
  });

  describe("findById", () => {
    it("deve encontrar cliente por ID", async () => {
      // Primeiro criar um cliente
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      const clienteCriado = await clienteRepository.create(clienteData);

      // Buscar o cliente
      const clienteEncontrado = await clienteRepository.findById(
        clienteCriado.id
      );

      expect(clienteEncontrado).toMatchObject({
        id: clienteCriado.id,
        nome: clienteData.nome,
        email: clienteData.email,
      });
    });

    it("deve retornar null para ID inexistente", async () => {
      const resultado = await clienteRepository.findById(999);
      expect(resultado).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("deve encontrar cliente por email", async () => {
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      await clienteRepository.create(clienteData);

      const clienteEncontrado = await clienteRepository.findByEmail(
        clienteData.email
      );

      expect(clienteEncontrado).toMatchObject({
        nome: clienteData.nome,
        email: clienteData.email,
      });
    });

    it("deve retornar null para email inexistente", async () => {
      const resultado = await clienteRepository.findByEmail(
        "inexistente@exemplo.com"
      );
      expect(resultado).toBeNull();
    });
  });

  describe("emailExists", () => {
    it("deve retornar true para email existente", async () => {
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      await clienteRepository.create(clienteData);

      const existe = await clienteRepository.emailExists(clienteData.email);
      expect(existe).toBe(true);
    });

    it("deve retornar false para email inexistente", async () => {
      const existe = await clienteRepository.emailExists(
        "inexistente@exemplo.com"
      );
      expect(existe).toBe(false);
    });

    it("deve excluir ID específico na verificação", async () => {
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      const cliente = await clienteRepository.create(clienteData);

      // Verificar se email existe excluindo o próprio cliente
      const existe = await clienteRepository.emailExists(
        clienteData.email,
        cliente.id
      );
      expect(existe).toBe(false);

      // Verificar se email existe sem exclusão
      const existeSemExclusao = await clienteRepository.emailExists(
        clienteData.email
      );
      expect(existeSemExclusao).toBe(true);
    });
  });

  describe("update", () => {
    it("deve atualizar cliente corretamente", async () => {
      // Criar cliente
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      const cliente = await clienteRepository.create(clienteData);

      // Atualizar cliente
      const dadosAtualizacao = {
        nome: "João Silva Atualizado",
        email: "joao.atualizado@exemplo.com",
      };

      const resultado = await clienteRepository.update(
        cliente.id,
        dadosAtualizacao
      );

      expect(resultado).toMatchObject({
        id: cliente.id,
        changes: expect.any(Number),
      });

      // Verificar se foi atualizado
      const clienteAtualizado = await clienteRepository.findById(cliente.id);
      expect(clienteAtualizado).toMatchObject({
        id: cliente.id,
        nome: dadosAtualizacao.nome,
        email: dadosAtualizacao.email,
      });
    });
  });

  describe("delete", () => {
    it("deve deletar cliente corretamente", async () => {
      // Criar cliente
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      const cliente = await clienteRepository.create(clienteData);

      // Deletar cliente
      const resultado = await clienteRepository.delete(cliente.id);

      expect(resultado).toMatchObject({
        id: cliente.id,
        changes: expect.any(Number),
      });

      // Verificar se foi deletado
      const clienteDeletado = await clienteRepository.findById(cliente.id);
      expect(clienteDeletado).toBeNull();
    });
  });

  describe("findAll", () => {
    beforeEach(async () => {
      // Criar alguns clientes para teste
      const clientes = [
        { nome: "João Silva", email: "joao@exemplo.com" },
        { nome: "Maria Santos", email: "maria@exemplo.com" },
        { nome: "Pedro Oliveira", email: "pedro@exemplo.com" },
      ];

      for (const cliente of clientes) {
        await clienteRepository.create(cliente);
      }
    });

    it("deve retornar todos os clientes sem filtros", async () => {
      const resultado = await clienteRepository.findAll();

      expect(resultado.clientes).toHaveLength(3);
      expect(resultado.pagination).toMatchObject({
        current_page: 1,
        per_page: 10,
        total_items: 3,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      });
    });

    it("deve filtrar clientes por busca", async () => {
      const resultado = await clienteRepository.findAll({
        search: "João",
      });

      expect(resultado.clientes).toHaveLength(1);
      expect(resultado.clientes[0]).toMatchObject({
        nome: "João Silva",
        email: "joao@exemplo.com",
      });
    });

    it("deve aplicar paginação", async () => {
      const resultado = await clienteRepository.findAll({
        page: 1,
        limit: 2,
      });

      expect(resultado.clientes).toHaveLength(2);
      expect(resultado.pagination).toMatchObject({
        current_page: 1,
        per_page: 2,
        total_items: 3,
        total_pages: 2,
        has_next: true,
        has_prev: false,
      });
    });
  });
});
