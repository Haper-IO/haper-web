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
  RefreshCw,
  ChevronDown,
  ChevronUp,
  User,
} from "lucide-react"
import Link from "next/link"
import React, {useState, useEffect} from "react"
import {LatestSummary, LastReport} from "@/components/dashboard-cards"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"
import {
  stopMessageTracking,
  listMessageTrackingStatus,
  startMessageTrackingByAccountID, TrackingStatus
} from "@/lib/requests/client/message-tracking"
import {oauthRedirect} from "@/app/actions/oauth";
import {cn} from "@/lib/utils";
import { useSearchParams } from "next/navigation"
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
import { useUserInfo } from "@/hooks/useUserInfo";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getReportHistory } from "@/lib/requests/client/report";
import Image from "next/image";

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

// Create a type for categorized reports
type ReportGroup = {
  date: string;
  reports: {
    id: string;
    title: string;
    time: string;
    created_at: string;
    status?: "processing" | "completed" | "error";
  }[];
};

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
  active?: boolean
}

const SidebarLink = ({href, icon: Icon, children, active = false}: SidebarLinkProps) => (
  <Link
    href={href}
    className={`flex items-center gap-2 px-2 py-1.5 text-xs ${active ? 'text-slate-900 bg-slate-100 font-medium' : 'text-slate-600'} hover:bg-slate-100 rounded-sm transition-colors`}
  >
    <Icon className={`h-3.5 w-3.5 ${active ? 'text-slate-900' : 'text-slate-500'}`}/>
    <span>{children}</span>
  </Link>
)

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

