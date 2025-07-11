'use client'

import React from 'react'
import { Wifi, Mic, Shield, Heart, MapPin, Users, Award, Globe } from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Wifi,
      title: 'Offline-First Design',
      description: 'Works seamlessly even in areas with poor internet connectivity using PWA technology.',
      color: 'text-primary-600'
    },
    {
      icon: Mic,
      title: 'Voice-Based Uploads',
      description: 'Hosts can record stories and descriptions by speaking, making it accessible for everyone.',
      color: 'text-sunset-600'
    },
    {
      icon: Shield,
      title: 'Transparent Revenue',
      description: 'See exactly where your money goes - hosts, guides, artisans, and platform fees are clearly shown.',
      color: 'text-earth-600'
    },
    {
      icon: Heart,
      title: 'Cultural Preservation',
      description: 'Local legends, traditions, and voices get preserved and shared with the world.',
      color: 'text-primary-600'
    },
    {
      icon: Award,
      title: 'Impact Certificates',
      description: 'Get certificates showing your positive impact - CO₂ saved, locals benefited, artisans supported.',
      color: 'text-sunset-600'
    },
    {
      icon: Users,
      title: 'Skill Exchange',
      description: 'Share your skills (photography, teaching, tech) in return for discounts on your stay.',
      color: 'text-earth-600'
    },
    {
      icon: MapPin,
      title: 'Direct Booking',
      description: 'Book directly with villagers, no middlemen, ensuring maximum benefit to local communities.',
      color: 'text-primary-600'
    },
    {
      icon: Globe,
      title: 'Cultural Badges',
      description: 'Earn achievements and badges while exploring rural life and traditions.',
      color: 'text-sunset-600'
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            What Makes <span className="text-gradient">VillageVibe</span> Unique
          </h2>
          <p className="text-xl text-earth-600 max-w-3xl mx-auto">
            We're not just another booking site. We're a platform that respects and uplifts local culture and lives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="card p-6 text-center group hover:scale-105 transition-transform duration-300"
            >
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-earth-100 flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-earth-800">
                {feature.title}
              </h3>
              <p className="text-earth-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Impact Stats */}
        <div className="mt-20 bg-gradient-primary rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Our Impact in Numbers
            </h3>
            <p className="text-xl opacity-90">
              Real change, measurable impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">85%</div>
              <div className="text-lg opacity-90">Revenue goes to locals</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">2.5x</div>
              <div className="text-lg opacity-90">More income for hosts</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-lg opacity-90">Artisans supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold mb-2">15k</div>
              <div className="text-lg opacity-90">Stories preserved</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features 