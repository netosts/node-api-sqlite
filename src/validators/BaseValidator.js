/**
 * Classe base para validações
 */
class BaseValidator {
  /**
   * Valida se o email tem formato válido
   * @param {string} email - Email a ser validado
   * @returns {boolean} - True se válido, false caso contrário
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valida se um valor é um número válido
   * @param {any} value - Valor a ser validado
   * @returns {boolean} - True se for número válido
   */
  static isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
  }

  /**
   * Valida se um valor é um número positivo
   * @param {any} value - Valor a ser validado
   * @returns {boolean} - True se for número positivo
   */
  static isPositiveNumber(value) {
    return BaseValidator.isValidNumber(value) && parseFloat(value) > 0;
  }

  /**
   * Valida se um valor é um número não negativo
   * @param {any} value - Valor a ser validado
   * @returns {boolean} - True se for número não negativo
   */
  static isNonNegativeNumber(value) {
    return BaseValidator.isValidNumber(value) && parseFloat(value) >= 0;
  }

  /**
   * Valida se uma string não está vazia
   * @param {string} str - String a ser validada
   * @returns {boolean} - True se não estiver vazia
   */
  static isNotEmpty(str) {
    return str && typeof str === "string" && str.trim() !== "";
  }

  /**
   * Valida se um ID é válido
   * @param {any} id - ID a ser validado
   * @returns {boolean} - True se for ID válido
   */
  static isValidId(id) {
    return BaseValidator.isValidNumber(id) && parseInt(id) > 0;
  }

  /**
   * Retorna um objeto de erro padronizado
   * @param {string} message - Mensagem de erro
   * @param {number} status - Status HTTP (padrão: 400)
   * @returns {Object} - Objeto de erro
   */
  static createError(message, status = 400) {
    return {
      isValid: false,
      error: {
        message,
        status,
      },
    };
  }

  /**
   * Retorna um objeto de sucesso
   * @param {Object} data - Dados validados (opcional)
   * @returns {Object} - Objeto de sucesso
   */
  static createSuccess(data = null) {
    return {
      isValid: true,
      data,
    };
  }
}

module.exports = BaseValidator;
