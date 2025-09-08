const ProdutoService = require("../../services/ProdutoService");
const ProdutoRepository = require("../../repositories/ProdutoRepository");

// Mock do repositório para isolamento dos testes
jest.mock("../../repositories/ProdutoRepository");

describe("ProdutoService", () => {
  let produtoService;
  let mockRepository;

  beforeEach(() => {
    // Reset todos os mocks
    jest.clearAllMocks();

    // Criar nova instância do serviço
    produtoService = new ProdutoService();

    // Obter referência do mock do repositório
    mockRepository = produtoService.repository;
  });

  describe("create", () => {
    it("deve criar produto com dados válidos", async () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      const produtoCriado = {
        id: 1,
        ...produtoData,
      };

      // Mock do repository
      mockRepository.create.mockResolvedValue(produtoCriado);

      const resultado = await produtoService.create(produtoData);

      expect(mockRepository.create).toHaveBeenCalledWith(produtoData);
      expect(resultado).toEqual(produtoCriado);
    });

    it("deve lançar erro para preço negativo", async () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: -10.0,
        estoque: 5,
      };

      await expect(produtoService.create(produtoData)).rejects.toThrow(
        "Preço não pode ser negativo"
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro para estoque negativo", async () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.99,
        estoque: -5,
      };

      await expect(produtoService.create(produtoData)).rejects.toThrow(
        "Estoque não pode ser negativo"
      );

      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve formatar preço com 2 casas decimais", async () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.999,
        estoque: 10,
      };

      const produtoEsperado = {
        ...produtoData,
        preco: 100.0, // Deve ser formatado
      };

      const produtoCriado = {
        id: 1,
        ...produtoEsperado,
      };

      mockRepository.create.mockResolvedValue(produtoCriado);

      const resultado = await produtoService.create(produtoData);

      expect(mockRepository.create).toHaveBeenCalledWith(produtoEsperado);
      expect(resultado).toEqual(produtoCriado);
    });
  });

  describe("updateStock", () => {
    it("deve atualizar estoque com quantidade válida", async () => {
      const produtoId = 1;
      const novaQuantidade = 15;

      const produto = {
        id: produtoId,
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      const resultadoUpdate = {
        id: produtoId,
        changes: 1,
      };

      mockRepository.findById.mockResolvedValue(produto);
      mockRepository.updateStock.mockResolvedValue(resultadoUpdate);

      const resultado = await produtoService.updateStock(
        produtoId,
        novaQuantidade
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(produtoId);
      expect(mockRepository.updateStock).toHaveBeenCalledWith(
        produtoId,
        novaQuantidade
      );
      expect(resultado).toEqual(resultadoUpdate);
    });

    it("deve lançar erro para quantidade negativa", async () => {
      const produtoId = 1;
      const quantidadeNegativa = -5;

      await expect(
        produtoService.updateStock(produtoId, quantidadeNegativa)
      ).rejects.toThrow("Quantidade em estoque não pode ser negativa");

      expect(mockRepository.findById).not.toHaveBeenCalled();
      expect(mockRepository.updateStock).not.toHaveBeenCalled();
    });

    it("deve lançar erro quando produto não existe", async () => {
      const produtoId = 999;
      const novaQuantidade = 15;

      mockRepository.findById.mockResolvedValue(null);

      await expect(
        produtoService.updateStock(produtoId, novaQuantidade)
      ).rejects.toThrow("Produto não encontrado");

      expect(mockRepository.findById).toHaveBeenCalledWith(produtoId);
      expect(mockRepository.updateStock).not.toHaveBeenCalled();
    });
  });

  describe("checkStockAvailability", () => {
    it("deve retornar true quando há estoque suficiente", async () => {
      const produtoId = 1;
      const quantidadeDesejada = 5;

      const produto = {
        id: produtoId,
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      mockRepository.findById.mockResolvedValue(produto);

      const resultado = await produtoService.checkStockAvailability(
        produtoId,
        quantidadeDesejada
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(produtoId);
      expect(resultado).toBe(true);
    });

    it("deve retornar false quando não há estoque suficiente", async () => {
      const produtoId = 1;
      const quantidadeDesejada = 15;

      const produto = {
        id: produtoId,
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      };

      mockRepository.findById.mockResolvedValue(produto);

      const resultado = await produtoService.checkStockAvailability(
        produtoId,
        quantidadeDesejada
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(produtoId);
      expect(resultado).toBe(false);
    });

    it("deve retornar false quando produto não existe", async () => {
      const produtoId = 999;
      const quantidadeDesejada = 5;

      mockRepository.findById.mockResolvedValue(null);

      const resultado = await produtoService.checkStockAvailability(
        produtoId,
        quantidadeDesejada
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(produtoId);
      expect(resultado).toBe(false);
    });
  });

  describe("findWithLowStock", () => {
    it("deve retornar produtos com estoque baixo", async () => {
      const limite = 5;
      const produtosComEstoqueBaixo = [
        { id: 1, nome: "Produto A", preco: 10.0, estoque: 2 },
        { id: 2, nome: "Produto B", preco: 20.0, estoque: 4 },
      ];

      mockRepository.findWithLowStock.mockResolvedValue(
        produtosComEstoqueBaixo
      );

      const resultado = await produtoService.findWithLowStock(limite);

      expect(mockRepository.findWithLowStock).toHaveBeenCalledWith(limite);
      expect(resultado).toEqual(produtosComEstoqueBaixo);
    });

    it("deve lançar erro para limite negativo", async () => {
      const limiteNegativo = -1;

      await expect(
        produtoService.findWithLowStock(limiteNegativo)
      ).rejects.toThrow("Limite deve ser um número positivo");

      expect(mockRepository.findWithLowStock).not.toHaveBeenCalled();
    });
  });

  describe("processProductData", () => {
    it("deve processar dados válidos corretamente", () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.999,
        estoque: 10,
      };

      const resultado = produtoService.processProductData(produtoData);

      expect(resultado).toEqual({
        nome: "Produto Teste",
        preco: 100.0,
        estoque: 10,
      });
    });

    it("deve lançar erro para preço negativo", () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: -10.0,
        estoque: 10,
      };

      expect(() => produtoService.processProductData(produtoData)).toThrow(
        "Preço não pode ser negativo"
      );
    });

    it("deve lançar erro para estoque negativo", () => {
      const produtoData = {
        nome: "Produto Teste",
        preco: 99.99,
        estoque: -5,
      };

      expect(() => produtoService.processProductData(produtoData)).toThrow(
        "Estoque não pode ser negativo"
      );
    });
  });
});
