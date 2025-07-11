'use client'

import React from 'react'
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-earth-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold">
                VillageVibe
              </span>
            </div>
            <p className="text-earth-300 mb-6 max-w-md">
              Connecting rural communities with travelers seeking authentic experiences. 
              Empowering local hosts and preserving cultural heritage across India.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-earth-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/explore" className="text-earth-300 hover:text-white transition-colors">
                  Explore Villages
                </Link>
              </li>
              <li>
                <Link href="/experiences" className="text-earth-300 hover:text-white transition-colors">
                  Cultural Experiences
                </Link>
              </li>
              <li>
                <Link href="/host" className="text-earth-300 hover:text-white transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-earth-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-earth-300 hover:text-white transition-colors">
                  Stories & Culture
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-earth-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-earth-300 hover:text-white transition-colors">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-earth-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-earth-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-earth-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-earth-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary-400" />
              <span className="text-earth-300">hello@villagevibe.in</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary-400" />
              <span className="text-earth-300">+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary-400" />
              <span className="text-earth-300">Mumbai, Maharashtra, India</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-earth-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-earth-400 text-sm">
            © 2024 VillageVibe. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/accessibility" className="text-earth-400 hover:text-white text-sm transition-colors">
              Accessibility
            </Link>
            <Link href="/sitemap" className="text-earth-400 hover:text-white text-sm transition-colors">
              Sitemap
            </Link>
            <Link href="/cookies" className="text-earth-400 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 