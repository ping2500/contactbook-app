
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2/promise"); // Using promise-based wrapper
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // For password hashing

// --- Configuration ---
const dbConfig = require("./db.config.js"); // Import DB config
const app = express();
const PORT = 5000;
const JWT_SECRET = "Aqib_Ali";
const CONTACT_BASE = "/api/contacts";

// --- Middlewares ---
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let pool; // Connection pool variable

// --- 1. Database Connection & Initial Admin Setup ---
const initializeDB = async () => {
  try {
    // Create the connection pool
    pool = mysql.createPool(dbConfig);
    console.log("MySQL Connection Pool created successfully.");

    // Check if admin user exists, if not, create it
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      "admin@contactbook.com",
    ]);
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await pool.execute(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        ["administrator", "admin@contactbook.com", hashedPassword, "admin"]
      );
      console.log("Default Admin user created successfully.");
    } else if (rows[0].role !== "admin") {
      await pool.execute("UPDATE users SET role = ? WHERE email = ?", [
        "admin",
        "admin@contactbook.com",
      ]);
      console.log("Existing Admin user role confirmed.");
    }
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

// --- 2. Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expects: "Bearer TOKEN"

  if (token == null) {
    // 401: Unauthorized - No token provided
    return res
      .status(401)
      .json({ success: false, message: "Access Denied. Please log in." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // 403: Forbidden - Token invalid or expired
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired token." });
    }
    // Token is valid. Attach user info (id, email, role, username) to the request
    req.user = user;
    next();
  });
};

// --- 3. Authorization Middleware (Admin Check) ---
const authorizeAdmin = (req, res, next) => {
  // Check the role attached by the authenticateToken middleware
  if (req.user && req.user.role === "admin") {
    next(); // User is an admin, proceed
  } else {
    // 403: Forbidden - User does not have permission
    res.status(403).json({
      success: false,
      message: "Permission Denied. Admin access required.",
    });
  }
};

// --- 4. LOGIN API (No Auth needed) ---
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const user = rows[0];

    if (user && (await bcrypt.compare(password, user.password))) {
      // Successful Login: Generate Token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          username: user.username,
        },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        success: true,
        message: "Login successful!",
        token: token,
        user: { username: user.username, role: user.role }, // Send back user info for UI
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password." });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during login." });
  }
});

// --- 5. CONTACTS CRUD API (Protected Routes) ---

// All Users (Admin/Regular) can VIEW (GET) contacts, but MUST be logged in.
app.get(CONTACT_BASE, authenticateToken, async (req, res) => {
  try {
    // Query to fetch all contacts
    const [rows] = await pool.execute("SELECT * FROM contacts");
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET All Contacts Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch contacts." });
  }
});

// Only Admin can ADD (POST) new contacts.
app.post(CONTACT_BASE, authenticateToken, authorizeAdmin, async (req, res) => {
  const { imageUrl, firstName, lastName, PhoneNumber, Email } = req.body;

  if (!firstName || !PhoneNumber) {
    return res.status(400).json({
      success: false,
      message: "First Name and Phone Number are required.",
    });
  }

  try {
    const query = `
            INSERT INTO contacts 
            (imageUrl, firstName, lastName, PhoneNumber, Email) 
            VALUES (?, ?, ?, ?, ?)
        `;

    const [result] = await pool.execute(query, [
      imageUrl || null, // Allow null if not provided
      firstName,
      lastName || null,
      PhoneNumber,
      Email || null,
    ]);

    res.status(201).json({
      success: true,
      message: "Contact added successfully!",
      id: result.insertId,
    });
  } catch (error) {
    console.error("POST Contact Error:", error);
    res.status(500).json({ success: false, message: "Failed to add contact." });
  }
});

// Only Admin can EDIT (PUT) contacts.
app.put(`${CONTACT_BASE}/:id`, authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const { firstName, lastName, PhoneNumber, Email, imageUrl } = req.body;
        const contactId = req.params.id;

        const [result] = await pool.execute(
            `UPDATE contacts 
             SET firstName = ?, lastName = ?, PhoneNumber = ?, Email = ?, imageUrl = ? 
             WHERE id = ?`,
            [firstName, lastName, PhoneNumber, Email, imageUrl, contactId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Contact not found or no changes made.' });
        }
        res.status(200).json({ success: true, message: 'Contact updated successfully!' });
    } catch (error) {
        console.error('PUT Contact Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update contact.' });
    }
});
// Only Admin can DELETE contacts.
app.delete(
  `${CONTACT_BASE}/:id`,
  authenticateToken,
  authorizeAdmin,
  async (req, res) => {
    try {
      const [result] = await pool.execute("DELETE FROM contacts WHERE id = ?", [
        req.params.id,
      ]);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Contact not found." });
      }
      res
        .status(200)
        .json({ success: true, message: "Contact deleted successfully!" });
    } catch (error) {
      console.error("DELETE Contact Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to delete contact." });
    }
  }
);

// GET single contact (Needs Auth, but all logged-in users can view details)
app.get(`${CONTACT_BASE}/:id`, authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM contacts WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Contact not found." });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("GET Single Contact Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch contact details." });
  }
});
app.post("/api/signup", async (req, res) => {
  // Expecting username, email, and password from the frontend
  const { username, email, password } = req.body;
  const ROLE = "user"; // Default role for standard sign-ups

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All fields (username, email, password) are required.",
      });
  }

  try {
    // 1. Check if user/email already exists
    const [existingUsers] = await pool.execute(
      "SELECT email FROM users WHERE email = ?",
      [email]
    );
    if (existingUsers.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Email is already registered." });
    }

    // 2. Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insert new user into the database
    const query =
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    await pool.execute(query, [username, email, hashedPassword, ROLE]);

    // Success response
    res
      .status(201)
      .json({
        success: true,
        message: "User registered successfully! You can now log in.",
      });
  } catch (error) {
    console.error("Sign-up Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server failed to register user." });
  }
});
// Simple test route for the root path

// --- Server Startup ---
app.listen(PORT, async () => {
  await initializeDB(); // Initialize DB connection and Admin user check
  console.log(`Server is running on port ${PORT}`);
});
