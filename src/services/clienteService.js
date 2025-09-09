const ClienteRepository = require("../repositories/clienteRepository");
const { NotFoundError, ConflictError } = require("../utils/errors");

class ClienteService {
  constructor() {
    this.clienteRepository = new ClienteRepository();
  }

  async create(data) {
    const emailExists = await this.clienteRepository.emailExists(data.email);
    if (emailExists) {
      throw new ConflictError("Este email já está cadastrado");
    }

    return await this.clienteRepository.create(data);
  }

  async getAll(options) {
    const searchFields = ["nome", "email"];
    return await this.clienteRepository.getAll({ ...options, searchFields });
  }

  async find(id) {
    const cliente = await this.clienteRepository.find(id);
    if (!cliente) {
      throw new NotFoundError("Cliente não encontrado");
    }
    return cliente;
  }

  async update(id, data) {
    const cliente = await this.clienteRepository.find(id);
    if (!cliente) {
      throw new NotFoundError("Cliente não encontrado");
    }

    if (data.email) {
      const emailExists = await this.clienteRepository.emailExists(
        data.email,
        id
      );
      if (emailExists) {
        throw new ConflictError(
          "Este email já está sendo usado por outro cliente"
        );
      }
    }

    return await this.clienteRepository.update(id, data);
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
