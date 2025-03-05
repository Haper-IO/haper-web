// app/report/page.tsx
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
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, ChevronDown, Check, Reply, Trash, Move } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

import { TabsDemo } from "@/components/tabs-demo";

const SHARED_STYLES = {
  heading: "font-medium text-[#0f172a]",
  text: "text-sm text-[#475569]",
  subtitle: "text-xs text-[#64748b]",
  accent: "text-lime-600"
}

type Email = {
  id: string
  title: string
  from: string
  content: string
  isEssential: boolean
}

export default function ReportPage() {
  const [showReplyField, setShowReplyField] = useState(false)
  const [selectedAction, setSelectedAction] = useState("")
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
  ])

  const handleMoveEmail = (emailId: string, newStatus: boolean) => {
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isEssential: newStatus } : email
    ))
  }

  const essentialEmails = emails.filter(email => email.isEssential)
  const nonEssentialEmails = emails.filter(email => !email.isEssential)

  return (
    <div className="space-y-8">
      <main className="min-h-screen mx-auto">
        <div className="container p-5 mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#0f172a]">Email Report</h1>
            <Badge variant="secondary">Last 7 Days</Badge>
          </div>

          <Tabs defaultValue="essential" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <TabsList className="grid grid-cols-2 w-[300px]">
                <TabsTrigger value="essential">
                  Essential ({essentialEmails.length})
                </TabsTrigger>
                <TabsTrigger value="non-essential">
                  Non-Essential ({nonEssentialEmails.length})
                </TabsTrigger>
              </TabsList>
              <Badge variant="outline" className="h-8 px-3">
                {emails.length} Total Items
              </Badge>
            </div>

            <TabsContent value="essential">
              <EmailSection
                emails={essentialEmails}
                onMove={handleMoveEmail}
                isEssential={true}
                showReplyField={showReplyField}
                onActionSelect={(action) => {
                  setSelectedAction(action)
                  setShowReplyField(action === "reply")
                }}
              />
            </TabsContent>

            <TabsContent value="non-essential">
              <EmailSection
                emails={nonEssentialEmails}
                onMove={handleMoveEmail}
                isEssential={false}
                showReplyField={showReplyField}
                onActionSelect={(action) => {
                  setSelectedAction(action)
                  setShowReplyField(action === "reply")
                }}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>





  )
}

function EmailSection({
                        emails,
                        onMove,
                        isEssential,
                        showReplyField,
                        onActionSelect
                      }: {
  emails: Email[]
  onMove: (emailId: string, newStatus: boolean) => void
  isEssential: boolean
  showReplyField: boolean
  onActionSelect: (action: string) => void
}) {
  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Filter <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Unread</DropdownMenuItem>
              <DropdownMenuItem>Flagged</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button variant="ghost" size="sm" className={SHARED_STYLES.accent}>
          Show All
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {emails.map((email) => (
          <div key={email.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className={SHARED_STYLES.heading}>{email.title}</h3>
                <p className={SHARED_STYLES.subtitle}>From: {email.from}</p>
              </div>
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onMove(email.id, !isEssential)}>
                      <Move className="mr-2 h-4 w-4" />
                      Move to {isEssential ? "Non-Essential" : "Essential"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1">
                      Mark as Read <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => onActionSelect("read")}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark as Read
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onActionSelect("reply")}>
                      <Reply className="mr-2 h-4 w-4" />
                      Reply Generated
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onActionSelect("delete")}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className={`${SHARED_STYLES.text} mb-4`}>{email.content}</p>

            {showReplyField && (
              <div className="mt-4">
                <Textarea placeholder="Type your reply here..." className="mb-2" />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button size="sm">Send Reply</Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>

    </Card>
  )
}
