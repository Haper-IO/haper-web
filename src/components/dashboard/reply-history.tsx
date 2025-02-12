import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const replies = [
  {
    name: "Alice Smith",
    subject: "Re: Project Update",
    time: "Thu Feb 6 2:22 PM",
    preview:
      "Ms. Alice has reviewed your car rental budget. While generally satisfactory, she's flagged insurance costs for discus...",
  },
  {
    name: "Alice Smith",
    subject: "Re: Project Update",
    time: "Thu Feb 6 2:22 PM",
    preview:
      "Ms. Alice has reviewed your car rental budget. While generally satisfactory, she's flagged insurance costs for discus...",
  },
]

export function ReplyHistory() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <div className="rounded bg-[#1e293b] px-2 py-1 text-xs font-medium text-white">Reply History</div>
        <div className="text-xs text-[#64748b]">In Last 12 Hours</div>
        <Mail className="ml-auto h-4 w-4 text-[#94a3b8]" />
      </CardHeader>
      <CardContent className="space-y-4">
        {replies.map((reply, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="font-medium text-[#0f172a]">{reply.name}</div>
              <div className="text-xs text-[#64748b]">{reply.time}</div>
            </div>
            <div className="text-sm font-medium text-[#475569]">{reply.subject}</div>
            <p className="text-sm text-[#64748b]">{reply.preview}</p>
          </div>
        ))}
        <button className="ml-auto text-sm font-medium text-[#92bfff]">Expand</button>
      </CardContent>
    </Card>
  )
}

