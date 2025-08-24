const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const audioStoryController = require('../controllers/audioStoryController')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/audio'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  }
})
const upload = multer({ storage })

// Get all stories for a village
router.get('/', audioStoryController.getStories)

// Add a new story (with file upload)
router.post('/', upload.single('audio'), audioStoryController.addStory)

// Serve audio file
router.get('/audio/:filename', audioStoryController.getAudio)

module.exports = router 