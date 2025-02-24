import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {Toaster} from "@/components/ui/sonner";
import React from "react";
import {PublicEnvScript} from "next-runtime-env";
import texture from "@/assets/images/texture_flows.webp";

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

    <main>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${texture.src})`,
          opacity: 0.16
        }}
      />
      {children}
    </main>
    <Toaster/>
    </body>
    </html>
  )
}
