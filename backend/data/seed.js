import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Thought from '../models/Thought.js'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/happythoughts'

// Build an absolute path to your JSON file
const filePath = path.join(process.cwd(), 'data', 'thoughts.json')
const fileContents = fs.readFileSync(filePath, 'utf8')
const thoughts = JSON.parse(fileContents)

mongoose
  .connect(mongoUrl)
  .then(async () => {
    console.log('✅ Connected to MongoDB for seeding')
    // 1. Remove any existing documents
    await Thought.deleteMany()
    // 2. Insert the dummy data
    const inserted = await Thought.insertMany(thoughts)
    console.log(`🌱 Seeded ${inserted.length} thoughts`)
  })
  .catch((err) => {
    console.error('❌ Seeding error:', err)
  })
  .finally(() => {
    mongoose.connection.close()
  })