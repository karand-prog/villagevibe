"use client"

import Link from 'next/link'
import { Home, Compass, Bot, User } from 'lucide-react'

export default function MobileStickyNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85 md:hidden">
      <div className="container-custom">
        <div className="grid grid-cols-4 text-center py-2">
          <Link href="/" className="flex flex-col items-center gap-1 text-earth-700">
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center gap-1 text-earth-700">
            <Compass className="w-5 h-5" />
            <span className="text-xs">Explore</span>
          </Link>
          <Link href="/ai-planner" className="flex flex-col items-center gap-1 text-primary-700">
            <Bot className="w-5 h-5" />
            <span className="text-xs">Plan</span>
          </Link>
          <Link href="/dashboard" className="flex flex-col items-center gap-1 text-earth-700">
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}


