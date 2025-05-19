"use client"

import { useState, useEffect, useRef } from "react"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MoreVertical,
  ChevronDown,
  Check,
  Reply,
  Trash,
  Move,
  RefreshCw,
  Loader2,
  Eye
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  getReportById,
  generateReply,
  updateReport,
  ItemUpdateInfo,
  pollMessageProcessingStatus,
  pollBatchActionStatus,
  applyReportActions,
  getReportMessageContent,
  EmailMessageContentResponse
} from "@/lib/requests/client/report"
import { Report, MailReportItem } from "@/lib/modal/report"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"
import { cn } from "@/lib/utils"
import RichContent from "@/components/rich-content";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const SHARED_STYLES = {
  heading: "font-medium text-slate-900 text-sm",
  text: "text-xs text-slate-700",
  subtitle: "text-xs text-slate-500",
  accent: "text-slate-600"
}

type Email = MailReportItem & {
  source: string,
  account_id: string
  email: string
  isGeneratingReply: boolean
  abortController?: AbortController
}

// Email Item Component
function EmailItem(
  {
    email,
    onInput,
    onMove,
    onActionSelect,
    onRegenerateReply,
    onCancelGenerate,
    onViewMessage,
    disabled = false
  }: {
    email: Email
    onInput: (value: string) => void,
    onMove: (email: Email, category: "Essential" | "NonEssential") => void
    onActionSelect: (email: Email, action: "Read" | "Delete" | "Reply" | "Ignore") => void
    onRegenerateReply: (email: Email) => void
    onCancelGenerate: (email: Email) => void
    onViewMessage: (email: Email) => void
    disabled?: boolean
  }) {

  const actionButtonStyleMap: Record<string, string> = {
    "Read": "bg-green-100 text-green-700",
    "Delete": "bg-red-100 text-red-700",
    "Reply": "bg-blue-100 text-blue-700",
    "Ignore": "bg-slate-100 text-slate-700"
  }

  const actionIconMap: Record<string, React.ReactNode> = {
    "Read": <Check className="mr-2 h-4 w-4 text-slate-600" />,
    "Delete": <Trash className="mr-2 h-4 w-4 text-red-500" />,
    "Reply": <Reply className="mr-2 h-4 w-4 text-blue-500" />,
    "Ignore": <MoreVertical className="mr-2 h-4 w-4 text-slate-500" />
  }

  return (
    <div
      className="border border-slate-200/70 rounded-lg p-3 bg-slate-50/60 backdrop-blur-[2px] shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          {email.tags && email.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {email.tags.map((tag) => {
                return (
                  <span
                    key={tag}
                    className={`bg-gray-400 text-white px-2 py-0.5 rounded text-xs font-medium`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          )}
          <h3 className={`${SHARED_STYLES.heading} text-sm mb-0.5`}>{email.subject}</h3>
          <p className={SHARED_STYLES.subtitle}>From: {email.sender}</p>
        </div>
        <div className="flex gap-1 items-center">
          <Eye className="mr-2 h-4 w-4 text-slate-500" onClick={() => onViewMessage(email)} />
          {/*drop down menu for more option*/}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100/70 h-7 w-7 p-0 rounded-full"
                disabled={disabled}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-slate-100/80 shadow-md">
              <DropdownMenuItem
                onClick={() => {
                  onMove(email, email.category == "Essential" ? "NonEssential" : "Essential")
                }}
                className="text-slate-700"
              >
                <Move className="mr-2 h-4 w-4 text-slate-500" />
                Move to {email.category == "Essential" ? "Non-Essential" : "Essential"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/*drop down menu for change action*/}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn("gap-1 h-7 px-2 text-xs", actionButtonStyleMap[email.action])}
                disabled={disabled}
              >
                {actionIconMap[email.action]}
                {email.action}
                {!email.action_result && (
                  <span className="ml-1 text-2xs text-slate-500">(pending)</span>
                )}
                {email.action_result && (
                  <span className="ml-1 text-2xs text-slate-500">({email.action_result})</span>
                )}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-slate-100/80 shadow-md">
              <DropdownMenuItem
                onClick={() => onActionSelect(email, "Read")}
                className={`${email.action === "Read" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <Check className="mr-2 h-4 w-4 text-slate-600" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActionSelect(email, "Reply")}
                className={`${email.action === "Reply" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <Reply className="mr-2 h-4 w-4 text-blue-500" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActionSelect(email, "Delete")}
                className={`${email.action === "Delete" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActionSelect(email, "Ignore")}
                className={`${email.action === "Ignore" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <MoreVertical className="mr-2 h-4 w-4 text-slate-500" />
                Ignore
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className={`${SHARED_STYLES.text} mb-2 leading-normal text-xs`}>{email.summary}</p>

      {/*reply content*/}
      {email.action == "Reply" && (
        <div className="mt-3 pt-3 border-t border-slate-200/70">
          <>
            <Textarea
              placeholder="Type your reply here..."
              className="mb-2 border-slate-200/80 focus:border-slate-300/90 focus:ring-slate-200/50 text-slate-700 rounded-md resize-y min-h-48 max-h-80 text-xs"
              disabled={disabled}
              value={email.reply_message || ""}
              onChange={(e) => onInput(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRegenerateReply(email)}
                className="text-slate-600 border-slate-200/80 hover:bg-slate-50/80 h-7 px-3 text-xs"
                disabled={disabled || email.isGeneratingReply}
              >
                {email.isGeneratingReply ? (
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3 mr-1" />
                )}
                {email.isGeneratingReply ? (
                  "Generating..."
                ) : (
                  "Regenerate"
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCancelGenerate(email)}
                className="text-slate-600 border-slate-200/80 hover:bg-slate-50/80 h-7 px-3 text-xs"
                disabled={disabled || !email.isGeneratingReply}
              >
                Cancel Generate
              </Button>
            </div>
          </>
        </div>
      )}
    </div>
  );
}

interface BatchActionStatus {
  total: number;
  succeed: number;
  failed: number;
  status: "Waiting" | "Ongoing" | "Done";
}

// Client Report Component
export function ReportClient({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [numberOfMessageInProcessing, setNumberOfMessageInProcessing] = useState(0);
  const [batchActionStatus, setBatchActionStatus] = useState<BatchActionStatus | null>(null);
  const [isApplyingActions, setIsApplyingActions] = useState(false);
  const [messageToPresent, setMessageToPresent] = useState<EmailMessageContentResponse | null>(null);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  // Transform report data to emails if report exists
  const [emails, setEmails] = useState<Email[]>([]);
  const replyInputDebounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch report data on the client side
  const fetchReport = () => {
    if (isLoadingReport) {
      return
    }
    setIsLoadingReport(true);
    getReportById(reportId).then((resp) => {
      setReport(resp.data.report);

      // Transform report data to emails
      const allEmails: Email[] = [];

      // Process Gmail messages
      if (resp.data.report?.content.content?.gmail) {
        resp.data.report.content.content.gmail.forEach(account => {
          account.messages.forEach(message => {
            allEmails.push({
              ...message,
              source: "gmail",
              account_id: account.account_id,
              email: account.email,
              isGeneratingReply: false,
            });
          });
        });
      }

      // Process Outlook messages
      if (resp.data.report?.content?.content?.outlook) {
        resp.data.report.content.content.outlook.forEach(account => {
          account.messages.forEach(message => {
            allEmails.push({
              ...message,
              source: "outlook",
              account_id: account.account_id,
              email: account.email,
              isGeneratingReply: false,
            });
          });
        });
      }

      setEmails(allEmails);
    }).finally(() => {
      setIsLoadingReport(false);
    })
  };

  const fetchReportMessageProcessingStatus = () => {
    pollMessageProcessingStatus(reportId).then(async (resp) => {
      if (resp.data) {
        const reader = resp.data.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break
          }
          const data = JSON.parse(value) as Record<string, number>
          let messageRemain = 0
          for (const key in data) {
            messageRemain += data[key]
          }
          setNumberOfMessageInProcessing(messageRemain)
        }
      }
    })
  };

  const fetchBatchActionStatus = () => {
    pollBatchActionStatus(reportId).then(async (resp) => {
      if (resp.data) {
        const reader = resp.data.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            fetchReport()
            break
          }
          const data = JSON.parse(value) as BatchActionStatus
          setBatchActionStatus(data)
        }
      }
    })
  }

  useEffect(() => {
    fetchReport()
    fetchReportMessageProcessingStatus()
    fetchBatchActionStatus()
  }, []);

  // New function to apply all pending actions with real-time status updates
  const applyAllActions = async () => {
    // If messages are still being processed, don't proceed
    if (numberOfMessageInProcessing > 0) {
      return;
    }

    if (isApplyingActions) {
      return
    }

    setIsApplyingActions(true);
    applyReportActions(reportId).then(() => {
      fetchBatchActionStatus() //will unset isApplyingActions in fetchBatchActionStatus
    }).finally(() => {
      setIsApplyingActions(false);
    })
  };

  const essentialEmails = emails.filter(email => email.category == "Essential");
  const nonEssentialEmails = emails.filter(email => email.category == "NonEssential");


  // Determine which email providers are present in the report
  const hasGmail = report?.content?.content?.gmail && report.content.content.gmail.length > 0;
  const hasOutlook = report?.content?.content?.outlook && report.content.content.outlook.length > 0;

  const renderEmailItem = (email: Email) => {
    return (
      <EmailItem
        key={email.id}
        email={email}
        onInput={(value) => {
          setEmails((prev) => {
            return prev.map((e) => {
              if (e.id == email.id) {
                e.reply_message = value
              }
              return e
            })
          })

          if (replyInputDebounceTimeout.current) {
            clearTimeout(replyInputDebounceTimeout.current)
          }

          replyInputDebounceTimeout.current = setTimeout(() => {
            // update report
            const updateInfo: Record<string, ItemUpdateInfo[]> = {}
            updateInfo[email.account_id] = [{
              id: email.id,
              reply_message: value
            }]
            updateReport(reportId, {
              gmail: email.source == "gmail" ? updateInfo : undefined,
              outlook: email.source == "outlook" ? updateInfo : undefined,
            }
            ).catch(() => {
            })
          }, 1000)
        }}
        onMove={(_, category) => {
          setEmails((prev) => {
            return prev.map((e) => {
              if (e.id == email.id) {
                e.category = category
              }
              return e
            })
          })
          // update report
          const updateInfo: Record<string, ItemUpdateInfo[]> = {}
          updateInfo[email.account_id] = [{
            id: email.id,
            category: category,
          }]
          updateReport(reportId, {
            gmail: email.source == "gmail" ? updateInfo : undefined,
            outlook: email.source == "outlook" ? updateInfo : undefined,
          }
          ).catch(() => {
          })
        }}
        onActionSelect={(_, action) => {
          setEmails((prev) => {
            return prev.map((value) => {
              if (value.id == email.id) {
                value.action = action
              }
              return value
            })
          })
          // update report
          const updateInfo: Record<string, ItemUpdateInfo[]> = {}
          updateInfo[email.account_id] = [{
            id: email.id,
            action: action,
          }]
          updateReport(reportId, {
            gmail: email.source == "gmail" ? updateInfo : undefined,
            outlook: email.source == "outlook" ? updateInfo : undefined,
          }
          ).catch(() => {
          })
        }}
        onRegenerateReply={() => {
          // generate reply for the email
          const abortController = new AbortController()
          setEmails((prev) => {
            return prev.map((e) => {
              if (e.id == email.id) {
                e.isGeneratingReply = true
                e.abortController = abortController
              }
              return e
            })
          })

          generateReply(reportId, {
            source: email.source,
            account_id: email.account_id,
            id: email.id
          }, abortController).then(async (resp) => {
            if (resp.data) {
              setEmails((prev) => {
                return prev.map((e) => {
                  if (e.id == email.id) {
                    e.reply_message = ""
                  }
                  return e
                })
              })
              const reader = resp.data.pipeThrough(new TextDecoderStream()).getReader();
              let generatedReply = ""
              while (true) {
                const { value, done } = await reader.read();
                if (done) {
                  // update email state
                  setEmails((prev) => {
                    return prev.map((e) => {
                      if (e.id == email.id) {
                        e.isGeneratingReply = false
                        e.abortController = undefined
                      }
                      return e
                    })
                  })

                  // update report when done
                  const updateInfo: Record<string, ItemUpdateInfo[]> = {}
                  updateInfo[email.account_id] = [{
                    id: email.id,
                    reply_message: email.reply_message
                  }]

                  updateReport(reportId, {
                    gmail: email.source == "gmail" ? updateInfo : undefined,
                    outlook: email.source == "outlook" ? updateInfo : undefined,
                  }
                  ).catch(() => {
                  })
                  break
                }
                generatedReply += value
                setEmails((prev) => {
                  return prev.map((e) => {
                    if (e.id == email.id) {
                      e.reply_message = generatedReply
                    }
                    return e
                  })
                })
              }
            }
          }).catch(() => {
            setEmails((prev) => {
              return prev.map((e) => {
                if (e.id == email.id) {
                  e.isGeneratingReply = false
                  e.abortController = undefined
                }
                return e
              })
            })
          })
        }}
        onCancelGenerate={() => {
          if (email.abortController) {
            email.abortController.abort()
          }
          // update report when necessary
          if (email.reply_message && email.reply_message.length > 0) {
            const updateInfo: Record<string, ItemUpdateInfo[]> = {}
            updateInfo[email.account_id] = [{
              id: email.id,
              reply_message: email.reply_message
            }]
            updateReport(reportId, {
              gmail: email.source == "gmail" ? updateInfo : undefined,
              outlook: email.source == "outlook" ? updateInfo : undefined,
            }
            ).catch(() => {
            })
          }
        }}
        onViewMessage={(email) => {
          setIsLoadingMessage(true);
          getReportMessageContent(reportId, email.source, email.account_id, email.id)
            .then((response) => {
              setMessageToPresent(response.data.message_content);
            })
            .finally(() => {
              setIsLoadingMessage(false);
            });
        }}
        disabled={(batchActionStatus && batchActionStatus.status !== "Done") ||
          isLoadingReport || numberOfMessageInProcessing > 0 || email.action_result == "Success"}
      />
    )
  }

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Report {reportId.substring(0, 8)}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {isLoadingReport ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <Loader2 className="h-7 w-7 animate-spin mx-auto text-slate-400" />
              <p className="text-xs text-slate-500 mt-1">Loading report data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Message Content Dialog */}
            <Dialog open={!!messageToPresent} onOpenChange={(open: boolean) => !open && setMessageToPresent(null)}>
              <DialogContent className="max-w-2xl max-h-[80vh] bg-white">
                <DialogHeader>
                  <DialogTitle>{messageToPresent?.subject}</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(80vh-8rem)]">
                  <div className="mb-4 text-sm text-slate-600">
                    <p><strong>From:</strong> {messageToPresent?.from}</p>
                    <p><strong>To:</strong> {messageToPresent?.to}</p>
                  </div>
                  <div className="border rounded-md p-4 bg-white">
                    {messageToPresent?.mime_type === "text/html" ? (
                      <iframe
                        srcDoc={messageToPresent.body}
                        className="w-full h-[500px] md:h-[800px] border-0"
                        sandbox="allow-same-origin"
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap font-sans">{messageToPresent?.body}</pre>
                    )}
                  </div>

                </div>
              </DialogContent>
            </Dialog>

            {/* Loading Overlay */}
            {isLoadingMessage && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
                    <span className="text-sm text-slate-600">Loading message content...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Message Processing Status */}
            {numberOfMessageInProcessing > 0 && (
              <div className="bg-blue-50/80 p-2 rounded-md border border-blue-200/70 mb-3 backdrop-blur-[2px]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                    <span className="text-xs font-medium text-blue-700">
                      Processing {numberOfMessageInProcessing} messages in queue
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Batch Action Status */}
            {batchActionStatus && batchActionStatus.status !== "Waiting" && (
              <div className="bg-slate-100/80 p-2 rounded-md border border-slate-200/70 mb-3 backdrop-blur-[2px]">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant={batchActionStatus.status === "Done" ? "secondary" : "default"}>
                      {batchActionStatus.status}
                    </Badge>
                    <span className="text-xs text-slate-600">
                      Processing actions: {batchActionStatus.succeed + batchActionStatus.failed} of {batchActionStatus.total} complete
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-xs text-green-600">Success: {batchActionStatus.succeed}</div>
                    <div className="text-xs text-red-600">Failed: {batchActionStatus.failed}</div>
                  </div>
                </div>
                {/* Simple progress bar */}
                <div className="w-full bg-slate-200/70 rounded-full h-1.5 mt-2">
                  <div
                    className="h-1.5 rounded-full bg-blue-500/80"
                    style={{
                      width: `${batchActionStatus.total ?
                        Math.min(100, (batchActionStatus.succeed + batchActionStatus.failed) / batchActionStatus.total * 100) : 0}%`
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Report Header Card */}
            <Card className="bg-slate-200/40 backdrop-blur-[2px]">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0 py-3 px-4">
                <Badge variant="default" size="md">Email Report</Badge>
                <Badge variant="secondary" size="md">
                  {report?.created_at
                    ? new Date(report.created_at).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true
                    })
                    : 'Unknown date'}
                </Badge>
                <div className="ml-auto flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={() => {
                      fetchReport()
                    }}
                    disabled={isLoadingReport}
                    title="Refresh report"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${isLoadingReport ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh</span>
                  </Button>
                  {<div className="flex gap-1">
                    {hasGmail && (
                      <div className="relative h-5 w-5" title="Gmail">
                        <GmailIcon className="h-5 w-5" />
                      </div>
                    )}
                    {hasOutlook && (
                      <div className="relative h-5 w-5" title="Outlook">
                        <OutlookIcon className="h-5 w-5" />
                      </div>
                    )}
                  </div>}
                </div>
              </CardHeader>
              {report && report.content.summary && report.content.summary.length > 0 && (
                <CardContent className="pt-0 pb-3 px-4">
                  <div
                    className="px-3 py-2 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70">
                    <RichContent richTextList={report.content.summary}></RichContent>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Tabs Card */}
            <Card className="bg-slate-200/40 backdrop-blur-[2px] overflow-hidden">
              <Tabs defaultValue="essential">
                <TabsList className="mx-4 mt-3 mb-2 bg-slate-100/80 p-1 rounded-md">
                  <TabsTrigger
                    value="essential"
                    className="rounded-sm py-1 text-xs font-medium data-[state=active]:bg-white/90 data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                  >
                    Essential ({essentialEmails.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="non-essential"
                    className="rounded-sm py-1 text-xs font-medium data-[state=active]:bg-white/90 data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                  >
                    Non-Essential ({nonEssentialEmails.length})
                  </TabsTrigger>
                </TabsList>

                {/*essential items*/}
                <TabsContent value="essential">
                  <CardContent className="px-4 py-3 space-y-3">
                    {essentialEmails.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-xs text-slate-600">No emails in this category.</p>
                      </div>
                    ) : (
                      essentialEmails.map((email) => renderEmailItem(email))
                    )}
                  </CardContent>
                </TabsContent>

                {/*non-essential items*/}
                <TabsContent value="non-essential">
                  <CardContent className="px-4 py-3 space-y-3">
                    {nonEssentialEmails.length === 0 ? (
                      <div className="py-6 text-center">
                        <p className="text-xs text-slate-600">No emails in this category.</p>
                      </div>
                    ) : (
                      nonEssentialEmails.map((email) => renderEmailItem(email))
                    )}
                  </CardContent>
                </TabsContent>

                {/* Apply All Actions button section */}
                <div className="px-4 py-3 border-t border-slate-200/70">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-600">
                      {emails.filter(email => email.action && !email.action_result).length > 0
                        ? `${emails.filter(email => email.action && !email.action_result).length} suggested actions - click Apply to process`
                        : "No actions pending"}
                    </div>
                    <Button
                      size="sm"
                      className="bg-slate-600/90 hover:bg-slate-500/90 text-white h-7 px-4 text-xs"
                      onClick={applyAllActions}
                      disabled={
                        (batchActionStatus && batchActionStatus.status !== "Done") ||
                        isLoadingReport  // Disable when messages are still being processed
                      }
                    >
                      {batchActionStatus && batchActionStatus.status !== "Done" ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Applying Actions...
                        </>
                      ) : numberOfMessageInProcessing > 0 ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Processing messages...
                        </>
                      ) : "Apply All Actions"}
                    </Button>
                  </div>
                </div>
              </Tabs>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
