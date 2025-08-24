const mongoose = require('mongoose')

const VolunteerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  skills: [{ type: String }],
  availableDates: [{ type: Date }],
  bio: { type: String },
  villageNeeds: [{
    village: { type: String },
    need: { type: String },
    description: { type: String },
    discountOffered: { type: Number }
  }]
})

module.exports = mongoose.model('VolunteerProfile', VolunteerProfileSchema) 