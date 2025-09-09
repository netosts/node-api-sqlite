const { AppError, ValidationError } = require("../utils/errors");
const ApiResponse = require("../utils/apiResponse");

/**
 * Middleware para tratamento centralizado de erros
 */
const errorHandler = (error, req, res, next) => {
  console.error("Erro capturado:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Se já foi enviada uma resposta, delega para o handler padrão do Express
  if (res.headersSent) {
    return next(error);
  }

  // Erro de validação customizado
  if (error instanceof ValidationError) {
    return ApiResponse.error(res, error, error.message, error.statusCode);
  }

  // Erro operacional customizado
  if (error instanceof AppError) {
    return ApiResponse.error(res, error, error.message, error.statusCode);
  }

  // Erro de validação do SQLite (email duplicado, etc.)
  if (error.message && error.message.includes("UNIQUE constraint failed")) {
    return ApiResponse.error(res, error, "Este email já está cadastrado", 409);
  }

  // Erro de sintaxe SQL
  if (error.message && error.message.includes("SQLITE_")) {
    return ApiResponse.error(
      res,
      error,
      "Erro na operação do banco de dados",
      500
    );
  }

  // Erro de validação do Express Validator
  if (error.array && typeof error.array === "function") {
    const errors = error.array();
    const errorMessages = errors.map((err) => err.msg).join(", ");
    return ApiResponse.error(res, error, errorMessages, 400);
  }

  // Erro de JSON malformado
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return ApiResponse.error(
      res,
      error,
      "JSON inválido no corpo da requisição",
      400
    );
  }

  // Erro 404 - Rota não encontrada
  if (error.status === 404) {
    return ApiResponse.notFound(res, "Recurso não encontrado");
  }

  // Erro genérico do servidor
  return ApiResponse.error(res, error, "Erro interno do servidor", 500);
};

/**
 * Middleware para capturar rotas não encontradas (404)
 */
const notFoundHandler = (req, res, next) => {
  return ApiResponse.notFound(
    res,
    `Rota ${req.method} ${req.url} não encontrada`
  );
};

/**
 * Wrapper para funções async que captura erros automaticamente
 */
const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
