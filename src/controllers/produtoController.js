const ProdutoService = require("../services/produtoService");
const ApiResponse = require("../utils/apiResponse");
const ProdutoValidator = require("../validators/produtoValidator");
const { asyncHandler } = require("../middleware/errorHandler");

class ProdutoController {
  constructor() {
    this.produtoService = new ProdutoService();
  }

  static create = asyncHandler(async (req, res) => {
    ProdutoValidator.validateCreate(req);
    const produto = await this.produtoService.create(req);
    return ApiResponse.created(res, produto, "Produto criado com sucesso");
  });

  static getAll = asyncHandler(async (req, res) => {
    const result = await this.produtoService.getAll(req.body);
    return ApiResponse.paginated(res, result, "Produtos obtidos com sucesso");
  });

  static find = asyncHandler(async (req, res) => {
    ProdutoValidator.validateId(req);
    const produto = await this.produtoService.find(req.params.id);
    return ApiResponse.success(res, produto, "Produto encontrado com sucesso");
  });

  static update = asyncHandler(async (req, res) => {
    ProdutoValidator.validateUpdate(req);
    await this.produtoService.update(req.params.id, req.body);
    return ApiResponse.success(res, null, "Produto atualizado com sucesso");
  });

  static delete = asyncHandler(async (req, res) => {
    ProdutoValidator.validateId(req);
    await this.produtoService.delete(req.params.id);
    return ApiResponse.success(res, null, "Produto deletado com sucesso");
  });
}

module.exports = ProdutoController;
