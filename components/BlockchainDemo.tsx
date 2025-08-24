'use client'

import React, { useState, useEffect } from 'react'
import { Wallet, Coins, Users, TrendingUp, Shield, Eye, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslation } from './LanguageDetector'

interface RevenueSplit {
  host: number
  guide: number
  artisan: number
  platform: number
  community: number
}

interface Transaction {
  id: string
  type: 'booking' | 'revenue_split' | 'community_fund'
  amount: number
  from: string
  to: string
  timestamp: string
  status: 'pending' | 'confirmed' | 'failed'
  hash?: string
}

interface SmartContract {
  address: string
  name: string
  totalRevenue: number
  totalTransactions: number
  participants: number
  lastUpdated: string
}

const BlockchainDemo = () => {
  const { t } = useTranslation()
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const [contract, setContract] = useState<SmartContract | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [revenueSplit, setRevenueSplit] = useState<RevenueSplit>({
    host: 70,
    guide: 10,
    artisan: 5,
    platform: 10,
    community: 5
  })
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchBlockchainData = async () => {
      setIsLoading(true)
      try {
        const contractRes = await fetch('/api/blockchain/contract')
        const contractData = await contractRes.json()
        setContract(contractData)
        const txRes = await fetch('/api/blockchain/transactions')
        const txData = await txRes.json()
        setTransactions(txData)
      } catch (err) {
        // Optionally set error state
      } finally {
        setIsLoading(false)
      }
    }
    fetchBlockchainData()
  }, [])

  const connectWallet = async () => {
    setIsLoading(true)
    
    // Simulate MetaMask connection
    setTimeout(() => {
      const demoAddress = '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
      setWalletAddress(demoAddress)
      setIsConnected(true)
      setShowConnectModal(false)
      setIsLoading(false)
    }, 2000)
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setWalletAddress('')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show success message
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Coins className="w-4 h-4" />
      case 'revenue_split':
        return <Users className="w-4 h-4" />
      case 'community_fund':
        return <Shield className="w-4 h-4" />
      default:
        return <Coins className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatAmount = (amount: number) => {
    return `₹${amount.toLocaleString()}`
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-earth-800 mb-2">Blockchain Revenue Transparency</h2>
          <p className="text-earth-600">Experience transparent revenue distribution using Polygon blockchain</p>
        </div>
        
        {!isConnected ? (
          <button
            onClick={() => setShowConnectModal(true)}
            className="btn-primary flex items-center"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Connected
            </div>
            <button
              onClick={disconnectWallet}
              className="btn-secondary"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Smart Contract Overview */}
      {contract && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-earth-800">Smart Contract Overview</h3>
            <div className="flex items-center gap-2 text-sm text-earth-600">
              <Shield className="w-4 h-4" />
              <span>Polygon Testnet</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {formatAmount(contract.totalRevenue)}
              </div>
              <div className="text-sm text-earth-600">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {contract.totalTransactions}
              </div>
              <div className="text-sm text-earth-600">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {contract.participants}
              </div>
              <div className="text-sm text-earth-600">Participants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600 mb-1">
                {contract.address.slice(0, 6)}...
              </div>
              <div className="text-sm text-earth-600">Contract Address</div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-earth-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-earth-700">Contract Address:</span>
              <div className="flex items-center gap-2">
                <code className="text-sm bg-white px-2 py-1 rounded">
                  {contract.address}
                </code>
                <button
                  onClick={() => copyToClipboard(contract.address)}
                  className="text-earth-500 hover:text-earth-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://mumbai.polygonscan.com/address/${contract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Split Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-earth-800 mb-6">Revenue Distribution</h3>
          
          <div className="space-y-4">
            {Object.entries(revenueSplit).map(([key, percentage]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    key === 'host' ? 'bg-green-500' :
                    key === 'guide' ? 'bg-blue-500' :
                    key === 'artisan' ? 'bg-purple-500' :
                    key === 'platform' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-earth-700 capitalize">{key}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-earth-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        key === 'host' ? 'bg-green-500' :
                        key === 'guide' ? 'bg-blue-500' :
                        key === 'artisan' ? 'bg-purple-500' :
                        key === 'platform' ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-earth-800 w-8">{percentage}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-green-700">
                All revenue distributions are automatically executed via smart contract
              </span>
            </div>
          </div>
        </div>

        {/* Live Transactions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-earth-800 mb-6">Live Transactions</h3>
          
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {transactions.map(transaction => (
              <div key={transaction.id} className="border border-earth-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(transaction.type)}
                    <span className="text-sm font-medium text-earth-800 capitalize">
                      {transaction.type.replace('_', ' ')}
                    </span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
                
                <div className="text-sm text-earth-600 mb-2">
                  Amount: <span className="font-medium">{formatAmount(transaction.amount)}</span>
                </div>
                
                <div className="text-xs text-earth-500 mb-2">
                  {new Date(transaction.timestamp).toLocaleString()}
                </div>
                
                {transaction.hash && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-earth-500">Hash:</span>
                    <code className="text-xs bg-earth-100 px-2 py-1 rounded">
                      {formatAddress(transaction.hash)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(transaction.hash || '')}
                      className="text-earth-500 hover:text-earth-700"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Blockchain Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start">
            <Shield className="w-6 h-6 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Transparency</h4>
              <p className="text-sm opacity-90">All transactions are publicly verifiable on the blockchain</p>
            </div>
          </div>
          <div className="flex items-start">
            <TrendingUp className="w-6 h-6 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Automation</h4>
              <p className="text-sm opacity-90">Revenue splits happen automatically without intermediaries</p>
            </div>
          </div>
          <div className="flex items-start">
            <Eye className="w-6 h-6 mr-3 mt-1" />
            <div>
              <h4 className="font-semibold mb-1">Traceability</h4>
              <p className="text-sm opacity-90">Every payment can be traced from source to destination</p>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Wallet Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Connect Wallet</h3>
            <p className="text-earth-600 mb-6">
              Connect your MetaMask wallet to view blockchain transactions and revenue distribution.
            </p>
            
            <div className="space-y-4">
              <div className="p-4 border border-earth-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Wallet className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium">MetaMask</p>
                      <p className="text-sm text-earth-600">Connect to MetaMask wallet</p>
                    </div>
                  </div>
                  <button
                    onClick={connectWallet}
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-1">Demo Mode</p>
                  <p>This is a demonstration. No real blockchain transactions will occur.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowConnectModal(false)}
              className="btn-secondary w-full mt-4"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlockchainDemo 