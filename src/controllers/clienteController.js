const ClienteService = require("../services/clienteService");
const ApiResponse = require("../utils/apiResponse");
const ClienteValidator = require("../validators/clienteValidator");

class ClienteController {
  constructor() {
    this.clienteService = new ClienteService();
  }

  static async create(req, res) {
    try {
      ClienteValidator.validateCreate(req);

      const cliente = await this.clienteService.create(req);

      return ApiResponse.created(res, cliente, "Cliente criado com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async getAll(req, res) {
    try {
      ClienteValidator.validateGetAll(req);

      const result = await this.clienteService.getAll(req.query);

      return ApiResponse.paginated(res, result, "Clientes obtidos com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async find(req, res) {
    try {
      ClienteValidator.validateId(req);

      const cliente = await this.clienteService.findById(req.params.id);

      return ApiResponse.success(
        res,
        cliente,
        "Cliente encontrado com sucesso"
      );
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async update(req, res) {
    try {
      ClienteValidator.validateUpdate(req);

      await this.clienteService.update(req.params.id, req.body);

      return ApiResponse.success(res, null, "Cliente atualizado com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }

  static async delete(req, res) {
    try {
      ClienteValidator.validateId(req);

      await this.clienteService.delete(req.params.id);

      return ApiResponse.success(res, null, "Cliente deletado com sucesso");
    } catch (error) {
      return ApiResponse.error(res, error);
    }
  }
}

module.exports = ClienteController;
