const { ValidationError, NotFoundError } = require("../utils/errors");

/**
 * Classe base para serviços
 * Responsável pelas regras de negócio e coordenação entre repositórios
 */
class BaseService {
  constructor(repository, validator) {
    this.repository = repository;
    this.validator = validator;
  }

  /**
   * Criar um novo registro
   * @param {Object} data - Dados do registro
   * @returns {Promise} - Promise com o resultado da operação
   */
  async create(data) {
    // Validar dados
    const validation = this.validator.validateCreate({ body: data });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    // Criar registro
    return await this.repository.create(validation.data);
  }

  /**
   * Buscar todos os registros
   * @param {Object} options - Opções de busca
   * @returns {Promise} - Promise com os registros encontrados
   */
  async getAll(options = {}) {
    // Validar parâmetros
    const validation = this.validator.validateGetAll({ query: options });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    return await this.repository.findAll(validation.data);
  }

  /**
   * Buscar registro por ID
   * @param {number} id - ID do registro
   * @returns {Promise} - Promise com o registro encontrado
   */
  async findById(id) {
    // Validar ID
    const validation = this.validator.validateFind({ params: { id } });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    const record = await this.repository.findById(validation.data.id);

    if (!record) {
      throw new NotFoundError("Registro não encontrado");
    }

    return record;
  }
  /**
   * Atualizar registro por ID
   * @param {number} id - ID do registro
   * @param {Object} data - Dados atualizados
   * @returns {Promise} - Promise com o resultado da operação
   */
  async update(id, data) {
    // Validar dados
    const validation = this.validator.validateUpdate({
      params: { id },
      body: data,
    });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    const { id: validatedId, ...updateData } = validation.data;

    // Verificar se registro existe
    const exists = await this.repository.exists(validatedId);
    if (!exists) {
      throw new NotFoundError("Registro não encontrado");
    }

    // Atualizar registro
    return await this.repository.update(validatedId, updateData);
  }

  /**
   * Deletar registro por ID
   * @param {number} id - ID do registro
   * @returns {Promise} - Promise com o resultado da operação
   */
  async delete(id) {
    // Validar ID
    const validation = this.validator.validateDelete({ params: { id } });
    if (!validation.isValid) {
      throw new ValidationError(validation.error.message);
    }

    // Verificar se registro existe
    const exists = await this.repository.exists(validation.data.id);
    if (!exists) {
      throw new NotFoundError("Registro não encontrado");
    }

    // Deletar registro
    return await this.repository.delete(validation.data.id);
  }
}

module.exports = BaseService;
