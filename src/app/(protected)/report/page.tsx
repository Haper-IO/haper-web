// app/report/page.tsx
"use client"

import { useState } from "react"
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

const SHARED_STYLES = {
  heading: "font-medium text-[#0f172a]",
  text: "text-sm text-[#475569]",
  subtitle: "text-xs text-[#64748b]",
  accent: "text-lime-600"
}

export default function ReportPage() {
  const [showReplyField, setShowReplyField] = useState(false)
  const [selectedAction, setSelectedAction] = useState<string>("")

  const handleActionSelect = (action: string) => {
    setSelectedAction(action)
    setShowReplyField(action === "reply")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <main className="min-h-screen pt-[61px] md:pl-60">
        <div className="container p-5 mx-auto">
          {/* Report Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-[#0f172a]">Email Report</h1>
            <Badge variant="secondary">Last 7 Days</Badge>
          </div>

          {/* Email List */}
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <span className={SHARED_STYLES.heading}>Non-Essential Group (24)</span>
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
              {/* Email Item */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={SHARED_STYLES.heading}>Marketing Newsletter</h3>
                    <p className={SHARED_STYLES.subtitle}>From: newsletter@company.com</p>
                  </div>
                  <div className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Move className="mr-2 h-4 w-4" />
                          Move to Essential
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Move className="mr-2 h-4 w-4" />
                          Move to Non-Essential
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
                        <DropdownMenuItem onClick={() => handleActionSelect("read")}>
                          <Check className="mr-2 h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionSelect("reply")}>
                          <Reply className="mr-2 h-4 w-4" />
                          Reply Generated
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionSelect("delete")}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className={`${SHARED_STYLES.text} mb-4`}>
                  This week's marketing updates and campaign performance...
                </p>

                {showReplyField && (
                  <div className="mt-4">
                    <Textarea
                      placeholder="Type your reply here..."
                      className="mb-2"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm">Cancel</Button>
                      <Button size="sm">Send Reply</Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional email items can be added here */}
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className={SHARED_STYLES.heading}>
                Essential Email Statistics
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span>Processed Emails</span>
                  <Badge variant="secondary">24</Badge>
                </div>
                {/* Add charts/stats here */}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className={SHARED_STYLES.heading}>
                Non-Essential Breakdown
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span>Marketing</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                {/* Add breakdown list here */}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
