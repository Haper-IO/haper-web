"use client"

import {Mail, RefreshCw} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardHeader} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {useRouter} from "next/navigation"
import {useState, useEffect} from "react"
import {
  generateReport,
  getNewestReport,
} from "@/lib/requests/client/report"
import {Report} from "@/lib/modal/report"
import {Skeleton} from "@/components/ui/skeleton"
import {GmailIcon, OutlookIcon} from "@/icons/provider-icons"
import {WaitingIllustration} from "@/icons/illustrations";
import RichContent from "@/components/rich-content";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {formatUpdateTime} from "@/lib/utils";

export function transToReportSummary(report: Report) {
  if (!report) {
    return {
      title: "",
      updateTime: "",
      summaries: [],
      essentialMailsByAccount: [],
      totalCounts: {essential: 0, nonEssential: 0}
    };
  }

  // Get the Gmail accounts array
  const gmailAccounts = report?.content?.content?.gmail || [];

  // Process each account
  const accountReports = gmailAccounts.map(account => {
    const messages = account.messages || [];

    return {
      accountEmail: account.email,
      essentialSenders: messages
        .filter(message => message.category === "Essential")
        .map(message => {
          // Clean up sender names by removing email parts in brackets
          const sender = message.sender.includes('<')
            ? message.sender.split('<')[0].trim()
            : message.sender;
          return sender;
        }),
      categoryCounts: {
        essential: messages.filter(message => message.category === "Essential").length,
        nonEssential: messages.filter(message => message.category !== "Essential").length
      }
    };
  });

  // Calculate total counts across all accounts
  const totalCounts = accountReports.reduce(
    (acc, curr) => ({
      essential: acc.essential + curr.categoryCounts.essential,
      nonEssential: acc.nonEssential + curr.categoryCounts.nonEssential
    }),
    {essential: 0, nonEssential: 0}
  );

  // Get summary content from the report
  let summaryContent: string[] = [];
  if (report.content?.summary && Array.isArray(report.content.summary)) {
    summaryContent = report.content.summary.map(item => {
      if (item.type === 'text' && item.text?.content) {
        return item.text.content;
      } else if (item.type === 'email' && item.email?.name) {
        return item.email.name;
      }
      return '';
    }).filter(Boolean);
  }

  return {
    title: "",
    updateTime: formatUpdateTime(report.created_at),
    summaries: summaryContent,
    accountReports,
    totalCounts
  };
}

