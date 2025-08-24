"use client"

import Link from 'next/link'

const regions = [
  { name: 'Rajasthan', query: 'Rajasthan', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
  { name: 'Kerala', query: 'Kerala', img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600' },
  { name: 'Himachal', query: 'Himachal Pradesh', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600' },
]

export default function TopRegions() {
  return (
    <section className="section-padding bg-earth-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Top regions</h2>
          <p className="text-earth-600">Jump straight into popular destinations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((r) => (
            <Link key={r.name} href={`/explore?state=${encodeURIComponent(r.query)}`} className="relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
              <img src={r.img} alt={r.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute bottom-3 left-3 text-white font-semibold text-lg">{r.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


