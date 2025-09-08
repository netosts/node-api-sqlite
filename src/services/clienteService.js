const BaseService = require("./baseService");
const ClienteRepository = require("../repositories/clienteRepository");
const ClienteValidator = require("../validators/clienteValidator");
const {
  ValidationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} = require("../utils/errors");

/**
 * Serviço para regras de negócio relacionadas a clientes
 */
class ClienteService extends BaseService {
  constructor() {
    super(new ClienteRepository(), ClienteValidator);
  }

  /**
   * Criar um novo cliente
   * @param {Object} clienteData - Dados do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  async create(clienteData) {
    // Validar dados
    const validation = this.validator.validateCreate({ body: clienteData });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    // Verificar se email já existe
    const emailExists = await this.repository.emailExists(
      validation.data.email
    );
    if (emailExists) {
      throw new ConflictError("Este email já está cadastrado");
    }

    // Criar cliente
    return await this.repository.create(validation.data);
  }

  /**
   * Atualizar cliente por ID
   * @param {number} id - ID do cliente
   * @param {Object} clienteData - Dados atualizados do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  async update(id, clienteData) {
    // Validar dados
    const validation = this.validator.validateUpdate({
      params: { id },
      body: clienteData,
    });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    const { id: validatedId, ...updateData } = validation.data;

    // Verificar se cliente existe
    const clienteExistente = await this.repository.findById(validatedId);
    if (!clienteExistente) {
      throw new NotFoundError("Cliente não encontrado");
    }

    // Verificar se email já está em uso por outro cliente
    if (updateData.email) {
      const emailExists = await this.repository.emailExists(
        updateData.email,
        validatedId
      );
      if (emailExists) {
        throw new ConflictError(
          "Este email já está sendo usado por outro cliente"
        );
      }
    }

    // Atualizar cliente
    return await this.repository.update(validatedId, updateData);
  }

  /**
   * Buscar cliente por email
   * @param {string} email - Email do cliente
   * @returns {Promise} - Promise com o cliente encontrado
   */
  async findByEmail(email) {
    if (!email) {
      throw new BadRequestError("Email é obrigatório");
    }

    return await this.repository.findByEmail(email);
  }

  /**
   * Verificar se um cliente pode ser deletado
   * @param {number} id - ID do cliente
   * @returns {Promise<boolean>} - Promise com resultado da verificação
   */
  async canDelete(id) {
    // Aqui você pode adicionar regras de negócio específicas
    // Por exemplo, verificar se o cliente tem pedidos associados

    const cliente = await this.repository.findById(id);
    if (!cliente) {
      return false;
    }

    // Adicione aqui verificações de relacionamentos
    // Por exemplo: verificar se há pedidos, faturas, etc.

    return true;
  }

  /**
   * Deletar cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  async delete(id) {
    // Validar ID
    const validation = this.validator.validateDelete({ params: { id } });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    // Verificar se pode deletar
    const canDelete = await this.canDelete(validation.data.id);
    if (!canDelete) {
      throw new BadRequestError(
        "Cliente não encontrado ou não pode ser deletado"
      );
    }

    // Deletar cliente
    return await this.repository.delete(validation.data.id);
  }
}

module.exports = ClienteService;
