const mongoose = require('mongoose')

const AudioStorySchema = new mongoose.Schema({
  villageId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  narrator: {
    name: String,
    avatar: String,
    role: String
  },
  audioUrl: { type: String, required: true },
  duration: { type: Number },
  category: { type: String },
  language: { type: String },
  transcript: { type: String },
  likes: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  tags: [{ type: String }]
})

module.exports = mongoose.model('AudioStory', AudioStorySchema) 