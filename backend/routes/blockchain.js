const express = require('express')
const router = express.Router()

// Mock contract data
const demoContract = {
  address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  name: 'VillageVibe Revenue Split',
  totalRevenue: 125000,
  totalTransactions: 47,
  participants: 23,
  lastUpdated: new Date().toISOString()
}

// Mock transactions
const demoTransactions = [
  {
    id: '1',
    type: 'booking',
    amount: 2500,
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    timestamp: '2024-02-15T10:30:00Z',
    status: 'confirmed',
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
  },
  {
    id: '2',
    type: 'revenue_split',
    amount: 1750,
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    timestamp: '2024-02-15T10:31:00Z',
    status: 'confirmed',
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
  },
  {
    id: '3',
    type: 'community_fund',
    amount: 125,
    from: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    to: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    timestamp: '2024-02-15T10:32:00Z',
    status: 'confirmed',
    hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234'
  }
]

router.get('/contract', (req, res) => {
  res.json(demoContract)
})

router.get('/transactions', (req, res) => {
  res.json(demoTransactions)
})

module.exports = router 