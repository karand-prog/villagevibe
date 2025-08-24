import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '@/app/page'
import { AuthProvider } from '@/components/AuthContext'
import { LanguageContext } from '@/components/LanguageDetector'

jest.mock('@/components/Header', () => ({
  __esModule: true,
  default: () => <div data-testid="header">Header</div>
}))

jest.mock('@/components/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer">Footer</div>
}))

// Mock authFetch
jest.mock('@/components/authFetch', () => ({
  authFetch: jest.fn()
}))

// Mock translation hook
jest.mock('@/components/LanguageDetector', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: { [key: string]: string } = {
        'home.title': 'VillageVibe',
        'home.subtitle': 'Discover authentic rural India. Book unique village stays, support local communities, and experience real culture—no middlemen, just meaningful journeys.',
        'home.explore': 'Explore Villages',
        'home.host': 'Become a Host',
        'home.viewMore': 'View More',
        'home.featured.title': 'Featured Villages & Experiences',
        'home.featured.subtitle': 'Discover authentic village stays and cultural experiences across India',
        'home.advanced.title': 'Advanced Features',
        'home.advanced.subtitle': 'Experience the future of rural tourism with cutting-edge technology',
        'home.ai.title': 'AI Travel Planner',
        'home.ai.subtitle': 'Get personalized travel plans created by AI based on your preferences and budget',
        'home.live.title': 'Live Village Streams',
        'home.live.subtitle': 'Experience village life in real-time through live streaming and virtual tours',
        'home.social.title': 'Social Gamification',
        'home.social.subtitle': 'Earn badges, compete on leaderboards, and connect with fellow travelers',
        'home.blockchain.title': 'Blockchain Transparency',
        'home.blockchain.subtitle': 'See exactly how your money benefits local communities with transparent revenue sharing'
      };
      return translations[key] || key;
    },
    language: 'en'
  }),
  LanguageContext: React.createContext({
    language: 'en',
    setLanguage: jest.fn(),
    availableLanguages: [{ code: 'en', label: 'English' }]
  })
}))

const mockLanguageContextValue = {
  language: 'en',
  setLanguage: jest.fn(),
  availableLanguages: [{ code: 'en', label: 'English' }]
}

const renderWithProviders = (component: React.ReactElement) =>
  render(
    <LanguageContext.Provider value={mockLanguageContextValue}>
      <AuthProvider>
        {component}
      </AuthProvider>
    </LanguageContext.Provider>
  )

describe('HomePage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the main hero section', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('VillageVibe')).toBeInTheDocument()
    expect(screen.getByText(/Discover authentic rural India/)).toBeInTheDocument()
  })

  it('renders navigation buttons', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Explore Villages')).toBeInTheDocument()
    expect(screen.getByText('Become a Host')).toBeInTheDocument()
  })

  it('renders advanced features section', () => {
    renderWithProviders(<HomePage />)
    // Use flexible matcher for split heading
    expect(screen.getByText((content, node) => !!node && node.textContent === 'Advanced Features')).toBeInTheDocument()
    expect(screen.getByText('AI Travel Planner')).toBeInTheDocument()
    expect(screen.getByText('Live Village Streams')).toBeInTheDocument()
    expect(screen.getByText('Social Gamification')).toBeInTheDocument()
    expect(screen.getByText('Blockchain Transparency')).toBeInTheDocument()
  })

  it('renders header and footer components', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('displays featured villages section', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByText('Villages & Experiences')).toBeInTheDocument()
  })

  it('handles API errors gracefully for featured listings', async () => {
    const { authFetch } = require('@/components/authFetch')
    authFetch.mockRejectedValueOnce(new Error('API Error'))
    renderWithProviders(<HomePage />)
    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })
  })

  it('renders with proper accessibility attributes', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    const headings = screen.getAllByRole('heading', { level: 2 })
    expect(headings.length).toBeGreaterThan(0)
  })

  it('displays proper meta information', () => {
    renderWithProviders(<HomePage />)
    expect(screen.getByText(/Experience the future of rural tourism/)).toBeInTheDocument()
    expect(screen.getByText(/Get personalized travel plans/)).toBeInTheDocument()
  })
}) 