const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const summary = require('../controllers/bookingSummaryController')

router.get('/summary', auth, summary.getSummary)

module.exports = router

