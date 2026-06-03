/**
 * Format currency amount
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export const formatCurrency = (amount, currency = 'EUR') => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Format date and time
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

/**
 * Format IBAN for display
 * @param {string} iban
 * @returns {string}
 */
export const formatIban = (iban) => {
  if (!iban) return '';
  return iban.match(/.{1,4}/g)?.join(' ') || iban;
};

/**
 * Validate IBAN format (basic check)
 * @param {string} iban
 * @returns {boolean}
 */
export const validateIban = (iban) => {
  if (!iban) return false;
  // Remove spaces and convert to uppercase
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  // Basic format check: 2 letters + 2 digits + up to 30 alphanumeric
  return /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(cleanIban);
};

/**
 * Validate amount
 * @param {number|string} amount
 * @returns {boolean}
 */
export const validateAmount = (amount) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > 0;
};

// Made with Bob
