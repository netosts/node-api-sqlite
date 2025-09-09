const ProdutoValidator = require("../../../validators/produtoValidator");
const { ValidationError } = require("../../../utils/errors");

// Mock para simular requisições
const createMockRequest = (body = {}, params = {}) => ({
  body,
  params,
  // Mock do express-validator - será sobrescrito pelos mocks específicos
  validationResult: jest.fn(),
});

// Mock do express-validator
jest.mock("express-validator", () => ({
  body: jest.fn(() => ({
    notEmpty: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
    isFloat: jest.fn().mockReturnThis(),
    isInt: jest.fn().mockReturnThis(),
    optional: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    run: jest.fn().mockResolvedValue(),
  })),
  param: jest.fn(() => ({
    isInt: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    run: jest.fn().mockResolvedValue(),
  })),
  validationResult: jest.fn(),
}));

describe("ProdutoValidator", () => {
  const { body, param, validationResult } = require("express-validator");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateCreate", () => {
    test("deve validar dados válidos sem erros", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 10,
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      // Act & Assert
      await expect(ProdutoValidator.validateCreate(req)).resolves.not.toThrow();

      // Verificar se as validações foram configuradas
      expect(body).toHaveBeenCalledWith("nome");
      expect(body).toHaveBeenCalledWith("preco");
      expect(body).toHaveBeenCalledWith("estoque");
    });

    test("deve lançar ValidationError para dados inválidos", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "",
        preco: -10,
        estoque: -5,
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest
          .fn()
          .mockReturnValue([
            { msg: "Nome é obrigatório" },
            { msg: "Preço deve ser um número positivo" },
            { msg: "Estoque deve ser um número inteiro positivo" },
          ]),
      });

      // Act & Assert
      await expect(ProdutoValidator.validateCreate(req)).rejects.toThrow(
        ValidationError
      );
      await expect(ProdutoValidator.validateCreate(req)).rejects.toThrow(
        "Nome é obrigatório, Preço deve ser um número positivo, Estoque deve ser um número inteiro positivo"
      );
    });

    test("deve configurar validações corretas para criação", async () => {
      // Arrange
      const req = createMockRequest();

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      const mockBodyValidator = {
        notEmpty: jest.fn().mockReturnThis(),
        isLength: jest.fn().mockReturnThis(),
        isFloat: jest.fn().mockReturnThis(),
        isInt: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis(),
        run: jest.fn().mockResolvedValue(),
      };

      body.mockReturnValue(mockBodyValidator);

      // Act
      await ProdutoValidator.validateCreate(req);

      // Assert
      expect(body).toHaveBeenCalledWith("nome");
      expect(body).toHaveBeenCalledWith("preco");
      expect(body).toHaveBeenCalledWith("estoque");
      expect(mockBodyValidator.run).toHaveBeenCalledTimes(3);
    });
  });

  describe("validateUpdate", () => {
    test("deve validar dados válidos para atualização", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "Produto Atualizado",
        preco: 149.99,
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      // Act & Assert
      await expect(ProdutoValidator.validateUpdate(req)).resolves.not.toThrow();
    });

    test("deve permitir campos opcionais vazios na atualização", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "Apenas nome atualizado",
        // preco e estoque não fornecidos
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      const mockBodyValidator = {
        optional: jest.fn().mockReturnThis(),
        isLength: jest.fn().mockReturnThis(),
        isFloat: jest.fn().mockReturnThis(),
        isInt: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis(),
        run: jest.fn().mockResolvedValue(),
      };

      body.mockReturnValue(mockBodyValidator);

      // Act
      await ProdutoValidator.validateUpdate(req);

      // Assert - Verificar que optional foi chamado para todos os campos
      expect(mockBodyValidator.optional).toHaveBeenCalledTimes(3);
    });
  });

  describe("validateId", () => {
    test("deve validar ID válido", async () => {
      // Arrange
      const req = createMockRequest({}, { id: "1" });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      // Act & Assert
      await expect(ProdutoValidator.validateId(req)).resolves.not.toThrow();
      expect(param).toHaveBeenCalledWith("id");
    });

    test("deve lançar ValidationError para ID inválido", async () => {
      // Arrange
      const req = createMockRequest({}, { id: "invalid" });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest
          .fn()
          .mockReturnValue([{ msg: "ID deve ser um número inteiro positivo" }]),
      });

      // Act & Assert
      await expect(ProdutoValidator.validateId(req)).rejects.toThrow(
        ValidationError
      );
      await expect(ProdutoValidator.validateId(req)).rejects.toThrow(
        "ID deve ser um número inteiro positivo"
      );
    });
  });
});
