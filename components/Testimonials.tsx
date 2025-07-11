'use client'

import React from 'react'
import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Traveler from Mumbai',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'Staying in a village in Rajasthan was the highlight of my year. The family treated me like their own, and I learned so much about their traditions. VillageVibe made it so easy to connect directly with them.',
      location: 'Rajasthan Village'
    },
    {
      name: 'Rajesh Patel',
      role: 'Village Host',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'Since listing our homestay on VillageVibe, our income has increased by 3x. The platform is so simple to use, even with our limited internet. We love sharing our culture with travelers.',
      location: 'Gujarat Village'
    },
    {
      name: 'Sarah Johnson',
      role: 'International Traveler',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'I was worried about finding authentic experiences in India, but VillageVibe connected me with real village life. The offline functionality was a lifesaver in remote areas.',
      location: 'Kerala Village'
    },
    {
      name: 'Lakshmi Devi',
      role: 'Artisan & Host',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'I can now sell my handmade crafts directly to travelers and earn a fair price. The voice recording feature helps me share our village stories easily.',
      location: 'Tamil Nadu Village'
    },
    {
      name: 'Arun Kumar',
      role: 'Traveler from Delhi',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'The transparent pricing and impact certificates made me feel good about my travel choices. I could see exactly how my money was helping the local community.',
      location: 'Himachal Village'
    },
    {
      name: 'Meera Singh',
      role: 'Village Guide',
      image: '/api/placeholder/60/60',
      rating: 5,
      text: 'As a local guide, I earn more through VillageVibe than through traditional tour operators. The platform respects our knowledge and compensates us fairly.',
      location: 'Uttarakhand Village'
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            What People Say About <span className="text-gradient">VillageVibe</span>
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            Real stories from real people - travelers and hosts sharing their experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card p-6 relative">
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-primary-200">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-earth-700 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-semibold text-earth-800">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-earth-600">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-primary-600 font-medium">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-display font-bold text-earth-800 mb-8">
            Trusted by Communities Across India
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9/5</div>
              <div className="text-earth-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-earth-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-earth-600">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-earth-600">Secure Payments</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials 