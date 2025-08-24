const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

// Normalize and validate planner inputs
function sanitizePlanInputs(raw) {
  const destination = (typeof raw.destination === 'string' && raw.destination.trim()) ? raw.destination.trim() : 'Rural India'
  const durationNum = Number(raw.duration)
  const duration = Number.isFinite(durationNum) && durationNum > 0 ? Math.floor(durationNum) : 3
  const budgetNum = Number(raw.budget)
  const budget = Number.isFinite(budgetNum) && budgetNum >= 0 ? Math.round(budgetNum) : 10000
  const groupSizeNum = Number(raw.groupSize)
  const groupSize = Number.isFinite(groupSizeNum) && groupSizeNum > 0 ? Math.floor(groupSizeNum) : 2

  let interests = []
  if (Array.isArray(raw.interests)) {
    interests = raw.interests.map(String).map(s => s.trim()).filter(Boolean)
  } else if (typeof raw.interests === 'string') {
    interests = raw.interests.split(',').map(s => s.trim()).filter(Boolean)
  }

  const travelStyle = (typeof raw.travelStyle === 'string' && raw.travelStyle.trim()) ? raw.travelStyle.trim() : 'cultural'
  const accommodation = (typeof raw.accommodation === 'string' && raw.accommodation.trim()) ? raw.accommodation.trim() : 'homestay'

  return { destination, duration, budget, groupSize, interests, travelStyle, accommodation }
}

// Generate a simple multi-day itinerary
function generateItinerary(duration, destination, accommodation) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? Math.floor(duration) : 3
  const days = []
  for (let day = 1; day <= safeDuration; day++) {
    days.push({
      day,
      activities: [
        {
          id: `act_${day}_1`,
          title: day === 1 ? 'Village Welcome & Orientation' : 'Local Cultural Activity',
          description: day === 1
            ? 'Meet your host family and learn about village life'
            : 'Engage with local artisans and explore traditions',
          duration: `${Math.floor(Math.random() * 3) + 2} hours`,
          cost: 500 + (day - 1) * 50,
          location: destination || 'Village Center',
          type: 'cultural',
          rating: 4.6 + Math.random() * 0.4,
          image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
        }
      ],
      accommodation: accommodation || 'Traditional Homestay',
      meals: ['Local Breakfast', 'Traditional Lunch', 'Village Dinner'],
      estimatedCost: 2000 + Math.floor(Math.random() * 800)
    })
  }
  return days
}

// Ensure itinerary covers all days and fill costs/derived fields
function ensureFullItinerary(plan, input) {
  if (!plan || typeof plan !== 'object') return plan
  const duration = input.duration
  const destination = input.destination
  const accommodation = input.accommodation
  if (!Array.isArray(plan.itinerary)) {
    plan.itinerary = []
  }
  const existingDays = new Set(plan.itinerary.map(d => d.day))
  for (let day = 1; day <= duration; day++) {
    if (!existingDays.has(day)) {
      plan.itinerary.push(generateItinerary(1, destination, accommodation)[0])
    }
  }
  // Sort by day
  plan.itinerary = plan.itinerary
    .filter(d => d && typeof d.day === 'number')
    .sort((a, b) => a.day - b.day)

  // Recompute totals if missing
  const computedTotal = plan.itinerary.reduce((sum, d) => sum + (Number(d.estimatedCost) || 0), 0)
  if (!Number.isFinite(plan.totalCost) || plan.totalCost <= 0) {
    plan.totalCost = computedTotal || duration * 2500
  }
  if (!Number.isFinite(plan.savings) || plan.savings < 0) {
    plan.savings = Math.round((input.budget || 10000) * 0.15)
  }
  if (!plan.realTimeData) {
    plan.realTimeData = {
      availability: 15,
      demandLevel: 'medium',
      seasonalPricing: Math.round(plan.totalCost * 0.1),
      lastUpdated: new Date().toISOString()
    }
  }
  return plan
}

