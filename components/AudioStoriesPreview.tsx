"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Story = {
  id: string
  title: string
  description: string
  createdAt: string
}

export default function AudioStoriesPreview() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Use a default village id for preview
        const res = await fetch('/api/audio-stories?villageId=homepage')
        const data = await res.json()
        setStories(Array.isArray(data) ? data.slice(0, 3) : [])
      } catch (e) {
        setStories([])
      } finally {
        setLoading(false)
      }
    }
    fetchStories()
  }, [])

  if (loading || stories.length === 0) return null

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold">Audio Stories from Villages</h2>
          <Link href="/explore" className="btn-link">Explore Villages</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((s) => (
            <div key={s.id} className="card p-5 hover-card">
              <div className="text-sm text-earth-500 mb-2">{new Date(s.createdAt).toLocaleDateString()}</div>
              <h3 className="text-lg font-semibold text-earth-800 mb-2 line-clamp-2">{s.title}</h3>
              <p className="text-sm text-earth-600 line-clamp-3">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


