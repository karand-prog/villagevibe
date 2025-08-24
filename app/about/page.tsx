'use client'

import React from 'react'
import Image from 'next/image'
import { Heart, Users, Globe, Award, Star, MapPin } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslation } from '@/components/LanguageDetector'
import { trackClick, trackSubmit } from '@/utils/analytics'

function SubscribeForm() {
  const [email, setEmail] = React.useState('')
  const [name, setName] = React.useState('')
  const [status, setStatus] = React.useState<'idle'|'loading'|'success'|'error'>('idle')
  const [message, setMessage] = React.useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed')
      setStatus('success')
      setMessage('Thanks! We\'ll keep you posted.')
      setEmail('')
      setName('')
      trackSubmit('waitlist_subscribe', { email })
    } catch (err: any) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={submit} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="input flex-1" aria-label="Name" />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" className="input flex-1" aria-label="Email" required />
      <button className="btn-primary" disabled={status==='loading'} onClick={() => trackClick('waitlist_click')}>{status==='loading' ? 'Submitting...' : 'Notify me'}</button>
      {message && (
        <div className={`text-sm ${status==='success' ? 'text-green-700' : 'text-red-700'} sm:ml-3`}>{message}</div>
      )}
    </form>
  )
}

export default function AboutPage() {
  const { t } = useTranslation()

  const stats = [
    { icon: Heart, number: '500+', label: 'Villages Connected' },
    { icon: Users, number: '10,000+', label: 'Happy Travelers' },
    { icon: Globe, number: '25+', label: 'States Covered' },
    { icon: Award, number: '4.8', label: 'Average Rating' }
  ]

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
      bio: 'Former rural development officer with 15+ years experience in community building.'
    },
    {
      name: 'Rajesh Kumar',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      bio: 'Tech enthusiast passionate about bridging the digital divide in rural India.'
    },
    {
      name: 'Meera Patel',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
      bio: 'Former NGO worker dedicated to sustainable tourism and community development.'
    }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Community First',
      description: 'We prioritize the well-being and growth of local communities above all else.'
    },
    {
      icon: Globe,
      title: 'Authentic Experiences',
      description: 'We believe in preserving and sharing the real culture and traditions of rural India.'
    },
    {
      icon: Users,
      title: 'Sustainable Tourism',
      description: 'We promote responsible travel that benefits both travelers and local communities.'
    },
    {
      icon: Award,
      title: 'Quality Assurance',
      description: 'We maintain high standards for all our village partners and experiences.'
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-modern">
        <div className="container-custom">
          <div className="text-center">
            <div className="kicker mb-2">Upcoming Project</div>
            <h1 className="text-5xl font-display font-bold mb-6">Something exciting is on the way</h1>
            <p className="text-xl text-earth-600 mb-8 max-w-3xl mx-auto">
              We are reimagining VillageVibe to make rural travel more immersive, inclusive, and impactful.
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Highlights */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-earth-800 mb-6">What we're building next</h2>
              <ul className="space-y-4 text-earth-700">
                <li className="flex items-start gap-3"><span className="badge">1</span><span>Interactive village maps with cultural hotspots and artisan stories</span></li>
                <li className="flex items-start gap-3"><span className="badge">2</span><span>AI trip planning tuned for rural travel and local seasons</span></li>
                <li className="flex items-start gap-3"><span className="badge">3</span><span>Transparent impact tracker and community-led experiences</span></li>
              </ul>
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop"
                alt="Village community"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="card p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-3">Get notified when we launch</h3>
            <p className="text-earth-600 mb-6">Join the waitlist for early access and pilot invites.</p>
            <SubscribeForm />
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-earth-800 mb-4">Our Values</h2>
            <p className="text-lg text-earth-600 max-w-2xl mx-auto">
              These core values guide everything we do at VillageVibe
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-earth-50 rounded-xl">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-earth-800 mb-3">{value.title}</h3>
                <p className="text-earth-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-earth-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-earth-800 mb-4">Launch timeline</h2>
            <p className="text-lg text-earth-600 max-w-2xl mx-auto">Follow our milestones as we roll out the new VillageVibe</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{ m: 'Design', d: 'New brand and UI system' }, { m: 'Beta', d: 'Closed pilot with hosts' }, { m: 'Public', d: 'Open sign-ups and listings' }].map((s, i) => (
              <div key={i} className="card p-6 text-center">
                <div className="badge mb-2">Phase {i + 1}</div>
                <div className="font-semibold text-earth-800">{s.m}</div>
                <div className="text-sm text-earth-600">{s.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
                alt="Village development"
                width={600}
                height={400}
                className="rounded-2xl shadow-lg"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-earth-800 mb-6">Our Impact</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Star className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-earth-800 mb-2">Economic Empowerment</h3>
                    <p className="text-earth-600">Generated over ₹50 lakhs in additional income for rural communities through tourism.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Users className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-earth-800 mb-2">Community Development</h3>
                    <p className="text-earth-600">Supported 500+ families across 25+ states with sustainable livelihood opportunities.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <Globe className="w-4 h-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-earth-800 mb-2">Cultural Preservation</h3>
                    <p className="text-earth-600">Helped preserve traditional crafts, cuisines, and cultural practices in rural communities.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Signup */}
      <section className="section-padding bg-gradient-primary">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Be First to Experience New Features
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join our waitlist to get early access to AI planning, voice commands, and more innovative features.
            </p>
            
            <SubscribeForm />
            
            <p className="text-sm opacity-75 mt-4">
              We'll notify you when new features launch. No spam, ever.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}