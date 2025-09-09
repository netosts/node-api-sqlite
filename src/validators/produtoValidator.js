const { body } = require("express-validator");
const BaseValidator = require("./baseValidator");

class ProdutoValidator extends BaseValidator {
  static async validateCreate(req) {
    const validations = [
      body("nome")
        .notEmpty()
        .withMessage("Nome é obrigatório")
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
      body("preco")
        .isFloat({ min: 0 })
        .withMessage("Preço deve ser um número positivo"),
      body("estoque")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Estoque deve ser um número inteiro positivo"),
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
      body("preco")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Preço deve ser um número positivo"),
      body("estoque")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Estoque deve ser um número inteiro positivo"),
    ];

    await Promise.all(validations.map((validation) => validation.run(req)));
    await super.validate(req);
  }

  static async validateId(req) {
    return await super.validateId(req);
  }
}

module.exports = ProdutoValidator;
