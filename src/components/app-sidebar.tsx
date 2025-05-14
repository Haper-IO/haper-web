"use client"

import * as React from "react"
import {useState, useEffect} from "react"
import {
  ChevronDownIcon,
  Loader2,
  LayoutDashboard,
  Clock
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {Logo_sm} from "@/icons/logo"
import {useRouter} from "next/navigation"
import {getReportHistory} from "@/lib/requests/client/report"
import {Report} from "@/lib/modal/report"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useUserInfo } from "@/hooks/useUserInfo"

// Original data for NavMain, NavProjects, and NavSecondary components
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "History",
      url: "#",
      icon: Clock,
    },
  ],
}

function ReportHistorySection() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [currentReportId, setCurrentReportId] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchReportHistory = () => {
      setLoading(true);
      getReportHistory(1, 10).then((resp) => {
        if (resp.data.reports) {
          setReports(resp.data.reports)
        }
      }).finally(() => {
        setLoading(false);
      })
    };

    fetchReportHistory();
  }, []);

  const handleSelectReport = (id: string) => {
    setCurrentReportId(id);
    router.push(`/report/${id}`);
  };

  return (
    <div className="mb-6">
      <div className="px-3 py-1.5 mb-2 flex items-center">
        <h3 className="text-xs font-semibold text-sidebar-foreground/70">Reports</h3>
      </div>
      {loading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-sidebar-foreground/40"/>
        </div>
      ) : (
        <Collapsible defaultOpen={true} className="px-3">
          <CollapsibleTrigger
            className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-sidebar-foreground hover:bg-sidebar-secondary/30 rounded-sm">
            <span>Most recent 10 reports</span>
            <ChevronDownIcon className="h-4 w-4 text-sidebar-foreground/60"/>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="mt-1 space-y-0.5">
              {reports.length > 0 ? (
                reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => handleSelectReport(report.id)}
                    className={`flex items-start w-full px-2 py-2 text-xs text-left text-sidebar-foreground/80 hover:bg-sidebar-secondary/30 rounded-sm ${
                      report.id === currentReportId ? "bg-sidebar-secondary/40" : ""
                    }`}
                  >
                    <div className="w-full overflow-hidden">
                      <p className={`font-medium truncate ${report.id === currentReportId ? "text-sidebar-foreground" : ""}`}>
                        {new Date(report.created_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-xs text-sidebar-foreground/60 text-center py-2">
                  No reports found
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userInfo, loading: userLoading } = useUserInfo();
  
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="">
                  <Logo_sm />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <ReportHistorySection />
      </SidebarContent>
      <SidebarFooter>
        {userLoading ? (
          <div className="p-3 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-sidebar-foreground/40"/>
          </div>
        ) : (
          <NavUser 
            user={userInfo ? {
              name: userInfo.name || "User",
              email: userInfo.email || "",
              avatar: userInfo.image || ""
            } : data.user} 
          />
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
