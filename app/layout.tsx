import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Superchat — The Ultimate Chatting App (Web2 + Web3)',
  description: 'Chat. Own. Earn. The next-generation messaging platform combining smooth Web2 experience with powerful Web3 features. Replace all your existing chat apps with one unified solution.',
  keywords: 'chat, messaging, web3, crypto, nft, blockchain, social media, communication',
  authors: [{ name: 'Superchat Team' }],
  openGraph: {
    title: 'Superchat — The Ultimate Chatting App',
    description: 'Chat. Own. Earn. The next-generation messaging platform.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Superchat — The Ultimate Chatting App',
    description: 'Chat. Own. Earn. The next-generation messaging platform.',
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
