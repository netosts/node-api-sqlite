const BaseValidator = require("./BaseValidator");

/**
 * Validator para operações de produtos
 */
class ProdutoValidator extends BaseValidator {
  /**
   * Valida dados para criação de produto
   * @param {Object} req - Objeto de request
   * @returns {Object} - Resultado da validação
   */
  static validateCreate(req) {
    const { nome, preco, estoque = 0 } = req.body;

    // Validar nome
    if (!BaseValidator.isNotEmpty(nome)) {
      return BaseValidator.createError("Nome do produto é obrigatório");
    }

    // Validar preço
    if (!BaseValidator.isPositiveNumber(preco)) {
      return BaseValidator.createError(
        "Preço é obrigatório e deve ser um número maior que zero"
      );
    }

    // Validar estoque
    if (!BaseValidator.isNonNegativeNumber(estoque)) {
      return BaseValidator.createError(
        "Estoque deve ser um número não negativo"
      );
    }

    // Retornar dados validados e limpos
    return BaseValidator.createSuccess({
      nome: nome.trim(),
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
    });
  }

  /**
   * Valida dados para atualização de produto
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
    const bodyValidation = ProdutoValidator.validateCreate(req);
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
    return ProdutoValidator.validateFindById(req);
  }
}

module.exports = ProdutoValidator;
