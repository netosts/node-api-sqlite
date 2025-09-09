const { body } = require("express-validator");
const BaseValidator = require("./baseValidator");

class ClienteValidator extends BaseValidator {
  static async validateCreate(req) {
    const validations = [
      body("nome")
        .notEmpty()
        .withMessage("Nome é obrigatório")
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
      body("email").isEmail().withMessage("Email deve ter um formato válido"),
    ];

    await Promise.all(validations.map((validation) => validation.run(req)));
    await super.validate(req);
  }

  static async validateUpdate(req) {
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

    await Promise.all(validations.map((validation) => validation.run(req)));
    await super.validate(req);
  }

  static async validateId(req) {
    return await super.validateId(req);
  }
}

module.exports = ClienteValidator;
