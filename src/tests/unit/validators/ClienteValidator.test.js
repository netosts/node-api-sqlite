const ClienteValidator = require("../../../validators/clienteValidator");
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
    isEmail: jest.fn().mockReturnThis(),
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

describe("ClienteValidator", () => {
  const { body, param, validationResult } = require("express-validator");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateCreate", () => {
    test("deve validar dados válidos sem erros", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "João Silva",
        email: "joao@teste.com",
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      // Act & Assert
      await expect(ClienteValidator.validateCreate(req)).resolves.not.toThrow();

      // Verificar se as validações foram configuradas
      expect(body).toHaveBeenCalledWith("nome");
      expect(body).toHaveBeenCalledWith("email");
    });

    test("deve lançar ValidationError para dados inválidos", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "",
        email: "email-invalido",
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest
          .fn()
          .mockReturnValue([
            { msg: "Nome é obrigatório" },
            { msg: "Email deve ter um formato válido" },
          ]),
      });

      // Act & Assert
      await expect(ClienteValidator.validateCreate(req)).rejects.toThrow(
        ValidationError
      );
      await expect(ClienteValidator.validateCreate(req)).rejects.toThrow(
        "Nome é obrigatório, Email deve ter um formato válido"
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
        isEmail: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis(),
        run: jest.fn().mockResolvedValue(),
      };

      body.mockReturnValue(mockBodyValidator);

      // Act
      await ClienteValidator.validateCreate(req);

      // Assert
      expect(body).toHaveBeenCalledWith("nome");
      expect(body).toHaveBeenCalledWith("email");
      expect(mockBodyValidator.run).toHaveBeenCalledTimes(2);
    });

    test("deve validar nome com pelo menos 2 caracteres", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "A",
        email: "joao@teste.com",
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest
          .fn()
          .mockReturnValue([{ msg: "Nome deve ter pelo menos 2 caracteres" }]),
      });

      // Act & Assert
      await expect(ClienteValidator.validateCreate(req)).rejects.toThrow(
        "Nome deve ter pelo menos 2 caracteres"
      );
    });

    test("deve validar formato de email", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "João Silva",
        email: "email-sem-arroba",
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest
          .fn()
          .mockReturnValue([{ msg: "Email deve ter um formato válido" }]),
      });

      // Act & Assert
      await expect(ClienteValidator.validateCreate(req)).rejects.toThrow(
        "Email deve ter um formato válido"
      );
    });
  });

  describe("validateUpdate", () => {
    test("deve validar dados válidos para atualização", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "João Silva Atualizado",
        email: "joao.novo@teste.com",
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      // Act & Assert
      await expect(ClienteValidator.validateUpdate(req)).resolves.not.toThrow();
    });

    test("deve permitir campos opcionais vazios na atualização", async () => {
      // Arrange
      const req = createMockRequest({
        nome: "Apenas nome atualizado",
        // email não fornecido
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(true),
        array: jest.fn().mockReturnValue([]),
      });

      const mockBodyValidator = {
        optional: jest.fn().mockReturnThis(),
        isLength: jest.fn().mockReturnThis(),
        isEmail: jest.fn().mockReturnThis(),
        withMessage: jest.fn().mockReturnThis(),
        run: jest.fn().mockResolvedValue(),
      };

      body.mockReturnValue(mockBodyValidator);

      // Act
      await ClienteValidator.validateUpdate(req);

      // Assert - Verificar que optional foi chamado para todos os campos
      expect(mockBodyValidator.optional).toHaveBeenCalledTimes(2);
    });

    test("deve validar formato de email quando fornecido na atualização", async () => {
      // Arrange
      const req = createMockRequest({
        email: "email-invalido",
      });

      validationResult.mockReturnValue({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest
          .fn()
          .mockReturnValue([{ msg: "Email deve ter um formato válido" }]),
      });

      // Act & Assert
      await expect(ClienteValidator.validateUpdate(req)).rejects.toThrow(
        "Email deve ter um formato válido"
      );
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
      await expect(ClienteValidator.validateId(req)).resolves.not.toThrow();
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
      await expect(ClienteValidator.validateId(req)).rejects.toThrow(
        ValidationError
      );
      await expect(ClienteValidator.validateId(req)).rejects.toThrow(
        "ID deve ser um número inteiro positivo"
      );
    });
  });
});
