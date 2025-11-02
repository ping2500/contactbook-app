import express from "express"
import { signup, login, updateProfile } from "../controllers/auth.controller.js"
import jwt from "jsonwebtoken";

const router = express.Router()

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
router.post("/signup", signup)
router.post("/login", login)


// UPDATE profile
router.put("/profile", authenticateToken, updateProfile);
export default router
