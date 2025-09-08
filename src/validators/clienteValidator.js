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
      body("telefone")
        .optional()
        .isMobilePhone("pt-BR")
        .withMessage("Telefone deve ter um formato válido"),
    ];

    validations.forEach((validation) => validation.run(req));
    super.validate(req);
  }

  static validateGetAll(req) {
    const validations = [
      query("page")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Página deve ser um número inteiro positivo"),
      query("limit")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Limite deve ser entre 1 e 100"),
      query("search")
        .optional()
        .isLength({ min: 2 })
        .withMessage("Busca deve ter pelo menos 2 caracteres"),
      query("orderBy")
        .optional()
        .isIn(["nome", "email", "created_at"])
        .withMessage("Ordenação deve ser por: nome, email ou created_at"),
      query("order")
        .optional()
        .isIn(["ASC", "DESC"])
        .withMessage("Ordem deve ser ASC ou DESC"),
    ];

    validations.forEach((validation) => validation.run(req));
    super.validate(req);
  }

  static validateId(req) {
    const validations = [
      param("id")
        .isInt({ min: 1 })
        .withMessage("ID deve ser um número inteiro positivo"),
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
      body("telefone")
        .optional()
        .isMobilePhone("pt-BR")
        .withMessage("Telefone deve ter um formato válido"),
    ];

    validations.forEach((validation) => validation.run(req));
    super.validate(req);
  }
}

module.exports = ClienteValidator;
