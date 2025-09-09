const { validationResult, param } = require("express-validator");
const { ValidationError } = require("../utils/errors");

class BaseValidator {
  static async validate(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => error.msg);
      throw new ValidationError(errorMessages.join(", "));
    }
  }

  static async validateId(req) {
    const validation = param("id")
      .isInt({ min: 1 })
      .withMessage("ID deve ser um número inteiro positivo");

    await validation.run(req);
    await this.validate(req);
  }
}

module.exports = BaseValidator;
