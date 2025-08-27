import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Superchat - The Ultimate Chatting App',
  description: 'Chat. Own. Earn. The next generation of messaging with Web3 integration.',
  keywords: ['chat', 'messaging', 'web3', 'blockchain', 'social', 'communication'],
  authors: [{ name: 'Superchat Team' }],
  creator: 'Superchat',
  publisher: 'Superchat',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Superchat - The Ultimate Chatting App',
    description: 'Chat. Own. Earn. The next generation of messaging with Web3 integration.',
    url: 'http://localhost:3000',
    siteName: 'Superchat',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Superchat - The Ultimate Chatting App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Superchat - The Ultimate Chatting App',
    description: 'Chat. Own. Earn. The next generation of messaging with Web3 integration.',
    images: ['/og-image.jpg'],
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
