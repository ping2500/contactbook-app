import { jwtDecode } from "jwt-decode";

// Helper function to get user info from the token
export const getUserInfo = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return null;
  }
  try {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return null;
    }
    return decoded;
  } catch (e) {
    // Handle invalid token
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return null;
  }
};

// Helper function to check if the user is an admin
export const isAdmin = () => {
  try {
    const userJson = localStorage.getItem("user");
    if (!userJson) return false;
    const user = JSON.parse(userJson);
    return user && user.role === "admin";
  } catch (e) {
    console.error("Failed to parse user data from localStorage:", e);
    return false;
  }
};

// Helper function for logout
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// Helper to get token for headers
export const getAuthHeader = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
