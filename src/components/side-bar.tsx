import { History, PieChart } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image";

const navigation = [
  { name: "Overview", icon: PieChart, href: "#", current: true },
  { name: "History", icon: History, href: "#", current: false },
]

export function Sidebar() {
  return (
    <div className="flex h-screen w-[240px] flex-col border-r border-[#e2e8f0] bg-white">
      <div className="p-6">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Haper_Design_File_v.0.1.0-gGKjyWjhITYr509LycdGJAQcmGzphu.png"
          alt="Haper Logo"
          className="h-8"
        />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center rounded-lg px-3 py-2 text-sm font-medium",
              item.current ? "bg-[#f1f5f9] text-[#0f172a]" : "text-[#475569] hover:bg-[#f1f5f9] hover:text-[#0f172a]",
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5",
                item.current ? "text-[#0f172a]" : "text-[#94a3b8] group-hover:text-[#0f172a]",
              )}
            />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  )
}

