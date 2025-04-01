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
import { MoreVertical, ChevronDown, Check, Reply, Trash, Move, ChevronDownIcon, RefreshCw, PanelLeft, PanelLeftClose, Loader2, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Report, getReportById } from "@/lib/requests/client/report"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"
import { cn } from "@/lib/utils"

const SHARED_STYLES = {
  heading: "font-medium text-slate-900 text-sm",
  text: "text-xs text-slate-700",
  subtitle: "text-xs text-slate-500",
  accent: "text-slate-600"
}

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
}

// Mock data for previous reports (same as in dashboard)
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
  }
];

// Enhanced Sidebar Component with ChatGPT-style date grouping
function EnhancedSidebar({ isOpen, onSelectReport }: { isOpen: boolean, onSelectReport: (id: string) => void }) {
  return (
    <aside
      className={`fixed top-[61px] left-0 bottom-0 w-60 border-r bg-slate-50/75 transition-transform duration-300 z-10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } hidden md:block`}
    >
      <div className="p-5">
        <div className="space-y-2">
          {previousReports.map((group) => (
            <Collapsible key={group.date} defaultOpen={group.date === "Today"}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded">
                <span>{group.date}</span>
                <ChevronDownIcon size={16} className="text-slate-500" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-2">
                <div className="space-y-1 mt-1">
                  {group.reports.map((report, index) => (
                    <button
                      key={report.id}
                      onClick={() => onSelectReport(report.id)}
                      className={`flex items-start gap-3 w-full p-2 text-sm text-left text-slate-700 hover:bg-slate-100 rounded group ${
                        group.date === "Today" && index === 0 ? "bg-slate-100/70 border-l-2 border-slate-400" : ""
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className={`font-medium truncate ${group.date === "Today" && index === 0 ? "text-slate-900" : "text-slate-700"}`}>{report.title}</p>
                        <p className="text-xs text-slate-500 truncate">{report.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Email Item Component
function EmailItem({
  email,
  isEssential,
  showReplyField,
  onMove,
  onActionSelect,
  setShowReplyField
}: {
  email: Email
  isEssential: boolean
  showReplyField: boolean
  onMove: (emailId: string, newStatus: boolean) => void
  onActionSelect: (emailId: string, action: "Read" | "Delete" | "Reply" | "Ignore" | null) => void
  setShowReplyField: (show: boolean) => void
}) {
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
    <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70 shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`${SHARED_STYLES.heading} text-sm mb-0.5`}>{email.title}</h3>
          <p className={SHARED_STYLES.subtitle}>From: {email.from}</p>
        </div>
        <div className="flex gap-1 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-7 w-7 p-0 rounded-full">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-slate-100 shadow-md">
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
                  email.action ? getActionButtonStyle(email.action) : "text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {getActionIcon(email.action)}
                {email.action || "Actions"} 
                {email.action_result === null && email.action && (
                  <span className="ml-1 text-2xs text-slate-500">(pending)</span>
                )}
                <ChevronDown className="h-3.5 w-3.5 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-slate-100 shadow-md">
              <DropdownMenuItem 
                onClick={() => onActionSelect(email.id, "Read")} 
                className={`${email.action === "Read" ? "bg-slate-50" : ""} text-slate-700`}
              >
                <Check className="mr-2 h-4 w-4 text-slate-600" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onActionSelect(email.id, "Reply")} 
                className={`${email.action === "Reply" ? "bg-slate-50" : ""} text-slate-700`}
              >
                <Reply className="mr-2 h-4 w-4 text-blue-500" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onActionSelect(email.id, "Delete")} 
                className={`${email.action === "Delete" ? "bg-slate-50" : ""} text-slate-700`}
              >
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onActionSelect(email.id, "Ignore")} 
                className={`${email.action === "Ignore" ? "bg-slate-50" : ""} text-slate-700`}
              >
                <MoreVertical className="mr-2 h-4 w-4 text-slate-500" />
                Ignore
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onActionSelect(email.id, null)} 
                className="text-slate-700 border-t border-slate-100 mt-1 pt-1"
              >
                <X className="mr-2 h-4 w-4 text-slate-500" />
                Clear Action
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className={`${SHARED_STYLES.text} mb-2 leading-normal text-xs`}>{email.content}</p>

      {showReplyField && (
        <div className="mt-3 pt-3 border-t border-slate-200">
          <Textarea
            placeholder="Type your reply here..."
            className="mb-2 border-slate-200 focus:border-slate-300 focus:ring-slate-200 text-slate-700 rounded-md resize-none min-h-[80px] text-xs"
            disabled={email.action_result === "Success"}
          />
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplyField(false)}
              className="text-slate-600 border-slate-200 hover:bg-slate-50 h-7 px-3 text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-slate-600 hover:bg-slate-500 text-white h-7 px-3 text-xs"
              onClick={() => onActionSelect(email.id, "Reply")}
            >
              Set as Reply Action
            </Button>
          </div>
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

  // Transform report data to emails if report exists
  const [emails, setEmails] = useState<Email[]>(() => {
    // Use default placeholders initially
    return [
      {
        id: "1",
        message_id: "msg-001",
        thread_id: "thread-001",
        receive_at: new Date().toISOString(),
        title: "Marketing Newsletter",
        from: "newsletter@company.com",
        content: "This week's marketing updates and campaign performance...",
        isEssential: false,
        tags: ["newsletter", "marketing"],
        action: "Delete",  // This would come from the API
        action_result: null // Initially null until applied
      },
      {
        id: "2",
        message_id: "msg-002",
        thread_id: "thread-002",
        receive_at: new Date().toISOString(),
        title: "Security Alert",
        from: "security@company.com",
        content: "Important system update required...",
        isEssential: true,
        tags: ["security", "important"],
        action: "Read",  // This would come from the API
        action_result: null // Initially null until applied
      }
    ];
  });

  // Update emails when report data is loaded
  useEffect(() => {
    if (!report || !report.content) return;

    // Transform report data to emails
    const allEmails: Email[] = [];
    
    // Process Gmail messages
    if (report.content.content.gmail) {
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
            action_result: null // Initially null until applied
          });
        });
      });
    }
    
    // Process Outlook messages
    if (report.content.content.outlook) {
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
            action_result: null // Initially null until applied
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

  // Handle actions on emails (read, reply, delete)
  const handleActionSelect = (emailId: string, action: "Read" | "Delete" | "Reply" | "Ignore" | null) => {
    // If action is reply, show the reply field
    setSelectedEmailId(emailId);
    setShowReplyField(action === "Reply");

    // Update the email with the selected action (pending state)
    setEmails(prev => prev.map(email =>
      email.id === emailId 
        ? { ...email, action, action_result: null } 
        : email
    ));
  };

  // Handle moving emails between essential and non-essential
  const handleMoveEmail = (emailId: string, newStatus: boolean) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isEssential: newStatus } : email
    ));
  };

  // New function to apply all pending actions
  const applyAllActions = () => {
    // Display loading state for all emails with actions
    setEmails(prev => prev.map(email => 
      email.action ? { ...email, action_result: null } : email
    ));

    // Simulate processing time
    setTimeout(() => {
      setEmails(prev => {
        // Create a new array to hold the updated emails
        const updatedEmails = [...prev];
        
        // Process each email with an action
        prev.forEach((email, index) => {
          if (email.action) {
            // 90% chance of success for each action
            const success = Math.random() > 0.1;
            updatedEmails[index] = { 
              ...email, 
              action_result: success ? "Success" : "Error" 
            };
          }
        });
        
        return updatedEmails;
      });

      // After a delay, remove emails that were successfully deleted
      setTimeout(() => {
        setEmails(prev => prev.filter(email => 
          !(email.action === "Delete" && email.action_result === "Success")
        ));
      }, 1000);
    }, 1500);
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
    <div className="min-h-screen bg-slate-50/10">
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
      <EnhancedSidebar isOpen={isSidebarOpen} onSelectReport={handleSelectReport} />

      {/* Main Content */}
      <section
        className={cn("min-h-screen pt-[61px] transition-[padding] duration-300", isSidebarOpen ? "md:pl-60" : "md:pl-0")}
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
              {/* Report Header Card */}
              <Card className="bg-slate-200/50">
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
                    <div className="px-3 py-2 bg-white/80 rounded-md shadow-sm border border-slate-200 max-w-[800px]">
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
              <Card className="bg-slate-200/50 overflow-hidden">
                <Tabs defaultValue="essential">
                  <TabsList className="mx-4 mt-3 mb-2 bg-slate-100 p-1 rounded-md">
                    <TabsTrigger
                      value="essential"
                      className="rounded-sm py-1 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                    >
                      Essential ({essentialEmails.length})
                    </TabsTrigger>
                    <TabsTrigger
                      value="non-essential"
                      className="rounded-sm py-1 text-xs font-medium data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
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
                          />
                        ))
                      )}
                    </CardContent>
                  </TabsContent>
                  
                  {/* Apply All Actions button section */}
                  <div className="px-4 py-3 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-slate-600">
                        {emails.filter(email => email.action && !email.action_result).length > 0 
                          ? `${emails.filter(email => email.action && !email.action_result).length} suggested actions - click Apply to process`
                          : "No actions pending"}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-slate-600 hover:bg-slate-500 text-white h-7 px-4 text-xs"
                        onClick={applyAllActions}
                        disabled={emails.filter(email => email.action && !email.action_result).length === 0}
                      >
                        Apply All Actions
                      </Button>
                    </div>
                  </div>
                </Tabs>
              </Card>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 