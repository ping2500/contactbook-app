import bcrypt from "bcryptjs"
import pool from "../config/database.js"
import { generateToken } from "../utils/jwt.js"
import { validateEmail, validatePassword } from "../utils/validation.js"

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

