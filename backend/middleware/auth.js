/* global process */
/* eslint-env node */
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Ensure we have a secret configured
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined')
  process.exit(1)
}

export default async function auth(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }

  const token = authHeader.split(' ')[1]
  try {
    // Verify token and extract user ID
    const { userId } = jwt.verify(token, process.env.JWT_SECRET)
    // Fetch user from the database
    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    // Attach user and userId for controllers
    req.user = user
    req.userId = user._id.toString()
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}