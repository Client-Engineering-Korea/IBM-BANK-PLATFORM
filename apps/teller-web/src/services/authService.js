import apiClient from './api';

/**
 * Login with username and password
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{access_token: string, token_type: string}>}
 */
export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiClient.post('/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const { access_token } = response.data;
  
  // Store token in localStorage
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('user', username);

  return response.data;
};

/**
 * Logout - clear stored credentials
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

/**
 * Get current user
 * @returns {string|null}
 */
export const getCurrentUser = () => {
  return localStorage.getItem('user');
};

// Made with Bob
