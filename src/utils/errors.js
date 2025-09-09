/**
 * Erro base para erros operacionais da aplicação
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Erro específico para validação de dados
 */
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, true);
  }
}

/**
 * Erro para recursos não encontrados
 */
class NotFoundError extends AppError {
  constructor(message = "Recurso não encontrado") {
    super(message, 404, true);
  }
}

/**
 * Erro para conflitos (ex: email já existe)
 */
class ConflictError extends AppError {
  constructor(message) {
    super(message, 409, true);
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  ConflictError,
};
