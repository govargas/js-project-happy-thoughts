import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ThoughtSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [5, 'Message must be at least 5 characters'],
    maxlength: [140, 'Message must be at most 140 characters'],
    trim: true
  },
  hearts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

export default model('Thought', ThoughtSchema)