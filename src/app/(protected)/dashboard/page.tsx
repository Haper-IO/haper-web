"use client"

import { useState, useEffect } from "react"
import { SidebarButton } from "@/components/SidebarButton"
import { SidebarNav } from "@/components/SidebarNav"
import {
  EmailSummaryWithStats,
  EmailSummaryHistory,
  EmailSummaryData,
  MessageStatsData,
} from "@/components/dashboard-cards"

// Mock API functions - replace with actual API calls
const fetchEmailSummary = async (): Promise<EmailSummaryData> => {
  // Replace with actual API call
  return {
    title: "You received 3 Essential Emails in the Past 3 hours",
    updateTime: "3 mins ago",
    content: "In the past 3 hours, You have received 1 invitation from Grant about your upcoming trip, 1 reply from Alice about your car rental project, 1 email from your instructor Dr. Bieler discussing your essay topics.",
    highlightedPeople: [
      {name: "Grant", context: "invitation"},
      {name: "Alice", context: "car rental project"},
      {name: "Dr. Bieler", context: "essay topics"}
    ]
  };
};

const fetchMessageStats = async (): Promise<MessageStatsData> => {
  // Replace with actual API call
  return {
    timeRange: "3 hours",
    essentialCount: 39,
    essentialPercentage: 13.9,
    nonEssentialCount: 69,
    nonEssentialPercentage: 22.8
  };
};

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailSummary, setEmailSummary] = useState<EmailSummaryData | null>(null);
  const [messageStats, setMessageStats] = useState<MessageStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const [summaryData, statsData] = await Promise.all([
          fetchEmailSummary(),
          fetchMessageStats()
        ]);

        setEmailSummary(summaryData);
        setMessageStats(statsData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
        // Handle error state
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

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
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading dashboard data...</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {emailSummary && messageStats && (
                <EmailSummaryWithStats
                  summaryData={emailSummary}
                  statsData={messageStats}
                />
              )}
              {emailSummary && (
                <EmailSummaryHistory
                  summaryData={emailSummary}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
