/**
 * Classe base para erros customizados da aplicação
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro de validação (400)
 */
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "ValidationError";
  }
}

/**
 * Erro de não encontrado (404)
 */
class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Erro de conflito (409)
 */
class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * Erro de autorização (401)
 */
class UnauthorizedError extends AppError {
  constructor(message = "Não autorizado") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Erro de acesso negado (403)
 */
class ForbiddenError extends AppError {
  constructor(message = "Acesso negado") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Erro de bad request (400)
 */
class BadRequestError extends AppError {
  constructor(message) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
};
