const ClienteService = require("../services/clienteService");
const ApiResponse = require("../utils/apiResponse");
const ClienteValidator = require("../validators/clienteValidator");
const { asyncHandler } = require("../middleware/errorHandler");

class ClienteController {
  static create = asyncHandler(async (req, res) => {
    ClienteValidator.validateCreate(req);
    const clienteService = new ClienteService();
    const cliente = await clienteService.create(req);
    return ApiResponse.created(res, cliente, "Cliente criado com sucesso");
  });

  static getAll = asyncHandler(async (req, res) => {
    const clienteService = new ClienteService();
    const result = await clienteService.getAll(req.query);
    return ApiResponse.paginated(res, result, "Clientes obtidos com sucesso");
  });

  static find = asyncHandler(async (req, res) => {
    ClienteValidator.validateId(req);
    const clienteService = new ClienteService();
    const cliente = await clienteService.find(req.params.id);
    return ApiResponse.success(res, cliente, "Cliente encontrado com sucesso");
  });

  static update = asyncHandler(async (req, res) => {
    ClienteValidator.validateUpdate(req);
    const clienteService = new ClienteService();
    await clienteService.update(req.params.id, req.body);
    return ApiResponse.success(res, null, "Cliente atualizado com sucesso");
  });

  static delete = asyncHandler(async (req, res) => {
    ClienteValidator.validateId(req);
    const clienteService = new ClienteService();
    await clienteService.delete(req.params.id);
    return ApiResponse.success(res, null, "Cliente deletado com sucesso");
  });
}

module.exports = ClienteController;
