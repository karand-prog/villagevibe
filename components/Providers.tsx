'use client'

import { AuthProvider } from './AuthContext'
import { LanguageProvider } from './LanguageDetector'
import OnboardingWrapper from './OnboardingWrapper'
import { SavedProvider } from './SavedContext'
import { DataBusProvider } from './DataBus'
import { BookingProvider } from './BookingContext'
import { ReviewProvider } from './ReviewContext'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SavedProvider>
          <DataBusProvider>
            <BookingProvider>
              <ReviewProvider>
                <OnboardingWrapper>
                  {children}
                </OnboardingWrapper>
              </ReviewProvider>
            </BookingProvider>
          </DataBusProvider>
        </SavedProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}

