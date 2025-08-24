import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/dashboard/',
        '/settings/',
        '/bookings/',
        '/_next/',
        '/private/',
        '*.json',
        '*.xml',
      ],
    },
    sitemap: 'https://villagevibe.com/sitemap.xml',
    host: 'https://villagevibe.com',
  }
} 