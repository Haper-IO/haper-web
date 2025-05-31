import './globals.css'
import type {Metadata} from 'next'
import React from "react";

import {GeistSans} from 'geist/font/sans'
import {Toaster} from "@/components/ui/sonner";
import {PublicEnvScript} from "next-runtime-env";
import texture from "@/assets/images/texture_flows.webp";
import {NextStepProvider, NextStep} from 'nextstepjs';

// Geist font is already configured, no need for additional setup

const steps = [
  {
    tour: "mainTour",
    steps: [
      {
        icon: "👋",
        title: "Welcome Onboard",
        content: "Let's get started with Haper!",
        showControls: true,
        showSkip: true,
      },
      {
        icon: "✨",
        title: "Add Your Email Accounts",
        content: "You can connect your multiple email accounts as many as you want.",
        selector: "#user-guide-step1",
        side: "bottom-right",
        showControls: true,
        showSkip: true,
        pointerPadding: 5,
        pointerRadius: 10,
      },
      {
        icon: "✨",
        title: "Manage Accounts Tracking Status",
        content: "You can manage message tracking status for your email accounts here.",
        selector: "#user-guide-step2",
        side: "right",
        showControls: true,
        showSkip: true,
        pointerPadding: 5,
        pointerRadius: 10,
      },
      {
        icon: "✨",
        title: "Check Your Reports",
        content: "Your reports will be generated automatically and you can check them here.",
        selector: "#user-guide-step3",
        side: "bottom",
        showControls: true,
        showSkip: true,
        pointerPadding: 5,
        pointerRadius: 10,
      },
      {
        icon: "🎉",
        title: "Enjoy your journey",
        content: <>Now you have finished the setup. <br/><br/> You can start using Haper by checking your reports
          whenever you want.</>,
        showControls: true,
        showSkip: true,
      },
    ]
  }
];

export const metadata: Metadata = {
  title: 'haper',
  description: 'AI assistant that automatically collects, prioritizes, and responds to messages across Gmail, WhatsApp, and other platforms',
  icons: "/favicon.ico",
}

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode
  }) {
  return (
    <html lang="en">
    <head>
      <PublicEnvScript/>
    </head>
    <body className={GeistSans.className}>
    <NextStepProvider>

      <NextStep
        // @ts-ignore
        steps={steps}
        cardTransition={{
          ease: 'easeInOut',
          duration: 0.5
        }}
      >
        <main>
          <div
            className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-9999]"
            style={{
              backgroundImage: `url(${texture.src})`,
              opacity: 0.16
            }}
          />
          {children}
        </main>
        <Toaster position="top-right" theme="light"/>
      </NextStep>
    </NextStepProvider>

    </body>
    </html>
  )
}
