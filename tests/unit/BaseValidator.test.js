const BaseValidator = require("../../src/validators/BaseValidator");

describe("BaseValidator", () => {
  describe("isValidEmail", () => {
    test("deve validar emails corretos", () => {
      const emailsValidos = [
        "test@example.com",
        "user.name@domain.com",
        "user+tag@example.co.uk",
        "user123@test-domain.com",
      ];

      emailsValidos.forEach((email) => {
        expect(BaseValidator.isValidEmail(email)).toBe(true);
      });
    });

    test("deve rejeitar emails inválidos", () => {
      const emailsInvalidos = [
        "email-sem-arroba",
        "@domain.com",
        "user@",
        "user..name@domain.com",
        "user@domain",
        "",
        null,
        undefined,
      ];

      emailsInvalidos.forEach((email) => {
        expect(BaseValidator.isValidEmail(email)).toBe(false);
      });
    });
  });

  describe("isValidNumber", () => {
    test("deve validar números corretos", () => {
      const numerosValidos = [0, 1, -1, 100.5, "123", "45.67"];

      numerosValidos.forEach((numero) => {
        expect(BaseValidator.isValidNumber(numero)).toBe(true);
      });
    });

    test("deve rejeitar valores inválidos", () => {
      const valoresInvalidos = [
        "abc",
        "",
        null,
        undefined,
        NaN,
        Infinity,
        -Infinity,
      ];

      valoresInvalidos.forEach((valor) => {
        expect(BaseValidator.isValidNumber(valor)).toBe(false);
      });
    });
  });

  describe("isPositiveNumber", () => {
    test("deve validar números positivos", () => {
      const numerosPositivos = [1, 100, 0.1, "5", "99.99"];

      numerosPositivos.forEach((numero) => {
        expect(BaseValidator.isPositiveNumber(numero)).toBe(true);
      });
    });

    test("deve rejeitar números não positivos", () => {
      const numerosNaoPositivos = [0, -1, -100, "-5", "abc"];

      numerosNaoPositivos.forEach((numero) => {
        expect(BaseValidator.isPositiveNumber(numero)).toBe(false);
      });
    });
  });

  describe("isNonNegativeNumber", () => {
    test("deve validar números não negativos", () => {
      const numerosNaoNegativos = [0, 1, 100, 0.5, "0", "99.99"];

      numerosNaoNegativos.forEach((numero) => {
        expect(BaseValidator.isNonNegativeNumber(numero)).toBe(true);
      });
    });

    test("deve rejeitar números negativos", () => {
      const numerosNegativos = [-1, -100, "-5", "abc"];

      numerosNegativos.forEach((numero) => {
        expect(BaseValidator.isNonNegativeNumber(numero)).toBe(false);
      });
    });
  });

  describe("isNotEmpty", () => {
    test("deve validar strings não vazias", () => {
      const stringsValidas = ["texto", "a", "   texto   ", "123"];

      stringsValidas.forEach((str) => {
        expect(BaseValidator.isNotEmpty(str)).toBe(true);
      });
    });

    test("deve rejeitar strings vazias ou inválidas", () => {
      const stringsInvalidas = ["", "   ", null, undefined, 123, []];

      stringsInvalidas.forEach((str) => {
        expect(BaseValidator.isNotEmpty(str)).toBe(false);
      });
    });
  });

  describe("isValidId", () => {
    test("deve validar IDs corretos", () => {
      const idsValidos = [1, 2, 100, "1", "999"];

      idsValidos.forEach((id) => {
        expect(BaseValidator.isValidId(id)).toBe(true);
      });
    });

    test("deve rejeitar IDs inválidos", () => {
      const idsInvalidos = [0, -1, 1.5, "abc", "", null, undefined];

      idsInvalidos.forEach((id) => {
        expect(BaseValidator.isValidId(id)).toBe(false);
      });
    });
  });

  describe("createError", () => {
    test("deve criar objeto de erro com status padrão", () => {
      const error = BaseValidator.createError("Mensagem de erro");

      expect(error).toEqual({
        isValid: false,
        error: {
          message: "Mensagem de erro",
          status: 400,
        },
      });
    });

    test("deve criar objeto de erro com status customizado", () => {
      const error = BaseValidator.createError("Erro personalizado", 422);

      expect(error).toEqual({
        isValid: false,
        error: {
          message: "Erro personalizado",
          status: 422,
        },
      });
    });
  });

  describe("createSuccess", () => {
    test("deve criar objeto de sucesso sem dados", () => {
      const success = BaseValidator.createSuccess();

      expect(success).toEqual({
        isValid: true,
        data: null,
      });
    });

    test("deve criar objeto de sucesso com dados", () => {
      const dados = { nome: "Teste", id: 1 };
      const success = BaseValidator.createSuccess(dados);

      expect(success).toEqual({
        isValid: true,
        data: dados,
      });
    });
  });
});
