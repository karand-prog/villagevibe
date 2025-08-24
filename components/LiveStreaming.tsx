'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Video, Users, Heart, MessageCircle, Gift, Share2, Mic, Volume2, Settings, Eye, Clock, TrendingUp, Star, DollarSign, AlertCircle, CheckCircle, MapPin } from 'lucide-react'
import { useTranslation } from './LanguageDetector'
import AudioStories from './AudioStories'

interface LiveStream {
  id: string
  title: string
  host: string
  village: string
  viewers: number
  duration: string
  thumbnail: string
  isLive: boolean
  category: string
  description: string
  tags: string[]
  donations: number
  chatMessages: ChatMessage[]
  upcomingStreams: UpcomingStream[]
}

interface ChatMessage {
  id: string
  user: string
  message: string
  timestamp: Date
  type: 'message' | 'donation' | 'join' | 'system'
  amount?: number
  isModerator?: boolean
}

interface UpcomingStream {
  id: string
  title: string
  host: string
  village: string
  scheduledTime: Date
  thumbnail: string
  description: string
}

interface Donation {
  id: string
  user: string
  amount: number
  message: string
  timestamp: Date
}

const LiveStreaming = () => {
  const { t } = useTranslation()
  const [currentStream, setCurrentStream] = useState<LiveStream | null>(null)
  const [isWatching, setIsWatching] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [donationAmount, setDonationAmount] = useState('')
  const [donationMessage, setDonationMessage] = useState('')
  const [showDonationModal, setShowDonationModal] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [totalDonations, setTotalDonations] = useState(0)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [streamQuality, setStreamQuality] = useState('720p')
  const [showSettings, setShowSettings] = useState(false)
  const [recentDonations, setRecentDonations] = useState<Donation[]>([])
  const [liveStats, setLiveStats] = useState({
    peakViewers: 0,
    totalMessages: 0,
    totalDonations: 0,
    averageWatchTime: 0
  })

  const [streams, setStreams] = useState<LiveStream[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const chatRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const fetchStreams = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/live-streams')
        if (!res.ok) throw new Error('Failed to fetch live streams')
        const data = await res.json()
        setStreams(data)
      } catch (err) {
        setError('Failed to load live streams.')
      } finally {
        setLoading(false)
      }
    }
    fetchStreams()
  }, [])

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  const startWatching = async (stream: LiveStream) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/live-streams/${stream.id}`)
      if (!res.ok) throw new Error('Failed to fetch stream')
      const data = await res.json()
      setCurrentStream(data)
      setIsWatching(true)
      setViewerCount(data.viewers)
      setTotalDonations(data.donations)
      setChatMessages(data.chatMessages || [])
    } catch (err) {
      setError('Failed to load stream.')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (chatMessage.trim() && currentStream) {
      try {
        const res = await fetch(`/api/live-streams/${currentStream.id}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: 'You', message: chatMessage })
        })
        if (!res.ok) throw new Error('Failed to send message')
        const newMessage = await res.json()
        setChatMessages(prev => [...prev, newMessage])
        setChatMessage('')
      } catch (err) {
        setError('Failed to send message.')
      }
    }
  }

  const sendDonation = async () => {
    if (donationAmount && currentStream) {
      try {
        const res = await fetch(`/api/live-streams/${currentStream.id}/donate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: 'You', amount: parseInt(donationAmount), message: donationMessage })
        })
        if (!res.ok) throw new Error('Failed to send donation')
        const donation = await res.json()
        setRecentDonations(prev => [donation, ...prev.slice(0, 4)])
        setTotalDonations(prev => prev + donation.amount)
        setDonationAmount('')
        setDonationMessage('')
        setShowDonationModal(false)
      } catch (err) {
        setError('Failed to send donation.')
      }
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatDuration = (duration: string) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number)
    return `${hours}h ${minutes}m ${seconds}s`
  }

  return (
    <div className="py-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Video className="w-8 h-8 text-primary-600 mr-3" />
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            {t('live.title')}
          </h1>
        </div>
        <p className="text-xl text-earth-600 max-w-3xl mx-auto">
          {t('live.subtitle')}
        </p>
      </div>

      {!currentStream ? (
        <div className="max-w-6xl mx-auto">
          {/* Live Streams Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              Live Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <p>Loading live streams...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                streams.map(stream => (
                  <div key={stream.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={stream.thumbnail}
                        alt={stream.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-semibold flex items-center">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        LIVE
                      </div>
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                        <Eye className="w-4 h-4 inline mr-1" />
                        {stream.viewers.toLocaleString()}
                      </div>
                      <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {formatDuration(stream.duration)}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{stream.title}</h3>
                      <p className="text-earth-600 text-sm mb-3">{stream.description}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-primary-600 font-semibold text-sm">
                              {stream.host.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-sm">{stream.host}</div>
                            <div className="text-earth-500 text-xs">{stream.village}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-600 font-semibold">₹{stream.donations.toLocaleString()}</div>
                          <div className="text-earth-500 text-xs">Total Donations</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {stream.tags.map(tag => (
                          <span key={tag} className="bg-earth-100 text-earth-700 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => startWatching(stream)}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Watch Live
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Streams */}
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Clock className="w-6 h-6 mr-3 text-primary-600" />
              Upcoming Streams
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Upcoming streams will be fetched and displayed here */}
              {/* For now, we'll show a placeholder or empty state */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative">
                  <img
                    src="https://via.placeholder.com/400x240"
                    alt="Upcoming Stream"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-sm font-semibold">
                    Soon
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">Upcoming Stream</h3>
                  <p className="text-earth-600 text-sm mb-3">More details coming soon!</p>

                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                      <span className="text-primary-600 font-semibold text-sm">
                        ?
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">Host</div>
                      <div className="text-earth-500 text-xs">Village</div>
                    </div>
                  </div>

                  <button className="w-full bg-earth-100 text-earth-700 py-3 px-4 rounded-lg font-semibold hover:bg-earth-200 transition-colors">
                    Set Reminder
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {/* Live Stream Player */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Video Player */}
              <div className="bg-black rounded-xl overflow-hidden relative">
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">{currentStream.title}</h3>
                    <p className="text-gray-300">Live stream simulation</p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        {isMuted ? <Volume2 className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                      <div className="text-sm">
                        <Eye className="w-4 h-4 inline mr-1" />
                        {viewerCount.toLocaleString()} watching
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={streamQuality}
                        onChange={(e) => setStreamQuality(e.target.value)}
                        className="bg-black/50 text-white border border-white/20 rounded px-2 py-1 text-sm"
                      >
                        <option value="480p">480p</option>
                        <option value="720p">720p</option>
                        <option value="1080p">1080p</option>
                      </select>
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stream Info */}
              <div className="bg-white rounded-xl p-6 mt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentStream.title}</h2>
                    <div className="flex items-center space-x-4 text-earth-600">
                      <span className="flex items-center">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2">
                          <span className="text-primary-600 font-semibold text-sm">
                            {currentStream.host.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {currentStream.host}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {currentStream.village}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {viewerCount.toLocaleString()} viewers
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">₹{totalDonations.toLocaleString()}</div>
                    <div className="text-earth-500 text-sm">Total Donations</div>
                  </div>
                </div>

                <p className="text-earth-700 mb-4">{currentStream.description}</p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowDonationModal(true)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Donate
                  </button>
                  <button className="bg-earth-100 text-earth-700 px-6 py-2 rounded-lg font-semibold hover:bg-earth-200 transition-colors flex items-center">
                    <Heart className="w-4 h-4 mr-2" />
                    Follow
                  </button>
                  <button className="bg-earth-100 text-earth-700 px-6 py-2 rounded-lg font-semibold hover:bg-earth-200 transition-colors flex items-center">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              {/* Audio Stories Integration */}
              <div className="bg-white rounded-xl p-6 mt-6">
                <h3 className="text-xl font-bold mb-4">Village Stories & Audio</h3>
                <AudioStories
                  villageId={currentStream.id}
                  villageName={currentStream.village}
                />
              </div>
            </div>

            {/* Chat & Donations Sidebar */}
            <div className="space-y-6">
              {/* Live Chat */}
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-4 border-b border-earth-200">
                  <h3 className="font-semibold flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-primary-600" />
                    Live Chat
                  </h3>
                </div>

                <div
                  ref={chatRef}
                  className="h-96 overflow-y-auto p-4 space-y-3"
                >
                  {chatMessages.map(message => (
                    <div key={message.id} className={`flex items-start space-x-2 ${
                      message.type === 'system' ? 'justify-center' : ''
                    }`}>
                      {message.type !== 'system' && (
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-600 font-semibold text-xs">
                            {message.user.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className={`flex-1 ${message.type === 'system' ? 'text-center' : ''}`}>
                        {message.type !== 'system' && (
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{message.user}</span>
                            <span className="text-earth-400 text-xs">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                            {message.isModerator && (
                              <span className="bg-red-100 text-red-700 px-1 rounded text-xs">MOD</span>
                            )}
                          </div>
                        )}
                        <div className={`text-sm ${
                          message.type === 'system' ? 'text-earth-500 italic' : 'text-earth-700'
                        }`}>
                          {message.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-earth-200">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      onClick={sendMessage}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Donations */}
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-4 border-b border-earth-200">
                  <h3 className="font-semibold flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-green-600" />
                    Recent Donations
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  {recentDonations.map(donation => (
                    <div key={donation.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Gift className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{donation.user}</div>
                        <div className="text-green-600 font-semibold">₹{donation.amount}</div>
                        <div className="text-earth-500 text-xs">{donation.message}</div>
                      </div>
                    </div>
                  ))}

                  {recentDonations.length === 0 && (
                    <div className="text-center text-earth-500 py-8">
                      <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No donations yet</p>
                      <p className="text-xs">Be the first to support!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Live Stats */}
              <div className="bg-white rounded-xl shadow-lg">
                <div className="p-4 border-b border-earth-200">
                  <h3 className="font-semibold flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                    Live Stats
                  </h3>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-earth-600">Peak Viewers</span>
                    <span className="font-semibold">{Math.max(viewerCount, liveStats.peakViewers).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-earth-600">Total Messages</span>
                    <span className="font-semibold">{chatMessages.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-earth-600">Total Donations</span>
                    <span className="font-semibold text-green-600">₹{totalDonations.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-earth-600">Avg Watch Time</span>
                    <span className="font-semibold">12m 34s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Modal */}
          {showDonationModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Support the Stream</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Donation Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      placeholder="100"
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-earth-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={donationMessage}
                      onChange={(e) => setDonationMessage(e.target.value)}
                      placeholder="Leave a message for the host..."
                      rows={3}
                      className="w-full px-3 py-2 border border-earth-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => setShowDonationModal(false)}
                    className="flex-1 bg-earth-100 text-earth-700 py-2 px-4 rounded-lg font-semibold hover:bg-earth-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendDonation}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Send Donation
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Back Button */}
          <div className="mt-6">
            <button
              onClick={() => {
                setCurrentStream(null)
                setIsWatching(false)
                setChatMessages([])
                setRecentDonations([])
              }}
              className="bg-earth-100 text-earth-700 px-6 py-3 rounded-lg font-semibold hover:bg-earth-200 transition-colors"
            >
              ← Back to All Streams
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LiveStreaming 