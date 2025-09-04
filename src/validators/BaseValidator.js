class BaseValidator {
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
  }

  static isPositiveNumber(value) {
    return BaseValidator.isValidNumber(value) && parseFloat(value) > 0;
  }

  static isNegativeNumber(value) {
    return BaseValidator.isValidNumber(value) && parseFloat(value) < 0;
  }

  static isEmpty(str) {
    return !str || typeof str !== "string" || str.trim() === "";
  }

  static createError(message = "Algo deu errado", status = 400) {
    return {
      isValid: false,
      error: {
        message,
        status,
      },
    };
  }

  static createSuccess(data = null) {
    return {
      isValid: true,
      data,
    };
  }
}

module.exports = BaseValidator;
