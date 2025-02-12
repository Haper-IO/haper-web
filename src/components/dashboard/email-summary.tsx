import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function EmailSummary() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <div className="rounded bg-[#1e293b] px-2 py-1 text-xs font-medium text-white">Summary</div>
        <div className="text-xs text-[#64748b]">Updated 3 mins ago</div>
        <Mail className="ml-auto h-4 w-4 text-[#94a3b8]" />
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="font-medium text-[#0f172a]">You received 3 Essential Emails in the Past 3 hours</h3>
        <p className="text-sm text-[#475569]">
          In the past 3 hours, You have received 1 invitation from <span className="text-[#92bfff]">Grant</span> about
          your upcoming trip, 1 reply from <span className="text-[#92bfff]">Alice</span> about your car rental project,
          1 email from your instructor <span className="text-[#92bfff]">Dr. Bieler</span> discussing your essay topics.
        </p>
        <Button variant="secondary" className="ml-auto">
          Quick Batch Actions
        </Button>
      </CardContent>
    </Card>
  )
}

