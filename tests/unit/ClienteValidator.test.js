const ClienteValidator = require("../../src/validators/ClienteValidator");
const clienteFixtures = require("../fixtures/clienteFixtures");

describe("ClienteValidator", () => {
  describe("validateCreate", () => {
    test("deve validar dados corretos de criação", () => {
      const req = {
        body: clienteFixtures.clienteValido,
      };

      const result = ClienteValidator.validateCreate(req);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({
        nome: "Cliente Teste",
        email: "cliente@teste.com",
      });
    });

    test("deve converter email para lowercase", () => {
      const req = {
        body: {
          nome: "Cliente Teste",
          email: "CLIENTE@TESTE.COM",
        },
      };

      const result = ClienteValidator.validateCreate(req);

      expect(result.isValid).toBe(true);
      expect(result.data.email).toBe("cliente@teste.com");
    });

    test("deve rejeitar cliente sem nome", () => {
      const req = {
        body: clienteFixtures.clienteSemNome,
      };

      const result = ClienteValidator.validateCreate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("Nome do cliente é obrigatório");
      expect(result.error.status).toBe(400);
    });

    test("deve rejeitar cliente sem email", () => {
      const req = {
        body: clienteFixtures.clienteSemEmail,
      };

      const result = ClienteValidator.validateCreate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("Email do cliente é obrigatório");
    });

    test("deve rejeitar email inválido", () => {
      const req = {
        body: clienteFixtures.clienteEmailInvalido,
      };

      const result = ClienteValidator.validateCreate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("formato válido");
    });

    test("deve limpar espaços em branco", () => {
      const req = {
        body: {
          nome: "  Cliente com espaços  ",
          email: "  teste@email.com  ",
        },
      };

      const result = ClienteValidator.validateCreate(req);

      expect(result.isValid).toBe(true);
      expect(result.data.nome).toBe("Cliente com espaços");
      expect(result.data.email).toBe("teste@email.com");
    });
  });

  describe("validateUpdate", () => {
    test("deve validar atualização correta", () => {
      const req = {
        params: { id: "1" },
        body: clienteFixtures.dadosAtualizacao,
      };

      const result = ClienteValidator.validateUpdate(req);

      expect(result.isValid).toBe(true);
      expect(result.data.id).toBe(1);
      expect(result.data.nome).toBe("Cliente Atualizado");
      expect(result.data.email).toBe("atualizado@teste.com");
    });

    test("deve rejeitar ID inválido", () => {
      const req = {
        params: { id: "invalid" },
        body: clienteFixtures.clienteValido,
      };

      const result = ClienteValidator.validateUpdate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("ID deve ser um número válido");
    });

    test("deve rejeitar dados inválidos no corpo", () => {
      const req = {
        params: { id: "1" },
        body: clienteFixtures.clienteEmailInvalido,
      };

      const result = ClienteValidator.validateUpdate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("formato válido");
    });
  });

  describe("validateFindById", () => {
    test("deve validar ID correto", () => {
      const req = {
        params: { id: "456" },
      };

      const result = ClienteValidator.validateFindById(req);

      expect(result.isValid).toBe(true);
      expect(result.data.id).toBe(456);
    });

    test("deve rejeitar ID inválido", () => {
      const req = {
        params: { id: "abc" },
      };

      const result = ClienteValidator.validateFindById(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("ID deve ser um número válido");
    });
  });

  describe("validateFindAll", () => {
    test("deve validar parâmetros padrão", () => {
      const req = {
        query: {},
      };

      const result = ClienteValidator.validateFindAll(req);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({
        page: 1,
        limit: 10,
        search: "",
      });
    });

    test("deve validar busca por nome/email", () => {
      const req = {
        query: {
          search: "João",
        },
      };

      const result = ClienteValidator.validateFindAll(req);

      expect(result.isValid).toBe(true);
      expect(result.data.search).toBe("João");
    });

    test("deve rejeitar página negativa", () => {
      const req = {
        query: { page: "-1" },
      };

      const result = ClienteValidator.validateFindAll(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("maior que zero");
    });
  });

  describe("validateFindByEmail", () => {
    test("deve validar email correto", () => {
      const req = {
        body: { email: "teste@email.com" },
      };

      const result = ClienteValidator.validateFindByEmail(req);

      expect(result.isValid).toBe(true);
      expect(result.data.email).toBe("teste@email.com");
    });

    test("deve rejeitar email inválido", () => {
      const req = {
        body: { email: "email-invalido" },
      };

      const result = ClienteValidator.validateFindByEmail(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("formato válido");
    });
  });

  describe("validateDelete", () => {
    test("deve validar deleção correta", () => {
      const req = {
        params: { id: "10" },
      };

      const result = ClienteValidator.validateDelete(req);

      expect(result.isValid).toBe(true);
      expect(result.data.id).toBe(10);
    });
  });
});
