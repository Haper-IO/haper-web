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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {generatePreviousReport, getReportById, getNewestPreviousReport} from "@/lib/requests/client/report";
import {toast} from "sonner";
import {cn} from "@/lib/utils";

const SupportedProviders = ["google", "microsoft"]

// Poll report status by id
function pollReportStatus(
  reportId: string,
  {
    onFinalized,
    onTimeout,
    onError,
    maxAttempts = 60,
    interval = 2000,
  }: {
    onFinalized: () => void,
    onTimeout: () => void,
    onError: () => void,
    maxAttempts?: number,
    interval?: number,
  }
) {
  let attempts = 0;

  function poll() {
    getReportById(reportId)
      .then((reportResp) => {
        const status = reportResp?.data?.report?.status;
        if (status === "Finalized") {
          onFinalized();
        } else {
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, interval);
          } else {
            onTimeout();
          }
        }
      })
      .catch(() => {
        onError();
      });
  }

  poll();
}

export function StatusCard() {
  // Data source state
  const [trackingStatuses, setTrackingStatuses] = useState<Record<string/*provider name*/, TrackingStatus[]>>({})

  // State for dialog management
  const [startDialogOpen, setStartDialogOpen] = useState(false)
  const [stopDialogOpen, setStopDialogOpen] = useState(false)
  const [addAccountDialogOpen, setAddAccountDialogOpen] = useState(false)
  const [generatePreviousReportDialogOpen, setGeneratePreviousReportDialogOpen] = useState(false);

  // Action states
  const [isFetchingTrackingStatus, setIsFetchingTrackingStatus] = useState(false)
  const [isStoppingTracking, setIsStoppingTracking] = useState(false)
  const [isStartingTracking, setIsStartingTracking] = useState(false)
  const [isStatusExpanded, setIsStatusExpanded] = useState(false); // Will be set based on first-time user logic
  const [selectedProvider, setSelectedProvider] = useState<TrackingStatus | null>(null)
  const [selectedProviderForAdd, setSelectedProviderForAdd] = useState("")
  const [selectedAccountForReport, setSelectedAccountForReport] = useState<TrackingStatus | null>(null);
  const [numberOfEmails, setNumberOfEmails] = useState(10); // number of emails to process for previous report generation
  const [numberError, setNumberError] = useState("");
  const [isGeneratingPreviousReport, setIsGeneratingPreviousReport] = useState(false);
  const [isPollingPrevious, setIsPollingPrevious] = useState(false);
  const [previousReportPollingMsg, setPreviousReportPollingMsg] = useState<string>("");

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

    // On mount, check for newest previous report and poll if needed
    getNewestPreviousReport()
      .then((resp) => {
        const prevReport = resp.data.report;
        if (prevReport && prevReport.status === "Appending" && prevReport.id) {
          setIsPollingPrevious(true);
          setPreviousReportPollingMsg("A previous report is being generated. Please wait...");
          pollReportStatus(prevReport.id, {
            onFinalized: () => {
              setIsPollingPrevious(false);
              setPreviousReportPollingMsg("");
            },
            onTimeout: () => {
              setIsPollingPrevious(false);
              setPreviousReportPollingMsg("Previous report generation timed out. Please try again later.");
            },
            onError: () => {
              setIsPollingPrevious(false);
              setPreviousReportPollingMsg("Failed to poll previous report status.");
            },
            maxAttempts: 60,
            interval: 2000,
          });
        }
      });
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

  const handleOpenGenerateDialog = (account: TrackingStatus) => {
    setSelectedAccountForReport(account);
    setNumberOfEmails(10);
    setNumberError("");
    setGeneratePreviousReportDialogOpen(true);
  };

  const handleGenerateReport = async () => {
    if (!selectedAccountForReport) return;
    if (!numberOfEmails || numberOfEmails < 1 || numberOfEmails > 100) {
      setNumberError("Please enter a number between 1 and 100.");
      return;
    }
    setIsGeneratingPreviousReport(true);
    setNumberError("");
    generatePreviousReport({
      task_info: [{
        account_id: selectedAccountForReport.account_id,
        number_of_email: numberOfEmails,
      }],
    }).then((resp) => {
      const reportId = resp?.data?.report?.id;
      if (reportId) {
        setIsPollingPrevious(true);
        setPreviousReportPollingMsg("A previous report is being generated. Please wait...");
        pollReportStatus(reportId, {
          onFinalized: () => {
            setIsPollingPrevious(false);
            setPreviousReportPollingMsg("");
          },
          onTimeout: () => {
            setIsPollingPrevious(false);
            setPreviousReportPollingMsg("Previous report generation timed out. Please try again later.");
          },
          onError: () => {
            setIsPollingPrevious(false);
            setPreviousReportPollingMsg("Failed to poll previous report status.");
          },
          maxAttempts: 60,
          interval: 2000,
        });
      }
    })
      .finally(() => {
        setIsGeneratingPreviousReport(false);
        setGeneratePreviousReportDialogOpen(false);
      });
  };

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

      {/* Generate Report Dialog */}
      <Dialog open={generatePreviousReportDialogOpen} onOpenChange={setGeneratePreviousReportDialogOpen}>
        <DialogContent className="bg-slate-100">
          <DialogHeader>
            <DialogTitle>Generate Previous Report</DialogTitle>
            <DialogDescription>
              Enter the number of emails to process for <b>{selectedAccountForReport?.email}</b> (1-100):
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Input
              type="number"
              min={1}
              max={100}
              value={numberOfEmails}
              onChange={e => setNumberOfEmails(Number(e.target.value))}
              disabled={isGeneratingPreviousReport}
              className="w-full"
            />
            {numberError && <div className="text-red-500 text-xs mt-1">{numberError}</div>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGeneratePreviousReportDialogOpen(false)}
                    disabled={isGeneratingPreviousReport}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} disabled={isGeneratingPreviousReport}>
              {isGeneratingPreviousReport ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
              Generate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Previous Report Polling Message */}
      {isPollingPrevious && (
        <div className="w-full flex flex-col items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin mb-1 text-gray-400"/>
          <span className="text-xs text-gray-600">{previousReportPollingMsg}</span>
        </div>
      )}

      {/* Message Tracking Status Section */}
      <Card className="pb-2">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-start sm:items-center gap-2 sm:gap-4 space-y-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" size="md" className="bg-slate-50 text-slate-700 border-slate-300 font-medium">Tracking Status</Badge>

            {!isStatusExpanded && runningProviders.length > 0 && (
              <Badge variant="outline" className="text-xs font-medium bg-white/70 border-slate-200 flex items-center gap-1.5 whitespace-nowrap">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                {runningProviders.reduce((total, {count}) => total + count, 0)} active
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            <Button
              id="user-guide-step1"
              variant="ghost"
              size="sm"
              className="h-8 px-2 flex items-center gap-1 text-sm text-slate-700"
              onClick={() => setAddAccountDialogOpen(true)}
              title="Add Account"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Add Account</span>
              <span className="sm:hidden">Add</span>
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
                    className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-2.5 rounded-md ${
                      account.status === "Error" ? "bg-red-50" : "bg-white/60"
                    } border border-slate-200/70`}
                  >
                    <>
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        {account.provider === 'google' ? (
                          <GmailIcon className="h-4 w-4 shrink-0"/>
                        ) : account.provider === 'microsoft' ? (
                          <OutlookIcon className="h-4 w-4 shrink-0"/>
                        ) : null}
                        <span className="text-sm font-medium truncate">{account.email}</span>
                        <Badge
                          variant={account.status === "Ongoing" ? "outline" :
                            account.status === "Error" ? "destructive" : "outline"}
                          size="md"
                          className={cn(
                            "ml-1.5 whitespace-nowrap",
                            account.status === "Ongoing" ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100" : ""
                          )}
                        >
                          {getStatusText(account.status)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 sm:ml-auto">
                        {account.status === "Ongoing" ? (
                          <Button
                            onClick={() => {
                              setSelectedProvider(account);
                              setStopDialogOpen(true);
                            }}
                            variant="outline"
                            size="sm"
                            disabled={isFetchingTrackingStatus || isStoppingTracking}
                            className="h-7 text-xs border-slate-300/80 hover:bg-slate-100/70 text-slate-700 whitespace-nowrap"
                          >
                            {isStoppingTracking ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> :
                              <StopCircle className="h-3 w-3 mr-1"/>}
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
                            className="h-7 text-xs bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-md whitespace-nowrap"
                          >
                            {isStartingTracking ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> :
                              <PlayCircle className="h-3 w-3 mr-1"/>}
                            Start
                          </Button>
                        )}
                        <Button
                          onClick={() => handleOpenGenerateDialog(account)}
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-slate-300/80 hover:bg-slate-100/70 text-slate-700"
                          disabled={isFetchingTrackingStatus || isGeneratingPreviousReport}
                        >
                          {isGeneratingPreviousReport && selectedAccountForReport?.account_id === account.account_id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1"/>
                          ) : null}
                          Generate Report
                        </Button>
                      </div>
                    </>
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
