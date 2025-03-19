"use client"

import { useState, useEffect } from "react"
import { SidebarButton } from "@/components/sidebar-button"
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

// Mock data for previous reports
const previousReports = [
  {
    date: "Today",
    reports: [
      { id: "today-1", title: "Morning Report", time: "10:30 AM" },
      { id: "today-2", title: "Afternoon Update", time: "3:45 PM" }
    ]
  },
  {
    date: "Yesterday",
    reports: [
      { id: "yesterday-1", title: "Daily Summary", time: "5:20 PM" },
      { id: "yesterday-2", title: "Morning Overview", time: "9:15 AM" }
    ]
  },
  {
    date: "Previous 7 Days",
    reports: [
      { id: "prev7-1", title: "Weekly Digest", time: "Monday, 4:00 PM" },
      { id: "prev7-2", title: "Important Messages", time: "Tuesday, 11:30 AM" },
      { id: "prev7-3", title: "Project Updates", time: "Thursday, 2:15 PM" }
    ]
  },
  {
    date: "Previous 30 Days",
    reports: [
      { id: "prev30-1", title: "Monthly Summary", time: "Mar 1, 9:00 AM" },
      { id: "prev30-2", title: "Team Communication", time: "Mar 10, 3:30 PM" },
      { id: "prev30-3", title: "Client Correspondence", time: "Mar 15, 10:45 AM" }
    ]
  }
];

// Enhanced Sidebar Component with ChatGPT-style date grouping
function EnhancedSidebar({ isOpen, onSelectReport }: { isOpen: boolean, onSelectReport: (id: string) => void }) {
  return (
    <aside
      className={`fixed top-0 left-0 z-20 h-full bg-white/55 border-r border-gray-50 pt-[84px] transition-all duration-300 w-60 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden"
      }`}
    >
      <div className="p-4">
        <div>
          <h2 className="text-md font-medium text-gray-900 pl-2 mb-3">Previous Reports</h2>
        </div>
        <div className="space-y-4">
          {previousReports.map((group) => (
            <div key={group.date}>
              {/* Date header */}
              <div className="flex items-center justify-between w-full p-2 text-xs font-medium text-gray-700 bg-gray-50 rounded">
                <span>{group.date}</span>
              </div>
              {/* Content - always visible */}
              <div className="pl-2">
                <div className="space-y-1 mt-1">
                  {group.reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => onSelectReport(report.id)}
                      className="flex items-start gap-3 w-full p-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded group"
                    >
                      <div className="overflow-hidden">
                        <p className="font-medium truncate">{report.title}</p>
                        <p className="text-xs text-gray-500 truncate">{report.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [emailSummary, setEmailSummary] = useState<EmailSummaryData | null>(null);
  const [messageStats, setMessageStats] = useState<MessageStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

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
  }, [selectedReportId]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/75 border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <SidebarButton isOpen={isSidebarOpen} toggle={toggleSidebar} />
              <h1 className="ml-4 text-lg font-semibold text-gray-900">Email Summary</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <EnhancedSidebar isOpen={isSidebarOpen} onSelectReport={handleSelectReport} />

      {/* Main Content */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-60" : "md:ml-0"
        }`}
      >
        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="rounded-md bg-white p-8 shadow-sm">
                <p className="text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-8">
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
