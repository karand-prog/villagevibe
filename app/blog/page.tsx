'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding">
        <div className="container-custom">
          <h1 className="text-4xl font-display font-bold mb-6">Blog & Stories</h1>
          <p className="text-earth-700">Our blog is coming soon.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}

