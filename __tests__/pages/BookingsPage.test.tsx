import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BookingsPage from '@/app/bookings/page'
import { useRouter } from 'next/navigation'
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

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({ push: mockPush })),
}))

// Mock translation hook
jest.mock('@/components/LanguageDetector', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
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

describe('BookingsPage Buttons', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders Impact Certificate buttons and they are clickable', async () => {
    renderWithProviders(<BookingsPage />)
    const impactBtns = await screen.findAllByRole('button', { name: /impact certificate|download certificate/i })
    impactBtns.forEach(btn => {
      userEvent.click(btn)
      // Modal or download action should be triggered
    })
  })

  it('renders Payment buttons and they are clickable', async () => {
    renderWithProviders(<BookingsPage />)
    const paymentBtns = await screen.findAllByRole('button', { name: /pay|payment|complete payment/i })
    paymentBtns.forEach(btn => {
      userEvent.click(btn)
      // Payment modal/action should be triggered
    })
  })
}) 