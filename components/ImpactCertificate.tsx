'use client'

import React, { useState, useEffect } from 'react'
import { Download, Leaf, DollarSign, Users, Award, Heart, Calendar, MapPin, Droplets, Recycle } from 'lucide-react'
import { useTranslation } from './LanguageDetector'

interface ImpactCertificateProps {
  booking: {
    _id: string
    listing: {
      title: string
      location: { village: string; state: string }
      price: number
    }
    checkIn: string
    checkOut: string
    guestsCount: number
    totalPrice: number
    totalAmount?: number // Added for new calculations
    duration?: number // Added for new calculations
  }
  onClose?: () => void
}

const ImpactCertificate = ({ booking, onClose }: ImpactCertificateProps) => {
  const { t } = useTranslation()
  const [isGenerating, setIsGenerating] = useState(false)
  const [impact, setImpact] = useState<any>(null)
  const [impactError, setImpactError] = useState<string | null>(null)

  useEffect(() => {
    const fetchImpact = async () => {
      try {
        const res = await fetch(`/api/impact?bookingId=${booking._id}`)
        if (!res.ok) throw new Error('Failed to fetch impact data')
        const data = await res.json()
        setImpact(data)
      } catch (err) {
        setImpactError('Failed to load impact data.')
      }
    }
    fetchImpact()
  }, [booking._id])

  if (impactError) {
    return <div className="p-8 text-red-600">{impactError}</div>
  }
  if (!impact) {
    return <div className="p-8 text-earth-600">Loading impact data...</div>
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    
    try {
      // Dynamic import for jsPDF
      const { jsPDF } = await import('jspdf')
      
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      
      // Add background color
      doc.setFillColor(34, 197, 94) // Green background
      doc.rect(0, 0, pageWidth, pageHeight, 'F')
      
      // Add white content area
      doc.setFillColor(255, 255, 255)
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'F')
      
      // Title
      doc.setFontSize(24)
      doc.setTextColor(34, 197, 94)
      doc.text('Impact Certificate', pageWidth / 2, 40, { align: 'center' })
      
      // Subtitle
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text('VillageVibe - Authentic Rural Tourism', pageWidth / 2, 55, { align: 'center' })
      
      // Booking details
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text(`Experience: ${booking.listing.title}`, 20, 80)
      doc.text(`Location: ${booking.listing.location.village}, ${booking.listing.location.state}`, 20, 95)
      doc.text(`Dates: ${new Date(booking.checkIn).toLocaleDateString()} - ${new Date(booking.checkOut).toLocaleDateString()}`, 20, 110)
      doc.text(`Guests: ${booking.guestsCount}`, 20, 125)
      
      // Impact metrics
      doc.setFontSize(16)
      doc.setTextColor(34, 197, 94)
      doc.text('Your Positive Impact:', 20, 150)
      
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`💰 Local Income Generated: ₹${impact.localIncome.toLocaleString()}`, 20, 170)
      doc.text(`🌱 CO₂ Saved: ${impact.co2Saved} kg`, 20, 185)
      doc.text(`🎨 Artisan Work Supported: ₹${impact.artisanWork.toLocaleString()}`, 20, 200)
      doc.text(`👨‍👩‍👧‍👦 Local Families Supported: ${impact.familiesSupported}`, 20, 215)
      
      // Certificate number
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Certificate #: ${booking._id.slice(-8).toUpperCase()}`, 20, 250)
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 260)
      
      // Save PDF
      doc.save(`villagevibe-impact-${booking._id.slice(-8)}.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Impact Certificate</h2>
            <p className="text-gray-600">Your village stay made a difference!</p>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">{booking.listing.title}</p>
                  <p className="text-sm text-gray-600">{booking.listing.location.village}, {booking.listing.location.state}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">{booking.duration || 3} days</p>
                  <p className="text-sm text-gray-600">{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          {/* Impact Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700">₹{impact.localIncome}</div>
              <div className="text-sm text-green-600">Local Income Generated</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Leaf className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{impact.co2Saved}kg</div>
              <div className="text-sm text-blue-600">CO₂ Emissions Saved</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">₹{impact.artisanWork}</div>
              <div className="text-sm text-purple-600">Artisan Work Supported</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700">{impact.familiesSupported}</div>
              <div className="text-sm text-orange-600">Families Supported</div>
            </div>
            
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <Droplets className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-700">{impact.waterSaved}L</div>
              <div className="text-sm text-teal-600">Water Saved</div>
            </div>
            
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <Recycle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-700">{impact.plasticReduced}kg</div>
              <div className="text-sm text-red-600">Plastic Reduced</div>
            </div>
          </div>

          {/* Additional Impact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                Cultural Impact
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-indigo-600">Cultural Preservation:</span>
                  <span className="font-medium">₹{impact.culturalPreservation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-600">Community Development:</span>
                  <span className="font-medium">₹{impact.communityDevelopment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-600">Local Employment:</span>
                  <span className="font-medium">{impact.localEmployment} jobs</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                <Leaf className="w-4 h-4 mr-2" />
                Environmental Impact
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-600">Sustainable Practices:</span>
                  <span className="font-medium">{impact.sustainablePractices} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Carbon Footprint:</span>
                  <span className="font-medium">-{impact.co2Saved}kg CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Waste Reduction:</span>
                  <span className="font-medium">{impact.plasticReduced}kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Number */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500">Certificate #: {booking._id.slice(-8).toUpperCase()}</p>
            <p className="text-sm text-gray-500">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={generatePDF}
              disabled={isGenerating}
              className="btn-primary flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Download Certificate'}
            </button>
            {onClose && (
              <button onClick={onClose} className="btn-secondary">
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpactCertificate 