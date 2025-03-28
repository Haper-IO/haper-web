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
import React, {useState, useEffect} from "react"
import {EmailSummaryWithStats, EmailSummaryHistory} from "@/components/dashboard-cards"
import {
  stopMessageTracking,
  listMessageTrackingStatus,
  startMessageTrackingByAccountID
} from "@/lib/requests/client/message-tracking"
import {oauthRedirect} from "@/app/actions/oauth";
import {cn} from "@/lib/utils";
import { useSearchParams } from "next/navigation"
import {
  AlertDialog, AlertDialogAction,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const SupportedProviders = ["google", "microsoft"]

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [trackingStatuses, setTrackingStatuses] = useState<Record<string/*provider name*/, TrackingStatus[]>>({})
  const [isFetchingTrackingStatus, setIsFetchingTrackingStatus] = useState(false)
  const [isStoppingTracking, setIsStoppingTracking] = useState(false)
  const [isStartingTracking, setIsStartingTracking] = useState(false)
  const searchParams = useSearchParams()
  const [alterOpen, setAlterOpen] = useState(searchParams.has("error_msg"))

  const fetchTrackingStatus = () => {
    if (isFetchingTrackingStatus) {
      return
    }
    setIsFetchingTrackingStatus(true)
    listMessageTrackingStatus().then((resp: any) => {
      const trackingStatusMap: Record<string, TrackingStatus[]> = {}
      for (const t of resp.tracking_status) {
        const provider = t.provider
        if (!trackingStatusMap[provider]) {
          trackingStatusMap[provider] = []
        }
        trackingStatusMap[provider].push(t)
      }
      setTrackingStatuses(trackingStatusMap)
    }).finally(() => {
      setIsFetchingTrackingStatus(false)
    })
  }

  // Fix by adding dependency array
  useEffect(() => {
    fetchTrackingStatus()
  }, []);

  const handleStartTrackingToOAuth = (provider: string) => {
    oauthRedirect(provider, "authorize")
  }

  const handleStartTracking = (accountId: string) => {
    if (isStartingTracking) {
      return
    }
    setIsStartingTracking(true)
    startMessageTrackingByAccountID(accountId).then(() => {
      fetchTrackingStatus()
    }).finally(() => {
      setIsStartingTracking(false)
    })
  }

  const handleStopTracking = (accountId: string) => {
    if (isStoppingTracking) {
      return
    }
    setIsStoppingTracking(true)
    stopMessageTracking(accountId).then(() => {
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

  return (
    <div className="min-h-screen bg-slate-50/10">
      {searchParams.get("error_msg") && (
        <AlertDialog open={alterOpen} onOpenChange={setAlterOpen}>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Start Message Tracking Failed</AlertDialogTitle>
              <AlertDialogDescription>
                {searchParams.get("error_msg")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
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
      <section
        className={cn("min-h-screen pt-[61px] transition-[padding] duration-300", isSidebarOpen ? "md:pl-60" : "md:pl-0")}
      >
        {/* Message Tracking Status Section */}
        <div className="container p-5 mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold">Message Processing Status</h2>

            {/* Per-Email Tracking Status */}
            <div className="space-y-4">
              {SupportedProviders.map((provider, index) => {
                // TODO: support show multiple accounts for the same provider
                let t: TrackingStatus
                if (trackingStatuses[provider] && trackingStatuses[provider].length > 0) {
                  t = trackingStatuses[provider][0]
                } else {
                  t = {
                    account_id: "",
                    email: "",
                    provider: provider,
                    status: "NotStarted",
                    created_at: null,
                    updated_at: null,
                  }
                }
                return (
                  <div
                    key={index}
                    className="flex justify-between border rounded-lg p-4 bg-gray-50"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            t.status === "Ongoing" ? "bg-green-500" :
                              t.status === "Error" ? "bg-red-500" :
                                "bg-gray-500"
                          }`}/>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{getProviderName(t.provider)}</span>
                            <p className="text-sm text-gray-500">{t.email}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium">{getStatusText(t.status)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button
                        onClick={() => {
                          if (t.account_id) {
                            handleStartTracking(t.account_id)
                          } else {
                            handleStartTrackingToOAuth(t.provider)
                          }
                        }}
                        disabled={t.status == "Ongoing" || isFetchingTrackingStatus || isStoppingTracking}
                        className="flex items-center gap-2"
                      >
                        {isFetchingTrackingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> :
                          <PlayCircle className="h-4 w-4"/>}
                        Start Synchronization
                      </Button>
                      <Button
                        onClick={() => {
                          handleStopTracking(t.account_id)
                        }}
                        variant="destructive"
                        disabled={t.status != "Ongoing" || isFetchingTrackingStatus || isStoppingTracking}
                        className="flex items-center gap-2"
                      >
                        {isFetchingTrackingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> :
                          <StopCircle className="h-4 w-4"/>}
                        End Tracking
                      </Button>
                    </div>
                  </div>
                )
              })}

              {isFetchingTrackingStatus && (
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
      </section>
    </div>
  )
}
