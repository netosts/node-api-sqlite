const { db } = require("../config/database");

/**
 * Model para operações com clientes
 */
class ClienteModel {
  /**
   * Criar um novo cliente
   * @param {Object} cliente - Dados do cliente
   * @param {string} cliente.nome - Nome do cliente
   * @param {string} cliente.email - Email do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  static create(cliente) {
    return new Promise((resolve, reject) => {
      const { nome, email } = cliente;
      const sql = `INSERT INTO clientes (nome, email) VALUES (?, ?)`;

      db.run(sql, [nome, email], function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            nome,
            email,
          });
        }
      });
    });
  }

  /**
   * Buscar todos os clientes com paginação e filtro
   * @param {Object} options - Opções de busca
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite por página
   * @param {string} options.search - Termo de busca
   * @returns {Promise} - Promise com os clientes encontrados
   */
  static findAll(options = {}) {
    return new Promise((resolve, reject) => {
      const { page = 1, limit = 10, search = "" } = options;
      const offset = (page - 1) * limit;

      let sql = `SELECT * FROM clientes`;
      let countSql = `SELECT COUNT(*) as total FROM clientes`;
      let params = [];

      // Adicionar filtro de busca se fornecido
      if (search && search.trim() !== "") {
        sql += ` WHERE nome LIKE ? OR email LIKE ?`;
        countSql += ` WHERE nome LIKE ? OR email LIKE ?`;
        const searchParam = `%${search.trim()}%`;
        params.push(searchParam, searchParam);
      }

      // Adicionar ordenação e paginação
      sql += ` ORDER BY data_criacao DESC LIMIT ? OFFSET ?`;
      const queryParams = [...params, parseInt(limit), offset];

      // Buscar clientes
      db.all(sql, queryParams, (err, clientes) => {
        if (err) {
          reject(err);
          return;
        }

        // Buscar total para paginação
        const countParams =
          search && search.trim() !== ""
            ? [`%${search.trim()}%`, `%${search.trim()}%`]
            : [];

        db.get(countSql, countParams, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          const total = result.total;
          const totalPages = Math.ceil(total / limit);

          resolve({
            clientes,
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
   * Buscar cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise} - Promise com o cliente encontrado
   */
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM clientes WHERE id = ?`;

      db.get(sql, [id], (err, cliente) => {
        if (err) {
          reject(err);
        } else {
          resolve(cliente);
        }
      });
    });
  }

  /**
   * Buscar cliente por email
   * @param {string} email - Email do cliente
   * @returns {Promise} - Promise com o cliente encontrado
   */
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM clientes WHERE email = ?`;

      db.get(sql, [email], (err, cliente) => {
        if (err) {
          reject(err);
        } else {
          resolve(cliente);
        }
      });
    });
  }

  /**
   * Atualizar cliente por ID
   * @param {number} id - ID do cliente
   * @param {Object} cliente - Dados atualizados do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  static update(id, cliente) {
    return new Promise((resolve, reject) => {
      const { nome, email } = cliente;
      const sql = `UPDATE clientes SET nome = ?, email = ? WHERE id = ?`;

      db.run(sql, [nome, email, id], function (err) {
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
   * Deletar cliente por ID
   * @param {number} id - ID do cliente
   * @returns {Promise} - Promise com o resultado da operação
   */
  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM clientes WHERE id = ?`;

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

module.exports = ClienteModel;