// Email Summary Component
export function LatestSummary() {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Determine which email providers are present in the report
  const hasGmail = report?.content?.content?.gmail != undefined && report?.content?.content?.gmail.length > 0;
  const hasOutlook = report?.content?.content?.outlook != undefined && report?.content?.content?.outlook.length > 0;

  const fetchReport = () => {
    if (reportLoading) {
      return;
    }
    setReportLoading(true);
    setReportError(null);

    getNewestReport().then((resp) => {
      if (resp.data.report) {
        setReport(resp.data.report);
      } else {
      }
    }).catch(() => {
      setReportError("Failed to load report data");
    }).finally(() => {
      setReportLoading(false);
    });
  };

  // Fetch report when component mounts
  useEffect(() => {
    fetchReport();
  }, []);

  const handleGenerateReport = () => {
    if (isGenerating) {
      return;
    }
    setIsGenerating(true);
    setReportError(null);

    generateReport()
      .then((resp) => {
        if (resp.data.report) {
          setReport(resp.data.report);
          // Navigate to the report page after successful generation
          if (resp.data.report?.id) {
            router.push(`/report/${resp.data.report.id}`);
          }
        } else {
          setReportError("Failed to generate report");
        }
      })
      .catch((error) => {
        // Check if it's an API error with a specific status
        if (error?.response?.status === 404 || error?.response?.status === 400) {
          setReportError("You do not receive any messages since last updates, please check later!");
        } else {
          setReportError("Failed to generate report");
        }
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  const reportSummary = report ? transToReportSummary(report) : null;

  const reportSummaryData = reportSummary ? {
    title: reportSummary.title,
    content: reportSummary.summaries.join(" "),
    highlightedPeople: reportSummary.accountReports?.flatMap(account => {
      // Make sure we get unique senders only
      const uniqueSenders = new Set(account.essentialSenders);
      return Array.from(uniqueSenders).map(name => ({name}));
    }) || []
  } : null;

  const totalReportItem = reportSummary ? reportSummary.totalCounts.essential + reportSummary.totalCounts.nonEssential : 0

  const reportStatsData = reportSummary ? {
    essentialCount: reportSummary.totalCounts.essential,
    nonEssentialCount: reportSummary.totalCounts.nonEssential,
    essentialPercentage: totalReportItem == 0 ? 0 : reportSummary.totalCounts.essential / totalReportItem * 100,
    nonEssentialPercentage: totalReportItem == 0 ? 0 : reportSummary.totalCounts.nonEssential / (totalReportItem) * 100
  } : null;

  // Render appropriate email provider icons
  const renderEmailProviderIcons = () => {
    if (!hasGmail && !hasOutlook) {
      return <Mail className="h-4 w-4 text-gray-400"/>;
    }

    return (
      <div className="flex gap-1">
        {hasGmail && (
          <div className="relative h-5 w-5" title="Gmail">
            <GmailIcon className="h-5 w-5"/>
          </div>
        )}
        {hasOutlook && (
          <div className="relative h-5 w-5" title="Outlook">
            <OutlookIcon className="h-5 w-5"/>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card id="user-guide-step3">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Badge variant="outline" size="md" className="bg-slate-50 text-slate-700 border-slate-300 font-medium">Latest Summary</Badge>
        {report ? (
          <Badge variant="secondary" size="md">
            {formatUpdateTime(report.created_at)}
          </Badge>
        ) : reportLoading || isGenerating ? (
          <Skeleton className="h-6 w-32"/>
        ) : (
          <Badge variant="secondary" size="md">No data available</Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={fetchReport}
            disabled={reportLoading || isGenerating}
            title="Refresh report"
          >
            <RefreshCw className={`h-4 w-4 ${reportLoading ? 'animate-spin' : ''}`}/>
            <span className="sr-only">Refresh</span>
          </Button>
          {renderEmailProviderIcons()}
        </div>
      </CardHeader>

      {/* Improved layout structure */}
      <div className="px-6 pb-6">
        {reportLoading || isGenerating ? (
          <div className="space-y-4">
            <Skeleton className="h-6 w-64"/>
            <Skeleton className="h-24 w-full"/>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <Skeleton className="h-32 w-full rounded-md"/>
              <Skeleton className="h-32 w-full rounded-md"/>
            </div>
            {isGenerating && (
              <p className="text-sm text-slate-600 mt-2">Generating new report...</p>
            )}
          </div>
        ) : reportError ? (
          <div className="px-4 py-4 bg-red-50/90 text-red-800 rounded-md backdrop-blur-[2px]">
            <p className="text-sm">{reportError}</p>
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={handleGenerateReport}>
                Try Again
              </Button>
            </div>
          </div>
        ) : reportSummaryData ? (
          <div className="space-y-6">
                        {/* Report summary content */}
            <div className="bg-white/70 backdrop-blur-[2px] rounded-lg shadow-sm border border-slate-200/70 overflow-hidden">
              <div className="px-4 py-4">
                {report && report.content && report.content.summary &&
                  <RichContent richTextList={report.content.summary}></RichContent>
                }
                {report && report.content.summary == null &&
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <WaitingIllustration className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0"/>
                    <div className="bg-slate-50/70 backdrop-blur-[2px] rounded-md p-4 border border-slate-200/60 flex-1">
                      <p className="text-sm text-gray-500">
                        Haper tracks your emails since the last report generation. If the summary is still empty after refreshing, please wait for incoming emails and try again later.
                      </p>
                    </div>
                  </div>
                }
              </div>

              {/* Stats and chart in a nice grid layout */}
              {reportStatsData && (reportStatsData.essentialCount > 0 || reportStatsData.nonEssentialCount > 0) && (
                <div className="border-t border-slate-100">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 p-3 sm:p-4">
                    {/* Chart visualization - full width on mobile, 5/12 on large screens */}
                    <div className="lg:col-span-5 xl:col-span-4 flex justify-center items-center">
                      <div className="h-[160px] sm:h-[180px] w-full max-w-[200px] sm:max-w-none">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <defs>
                              <linearGradient id="essentialGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#be185d" />
                                <stop offset="30%" stopColor="#ec4899" />
                                <stop offset="70%" stopColor="#f472b6" />
                                <stop offset="100%" stopColor="#f9a8d4" />
                              </linearGradient>
                            </defs>
                            <Pie
                              data={[
                                { name: 'Essential', value: reportStatsData.essentialCount, color: '#ec4899' },
                                { name: 'Non-essential', value: reportStatsData.nonEssentialCount, color: '#cbd5e1' },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={30}
                              outerRadius={60}
                              paddingAngle={2}
                              startAngle={90}
                              endAngle={450}
                              dataKey="value"
                            >
                              <Cell fill="url(#essentialGradient)" />
                              <Cell fill="#cbd5e1" />
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => [`${value} emails`, '']}
                              contentStyle={{
                                backgroundColor: 'white',
                                borderRadius: '0.375rem',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                                padding: '0.5rem 0.75rem',
                                fontSize: '0.875rem',
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Stats breakdown - full width on mobile, 7/12 on large screens */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
                      <h4 className="text-sm font-medium text-slate-700 mb-3">Email Categories</h4>
                      <div className="space-y-3 sm:space-y-4">
                        {/* Essential emails with count */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-sm bg-gradient-to-b from-pink-700 via-pink-400 to-pink-300 flex-shrink-0"></div>
                              <span className="text-sm font-medium text-slate-700">Essential</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm tabular-nums font-medium bg-pink-50 text-pink-700 px-2 sm:px-2.5 py-1 rounded-md whitespace-nowrap">
                                {reportStatsData.essentialCount}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Non-essential emails with count */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-sm bg-slate-300 flex-shrink-0"></div>
                              <span className="text-sm font-medium text-slate-700">Non-essential</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm tabular-nums font-medium bg-slate-50 text-slate-600 px-2 sm:px-2.5 py-1 rounded-md whitespace-nowrap">
                                {reportStatsData.nonEssentialCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Button Section */}
            <div className="flex justify-center sm:justify-start">
              <Button
                variant="default"
                onClick={() => {
                  generateReport().then((resp) => {
                    if (resp.data.report?.id) {
                      router.push(`/report/${resp.data.report.id}`);
                    }
                  })
                }}
                disabled={!report || reportLoading || isGenerating}
                size="sm"
                className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white shadow-md"
              >
                Generate Report
              </Button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-4 bg-white/70 backdrop-blur-[2px] rounded-md border border-slate-200/70">
            <p className="text-sm text-gray-600">No report data available. Click the + button generate a new
              report for testing.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
