const { validationResult, param } = require("express-validator");

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

  static validateId(req) {
    const validations = [
      param("id")
        .isInt({ min: 1 })
        .withMessage("ID deve ser um número inteiro positivo"),
    ];

    validations.forEach((validation) => validation.run(req));
    this.validate(req);
  }
}

module.exports = BaseValidator;
