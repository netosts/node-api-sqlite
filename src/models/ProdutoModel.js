const BaseModel = require("./BaseModel");

class ProdutoModel {
  static fields = ["nome", "preco", "estoque"];

  static baseModel = new BaseModel("produtos", this.fields);

  /**
   * Criar um novo produto
   * @param {Object} produto - Dados do produto
   * @param {string} produto.nome - Nome do produto
   * @param {number} produto.preco - Preço do produto
   * @param {number} produto.estoque - Estoque do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  static create(produto) {
    return this.baseModel.create(produto);
  }

  /**
   * Buscar todos os produtos com paginação e filtro
   * @param {Object} options - Opções de busca
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite por página
   * @param {string} options.search - Termo de busca
   * @returns {Promise} - Promise com os produtos encontrados
   */
  static async getAll(options = {}) {
    const result = await this.baseModel.getAll(options, ["nome"]);
    // Renomear a chave 'produtos' para manter compatibilidade
    return {
      produtos: result.produtos,
      pagination: result.pagination,
    };
  }

  /**
   * Buscar produto por ID
   * @param {number} id - ID do produto
   * @returns {Promise} - Promise com o produto encontrado
   */
  static find(id) {
    return this.baseModel.find(id);
  }

  /**
   * Atualizar produto por ID
   * @param {number} id - ID do produto
   * @param {Object} produto - Dados atualizados do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  static update(id, produto) {
    return this.baseModel.update(id, produto);
  }

  /**
   * Deletar produto por ID
   * @param {number} id - ID do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  static delete(id) {
    return this.baseModel.delete(id);
  }
}

module.exports = ProdutoModel;
