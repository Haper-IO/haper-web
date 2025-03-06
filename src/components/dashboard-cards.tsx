import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GmailIcon } from "@/icons/gmail-icon"
import { useRouter } from "next/navigation"

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

// Types for backend data
export interface ReplyData {
  id: string;
  name: string;
  subject: string;
  time: string;
  preview: string;
}

export interface MessageStatsData {
  timeRange: string;
  essentialCount: number;
  essentialPercentage: number;
  nonEssentialCount: number;
  nonEssentialPercentage: number;
}

export interface EmailSummaryData {
  title: string;
  updateTime: string;
  content: string;
  highlightedPeople: Array<{name: string, context: string}>;
}

// Reply History Component
export function ReplyHistory({
                               replies = [
                                 {
                                   id: "1",
                                   name: "Alice Smith",
                                   subject: "Re: Project Update",
                                   time: "Thu Feb 6 2:22 PM",
                                   preview: "Ms. Alice has reviewed your car rental budget. While generally satisfactory, she's flagged insurance costs for discus...",
                                 },
                                 {
                                   id: "2",
                                   name: "Alice Smith",
                                   subject: "Re: Project Update",
                                   time: "Thu Feb 6 2:22 PM",
                                   preview: "Ms. Alice has reviewed your car rental budget. While generally satisfactory, she's flagged insurance costs for discus...",
                                 },
                               ]
                             }: {
  replies?: ReplyData[]
}) {
  return (
    <Card>
      <CardHeader className={SHARED_STYLES.cardHeader}>
        <Badge variant="secondary" size={"md"}>Reply History</Badge>
        <Badge variant="secondary" size={"md"}>In Last 12 Hours</Badge>
        <GmailIcon/>
      </CardHeader>
      <CardContent className="space-y-4">
        {replies.map((reply) => (
          <div key={reply.id} className="space-y-1">
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
export function MessageStats({
                               stats = {
                                 timeRange: "12 hour",
                                 essentialCount: 39,
                                 essentialPercentage: 13.9,
                                 nonEssentialCount: 69,
                                 nonEssentialPercentage: 22.8
                               }
                             }: {
  stats?: MessageStatsData
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" size="md">Summary</Badge>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-[#0f172a]">{stats.timeRange}</button>
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
                strokeDasharray={`${stats.essentialPercentage} 100`}
                transform="rotate(-90 18 18)"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#92bfff]" />
              <span className={SHARED_STYLES.text}>Essential ({stats.essentialCount})</span>
              <span className="ml-auto text-sm font-medium">{stats.essentialPercentage}%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#94e9b8]" />
              <span className={SHARED_STYLES.text}>Non-essential ({stats.nonEssentialCount})</span>
              <span className="ml-auto text-sm font-medium">{stats.nonEssentialPercentage}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Email Summary Component
export function EmailSummaryWithStats({
                                        summaryData = {
                                          title: "You received 3 Essential Emails in the Past 3 hours",
                                          updateTime: "3 mins ago",
                                          content: "In the past 3 hours, You have received 1 invitation from Grant about your upcoming trip, 1 reply from Alice about your car rental project, 1 email from your instructor Dr. Bieler discussing your essay topics.",
                                          highlightedPeople: [
                                            {name: "Grant", context: "invitation"},
                                            {name: "Alice", context: "car rental project"},
                                            {name: "Dr. Bieler", context: "essay topics"}
                                          ]
                                        },
                                        statsData = {
                                          timeRange: "3 hours",
                                          essentialCount: 39,
                                          essentialPercentage: 13.9,
                                          nonEssentialCount: 69,
                                          nonEssentialPercentage: 22.8
                                        },
                                        onBatchAction
                                      }: {
  summaryData?: EmailSummaryData,
  statsData?: MessageStatsData,
  onBatchAction?: () => void
}) {
  const router = useRouter();

  // Function to highlight names
  const renderHighlightedContent = (content: string, highlights: Array<{name: string}>) => {
    let result = content;
    highlights.forEach(person => {
      result = result.replace(
        person.name,
        `<span class="${SHARED_STYLES.accent}">${person.name}</span>`
      );
    });

    return <p className={SHARED_STYLES.text} dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const handleBatchAction = () => {
    if (onBatchAction) {
      onBatchAction();
    } else {
      router.push("/report");
    }
  };

  return (
    <Card className={"bg-slate-200/30"}>
      <CardHeader className={SHARED_STYLES.cardHeader}>
        <Badge variant="emphasis" size="md">Summary</Badge>
        <Badge variant="secondary" size="md">Updated {summaryData.updateTime}</Badge>
        <Mail className={SHARED_STYLES.mailIcon} />
      </CardHeader>
      <div>
        <div className="flex flex-col lg:flex-row flex-wrap gap-4">
          {/* Email Summary */}
          <CardContent className="flex-1 min-w-[300px] lg:min-w-[420px] space-y-4 lg:w-3/5 ">
            <h3 className={SHARED_STYLES.heading}>
              {summaryData.title}
            </h3>
            <div className="px-3 py-3 bg-slate-100/70 rounded-md outline-lime-600/20 outline">
              {renderHighlightedContent(summaryData.content, summaryData.highlightedPeople)}
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
                    strokeDasharray={`${statsData.essentialPercentage} 100`}
                    transform="rotate(-90 18 18)"
                  />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#92bfff]" />
                  <span className={SHARED_STYLES.text}>Essential ({statsData.essentialCount})</span>
                  <span className="ml-auto text-sm font-medium">{statsData.essentialPercentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#94e9b8]" />
                  <span className={SHARED_STYLES.text}>Non-essential ({statsData.nonEssentialCount})</span>
                  <span className="ml-auto text-sm font-medium">{statsData.nonEssentialPercentage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Button Section */}
        <CardContent>
          <div className="pt-3 flex justify-center sm:justify-start">
            <Button variant="default" onClick={handleBatchAction}>
              Quick Batch Actions
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function EmailSummaryHistory({
    summaryData = {
      title: "You received 3 Essential Emails in the Past 3 hours",
      updateTime: "3 mins ago",
      content: "In the past 3 hours, You have received 1 invitation from Grant about your upcoming trip, 1 reply from Alice about your car rental project, 1 email from your instructor Dr. Bieler discussing your essay topics.",
      highlightedPeople: [
        {name: "Grant", context: "invitation"},
        {name: "Alice", context: "car rental project"},
        {name: "Dr. Bieler", context: "essay topics"}
      ]
    },
    onCheckLastReport
  }: {
  summaryData?: EmailSummaryData,
  onCheckLastReport?: () => void
}) {
  const router = useRouter();

  // Function to highlight names
  const renderHighlightedContent = (content: string, highlights: Array<{name: string}>) => {
    let result = content;
    highlights.forEach(person => {
      result = result.replace(
        person.name,
        `<span class="${SHARED_STYLES.accent}">${person.name}</span>`
      );
    });

    return <p className={SHARED_STYLES.text} dangerouslySetInnerHTML={{ __html: result }} />;
  };

  const handleCheckLastReport = () => {
    if (onCheckLastReport) {
      onCheckLastReport();
    } else {
      router.push("/report");
    }
  };

  return (
    <Card>
      <CardHeader className={SHARED_STYLES.cardHeader}>
        <Badge variant="default" size="md">Summary</Badge>
        <Badge variant="secondary" size="md">Updated {summaryData.updateTime}</Badge>
        <Mail className={SHARED_STYLES.mailIcon} />
      </CardHeader>
      <CardContent className="container space-y-4">
        <h3 className={SHARED_STYLES.heading}>
          {summaryData.title}
        </h3>
        <div className={"px-2 py-2 bg-slate-200 rounded-md"}>
          {renderHighlightedContent(summaryData.content, summaryData.highlightedPeople)}
        </div>
        <div className={"pt-3"}>
          <Button variant="outline" className="ml-auto" onClick={handleCheckLastReport}>
            Check Last Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
