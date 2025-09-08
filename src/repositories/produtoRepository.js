const BaseRepository = require("./baseRepository");

/**
 * Repositório para operações de banco de dados relacionadas a produtos
 */
class ProdutoRepository extends BaseRepository {
  constructor() {
    super("produtos", ["nome", "preco", "estoque"]);
  }

  /**
   * Buscar todos os produtos com paginação e busca
   * @param {Object} options - Opções de busca
   * @returns {Promise} - Promise com os produtos encontrados
   */
  async findAll(options = {}) {
    const searchFields = ["nome"];
    const result = await super.findAll({
      ...options,
      searchFields,
    });

    return {
      produtos: result.data,
      pagination: result.pagination,
    };
  }

  /**
   * Buscar produtos com estoque baixo
   * @param {number} limite - Limite mínimo de estoque
   * @returns {Promise} - Promise com os produtos encontrados
   */
  async findWithLowStock(limite = 5) {
    const { db } = require("../config/database");

    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE estoque <= ? ORDER BY estoque ASC`;

      db.all(sql, [limite], (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });
  }

  /**
   * Atualizar estoque de um produto
   * @param {number} id - ID do produto
   * @param {number} quantidade - Nova quantidade em estoque
   * @returns {Promise} - Promise com o resultado da operação
   */
  async updateStock(id, quantidade) {
    return this.update(id, { estoque: quantidade });
  }
}

module.exports = ProdutoRepository;
