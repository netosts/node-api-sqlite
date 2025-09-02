const ClienteModel = require("../models/ClienteModel");
const ClienteValidator = require("../validators/ClienteValidator");

/**
 * Controller para operações com clientes
 */
class ClienteController {
  /**
   * Criar um novo cliente
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async create(req, res) {
    try {
      // Validar dados usando o validator
      const validation = ClienteValidator.validateCreate(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      // Criar cliente com dados validados
      const cliente = await ClienteModel.create(validation.data);

      res.status(201).json({
        message: "Cliente cadastrado com sucesso",
        cliente,
      });
    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error.message);

      // Verificar se é erro de email duplicado
      if (error.message.includes("UNIQUE constraint failed")) {
        return res.status(409).json({
          error: "Este email já está cadastrado",
        });
      }

      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Listar clientes com paginação e busca
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async findAll(req, res) {
    try {
      // Validar parâmetros usando o validator
      const validation = ClienteValidator.validateFindAll(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      const result = await ClienteModel.findAll(validation.data);

      res.json(result);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Buscar cliente por ID
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async findById(req, res) {
    try {
      // Validar ID usando o validator
      const validation = ClienteValidator.validateFindById(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      const cliente = await ClienteModel.findById(validation.data.id);

      if (!cliente) {
        return res.status(404).json({
          error: "Cliente não encontrado",
        });
      }

      res.json(cliente);
    } catch (error) {
      console.error("Erro ao buscar cliente:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Atualizar cliente por ID
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async update(req, res) {
    try {
      // Validar dados usando o validator
      const validation = ClienteValidator.validateUpdate(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      const { id, ...dadosCliente } = validation.data;

      // Verificar se cliente existe
      const clienteExistente = await ClienteModel.findById(id);
      if (!clienteExistente) {
        return res.status(404).json({
          error: "Cliente não encontrado",
        });
      }

      // Verificar se email já está em uso por outro cliente
      const emailExistente = await ClienteModel.findByEmail(dadosCliente.email);
      if (emailExistente && emailExistente.id !== id) {
        return res.status(409).json({
          error: "Este email já está sendo usado por outro cliente",
        });
      }

      // Atualizar cliente
      await ClienteModel.update(id, dadosCliente);

      res.json({
        message: "Cliente atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Deletar cliente por ID
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async delete(req, res) {
    try {
      // Validar ID usando o validator
      const validation = ClienteValidator.validateDelete(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      // Verificar se cliente existe
      const cliente = await ClienteModel.findById(validation.data.id);
      if (!cliente) {
        return res.status(404).json({
          error: "Cliente não encontrado",
        });
      }

      // Deletar cliente
      await ClienteModel.delete(validation.data.id);

      res.json({
        message: "Cliente deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar cliente:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = ClienteController;

module.exports = ClienteController;
