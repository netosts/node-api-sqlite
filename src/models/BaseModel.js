const { db } = require("../config/database");

class BaseModel {
  /**
   * @param {string} tableName - Nome da tabela
   * @param {Array} fields - Campos que podem ser pesquisados
   */
  constructor(tableName, fields = []) {
    this.tableName = tableName;
    this.fields = fields;
  }

  /**
   * Método genérico para buscar todos os registros com paginação e filtro
   * @param {Object} options - Opções de busca
   * @param {number} options.page - Página atual
   * @param {number} options.limit - Limite por página
   * @param {string} options.search - Termo de busca
   * @param {string} options.orderBy - Campo para ordenação
   * @param {string} options.orderDirection - Direção da ordenação (ASC/DESC)
   * @returns {Promise} - Promise com os registros encontrados
   */
  async getAll(options = {}, searchFields = []) {
    return new Promise((resolve, reject) => {
      const {
        page = 1,
        limit = 10,
        search = "",
        orderBy = "data_criacao",
        orderDirection = "DESC",
      } = options;

      const offset = (page - 1) * limit;

      let sql = `SELECT * FROM ${this.tableName}`;
      let countSql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
      let params = [];

      if (search && search.trim() !== "" && searchFields.length > 0) {
        const searchConditions = searchFields
          .map((field) => `${field} LIKE ?`)
          .join(" OR ");
        sql += ` WHERE ${searchConditions}`;
        countSql += ` WHERE ${searchConditions}`;

        searchFields.forEach(() => {
          params.push(`%${search.trim()}%`);
        });
      }

      sql += ` ORDER BY ${orderBy} ${orderDirection.toUpperCase()} LIMIT ? OFFSET ?`;
      const queryParams = [...params, parseInt(limit), offset];

      db.all(sql, queryParams, (err, records) => {
        if (err) {
          reject(err);
          return;
        }

        const countParams = [];
        if (search && search.trim() !== "" && searchFields.length > 0) {
          searchFields.forEach(() => {
            countParams.push(`%${search.trim()}%`);
          });
        }

        db.get(countSql, countParams, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          const total = result.total;
          const totalPages = Math.ceil(total / limit);

          resolve({
            [this.tableName]: records,
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
   * Buscar registro por ID
   * @param {number} id - ID do registro
   * @returns {Promise} - Promise com o registro encontrado
   */
  async find(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;

      db.get(sql, [id], (err, record) => {
        if (err) {
          reject(err);
        } else {
          resolve(record);
        }
      });
    });
  }

  /**
   * Criar novo registro
   * @param {Object} data - Dados do registro
   * @param {Array} fields - Campos a serem inseridos
   * @returns {Promise} - Promise com o resultado da operação
   */
  async create(data, fields = this.fields) {
    return new Promise((resolve, reject) => {
      const placeholders = fields.map(() => "?").join(", ");
      const fieldNames = fields.join(", ");
      const values = fields.map((field) => data[field]);

      const sql = `INSERT INTO ${this.tableName} (${fieldNames}) VALUES (${placeholders})`;

      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            ...data,
          });
        }
      });
    });
  }

  /**
   * Atualizar registro por ID
   * @param {number} id - ID do registro
   * @param {Object} data - Dados atualizados
   * @param {Array} fields - Campos a serem atualizados
   * @returns {Promise} - Promise com o resultado da operação
   */
  async update(id, data, fields = this.fields) {
    return new Promise((resolve, reject) => {
      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const values = fields.map((field) => data[field]);
      values.push(id);

      const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;

      db.run(sql, values, function (err) {
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
   * Deletar registro por ID
   * @param {number} id - ID do registro
   * @returns {Promise} - Promise com o resultado da operação
   */
  async delete(id) {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;

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

  /**
   * Buscar registros por campo específico
   * @param {string} field - Campo para busca
   * @param {any} value - Valor a ser buscado
   * @returns {Promise} - Promise com os registros encontrados
   */
  async findByField(field, value) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE ${field} = ?`;

      db.all(sql, [value], (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });
  }

  /**
   * Buscar um único registro por campo específico
   * @param {string} field - Campo para busca
   * @param {any} value - Valor a ser buscado
   * @returns {Promise} - Promise com o registro encontrado
   */
  async findWhere(field, value) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE ${field} = ?`;

      db.get(sql, [value], (err, record) => {
        if (err) {
          reject(err);
        } else {
          resolve(record);
        }
      });
    });
  }
}

module.exports = BaseModel;
