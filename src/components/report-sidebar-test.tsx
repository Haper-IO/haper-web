"use client"

import {useState, useEffect} from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {ChevronDownIcon, Loader2, LayoutDashboard, User, PanelLeftClose} from "lucide-react"
import {getReportHistory} from "@/lib/requests/client/report"
import {Report} from "@/lib/modal/report"
import {useUserInfo} from "@/hooks/useUserInfo"
import {Logo_sm} from "@/icons/logo"
import {useRouter} from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export interface SidebarProps {
  isOpen: boolean;
  onSelectReport: (id: string) => void;
  currentReportId: string;
  onToggleSidebar?: () => void;
}

export function ReportSidebar(
  {
    isOpen,
    onSelectReport,
    currentReportId,
    onToggleSidebar
  }: SidebarProps) {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const {userInfo, loading: userLoading} = useUserInfo();
  const router = useRouter();

  useEffect(() => {
    const fetchReportHistory = () => {
      setLoading(true);
      // Fetch a reasonable number of reports - adjust pageSize as needed
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

  return (
    <aside
      className={`fixed top-0 left-0 z-20 h-full w-56 bg-white/85 backdrop-blur-sm border-r border-slate-200/70 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } overflow-hidden flex flex-col`}
    >
      <div className="flex flex-col h-full">
        {/* Menu section with close button and branding */}
        <div className="px-2 py-3 border-b border-slate-100">
          <div className="mb-2 px-2 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-32">
                <Logo_sm/>
              </div>
            </div>
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-1 rounded-sm hover:bg-slate-100/70 transition-colors"
                aria-label="Close sidebar"
              >
                <PanelLeftClose className="h-4 w-4 text-slate-500"/>
              </button>
            )}
          </div>
          <div className="mt-4 mb-2 px-2">
            <p className="text-xs font-medium text-slate-400 uppercase">Menu</p>
          </div>
          <nav className="space-y-1">
            <a href="/dashboard"
               className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100/70 rounded-sm transition-colors">
              <LayoutDashboard className="h-3.5 w-3.5 text-slate-500"/>
              <span>Dashboard</span>
            </a>
          </nav>
        </div>

        {/* Main scrollable area for reports */}
        <div
          className="px-2 py-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400"/>
            </div>
          ) : (
            <div className="space-y-1">
              <Collapsible defaultOpen={true}>
                <CollapsibleTrigger
                  className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100/70 rounded-sm">
                  <ChevronDownIcon size={14} className="text-slate-500"/>
                </CollapsibleTrigger>
                <CollapsibleContent className="pl-1">
                  <div className="mt-0.5">
                    {reports.length > 0 && (
                      reports.map((report) => (
                        <button
                          key={report.id}
                          onClick={() => onSelectReport(report.id)}
                          className={`flex items-start w-full px-2 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-100/70 rounded-sm ${
                            report.id === currentReportId ? "bg-slate-100/90 border-l-2 border-slate-400" : ""
                          }`}
                        >
                          <div className="w-full overflow-hidden pr-1">
                            <div className="flex items-center gap-1">
                              <p
                                className={`font-medium truncate ${report.id === currentReportId ? "text-slate-900" : "text-slate-700"}`}>
                                {new Date(report.created_at).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric',
                                  hour12: true
                                })}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </div>

        {/* Fixed user profile button at the bottom */}
        <div className="mt-auto border-t border-slate-200/80 px-2 py-2">
          <button
            onClick={() => {
              router.push("/profile")
            }}
            className="w-full flex items-center gap-2 px-2 py-2 hover:bg-slate-200/50 transition-colors rounded-md"
          >
            <div
              className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-300/80 flex items-center justify-center overflow-hidden border border-slate-200/70">
              {userLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600"/>
              ) : userInfo?.image ? (
                <img src={userInfo.image} alt={userInfo.name || 'User'} className="h-full w-full object-cover"/>
              ) : (
                <User className="h-4 w-4 text-slate-600"/>
              )}
            </div>
            <div className="overflow-hidden text-left">
              <p className="text-xs font-medium text-slate-800 truncate">
                {userLoading ? 'Loading...' : userInfo?.name || 'User Profile'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {userLoading ? '' : userInfo?.email || 'View profile'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