// Enhanced Sidebar Component with report history and user profile
function EnhancedSidebar({ isOpen }: { isOpen: boolean }) {
  const [reportGroups, setReportGroups] = useState<ReportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, loading: userLoading } = useUserInfo();

  useEffect(() => {
    const fetchReportHistory = async () => {
      setLoading(true);
      // Fetch a reasonable number of reports
      getReportHistory(1, 20).then((resp) => {
        if (resp.data.reports && resp.data.reports.length > 0) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);

          // Group reports by date categories
          const todayReports: ReportGroup["reports"] = [];
          const yesterdayReports: ReportGroup["reports"] = [];
          const weekReports: ReportGroup["reports"] = [];

          resp.data.reports.forEach(report => {
            const reportDate = new Date(report.created_at);
            reportDate.setHours(0, 0, 0, 0);

            const formattedTime = new Date(report.created_at).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            });

            // Generate a title from the summary or use a default
            let title = `Report ${report.id.slice(0, 6)}`;
            if (report.content && report.content.summary && report.content.summary.length > 0) {
              const summaryText = report.content.summary
                .filter(item => item.type === "text" && item.text?.content)
                .map(item => item.text?.content)
                .join(" ");

              if (summaryText) {
                title = summaryText.slice(0, 24) + (summaryText.length > 24 ? "..." : "");
              }
            }

            // Simulate a status for demo purposes
            const status = Math.random() > 0.8 ? "processing" : "completed";

            const reportItem = {
              id: report.id,
              title: title,
              time: formattedTime,
              created_at: report.created_at,
              status: status as "processing" | "completed" | "error"
            };

            // Add to appropriate category
            if (reportDate.getTime() === today.getTime()) {
              todayReports.push(reportItem);
            } else if (reportDate.getTime() === yesterday.getTime()) {
              yesterdayReports.push(reportItem);
            } else if (reportDate.getTime() >= weekAgo.getTime()) {
              weekReports.push(reportItem);
            }
          });

          // Sort reports by time (newest first)
          const sortByDate = (a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

          todayReports.sort(sortByDate);
          yesterdayReports.sort(sortByDate);
          weekReports.sort(sortByDate);

          // Create final groups
          const groups: ReportGroup[] = [];

          if (todayReports.length > 0) {
            groups.push({ date: "Today", reports: todayReports });
          }

          if (yesterdayReports.length > 0) {
            groups.push({ date: "Yesterday", reports: yesterdayReports });
          }

          if (weekReports.length > 0) {
            groups.push({ date: "Previous 7 Days", reports: weekReports });
          }

          setReportGroups(groups);
        }
      }).finally(() => {
        setLoading(false);
      })
    };

    fetchReportHistory();
  }, []);

  return (
    <aside
      className={`fixed top-[61px] left-0 bottom-0 w-56 border-r bg-slate-50/80 transition-transform duration-300 z-10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hidden md:block`}
    >
      <div className="flex flex-col h-full">
        {/* Menu section */}
        <div className="px-2 py-3 border-b border-slate-200">
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-slate-400 uppercase">Menu</p>
          </div>
          <nav className="space-y-1">
            <SidebarLink href="#" icon={LayoutDashboard} active={true}>
              Overview
            </SidebarLink>
            <SidebarLink href="#" icon={History}>
              History
            </SidebarLink>
          </nav>
        </div>

        {/* Reports section */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent px-2 py-3">
          <div className="mb-2 px-2">
            <p className="text-xs font-medium text-slate-400 uppercase">Recent Reports</p>
          </div>
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          ) : reportGroups.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-2">
              No reports found
            </div>
          ) : (
            <div className="space-y-1">
              {reportGroups.map((group) => (
                <Collapsible key={group.date} defaultOpen={group.date === "Today"}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-sm">
                    <span>{group.date}</span>
                    <ChevronDown size={14} className="text-slate-500" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-1">
                    <div className="mt-0.5">
                      {group.reports.map((report) => (
                        <Link
                          key={report.id}
                          href={`/report/${report.id}`}
                          className="flex items-start w-full px-2 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-100 rounded-sm"
                        >
                          <div className="w-full overflow-hidden pr-1">
                            <div className="flex items-center gap-1">
                              <p className="font-medium truncate text-slate-700">
                                {report.title}
                              </p>
                              {report.status === "processing" && (
                                <span className="flex-shrink-0 inline-flex items-center px-1 py-0.5 rounded-sm text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                  <Loader2 className="animate-spin mr-1 h-2 w-2" />
                                  processing
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">{report.time}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>

        {/* User profile button */}
        <div className="mt-auto border-t border-slate-200 px-2 py-2">
          <button
            onClick={() => window.location.href = '/userprofile'}
            className="w-full flex items-center gap-2 px-2 py-2 hover:bg-slate-200/70 transition-colors rounded-md"
          >
            <div className="relative flex-shrink-0 h-8 w-8 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden border border-slate-200">
              {userLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              ) : userInfo?.image ? (
                <Image src={userInfo.image} alt={userInfo.name || 'User'} className="object-cover" fill/>
              ) : (
                <User className="h-4 w-4 text-slate-600" />
              )}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-medium text-slate-800 truncate">
                {userLoading ? 'Loading...' : userInfo?.name || 'User Profile'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {userLoading ? '' : userInfo?.email || 'View profile'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [trackingStatuses, setTrackingStatuses] = useState<Record<string/*provider name*/, TrackingStatus[]>>({})
  const [isFetchingTrackingStatus, setIsFetchingTrackingStatus] = useState(false)
  const [isStoppingTracking, setIsStoppingTracking] = useState(false)
  const [isStartingTracking, setIsStartingTracking] = useState(false)
  const searchParams = useSearchParams()
  const [alterOpen, setAlterOpen] = useState(searchParams.has("error_msg"))
  const [startDialogOpen, setStartDialogOpen] = useState(false)
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<TrackingStatus | null>(null)
  const [isStatusExpanded, setIsStatusExpanded] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-50/10">
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
      <EnhancedSidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <section
        className={cn("min-h-screen pt-[61px] transition-[padding] duration-300", isSidebarOpen ? "md:pl-56" : "md:pl-0")}
      >
        {/* Message Tracking Status Section */}
        <div className="container p-5 mx-auto">
          <Card className="bg-slate-200/50 mb-6">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 ">
              <Badge variant="default" size="md">Status</Badge>
              <div className="flex items-center gap-2">
                {!isStatusExpanded && runningProviders.length > 0 && (
                  <span className="text-sm text-slate-600">
                    {runningProviders.map(({ provider, count }) => (
                      <span key={provider} className="flex items-center gap-1 mr-2">
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
                        className={`flex justify-between border rounded-lg p-3 bg-slate-50/70 ${
                          t.status === "Ongoing" ? "border-lime-200" :
                            t.status === "Error" ? "border-red-500" :
                              "border-slate-200"
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
                              setSelectedProvider(t)
                              setStartDialogOpen(true)
                            }}
                            disabled={t.status == "Ongoing" || isFetchingTrackingStatus || isStoppingTracking}
                            className="flex items-center gap-2 h-8 text-sm bg-slate-700 hover:bg-slate-800 text-white"
                          >
                            {isFetchingTrackingStatus ? <Loader2 className="h-4 w-4 animate-spin"/> :
                              <PlayCircle className="h-4 w-4"/>}
                            Start
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedProvider(t)
                              setStopDialogOpen(true)
                            }}
                            variant="outline"
                            disabled={t.status != "Ongoing" || isFetchingTrackingStatus || isStoppingTracking}
                            className="flex items-center gap-2 h-8 text-sm border-slate-300 hover:bg-slate-100 text-slate-700"
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

          {/* Keep existing EmailSummaryWithStats and EmailSummaryHistory components */}
          <div className="grid gap-6">
            <LatestSummary/>
            <LastReport/>
          </div>
        </div>
      </section>
    </div>
  )
}
