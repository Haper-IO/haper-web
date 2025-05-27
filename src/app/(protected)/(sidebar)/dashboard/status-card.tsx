"use client"

import {PlayCircle, StopCircle, PlusCircle, ChevronDown, ChevronUp, Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {useState, useEffect} from "react"
import {
  stopMessageTracking,
  listMessageTrackingStatus,
  startMessageTrackingByAccountID,
  TrackingStatus
} from "@/lib/requests/client/message-tracking"
import {oauthRedirect} from "@/app/actions/oauth"
import {GmailIcon, OutlookIcon} from "@/icons/provider-icons"
import {
  AlertDialog, AlertDialogAction,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

const SupportedProviders = ["google", "microsoft"]

export function StatusCard() {
  const [trackingStatuses, setTrackingStatuses] = useState<Record<string/*provider name*/, TrackingStatus[]>>({})
  const [isFetchingTrackingStatus, setIsFetchingTrackingStatus] = useState(false)
  const [isStoppingTracking, setIsStoppingTracking] = useState(false)
  const [isStartingTracking, setIsStartingTracking] = useState(false)
  const [startDialogOpen, setStartDialogOpen] = useState(false)
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<TrackingStatus | null>(null)
  const [isStatusExpanded, setIsStatusExpanded] = useState(false); // Will be set based on first-time user logic
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
    
    // Check if this is the first time user visits the dashboard
    const hasVisitedBefore = localStorage.getItem('haper-dashboard-visited')
    if (!hasVisitedBefore) {
      // First time user - keep tracking status expanded
      setIsStatusExpanded(true)
      localStorage.setItem('haper-dashboard-visited', 'true')
    } else {
      // Returning user - keep it collapsed by default
      setIsStatusExpanded(false)
    }
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

  const runningProviders = getRunningProviders(trackingStatuses);

  return (
    <>
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

      {/* Message Tracking Status Section */}
      <Card className="pb-2">
        <CardHeader className="flex flex-row justify-start items-center gap-4 space-y-0">
          <Badge variant="outline" size="md" className="bg-slate-50 text-slate-700 border-slate-300 font-medium">Tracking Status</Badge>
          
          {!isStatusExpanded && runningProviders.length > 0 && (
            <Badge variant="outline" className="text-xs font-medium bg-white/70 border-slate-200 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              {runningProviders.reduce((total, {count}) => total + count, 0)} active
            </Badge>
          )}
          
          <div className="ml-auto flex items-center gap-2">
            <Button
              id="user-guide-step1"
              variant="ghost"
              size="sm"
              className="h-8 p-2 flex items-center gap-1 text-sm text-slate-700"
              onClick={() => setAddAccountDialogOpen(true)}
              title="Add Account"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Account</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setIsStatusExpanded(!isStatusExpanded)}
            >
              {isStatusExpanded ? (
                <ChevronUp className="h-4 w-4"/>
              ) : (
                <ChevronDown className="h-4 w-4"/>
              )}
            </Button>
          </div>
        </CardHeader>
        {isStatusExpanded && (
          <CardContent id="user-guide-step2">
            <div className="grid grid-cols-1 gap-3">
              {Object.entries(trackingStatuses).flatMap(([provider, accounts]) => {
                // If no accounts for this provider, add a placeholder
                if (accounts.length === 0) {
                  accounts.push({
                    account_id: "",
                    email: "",
                    provider: provider,
                    status: "NotStarted",
                    created_at: null,
                    updated_at: null,
                  });
                }

                // Return each account as a separate item
                return accounts.map((account, idx) => (
                  <div
                    key={`${provider}-${idx}`}
                    className={`flex items-center justify-between gap-3 p-2.5 rounded-md ${
                      account.status === "Error" ? "bg-red-50" : "bg-white/60"
                    } border border-slate-200/70`}
                  >
                    {account.email ? (
                      <>
                        <div className="flex items-center gap-2.5">
                          {account.provider === 'google' ? (
                            <GmailIcon className="h-4 w-4 shrink-0"/>
                          ) : account.provider === 'microsoft' ? (
                            <OutlookIcon className="h-4 w-4 shrink-0"/>
                          ) : null}
                          <span className="text-sm font-medium">{account.email}</span>
                          <Badge 
                            variant={account.status === "Ongoing" ? "outline" : 
                                  account.status === "Error" ? "destructive" : "outline"} 
                            size="md"
                            className={`ml-1.5 ${
                              account.status === "Ongoing" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : ""
                            }`}
                          >
                            {getStatusText(account.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {account.status === "Ongoing" ? (
                            <Button
                              onClick={() => {
                                setSelectedProvider(account);
                                setStopDialogOpen(true);
                              }}
                              variant="outline"
                              size="sm"
                              disabled={isFetchingTrackingStatus || isStoppingTracking}
                              className="h-7 text-xs border-slate-300/80 hover:bg-slate-100/70 text-slate-700"
                            >
                              {isStoppingTracking ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> : <StopCircle className="h-3 w-3 mr-1"/>}
                              Stop
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                setSelectedProvider(account);
                                setStartDialogOpen(true);
                              }}
                              size="sm"
                              disabled={isFetchingTrackingStatus || isStartingTracking}
                              className="h-7 text-xs bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-md"
                            >
                              {isStartingTracking ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> : <PlayCircle className="h-3 w-3 mr-1"/>}
                              Start
                            </Button>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2.5">
                          {account.provider === 'google' ? (
                            <GmailIcon className="h-4 w-4 shrink-0"/>
                          ) : account.provider === 'microsoft' ? (
                            <OutlookIcon className="h-4 w-4 shrink-0"/>
                          ) : null}
                          <span className="text-sm text-gray-500">No account connected</span>
                          <Badge 
                            variant="outline" 
                            size="md"
                            className="ml-1.5 text-gray-500"
                          >
                            Not Connected
                          </Badge>
                        </div>
                        <div>
                          <Button
                            onClick={() => {
                              setSelectedProviderForAdd(account.provider);
                              setAddAccountDialogOpen(true);
                            }}
                            size="sm"
                            className="h-7 text-xs bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-md"
                          >
                            <PlusCircle className="h-3 w-3 mr-1"/>
                            Connect
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ));
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
    </>
  );
}
