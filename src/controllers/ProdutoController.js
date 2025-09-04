const ProdutoModel = require("../models/ProdutoModel");
const ProdutoValidator = require("../validators/ProdutoValidator");

/**
 * Controller para operações com produtos
 */
class ProdutoController {
  /**
   * Criar um novo produto
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async create(req, res) {
    try {
      // Validar dados usando o validator
      const validation = ProdutoValidator.validateCreate(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      // Criar produto com dados validados
      const produto = await ProdutoModel.create(validation.data);

      res.status(201).json({
        message: "Produto cadastrado com sucesso",
        produto,
      });
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Listar produtos com paginação e busca
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async getAll(req, res) {
    try {
      // Validar parâmetros usando o validator
      const validation = ProdutoValidator.validateGetAll(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      const result = await ProdutoModel.getAll(validation.data);

      res.json(result);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Buscar produto por ID
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async find(req, res) {
    try {
      // Validar ID usando o validator
      const validation = ProdutoValidator.validateFind(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      const produto = await ProdutoModel.find(validation.data.id);

      if (!produto) {
        return res.status(404).json({
          error: "Produto não encontrado",
        });
      }

      res.json(produto);
    } catch (error) {
      console.error("Erro ao buscar produto:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Atualizar produto por ID
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async update(req, res) {
    try {
      // Validar dados usando o validator
      const validation = ProdutoValidator.validateUpdate(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      const { id, ...dadosProduto } = validation.data;

      // Verificar se produto existe
      const produtoExistente = await ProdutoModel.find(id);
      if (!produtoExistente) {
        return res.status(404).json({
          error: "Produto não encontrado",
        });
      }

      // Atualizar produto
      await ProdutoModel.update(id, dadosProduto);

      res.json({
        message: "Produto atualizado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar produto:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }

  /**
   * Deletar produto por ID
   * @param {Object} req - Objeto de requisição
   * @param {Object} res - Objeto de resposta
   */
  static async delete(req, res) {
    try {
      // Validar ID usando o validator
      const validation = ProdutoValidator.validateDelete(req);
      if (!validation.isValid) {
        return res.status(validation.error.status).json({
          error: validation.error.message,
        });
      }

      // Verificar se produto existe
      const produto = await ProdutoModel.find(validation.data.id);
      if (!produto) {
        return res.status(404).json({
          error: "Produto não encontrado",
        });
      }

      // Deletar produto
      await ProdutoModel.delete(validation.data.id);

      res.json({
        message: "Produto deletado com sucesso",
      });
    } catch (error) {
      console.error("Erro ao deletar produto:", error.message);
      res.status(500).json({
        error: "Erro interno do servidor",
      });
    }
  }
}

module.exports = ProdutoController;
