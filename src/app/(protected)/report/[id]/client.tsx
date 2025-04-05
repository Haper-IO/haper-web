"use client"

import { useState, useEffect } from "react"
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
import { MoreVertical, ChevronDown, Check, Reply, Trash, Move, RefreshCw, PanelLeft, PanelLeftClose, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Report, getReportById, generateReply, updateReportActions, getBatchActionStatus, BatchUpdateRequest, ItemUpdateInfo, getReportProcessingStatus } from "@/lib/requests/client/report"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"
import { cn } from "@/lib/utils"
import { EnhancedSidebar } from "@/components/report-sidebar"

const SHARED_STYLES = {
  heading: "font-medium text-slate-900 text-sm",
  text: "text-xs text-slate-700",
  subtitle: "text-xs text-slate-500",
  accent: "text-slate-600"
}

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

type Email = {
  id: string
  message_id: string
  thread_id: string
  receive_at: string
  title: string
  from: string
  content: string
  isEssential: boolean
  tags: string[]
  action: "Read" | "Delete" | "Reply" | "Ignore" | null
  action_result: "Success" | "Error" | null
  replyText?: string
  isGeneratingReply?: boolean
}

// Email Item Component
function EmailItem({
  email,
  isEssential,
  showReplyField,
  onMove,
  onActionSelect,
  setShowReplyField,
  onRegenerateReply,
  disabled = false
}: {
  email: Email
  isEssential: boolean
  showReplyField: boolean
  onMove: (emailId: string, newStatus: boolean) => void
  onActionSelect: (emailId: string, action: "Read" | "Delete" | "Reply" | "Ignore" | null) => void
  setShowReplyField: (show: boolean) => void
  onRegenerateReply: (emailId: string) => void
  disabled?: boolean
}) {
  const [replyText, setReplyText] = useState<string>(email.replyText || "");
  const [isGenerating, setIsGenerating] = useState<boolean>(email.isGeneratingReply || false);

  // Update local state when email props change
  useEffect(() => {
    setReplyText(email.replyText || "");
    setIsGenerating(email.isGeneratingReply || false);
  }, [email.replyText, email.isGeneratingReply]);

  // Function to get action button style
  const getActionButtonStyle = (action: "Read" | "Delete" | "Reply" | "Ignore") => {
    switch (action) {
      case "Read":
        return "bg-green-100 text-green-700";
      case "Delete":
        return "bg-red-100 text-red-700";
      case "Reply":
        return "bg-blue-100 text-blue-700";
      case "Ignore":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  // Function to get action icon
  const getActionIcon = (action: "Read" | "Delete" | "Reply" | "Ignore" | null) => {
    switch (action) {
      case "Read":
        return <Check className="mr-2 h-4 w-4 text-slate-600" />;
      case "Delete":
        return <Trash className="mr-2 h-4 w-4 text-red-500" />;
      case "Reply":
        return <Reply className="mr-2 h-4 w-4 text-blue-500" />;
      case "Ignore":
        return <MoreVertical className="mr-2 h-4 w-4 text-slate-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="border border-slate-200/70 rounded-lg p-3 bg-slate-50/60 backdrop-blur-[2px] shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`${SHARED_STYLES.heading} text-sm mb-0.5`}>{email.title}</h3>
          <p className={SHARED_STYLES.subtitle}>From: {email.from}</p>
        </div>
        <div className="flex gap-1 items-center">
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
              <DropdownMenuItem onClick={() => onMove(email.id, !isEssential)} className="text-slate-700">
                <Move className="mr-2 h-4 w-4 text-slate-500" />
                Move to {isEssential ? "Non-Essential" : "Essential"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`gap-1 h-7 px-2 text-xs ${
                  email.action ? getActionButtonStyle(email.action) : "text-slate-600 border-slate-200/80 hover:bg-slate-50/80"
                }`}
                disabled={disabled}
              >
                {getActionIcon(email.action)}
                {email.action || "Actions"}
                {email.action_result === null && email.action && (
                  <span className="ml-1 text-2xs text-slate-500">(pending)</span>
                )}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white/95 backdrop-blur-sm border-slate-100/80 shadow-md">
              <DropdownMenuItem
                onClick={() => onActionSelect(email.id, "Read")}
                className={`${email.action === "Read" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <Check className="mr-2 h-4 w-4 text-slate-600" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActionSelect(email.id, "Reply")}
                className={`${email.action === "Reply" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <Reply className="mr-2 h-4 w-4 text-blue-500" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActionSelect(email.id, "Delete")}
                className={`${email.action === "Delete" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onActionSelect(email.id, "Ignore")}
                className={`${email.action === "Ignore" ? "bg-slate-50/90" : ""} text-slate-700`}
              >
                <MoreVertical className="mr-2 h-4 w-4 text-slate-500" />
                Ignore
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className={`${SHARED_STYLES.text} mb-2 leading-normal text-xs`}>{email.content}</p>

      {showReplyField && (
        <div className="mt-3 pt-3 border-t border-slate-200/70">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-slate-500 mb-2" />
              <p className="text-xs text-slate-500">Generating reply...</p>
            </div>
          ) : (
            <>
              <Textarea
                placeholder="Type your reply here..."
                className="mb-2 border-slate-200/80 focus:border-slate-300/90 focus:ring-slate-200/50 text-slate-700 rounded-md resize-none min-h-[80px] text-xs"
                disabled={email.action_result === "Success"}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRegenerateReply(email.id)}
                  className="text-slate-600 border-slate-200/80 hover:bg-slate-50/80 h-7 px-3 text-xs"
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReplyField(false)}
                  className="text-slate-600 border-slate-200/80 hover:bg-slate-50/80 h-7 px-3 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-slate-600/90 hover:bg-slate-500/90 text-white h-7 px-3 text-xs"
                  onClick={() => onActionSelect(email.id, "Reply")}
                >
                  Set as Reply Action
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Client Report Component
export function ReportClient({ reportId }: { reportId: string }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showReplyField, setShowReplyField] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<{gmail?: number, outlook?: number} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchStatus, setBatchStatus] = useState<{
    total: number;
    succeed: number;
    failed: number;
    status: "Waiting" | "Ongoing" | "Done";
  }>({
    total: 0,
    succeed: 0,
    failed: 0,
    status: "Waiting"
  });

  // Helper function to find message info
  const findMessageInfo = (emailId: string) => {
    if (!report?.content?.content) return null;

    const email = emails.find(e => e.id === emailId);
    if (!email) return null;

    // Try to find the message in Gmail accounts
    let messageInfo = null;
    let source = "";

    // Check Gmail accounts
    if (report.content.content.gmail) {
      for (const account of report.content.content.gmail) {
        const message = account.messages.find(msg => msg.message_id === email.message_id);
        if (message) {
          messageInfo = {
            account_id: account.account_id,
            message_id: message.message_id,
            numeric_id: message.id
          };
          source = "gmail";
          break;
        }
      }
    }

    // Check Outlook accounts if not found in Gmail
    if (!messageInfo && report.content.content.outlook) {
      for (const account of report.content.content.outlook) {
        const message = account.messages.find(msg => msg.message_id === email.message_id);
        if (message) {
          messageInfo = {
            account_id: account.account_id,
            message_id: message.message_id,
            numeric_id: message.id
          };
          source = "outlook";
          break;
        }
      }
    }

    return messageInfo && source
      ? {
          messageInfo,
          source,
          email
        }
      : null;
  };

  // Fetch report data on the client side
  const fetchReport = async () => {
    try {
      setRefreshing(true);
      const { report: fetchedReport } = await getReportById(reportId);
      setReport(fetchedReport);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  // Track message processing status
  useEffect(() => {
    if (!reportId) return;

    let isActive = true;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    const fetchProcessingStatus = async () => {
      try {
        reader = await getReportProcessingStatus(reportId);

        const processStream = async () => {
          if (!isActive || !reader) return;

          try {
            const { done, value } = await reader.read();

            if (done) {
              setIsProcessing(false);
              return;
            }

            // Decode and parse the chunk
            const chunk = new TextDecoder().decode(value);
            try {
              const data = JSON.parse(chunk);

              // Check for specific error code
              if (data.status === 1001) {
                console.error("Error 1001: Message processing status error.", data);
                setIsProcessing(false);
                return;
              }

              setProcessingStatus(data);

              // Check if still processing
              const totalInQueue = (data.gmail || 0) + (data.outlook || 0);
              setIsProcessing(totalInQueue > 0);

              // Continue reading if still processing
              if (isActive) {
                processStream();
              }
            } catch (error) {
              console.error("Error parsing processing status data:", error);
              if (isActive) {
                processStream();
              }
            }
          } catch (error) {
            console.error("Error reading processing status:", error);
            setIsProcessing(false);
          }
        };

        processStream();
      } catch (error) {
        console.error("Error starting processing status polling:", error);
        setIsProcessing(false);
      }
    };

    fetchProcessingStatus();

    // Clean up function
    return () => {
      isActive = false;
      if (reader) {
        reader.cancel().catch(console.error);
      }
    };
  }, [reportId]);

  // Transform report data to emails if report exists
  const [emails, setEmails] = useState<(Email & { replyText?: string })[]>([]);

  // Update emails when report data is loaded
  useEffect(() => {
    if (!report || !report.content) return;

    // Transform report data to emails
    const allEmails: (Email & { replyText?: string })[] = [];

    // Process Gmail messages
    if (report.content?.content?.gmail) {
      report.content.content.gmail.forEach(account => {
        account.messages.forEach(message => {
          allEmails.push({
            id: message.message_id,
            message_id: message.message_id,
            thread_id: message.thread_id || message.message_id,
            receive_at: message.receive_at || new Date().toISOString(),
            title: message.subject,
            from: message.sender,
            content: message.summary,
            isEssential: message.category === "Essential",
            tags: message.tags || [],
            action: message.action as "Read" | "Delete" | "Reply" | "Ignore" || null, // Preserve action from API
            action_result: null, // Initially null until applied
            replyText: ""
          });
        });
      });
    }

    // Process Outlook messages
    if (report.content?.content?.outlook) {
      report.content.content.outlook.forEach(account => {
        account.messages.forEach(message => {
          allEmails.push({
            id: message.message_id,
            message_id: message.message_id,
            thread_id: message.thread_id || message.message_id,
            receive_at: message.receive_at || new Date().toISOString(),
            title: message.subject,
            from: message.sender,
            content: message.summary,
            isEssential: message.category === "Essential",
            tags: message.tags || [],
            action: message.action as "Read" | "Delete" | "Reply" | "Ignore" || null, // Preserve action from API
            action_result: null, // Initially null until applied
            replyText: ""
          });
        });
      });
    }

    setEmails(allEmails);
  }, [report]);

  const handleSelectReport = (id: string) => {
    // Navigate to the new report ID using window.location
    window.location.href = `/report/${id}`;

    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Generate reply for an email
  const generateReplyForEmail = async (emailId: string) => {
    const info = findMessageInfo(emailId);
    if (!info) {
      return;
    }

    // Update email state to show loading
    setEmails(prev => prev.map(e =>
      e.id === emailId ? { ...e, isGeneratingReply: true } : e
    ));

    try {
      // Setup request data with the numeric ID
      const request = {
        source: info.source,
        account_id: info.messageInfo.account_id,
        id: String(info.messageInfo.numeric_id)  // Convert numeric ID to string
      };

      // Call the generateReply API
      const reader = await generateReply(reportId, request);
      let result = "";

      // Process the streaming response
      const processText = async () => {
        const { done, value } = await reader.read();
        if (done) {
          // Update email with generated reply
          setEmails(prev => prev.map(e =>
            e.id === emailId ? { ...e, replyText: result, isGeneratingReply: false } : e
          ));
          return;
        }

        // Decode and append the chunk
        const chunk = new TextDecoder().decode(value);
        result += chunk;

        // Continue reading
        return processText();
      };

      await processText();
    } catch (error) {
      console.error("Error generating reply:", error);
      // Reset loading state on error
      setEmails(prev => prev.map(e =>
        e.id === emailId ? { ...e, isGeneratingReply: false } : e
      ));
    }
  };

  // Handle actions on emails (read, reply, delete)
  const handleActionSelect = async (emailId: string, action: "Read" | "Delete" | "Reply" | "Ignore" | null) => {
    // If action is reply, show the reply field and generate reply
    setSelectedEmailId(emailId);

    if (action === "Reply") {
      setShowReplyField(true);

      // Auto-generate reply if not already present
      const email = emails.find(e => e.id === emailId);
      if (email && (!email.replyText || email.replyText.trim() === "")) {
        generateReplyForEmail(emailId);
      }
    } else {
      setShowReplyField(false);
    }

    // Update the email with the selected action (pending state)
    setEmails(prev => prev.map(email =>
      email.id === emailId
        ? { ...email, action, action_result: null }
        : email
    ));

    // Find the message and account info to update on the server
    const info = findMessageInfo(emailId);
    if (!info) return;

    try {
      // Create the request body with the proper structure
      const updateBody: any = {};

      // Initialize the provider object
      updateBody[info.source] = {};

      // Initialize the account array if it doesn't exist
      updateBody[info.source][info.messageInfo.account_id] = [];

      // Create the update item
      const updateItem: any = {
        id: info.messageInfo.numeric_id
      };

      // Add action if provided
      if (action) {
        updateItem.action = action;
      }

      // Include reply message if action is Reply
      const email = emails.find(e => e.id === emailId);
      if (action === "Reply" && email?.replyText) {
        updateItem.reply_message = email.replyText;
      }

      // Add the update item to the array
      updateBody[info.source][info.messageInfo.account_id].push(updateItem);

      // Call the API with the new structure
      const updateResult = await updateReportActions(updateBody);

      if (!updateResult) {
        console.error("Failed to update action on the server");
      }
    } catch (error) {
      console.error("Error updating email action:", error);
    }
  };

  // Handle regenerating a reply
  const handleRegenerateReply = async (emailId: string) => {
    // First regenerate the reply content
    generateReplyForEmail(emailId);

    // Then update the action to "Reply" on the server if it's not already set
    const info = findMessageInfo(emailId);
    if (!info || info.email.action === "Reply") return;

    try {
      const action = "Reply";

      // Update local state
      setEmails(prev => prev.map(e =>
        e.id === emailId ? { ...e, action, action_result: null } : e
      ));

      // Create the request body with the proper structure
      const updateBody: any = {};

      // Initialize the provider object
      updateBody[info.source] = {};

      // Initialize the account array if it doesn't exist
      updateBody[info.source][info.messageInfo.account_id] = [];

      // Create the update item
      const updateItem: any = {
        id: info.messageInfo.numeric_id,
        action: action
      };

      // Include reply message if replyText is available
      const email = emails.find(e => e.id === emailId);
      if (email?.replyText) {
        updateItem.reply_message = email.replyText;
      }

      // Add the update item to the array
      updateBody[info.source][info.messageInfo.account_id].push(updateItem);

      // Call the API with the new structure
      await updateReportActions(updateBody);
    } catch (error) {
      console.error("Error updating email action to Reply:", error);
    }
  };

  // Handle moving emails between essential and non-essential
  const handleMoveEmail = (emailId: string, newStatus: boolean) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isEssential: newStatus } : email
    ));
  };

  // Poll batch action status
  useEffect(() => {
    let isActive = true;
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null;

    const pollStatus = async () => {
      try {
        // Get the batch action status reader
        reader = await getBatchActionStatus(reportId);

        // Process the stream
        const processStream = async () => {
          if (!isActive || !reader) return;

          try {
            const { done, value } = await reader.read();

            if (done) {
              return;
            }

            // Decode the chunk
            const chunk = new TextDecoder().decode(value);

            try {
              // Parse the JSON data
              const data = JSON.parse(chunk);

              // Check for specific error code
              if (data.status === 1001) {
                console.error("Error 1001: Batch action status error.", data);
                return;
              }

              // Update the status
              setBatchStatus({
                total: data.total || 0,
                succeed: data.succeed || 0,
                failed: data.failed || 0,
                status: data.status || "Waiting"
              });

              // Continue reading
              if (isActive) {
                processStream();
              }
            } catch (error) {
              console.error("Error parsing batch action status:", error);
              if (isActive) {
                processStream();
              }
            }
          } catch (error) {
            console.error("Error reading batch action status:", error);
          }
        };

        // Start processing
        processStream();
      } catch (error) {
        console.error("Error starting batch action status polling:", error);
      }
    };

    // Start polling
    pollStatus();

    // Clean up
    return () => {
      isActive = false;
      if (reader) {
        reader.cancel().catch(console.error);
      }
    };
  }, [reportId]);

  // New function to apply all pending actions with real-time status updates
  const applyAllActions = async () => {
    // If messages are still being processed, don't proceed
    if (isProcessing) {
      return;
    }

    // Display loading state for all emails with actions
    setEmails(prev => prev.map(email =>
      email.action ? { ...email, action_result: null } : email
    ));

    // Create the request body with the proper structure based on BatchUpdateRequest
    const updateBody: BatchUpdateRequest = {};

    // Group emails by provider and account ID
    const groupedEmails: Record<string, Record<string, ItemUpdateInfo[]>> = {};

    // Collect all emails with pending actions
    emails.forEach(email => {
      if (email.action && !email.action_result) {
        // Find message info
        const info = findMessageInfo(email.id);
        if (!info) return;

        // Initialize provider if needed
        if (!groupedEmails[info.source]) {
          groupedEmails[info.source] = {};
        }

        // Initialize account array if needed
        if (!groupedEmails[info.source][info.messageInfo.account_id]) {
          groupedEmails[info.source][info.messageInfo.account_id] = [];
        }

        // Create the update item according to ItemUpdateInfo interface
        const updateItem: ItemUpdateInfo = {
          id: info.messageInfo.numeric_id
        };

        // Add action
        if (email.action) {
          updateItem.action = email.action;
        }

        // Include reply message if action is Reply
        if (email.action === "Reply" && email.replyText) {
          updateItem.reply_message = email.replyText;
        }

        // Add to the grouped structure
        groupedEmails[info.source][info.messageInfo.account_id].push(updateItem);
      }
    });

    // Build the final update body according to BatchUpdateRequest interface
    Object.keys(groupedEmails).forEach(provider => {
      if (provider === 'gmail') {
        updateBody.gmail = updateBody.gmail || {};
        Object.keys(groupedEmails[provider]).forEach(accountId => {
          if (updateBody.gmail) {
            updateBody.gmail[accountId] = groupedEmails[provider][accountId];
          }
        });
      } else if (provider === 'outlook') {
        updateBody.outlook = updateBody.outlook || {};
        Object.keys(groupedEmails[provider]).forEach(accountId => {
          if (updateBody.outlook) {
            updateBody.outlook[accountId] = groupedEmails[provider][accountId];
          }
        });
      }
    });

    // Check if there are any updates to send
    if (Object.keys(updateBody).length === 0) {
      console.log("No pending actions to apply");
      return;
    }

    try {
      // First make sure we're not processing messages
      if (isProcessing) {
        return;
      }

      // Update the actions using the correct API from report.ts
      const updateResult = await updateReportActions(updateBody);

      if (!updateResult) {
        return;
      }

      // Status will be updated automatically by the batch action polling effect
    } catch (error) {
      console.error("Error applying batch actions:", error);
    }
  };

  const essentialEmails = emails.filter(email => email.isEssential);
  const nonEssentialEmails = emails.filter(email => !email.isEssential);

  // Format the report creation date if it exists
  const formattedDate = report?.created_at
    ? new Date(report.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    : 'Unknown date';

  // Determine which email providers are present in the report
  const hasGmail = report?.content?.content?.gmail && report.content.content.gmail.length > 0;
  const hasOutlook = report?.content?.content?.outlook && report.content.content.outlook.length > 0;

  // Render appropriate email provider icons
  const renderEmailProviderIcons = () => {
    return (
      <div className="flex gap-1">
        {hasGmail && (
          <div className="relative h-5 w-5" title="Gmail">
            <GmailIcon className="h-5 w-5"/>
          </div>
        )}
        {hasOutlook && (
          <div className="relative h-5 w-5" title="Outlook">
            <OutlookIcon className="h-5 w-5"/>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent">
      {/* Add a style tag for custom scrollbar styling */}
      <style dangerouslySetInnerHTML={{ __html: SCROLLBAR_STYLES }} />

      {/* Header */}
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

        </div>
      </header>

      {/* Sidebar Navigation */}
      <EnhancedSidebar
        isOpen={isSidebarOpen}
        onSelectReport={handleSelectReport}
        currentReportId={reportId}
        onToggleSidebar={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <section
        className={cn("min-h-screen pt-[61px] transition-[padding] duration-300", isSidebarOpen ? "md:pl-56" : "md:pl-0")}
      >
        <div className="container p-3 mx-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-7 w-7 animate-spin mx-auto text-slate-400"/>
                <p className="text-xs text-slate-500 mt-1">Loading report data...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Message Processing Status */}
              {isProcessing && processingStatus && (
                <div className="bg-blue-50/80 p-2 rounded-md border border-blue-200/70 mb-3 backdrop-blur-[2px]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                      <span className="text-xs font-medium text-blue-700">
                        Processing messages in queue
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {processingStatus.gmail !== undefined && processingStatus.gmail > 0 && (
                        <div className="flex items-center gap-1.5">
                          <GmailIcon className="h-3.5 w-3.5" />
                          <span className="text-xs text-blue-700">{processingStatus.gmail} messages</span>
                        </div>
                      )}
                      {processingStatus.outlook !== undefined && processingStatus.outlook > 0 && (
                        <div className="flex items-center gap-1.5">
                          <OutlookIcon className="h-3.5 w-3.5" />
                          <span className="text-xs text-blue-700">{processingStatus.outlook} messages</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Batch Action Status */}
              {batchStatus.status !== "Waiting" && (
                <div className="bg-slate-100/80 p-2 rounded-md border border-slate-200/70 mb-3 backdrop-blur-[2px]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant={batchStatus.status === "Done" ? "secondary" : "default"}>
                        {batchStatus.status}
                      </Badge>
                      <span className="text-xs text-slate-600">
                        Processing actions: {batchStatus.succeed + batchStatus.failed} of {batchStatus.total} complete
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <div className="text-xs text-green-600">Success: {batchStatus.succeed}</div>
                      <div className="text-xs text-red-600">Failed: {batchStatus.failed}</div>
                    </div>
                  </div>
                  {/* Simple progress bar */}
                  <div className="w-full bg-slate-200/70 rounded-full h-1.5 mt-2">
                    <div
                      className="h-1.5 rounded-full bg-blue-500/80"
                      style={{
                        width: `${batchStatus.total ?
                          Math.min(100, (batchStatus.succeed + batchStatus.failed) / batchStatus.total * 100) : 0}%`
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
                    {formattedDate}
                  </Badge>
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={fetchReport}
                      disabled={refreshing}
                      title="Refresh report"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`}/>
                      <span className="sr-only">Refresh</span>
                    </Button>
                    {renderEmailProviderIcons()}
                  </div>
                </CardHeader>
                {report && report.content && report.content.summary && report.content.summary.length > 0 && (
                  <CardContent className="pt-0 pb-3 px-4">
                    <div className="px-3 py-2 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70 max-w-[800px]">
                      <p className="text-xs text-slate-800 leading-normal">
                        {report.content.summary
                          .filter(item => item.type === "text" && item.text?.content)
                          .map(item => item.text?.content).join(" ")}
                      </p>
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

                  <TabsContent value="essential">
                    <CardContent className="px-4 py-3 space-y-3">
                      {essentialEmails.length === 0 ? (
                        <div className="py-6 text-center">
                          <p className="text-xs text-slate-600">No emails in this category.</p>
                        </div>
                      ) : (
                        essentialEmails.map((email) => (
                          <EmailItem
                            key={email.id}
                            email={email}
                            isEssential={true}
                            showReplyField={showReplyField && selectedEmailId === email.id}
                            onMove={handleMoveEmail}
                            onActionSelect={handleActionSelect}
                            setShowReplyField={setShowReplyField}
                            onRegenerateReply={handleRegenerateReply}
                            disabled={batchStatus.status !== "Waiting" || isProcessing}
                          />
                        ))
                      )}
                    </CardContent>
                  </TabsContent>

                  <TabsContent value="non-essential">
                    <CardContent className="px-4 py-3 space-y-3">
                      {nonEssentialEmails.length === 0 ? (
                        <div className="py-6 text-center">
                          <p className="text-xs text-slate-600">No emails in this category.</p>
                        </div>
                      ) : (
                        nonEssentialEmails.map((email) => (
                          <EmailItem
                            key={email.id}
                            email={email}
                            isEssential={false}
                            showReplyField={showReplyField && selectedEmailId === email.id}
                            onMove={handleMoveEmail}
                            onActionSelect={handleActionSelect}
                            setShowReplyField={setShowReplyField}
                            onRegenerateReply={handleRegenerateReply}
                            disabled={batchStatus.status !== "Waiting" || isProcessing}
                          />
                        ))
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
                          emails.filter(email => email.action && !email.action_result).length === 0 ||
                          batchStatus.status !== "Waiting" ||
                          isProcessing  // Disable when messages are still being processed
                        }
                      >
                        {batchStatus.status !== "Waiting" ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Processing...
                          </>
                        ) : isProcessing ? (
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
      </section>

      {/* Background texture */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
    </div>
  );
}
