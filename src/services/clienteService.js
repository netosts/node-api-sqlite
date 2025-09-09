const ClienteRepository = require("../repositories/clienteRepository");
const { NotFoundError, ConflictError } = require("../utils/errors");

class ClienteService {
  constructor() {
    this.clienteRepository = new ClienteRepository();
  }

  async create(req) {
    const emailExists = await this.clienteRepository.emailExists(
      req.body.email
    );
    if (emailExists) {
      throw new ConflictError("Este email já está cadastrado");
    }

    return await this.clienteRepository.create(req.body);
  }

  async getAll(req) {
    const searchFields = ["nome", "email"];
    return await this.clienteRepository.getAll({ ...req.body, searchFields });
  }

  async find(id) {
    const cliente = await this.clienteRepository.find(id);
    if (!cliente) {
      throw new NotFoundError("Cliente não encontrado");
    }
    return cliente;
  }

  async update(id, req) {
    const cliente = await this.clienteRepository.find(id);
    if (!cliente) {
      throw new NotFoundError("Cliente não encontrado");
    }

    if (req.body.email) {
      const emailExists = await this.clienteRepository.emailExists(
        req.body.email,
        id
      );
      if (emailExists) {
        throw new ConflictError(
          "Este email já está sendo usado por outro cliente"
        );
      }
    }

    return await this.clienteRepository.update(id, req.body);
  }

  async delete(id) {
    const cliente = await this.clienteRepository.find(id);
    if (!cliente) {
      throw new NotFoundError("Cliente não encontrado");
    }

    return await this.clienteRepository.delete(id);
  }
}

module.exports = ClienteService;
