const BaseValidator = require("./BaseValidator");

class ProdutoValidator extends BaseValidator {
  static validateCreate(req) {
    const { nome, preco, estoque = 0 } = req.body;

    if (this.isEmpty(nome)) {
      return this.createError("Nome do produto é obrigatório");
    }

    if (!this.isPositiveNumber(preco)) {
      return this.createError(
        "Preço é obrigatório e deve ser um número maior que zero"
      );
    }

    if (!this.isNegativeNumber(estoque)) {
      return this.createError("Estoque deve ser um número positivo");
    }

    return this.createSuccess({
      nome: nome.trim(),
      preco: parseFloat(preco),
      estoque: parseInt(estoque),
    });
  }

  static validateUpdate(req) {
    const { id } = req.params;

    if (!this.isPositiveNumber(id)) {
      return this.createError("ID deve ser um número válido");
    }

    const bodyValidation = ProdutoValidator.validateCreate(req);
    if (!bodyValidation.isValid) {
      return bodyValidation;
    }

    return this.createSuccess({
      id: parseInt(id),
      ...bodyValidation.data,
    });
  }

  static validateFind(req) {
    const { id } = req.params;

    if (!this.isPositiveNumber(id)) {
      return this.createError("ID deve ser um número válido");
    }

    return this.createSuccess({
      id: parseInt(id),
    });
  }

  static validateGetAll(req) {
    const { page = 1, limit = 10, search = "" } = req.query;

    if (!this.isValidNumber(page) || parseInt(page) < 1) {
      return this.createError("Página deve ser um número maior que zero");
    }

    if (
      !this.isValidNumber(limit) ||
      parseInt(limit) < 1 ||
      parseInt(limit) > 100
    ) {
      return this.createError("Limite deve ser um número entre 1 e 100");
    }

    return this.createSuccess({
      page: parseInt(page),
      limit: parseInt(limit),
      search: search.toString().trim(),
    });
  }

  static validateDelete(req) {
    return this.validateFind(req);
  }
}

module.exports = ProdutoValidator;
