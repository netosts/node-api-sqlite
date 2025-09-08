const BaseRepository = require("./baseRepository");

/**
 * Repositório para operações de banco de dados relacionadas a clientes
 */
class ClienteRepository extends BaseRepository {
  constructor() {
    super("clientes", ["nome", "email"]);
  }

  /**
   * Buscar todos os clientes com paginação e busca
   * @param {Object} options - Opções de busca
   * @returns {Promise} - Promise com os clientes encontrados
   */
  async findAll(options = {}) {
    const searchFields = ["nome", "email"];
    const result = await super.findAll({
      ...options,
      searchFields,
    });

    return {
      clientes: result.data,
      pagination: result.pagination,
    };
  }

  /**
   * Buscar cliente por email
   * @param {string} email - Email do cliente
   * @returns {Promise} - Promise com o cliente encontrado
   */
  async findByEmail(email) {
    return this.findByField("email", email);
  }

  /**
   * Verificar se email já existe
   * @param {string} email - Email para verificar
   * @param {number} excludeId - ID para excluir da verificação
   * @returns {Promise<boolean>} - Promise com resultado da verificação
   */
  async emailExists(email, excludeId = null) {
    return this.existsByField("email", email, excludeId);
  }
}

module.exports = ClienteRepository;
