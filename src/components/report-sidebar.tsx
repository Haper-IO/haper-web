"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDownIcon, Loader2, LayoutDashboard, RefreshCw, User, PanelLeftClose } from "lucide-react"
import { Report, getReportHistory, generateReport } from "@/lib/requests/client/report"
import { useUserInfo } from "@/hooks/useUserInfo"
import { Logo_sm } from "@/icons/logo"

// Create a type for categorized reports
export type ReportGroup = {
  date: string;
  reports: {
    id: string;
    title: string;
    time: string;
    created_at: string;
    status?: "processing" | "completed" | "error";
    essentialCount: number;
  }[];
};

export interface EnhancedSidebarProps {
  isOpen: boolean;
  onSelectReport: (id: string) => void;
  currentReportId: string;
  onToggleSidebar?: () => void;
}

export function EnhancedSidebar({
  isOpen,
  onSelectReport,
  currentReportId,
  onToggleSidebar
}: EnhancedSidebarProps) {
  const [reportGroups, setReportGroups] = useState<ReportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, loading: userLoading } = useUserInfo();

  useEffect(() => {
    const fetchReportHistory = async () => {
      try {
        setLoading(true);
        // Fetch a reasonable number of reports - adjust pageSize as needed
        const response = await getReportHistory(1, 20);

        if (response.reports && response.reports.length > 0) {
          // Create date reference points for categorization
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);

          const monthAgo = new Date(today);
          monthAgo.setDate(monthAgo.getDate() - 30);

          // Initialize report categories with count tracking
          const todayReports: ReportGroup["reports"] = [];
          const yesterdayReports: ReportGroup["reports"] = [];
          const weekReports: ReportGroup["reports"] = [];
          const monthReports: ReportGroup["reports"] = [];

          // Track essential message counts
          let todayEssentialCount = 0;
          let yesterdayEssentialCount = 0;
          let weekEssentialCount = 0;
          let monthEssentialCount = 0;

          response.reports.forEach(report => {
            const reportDate = new Date(report.created_at);
            reportDate.setHours(0, 0, 0, 0);

            const formattedTime = new Date(report.created_at).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true
            });

            // Count essential messages in the report
            let essentialCount = 0;

            // Check Gmail accounts
            if (report.content?.content?.gmail) {
              report.content.content.gmail.forEach(account => {
                if (account.messages) {
                  essentialCount += account.messages.filter(msg => msg.category === "Essential").length;
                }
              });
            }

            // Check Outlook accounts
            if (report.content?.content?.outlook) {
              report.content.content.outlook.forEach(account => {
                if (account.messages) {
                  essentialCount += account.messages.filter(msg => msg.category === "Essential").length;
                }
              });
            }

            // Generate a title from the summary or use a default
            let title = `Report ${report.id.slice(0, 6)}`;
            if (report.content && report.content.summary && report.content.summary.length > 0) {
              const summaryText = report.content.summary
                .filter(item => item.type === "text" && item.text?.content)
                .map(item => item.text?.content)
                .join(" ");

              if (summaryText) {
                title = summaryText.slice(0, 24) + (summaryText.length > 24 ? "..." : "");
              }
            }

            const reportItem = {
              id: report.id,
              title: title,
              time: formattedTime,
              created_at: report.created_at,
              essentialCount: essentialCount
            };

            // Categorize based on date and add to essential counts
            if (reportDate.getTime() === today.getTime()) {
              todayReports.push(reportItem);
              todayEssentialCount += essentialCount;
            } else if (reportDate.getTime() === yesterday.getTime()) {
              yesterdayReports.push(reportItem);
              yesterdayEssentialCount += essentialCount;
            } else if (reportDate.getTime() >= weekAgo.getTime()) {
              weekReports.push(reportItem);
              weekEssentialCount += essentialCount;
            } else if (reportDate.getTime() >= monthAgo.getTime()) {
              monthReports.push(reportItem);
              monthEssentialCount += essentialCount;
            }
          });

          // Sort reports by time (newest first)
          const sortByDate = (a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

          todayReports.sort(sortByDate);
          yesterdayReports.sort(sortByDate);
          weekReports.sort(sortByDate);
          monthReports.sort(sortByDate);

          // Create final groups with essential counts
          const groups: ReportGroup[] = [];

          // Always include Today category, even if empty
          groups.push({
            date: `Today${todayEssentialCount > 0 ? ` (${todayEssentialCount} Essential)` : ''}`,
            reports: todayReports
          });

          if (yesterdayReports.length > 0) {
            groups.push({
              date: `Yesterday${yesterdayEssentialCount > 0 ? ` (${yesterdayEssentialCount} Essential)` : ''}`,
              reports: yesterdayReports
            });
          }

          if (weekReports.length > 0) {
            groups.push({
              date: `Past 7 Days`,
              reports: weekReports
            });
          }

          if (monthReports.length > 0) {
            groups.push({
              date: `Past 30 Days${monthEssentialCount > 0 ? ` (${monthEssentialCount} Essential)` : ''}`,
              reports: monthReports
            });
          }

          setReportGroups(groups);
        }
      } catch (error) {
        console.error("Error fetching report history:", error);
      } finally {
        setLoading(false);
      }
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
                <PanelLeftClose className="h-4 w-4 text-slate-500" />
              </button>
            )}
          </div>
          <div className="mt-4 mb-2 px-2">
            <p className="text-xs font-medium text-slate-400 uppercase">Menu</p>
          </div>
          <nav className="space-y-1">
            <a href="/dashboard" className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-100/70 rounded-sm transition-colors">
              <LayoutDashboard className="h-3.5 w-3.5 text-slate-500" />
              <span>Dashboard</span>
            </a>
          </nav>
        </div>

        {/* Main scrollable area for reports */}
        <div className="px-2 py-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {loading ? (
            <div className="flex justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          ) : reportGroups.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-2">
              No reports found
            </div>
          ) : (
            <div className="space-y-1">
              {reportGroups.map((group) => (
                <Collapsible key={group.date} defaultOpen={true}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100/70 rounded-sm">
                    <span>{group.date}</span>
                    <ChevronDownIcon size={14} className="text-slate-500" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pl-1">
                    <div className="mt-0.5">
                      {group.reports.length > 0 ? (
                        group.reports.map((report) => (
                          <button
                            key={report.id}
                            onClick={() => onSelectReport(report.id)}
                            className={`flex items-start w-full px-2 py-1.5 text-xs text-left text-slate-700 hover:bg-slate-100/70 rounded-sm ${
                              report.id === currentReportId ? "bg-slate-100/90 border-l-2 border-slate-400" : ""
                            }`}
                          >
                            <div className="w-full overflow-hidden pr-1">
                              <div className="flex items-center gap-1">
                                <p className={`font-medium truncate ${report.id === currentReportId ? "text-slate-900" : "text-slate-700"}`}>
                                  {report.title}
                                </p>
                                {report.status === "processing" && (
                                  <span className="flex-shrink-0 inline-flex items-center px-1 py-0.5 rounded-sm text-[10px] font-medium bg-blue-50/80 text-blue-700 border border-blue-200/70">
                                    <Loader2 className="animate-spin mr-1 h-2 w-2" />
                                    processing
                                  </span>
                                )}
                              </div>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                  <p className="text-[10px] text-slate-500 truncate">{report.time}</p>
                                  {report.essentialCount > 0 && (
                                    <span className="text-[9px] text-lime-600/90 font-medium">
                                      {report.essentialCount} Essential
                                    </span>
                                  )}
                                </div>
                                {report.id === currentReportId && (
                                  <Badge variant="outline" className="text-[9px] py-0 px-1 h-3 font-normal bg-slate-100/80 border-slate-200/70">
                                    current
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : group.date.startsWith("Today") ? (
                        <div className="py-2 px-2">
                          <p className="text-xs text-slate-500 mb-2">No reports generated today</p>
                          <Button
                            size="sm"
                            className="w-full bg-slate-700/90 hover:bg-slate-600/90 text-white text-xs py-1 h-7"
                            onClick={async () => {
                              try {
                                const { report } = await generateReport();
                                if (report) {
                                  // Navigate to the new report
                                  window.location.href = `/report/${report.id}`;
                                }
                              } catch (error) {
                                console.error("Error generating report:", error);
                                // Consider adding a toast notification here
                              }
                            }}
                          >
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Generate Essential Emails Report
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>

        {/* Fixed user profile button at the bottom */}
        <div className="mt-auto border-t border-slate-200/80 px-2 py-2">
          <button
            onClick={() => window.location.href = '/userprofile'}
            className="w-full flex items-center gap-2 px-2 py-2 hover:bg-slate-200/50 transition-colors rounded-md"
          >
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-300/80 flex items-center justify-center overflow-hidden border border-slate-200/70">
              {userLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
              ) : userInfo?.image ? (
                <img src={userInfo.image} alt={userInfo.name || 'User'} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4 text-slate-600" />
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
