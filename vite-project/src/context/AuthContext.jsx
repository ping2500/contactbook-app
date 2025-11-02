"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { getAuthToken, removeAuthToken, setAuthToken } from "../utils/auth.utils"
import { jwtDecode } from "jwt-decode"

// Create Auth Context
const AuthContext = createContext(null)

/**
 * Auth Provider Component
 * Manages authentication state and provides auth methods to the app
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = getAuthToken()
    if (token) {
      try {
        // Decode JWT to get user data
        const decoded = jwtDecode(token)
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role, // 'admin' or 'user'
        })
      } catch (err) {
        console.error("Failed to decode token:", err)
        removeAuthToken()
      }
    }
    setLoading(false)
  }, [])

  /**
   * Login user
   * @param {string} email
   * @param {string} password
   * @returns {Promise} User data
   */
  const login = async (email, password) => {
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store token and decode user data
      setAuthToken(data.token)
      const decoded = jwtDecode(data.token)
      const userData = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  /**
   * Sign up new user
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @param {string} role - 'admin' or 'user' (defaults to 'user')
   * @returns {Promise} User data
   */
  const signup = async (name, email, password, role = "user") => {
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Signup failed")
      }

      // Store token and decode user data
      setAuthToken(data.token)
      const decoded = jwtDecode(data.token)
      const userData = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - { name, email, password, role }
   * @returns {Promise} Updated user data
   */
  const updateProfile = async (profileData) => {
    setError(null)
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed")
      }

      // Update token and user data
      if (data.token) {
        setAuthToken(data.token)
      }

      const decoded = jwtDecode(data.token || token)
      const userData = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role,
      }
      setUser(userData)
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  /**
   * Logout user
   */
  const logout = () => {
    removeAuthToken()
    setUser(null)
    setError(null)
  }

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return user?.role === "admin"
  }

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return !!user
  }

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    updateProfile,
    isAdmin,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use Auth Context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
