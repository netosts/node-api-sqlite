const BaseRepository = require("../../repositories/baseRepository");
const { getDatabase } = require("../../config/database");

// Mock do banco de dados
jest.mock("../../config/database");

describe("BaseRepository", () => {
  let repository;
  let mockDb;

  beforeEach(() => {
    // Criar mocks para o banco de dados
    mockDb = {
      all: jest.fn(),
      get: jest.fn(),
      run: jest.fn(),
      serialize: jest.fn((callback) => callback()),
    };

    getDatabase.mockReturnValue(mockDb);

    // Criar uma instância de teste do BaseRepository
    repository = new BaseRepository("test_table", ["field1", "field2"]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("constructor", () => {
    test("deve inicializar com tableName e fields corretos", () => {
      expect(repository.tableName).toBe("test_table");
      expect(repository.fields).toEqual(["field1", "field2"]);
    });
  });

  describe("getAll", () => {
    test("deve retornar dados paginados sem busca", async () => {
      const mockRecords = [
        { id: 1, field1: "valor1", field2: "valor2" },
        { id: 2, field1: "valor3", field2: "valor4" },
      ];

      const mockCountResult = { total: 10 };

      // Mock para a query de contagem
      mockDb.get
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, mockCountResult);
        })
        // Mock para a query de dados
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { total: 10 });
        });

      mockDb.all.mockImplementationOnce((sql, params, callback) => {
        callback(null, mockRecords);
      });

      const result = await repository.getAll({ page: 1, limit: 5 });

      expect(result).toEqual({
        data: mockRecords,
        pagination: {
          current_page: 1,
          per_page: 5,
          total_items: 10,
          total_pages: 2,
          has_next: true,
          has_prev: false,
        },
      });
    });

    test("deve aplicar busca corretamente", async () => {
      const mockRecords = [{ id: 1, field1: "search_value" }];
      const mockCountResult = { total: 1 };

      mockDb.get
        .mockImplementationOnce((sql, params, callback) => {
          expect(sql).toContain("WHERE");
          expect(sql).toContain("field1 LIKE");
          expect(params).toContain("%search%");
          callback(null, mockCountResult);
        })
        .mockImplementationOnce((sql, params, callback) => {
          callback(null, { total: 1 });
        });

      mockDb.all.mockImplementationOnce((sql, params, callback) => {
        expect(sql).toContain("WHERE");
        expect(sql).toContain("field1 LIKE");
        callback(null, mockRecords);
      });

      const result = await repository.getAll({
        page: 1,
        limit: 5,
        search: "search",
        searchFields: ["field1"],
      });

      expect(result.data).toEqual(mockRecords);
    });

    test("deve rejeitar em caso de erro no banco", async () => {
      const error = new Error("Database error");
      mockDb.get.mockImplementationOnce((sql, params, callback) => {
        callback(error);
      });

      await expect(repository.getAll()).rejects.toThrow("Database error");
    });
  });

  describe("find", () => {
    test("deve retornar registro por ID", async () => {
      const mockRecord = { id: 1, field1: "valor1", field2: "valor2" };

      mockDb.get.mockImplementationOnce((sql, params, callback) => {
        expect(sql).toContain("WHERE id = ?");
        expect(params).toEqual([1]);
        callback(null, mockRecord);
      });

      const result = await repository.find(1);

      expect(result).toEqual(mockRecord);
    });

    test("deve retornar null se registro não encontrado", async () => {
      mockDb.get.mockImplementationOnce((sql, params, callback) => {
        callback(null, null);
      });

      const result = await repository.find(999);

      expect(result).toBeNull();
    });

    test("deve rejeitar em caso de erro", async () => {
      const error = new Error("Database error");
      mockDb.get.mockImplementationOnce((sql, params, callback) => {
        callback(error);
      });

      await expect(repository.find(1)).rejects.toThrow("Database error");
    });
  });

  describe("getWhere", () => {
    test("deve buscar registros por campo específico", async () => {
      const mockRecords = [
        { id: 1, field1: "valor_especifico" },
        { id: 2, field1: "valor_especifico" },
      ];

      mockDb.all.mockImplementationOnce((sql, params, callback) => {
        expect(sql).toContain("WHERE field1 = ?");
        expect(params).toEqual(["valor_especifico"]);
        callback(null, mockRecords);
      });

      const result = await repository.getWhere("field1", "valor_especifico");

      expect(result).toEqual(mockRecords);
    });

    test("deve rejeitar em caso de erro", async () => {
      const error = new Error("Database error");
      mockDb.all.mockImplementationOnce((sql, params, callback) => {
        callback(error);
      });

      await expect(repository.getWhere("field1", "valor")).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("create", () => {
    test("deve criar novo registro", async () => {
      const data = { field1: "novo_valor1", field2: "novo_valor2" };
      const mockLastID = 5;

      mockDb.run.mockImplementationOnce(function (sql, params, callback) {
        expect(sql).toContain("INSERT INTO test_table");
        expect(sql).toContain("(field1, field2)");
        expect(sql).toContain("VALUES (?, ?)");
        expect(params).toEqual(["novo_valor1", "novo_valor2"]);

        // Simular o contexto do SQLite
        this.lastID = mockLastID;
        callback.call(this, null);
      });

      const result = await repository.create(data);

      expect(result).toEqual({
        id: mockLastID,
        ...data,
      });
    });

    test("deve ignorar campos não permitidos", async () => {
      const data = {
        field1: "valor1",
        field2: "valor2",
        campo_invalido: "valor_invalido",
      };

      mockDb.run.mockImplementationOnce(function (sql, params, callback) {
        expect(sql).not.toContain("campo_invalido");
        expect(params).toEqual(["valor1", "valor2"]);
        this.lastID = 1;
        callback.call(this, null);
      });

      await repository.create(data);
    });

    test("deve rejeitar em caso de erro", async () => {
      const error = new Error("Database error");
      const data = { field1: "valor1" };

      mockDb.run.mockImplementationOnce((sql, params, callback) => {
        callback(error);
      });

      await expect(repository.create(data)).rejects.toThrow("Database error");
    });
  });

  describe("update", () => {
    test("deve atualizar registro existente", async () => {
      const id = 1;
      const data = { field1: "valor_atualizado" };
      const mockUpdatedRecord = {
        id: 1,
        field1: "valor_atualizado",
        field2: "valor_original",
      };

      mockDb.run.mockImplementationOnce(function (sql, params, callback) {
        expect(sql).toContain("UPDATE test_table SET");
        expect(sql).toContain("field1 = ?");
        expect(sql).toContain("WHERE id = ?");
        expect(params).toEqual(["valor_atualizado", 1]);

        this.changes = 1;
        callback.call(this, null);
      });

      mockDb.get.mockImplementationOnce((sql, params, callback) => {
        expect(sql).toContain("SELECT * FROM test_table WHERE id = ?");
        expect(params).toEqual([1]);
        callback(null, mockUpdatedRecord);
      });

      const result = await repository.update(id, data);

      expect(result).toEqual(mockUpdatedRecord);
    });

    test("deve ignorar campos não permitidos", async () => {
      const id = 1;
      const data = {
        field1: "valor_atualizado",
        campo_invalido: "valor_invalido",
      };

      mockDb.run.mockImplementationOnce(function (sql, params, callback) {
        expect(sql).not.toContain("campo_invalido");
        expect(params).toEqual(["valor_atualizado", 1]);
        this.changes = 1;
        callback.call(this, null);
      });

      mockDb.get.mockImplementationOnce((sql, params, callback) => {
        callback(null, { id: 1, field1: "valor_atualizado" });
      });

      await repository.update(id, data);
    });

    test("deve rejeitar em caso de erro na atualização", async () => {
      const error = new Error("Database error");
      const id = 1;
      const data = { field1: "valor" };

      mockDb.run.mockImplementationOnce((sql, params, callback) => {
        callback(error);
      });

      await expect(repository.update(id, data)).rejects.toThrow(
        "Database error"
      );
    });

    test("deve rejeitar em caso de erro na busca do registro atualizado", async () => {
      const error = new Error("Select error");
      const id = 1;
      const data = { field1: "valor" };

      mockDb.run.mockImplementationOnce(function (sql, params, callback) {
        this.changes = 1;
        callback.call(this, null);
      });

      mockDb.get.mockImplementationOnce((sql, params, callback) => {
        callback(error);
      });

      await expect(repository.update(id, data)).rejects.toThrow("Select error");
    });
  });

  describe("delete", () => {
    test("deve deletar registro por ID", async () => {
      const id = 1;

      mockDb.run.mockImplementationOnce(function (sql, params, callback) {
        expect(sql).toContain("DELETE FROM test_table WHERE id = ?");
        expect(params).toEqual([1]);

        this.changes = 1;
        callback.call(this, null);
      });

      const result = await repository.delete(id);

      expect(result).toEqual({
        id: 1,
        changes: 1,
      });
    });

    test("deve rejeitar em caso de erro", async () => {
      const error = new Error("Database error");
      const id = 1;

      mockDb.run.mockImplementationOnce((sql, params, callback) => {
        callback(error);
      });

      await expect(repository.delete(id)).rejects.toThrow("Database error");
    });
  });
});
