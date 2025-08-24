"use client"

import Link from 'next/link'

const tags = ['Homestay', 'Cultural', 'Nature', 'Food', 'Crafts', 'Festivals']

export default function TrendingTags() {
  return (
    <section className="py-6 bg-white border-b border-earth-200">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-earth-700">Trending</h3>
          <Link href="/explore" className="btn-link text-sm">View all</Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/explore?experienceType=${encodeURIComponent(tag)}`}
              className="badge hover:bg-primary-50 hover:text-primary-700"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}


