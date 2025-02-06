import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Nagivation from '@/components/ui/navigation-bar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'haper',
  description: 'AI assistant that automatically collects, prioritizes, and responds to messages across Gmail, WhatsApp, and other platforms',
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
    <body className={inter.className}>
      <Nagivation/>
      <main>{children}</main>
    </body>
    </html>
  )
}
