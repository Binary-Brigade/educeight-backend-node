import express from 'express'
import { registerUser } from '../controllers/AuthController.js'
import { login } from '../controllers/AuthController.js'

const router = express.Router()
// Register user
router.post('/register', registerUser)

// user login
router.post('/login', login)

// refresh token


export default router
