const { AppError } = require("../utils/errors");
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

  // Erro operacional customizado
  if (error instanceof AppError) {
    return ApiResponse.error(res, error.message, error.statusCode);
  }

  // Erro de validação do SQLite (email duplicado, etc.)
  if (error.message && error.message.includes("UNIQUE constraint failed")) {
    if (error.message.includes("email")) {
      return ApiResponse.conflict(res, "Este email já está cadastrado");
    }
    return ApiResponse.conflict(res, "Dados duplicados não permitidos");
  }

  // Erro de sintaxe SQL
  if (error.message && error.message.includes("SQLITE_")) {
    return ApiResponse.error(res, "Erro no banco de dados", 500);
  }

  // Erro de validação do Express Validator
  if (error.array && typeof error.array === "function") {
    const validationErrors = error.array();
    return ApiResponse.validationError(
      res,
      "Dados inválidos",
      validationErrors
    );
  }

  // Erro de JSON malformado
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return ApiResponse.validationError(res, "JSON malformado na requisição");
  }

  // Erro 404 - Rota não encontrada
  if (error.status === 404) {
    return ApiResponse.notFound(res, "Rota não encontrada");
  }

  // Erro genérico do servidor
  return ApiResponse.error(res, "Erro interno do servidor", 500);
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
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
};
