const express = require('express')
const router = express.Router()
const liveStreamController = require('../controllers/liveStreamController')

// Get all live streams
router.get('/', liveStreamController.getStreams)

// Get a specific live stream
router.get('/:id', liveStreamController.getStream)

// Send chat message
router.post('/:id/chat', liveStreamController.sendChat)

// Send donation
router.post('/:id/donate', liveStreamController.sendDonation)

module.exports = router 