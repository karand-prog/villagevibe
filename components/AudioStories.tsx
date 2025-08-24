'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Mic, Play, Pause, Square, Volume2, Share2, Download, Heart, MessageCircle, Clock, User } from 'lucide-react'
import { useTranslation } from './LanguageDetector'

interface AudioStory {
  id: string
  title: string
  description: string
  narrator: {
    name: string
    avatar: string
    role: string
  }
  audioUrl: string
  duration: number
  category: 'village-history' | 'cultural-story' | 'personal-experience' | 'local-legends' | 'traditions' | 'food-stories'
  language: string
  transcript?: string
  likes: number
  shares: number
  createdAt: string
  tags: string[]
}

interface AudioStoriesProps {
  villageId: string
  villageName: string
}

const AudioStories = ({ villageId, villageName }: AudioStoriesProps) => {
  const { t } = useTranslation()
  const [stories, setStories] = useState<AudioStory[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [newStory, setNewStory] = useState({ title: '', description: '', category: 'cultural-story' as const, language: 'en' })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await fetch(`/api/audio-stories?villageId=${villageId}`)
        const data = await res.json()
        setStories(data)
      } catch (err) {
        // Optionally set error state
      }
    }
    fetchStories()
  }, [villageId])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const formData = new FormData()
        formData.append('audio', audioBlob, `${Date.now()}.wav`)
        formData.append('title', newStory.title)
        formData.append('description', newStory.description)
        formData.append('category', newStory.category)
        formData.append('language', newStory.language)
        formData.append('narrator', JSON.stringify({ name: 'Anonymous', avatar: '', role: 'Villager' }))
        formData.append('villageId', villageId)
        // Optionally add transcript, tags, duration
        try {
          await fetch('/api/audio-stories', {
            method: 'POST',
            body: formData
          })
          // Refetch stories after upload
          const res = await fetch(`/api/audio-stories?villageId=${villageId}`)
          const data = await res.json()
          setStories(data)
        } catch (err) {
          // Optionally set error state
        }
        setShowRecordModal(false)
        setIsRecording(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Unable to access microphone. Please check permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const playAudio = (storyId: string, audioUrl: string) => {
    if (isPlaying === storyId) {
      // Pause current audio
      if (audioRef.current) {
        audioRef.current.pause()
      }
      setIsPlaying(null)
    } else {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
      }

      // Start new audio
      // Use backend-served audio
      const audio = new Audio(audioUrl.startsWith('/uploads/audio/') ? `/api/audio-stories/audio/${audioUrl.split('/').pop()}` : audioUrl)
      audioRef.current = audio

      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration)
      })

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime)
      })

      audio.addEventListener('ended', () => {
        setIsPlaying(null)
        setCurrentTime(0)
      })

      audio.play()
      setIsPlaying(storyId)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const categories = [
    { id: 'village-history', name: 'Village History', color: 'bg-blue-100 text-blue-700' },
    { id: 'cultural-story', name: 'Cultural Stories', color: 'bg-purple-100 text-purple-700' },
    { id: 'personal-experience', name: 'Personal Experience', color: 'bg-green-100 text-green-700' },
    { id: 'local-legends', name: 'Local Legends', color: 'bg-orange-100 text-orange-700' },
    { id: 'traditions', name: 'Traditions', color: 'bg-red-100 text-red-700' },
    { id: 'food-stories', name: 'Food Stories', color: 'bg-yellow-100 text-yellow-700' }
  ]

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId) || categories[0]
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-earth-800 mb-2">Village Stories & Audio</h2>
          <p className="text-earth-600">Listen to stories, legends, and experiences shared by the villagers</p>
        </div>
        <button
          onClick={() => setShowRecordModal(true)}
          className="btn-primary flex items-center"
        >
          <Mic className="w-4 h-4 mr-2" />
          Share Your Story
        </button>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map(story => {
          const categoryInfo = getCategoryInfo(story.category)
          const isCurrentlyPlaying = isPlaying === story.id

          return (
            <div key={story.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Audio Player */}
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <button
                      onClick={() => playAudio(story.id, story.audioUrl)}
                      className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      {isCurrentlyPlaying ? (
                        <Pause className="w-5 h-5 text-white" />
                      ) : (
                        <Play className="w-5 h-5 text-white ml-1" />
                      )}
                    </button>
                    <div className="ml-3">
                      <p className="text-white font-medium">{story.title}</p>
                      <p className="text-white/80 text-sm">{formatTime(story.duration)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-white/80 hover:text-white">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="text-white/80 hover:text-white">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {isCurrentlyPlaying && (
                  <div className="w-full bg-white/20 rounded-full h-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all duration-100"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-earth-600 text-sm mb-3 line-clamp-2">{story.description}</p>

                {/* Narrator */}
                <div className="flex items-center mb-3">
                  <img
                    src={story.narrator.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face'}
                    alt={story.narrator.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-earth-800">{story.narrator.name}</p>
                    <p className="text-xs text-earth-600">{story.narrator.role}</p>
                  </div>
                </div>

                {/* Category */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                    {categoryInfo.name}
                  </span>
                  <div className="flex items-center text-xs text-earth-500">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(story.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {story.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="bg-earth-100 text-earth-600 px-2 py-1 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-earth-500">
                  <div className="flex items-center gap-3">
                    <span>{story.likes} likes</span>
                    <span>{story.shares} shares</span>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Record New Story Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Record Your Story</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Story Title</label>
                <input
                  type="text"
                  value={newStory.title}
                  onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                  className="input-field"
                  placeholder="Enter your story title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Description</label>
                <textarea
                  value={newStory.description}
                  onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Brief description of your story"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Category</label>
                <select
                  value={newStory.category}
                  onChange={(e) => setNewStory({ ...newStory, category: e.target.value as any })}
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Language</label>
                <select
                  value={newStory.language}
                  onChange={(e) => setNewStory({ ...newStory, language: e.target.value })}
                  className="input-field"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="gu">Gujarati</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>
            </div>

            {/* Recording Controls */}
            <div className="mt-6 text-center">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="btn-primary flex items-center mx-auto"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Start Recording
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="btn-secondary flex items-center mx-auto"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop Recording
                </button>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowRecordModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                disabled={!newStory.title || !newStory.description}
                className="btn-primary flex-1"
              >
                Save Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AudioStories 