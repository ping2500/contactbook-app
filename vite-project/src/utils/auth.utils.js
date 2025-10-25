/**
 * Get authorization header with JWT token
 * @returns {Object} Authorization header object
 */
export const getAuthHeader = () => {
  const token = localStorage.getItem("token")
  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token")
}

/**
 * Store JWT token
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  localStorage.setItem("token", token)
}

/**
 * Remove JWT token (logout)
 */
export const removeAuthToken = () => {
  localStorage.removeItem("token")
}

/**
 * Get stored JWT token
 * @returns {string|null} JWT token or null
 */
export const getAuthToken = () => {
  return localStorage.getItem("token")
}
