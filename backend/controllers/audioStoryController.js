const AudioStory = require('../models/AudioStory')
const path = require('path')
const fs = require('fs')

// Get all stories for a village
exports.getStories = async (req, res) => {
  try {
    const { villageId } = req.query
    const query = villageId ? { villageId } : {}
    const stories = await AudioStory.find(query).sort({ createdAt: -1 })
    res.json(stories)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch audio stories' })
  }
}

// Add a new story (with file upload)
exports.addStory = async (req, res) => {
  try {
    const { title, description, narrator, duration, category, language, transcript, tags, villageId } = req.body
    const file = req.file
    if (!file) return res.status(400).json({ error: 'Audio file is required' })
    const audioUrl = `/uploads/audio/${file.filename}`
    const story = new AudioStory({
      villageId,
      title,
      description,
      narrator: JSON.parse(narrator),
      audioUrl,
      duration,
      category,
      language,
      transcript,
      tags: tags ? JSON.parse(tags) : []
    })
    await story.save()
    res.status(201).json(story)
  } catch (err) {
    res.status(400).json({ error: 'Failed to add audio story' })
  }
}

// Serve audio file
exports.getAudio = (req, res) => {
  const { filename } = req.params
  const filePath = path.join(__dirname, '../../uploads/audio', filename)
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath)
  } else {
    res.status(404).json({ error: 'Audio file not found' })
  }
} 