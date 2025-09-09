const { body } = require("express-validator");
const BaseValidator = require("./baseValidator");

class ClienteValidator extends BaseValidator {
  static validateCreate(req) {
    const validations = [
      body("nome")
        .notEmpty()
        .withMessage("Nome é obrigatório")
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
      body("email").isEmail().withMessage("Email deve ter um formato válido"),
    ];

    validations.forEach((validation) => validation.run(req));
    super.validate(req);
  }

  static validateUpdate(req) {
    const validations = [
      body("nome")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
      body("email")
        .optional()
        .isEmail()
        .withMessage("Email deve ter um formato válido"),
    ];

    validations.forEach((validation) => validation.run(req));
    super.validate(req);
  }
}

module.exports = ClienteValidator;
