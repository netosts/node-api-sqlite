const ProdutoService = require("../services/produtoService");
const ApiResponse = require("../utils/apiResponse");
const ProdutoValidator = require("../validators/produtoValidator");

class ProdutoController {
  constructor() {
    this.produtoService = new ProdutoService();
  }

  static async create(req, res) {
    try {
      ProdutoValidator.validateCreate(req);

      const produtoService = new ProdutoService();
      const produto = await produtoService.create(req.body);

      return ApiResponse.created(res, produto, "Produto criado com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async getAll(req, res) {
    try {
      ProdutoValidator.validateGetAll(req);

      const result = await this.produtoService.getAll(req.query);

      return ApiResponse.paginated(res, result, "Produtos obtidos com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async find(req, res) {
    try {
      ProdutoValidator.validateById(req);

      const produtoService = new ProdutoService();
      const produto = await produtoService.findById(req.params.id);

      return ApiResponse.success(
        res,
        produto,
        "Produto encontrado com sucesso"
      );
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async update(req, res) {
    try {
      ProdutoValidator.validateUpdate(req);

      const produtoService = new ProdutoService();
      await produtoService.update(req.params.id, req.body);

      return ApiResponse.success(res, null, "Produto atualizado com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async delete(req, res) {
    try {
      ProdutoValidator.validateById(req);

      const produtoService = new ProdutoService();
      await produtoService.delete(req.params.id);

      return ApiResponse.success(res, null, "Produto deletado com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async findWithLowStock(req, res) {
    try {
      const produtoService = new ProdutoService();
      const limite = parseInt(req.query.limite) || 5;

      const produtos = await produtoService.findWithLowStock(limite);

      return ApiResponse.success(
        res,
        { produtos },
        `Produtos com estoque abaixo de ${limite} unidades`
      );
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async updateStock(req, res) {
    try {
      ProdutoValidator.validateById(req);

      const produtoService = new ProdutoService();
      const { quantidade } = req.body;

      await produtoService.updateStock(req.params.id, quantidade);

      return ApiResponse.success(res, null, "Estoque atualizado com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async checkStockAvailability(req, res) {
    try {
      ProdutoValidator.validateById(req);

      const produtoService = new ProdutoService();
      const { quantidade } = req.query;

      const disponivel = await produtoService.checkStockAvailability(
        req.params.id,
        parseInt(quantidade) || 1
      );

      return ApiResponse.success(
        res,
        { disponivel, quantidade: parseInt(quantidade) || 1 },
        disponivel ? "Estoque disponível" : "Estoque insuficiente"
      );
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
}

module.exports = ProdutoController;
