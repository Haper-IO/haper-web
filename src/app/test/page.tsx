"use client"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


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
  PlusCircle
} from "lucide-react"
import React, {useState, useEffect} from "react"
import {LatestSummary, LastReport} from "@/app/(protected)/dashboard/dashboard-cards"
import {GmailIcon, OutlookIcon} from "@/icons/provider-icons"
import {
  stopMessageTracking,
  listMessageTrackingStatus,
  startMessageTrackingByAccountID, TrackingStatus
} from "@/lib/requests/client/message-tracking"
import {oauthRedirect} from "@/app/actions/oauth";
import {useSearchParams, useRouter} from "next/navigation"
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
import {Badge} from "@/components/ui/badge";
import {Sidebar} from "@/components/report-sidebar";

const SupportedProviders = ["google", "microsoft"]

const getRunningProviders = (trackingStatuses: Record<string, TrackingStatus[]>) => {
  const running = Object.entries(trackingStatuses).reduce((acc, [provider, statuses]) => {
    const runningCount = statuses.filter(s => s.status === "Ongoing").length;
    if (runningCount > 0) {
      acc.push({provider, count: runningCount});
    }
    return acc;
  }, [] as Array<{ provider: string, count: number }>);

  return running;
};

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
const [addAccountDialogOpen, setAddAccountDialogOpen] = useState(false)
const [selectedProviderForAdd, setSelectedProviderForAdd] = useState("")

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

const handleAddAccount = () => {
  if (selectedProviderForAdd) {
    handleStartTrackingToOAuth(selectedProviderForAdd)
    setAddAccountDialogOpen(false)
  }
}

const runningProviders = getRunningProviders(trackingStatuses);

const handleSelectReport = (id: string) => {
  router.push(`/report/${id}`);
};


export default function Page() {
  return (
    <main className="min-h-screen bg-transparent relative">

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
              Are you sure you want to start tracking messages
              for {selectedProvider ? getProviderName(selectedProvider.provider) : ''}?
              {selectedProvider?.email && ` (${selectedProvider.email})`}
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
              Are you sure you want to stop tracking messages
              for {selectedProvider ? getProviderName(selectedProvider.provider) : ''}?
              {selectedProvider?.email && ` (${selectedProvider.email})`}
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

      {/* Add Account Dialog */}
      <AlertDialog open={addAccountDialogOpen} onOpenChange={setAddAccountDialogOpen}>
        <AlertDialogContent className="bg-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Email Account</AlertDialogTitle>
            <AlertDialogDescription>
              Select the email provider you want to add for message tracking.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 py-4">
            {SupportedProviders.map(provider => (
              <Button
                key={provider}
                variant={selectedProviderForAdd === provider ? "default" : "outline"}
                onClick={() => setSelectedProviderForAdd(provider)}
                className="flex items-center justify-start gap-2 h-10"
              >
                {provider === 'google' ? (
                  <GmailIcon className="h-5 w-5"/>
                ) : provider === 'microsoft' ? (
                  <OutlookIcon className="h-5 w-5"/>
                ) : null}
                {getProviderName(provider)}
              </Button>
            ))}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddAccount} disabled={!selectedProviderForAdd}>
              Connect Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  )
}

