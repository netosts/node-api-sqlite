const ProdutoService = require("../../../services/produtoService");
const ProdutoRepository = require("../../../repositories/produtoRepository");
const { NotFoundError } = require("../../../utils/errors");

// Mock do ProdutoRepository
jest.mock("../../../repositories/produtoRepository");

describe("ProdutoService", () => {
  let produtoService;
  let mockProdutoRepository;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();

    // Criar instância do service
    produtoService = new ProdutoService();

    // Obter referência do mock do repository
    mockProdutoRepository = produtoService.produtoRepository;
  });

  describe("create", () => {
    test("deve criar um produto com dados válidos", async () => {
      // Arrange
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      const produtoCriado = {
        id: 1,
        ...produtoData,
        data_criacao: "2023-01-01T00:00:00.000Z",
      };

      mockProdutoRepository.create.mockResolvedValue(produtoCriado);

      // Act
      const resultado = await produtoService.create(produtoData);

      // Assert
      expect(mockProdutoRepository.create).toHaveBeenCalledWith(produtoData);
      expect(resultado).toEqual(produtoCriado);
    });

    test("deve propagar erro do repository", async () => {
      // Arrange
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      const erro = new Error("Erro de banco de dados");
      mockProdutoRepository.create.mockRejectedValue(erro);

      // Act & Assert
      await expect(produtoService.create(produtoData)).rejects.toThrow(erro);
      expect(mockProdutoRepository.create).toHaveBeenCalledWith(produtoData);
    });
  });

  describe("getAll", () => {
    test("deve retornar todos os produtos com opções padrão", async () => {
      // Arrange
      const produtos = [
        { id: 1, nome: "Produto 1", preco: 10.0, estoque: 5 },
        { id: 2, nome: "Produto 2", preco: 20.0, estoque: 3 },
      ];

      const resultadoEsperado = {
        data: produtos,
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 2,
          total_pages: 1,
        },
      };

      mockProdutoRepository.getAll.mockResolvedValue(resultadoEsperado);

      // Act
      const resultado = await produtoService.getAll({});

      // Assert
      expect(mockProdutoRepository.getAll).toHaveBeenCalledWith({});
      expect(resultado).toEqual(resultadoEsperado);
    });

    test("deve retornar produtos com opções de busca", async () => {
      // Arrange
      const opcoes = {
        search: "Produto 1",
        page: 2,
        limit: 5,
      };

      const produtos = [{ id: 1, nome: "Produto 1", preco: 10.0, estoque: 5 }];

      const resultadoEsperado = {
        data: produtos,
        pagination: {
          current_page: 2,
          per_page: 5,
          total_items: 1,
          total_pages: 1,
        },
      };

      mockProdutoRepository.getAll.mockResolvedValue(resultadoEsperado);

      // Act
      const resultado = await produtoService.getAll(opcoes);

      // Assert
      expect(mockProdutoRepository.getAll).toHaveBeenCalledWith(opcoes);
      expect(resultado).toEqual(resultadoEsperado);
    });
  });

  describe("find", () => {
    test("deve retornar produto quando encontrado", async () => {
      // Arrange
      const id = 1;
      const produto = {
        id: 1,
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      mockProdutoRepository.find.mockResolvedValue(produto);

      // Act
      const resultado = await produtoService.find(id);

      // Assert
      expect(mockProdutoRepository.find).toHaveBeenCalledWith(id);
      expect(resultado).toEqual(produto);
    });

    test("deve lançar NotFoundError quando produto não encontrado", async () => {
      // Arrange
      const id = 999;
      mockProdutoRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(produtoService.find(id)).rejects.toThrow(NotFoundError);
      await expect(produtoService.find(id)).rejects.toThrow(
        "Produto não encontrado"
      );
      expect(mockProdutoRepository.find).toHaveBeenCalledWith(id);
    });
  });

  describe("update", () => {
    test("deve atualizar produto quando existe", async () => {
      // Arrange
      const id = 1;
      const dadosAtualizacao = {
        nome: "Produto Atualizado",
        preco: 149.99,
      };

      const produtoExistente = {
        id: 1,
        nome: "Produto Original",
        preco: 99.99,
        estoque: 10,
      };

      const produtoAtualizado = {
        ...produtoExistente,
        ...dadosAtualizacao,
      };

      mockProdutoRepository.find.mockResolvedValue(produtoExistente);
      mockProdutoRepository.update.mockResolvedValue(produtoAtualizado);

      // Act
      const resultado = await produtoService.update(id, dadosAtualizacao);

      // Assert
      expect(mockProdutoRepository.find).toHaveBeenCalledWith(id);
      expect(mockProdutoRepository.update).toHaveBeenCalledWith(
        id,
        dadosAtualizacao
      );
      expect(resultado).toEqual(produtoAtualizado);
    });

    test("deve lançar NotFoundError quando produto não existe", async () => {
      // Arrange
      const id = 999;
      const dadosAtualizacao = {
        nome: "Produto Atualizado",
      };

      mockProdutoRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(produtoService.update(id, dadosAtualizacao)).rejects.toThrow(
        NotFoundError
      );
      await expect(produtoService.update(id, dadosAtualizacao)).rejects.toThrow(
        "Produto não encontrado"
      );
      expect(mockProdutoRepository.find).toHaveBeenCalledWith(id);
      expect(mockProdutoRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("deve deletar produto quando existe", async () => {
      // Arrange
      const id = 1;
      const produtoExistente = {
        id: 1,
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      mockProdutoRepository.find.mockResolvedValue(produtoExistente);
      mockProdutoRepository.delete.mockResolvedValue(true);

      // Act
      const resultado = await produtoService.delete(id);

      // Assert
      expect(mockProdutoRepository.find).toHaveBeenCalledWith(id);
      expect(mockProdutoRepository.delete).toHaveBeenCalledWith(id);
      expect(resultado).toBe(true);
    });

    test("deve lançar NotFoundError quando produto não existe", async () => {
      // Arrange
      const id = 999;
      mockProdutoRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(produtoService.delete(id)).rejects.toThrow(NotFoundError);
      await expect(produtoService.delete(id)).rejects.toThrow(
        "Produto não encontrado"
      );
      expect(mockProdutoRepository.find).toHaveBeenCalledWith(id);
      expect(mockProdutoRepository.delete).not.toHaveBeenCalled();
    });
  });
});
