'use client'

import React, { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  id: number
  name: string
  role: string
  content: string
  image: string
  rating: number
}

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Rahul Patel',
      role: 'Traveler',
      content: 'Amazing experience! The village stay was authentic and the hosts were incredibly welcoming. Highly recommend!',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      id: 2,
      name: 'Anjali Desai',
      role: 'Adventure Seeker',
      content: 'Perfect blend of comfort and authenticity. The cultural activities were enriching and the food was delicious.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      id: 3,
      name: 'Vikram Singh',
      role: 'Family Traveler',
      content: 'Great for families! Our kids loved the farm activities and we enjoyed the peaceful village atmosphere.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4
    },
    {
      id: 4,
      name: 'Meera Iyer',
      role: 'Solo Traveler',
      content: 'Safe and welcoming for solo travelers. The community was friendly and I felt completely at home.',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      rating: 5
    },
    {
      id: 5,
      name: 'Arjun Reddy',
      role: 'Photography Enthusiast',
      content: 'Incredible photo opportunities! The rural landscapes and traditional architecture are breathtaking.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      rating: 4
    }
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const currentTestimonial = testimonials[currentIndex]

  return (
    <section className="py-16 bg-earth-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-earth-800 mb-4">What Our Travelers Say</h2>
          <p className="text-lg text-earth-600 max-w-2xl mx-auto">
            Real experiences from travelers who discovered authentic village life through VillageVibe
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 relative">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-primary-200">
              <Quote className="w-8 h-8" />
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Testimonial Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < currentTestimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-earth-300'
                      }`}
                    />
                  ))}
                </div>
                
                <blockquote className="text-lg md:text-xl text-earth-700 mb-6 italic">
                  "{currentTestimonial.content}"
                </blockquote>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                  <img
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-earth-800">{currentTestimonial.name}</h4>
                    <p className="text-earth-600">{currentTestimonial.role}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  onClick={prevTestimonial}
                  className="p-3 rounded-full bg-earth-100 hover:bg-earth-200 transition-colors"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5 text-earth-600" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="p-3 rounded-full bg-earth-100 hover:bg-earth-200 transition-colors"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5 text-earth-600" />
                </button>
              </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-primary-600'
                      : 'bg-earth-300 hover:bg-earth-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-earth-600">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">4.8/5</div>
            <div className="text-earth-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-earth-600">Village Partners</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials