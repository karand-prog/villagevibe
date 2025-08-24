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
  title: 'VillageVibe',
  description: 'Authentic village experiences across India',
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

