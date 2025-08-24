const VolunteerProfile = require('../models/VolunteerProfile')

// Get all volunteer profiles or by user
exports.getProfiles = async (req, res) => {
  try {
    const { userId } = req.query
    const query = userId ? { user: userId } : {}
    const profiles = await VolunteerProfile.find(query).sort({ _id: -1 })
    res.json(profiles)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch volunteer profiles' })
  }
}

// Add a new volunteer profile
exports.addProfile = async (req, res) => {
  try {
    const profile = new VolunteerProfile(req.body)
    await profile.save()
    res.status(201).json(profile)
  } catch (err) {
    res.status(400).json({ error: 'Failed to add volunteer profile' })
  }
}

// Update a volunteer profile
exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params
    const profile = await VolunteerProfile.findByIdAndUpdate(id, req.body, { new: true })
    res.json(profile)
  } catch (err) {
    res.status(400).json({ error: 'Failed to update volunteer profile' })
  }
}

// Delete a volunteer profile
exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params
    await VolunteerProfile.findByIdAndDelete(id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete volunteer profile' })
  }
}

// Match volunteers to village needs
exports.matchVolunteers = async (req, res) => {
  try {
    const { skill, need } = req.query
    let query = {}
    if (skill) query['skills'] = skill
    if (need) query['villageNeeds.need'] = need
    const matches = await VolunteerProfile.find(query)
    res.json(matches)
  } catch (err) {
    res.status(500).json({ error: 'Failed to match volunteers' })
  }
} 