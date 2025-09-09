const ProdutoService = require("../services/produtoService");
const ApiResponse = require("../utils/apiResponse");
const ProdutoValidator = require("../validators/produtoValidator");
const { asyncHandler } = require("../middleware/errorHandler");

class ProdutoController {
  static create = asyncHandler(async (req, res) => {
    await ProdutoValidator.validateCreate(req);
    const produtoService = new ProdutoService();
    const produto = await produtoService.create(req.body);
    return ApiResponse.created(res, produto, "Produto criado com sucesso");
  });

  static getAll = asyncHandler(async (req, res) => {
    const produtoService = new ProdutoService();
    const result = await produtoService.getAll(req.query);
    return ApiResponse.paginated(res, result, "Produtos obtidos com sucesso");
  });

  static find = asyncHandler(async (req, res) => {
    await ProdutoValidator.validateId(req);
    const produtoService = new ProdutoService();
    const produto = await produtoService.find(req.params.id);
    return ApiResponse.success(res, produto, "Produto encontrado com sucesso");
  });

  static update = asyncHandler(async (req, res) => {
    await ProdutoValidator.validateUpdate(req);
    const produtoService = new ProdutoService();
    const produto = await produtoService.update(req.params.id, req.body);
    return ApiResponse.success(res, produto, "Produto atualizado com sucesso");
  });

  static delete = asyncHandler(async (req, res) => {
    await ProdutoValidator.validateId(req);
    const produtoService = new ProdutoService();
    const produto = await produtoService.delete(req.params.id);
    return ApiResponse.success(res, produto, "Produto deletado com sucesso");
  });
}

module.exports = ProdutoController;
