const LiveStream = require('../models/LiveStream')

// Get all live streams
exports.getStreams = async (req, res) => {
  try {
    const streams = await LiveStream.find({ isLive: true }).sort({ createdAt: -1 })
    res.json(streams)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live streams' })
  }
}

// Get a specific live stream
exports.getStream = async (req, res) => {
  try {
    const { id } = req.params
    const stream = await LiveStream.findById(id)
    if (!stream) return res.status(404).json({ error: 'Stream not found' })
    res.json(stream)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stream' })
  }
}

// Send chat message
exports.sendChat = async (req, res) => {
  try {
    const { id } = req.params
    const { user, message, type, isModerator } = req.body
    const stream = await LiveStream.findById(id)
    if (!stream) return res.status(404).json({ error: 'Stream not found' })
    const chatMsg = { user, message, type: type || 'message', isModerator, timestamp: new Date() }
    stream.chatMessages.push(chatMsg)
    await stream.save()
    res.status(201).json(chatMsg)
  } catch (err) {
    res.status(400).json({ error: 'Failed to send chat message' })
  }
}

// Send donation
exports.sendDonation = async (req, res) => {
  try {
    const { id } = req.params
    const { user, amount, message } = req.body
    const stream = await LiveStream.findById(id)
    if (!stream) return res.status(404).json({ error: 'Stream not found' })
    stream.donations += amount
    const donationMsg = { user, message, type: 'donation', amount, timestamp: new Date() }
    stream.chatMessages.push(donationMsg)
    await stream.save()
    res.status(201).json(donationMsg)
  } catch (err) {
    res.status(400).json({ error: 'Failed to send donation' })
  }
} 