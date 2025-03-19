"use client"

import { useState } from "react"
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
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ChevronDown, Check, Reply, Trash, Move, ArrowLeft, ChevronDownIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { SidebarButton } from "@/components/sidebar-button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const SHARED_STYLES = {
  heading: "font-medium text-gray-900",
  text: "text-sm text-gray-700",
  subtitle: "text-xs text-gray-500",
  accent: "text-lime-600"
}

type Email = {
  id: string
  title: string
  from: string
  content: string
  isEssential: boolean
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
      className={`fixed top-0 left-0 z-20 h-full bg-white/70 backdrop-blur-sm border-r border-gray-200 pt-[61px] transition-all duration-300 w-60 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden"
      }`}
    >
      <div className="p-4">
        <div className="space-y-2">
          {previousReports.map((group) => (
            <Collapsible key={group.date} defaultOpen={group.date === "Today"}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
                <span>{group.date}</span>
                <ChevronDownIcon size={16} className="text-gray-500" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-2">
                <div className="space-y-1 mt-1">
                  {group.reports.map((report, index) => (
                    <button
                      key={report.id}
                      onClick={() => onSelectReport(report.id)}
                      className={`flex items-start gap-3 w-full p-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded group ${
                        group.date === "Today" && index === 0 ? "bg-gray-100/70 border-l-2 border-lime-600" : ""
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className={`font-medium truncate ${group.date === "Today" && index === 0 ? "text-gray-900" : "text-gray-700"}`}>{report.title}</p>
                        <p className="text-xs text-gray-500 truncate">{report.time}</p>
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

export default function ReportPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showReplyField, setShowReplyField] = useState(false);
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const [emails, setEmails] = useState<Email[]>([
    {
      id: "1",
      title: "Marketing Newsletter",
      from: "newsletter@company.com",
      content: "This week's marketing updates and campaign performance...",
      isEssential: false
    },
    {
      id: "2",
      title: "Security Alert",
      from: "security@company.com",
      content: "Important system update required...",
      isEssential: true
    }
  ]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSelectReport = (id: string) => {
    setSelectedReportId(id);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Handle moving emails between essential and non-essential
  const handleMoveEmail = (emailId: string, newStatus: boolean) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isEssential: newStatus } : email
    ));
  };

  // Handle actions on emails (read, reply, delete)
  const handleActionSelect = (emailId: string, action: string) => {
    setSelectedEmailId(emailId);
    setShowReplyField(action === "reply");

    // Handle other actions like delete
    if (action === "delete") {
      setEmails(prev => prev.filter(email => email.id !== emailId));
    }
  };

  const essentialEmails = emails.filter(email => email.isEssential);
  const nonEssentialEmails = emails.filter(email => !email.isEssential);

  //TODO: Replace with actual last update period
  const lastUpdatePeriod: string = "0 mins ago";

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white/85 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center">
              <SidebarButton isOpen={isSidebarOpen} toggle={toggleSidebar} />
              <Button
                variant="ghost"
                size="sm"
                className="mr-2 text-gray-700 hover:bg-gray-100"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-lg font-semibold text-gray-900">Email Report</h1>
              <Badge variant="secondary" className="ml-3 bg-gray-100 text-gray-600 hover:bg-gray-100">{lastUpdatePeriod}</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <EnhancedSidebar isOpen={isSidebarOpen} onSelectReport={handleSelectReport} />

      {/* Main Content */}
      <main
        className={`min-h-screen pt-16 transition-all duration-300 ${
          isSidebarOpen ? "md:ml-60" : "md:ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="border-gray-200 shadow-sm overflow-hidden">
            <Tabs defaultValue="essential">
              <TabsList className="mx-6 mt-6 mb-4 bg-gray-100 p-1 rounded-md">
                <TabsTrigger
                  value="essential"
                  className="rounded-sm py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-lime-600 data-[state=active]:shadow-sm"
                >
                  Essential
                </TabsTrigger>
                <TabsTrigger
                  value="non-essential"
                  className="rounded-sm py-1.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-lime-600 data-[state=active]:shadow-sm"
                >
                  Non-Essential
                </TabsTrigger>
              </TabsList>

              <TabsContent value="essential">
                <CardContent className="px-6 pb-6 space-y-5">
                  {essentialEmails.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className={SHARED_STYLES.text}>No emails in this category.</p>
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
                <CardContent className="px-6 pb-6 space-y-5">
                  {nonEssentialEmails.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className={SHARED_STYLES.text}>No emails in this category.</p>
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
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
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
  onActionSelect: (emailId: string, action: string) => void
  setShowReplyField: (show: boolean) => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className={`${SHARED_STYLES.heading} text-base mb-1`}>{email.title}</h3>
          <p className={SHARED_STYLES.subtitle}>From: {email.from}</p>
        </div>
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 h-8 w-8 p-0 rounded-full">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-100 shadow-md">
              <DropdownMenuItem onClick={() => onMove(email.id, !isEssential)} className="text-gray-700">
                <Move className="mr-2 h-4 w-4 text-gray-500" />
                Move to {isEssential ? "Non-Essential" : "Essential"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-gray-600 border-gray-200 hover:bg-gray-50 h-8">
                Actions <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border-gray-100 shadow-md">
              <DropdownMenuItem onClick={() => onActionSelect(email.id, "read")} className="text-gray-700">
                <Check className="mr-2 h-4 w-4 text-lime-600" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActionSelect(email.id, "reply")} className="text-gray-700">
                <Reply className="mr-2 h-4 w-4 text-blue-500" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onActionSelect(email.id, "delete")} className="text-gray-700">
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <p className={`${SHARED_STYLES.text} mb-4 leading-relaxed`}>{email.content}</p>

      {showReplyField && (
        <div className="mt-5 pt-4 border-t border-gray-200">
          <Textarea
            placeholder="Type your reply here..."
            className="mb-3 border-gray-200 focus:border-lime-300 focus:ring-lime-200 text-gray-700 rounded-md resize-none min-h-[100px]"
          />
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplyField(false)}
              className="text-gray-600 border-gray-200 hover:bg-gray-50 h-9 px-4"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-lime-600 hover:bg-lime-500 text-white h-9 px-4"
            >
              Send Reply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
