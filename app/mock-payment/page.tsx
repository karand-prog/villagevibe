'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, CreditCard, Lock, Shield } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MockPaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details')
  
  const sessionId = searchParams.get('session_id')
  const amount = searchParams.get('amount')
  const metadata = searchParams.get('metadata')
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  })

  useEffect(() => {
    if (!sessionId || !amount) {
      router.push('/bookings?status=error')
    }
  }, [sessionId, amount, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStep('processing')
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success')
      setTimeout(() => {
        router.push('/bookings?status=success')
      }, 2000)
    }, 3000)
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-earth-800 mb-2">Processing Payment</h2>
            <p className="text-earth-600">Please wait while we process your payment...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-earth-800 mb-2">Payment Successful!</h2>
            <p className="text-earth-600">Redirecting to your bookings...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-modern">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-5xl font-display font-bold mb-6">Complete Your Payment</h1>
            <p className="text-xl text-earth-600 mb-8 max-w-3xl mx-auto">
              Secure payment for your VillageVibe booking
            </p>
          </div>
        </div>
      </section>

      {/* Payment Form */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-2xl">
          <div className="bg-earth-50 rounded-2xl p-8">
            {/* Payment Summary */}
            <div className="mb-8 p-6 bg-white rounded-xl border border-earth-200">
              <h3 className="text-lg font-semibold text-earth-800 mb-4">Payment Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-earth-600">Total Amount:</span>
                <span className="text-2xl font-bold text-primary-600">₹{Number(amount).toLocaleString()}</span>
              </div>
              <div className="text-sm text-earth-500 mt-2">Session ID: {sessionId}</div>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 text-blue-700">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Demo Payment System</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                This is a mock payment system for demonstration purposes. No real charges will be made.
              </p>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="cardholderName"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Security Features */}
              <div className="flex items-center gap-4 text-sm text-earth-600">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? 'Processing...' : `Pay ₹${Number(amount).toLocaleString()}`}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
