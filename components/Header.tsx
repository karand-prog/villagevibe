import React, { useState, useContext, useEffect, useRef } from 'react'
import { Menu, X, User, LogOut, Settings, Home, Calendar, Award, Bookmark, Search, Bell, Globe, ChevronDown, UserCheck, MapPin, Star, Heart, TrendingUp, CheckCircle, AlertCircle, Info } from 'lucide-react'
import LanguageDetector, { LanguageContext, useTranslation } from './LanguageDetector'
import { useAuth } from './AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSaved } from './SavedContext'
import { useDataBus } from './DataBus'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { language, setLanguage, availableLanguages } = useContext(LanguageContext)
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { totalSaved } = useSaved()
  const { counters, notifications, removeNotification, clearNotifications } = useDataBus()
  const [showNotifications, setShowNotifications] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const closeMenus = () => {
    setIsMenuOpen(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-earth-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                VillageVibe
              </span>
              <div className="text-xs text-earth-500 -mt-1">Authentic Rural Experiences</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {[
              { href: '/explore', label: 'Explore', icon: Search },
              { href: '/experiences', label: 'Experiences', icon: Award },
              { href: '/volunteer', label: 'Volunteer', icon: UserCheck },
              { href: '/host', label: 'Host', icon: Settings },
            ].map((item) => {
              const isActive = pathname?.startsWith(item.href)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary-700 bg-primary-50 shadow-sm border border-primary-100'
                      : 'text-earth-700 hover:text-primary-700 hover:bg-earth-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
            <Link 
              href="/ai-planner" 
              className="ml-2 bg-gradient-to-r from-primary-600 to-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <Globe className="w-4 h-4" />
              <span>AI Planner</span>
            </Link>
          </nav>

          {/* Right side - Language, User Menu */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="hidden md:block">
                              <LanguageDetector />
            </div>

            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl hover:bg-earth-50 transition-colors relative"
                >
                  <Bell className="w-5 h-5 text-earth-600" />
                  {counters.notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                      {counters.notifications > 9 ? '9+' : counters.notifications}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-earth-200 py-3 z-50">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-earth-100 flex items-center justify-between">
                      <h3 className="font-semibold text-earth-800">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Clear all
                        </button>
                      )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-earth-400" />
                          <p className="text-earth-600 text-sm">No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div key={notification.id} className="px-4 py-3 hover:bg-earth-50 border-b border-earth-100 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              <div className={`p-1 rounded-full ${
                                notification.type === 'success' ? 'bg-green-100' :
                                notification.type === 'error' ? 'bg-red-100' :
                                notification.type === 'warning' ? 'bg-yellow-100' :
                                'bg-blue-100'
                              }`}>
                                {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
                                {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
                                {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-600" />}
                                {notification.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-earth-800 font-medium">{notification.message}</p>
                                <p className="text-xs text-earth-500 mt-1">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() => removeNotification(notification.id)}
                                className="text-earth-400 hover:text-earth-600 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="px-4 py-3 border-t border-earth-100">
                        <Link
                          href="/notifications"
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium block text-center"
                        >
                          View all notifications
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-earth-50 transition-all duration-200"
                  aria-label="Open user menu"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-earth-800">{user?.name || 'User'}</div>
                    <div className="text-xs text-earth-500">View Profile</div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-earth-500 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-earth-200 py-3 z-50">
                    {/* User Profile Section */}
                    <div className="px-4 py-4 border-b border-earth-100">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-earth-800">{user?.name || 'User'}</div>
                          <div className="text-sm text-earth-600">{user?.email || 'user@example.com'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="px-4 py-3 border-b border-earth-100">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-primary-600">{totalSaved}</div>
                          <div className="text-xs text-earth-600">Saved</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">3</div>
                          <div className="text-xs text-earth-600">Bookings</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-yellow-600">4.8</div>
                          <div className="text-xs text-earth-600">Rating</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
                        onClick={closeMenus}
                      >
                        <Home className="w-4 h-4 mr-3 text-primary-600" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      
                      <Link
                        href="/favorites"
                        className="flex items-center justify-between px-4 py-3 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
                        onClick={closeMenus}
                      >
                        <span className="flex items-center font-medium">
                          <Heart className="w-4 h-4 mr-3 text-primary-600" />
                          Saved Items
                        </span>
                        {totalSaved > 0 && (
                          <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-1 font-medium">{totalSaved}</span>
                        )}
                      </Link>
                      
                      <Link
                        href="/bookings"
                        className="flex items-center px-4 py-3 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
                        onClick={closeMenus}
                      >
                        <Calendar className="w-4 h-4 mr-3 text-primary-600" />
                        <span className="font-medium">My Bookings</span>
                      </Link>
                      
                      <Link
                        href="/host/dashboard"
                        className="flex items-center px-4 py-3 text-sm text-earth-700 hover:bg-earth-50 transition-colors"
                        onClick={closeMenus}
                      >
                        <Settings className="w-4 h-4 mr-3 text-primary-600" />
                        <span className="font-medium">Host Dashboard</span>
                      </Link>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-earth-100 my-2"></div>

                    {/* Logout */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout()
                          try { localStorage.removeItem('token'); localStorage.removeItem('user') } catch {}
                          closeMenus()
                        }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/signin" className="text-earth-700 hover:text-primary-600 font-medium transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-primary-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-primary-700 transition-colors shadow-md">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 hover:bg-earth-50 transition-colors"
              aria-label="Open mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-earth-200" ref={mobileMenuRef}>
            <nav className="flex flex-col space-y-2">
              {[
                { href: '/explore', label: 'Explore', icon: Search },
                { href: '/experiences', label: 'Experiences', icon: Award },
                { href: '/volunteer', label: 'Volunteer', icon: UserCheck },
                { href: '/host', label: 'Host', icon: Settings },
              ].map((item) => {
                const isActive = pathname?.startsWith(item.href)
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenus}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'text-primary-700 bg-primary-50 border border-primary-100'
                        : 'text-earth-700 hover:text-primary-600 hover:bg-earth-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              <Link
                href="/ai-planner"
                onClick={closeMenus}
                className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl font-medium"
              >
                <Globe className="w-5 h-5" />
                <span>AI Planner</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}