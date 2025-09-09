const ClienteRepository = require("../../repositories/clienteRepository");
const ClienteModel = require("../../models/clienteModel");
const BaseRepository = require("../../repositories/baseRepository");

// Mock do BaseRepository
jest.mock("../../repositories/baseRepository");

describe("ClienteRepository", () => {
  let clienteRepository;
  let mockBaseRepository;

  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();

    // Criar uma nova instância
    clienteRepository = new ClienteRepository();

    // Obter a instância mockada do BaseRepository
    mockBaseRepository = BaseRepository.prototype;
  });

  describe("constructor", () => {
    test("deve inicializar com tableName e fields do ClienteModel", () => {
      expect(BaseRepository).toHaveBeenCalledWith(
        ClienteModel.tableName,
        ClienteModel.fields
      );
    });
  });

  describe("getAll", () => {
    test("deve retornar clientes com estrutura específica", async () => {
      const mockBaseResult = {
        data: [
          { id: 1, nome: "João Silva", email: "joao@teste.com" },
          { id: 2, nome: "Maria Santos", email: "maria@teste.com" },
        ],
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 2,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
      };

      // Mock do método getAll do BaseRepository
      mockBaseRepository.getAll = jest.fn().mockResolvedValue(mockBaseResult);

      const options = { page: 1, limit: 10 };
      const result = await clienteRepository.getAll(options);

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        ...options,
        searchFields: ["nome", "email"],
      });

      expect(result).toEqual({
        clientes: mockBaseResult.data,
        pagination: mockBaseResult.pagination,
      });
    });

    test("deve aplicar searchFields padrão para clientes", async () => {
      const mockBaseResult = {
        data: [],
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 0,
          total_pages: 0,
          has_next: false,
          has_prev: false,
        },
      };

      mockBaseRepository.getAll = jest.fn().mockResolvedValue(mockBaseResult);

      const options = { search: "joão" };
      await clienteRepository.getAll(options);

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        ...options,
        searchFields: ["nome", "email"],
      });
    });

    test("deve preservar options existentes e adicionar searchFields", async () => {
      const mockBaseResult = {
        data: [],
        pagination: {
          current_page: 1,
          per_page: 5,
          total_items: 0,
          total_pages: 0,
          has_next: false,
          has_prev: false,
        },
      };

      mockBaseRepository.getAll = jest.fn().mockResolvedValue(mockBaseResult);

      const options = {
        page: 2,
        limit: 5,
        search: "cliente",
        sortBy: "nome",
        order: "asc",
      };

      await clienteRepository.getAll(options);

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        search: "cliente",
        sortBy: "nome",
        order: "asc",
        searchFields: ["nome", "email"],
      });
    });

    test("deve propagar erros do BaseRepository", async () => {
      const error = new Error("Database error");
      mockBaseRepository.getAll = jest.fn().mockRejectedValue(error);

      await expect(clienteRepository.getAll()).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("Métodos herdados", () => {
    test("deve herdar método find do BaseRepository", () => {
      expect(clienteRepository.find).toBeDefined();
      expect(typeof clienteRepository.find).toBe("function");
    });

    test("deve herdar método create do BaseRepository", () => {
      expect(clienteRepository.create).toBeDefined();
      expect(typeof clienteRepository.create).toBe("function");
    });

    test("deve herdar método update do BaseRepository", () => {
      expect(clienteRepository.update).toBeDefined();
      expect(typeof clienteRepository.update).toBe("function");
    });

    test("deve herdar método delete do BaseRepository", () => {
      expect(clienteRepository.delete).toBeDefined();
      expect(typeof clienteRepository.delete).toBe("function");
    });

    test("deve herdar método getWhere do BaseRepository", () => {
      expect(clienteRepository.getWhere).toBeDefined();
      expect(typeof clienteRepository.getWhere).toBe("function");
    });
  });

  describe("Integração com ClienteModel", () => {
    test("deve usar tableName do ClienteModel", () => {
      expect(BaseRepository).toHaveBeenCalledWith(
        "clientes",
        expect.any(Array)
      );
    });

    test("deve usar fields do ClienteModel", () => {
      expect(BaseRepository).toHaveBeenCalledWith(expect.any(String), [
        "nome",
        "email",
        "data_criacao",
      ]);
    });
  });

  describe("Funcionalidades específicas de Cliente", () => {
    test("deve buscar tanto por nome quanto por email", async () => {
      const mockBaseResult = {
        data: [{ id: 1, nome: "João Silva", email: "joao@teste.com" }],
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 1,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
      };

      mockBaseRepository.getAll = jest.fn().mockResolvedValue(mockBaseResult);

      await clienteRepository.getAll({ search: "joão" });

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        search: "joão",
        searchFields: ["nome", "email"],
      });
    });

    test("deve encontrar cliente por email específico", async () => {
      const mockBaseResult = {
        data: [{ id: 1, nome: "João Silva", email: "joao@teste.com" }],
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 1,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
      };

      mockBaseRepository.getAll = jest.fn().mockResolvedValue(mockBaseResult);

      await clienteRepository.getAll({ search: "joao@teste.com" });

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        search: "joao@teste.com",
        searchFields: ["nome", "email"],
      });
    });
  });
});
