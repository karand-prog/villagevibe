import './globals.css'
import type { Metadata } from 'next'
import Providers from '@/components/Providers'
import { Poppins, Inter } from 'next/font/google'
import MobileStickyNav from '@/components/MobileStickyNav'
import dynamic from 'next/dynamic'

const AIChatbot = dynamic(() => import('@/components/AIChatbot'), { 
  ssr: false,
  loading: () => null
})

const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700'] })
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'VillageVibe - Authentic Rural India Experiences',
  description: 'Discover authentic rural India. Book unique village stays, support local communities, and experience real culture—no middlemen, just meaningful journeys.',
  keywords: 'village tourism, rural India, authentic experiences, village stays, local communities, cultural tourism, sustainable travel',
  authors: [{ name: 'VillageVibe Team' }],
  creator: 'VillageVibe',
  publisher: 'VillageVibe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://villagevibe.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'VillageVibe - Authentic Rural India Experiences',
    description: 'Discover authentic rural India. Book unique village stays, support local communities, and experience real culture.',
    url: 'https://villagevibe.com',
    siteName: 'VillageVibe',
    images: [
      {
        url: '/logo.svg',
        width: 200,
        height: 200,
        alt: 'VillageVibe - Authentic Rural India Experiences',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VillageVibe - Authentic Rural India Experiences',
    description: 'Discover authentic rural India. Book unique village stays, support local communities, and experience real culture.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen">
        <Providers>
          {children}
          <MobileStickyNav />
          <AIChatbot />
        </Providers>
      </body>
    </html>
  )
}

