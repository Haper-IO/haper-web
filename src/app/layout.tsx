import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Toaster} from "@/components/ui/sonner";
import React from "react";
import {PublicEnvScript} from "next-runtime-env";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'haper',
  description: 'AI assistant that automatically collects, prioritizes, and responds to messages across Gmail, WhatsApp, and other platforms',
}

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
    <head>
      <PublicEnvScript/>
    </head>
    <body className={inter.className}>
      <main>{children}</main>
      <Toaster />
    </body>
    </html>
  )
}