// Generate AI travel plan (model-backed with graceful fallback)
router.post('/plan', async (req, res) => {
  try {
    console.log('[AI] POST /api/ai/plan request received')
    const {
      destination,
      duration,
      budget,
      groupSize,
      interests,
      travelStyle,
      accommodation
    } = req.body
    const input = sanitizePlanInputs({ destination, duration, budget, groupSize, interests, travelStyle, accommodation })
    const useOpenAI = false // Force-disable OpenAI; use Ollama-only path

    // Attempt model-backed generation first
    if (useOpenAI && typeof fetch === 'function') {
      try {
        const systemPrompt = `You are an expert rural tourism travel planner for India. Return strictly JSON with the following shape: {
  id: string,
  title: string,
  duration: number,
  budget: number,
  groupSize: number,
  preferences: string[],
  itinerary: Array<{ day: number, activities: Array<{ id: string, title: string, description: string, duration: string, cost: number, location: string, type: 'cultural' | 'adventure' | 'relaxation' | 'learning' | 'food', rating: number, image: string }>, accommodation: string, meals: string[], estimatedCost: number }>,
  totalCost: number,
  savings: number,
  culturalInsights: string[],
  recommendations: string[],
  aiScore: number,
  realTimeData: { availability: number, demandLevel: 'low' | 'medium' | 'high', seasonalPricing: number, lastUpdated: string }
}
Ensure activities are culturally authentic and relevant to the destination/region if provided.`

        const userPrompt = { ...input }

        const resp = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
            temperature: 0.7,
            response_format: { type: 'json_object' },
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: JSON.stringify(userPrompt) }
            ]
          })
        })

        if (!resp.ok) {
          throw new Error(`OpenAI error: ${resp.status}`)
        }
        const data = await resp.json()
        const content = data.choices?.[0]?.message?.content
        if (content) {
          const parsed = JSON.parse(content)
          // Add defaults if missing
          parsed.id = parsed.id || ('plan_' + Date.now())
          parsed.title = parsed.title || `Perfect ${input.duration}-Day ${input.travelStyle} Experience in ${input.destination}`
          parsed.realTimeData = parsed.realTimeData || {
            availability: 15,
            demandLevel: 'medium',
            seasonalPricing: Math.round((parsed.totalCost || input.duration * 2500) * 0.1),
            lastUpdated: new Date().toISOString()
          }
          const normalized = ensureFullItinerary(parsed, input)
          return res.json(normalized)
        }
      } catch (modelErr) {
        console.warn('Model-backed planning failed, falling back:', modelErr.message)
      }
    }

    // Try open-source Ollama fallback if available
    const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3'
    if (typeof fetch === 'function') {
      try {
        console.log(`[AI] Using Ollama model: ${ollamaModel} at ${ollamaUrl}`)
        const ollamaResp = await fetch(`${ollamaUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: ollamaModel,
            stream: false,
            messages: [
              {
                role: 'system',
                content:
                  'You are an expert rural tourism travel planner for India. Return only valid JSON for a travel plan with fields: id, title, duration, budget, groupSize, preferences, itinerary[{day, activities[{id,title,description,duration,cost,location,type,rating,image}], accommodation, meals[], estimatedCost}], totalCost, savings, culturalInsights[], recommendations[], aiScore, realTimeData{availability,demandLevel,seasonalPricing,lastUpdated}. Do not include backticks or extra text.'
              },
              {
                role: 'user',
                content: JSON.stringify(input)
              }
            ]
          })
        })
        if (ollamaResp.ok) {
          const data = await ollamaResp.json()
          const content = data?.message?.content
          if (content) {
            const parsed = JSON.parse(content)
            parsed.id = parsed.id || ('plan_' + Date.now())
            parsed.title = parsed.title || `Perfect ${input.duration}-Day ${input.travelStyle} Experience in ${input.destination}`
            parsed.realTimeData = parsed.realTimeData || {
              availability: 15,
              demandLevel: 'medium',
              seasonalPricing: Math.round((parsed.totalCost || input.duration * 2500) * 0.1),
              lastUpdated: new Date().toISOString()
            }
            const normalized = ensureFullItinerary(parsed, input)
            return res.json(normalized)
          }
        }
      } catch (ollamaErr) {
        console.warn('Ollama fallback failed, using deterministic plan:', ollamaErr.message)
      }
    }

    // Fallback plan (deterministic mock)
    const plan = {
      id: 'plan_' + Date.now(),
      title: `Perfect ${input.duration}-Day ${input.travelStyle} Experience in ${input.destination}`,
      duration: input.duration,
      budget: input.budget,
      groupSize: input.groupSize,
      preferences: input.interests || [],
      itinerary: generateItinerary(input.duration, input.destination, input.accommodation),
      totalCost: input.duration * 2500,
      savings: Math.max(0, Math.round(input.budget * 0.15)),
      culturalInsights: [
        'Best time to visit local temples is early morning',
        'Learn basic greetings in the local language',
        'Participate in community activities for authentic experience'
      ],
      recommendations: [
        'Book activities in advance during peak season',
        'Carry cash for local markets and artisans',
        'Download offline maps for remote areas'
      ],
      aiScore: Math.floor(Math.random() * 20) + 80,
      realTimeData: {
        availability: 15,
        demandLevel: 'medium',
        seasonalPricing: Math.round(input.duration * 2500 * 0.1),
        lastUpdated: new Date().toISOString()
      }
    }

    res.json(plan)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Optional: GET variant for quick testing in browser
router.get('/plan', async (req, res) => {
  try {
    console.log('[AI] GET /api/ai/plan request received')
    const {
      destination = 'Rural India',
      duration = 3,
      budget = 10000,
      groupSize = 2,
      interests = [],
      travelStyle = 'cultural',
      accommodation = 'homestay'
    } = req.query

    const plan = {
      id: 'plan_' + Date.now(),
      title: `Perfect ${duration}-Day ${travelStyle} Experience in ${destination}`,
      duration: Number(duration),
      budget: Number(budget),
      groupSize: Number(groupSize),
      preferences: Array.isArray(interests) ? interests : String(interests || '').split(',').filter(Boolean),
      itinerary: generateItinerary(Number(duration), destination, String(accommodation)),
      totalCost: Number(duration) * 2500,
      savings: Math.round(Number(budget) * 0.15),
      culturalInsights: [
        'Best time to visit local temples is early morning',
        'Learn basic greetings in the local language',
        'Participate in community activities for authentic experience'
      ],
      recommendations: [
        'Book activities in advance during peak season',
        'Carry cash for local markets and artisans',
        'Download offline maps for remote areas'
      ],
      aiScore: Math.floor(Math.random() * 20) + 80,
      realTimeData: {
        availability: 15,
        demandLevel: 'medium',
        seasonalPricing: Math.round(Number(duration) * 2500 * 0.1),
        lastUpdated: new Date().toISOString()
      }
    }
    res.json(plan)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get AI suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query
    const query = q?.toLowerCase() || ''

    // Mock AI suggestions - replace with actual AI service
    const suggestions = [
      {
        id: '1',
        title: 'Traditional Rajasthani Village Experience',
        description: 'Experience authentic rural life in Rajasthan',
        location: 'Pushkar, Rajasthan',
        price: 2500,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        matchScore: 95
      },
      {
        id: '2',
        title: 'Kerala Backwaters Village Stay',
        description: 'Stay in traditional houseboats and experience Kerala culture',
        location: 'Alleppey, Kerala',
        price: 3500,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        matchScore: 88
      },
      {
        id: '3',
        title: 'Himachal Mountain Village Retreat',
        description: 'Mountain village experience with trekking and local culture',
        location: 'Manali, Himachal Pradesh',
        price: 2800,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        matchScore: 82
      }
    ].filter(suggestion => 
      suggestion.title.toLowerCase().includes(query) ||
      suggestion.location.toLowerCase().includes(query) ||
      suggestion.description.toLowerCase().includes(query)
    )

    res.json(suggestions)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router 