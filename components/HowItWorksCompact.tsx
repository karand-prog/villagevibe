"use client"

import Link from 'next/link'
import { Search, Calendar, Star } from 'lucide-react'

export default function HowItWorksCompact() {
  const steps = [
    { icon: Search, title: 'Discover', desc: 'Find authentic village stays', color: 'bg-primary-100 text-primary-600' },
    { icon: Calendar, title: 'Book', desc: 'Reserve directly with hosts', color: 'bg-sunset-100 text-sunset-600' },
    { icon: Star, title: 'Experience', desc: 'Immerse in local culture', color: 'bg-earth-100 text-earth-600' },
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold">How it works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="card p-5 flex items-center gap-4 animate-fade-in">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-semibold text-earth-800">{s.title}</div>
                <div className="text-sm text-earth-600">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/explore" className="btn-primary">Start Exploring</Link>
        </div>
      </div>
    </section>
  )
}


