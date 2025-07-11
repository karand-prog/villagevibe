'use client'

import React from 'react'
import { Search, Calendar, Star, MapPin, Mic, Shield, Users } from 'lucide-react'

const HowItWorks = () => {
  const travelerSteps = [
    {
      icon: Search,
      title: 'Discover Villages',
      description: 'Browse authentic village homestays and cultural experiences across India.',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: Calendar,
      title: 'Book Directly',
      description: 'Reserve your stay directly with local hosts, no middlemen involved.',
      color: 'bg-sunset-100 text-sunset-600'
    },
    {
      icon: Star,
      title: 'Experience Culture',
      description: 'Immerse yourself in local traditions, food, and community life.',
      color: 'bg-earth-100 text-earth-600'
    }
  ]

  const hostSteps = [
    {
      icon: MapPin,
      title: 'List Your Village',
      description: 'Add your village, homestay, or cultural experience to our platform.',
      color: 'bg-primary-100 text-primary-600'
    },
    {
      icon: Mic,
      title: 'Share Stories',
      description: 'Record local legends, traditions, and personal stories using voice.',
      color: 'bg-sunset-100 text-sunset-600'
    },
    {
      icon: Shield,
      title: 'Earn Fairly',
      description: 'Receive 85% of booking revenue directly to your account.',
      color: 'bg-earth-100 text-earth-600'
    }
  ]

  return (
    <section className="section-padding bg-earth-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            How <span className="text-gradient">VillageVibe</span> Works
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Simple, transparent, and beneficial for everyone involved
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* For Travelers */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-earth-800 mb-2">
                For Travelers
              </h3>
              <p className="text-earth-600">
                Experience authentic rural India in just three simple steps
              </p>
            </div>

            <div className="space-y-8">
              {travelerSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${step.color}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-earth-800 mb-2">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-earth-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="btn-primary">
                Start Exploring
              </button>
            </div>
          </div>

          {/* For Hosts */}
          <div className="card p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-sunset-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-sunset-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-earth-800 mb-2">
                For Hosts
              </h3>
              <p className="text-earth-600">
                Share your culture and earn a sustainable income
              </p>
            </div>

            <div className="space-y-8">
              {hostSteps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${step.color}`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-earth-800 mb-2">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-earth-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button className="btn-secondary">
                Become a Host
              </button>
            </div>
          </div>
        </div>

        {/* Revenue Distribution */}
        <div className="mt-20 card p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-display font-bold text-earth-800 mb-4">
              Transparent Revenue Distribution
            </h3>
            <p className="text-xl text-earth-600">
              See exactly where your money goes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">85%</span>
              </div>
              <h4 className="text-lg font-semibold text-earth-800 mb-2">Local Host</h4>
              <p className="text-earth-600">Direct payment to village hosts</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-sunset-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-sunset-600">10%</span>
              </div>
              <h4 className="text-lg font-semibold text-earth-800 mb-2">Local Guide</h4>
              <p className="text-earth-600">Community guides and artisans</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-earth-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-earth-600">3%</span>
              </div>
              <h4 className="text-lg font-semibold text-earth-800 mb-2">Platform</h4>
              <p className="text-earth-600">Technology and support costs</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">2%</span>
              </div>
              <h4 className="text-lg font-semibold text-earth-800 mb-2">Impact Fund</h4>
              <p className="text-earth-600">Community development projects</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks 