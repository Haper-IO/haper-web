"use client"

import * as React from "react"
import {useState, useEffect} from "react"
import {
  Loader2,
  LayoutDashboard,
  Clock,
  Heart
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
import { Separator } from "@/components/ui/separator"
import {Logo_md_light} from "@/icons/logo"
import {useRouter, usePathname} from "next/navigation"
import {getReportHistory} from "@/lib/requests/client/report"
import {Report} from "@/lib/modal/report"
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
      title: "My Interests",
      url: "/interests",
      icon: Heart,
    },
    {
      title: "History",
      url: "/history",
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
    <div>
      <div className="px-3 py-1.5">
        <h3 className="text-xs font-semibold text-sidebar-foreground/70">Reports</h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-sidebar-foreground/40"/>
        </div>
      ) : (
        <div>
          {reports.length > 0 ? (
            <>
              <div className="space-y-1">
                {reports.map((report) => {
                  // Format date and time separately
                  const date = new Date(report.created_at);
                  const formattedDate = date.toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                  });
                  const formattedTime = date.toLocaleString('en-US', {
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true
                  });
                  
                  return (
                    <button
                      key={report.id}
                      onClick={() => handleSelectReport(report.id)}
                      className={`flex items-center w-full px-4 py-1.5 text-xs text-left hover:bg-sidebar-secondary/30 ${
                        report.id === currentReportId ? "bg-sidebar-secondary/40 text-sidebar-foreground" : "text-sidebar-foreground/80"
                      }`}
                    >
                      <div className="w-full flex justify-between">
                        <span className="font-medium">{formattedDate}</span>
                        <span className="text-sidebar-foreground/50">{formattedTime}</span>
                    </div>
                  </button>
                  );
                })}
              </div>
              <a
                href="/history"
                className="flex items-center justify-start w-full px-4 py-1.5 mt-2 text-xs font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground/70 transition-colors"
              >
                View all reports
              </a>
            </>
          ) : (
            <div className="text-xs text-sidebar-foreground/60 text-center py-2 px-3">
              No reports found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { userInfo, loading: userLoading } = useUserInfo();
  const pathname = usePathname();

  // Create navigation items with active state based on current path
  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard" || pathname.startsWith("/dashboard/"),
    },
    {
      title: "My Interests",
      url: "/interests",
      icon: Heart,
      isActive: pathname === "/interests" || pathname.startsWith("/interests/"),
    },
    {
      title: "History",
      url: "/history",
      icon: Clock,
      isActive: pathname === "/history" || pathname.startsWith("/history/"),
    },
  ];

  return (
    <Sidebar 
      variant="inset" 
      className="sidebar-dark"
      {...props}
    >
      <SidebarHeader className="pb-1.5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex items-center justify-center">
                  <Logo_md_light />
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-0 flex flex-col gap-1">
        <Separator className="my-2 bg-sidebar-border" />
        <div className="py-1">
          <NavMain items={navItems} />
        </div>
        <Separator className="my-2 bg-sidebar-border" />
        <div>
          <ReportHistorySection />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border pt-1.5">
        {userLoading ? (
          <div className="p-2.5 flex items-center justify-center">
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
