const BaseModel = require("./BaseModel");

class ClienteModel {
  static fields = ["nome", "email"];

  static baseModel = new BaseModel("clientes", this.fields);

  /**
   * Criar um novo cliente
   * @param {Object} cliente - Dados do cliente
   * @param {string} cliente.nome - Nome do cliente
   * @param {string} cliente.email - Email do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  static create(cliente) {
    return this.baseModel.create(cliente);
  }

  /**
   * Buscar todos os clientes com paginação e filtro
   * @param {Object} options - Opções de busca
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite por página
   * @param {string} options.search - Termo de busca
   * @returns {Promise} - Promise com os clientes encontrados
   */
  static async getAll(options = {}) {
    const result = await this.baseModel.getAll(options, ["nome", "email"]);
    return {
      clientes: result.clientes,
      pagination: result.pagination,
    };
  }

  /**
   * Buscar cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise} - Promise com o cliente encontrado
   */
  static find(id) {
    return this.baseModel.find(id);
  }

  /**
   * Buscar cliente por email
   * @param {string} email - Email do cliente
   * @returns {Promise} - Promise com o cliente encontrado
   */
  static findByEmail(email) {
    return this.baseModel.findWhere("email", email);
  }

  /**
   * Atualizar cliente por ID
   * @param {number} id - ID do cliente
   * @param {Object} cliente - Dados atualizados do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  static update(id, cliente) {
    return this.baseModel.update(id, cliente);
  }

  /**
   * Deletar cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  static delete(id) {
    return this.baseModel.delete(id);
  }
}

module.exports = ClienteModel;
