import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()
const { JWT_SECRET } = process.env

// Register
router.post(
  '/register',
  body('username').isLength({ min: 3 }).withMessage('Username ≥3 chars'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password ≥6 chars'),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const { username, email, password } = req.body
      if (await User.findOne({ $or: [{ username }, { email }] })) {
        return res.status(400).json({ error: 'Username or email already exists' })
      }
      const user = new User({ username, email, password })
      await user.save()
      res.status(201).json({ message: 'User registered successfully' })
    } catch (err) {
      next(err)
    }
  }
)

// Login
router.post(
  '/login',
  body('username').exists(),
  body('password').exists(),
  async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
      const { username, password } = req.body
      const user = await User.findOne({ username })
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ error: 'Invalid username or password' })
      }
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
      res.json({ token })
    } catch (err) {
      next(err)
    }
  }
)

export default router