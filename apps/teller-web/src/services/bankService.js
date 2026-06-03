import apiClient from './api';

/**
 * Get all accounts
 * @returns {Promise<Array>}
 */
export const getAccounts = async () => {
  const response = await apiClient.get('/accounts');
  return response.data;
};

/**
 * Get account by IBAN
 * @param {string} iban
 * @returns {Promise<Object|null>}
 */
export const getAccountByIban = async (iban) => {
  const accounts = await getAccounts();
  return accounts.find((acc) => acc.iban === iban) || null;
};

/**
 * Get transactions (ledger) for an account
 * @param {string} accountId
 * @returns {Promise<Array>}
 */
export const getTransactions = async (accountId) => {
  const response = await apiClient.get(`/transactions/${accountId}`);
  return response.data;
};

/**
 * Calculate balance from transactions
 * @param {Array} transactions
 * @returns {number}
 */
export const calculateBalance = (transactions) => {
  return transactions.reduce((sum, tx) => sum + tx.amount_eur, 0);
};

/**
 * Get balance for an account
 * @param {string} accountId
 * @returns {Promise<number>}
 */
export const getBalance = async (accountId) => {
  const transactions = await getTransactions(accountId);
  return calculateBalance(transactions);
};

/**
 * Transfer funds between accounts
 * @param {string} sourceAccountId
 * @param {string} destinationAccountId
 * @param {number} amount
 * @returns {Promise<Object>}
 */
export const transfer = async (sourceAccountId, destinationAccountId, amount) => {
  const response = await apiClient.post('/transfer', {
    source_account_id: sourceAccountId,
    destination_account_id: destinationAccountId,
    amount_eur: amount,
  });
  return response.data;
};

/**
 * Check backend health
 * @returns {Promise<boolean>}
 */
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health', { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Made with Bob
