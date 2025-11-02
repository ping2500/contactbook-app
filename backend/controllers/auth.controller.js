import bcrypt from "bcryptjs"
import pool from "../config/database.js"
import { generateToken } from "../utils/jwt.js"
import { validateEmail, validatePassword } from "../utils/validation.js"
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { email, password, role } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" })
    }

    const userRole = role === "admin" ? "admin" : "user"

    // Check if user already exists
    const connection = await pool.getConnection()
    const [existingUser] = await connection.query("SELECT id FROM users WHERE email = ?", [email])

    if (existingUser.length > 0) {
      connection.release()
      return res.status(409).json({ success: false, message: "User already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [result] = await connection.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [
      email,
      hashedPassword,
      userRole,
    ])

    connection.release()

    const user = { id: result.insertId, email, role: userRole }
    const token = generateToken(user)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error("[SIGNUP ERROR]", error)
    res.status(500).json({ success: false, message: "Signup failed" })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" })
    }

    // Get user from database
    const connection = await pool.getConnection()
    const [users] = await connection.query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      connection.release()
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    const user = users[0]

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      connection.release()
      return res.status(401).json({ success: false, message: "Invalid credentials" })
    }

    connection.release()

    // Generate token
    const token = generateToken(user)

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error("[LOGIN ERROR]", error)
    res.status(500).json({ success: false, message: "Login failed" })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password, role } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const connection = await pool.getConnection();

    // Check if user exists
    const [existingUser] = await connection.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (existingUser.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Prepare update fields
    const fields = [];
    const values = [];

    if (name) {
      fields.push("name = ?");
      values.push(name);
    }

    if (email) {
      fields.push("email = ?");
      values.push(email);
    }

    if (role) {
      fields.push("role = ?");
      values.push(role);
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    // No updates provided
    if (fields.length === 0) {
      connection.release();
      return res.status(400).json({ success: false, message: "No valid fields to update" });
    }

    values.push(userId);

    // Perform update
    const [result] = await connection.query(
      `UPDATE users SET ${fields.join(", ")}, updatedAt = NOW() WHERE id = ?`,
      values
    );

    // Fetch updated user
    const [updatedUser] = await connection.query(
      "SELECT id, email, role FROM users WHERE id = ?",
      [userId]
    );

    connection.release();

    // Generate new token
    const token = generateToken(updatedUser[0]);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      token,
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("[UPDATE PROFILE ERROR]", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};