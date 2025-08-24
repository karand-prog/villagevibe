const Achievement = require('../models/Achievement')

// Get all achievements for a user
exports.getAchievements = async (req, res) => {
  try {
    const { userId } = req.query
    const query = userId ? { user: userId } : {}
    const achievements = await Achievement.find(query).sort({ date: -1 })
    res.json(achievements)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch achievements' })
  }
}

// Add a new achievement
exports.addAchievement = async (req, res) => {
  try {
    const achievement = new Achievement(req.body)
    await achievement.save()
    res.status(201).json(achievement)
  } catch (err) {
    res.status(400).json({ error: 'Failed to add achievement' })
  }
}

// Delete an achievement
exports.deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params
    await Achievement.findByIdAndDelete(id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete achievement' })
  }
} 