"use client"

import {Button} from "@/components/ui/button"
import {
  PanelLeftClose,
  PanelLeft,
  Loader2,
  PlayCircle,
  StopCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import React, {useState, useEffect} from "react"
import {LatestSummary, LastReport} from "@/app/(protected)/dashboard/dashboard-cards"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"
import {
  stopMessageTracking,
  listMessageTrackingStatus,
  startMessageTrackingByAccountID, TrackingStatus
} from "@/lib/requests/client/message-tracking"
import {oauthRedirect} from "@/app/actions/oauth";
import { useSearchParams, useRouter } from "next/navigation"
import {
  AlertDialog, AlertDialogAction,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/report-sidebar";

// Add custom scrollbar styles
const SCROLLBAR_STYLES = `
  /* For Webkit browsers (Chrome, Safari) */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #e2e8f0;
    border-radius: 20px;
  }

  /* For Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }
`;

const SupportedProviders = ["google", "microsoft"]

const getRunningProviders = (trackingStatuses: Record<string, TrackingStatus[]>) => {
  const running = Object.entries(trackingStatuses).reduce((acc, [provider, statuses]) => {
    const runningCount = statuses.filter(s => s.status === "Ongoing").length;
    if (runningCount > 0) {
      acc.push({ provider, count: runningCount });
    }
    return acc;
  }, [] as Array<{ provider: string, count: number }>);

  return running;
};

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const [trackingStatuses, setTrackingStatuses] = useState<Record<string/*provider name*/, TrackingStatus[]>>({})
  const [isFetchingTrackingStatus, setIsFetchingTrackingStatus] = useState(false)
  const [isStoppingTracking, setIsStoppingTracking] = useState(false)
  const [isStartingTracking, setIsStartingTracking] = useState(false)
  const searchParams = useSearchParams()
  const [alterOpen, setAlterOpen] = useState(searchParams.has("error_msg"))
  const [startDialogOpen, setStartDialogOpen] = useState(false)
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<TrackingStatus | null>(null)
  const [isStatusExpanded, setIsStatusExpanded] = useState(false);

  const fetchTrackingStatus = () => {
    if (isFetchingTrackingStatus) {
      return
    }
    setIsFetchingTrackingStatus(true)
    listMessageTrackingStatus().then((resp) => {
      const trackingStatusMap: Record<string, TrackingStatus[]> = {}
      for (const t of resp.data.tracking_status) {
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

  const handleStartConfirm = () => {
    if (selectedProvider) {
      if (selectedProvider.account_id) {
        handleStartTracking(selectedProvider.account_id)
      } else {
        handleStartTrackingToOAuth(selectedProvider.provider)
      }
      setStartDialogOpen(false)
    }
  }

  const handleStopConfirm = () => {
    if (selectedProvider?.account_id) {
      handleStopTracking(selectedProvider.account_id)
      setStopDialogOpen(false)
    }
  }

  const runningProviders = getRunningProviders(trackingStatuses);

  const handleSelectReport = (id: string) => {
    router.push(`/report/${id}`);
  };

  return (
    <main className="min-h-screen bg-transparent relative">
      {/* Add a style tag for custom scrollbar styling */}
      <style dangerouslySetInnerHTML={{ __html: SCROLLBAR_STYLES }} />

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

      {/* Start Confirmation Dialog */}
      <AlertDialog open={startDialogOpen} onOpenChange={setStartDialogOpen}>
        <AlertDialogContent className="bg-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Start Message Tracking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to start tracking messages for {selectedProvider ? getProviderName(selectedProvider.provider) : ''}?
              This will begin synchronizing your emails.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStartConfirm}>
              Start Tracking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Stop Confirmation Dialog */}
      <AlertDialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
        <AlertDialogContent className="bg-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Stop Message Tracking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to stop tracking messages for {selectedProvider ? getProviderName(selectedProvider.provider) : ''}?
              This will end the synchronization process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStopConfirm}>
              Stop Tracking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
      <div className={`transition-[padding] duration-300 pt-[61px] ${isSidebarOpen ? "md:pl-56" : "md:pl-0"}`}>
        <div className="container p-4 mx-auto">
          <div className="space-y-4">

            {/* Message Tracking Status Section */}
            <Card className="bg-slate-200/40 backdrop-blur-2xl pb-2">
              <CardHeader className="flex flex-row justify-start items-center gap-4 space-y-0">
                <Badge variant="default" size="md">Status</Badge>
                <div className="flex items-center gap-4">
                  {!isStatusExpanded && runningProviders.length > 0 && (
                    <span className="text-sm text-slate-600">
                      {runningProviders.map(({ provider, count }) => (
                        <span key={provider} className="flex items-center gap-2 mr-2">
                          {provider === 'google' ? (
                            <GmailIcon className="h-4 w-4" />
                          ) : provider === 'microsoft' ? (
                            <OutlookIcon className="h-4 w-4" />
                          ) : null}
                          <span className="text-slate-500 font-medium text-sm">Tracking {count} {count === 1 ? "Email" : "Emails"} Now</span>
                        </span>
                      ))}
                    </span>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={fetchTrackingStatus}
                    disabled={isFetchingTrackingStatus}
                    title="Refresh status"
                  >
                    <RefreshCw className={`h-4 w-4 ${isFetchingTrackingStatus ? 'animate-spin' : ''}`}/>
                    <span className="sr-only">Refresh</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsStatusExpanded(!isStatusExpanded)}
                  >
                    {isStatusExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              {isStatusExpanded && (
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {SupportedProviders.map((provider, index) => {
                      // Find provider status
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
                          className={`flex justify-between border rounded-lg p-3 bg-slate-50/70 backdrop-blur-[2px] ${
                            t.status === "Ongoing" ? "border-lime-200" :
                              t.status === "Error" ? "border-red-500" :
                                "border-slate-200/70"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-2">
                                {t.provider === 'google' ? (
                                  <GmailIcon className="h-4 w-4" />
                                ) : t.provider === 'microsoft' ? (
                                  <OutlookIcon className="h-4 w-4" />
                                ) : null}
                                <span className="font-medium text-sm">{getProviderName(t.provider)}</span>
                                <p className="text-xs text-gray-500">{t.email}</p>
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Status</p>
                              <p className="text-sm font-medium">{getStatusText(t.status)}</p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Button
                              onClick={() => {
                                setSelectedProvider(t);
                                setStartDialogOpen(true);
                              }}
                              disabled={t.status == "Ongoing" || isFetchingTrackingStatus || isStoppingTracking}
                              className="flex items-center gap-2 h-8 text-sm bg-slate-700/90 hover:bg-slate-800/90 text-white"
                            >
                              {isFetchingTrackingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                <PlayCircle className="h-4 w-4"/>}
                              Start
                            </Button>
                            <Button
                              onClick={() => {
                                setSelectedProvider(t);
                                setStopDialogOpen(true);
                              }}
                              variant="outline"
                              disabled={t.status != "Ongoing" || isFetchingTrackingStatus || isStoppingTracking}
                              className="flex items-center gap-2 h-8 text-sm border-slate-300/80 hover:bg-slate-100/70 text-slate-700"
                            >
                              {isFetchingTrackingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> :
                                <StopCircle className="h-4 w-4"/>}
                              Stop
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {isFetchingTrackingStatus && (
                    <div className="text-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400"/>
                      <p className="text-sm text-gray-500 mt-2">Loading tracking status...</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            <div className="space-y-4 backdrop-blur-[1px]">
              <LatestSummary />
              <LastReport />
            </div>
          </div>
        </div>
      </div>

      {/* Background texture */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
    </main>
  )
}
