import express from 'express'
import { registerUser, login, refresh } from '../controllers/AuthController.js'

const router = express.Router()
// Register user
router.post('/register', registerUser)

// user login
router.post('/login', login)
// generate access token with refresh token
router.post('/refresh', refresh)

// refresh token


export default router
