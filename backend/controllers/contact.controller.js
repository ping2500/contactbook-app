import pool from "../config/database.js"
import { validateContactData } from "../utils/validation.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getAllContacts = async (req, res) => {
  try {
    const connection = await pool.getConnection()
    const [contacts] = await connection.query(
      "SELECT id, name, title, category, email, phone, company, address, image, userId, createdAt, updatedAt FROM contacts ORDER BY createdAt DESC",
    )
    connection.release()

    res.json({
      success: true,
      data: contacts,
    })
  } catch (error) {
    console.error("[GET CONTACTS ERROR]", error)
    res.status(500).json({ success: false, message: "Failed to fetch contacts" })
  }
}

export const getContactById = async (req, res) => {
  try {
    const { id } = req.params

    const connection = await pool.getConnection()
    const [contacts] = await connection.query("SELECT * FROM contacts WHERE id = ?", [id])
    connection.release()

    if (contacts.length === 0) {
      return res.status(404).json({ success: false, message: "Contact not found" })
    }

    res.json({
      success: true,
      data: contacts[0],
    })
  } catch (error) {
    console.error("[GET CONTACT ERROR]", error)
    res.status(500).json({ success: false, message: "Failed to fetch contact" })
  }
}

export const createContact = async (req, res) => {
  try {
    const { name, title, category, email, phone, company, address } = req.body
    const userId = req.user.id

    // Validation
    const errors = validateContactData({ name, title, category, email, phone, company, address })
    if (errors.length > 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(400).json({ success: false, message: errors.join(", ") })
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null

    const connection = await pool.getConnection()
    const [result] = await connection.query(
      "INSERT INTO contacts (name, title, category, email, phone, company, address, image, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [name, title, category, email, phone, company, address, imagePath, userId],
    )
    connection.release()

    res.status(201).json({
      success: true,
      message: "Contact created successfully",
      data: {
        id: result.insertId,
        name,
        title,
        category,
        email,
        phone,
        company,
        address,
        image: imagePath,
        userId,
      },
    })
  } catch (error) {
    console.error("[CREATE CONTACT ERROR]", error)
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ success: false, message: "Failed to create contact" })
  }
}

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params
    const { name, title, category, email, phone, company, address } = req.body

    // Validation
    const errors = validateContactData({ name, title, category, email, phone, company, address })
    if (errors.length > 0) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(400).json({ success: false, message: errors.join(", ") })
    }

    const connection = await pool.getConnection()

    // Get existing contact
    const [contacts] = await connection.query("SELECT * FROM contacts WHERE id = ?", [id])

    if (contacts.length === 0) {
      connection.release()
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return res.status(404).json({ success: false, message: "Contact not found" })
    }

    const existingContact = contacts[0]
    let imagePath = existingContact.image

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (existingContact.image) {
        const oldImagePath = path.join(__dirname, "../", existingContact.image)
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }
      imagePath = `/uploads/${req.file.filename}`
    }

    // Update contact
    await connection.query(
      "UPDATE contacts SET name = ?, title = ?, category = ?, email = ?, phone = ?, company = ?, address = ?, image = ? WHERE id = ?",
      [name, title, category, email, phone, company, address, imagePath, id],
    )

    connection.release()

    res.json({
      success: true,
      message: "Contact updated successfully",
      data: {
        id,
        name,
        title,
        category,
        email,
        phone,
        company,
        address,
        image: imagePath,
      },
    })
  } catch (error) {
    console.error("[UPDATE CONTACT ERROR]", error)
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }
    res.status(500).json({ success: false, message: "Failed to update contact" })
  }
}

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params

    const connection = await pool.getConnection()

    // Get contact to delete image
    const [contacts] = await connection.query("SELECT image FROM contacts WHERE id = ?", [id])

    if (contacts.length === 0) {
      connection.release()
      return res.status(404).json({ success: false, message: "Contact not found" })
    }

    // Delete image file if exists
    if (contacts[0].image) {
      const imagePath = path.join(__dirname, "../", contacts[0].image)
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath)
      }
    }

    // Delete contact
    await connection.query("DELETE FROM contacts WHERE id = ?", [id])
    connection.release()

    res.json({
      success: true,
      message: "Contact deleted successfully",
    })
  } catch (error) {
    console.error("[DELETE CONTACT ERROR]", error)
    res.status(500).json({ success: false, message: "Failed to delete contact" })
  }
}
