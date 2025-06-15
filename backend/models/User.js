import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // Basic email format check
    match: /^\S+@\S+\.\S+$/
  },
  passwordHash: {
    type: String,
    required: true
  }
}, { timestamps: true })

// Virtual setter: when you assign user.password, it hashes into passwordHash
userSchema.virtual('password')
  .set(function(password) {
    this._password = password
    this.passwordHash = bcrypt.hashSync(password, SALT_ROUNDS)
  })

// Method to compare a plain-text password to the stored hash
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash)
}

// Export the User model
export default mongoose.model('User', userSchema)