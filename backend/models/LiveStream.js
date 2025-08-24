const mongoose = require('mongoose')

const ChatMessageSchema = new mongoose.Schema({
  user: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
  type: { type: String, enum: ['message', 'donation', 'join', 'system'], default: 'message' },
  amount: Number,
  isModerator: Boolean
})

const LiveStreamSchema = new mongoose.Schema({
  title: { type: String, required: true },
  host: { type: String, required: true },
  village: { type: String, required: true },
  viewers: { type: Number, default: 0 },
  duration: { type: String },
  thumbnail: { type: String },
  isLive: { type: Boolean, default: true },
  category: { type: String },
  description: { type: String },
  tags: [{ type: String }],
  donations: { type: Number, default: 0 },
  chatMessages: [ChatMessageSchema],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('LiveStream', LiveStreamSchema) 