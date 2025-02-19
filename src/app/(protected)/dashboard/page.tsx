"use client"

import { useState } from "react"
import { SidebarButton } from "@/components/SidebarButton"
import { SidebarNav } from "@/components/SidebarNav"
import { EmailSummaryWithStats, EmailSummaryHistory } from "@/components/dashboard-cards"

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="px-5 py-3">
          <SidebarButton isOpen={isSidebarOpen} toggle={toggleSidebar} />
        </div>
      </header>

      {/* Sidebar Navigation */}
      <SidebarNav isOpen={isSidebarOpen} />

      {/* Main Content */}
      <main
        className={`min-h-screen pt-[61px] transition-[padding] duration-300 ${
          isSidebarOpen ? "md:pl-60" : "md:pl-0"
        }`}
      >
        {/* Dashboard Content */}
        <div className="container p-5 center mx-auto">
          <div className="grid gap-6">
            <EmailSummaryWithStats />
            <EmailSummaryHistory />
          </div>
        </div>
      </main>
    </div>
  )
}
