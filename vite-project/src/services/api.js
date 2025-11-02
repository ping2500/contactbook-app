import axios from "axios"
import { getAuthToken } from "../utils/auth.utils"

// Create Axios instance with base URL
const API_BASE_URL = "http://localhost:5000/api"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// ============ AUTH ENDPOINTS ============

/**
 * Sign up a new user
 * @param {Object} userData - { name, email, password, role }
 * @returns {Promise} Response with token and user data
 */
export const authSignUp = (userData) => {
  return apiClient.post("/auth/signup", userData)
}

/**
 * Login user
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Response with token and user data
 */
export const authLogin = (credentials) => {
  return apiClient.post("/auth/login", credentials)
}

// ============ CONTACT ENDPOINTS ============

/**
 * Get all contacts
 * @returns {Promise} Array of contacts
 */
export const getContacts = () => {
  return apiClient.get("/contacts")
}

/**
 * Get single contact by ID
 * @param {number} id - Contact ID
 * @returns {Promise} Contact data
 */
export const getContactById = (id) => {
  return apiClient.get(`/contacts/${id}`)
}

/**
 * Create new contact (admin only)
 * @param {FormData} formData - Contact data with image file
 * @returns {Promise} Created contact data
 */
export const createContact = (formData) => {
  return apiClient.post("/contacts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

/**
 * Update contact (admin only)
 * @param {number} id - Contact ID
 * @param {FormData} formData - Updated contact data with image file
 * @returns {Promise} Updated contact data
 */
export const updateContact = (id, formData) => {
  return apiClient.put(`/contacts/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
}

/**
 * Delete contact (admin only)
 * @param {number} id - Contact ID
 * @returns {Promise} Success response
 */
export const deleteContact = (id) => {
  return apiClient.delete(`/contacts/${id}`)
}

// ============ USER PROFILE ENDPOINTS ============

/**
 * Update user profile
 * @param {Object} userData - { name, email, password, role }
 * @returns {Promise} Updated user data with new token
 */
export const updateUserProfile = (userData) => {
  return apiClient.put("/auth/profile", userData)
}

/**
 * Get current user profile
 * @returns {Promise} User profile data
 */
export const getUserProfile = () => {
  return apiClient.get("/auth/profile")
}

export default apiClient
