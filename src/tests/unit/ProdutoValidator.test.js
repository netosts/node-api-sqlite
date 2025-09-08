const ProdutoValidator = require("../../validators/ProdutoValidator");
const produtoFixtures = require("../fixtures/produtoFixtures");

describe("ProdutoValidator", () => {
  describe("validateCreate", () => {
    test("deve validar dados corretos de criação", () => {
      const req = {
        body: produtoFixtures.produtoValido,
      };

      const result = ProdutoValidator.validateCreate(req);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({
        nome: "Produto Teste",
        preco: 99.99,
        estoque: 50,
      });
    });

    test("deve validar produto sem estoque (usar padrão 0)", () => {
      const req = {
        body: {
          nome: "Produto Teste",
          preco: 99.99,
        },
      };

      const result = ProdutoValidator.validateCreate(req);

      expect(result.isValid).toBe(true);
      expect(result.data.estoque).toBe(0);
    });

    test("deve rejeitar produto sem nome", () => {
      const req = {
        body: produtoFixtures.produtoSemNome,
      };

      const result = ProdutoValidator.validateCreate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("Nome do produto é obrigatório");
      expect(result.error.status).toBe(400);
    });

    test("deve rejeitar produto sem preço", () => {
      const req = {
        body: produtoFixtures.produtoSemPreco,
      };

      const result = ProdutoValidator.validateCreate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("Preço é obrigatório");
    });

    test("deve rejeitar produto com preço negativo", () => {
      const req = {
        body: produtoFixtures.produtoPrecoNegativo,
      };

      const result = ProdutoValidator.validateCreate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("maior que zero");
    });

    test("deve rejeitar produto com estoque negativo", () => {
      const req = {
        body: produtoFixtures.produtoEstoqueNegativo,
      };

      const result = ProdutoValidator.validateCreate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("não negativo");
    });

    test("deve limpar espaços em branco do nome", () => {
      const req = {
        body: {
          nome: "  Produto com espaços  ",
          preco: 99.99,
          estoque: 10,
        },
      };

      const result = ProdutoValidator.validateCreate(req);

      expect(result.isValid).toBe(true);
      expect(result.data.nome).toBe("Produto com espaços");
    });
  });

  describe("validateUpdate", () => {
    test("deve validar atualização correta", () => {
      const req = {
        params: { id: "1" },
        body: produtoFixtures.dadosAtualizacao,
      };

      const result = ProdutoValidator.validateUpdate(req);

      expect(result.isValid).toBe(true);
      expect(result.data.id).toBe(1);
      expect(result.data.nome).toBe("Produto Atualizado");
    });

    test("deve rejeitar ID inválido", () => {
      const req = {
        params: { id: "abc" },
        body: produtoFixtures.produtoValido,
      };

      const result = ProdutoValidator.validateUpdate(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("ID deve ser um número válido");
    });
  });

  describe("validateFind", () => {
    test("deve validar ID correto", () => {
      const req = {
        params: { id: "123" },
      };

      const result = ProdutoValidator.validateFind(req);

      expect(result.isValid).toBe(true);
      expect(result.data.id).toBe(123);
    });

    test("deve rejeitar ID inválido", () => {
      const req = {
        params: { id: "invalid" },
      };

      const result = ProdutoValidator.validateFind(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("ID deve ser um número válido");
    });
  });

  describe("validateGetAll", () => {
    test("deve validar parâmetros padrão", () => {
      const req = {
        query: {},
      };

      const result = ProdutoValidator.validateGetAll(req);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({
        page: 1,
        limit: 10,
        search: "",
      });
    });

    test("deve validar parâmetros customizados", () => {
      const req = {
        query: {
          page: "2",
          limit: "5",
          search: "produto",
        },
      };

      const result = ProdutoValidator.validateGetAll(req);

      expect(result.isValid).toBe(true);
      expect(result.data).toEqual({
        page: 2,
        limit: 5,
        search: "produto",
      });
    });

    test("deve rejeitar página inválida", () => {
      const req = {
        query: { page: "0" },
      };

      const result = ProdutoValidator.validateGetAll(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain(
        "Página deve ser um número maior que zero"
      );
    });

    test("deve rejeitar limite muito alto", () => {
      const req = {
        query: { limit: "101" },
      };

      const result = ProdutoValidator.validateGetAll(req);

      expect(result.isValid).toBe(false);
      expect(result.error.message).toContain("entre 1 e 100");
    });
  });

  describe("validateDelete", () => {
    test("deve validar deleção correta", () => {
      const req = {
        params: { id: "5" },
      };

      const result = ProdutoValidator.validateDelete(req);

      expect(result.isValid).toBe(true);
      expect(result.data.id).toBe(5);
    });
  });
});
