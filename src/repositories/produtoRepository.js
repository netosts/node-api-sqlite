const ProdutoModel = require("../models/produtoModel");
const BaseRepository = require("./baseRepository");

/**
 * Repositório para operações de banco de dados relacionadas a produtos
 */
class ProdutoRepository extends BaseRepository {
  constructor() {
    super(ProdutoModel.tableName, ProdutoModel.fields);
  }

  /**
   * Buscar todos os produtos com paginação e busca
   * @param {Object} options - Opções de busca
   * @returns {Promise} - Promise com os produtos encontrados
   */
  async getAll(options = {}) {
    // Ensure searchFields for products is always applied
    const enhancedOptions = {
      ...options,
      searchFields: ["nome"],
    };

    const result = await super.getAll(enhancedOptions);

    return {
      produtos: result.data,
      pagination: result.pagination,
    };
  }
}

module.exports = ProdutoRepository;
