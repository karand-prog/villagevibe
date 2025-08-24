'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding">
        <div className="container-custom prose max-w-none">
          <h1 className="text-4xl font-display font-bold mb-6">Privacy Policy</h1>
          <p className="text-earth-700 mb-4">This is a placeholder Privacy Policy page. Add your actual policy content here.</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}

