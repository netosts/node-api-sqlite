const ClienteService = require("../../../services/clienteService");
const ClienteRepository = require("../../../repositories/clienteRepository");
const { NotFoundError, ConflictError } = require("../../../utils/errors");

// Mock do ClienteRepository
jest.mock("../../../repositories/clienteRepository");

describe("ClienteService", () => {
  let clienteService;
  let mockClienteRepository;

  beforeEach(() => {
    // Limpar mocks antes de cada teste
    jest.clearAllMocks();

    // Criar instância do service
    clienteService = new ClienteService();

    // Obter referência do mock do repository
    mockClienteRepository = clienteService.clienteRepository;
  });

  describe("create", () => {
    test("deve criar um cliente com dados válidos", async () => {
      // Arrange
      const clienteData = {
        nome: "João Silva",
        email: "joao@teste.com",
      };

      const clienteCriado = {
        id: 1,
        ...clienteData,
        data_criacao: "2023-01-01T00:00:00.000Z",
      };

      mockClienteRepository.emailExists.mockResolvedValue(false);
      mockClienteRepository.create.mockResolvedValue(clienteCriado);

      // Act
      const resultado = await clienteService.create(clienteData);

      // Assert
      expect(mockClienteRepository.emailExists).toHaveBeenCalledWith(
        clienteData.email
      );
      expect(mockClienteRepository.create).toHaveBeenCalledWith(clienteData);
      expect(resultado).toEqual(clienteCriado);
    });

    test("deve lançar ConflictError quando email já existe", async () => {
      // Arrange
      const clienteData = {
        nome: "João Silva",
        email: "joao@teste.com",
      };

      mockClienteRepository.emailExists.mockResolvedValue(true);

      // Act & Assert
      await expect(clienteService.create(clienteData)).rejects.toThrow(
        ConflictError
      );
      await expect(clienteService.create(clienteData)).rejects.toThrow(
        "Este email já está cadastrado"
      );
      expect(mockClienteRepository.emailExists).toHaveBeenCalledWith(
        clienteData.email
      );
      expect(mockClienteRepository.create).not.toHaveBeenCalled();
    });

    test("deve propagar erro do repository", async () => {
      // Arrange
      const clienteData = {
        nome: "João Silva",
        email: "joao@teste.com",
      };

      const erro = new Error("Erro de banco de dados");
      mockClienteRepository.emailExists.mockResolvedValue(false);
      mockClienteRepository.create.mockRejectedValue(erro);

      // Act & Assert
      await expect(clienteService.create(clienteData)).rejects.toThrow(erro);
      expect(mockClienteRepository.emailExists).toHaveBeenCalledWith(
        clienteData.email
      );
      expect(mockClienteRepository.create).toHaveBeenCalledWith(clienteData);
    });
  });

  describe("getAll", () => {
    test("deve retornar todos os clientes com opções padrão", async () => {
      // Arrange
      const clientes = [
        { id: 1, nome: "João Silva", email: "joao@teste.com" },
        { id: 2, nome: "Maria Santos", email: "maria@teste.com" },
      ];

      const resultadoEsperado = {
        data: clientes,
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 2,
          total_pages: 1,
        },
      };

      mockClienteRepository.getAll.mockResolvedValue(resultadoEsperado);

      // Act
      const resultado = await clienteService.getAll({});

      // Assert
      expect(mockClienteRepository.getAll).toHaveBeenCalledWith({});
      expect(resultado).toEqual(resultadoEsperado);
    });

    test("deve retornar clientes com opções de busca", async () => {
      // Arrange
      const opcoes = {
        search: "João",
        page: 2,
        limit: 5,
      };

      const clientes = [{ id: 1, nome: "João Silva", email: "joao@teste.com" }];

      const resultadoEsperado = {
        data: clientes,
        pagination: {
          current_page: 2,
          per_page: 5,
          total_items: 1,
          total_pages: 1,
        },
      };

      mockClienteRepository.getAll.mockResolvedValue(resultadoEsperado);

      // Act
      const resultado = await clienteService.getAll(opcoes);

      // Assert
      expect(mockClienteRepository.getAll).toHaveBeenCalledWith(opcoes);
      expect(resultado).toEqual(resultadoEsperado);
    });
  });

  describe("find", () => {
    test("deve retornar cliente quando encontrado", async () => {
      // Arrange
      const id = 1;
      const cliente = {
        id: 1,
        nome: "João Silva",
        email: "joao@teste.com",
      };

      mockClienteRepository.find.mockResolvedValue(cliente);

      // Act
      const resultado = await clienteService.find(id);

      // Assert
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
      expect(resultado).toEqual(cliente);
    });

    test("deve lançar NotFoundError quando cliente não encontrado", async () => {
      // Arrange
      const id = 999;
      mockClienteRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(clienteService.find(id)).rejects.toThrow(NotFoundError);
      await expect(clienteService.find(id)).rejects.toThrow(
        "Cliente não encontrado"
      );
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
    });
  });

  describe("update", () => {
    test("deve atualizar cliente quando existe e email não está em uso", async () => {
      // Arrange
      const id = 1;
      const dadosAtualizacao = {
        nome: "João Silva Atualizado",
        email: "joao.novo@teste.com",
      };

      const clienteExistente = {
        id: 1,
        nome: "João Silva",
        email: "joao@teste.com",
      };

      const clienteAtualizado = {
        ...clienteExistente,
        ...dadosAtualizacao,
      };

      mockClienteRepository.find.mockResolvedValue(clienteExistente);
      mockClienteRepository.emailExists.mockResolvedValue(false);
      mockClienteRepository.update.mockResolvedValue(clienteAtualizado);

      // Act
      const resultado = await clienteService.update(id, dadosAtualizacao);

      // Assert
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
      expect(mockClienteRepository.emailExists).toHaveBeenCalledWith(
        dadosAtualizacao.email,
        id
      );
      expect(mockClienteRepository.update).toHaveBeenCalledWith(
        id,
        dadosAtualizacao
      );
      expect(resultado).toEqual(clienteAtualizado);
    });

    test("deve atualizar cliente sem email", async () => {
      // Arrange
      const id = 1;
      const dadosAtualizacao = {
        nome: "João Silva Atualizado",
      };

      const clienteExistente = {
        id: 1,
        nome: "João Silva",
        email: "joao@teste.com",
      };

      const clienteAtualizado = {
        ...clienteExistente,
        ...dadosAtualizacao,
      };

      mockClienteRepository.find.mockResolvedValue(clienteExistente);
      mockClienteRepository.update.mockResolvedValue(clienteAtualizado);

      // Act
      const resultado = await clienteService.update(id, dadosAtualizacao);

      // Assert
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
      expect(mockClienteRepository.emailExists).not.toHaveBeenCalled();
      expect(mockClienteRepository.update).toHaveBeenCalledWith(
        id,
        dadosAtualizacao
      );
      expect(resultado).toEqual(clienteAtualizado);
    });

    test("deve lançar NotFoundError quando cliente não existe", async () => {
      // Arrange
      const id = 999;
      const dadosAtualizacao = {
        nome: "Cliente Atualizado",
      };

      mockClienteRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(clienteService.update(id, dadosAtualizacao)).rejects.toThrow(
        NotFoundError
      );
      await expect(clienteService.update(id, dadosAtualizacao)).rejects.toThrow(
        "Cliente não encontrado"
      );
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
      expect(mockClienteRepository.update).not.toHaveBeenCalled();
    });

    test("deve lançar ConflictError quando email já está em uso", async () => {
      // Arrange
      const id = 1;
      const dadosAtualizacao = {
        email: "email.usado@teste.com",
      };

      const clienteExistente = {
        id: 1,
        nome: "João Silva",
        email: "joao@teste.com",
      };

      mockClienteRepository.find.mockResolvedValue(clienteExistente);
      mockClienteRepository.emailExists.mockResolvedValue(true);

      // Act & Assert
      await expect(clienteService.update(id, dadosAtualizacao)).rejects.toThrow(
        ConflictError
      );
      await expect(clienteService.update(id, dadosAtualizacao)).rejects.toThrow(
        "Este email já está sendo usado por outro cliente"
      );
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
      expect(mockClienteRepository.emailExists).toHaveBeenCalledWith(
        dadosAtualizacao.email,
        id
      );
      expect(mockClienteRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    test("deve deletar cliente quando existe", async () => {
      // Arrange
      const id = 1;
      const clienteExistente = {
        id: 1,
        nome: "João Silva",
        email: "joao@teste.com",
      };

      mockClienteRepository.find.mockResolvedValue(clienteExistente);
      mockClienteRepository.delete.mockResolvedValue(true);

      // Act
      const resultado = await clienteService.delete(id);

      // Assert
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
      expect(mockClienteRepository.delete).toHaveBeenCalledWith(id);
      expect(resultado).toBe(true);
    });

    test("deve lançar NotFoundError quando cliente não existe", async () => {
      // Arrange
      const id = 999;
      mockClienteRepository.find.mockResolvedValue(null);

      // Act & Assert
      await expect(clienteService.delete(id)).rejects.toThrow(NotFoundError);
      await expect(clienteService.delete(id)).rejects.toThrow(
        "Cliente não encontrado"
      );
      expect(mockClienteRepository.find).toHaveBeenCalledWith(id);
      expect(mockClienteRepository.delete).not.toHaveBeenCalled();
    });
  });
});
