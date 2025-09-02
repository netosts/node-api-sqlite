/**
 * Validadores utilitários
 */

/**
 * Valida se o email tem formato válido
 * @param {string} email - Email a ser validado
 * @returns {boolean} - True se válido, false caso contrário
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida se um valor é um número válido
 * @param {any} value - Valor a ser validado
 * @returns {boolean} - True se for número válido
 */
const isValidNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

/**
 * Valida se um valor é um número positivo
 * @param {any} value - Valor a ser validado
 * @returns {boolean} - True se for número positivo
 */
const isPositiveNumber = (value) => {
  return isValidNumber(value) && parseFloat(value) > 0;
};

/**
 * Valida se um valor é um número não negativo
 * @param {any} value - Valor a ser validado
 * @returns {boolean} - True se for número não negativo
 */
const isNonNegativeNumber = (value) => {
  return isValidNumber(value) && parseFloat(value) >= 0;
};

/**
 * Valida se uma string não está vazia
 * @param {string} str - String a ser validada
 * @returns {boolean} - True se não estiver vazia
 */
const isNotEmpty = (str) => {
  return str && typeof str === "string" && str.trim() !== "";
};

/**
 * Valida se um ID é válido
 * @param {any} id - ID a ser validado
 * @returns {boolean} - True se for ID válido
 */
const isValidId = (id) => {
  return isValidNumber(id) && parseInt(id) > 0;
};

module.exports = {
  isValidEmail,
  isValidNumber,
  isPositiveNumber,
  isNonNegativeNumber,
  isNotEmpty,
  isValidId,
};
