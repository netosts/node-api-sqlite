const {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
} = require("../../../utils/errors");

describe("Error Classes", () => {
  describe("AppError", () => {
    test("deve criar erro com mensagem padrão", () => {
      const error = new AppError("Erro de teste");

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe("Erro de teste");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe("AppError");
    });

    test("deve criar erro com status code customizado", () => {
      const error = new AppError("Erro customizado", 422);

      expect(error.message).toBe("Erro customizado");
      expect(error.statusCode).toBe(422);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe("AppError");
    });

    test("deve criar erro não operacional", () => {
      const error = new AppError("Erro do sistema", 500, false);

      expect(error.message).toBe("Erro do sistema");
      expect(error.statusCode).toBe(500);
      expect(error.isOperational).toBe(false);
      expect(error.name).toBe("AppError");
    });

    test("deve capturar stack trace", () => {
      const error = new AppError("Erro de teste");

      expect(error.stack).toBeDefined();
      expect(typeof error.stack).toBe("string");
      expect(error.stack).toContain("AppError");
    });
  });

  describe("ValidationError", () => {
    test("deve criar erro de validação com status 400", () => {
      const error = new ValidationError("Dados inválidos");

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toBe("Dados inválidos");
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe("ValidationError");
    });

    test("deve herdar propriedades do AppError", () => {
      const error = new ValidationError("Email inválido");

      expect(error.stack).toBeDefined();
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });
  });

  describe("NotFoundError", () => {
    test("deve criar erro 404 com mensagem padrão", () => {
      const error = new NotFoundError();

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe("Recurso não encontrado");
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe("NotFoundError");
    });

    test("deve criar erro 404 com mensagem customizada", () => {
      const error = new NotFoundError("Produto não encontrado");

      expect(error.message).toBe("Produto não encontrado");
      expect(error.statusCode).toBe(404);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe("NotFoundError");
    });
  });

  describe("ConflictError", () => {
    test("deve criar erro 409 com mensagem", () => {
      const error = new ConflictError("Email já existe");

      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ConflictError);
      expect(error.message).toBe("Email já existe");
      expect(error.statusCode).toBe(409);
      expect(error.isOperational).toBe(true);
      expect(error.name).toBe("ConflictError");
    });

    test("deve herdar propriedades do AppError", () => {
      const error = new ConflictError("Conflito de dados");

      expect(error.stack).toBeDefined();
      expect(error.statusCode).toBe(409);
      expect(error.isOperational).toBe(true);
    });
  });

  describe("Herança de Error nativo", () => {
    test("todos os erros devem ser instâncias de Error", () => {
      const appError = new AppError("Teste");
      const validationError = new ValidationError("Teste");
      const notFoundError = new NotFoundError("Teste");
      const conflictError = new ConflictError("Teste");

      expect(appError).toBeInstanceOf(Error);
      expect(validationError).toBeInstanceOf(Error);
      expect(notFoundError).toBeInstanceOf(Error);
      expect(conflictError).toBeInstanceOf(Error);
    });

    test("deve funcionar com instanceof", () => {
      const error = new ValidationError("Teste");

      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ValidationError).toBe(true);
      expect(error instanceof NotFoundError).toBe(false);
    });
  });
});
