"use client"

import {Button} from "@/components/ui/button"
import {
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  History,
  LucideIcon,
  Loader2,
  PlayCircle,
  StopCircle,
} from "lucide-react"
import Link from "next/link"
import {useState, useEffect} from "react"
import {EmailSummaryWithStats, EmailSummaryHistory} from "@/components/dashboard-cards"
import {stopTracking, getTrackingStatus} from "@/lib/requests/client/message-tracking"

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
}

const SidebarLink = ({href, icon: Icon, children}: SidebarLinkProps) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md group transition-colors"
  >
    <Icon className="h-4 w-4 text-gray-500 group-hover:text-gray-900"/>
    <span className="group-hover:text-gray-900">{children}</span>
  </Link>
)

interface TrackingStatus {
  account_id: string;
  email: string;
  provider: string;
  status: "NotStarted" | "Ongoing" | "Stopped" | "Error";
  created_at?: string | null;
  updated_at?: string | null;
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [trackingStatuses, setTrackingStatuses] = useState<TrackingStatus[]>([])
  const [isFetchingTrackingStatus, setIsFetchingTrackingStatus] = useState(false)
  const [isStoppingTracking, setIsStoppingTracking] = useState(false)

  const fetchTrackingStatus = () => {
    if (isFetchingTrackingStatus) {
      return
    }
    setIsFetchingTrackingStatus(true)
    getTrackingStatus().then((resp: any) => {
      setTrackingStatuses(resp.tracking_status)
    }).finally(() => {
      setIsFetchingTrackingStatus(false)
    })
  }

  // Fix by adding dependency array
  useEffect(() => {
    fetchTrackingStatus()
  }, []);

  const handleStartTracking = () => {

  }

  const handleStopTracking = (accountId: string) => {
    if (isStoppingTracking) {
      return
    }
    setIsStoppingTracking(true)
    stopTracking(accountId).then(() => {
      fetchTrackingStatus()
    }).finally(() => {
      setIsStoppingTracking(false)
    })
  }

  const getProviderName = (provider: string) => {
    const providers: Record<string, string> = {
      'google': 'Gmail',
      'microsoft': 'Outlook'
    }
    return providers[provider] || provider
  }

  const getStatusText = (status: string) => {
    const statusText: Record<string, string> = {
      "NotStarted": "Not Started",
      "Ongoing": "Ongoing",
      "Stopped": "Stopped",
      "Error": "Error"
    }
    return statusText[status] || status
  }

  const hasOngoingTracking = trackingStatuses.some(status => status.status === "Ongoing");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="px-5 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5"/> : <PanelLeft className="h-5 w-5"/>}
          </Button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-[61px] left-0 bottom-0 w-60 border-r bg-slate-50/75 transition-transform duration-300 z-10 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } hidden md:block`}
      >
        <div className="p-5">
          <nav className="space-y-1">
            <SidebarLink href="#" icon={LayoutDashboard}>
              Overview
            </SidebarLink>
            <SidebarLink href="#" icon={History}>
              History
            </SidebarLink>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen pt-[61px] transition-[padding] duration-300 ${
          isSidebarOpen ? "md:pl-60" : "md:pl-0"
        }`}
      >
        {/* Message Tracking Status Section */}
        <div className="container p-5 mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4 flex-wrap space-y-2">
              <h2 className="text-xl font-semibold">Message Processing Status</h2>
              <div className="flex gap-2">
                <Button
                  onClick={handleStartTracking}
                  disabled={hasOngoingTracking || isFetchingTrackingStatus || isStoppingTracking}
                  className="flex items-center gap-2"
                >
                  {isFetchingTrackingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> :
                    <PlayCircle className="h-4 w-4"/>}
                  Start Processing
                </Button>
                {/*hasOngoingTracking &&*/(
                  <Button
                    onClick={() => {
                      // Stop tracking for all ongoing accounts
                      trackingStatuses
                        .filter(status => status.status === "Ongoing")
                        .forEach(status => handleStopTracking(status.account_id));
                    }}
                    variant="destructive"
                    disabled={isFetchingTrackingStatus}
                    className="flex items-center gap-2"
                  >
                    {isFetchingTrackingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> :
                      <StopCircle className="h-4 w-4"/>}
                    End All Tracking
                  </Button>
                )}
              </div>
            </div>

            {/* Per-Email Tracking Status */}
            <div className="space-y-4">
              {trackingStatuses.map((status) => (
                <div
                  key={status.account_id}
                  className="border rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        status.status === "Ongoing" ? "bg-green-500" :
                          status.status === "Error" ? "bg-red-500" :
                            "bg-gray-500"
                      }`}/>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getProviderName(status.provider)}</span>
                        <p className="text-sm text-gray-500">{status.email}</p>
                      </div>
                    </div>
                    {status.status === "Ongoing" && (
                      <Button
                        onClick={() => handleStopTracking(status.account_id)}
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                        disabled={isFetchingTrackingStatus}
                      >
                        {isFetchingTrackingStatus ? <Loader2 className="h-3 w-3 animate-spin"/> :
                          <StopCircle className="h-3 w-3"/>}
                        Stop
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                    <div>
                      <p className="text-gray-500">Status</p>
                      <p className="font-medium">{getStatusText(status.status)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-medium">
                        {status.updated_at
                          ? new Date(status.updated_at).toLocaleString()
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {trackingStatuses.length === 0 && !isFetchingTrackingStatus && (
                <div className="text-center py-6 text-gray-500">
                  No email accounts connected for tracking
                </div>
              )}

              {isFetchingTrackingStatus && trackingStatuses.length === 0 && (
                <div className="text-center py-6">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400"/>
                  <p className="text-gray-500 mt-2">Loading tracking status...</p>
                </div>
              )}
            </div>
          </div>

          {/* Keep existing EmailSummaryWithStats and EmailSummaryHistory components */}
          <div className="grid gap-6">
            <EmailSummaryWithStats/>
            <EmailSummaryHistory/>
          </div>
        </div>
      </main>
    </div>
  )
}
