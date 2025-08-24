const express = require('express')
const router = express.Router()
const volunteerController = require('../controllers/volunteerController')

// Get all volunteer profiles or by user
router.get('/', volunteerController.getProfiles)

// Add a new volunteer profile
router.post('/', volunteerController.addProfile)

// Update a volunteer profile
router.put('/:id', volunteerController.updateProfile)

// Delete a volunteer profile
router.delete('/:id', volunteerController.deleteProfile)

// Match volunteers to village needs
router.get('/match', volunteerController.matchVolunteers)

module.exports = router 