'use client'

import React, { useState } from 'react'
import { Menu, X, MapPin, Heart, User, Search } from 'lucide-react'
import Link from 'next/link'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold text-gradient">
              VillageVibe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/explore" className="text-earth-600 hover:text-primary-600 transition-colors">
              Explore Villages
            </Link>
            <Link href="/experiences" className="text-earth-600 hover:text-primary-600 transition-colors">
              Cultural Experiences
            </Link>
            <Link href="/host" className="text-earth-600 hover:text-primary-600 transition-colors">
              Become a Host
            </Link>
            <Link href="/about" className="text-earth-600 hover:text-primary-600 transition-colors">
              About
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="p-2 text-earth-600 hover:text-primary-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-earth-600 hover:text-primary-600 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button className="btn-primary">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-earth-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-earth-100">
            <nav className="py-4 space-y-4">
              <Link 
                href="/explore" 
                className="block px-4 py-2 text-earth-600 hover:text-primary-600 hover:bg-earth-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore Villages
              </Link>
              <Link 
                href="/experiences" 
                className="block px-4 py-2 text-earth-600 hover:text-primary-600 hover:bg-earth-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cultural Experiences
              </Link>
              <Link 
                href="/host" 
                className="block px-4 py-2 text-earth-600 hover:text-primary-600 hover:bg-earth-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Host
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-2 text-earth-600 hover:text-primary-600 hover:bg-earth-50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="px-4 pt-4 border-t border-earth-100">
                <button className="btn-primary w-full">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 