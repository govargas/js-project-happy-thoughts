/* global process */
import { Router } from 'express'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Thought from '../models/Thought.js'
import auth from '../middleware/auth.js'

const router = Router()
const { JWT_SECRET } = process.env

// Register...existing /register and /login unchanged)

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