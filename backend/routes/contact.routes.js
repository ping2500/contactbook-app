import express from "express"
import { verifyToken, verifyAdmin } from "../middleware/auth.js"
import { upload } from "../middleware/upload.js"
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from "../controllers/contact.controller.js"

const router = express.Router()

// All routes require authentication
router.use(verifyToken)

// Get all contacts (accessible to all authenticated users)
router.get("/", getAllContacts)

// Get single contact
router.get("/:id", getContactById)

// Create contact (admin only)
router.post("/", verifyAdmin, upload.single("image"), createContact)

// Update contact (admin only)
router.put("/:id", verifyAdmin, upload.single("image"), updateContact)

// Delete contact (admin only)
router.delete("/:id", verifyAdmin, deleteContact)

export default router
