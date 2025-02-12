import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function MessageStats() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-[#0f172a]">Message Summary</h3>
          <div className="flex gap-4">
            <button className="text-sm font-medium text-[#0f172a]">12 hour</button>
            <button className="text-sm text-[#64748b]">Day</button>
            <button className="text-sm text-[#64748b]">Week</button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
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
              <span className="text-sm text-[#475569]">Essential (39)</span>
              <span className="ml-auto text-sm font-medium">13.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#94e9b8]" />
              <span className="text-sm text-[#475569]">Non-essential (69)</span>
              <span className="ml-auto text-sm font-medium">22.8%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

