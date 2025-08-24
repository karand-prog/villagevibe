'use client'

import React, { useState } from 'react'
import { CreditCard, Smartphone, Building, Wallet, Lock, Shield, CheckCircle } from 'lucide-react'

interface PaymentOptionsProps {
  amount: number
  onPaymentMethodSelect: (method: string) => void
  selectedMethod?: string
}

const PaymentOptions = ({ amount, onPaymentMethodSelect, selectedMethod }: PaymentOptionsProps) => {
  const [showMore, setShowMore] = useState(false)

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, RuPay',
      popular: true
    },
    {
      id: 'upi',
      name: 'UPI',
      icon: Smartphone,
      description: 'Google Pay, PhonePe, Paytm',
      popular: true
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      icon: Building,
      description: 'All major banks',
      popular: false
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'Amazon Pay, Mobikwik',
      popular: false
    }
  ]

  return (
    <div className="space-y-6">
      {/* Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold text-earth-800 mb-4">Choose Payment Method</h3>
        <div className="grid gap-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            const isSelected = selectedMethod === method.id
            
            return (
              <div
                key={method.id}
                onClick={() => onPaymentMethodSelect(method.id)}
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

      {/* Security Features */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
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

      {/* Payment Summary */}
      <div className="bg-earth-50 rounded-xl p-4">
        <h4 className="font-medium text-earth-800 mb-3">Payment Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-earth-600">Amount:</span>
            <span className="text-earth-800">₹{amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-earth-600">Processing Fee:</span>
            <span className="text-earth-800">₹0</span>
          </div>
          <div className="border-t border-earth-200 pt-2">
            <div className="flex justify-between font-medium">
              <span className="text-earth-800">Total:</span>
              <span className="text-primary-600 text-lg">₹{amount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentOptions

