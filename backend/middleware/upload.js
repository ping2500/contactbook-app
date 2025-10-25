import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const uploadDir = path.join(__dirname, "../uploads")

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const fileFilter = (req, file, cb) => {
  const allowedFormats = process.env.ALLOWED_FORMATS.split(",")
  const ext = path.extname(file.originalname).toLowerCase().slice(1)

  if (!allowedFormats.includes(ext)) {
    return cb(new Error(`Only ${allowedFormats.join(", ")} formats are allowed`))
  }

  if (file.size > Number.parseInt(process.env.MAX_FILE_SIZE)) {
    return cb(new Error("File size exceeds 250KB limit"))
  }

  cb(null, true)
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: Number.parseInt(process.env.MAX_FILE_SIZE) },
})
