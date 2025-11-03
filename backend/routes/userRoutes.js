/* global process */
import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Thought from '../models/Thought.js'
import auth from '../middleware/auth.js'

const router = Router()
const { JWT_SECRET } = process.env

// POST /auth/register — create a new user
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() })
      }

      const { username, email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ username }, { email }] })
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          error: 'Username or email already exists' 
        })
      }

      // Create new user (password will be hashed via the virtual setter)
      const user = new User({ username, email, password })
      await user.save()

      res.status(201).json({ 
        success: true, 
        response: { 
          id: user._id, 
          username: user.username,
          email: user.email 
        } 
      })
    } catch (err) {
      next(err)
    }
  }
)

// POST /auth/login — authenticate user
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() })
      }

      const { username, password } = req.body

      // Find user by username
      const user = await User.findOne({ username })
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' })
      }

      // Check password
      const isMatch = await user.comparePassword(password)
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' })
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

      res.json({ 
        success: true, 
        token,
        response: { 
          id: user._id, 
          username: user.username 
        } 
      })
    } catch (err) {
      next(err)
    }
  }
)

// GET /auth/me — who am I? and what have I liked?
router.get('/me', auth, async (req, res, next) => {
  try {
    // Fetch all thoughts this user has liked
    const likedDocs = await Thought.find({ likedBy: req.userId }).select('_id').lean()
    const likedIds = likedDocs.map(t => t._id.toString())

    // Fetch user details
    res.json({ 
      success: true,
      response: {
        id: req.userId,
        username: req.user.username,
        likedIds
      }
    })
  } catch (err) {
    next(err)
  }
})

export default router