const { body } = require("express-validator");
const BaseValidator = require("./baseValidator");

class ProdutoValidator extends BaseValidator {
  static validateCreate(req) {
    const validations = [
      body("nome")
        .notEmpty()
        .withMessage("Nome é obrigatório")
        .isLength({ min: 2 })
        .withMessage("Nome deve ter pelo menos 2 caracteres"),
      body("preco")
        .isFloat({ min: 0 })
        .withMessage("Preço deve ser um número positivo"),
      body("descricao")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Descrição deve ter no máximo 500 caracteres"),
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
      body("preco")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Preço deve ser um número positivo"),
      body("descricao")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Descrição deve ter no máximo 500 caracteres"),
    ];

    validations.forEach((validation) => validation.run(req));
    super.validate(req);
  }
}

module.exports = ProdutoValidator;
