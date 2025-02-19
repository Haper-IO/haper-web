import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GmailIcon } from "@/icons/gmail-icon"

// Shared styles
const SHARED_STYLES = {
  cardHeader: "flex flex-row items-center gap-2 space-y-0",
  label: "rounded bg-[#1e293b] px-2 py-1 text-xs font-medium text-white",
  subtitle: "text-xs text-[#64748b]",
  mailIcon: "ml-auto h-4 w-4 text-[#94a3b8]",
  heading: "font-medium text-[#0f172a]",
  text: "text-sm text-[#475569]",
  accent: "text-lime-600"
}

// Reply History Component
const replies = [
  {
    name: "Alice Smith",
    subject: "Re: Project Update",
    time: "Thu Feb 6 2:22 PM",
    preview: "Ms. Alice has reviewed your car rental budget. While generally satisfactory, she's flagged insurance costs for discus...",
  },
  {
    name: "Alice Smith",
    subject: "Re: Project Update",
    time: "Thu Feb 6 2:22 PM",
    preview: "Ms. Alice has reviewed your car rental budget. While generally satisfactory, she's flagged insurance costs for discus...",
  },
]

export function ReplyHistory() {
  return (
    <Card>
      <CardHeader className={SHARED_STYLES.cardHeader}>
        <Badge variant="secondary" size={"md"}>Reply History</Badge>
        <Badge variant="secondary" size={"md"}>In Last 12 Hours</Badge>
        <GmailIcon/>
      </CardHeader>
      <CardContent className="space-y-4">
        {replies.map((reply, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className={SHARED_STYLES.heading}>{reply.name}</div>
              <div className={SHARED_STYLES.subtitle}>{reply.time}</div>
            </div>
            <div className={SHARED_STYLES.text}>{reply.subject}</div>
            <p className={SHARED_STYLES.subtitle}>{reply.preview}</p>
          </div>
        ))}
        <button className={`ml-auto text-sm font-medium ${SHARED_STYLES.accent}`}>
          Expand
        </button>
      </CardContent>
    </Card>
  )
}

// Message Stats Component
export function MessageStats() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" size="md">Summary</Badge>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-[#0f172a]">12 hour</button>
            <button className={SHARED_STYLES.subtitle}>Day</button>
            <button className={SHARED_STYLES.subtitle}>Week</button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-8">
          <div className="relative h-40 w-40">
            <svg className="h-full w-full" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#92bfff"
                strokeWidth="4"
                strokeDasharray="100.53 100"
                transform="rotate(-90 18 18)"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="#94e9b8"
                strokeWidth="4"
                strokeDasharray="13.9 100"
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#92bfff]" />
              <span className={SHARED_STYLES.text}>Essential (39)</span>
              <span className="ml-auto text-sm font-medium">13.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#94e9b8]" />
              <span className={SHARED_STYLES.text}>Non-essential (69)</span>
              <span className="ml-auto text-sm font-medium">22.8%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Email Summary Component
export function EmailSummaryWithStats() {
  return (
    <Card>
      <CardHeader className={SHARED_STYLES.cardHeader}>
        <Badge variant="emphasis" size="md">Summary</Badge>
        <Badge variant="secondary" size="md">Updated 3 mins ago</Badge>
        <Mail className={SHARED_STYLES.mailIcon} />
      </CardHeader>
      <div>
        <div className="flex flex-col lg:flex-row flex-wrap gap-4">
          {/* Email Summary */}
          <CardContent className="flex-1 min-w-[300px] lg:min-w-[420px] space-y-4 lg:w-3/5">
            <h3 className={SHARED_STYLES.heading}>
              You received 3 Essential Emails in the Past 3 hours
            </h3>
            <div className="px-2 py-2 bg-slate-200 rounded-md">
              <p className={SHARED_STYLES.text}>
                In the past 3 hours, You have received 1 invitation from{" "}
                <span className={SHARED_STYLES.accent}>Grant</span> about your upcoming trip,
                1 reply from <span className={SHARED_STYLES.accent}>Alice</span> about your car rental project,
                1 email from your instructor <span className={SHARED_STYLES.accent}>Dr. Bieler</span> discussing your
                essay topics.
              </p>
            </div>
          </CardContent>

          {/* Message Stats Statistics */}
          <CardContent className="flex-1 min-w-[300px] lg:min-w-[400px] lg:w-2/5">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="relative h-40 w-40">
                <svg className="h-full w-full" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#92bfff"
                    strokeWidth="4"
                    strokeDasharray="100.53 100"
                    transform="rotate(-90 18 18)"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#94e9b8"
                    strokeWidth="4"
                    strokeDasharray="13.9 100"
                    transform="rotate(-90 18 18)"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#92bfff]" />
                  <span className={SHARED_STYLES.text}>Essential (39)</span>
                  <span className="ml-auto text-sm font-medium">13.9%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#94e9b8]" />
                  <span className={SHARED_STYLES.text}>Non-essential (69)</span>
                  <span className="ml-auto text-sm font-medium">22.8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Button Section */}
        <CardContent>
          <div className="pt-3 flex justify-center sm:justify-start">
            <Button variant="default">
              Quick Batch Actions
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function EmailSummaryHistory() {
  return (
    <Card>
    <CardHeader className={SHARED_STYLES.cardHeader}>
      <Badge variant="default" size="md">Summary</Badge>
        <Badge variant="secondary" size="md">Updated 3 mins ago</Badge>
        <Mail className={SHARED_STYLES.mailIcon} />
      </CardHeader>
        <CardContent className="container space-y-4">
          <h3 className={SHARED_STYLES.heading}>
            You received 3 Essential Emails in the Past 3 hours
          </h3>
          <div className={"px-2 py-2 bg-slate-200 rounded-md"}>
            <p className={SHARED_STYLES.text}>
              In the past 3 hours, You have received 1 invitation from{" "}
              <span className={SHARED_STYLES.accent}>Grant</span> about your upcoming trip,
              1 reply from <span className={SHARED_STYLES.accent}>Alice</span> about your car rental project,
              1 email from your instructor <span className={SHARED_STYLES.accent}>Dr. Bieler</span> discussing your
              essay topics.
            </p>
          </div>
          <div className={"pt-3"}>
            <Button variant="outline" className="ml-auto">
              Check Last Report
            </Button>
          </div>
        </CardContent>
    </Card>
  )
}
