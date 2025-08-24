const mongoose = require('mongoose')

const AchievementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g., 'visited_state', 'language_used', 'plastic_free_travel', etc.
  date: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed }, // e.g., { state: 'Rajasthan' }
})

module.exports = mongoose.model('Achievement', AchievementSchema) 