const mongoose = require('mongoose')

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    state: { type: String, required: true },
    village: { type: String, required: true },
    coordinates: { type: [Number], default: undefined }, // [lng, lat]
  },
  images: [{ type: String }],
  price: { type: Number, required: true },
  amenities: [{ type: String }],
  experienceType: { type: String, required: true },
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Listing', ListingSchema) 