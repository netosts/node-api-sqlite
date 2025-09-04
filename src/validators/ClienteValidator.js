const BaseValidator = require("./BaseValidator");

class ClienteValidator extends BaseValidator {
  static validateCreate(req) {
    const { nome, email } = req.body;

    if (this.isEmpty(nome)) {
      return this.createError("Nome do cliente é obrigatório");
    }

    if (this.isEmpty(email)) {
      return this.createError("Email do cliente é obrigatório");
    }

    if (!this.isValidEmail(email.trim())) {
      return this.createError("Email deve ter um formato válido");
    }

    return this.createSuccess({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
    });
  }

  static validateUpdate(req) {
    const { id } = req.params;

    if (!this.isPositiveNumber(id)) {
      return this.createError("ID deve ser um número válido");
    }

    const bodyValidation = ClienteValidator.validateCreate(req);
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

  static validateFindAll(req) {
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
    return ClienteValidator.validateFind(req);
  }

  static validateFindByEmail(req) {
    const { email } = req.body;

    if (this.isEmpty(email)) {
      return this.createError("Email é obrigatório");
    }

    if (!this.isValidEmail(email.trim())) {
      return this.createError("Email deve ter um formato válido");
    }

    return this.createSuccess({
      email: email.trim().toLowerCase(),
    });
  }
}

module.exports = ClienteValidator;
