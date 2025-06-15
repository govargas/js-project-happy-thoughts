/* global process */
/* eslint-env node */
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Ensure we have a secret configured
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined')
  process.exit(1)
}

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.id)
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export default auth