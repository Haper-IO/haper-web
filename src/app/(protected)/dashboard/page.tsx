"use client"

import {Button} from "@/components/ui/button"
import {
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import React, {useState, useEffect} from "react"
import {useRouter} from "next/navigation"
import {LatestSummary, LastReport} from "@/app/(protected)/dashboard/dashboard-cards"
import {Sidebar} from "@/components/report-sidebar";
import {StatusCard} from "@/app/(protected)/dashboard/status-card"


export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const handleSelectReport = (id: string) => {
    router.push(`/report/${id}`);
  };

  return (
    <main className="min-h-screen bg-transparent relative">

      {/* Header with Sidebar Toggle */}
      <header className="fixed top-0 left-0 right-0 z-10 transition-all duration-300 bg-transparent">
        <div className="px-5 py-3 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5"/> : <PanelLeft className="h-5 w-5"/>}
          </Button>

          {!isSidebarOpen && (
            <div className="ml-2 hidden md:flex items-center">
            </div>
          )}
        </div>
      </header>

      <Sidebar
        isOpen={isSidebarOpen}
        onSelectReport={handleSelectReport}
        currentReportId=""
        onToggleSidebar={() => setIsSidebarOpen(false)}
      />
      <div className={`transition-[padding] duration-300 ${isSidebarOpen ? "md:pl-56" : "md:pl-0"}`}>
        <div className="container p-4 mx-auto">
          <div className="space-y-4">
            <div className="space-y-4 backdrop-blur-[1px]">
              {/* Message Tracking Status Section */}
              <StatusCard />
              {/* Latest Summary Section */}
              <LatestSummary/>
              {/* Last Report Section */}
              <LastReport/>
            </div>
          </div>
        </div>
      </div>

      {/* Background texture */}
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
    </main>
  )
}