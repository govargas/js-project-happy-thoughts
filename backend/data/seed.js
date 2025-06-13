import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Thought from '../models/Thought.js'
import thoughts from './thoughts.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/happythoughts'

mongoose
  .connect(mongoUrl)
  .then(async () => {
    console.log('✅ Connected to MongoDB for seeding')
    // 1. Clear existing documents
    await Thought.deleteMany()
    // 2. Insert our dummy data
    const inserted = await Thought.insertMany(thoughts)
    console.log(`🌱 Seeded ${inserted.length} thoughts`)
  })
  .catch((err) => {
    console.error('❌ Seeding error:', err)
  })
  .finally(() => {
    mongoose.connection.close()
  })