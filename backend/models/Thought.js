import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  hearts: {
    type: Number,
    default: 0
  },
  // Link each thought to its creator
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Track exactly which users have liked this thought
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
}, {
  timestamps: true
})

export default model('Thought', ThoughtSchema)