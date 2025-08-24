'use client'

import React, { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [resp, setResp] = useState('')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setResp('')
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const res = await fetch(`${baseUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to send')
      setStatus('success')
      setResp('Message sent successfully!')
      setName(''); setEmail(''); setSubject(''); setMessage('')
    } catch (err: any) {
      setStatus('error')
      setResp(err.message || 'Something went wrong')
    }
  }
  return (
    <div className="min-h-screen">
      <Header />
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h1 className="text-4xl font-display font-bold mb-6">Contact Us</h1>
          <p className="text-earth-700 mb-8">Have questions or feedback? We'd love to hear from you.</p>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input className="input" placeholder="Your Name" aria-label="Your Name" value={name} onChange={(e)=>setName(e.target.value)} required />
              <input className="input" placeholder="Email" type="email" aria-label="Email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <input className="input" placeholder="Subject" aria-label="Subject" value={subject} onChange={(e)=>setSubject(e.target.value)} required />
            <textarea className="input min-h-[140px]" placeholder="Message" aria-label="Message" value={message} onChange={(e)=>setMessage(e.target.value)} required />
            <div className="flex items-center gap-4">
              <button className="btn-primary w-fit" disabled={status==='loading'}>{status==='loading' ? 'Sending...' : 'Send Message'}</button>
              <a className="text-primary-700 hover:underline" href={`mailto:karandakhorecs@gmail.com?subject=${encodeURIComponent(subject || 'VillageVibe Contact')}&body=${encodeURIComponent(`From: ${name} <${email}>

${message}`)}`}>Or email us</a>
            </div>
            {resp && <div className={`${status==='success' ? 'text-green-700' : 'text-red-700'}`}>{resp}</div>}
          </form>
        </div>
      </section>
      <Footer />
    </div>
  )
}

