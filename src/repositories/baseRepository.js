const { getDatabase } = require("../config/database");

class BaseRepository {
  /**
   * @param {string} tableName - Nome da tabela
   * @param {Array} fields - Campos da entidade
   */
  constructor(tableName, fields = []) {
    this.tableName = tableName;
    this.fields = fields;
  }

  /**
   * Buscar todos os registros com paginação e filtro
   * @param {Object} options - Opções de busca
   * @returns {Promise} - Promise com os registros encontrados
   */
  async getAll(options = {}) {
    return new Promise((resolve, reject) => {
      const {
        page = 1,
        limit = 10,
        search = "",
        searchFields = [],
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

      getDatabase().all(sql, queryParams, (err, records) => {
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

        getDatabase().get(countSql, countParams, (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          const total = result.total;
          const totalPages = Math.ceil(total / limit);

          resolve({
            data: records,
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

      getDatabase().get(sql, [id], (err, record) => {
        if (err) {
          reject(err);
        } else {
          resolve(record);
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

      getDatabase().get(sql, [value], (err, record) => {
        if (err) {
          reject(err);
        } else {
          resolve(record);
        }
      });
    });
  }

  /**
   * Buscar vários registros por campo específico
   * @param {string} field - Campo para busca
   * @param {any} value - Valor a ser buscado
   * @returns {Promise} - Promise com os registros encontrados
   */
  async getWhere(field, value) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${this.tableName} WHERE ${field} = ?`;

      getDatabase().all(sql, [value], (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      });
    });
  }

  /**
   * Criar novo registro
   * @param {Object} data - Dados do registro
   * @returns {Promise} - Promise com o resultado da operação
   */
  async create(data) {
    return new Promise((resolve, reject) => {
      const fields = this.fields.filter((field) => data.hasOwnProperty(field));
      const placeholders = fields.map(() => "?").join(", ");
      const fieldNames = fields.join(", ");
      const values = fields.map((field) => data[field]);

      const sql = `INSERT INTO ${this.tableName} (${fieldNames}) VALUES (${placeholders})`;
      const db = getDatabase();
      const tableName = this.tableName;

      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          const insertedId = this.lastID;
          // Fetch the complete record after insertion
          const selectSql = `SELECT * FROM ${tableName} WHERE id = ?`;
          db.get(selectSql, [insertedId], (selectErr, record) => {
            if (selectErr) {
              reject(selectErr);
            } else {
              resolve(record);
            }
          });
        }
      });
    });
  }

  /**
   * Atualizar registro por ID
   * @param {number} id - ID do registro
   * @param {Object} data - Dados atualizados
   * @returns {Promise} - Promise com o resultado da operação
   */
  async update(id, data) {
    return new Promise((resolve, reject) => {
      const fields = this.fields.filter((field) => data.hasOwnProperty(field));
      const setClause = fields.map((field) => `${field} = ?`).join(", ");
      const values = fields.map((field) => data[field]);
      values.push(id);

      const sql = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
      const db = getDatabase();
      const tableName = this.tableName;

      db.run(sql, values, function (err) {
        if (err) {
          reject(err);
        } else {
          // After updating, fetch the updated record
          const selectSql = `SELECT * FROM ${tableName} WHERE id = ?`;
          db.get(selectSql, [id], (selectErr, record) => {
            if (selectErr) {
              reject(selectErr);
            } else {
              resolve(record);
            }
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

      getDatabase().run(sql, [id], function (err) {
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
   * Verificar se um registro existe por ID
   * @param {number} id - ID do registro
   * @returns {Promise<boolean>} - Promise com resultado da verificação
   */
  async exists(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT 1 FROM ${this.tableName} WHERE id = ? LIMIT 1`;

      getDatabase().get(sql, [id], (err, record) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!record);
        }
      });
    });
  }

  /**
   * Verificar se um registro existe por campo específico
   * @param {string} field - Campo para verificação
   * @param {any} value - Valor a ser verificado
   * @param {number} excludeId - ID para excluir da verificação (útil para updates)
   * @returns {Promise<boolean>} - Promise com resultado da verificação
   */
  async existsWhere(field, value, excludeId = null) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT 1 FROM ${this.tableName} WHERE ${field} = ?`;
      let params = [value];

      if (excludeId !== null) {
        sql += ` AND id != ?`;
        params.push(excludeId);
      }

      sql += ` LIMIT 1`;

      getDatabase().get(sql, params, (err, record) => {
        if (err) {
          reject(err);
        } else {
          resolve(!!record);
        }
      });
    });
  }
}

module.exports = BaseRepository;
