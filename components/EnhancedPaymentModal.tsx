"use client"

import React, { useState } from 'react'
import { X, CreditCard, Smartphone, Building, Wallet, Lock, Shield, CheckCircle, AlertCircle, Banknote, QrCode } from 'lucide-react'
import { useAuth } from './AuthContext'
import Toast from './Toast'

interface EnhancedPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  bookingDetails: {
    villageName: string
    checkIn: string
    checkOut: string
    guests: number
    totalAmount: number
  }
  onPaymentSuccess: (paymentId: string, method: string) => void
}

export default function EnhancedPaymentModal({
  isOpen,
  onClose,
  amount,
  bookingDetails,
  onPaymentSuccess
}: EnhancedPaymentModalProps) {
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState('card')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ message: string; type?: 'success'|'error'|'info' } | null>(null)
  
  // Form states for different payment methods
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  
  const [upiDetails, setUpiDetails] = useState({
    upiId: '',
    otp: ''
  })
  
  const [netBankingDetails, setNetBankingDetails] = useState({
    bank: '',
    username: '',
    password: ''
  })

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay, American Express',
      popular: true,
      fields: ['cardNumber', 'expiry', 'cvv', 'cardholderName']
    },
    {
      id: 'upi',
      name: 'UPI Payment',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm, BHIM',
      popular: true,
      fields: ['upiId', 'otp']
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks - SBI, HDFC, ICICI, Axis',
      popular: false,
      fields: ['bank', 'username', 'password']
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Amazon Pay, Mobikwik, Freecharge',
      popular: false,
      fields: []
    },
    {
      id: 'cod',
      name: 'Cash on Arrival',
      icon: Banknote,
      description: 'Pay when you reach the village',
      popular: false,
      fields: []
    }
  ]

  const handlePayment = async () => {
    if (!user) {
      setToast({ message: 'Please sign in to make payment', type: 'error' })
      return
    }

    setLoading(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      setToast({ 
        message: `Payment successful via ${paymentMethods.find(m => m.id === selectedMethod)?.name}!`, 
        type: 'success' 
      })
      
      setTimeout(() => {
        onPaymentSuccess(paymentId, selectedMethod)
        onClose()
      }, 1500)
      
    } catch (error) {
      setToast({ message: 'Payment failed. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      
      case 'upi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="username@upi"
                value={upiDetails.upiId}
                onChange={(e) => setUpiDetails(prev => ({ ...prev, upiId: e.target.value }))}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">Scan QR Code</span>
              </div>
              <p className="text-xs text-blue-700">Use any UPI app to scan and pay ₹{amount}</p>
            </div>
          </div>
        )
      
      case 'netbanking':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Select Bank</label>
              <select
                value={netBankingDetails.bank}
                onChange={(e) => setNetBankingDetails(prev => ({ ...prev, bank: e.target.value }))}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
                <option value="bob">Bank of Baroda</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                value={netBankingDetails.username}
                onChange={(e) => setNetBankingDetails(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={netBankingDetails.password}
                onChange={(e) => setNetBankingDetails(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )
      
      case 'cod':
        return (
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Cash on Arrival</span>
            </div>
            <p className="text-sm text-green-700">Pay ₹{amount} when you reach the village. No advance payment required.</p>
          </div>
        )
      
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-earth-200">
          <h2 className="text-2xl font-bold text-earth-800">Complete Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-earth-100 rounded-full">
            <X className="w-6 h-6 text-earth-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Booking Summary */}
          <div className="bg-earth-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-earth-800 mb-3">Booking Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-earth-600">Village:</span>
                <span className="text-earth-800">{bookingDetails.villageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Check-in:</span>
                <span className="text-earth-800">{bookingDetails.checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Check-out:</span>
                <span className="text-earth-800">{bookingDetails.checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-earth-600">Guests:</span>
                <span className="text-earth-800">{bookingDetails.guests}</span>
              </div>
              <div className="border-t border-earth-200 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-earth-800">Total Amount:</span>
                  <span className="text-primary-600 text-lg">₹{amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-earth-800 mb-4">Choose Payment Method</h3>
            <div className="grid gap-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon
                const isSelected = selectedMethod === method.id
                
                return (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-earth-200 hover:border-primary-300 hover:bg-earth-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary-100' : 'bg-earth-100'
                      }`}>
                        <Icon className={`w-6 h-6 ${
                          isSelected ? 'text-primary-600' : 'text-earth-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-earth-800">{method.name}</h4>
                          {method.popular && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-earth-600">{method.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Payment Form */}
          {selectedMethod !== 'cod' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-earth-800 mb-4">Payment Details</h3>
              {renderPaymentForm()}
            </div>
          )}

          {/* Security Features */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 mb-1">Secure Payment</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    <span>256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Fraud protection</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ₹${amount.toLocaleString()}`
            )}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
