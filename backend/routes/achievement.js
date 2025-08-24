const express = require('express')
const router = express.Router()
const achievementController = require('../controllers/achievementController')

// Get all achievements for a user
router.get('/', achievementController.getAchievements)

// Add a new achievement
router.post('/', achievementController.addAchievement)

// Delete an achievement
router.delete('/:id', achievementController.deleteAchievement)

module.exports = router 