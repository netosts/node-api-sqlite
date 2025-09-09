const { AppError } = require("./errors");

/**
 * Classe para padronizar respostas HTTP
 */
class ApiResponse {
  /**
   * Resposta de sucesso genérica
   * @param {Object} res - Objeto de resposta do Express
   * @param {Object} data - Dados a serem retornados
   * @param {string} message - Mensagem de sucesso
   * @param {number} statusCode - Código de status HTTP
   */
  static success(
    res,
    data = null,
    message = "Operação realizada com sucesso",
    statusCode = 200
  ) {
    const response = {
      success: true,
      message,
    };

    if (data !== null) {
      response.data = data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Resposta de criação bem-sucedida (201)
   * @param {Object} res - Objeto de resposta do Express
   * @param {Object} data - Dados criados
   * @param {string} message - Mensagem de sucesso
   */
  static created(res, data, message = "Recurso criado com sucesso") {
    return this.success(res, data, message, 201);
  }

  /**
   * Resposta sem conteúdo (204)
   * @param {Object} res - Objeto de resposta do Express
   */
  static noContent(res) {
    return res.status(204).send();
  }

  /**
   * Resposta de erro
   * @param {Object} res - Objeto de resposta do Express
   * @param {string} message - Mensagem de erro
   * @param {number} statusCode - Código de status HTTP
   * @param {Object} details - Detalhes adicionais do erro
   */
  static error(
    res,
    error,
    message = "Erro interno do servidor",
    statusCode = 500,
    details = null
  ) {
    if (error instanceof AppError) {
      message = error.message;
      statusCode = error.statusCode;
    }

    const response = {
      success: false,
      error: {
        message,
        status: statusCode,
      },
    };

    if (details) {
      response.error.details = details;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Resposta de erro de validação (400)
   * @param {Object} res - Objeto de resposta do Express
   * @param {string} message - Mensagem de erro
   * @param {Object} details - Detalhes da validação
   */
  static validationError(res, message = "Dados inválidos", details = null) {
    return this.error(res, null, message, 400, details);
  }

  /**
   * Resposta de não encontrado (404)
   * @param {Object} res - Objeto de resposta do Express
   * @param {string} message - Mensagem de erro
   */
  static notFound(res, message = "Recurso não encontrado") {
    return this.error(res, null, message, 404);
  }

  /**
   * Resposta de conflito (409)
   * @param {Object} res - Objeto de resposta do Express
   * @param {string} message - Mensagem de erro
   */
  static conflict(res, message = "Conflito de dados") {
    return this.error(res, null, message, 409);
  }

  /**
   * Resposta de não autorizado (401)
   * @param {Object} res - Objeto de resposta do Express
   * @param {string} message - Mensagem de erro
   */
  static unauthorized(res, message = "Não autorizado") {
    return this.error(res, null, message, 401);
  }

  /**
   * Resposta de acesso negado (403)
   * @param {Object} res - Objeto de resposta do Express
   * @param {string} message - Mensagem de erro
   */
  static forbidden(res, message = "Acesso negado") {
    return this.error(res, null, message, 403);
  }

  /**
   * Resposta com dados paginados
   * @param {Object} res - Objeto de resposta do Express
   * @param {Object} data - Dados com paginação
   * @param {string} message - Mensagem de sucesso
   */
  static paginated(res, data, message = "Dados obtidos com sucesso") {
    return this.success(res, data, message);
  }
}

module.exports = ApiResponse;
