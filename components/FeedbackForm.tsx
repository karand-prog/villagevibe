"use client"

import React, { useState } from 'react'

export default function FeedbackForm({ onDone }: { onDone?: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [type, setType] = useState<'general'|'bug'|'idea'|'support'|'other'>('general')
  const [rating, setRating] = useState<number | undefined>(undefined)
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')
  const [resp, setResp] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setResp('')
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      const res = await fetch(`${baseUrl}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, type, rating, message })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to submit')
      setStatus('success')
      setResp('Thanks for your feedback!')
      setName(''); setEmail(''); setMessage(''); setRating(undefined); setType('general')
      onDone?.()
    } catch (err: any) {
      setStatus('error')
      setResp(err.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <input className="input" placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} />
        <input className="input" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <select className="input" value={type} onChange={(e)=>setType(e.target.value as any)}>
          <option value="general">General</option>
          <option value="bug">Bug</option>
          <option value="idea">Idea</option>
          <option value="support">Support</option>
          <option value="other">Other</option>
        </select>
        <input className="input" placeholder="Rating (1-5)" type="number" min={1} max={5} value={rating ?? ''} onChange={(e)=>setRating(e.target.value ? Number(e.target.value) : undefined)} />
      </div>
      <textarea className="input min-h-[120px]" placeholder="Your feedback" value={message} onChange={(e)=>setMessage(e.target.value)} required />
      <div className="flex items-center justify-between gap-3">
        <a className="text-primary-700 hover:underline" href={`mailto:karandakhorecs@gmail.com?subject=${encodeURIComponent('VillageVibe Feedback: ' + type)}&body=${encodeURIComponent(`From: ${name} <${email}>

${message}`)}`}>Email instead</a>
        <div className="flex gap-2">
          <button type="button" className="btn-secondary" onClick={onDone}>Cancel</button>
          <button className="btn-primary" disabled={status==='loading'}>{status==='loading' ? 'Submitting...' : 'Submit'}</button>
        </div>
      </div>
      {resp && <div className={`${status==='success' ? 'text-green-700' : 'text-red-700'}`}>{resp}</div>}
    </form>
  )
} 