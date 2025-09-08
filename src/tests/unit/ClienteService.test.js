const ClienteService = require("../../services/clienteService");
const ClienteRepository = require("../../repositories/clienteRepository");

// Mock do repositório para isolamento dos testes
jest.mock("../../repositories/ClienteRepository");

describe("ClienteService", () => {
  let clienteService;
  let mockRepository;

  beforeEach(() => {
    // Reset todos os mocks
    jest.clearAllMocks();

    // Criar nova instância do serviço
    clienteService = new ClienteService();

    // Obter referência do mock do repositório
    mockRepository = clienteService.repository;
  });

  describe("create", () => {
    it("deve criar cliente com dados válidos", async () => {
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      const clienteCriado = {
        id: 1,
        ...clienteData,
      };

      // Mock do repository
      mockRepository.emailExists.mockResolvedValue(false);
      mockRepository.create.mockResolvedValue(clienteCriado);

      const resultado = await clienteService.create(clienteData);

      expect(mockRepository.emailExists).toHaveBeenCalledWith(
        clienteData.email
      );
      expect(mockRepository.create).toHaveBeenCalledWith(clienteData);
      expect(resultado).toEqual(clienteCriado);
    });

    it("deve lançar erro para email duplicado", async () => {
      const clienteData = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      // Mock do repository
      mockRepository.emailExists.mockResolvedValue(true);

      await expect(clienteService.create(clienteData)).rejects.toThrow(
        "Este email já está cadastrado"
      );

      expect(mockRepository.emailExists).toHaveBeenCalledWith(
        clienteData.email
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar erro para dados inválidos", async () => {
      const clienteData = {
        nome: "", // Nome vazio deve ser inválido
        email: "joao@exemplo.com",
      };

      await expect(clienteService.create(clienteData)).rejects.toThrow();

      expect(mockRepository.emailExists).not.toHaveBeenCalled();
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("deve retornar cliente quando encontrado", async () => {
      const clienteId = 1;
      const clienteEncontrado = {
        id: clienteId,
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      mockRepository.findById.mockResolvedValue(clienteEncontrado);

      const resultado = await clienteService.findById(clienteId);

      expect(mockRepository.findById).toHaveBeenCalledWith(clienteId);
      expect(resultado).toEqual(clienteEncontrado);
    });

    it("deve lançar erro quando cliente não encontrado", async () => {
      const clienteId = 999;

      mockRepository.findById.mockResolvedValue(null);

      await expect(clienteService.findById(clienteId)).rejects.toThrow(
        "Registro não encontrado"
      );

      expect(mockRepository.findById).toHaveBeenCalledWith(clienteId);
    });
  });

  describe("update", () => {
    it("deve atualizar cliente com dados válidos", async () => {
      const clienteId = 1;
      const dadosAtualizacao = {
        nome: "João Silva Atualizado",
        email: "joao.novo@exemplo.com",
      };

      const resultadoUpdate = {
        id: clienteId,
        changes: 1,
      };

      // Mocks
      mockRepository.exists.mockResolvedValue(true);
      mockRepository.emailExists.mockResolvedValue(false);
      mockRepository.update.mockResolvedValue(resultadoUpdate);

      const resultado = await clienteService.update(
        clienteId,
        dadosAtualizacao
      );

      expect(mockRepository.exists).toHaveBeenCalledWith(clienteId);
      expect(mockRepository.emailExists).toHaveBeenCalledWith(
        dadosAtualizacao.email,
        clienteId
      );
      expect(mockRepository.update).toHaveBeenCalledWith(
        clienteId,
        dadosAtualizacao
      );
      expect(resultado).toEqual(resultadoUpdate);
    });

    it("deve lançar erro quando cliente não existe", async () => {
      const clienteId = 999;
      const dadosAtualizacao = {
        nome: "João Silva",
        email: "joao@exemplo.com",
      };

      mockRepository.exists.mockResolvedValue(false);

      await expect(
        clienteService.update(clienteId, dadosAtualizacao)
      ).rejects.toThrow("Cliente não encontrado");

      expect(mockRepository.exists).toHaveBeenCalledWith(clienteId);
      expect(mockRepository.emailExists).not.toHaveBeenCalled();
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it("deve lançar erro para email duplicado em update", async () => {
      const clienteId = 1;
      const dadosAtualizacao = {
        nome: "João Silva",
        email: "email.duplicado@exemplo.com",
      };

      mockRepository.exists.mockResolvedValue(true);
      mockRepository.emailExists.mockResolvedValue(true);

      await expect(
        clienteService.update(clienteId, dadosAtualizacao)
      ).rejects.toThrow("Este email já está sendo usado por outro cliente");

      expect(mockRepository.exists).toHaveBeenCalledWith(clienteId);
      expect(mockRepository.emailExists).toHaveBeenCalledWith(
        dadosAtualizacao.email,
        clienteId
      );
      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deve deletar cliente quando existe", async () => {
      const clienteId = 1;
      const resultadoDelete = {
        id: clienteId,
        changes: 1,
      };

      mockRepository.exists.mockResolvedValue(true);
      mockRepository.findById.mockResolvedValue({ id: clienteId });
      mockRepository.delete.mockResolvedValue(resultadoDelete);

      const resultado = await clienteService.delete(clienteId);

      expect(mockRepository.delete).toHaveBeenCalledWith(clienteId);
      expect(resultado).toEqual(resultadoDelete);
    });

    it("deve lançar erro quando cliente não existe", async () => {
      const clienteId = 999;

      mockRepository.exists.mockResolvedValue(false);

      await expect(clienteService.delete(clienteId)).rejects.toThrow(
        "Cliente não encontrado ou não pode ser deletado"
      );

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe("getAll", () => {
    it("deve retornar lista de clientes com paginação", async () => {
      const opcoes = {
        page: 1,
        limit: 10,
        search: "João",
      };

      const resultadoEsperado = {
        clientes: [
          { id: 1, nome: "João Silva", email: "joao@exemplo.com" },
          { id: 2, nome: "João Santos", email: "joao.santos@exemplo.com" },
        ],
        pagination: {
          current_page: 1,
          per_page: 10,
          total_items: 2,
          total_pages: 1,
          has_next: false,
          has_prev: false,
        },
      };

      mockRepository.findAll.mockResolvedValue(resultadoEsperado);

      const resultado = await clienteService.getAll(opcoes);

      expect(mockRepository.findAll).toHaveBeenCalledWith(opcoes);
      expect(resultado).toEqual(resultadoEsperado);
    });
  });
});
