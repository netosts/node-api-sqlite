const { db } = require("../config/database");

/**
 * Model para operações com produtos
 */
class ProdutoModel {
  /**
   * Criar um novo produto
   * @param {Object} produto - Dados do produto
   * @param {string} produto.nome - Nome do produto
   * @param {number} produto.preco - Preço do produto
   * @param {number} produto.estoque - Estoque do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  static create(produto) {
    return new Promise((resolve, reject) => {
      const { nome, preco, estoque } = produto;
      const sql = `INSERT INTO produtos (nome, preco, estoque) VALUES (?, ?, ?)`;

      db.run(sql, [nome, preco, estoque], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            nome,
            preco,
            estoque,
          });
        }
      });
    });
  }

  /**
   * Buscar todos os produtos com paginação e filtro
   * @param {Object} options - Opções de busca
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite por página
   * @param {string} options.search - Termo de busca
   * @returns {Promise} - Promise com os produtos encontrados
   */
  static findAll(options = {}) {
    return new Promise((resolve, reject) => {
      const { page = 1, limit = 10, search = "" } = options;
      const offset = (page - 1) * limit;

      let sql = `SELECT * FROM produtos`;
      let countSql = `SELECT COUNT(*) as total FROM produtos`;
      let params = [];

      // Adicionar filtro de busca se fornecido
      if (search && search.trim() !== "") {
        sql += ` WHERE nome LIKE ?`;
        countSql += ` WHERE nome LIKE ?`;
        params.push(`%${search.trim()}%`);
      }

      // Adicionar ordenação e paginação
      sql += ` ORDER BY data_criacao DESC LIMIT ? OFFSET ?`;
      const queryParams = [...params, parseInt(limit), offset];

      // Buscar produtos
      db.all(sql, queryParams, (err, produtos) => {
        if (err) {
          reject(err);
          return;
        }

        // Buscar total para paginação
        const countParams =
          search && search.trim() !== "" ? [`%${search.trim()}%`] : [];

        db.get(countSql, countParams, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          const total = result.total;
          const totalPages = Math.ceil(total / limit);

          resolve({
            produtos,
            pagination: {
              current_page: parseInt(page),
              per_page: parseInt(limit),
              total_items: total,
              total_pages: totalPages,
              has_next: parseInt(page) < totalPages,
              has_prev: parseInt(page) > 1,
            },
          });
        });
      });
    });
  }

  /**
   * Buscar produto por ID
   * @param {number} id - ID do produto
   * @returns {Promise} - Promise com o produto encontrado
   */
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM produtos WHERE id = ?`;

      db.get(sql, [id], (err, produto) => {
        if (err) {
          reject(err);
        } else {
          resolve(produto);
        }
      });
    });
  }

  /**
   * Atualizar produto por ID
   * @param {number} id - ID do produto
   * @param {Object} produto - Dados atualizados do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  static update(id, produto) {
    return new Promise((resolve, reject) => {
      const { nome, preco, estoque } = produto;
      const sql = `UPDATE produtos SET nome = ?, preco = ?, estoque = ? WHERE id = ?`;

      db.run(sql, [nome, preco, estoque, id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id,
            changes: this.changes,
          });
        }
      });
    });
  }

  /**
   * Deletar produto por ID
   * @param {number} id - ID do produto
   * @returns {Promise} - Promise com o resultado da operação
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM produtos WHERE id = ?`;

      db.run(sql, [id], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id,
            changes: this.changes,
          });
        }
      });
    });
  }
}

module.exports = ProdutoModel;
