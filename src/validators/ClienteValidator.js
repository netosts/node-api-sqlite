const BaseValidator = require("./BaseValidator");

/**
 * Validator para operações de clientes
 */
class ClienteValidator extends BaseValidator {
  /**
   * Valida dados para criação de cliente
   * @param {Object} req - Objeto de request
   * @returns {Object} - Resultado da validação
   */
  static validateCreate(req) {
    const { nome, email } = req.body;

    // Validar nome
    if (!BaseValidator.isNotEmpty(nome)) {
      return BaseValidator.createError("Nome do cliente é obrigatório");
    }

    // Validar email
    if (!BaseValidator.isNotEmpty(email)) {
      return BaseValidator.createError("Email do cliente é obrigatório");
    }

    if (!BaseValidator.isValidEmail(email.trim())) {
      return BaseValidator.createError("Email deve ter um formato válido");
    }

    // Retornar dados validados e limpos
    return BaseValidator.createSuccess({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
    });
  }

  /**
   * Valida dados para atualização de cliente
   * @param {Object} req - Objeto de request
   * @returns {Object} - Resultado da validação
   */
  static validateUpdate(req) {
    const { id } = req.params;

    // Validar ID
    if (!BaseValidator.isValidId(id)) {
      return BaseValidator.createError("ID deve ser um número válido");
    }

    // Usar a mesma validação do create para o body
    const bodyValidation = ClienteValidator.validateCreate(req);
    if (!bodyValidation.isValid) {
      return bodyValidation;
    }

    // Retornar dados validados com ID
    return BaseValidator.createSuccess({
      id: parseInt(id),
      ...bodyValidation.data,
    });
  }

  /**
   * Valida parâmetros para busca por ID
   * @param {Object} req - Objeto de request
   * @returns {Object} - Resultado da validação
   */
  static validateFindById(req) {
    const { id } = req.params;

    if (!BaseValidator.isValidId(id)) {
      return BaseValidator.createError("ID deve ser um número válido");
    }

    return BaseValidator.createSuccess({
      id: parseInt(id),
    });
  }

  /**
   * Valida parâmetros para listagem com paginação
   * @param {Object} req - Objeto de request
   * @returns {Object} - Resultado da validação
   */
  static validateFindAll(req) {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Validar página
    if (!BaseValidator.isValidNumber(page) || parseInt(page) < 1) {
      return BaseValidator.createError(
        "Página deve ser um número maior que zero"
      );
    }

    // Validar limite
    if (
      !BaseValidator.isValidNumber(limit) ||
      parseInt(limit) < 1 ||
      parseInt(limit) > 100
    ) {
      return BaseValidator.createError(
        "Limite deve ser um número entre 1 e 100"
      );
    }

    return BaseValidator.createSuccess({
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.toString().trim(),
    });
  }

  /**
   * Valida parâmetros para deleção
   * @param {Object} req - Objeto de request
   * @returns {Object} - Resultado da validação
   */
  static validateDelete(req) {
    return ClienteValidator.validateFindById(req);
  }

  /**
   * Valida dados para busca por email
   * @param {Object} req - Objeto de request
   * @returns {Object} - Resultado da validação
   */
  static validateFindByEmail(req) {
    const { email } = req.body;

    if (!BaseValidator.isNotEmpty(email)) {
      return BaseValidator.createError("Email é obrigatório");
    }

    if (!BaseValidator.isValidEmail(email.trim())) {
      return BaseValidator.createError("Email deve ter um formato válido");
    }

    return BaseValidator.createSuccess({
      email: email.trim().toLowerCase(),
    });
  }
}

module.exports = ClienteValidator;
