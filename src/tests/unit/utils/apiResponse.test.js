const ApiResponse = require("../../../utils/apiResponse");
const {
  AppError,
  ValidationError,
  NotFoundError,
} = require("../../../utils/errors");

// Mock do objeto response do Express
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("ApiResponse", () => {
  let mockRes;

  beforeEach(() => {
    mockRes = createMockResponse();
  });

  describe("success", () => {
    test("deve retornar resposta de sucesso com dados", () => {
      const data = { id: 1, nome: "Teste" };
      const message = "Operação bem-sucedida";

      ApiResponse.success(mockRes, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data,
      });
    });

    test("deve retornar resposta de sucesso sem dados", () => {
      const message = "Operação realizada";

      ApiResponse.success(mockRes, null, message);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
      });
    });

    test("deve usar mensagem padrão quando não fornecida", () => {
      const data = { id: 1 };

      ApiResponse.success(mockRes, data);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Operação realizada com sucesso",
        data,
      });
    });

    test("deve usar status code customizado", () => {
      const data = { id: 1 };

      ApiResponse.success(mockRes, data, "Sucesso", 202);

      expect(mockRes.status).toHaveBeenCalledWith(202);
    });
  });

  describe("created", () => {
    test("deve retornar resposta de criação com status 201", () => {
      const data = { id: 1, nome: "Novo Item" };
      const message = "Item criado";

      ApiResponse.created(mockRes, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data,
      });
    });

    test("deve usar mensagem padrão para criação", () => {
      const data = { id: 1 };

      ApiResponse.created(mockRes, data);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Recurso criado com sucesso",
        data,
      });
    });
  });

  describe("noContent", () => {
    test("deve retornar resposta 204 sem conteúdo", () => {
      ApiResponse.noContent(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalledWith();
    });
  });

  describe("error", () => {
    test("deve retornar resposta de erro genérico", () => {
      const error = new Error("Erro genérico");

      ApiResponse.error(mockRes, error, "Mensagem de erro", 500);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Mensagem de erro",
          status: 500,
        },
      });
    });

    test("deve usar propriedades do AppError", () => {
      const error = new ValidationError("Dados inválidos");

      ApiResponse.error(mockRes, error);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Dados inválidos",
          status: 400,
        },
      });
    });

    test("deve incluir detalhes quando fornecidos", () => {
      const error = new Error("Erro");
      const details = { field: "nome", value: "inválido" };

      ApiResponse.error(mockRes, error, "Erro de validação", 400, details);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Erro de validação",
          status: 400,
          details,
        },
      });
    });

    test("deve usar valores padrão", () => {
      const error = new Error("Erro");

      ApiResponse.error(mockRes, error);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Erro interno do servidor",
          status: 500,
        },
      });
    });
  });

  describe("validationError", () => {
    test("deve retornar erro de validação com status 400", () => {
      const message = "Dados inválidos";
      const details = { fields: ["nome", "email"] };

      ApiResponse.validationError(mockRes, message, details);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message,
          status: 400,
          details,
        },
      });
    });

    test("deve usar mensagem padrão para validação", () => {
      ApiResponse.validationError(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Dados inválidos",
          status: 400,
        },
      });
    });
  });

  describe("notFound", () => {
    test("deve retornar erro 404", () => {
      const message = "Produto não encontrado";

      ApiResponse.notFound(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message,
          status: 404,
        },
      });
    });

    test("deve usar mensagem padrão para 404", () => {
      ApiResponse.notFound(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Recurso não encontrado",
          status: 404,
        },
      });
    });
  });

  describe("conflict", () => {
    test("deve retornar erro 409", () => {
      const message = "Email já existe";

      ApiResponse.conflict(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message,
          status: 409,
        },
      });
    });

    test("deve usar mensagem padrão para conflito", () => {
      ApiResponse.conflict(mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message: "Conflito de dados",
          status: 409,
        },
      });
    });
  });

  describe("unauthorized", () => {
    test("deve retornar erro 401", () => {
      const message = "Token inválido";

      ApiResponse.unauthorized(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message,
          status: 401,
        },
      });
    });
  });

  describe("forbidden", () => {
    test("deve retornar erro 403", () => {
      const message = "Sem permissão";

      ApiResponse.forbidden(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: {
          message,
          status: 403,
        },
      });
    });
  });

  describe("paginated", () => {
    test("deve retornar dados paginados", () => {
      const data = {
        data: [{ id: 1 }, { id: 2 }],
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 2,
          total_pages: 1,
        },
      };

      ApiResponse.paginated(mockRes, data, "Dados obtidos");

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Dados obtidos",
        data,
      });
    });

    test("deve usar mensagem padrão para paginação", () => {
      const data = { data: [], pagination: {} };

      ApiResponse.paginated(mockRes, data);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Dados obtidos com sucesso",
        data,
      });
    });
  });
});
