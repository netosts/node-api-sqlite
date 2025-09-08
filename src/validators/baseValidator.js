const { validationResult } = require("express-validator");

class BaseValidator {
  static validate(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Dados de entrada inválidos");
      error.status = 400;
      error.details = errors.array();
      throw error;
    }
  }
}

module.exports = BaseValidator;
