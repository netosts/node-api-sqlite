const ProdutoRepository = require("../../repositories/produtoRepository");
const ProdutoModel = require("../../models/produtoModel");
const BaseRepository = require("../../repositories/baseRepository");

// Mock do BaseRepository
jest.mock("../../repositories/baseRepository");

describe("ProdutoRepository", () => {
  let produtoRepository;
  let mockBaseRepository;

  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();

    // Criar uma nova instância
    produtoRepository = new ProdutoRepository();

    // Obter a instância mockada do BaseRepository
    mockBaseRepository = BaseRepository.prototype;
  });

  describe("constructor", () => {
    test("deve inicializar com tableName e fields do ProdutoModel", () => {
      expect(BaseRepository).toHaveBeenCalledWith(
        ProdutoModel.tableName,
        ProdutoModel.fields
      );
    });
  });

  describe("getAll", () => {
    test("deve retornar produtos com estrutura específica", async () => {
      const mockBaseResult = {
        data: [
          { id: 1, nome: "Produto 1", preco: 99.99, estoque: 10 },
          { id: 2, nome: "Produto 2", preco: 199.99, estoque: 5 },
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
      const result = await produtoRepository.getAll(options);

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        ...options,
        searchFields: ["nome"],
      });

      expect(result).toEqual({
        produtos: mockBaseResult.data,
        pagination: mockBaseResult.pagination,
      });
    });

    test("deve aplicar searchFields padrão para produtos", async () => {
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

      const options = { search: "notebook" };
      await produtoRepository.getAll(options);

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        ...options,
        searchFields: ["nome"],
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
        search: "produto",
        sortBy: "preco",
        order: "desc",
      };

      await produtoRepository.getAll(options);

      expect(mockBaseRepository.getAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        search: "produto",
        sortBy: "preco",
        order: "desc",
        searchFields: ["nome"],
      });
    });

    test("deve propagar erros do BaseRepository", async () => {
      const error = new Error("Database error");
      mockBaseRepository.getAll = jest.fn().mockRejectedValue(error);

      await expect(produtoRepository.getAll()).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("Métodos herdados", () => {
    test("deve herdar método find do BaseRepository", () => {
      expect(produtoRepository.find).toBeDefined();
      expect(typeof produtoRepository.find).toBe("function");
    });

    test("deve herdar método create do BaseRepository", () => {
      expect(produtoRepository.create).toBeDefined();
      expect(typeof produtoRepository.create).toBe("function");
    });

    test("deve herdar método update do BaseRepository", () => {
      expect(produtoRepository.update).toBeDefined();
      expect(typeof produtoRepository.update).toBe("function");
    });

    test("deve herdar método delete do BaseRepository", () => {
      expect(produtoRepository.delete).toBeDefined();
      expect(typeof produtoRepository.delete).toBe("function");
    });

    test("deve herdar método getWhere do BaseRepository", () => {
      expect(produtoRepository.getWhere).toBeDefined();
      expect(typeof produtoRepository.getWhere).toBe("function");
    });
  });

  describe("Integração com ProdutoModel", () => {
    test("deve usar tableName do ProdutoModel", () => {
      expect(BaseRepository).toHaveBeenCalledWith(
        "produtos",
        expect.any(Array)
      );
    });

    test("deve usar fields do ProdutoModel", () => {
      expect(BaseRepository).toHaveBeenCalledWith(expect.any(String), [
        "nome",
        "preco",
        "estoque",
        "data_criacao",
      ]);
    });
  });
});
