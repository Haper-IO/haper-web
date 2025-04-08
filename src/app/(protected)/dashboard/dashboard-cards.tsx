import {Mail, RefreshCw} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {useRouter} from "next/navigation"
import {useState, useEffect} from "react"
import {
  generateReport,
  getNewestReport,
  getReportHistory,
} from "@/lib/requests/client/report"
import {Report} from "@/lib/modal/report"
import {Skeleton} from "@/components/ui/skeleton"
import {GmailIcon, OutlookIcon} from "@/icons/provider-icons"
import RichContent from "@/components/rich-content";


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
    title: "Email Summary Report",
    updateTime: new Date(report.created_at).toLocaleString(),
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
    <Card className="bg-slate-200/40 backdrop-blur-[2px]">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Badge variant="emphasis" size="md">Latest Summary</Badge>
        {report ? (
          <Badge variant="secondary" size="md">
            Updated {new Date(report.created_at).toLocaleString()}
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

      <div>
        <div className="flex flex-col md:flex-row flex-wrap gap-4">
          {/* Email Summary */}
          <CardContent className="flex-1 min-w-[300px] space-y-4 md:min-w-[420px] ">
            {reportLoading || isGenerating ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-64"/>
                <Skeleton className="h-24 w-full"/>
                {isGenerating && (
                  <p className="text-sm text-slate-600">Generating new report...</p>
                )}
              </div>
            ) : reportError ? (
              <div className="px-3 py-3 bg-red-50/90 text-red-800 rounded-md backdrop-blur-[2px]">
                <p className="text-sm">{reportError}</p>
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm" onClick={handleGenerateReport}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : reportSummaryData ? (
              <>
                <h3 className="font-medium text-black-900">{reportSummaryData.title}</h3>
                <div
                  className="px-4 py-4 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70 max-w-[800px]">
                  {report && report.content && report.content.summary && <RichContent richTextList={report.content.summary}></RichContent>}
                </div>
                {/* Button Section */}
                <div className="pt-3 flex justify-center sm:justify-start">
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
                    className="bg-slate-600/90 hover:bg-slate-500/90"
                  >
                    Generate Report
                  </Button>
                </div>

                {/* Display provider information if available */}
                {(hasGmail || hasOutlook) && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Data sources:</span>
                    {hasGmail && (
                      <span className="flex items-center gap-1">
                      <GmailIcon className="h-3 w-3"/>
                    </span>
                    )}
                    {hasOutlook && (
                      <span className="flex items-center gap-1">
                      <OutlookIcon className="h-3 w-3"/>
                    </span>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="px-3 py-3 bg-white/70 backdrop-blur-[2px] rounded-md border border-slate-200/70">
                <p className="text-sm text-gray-600">No report data available. Click the + button generate a new
                  report for testing.</p>
              </div>
            )}
          </CardContent>

          {/* Message Stats Statistics */}
          <CardContent className="flex min-w-[300px] justify-center items-center md:min-w-[300px]">
            {reportLoading || isGenerating ? (
              <div className="flex">
                <Skeleton className="h-40 w-40 rounded-full"/>
              </div>
            ) : reportStatsData && reportStatsData.essentialCount >= 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative h-40 w-40">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    {/* Background circle */}
                    <circle cx="18" cy="18" r="16" fill="none" stroke="#e2e8f0" strokeWidth="4"/>
                    {/* Non-essential segment */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-slate-400/80"
                      strokeWidth="4"
                      strokeDasharray={`${reportStatsData.nonEssentialPercentage} 100`}
                      transform="rotate(-90 18 18)"
                    />
                    {/* Essential segment */}
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      className="stroke-lime-400/80"
                      strokeWidth="4"
                      strokeDasharray={`${reportStatsData.essentialPercentage} 100`}
                      transform={`rotate(${reportStatsData.nonEssentialPercentage * 3.6 - 90} 18 18)`}
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-lime-400/90"/>
                    <span className="text-sm text-gray-600">
                    Essential ({reportStatsData.essentialCount})
                    </span>
                    <span className="ml-auto text-sm font-medium">
                    {Math.round(reportStatsData.essentialPercentage)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-400/80"/>
                    <span className="text-sm text-gray-600">
                    Non-essential ({reportStatsData.nonEssentialCount})
                    </span>
                    <span className="ml-auto text-sm font-medium">
                    {Math.round(reportStatsData.nonEssentialPercentage)}%
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-sm text-gray-500">No statistics available</p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

export function LastReport() {
  const router = useRouter();
  const [latestReport, setLatestReport] = useState<Report | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Determine which email providers are present in the report
  const hasGmail = latestReport?.content?.content?.gmail && latestReport?.content?.content?.gmail.length > 0;
  const hasOutlook = latestReport?.content?.content?.outlook && latestReport?.content?.content?.outlook.length > 0;


  const fetchReportHistory = () => {
    if (reportLoading) {
      return;
    }
    setReportLoading(true);
    setReportError(null);

    // Use real API call to fetch report history
    getReportHistory(1, 1).then((resp) => {
      const reports = resp.data.reports || [];
      if (reports[0]) {
        setLatestReport(reports[0]);
      } else {
        setLatestReport(null);
      }
    }).catch(() => {
      setReportError("Failed to load report history");
    }).finally(() => {
      setReportLoading(false);
    });
  };

  // Calculate message stats with safeguards for zero values
  const calculateStats = (report: Report) => {
    if (!report?.content?.content?.gmail) return {essential: 0, nonEssential: 0, total: 0};

    let essential = 0;
    let nonEssential = 0;

    report.content.content.gmail.forEach(account => {
      if (account.messages) {
        account.messages.forEach(message => {
          if (message.category === "Essential") {
            essential++;
          } else {
            nonEssential++;
          }
        });
      }
    });

    const total = essential + nonEssential;
    return {essential, nonEssential, total};
  };

  // Generate content for the report if summary is empty
  const generateContent = (report: Report) => {

    return (
      <div className="space-y-2">
        {report.content.summary && report.content.summary.length > 0 && (
          <div className="text-slate-800 leading-relaxed">
            <RichContent richTextList={report.content.summary} />
          </div>
        )}
        {report?.content?.content?.gmail && report.content.content.gmail.some(account =>
          account.messages && account.messages.length > 0
        ) && (
          <div className="space-y-2 mt-3 pt-2 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-700">Sample messages:</p>
            {report.content.content.gmail.flatMap(account =>
              account.messages?.slice(0, 2).map((msg, idx) => (
                <div key={`${account.account_id}-${idx}`} className="px-3 py-2 bg-slate-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-medium ${msg.category === "Essential" ? 'text-lime-600' : 'text-slate-800'}`}>
                      {msg.sender.includes('<') ? msg.sender.split('<')[0].trim() : msg.sender}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      msg.category === "Essential" ? 'bg-lime-100 text-lime-800' : 'bg-slate-200 text-slate-800'
                    }`}>
                      {msg.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 truncate">{msg.subject}</div>
                  <p className="text-xs text-slate-700 mt-1">{msg.summary}</p>
                </div>
              ))
            ).slice(0, 2)}
          </div>
        )}
      </div>
    );
  };

  // Render appropriate email provider icons
  const renderEmailProviderIcons = () => {
    if (!latestReport || (!hasGmail && !hasOutlook)) {
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

  const reportStats = latestReport ? calculateStats(latestReport) : null;

  useEffect(() => {
    // Initial load with real API call
    fetchReportHistory();
  }, []);

  return (
    <Card className="bg-slate-200/40 backdrop-blur-[2px]">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Badge variant="default" size="md">Last Report</Badge>
        {latestReport ? (
          <Badge variant="secondary" size="md">
            {new Date(latestReport.created_at).toLocaleString()}
          </Badge>
        ) : reportLoading ? (
          <Skeleton className="h-6 w-32"/>
        ) : (
          <Badge variant="secondary" size="md">No data available</Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={fetchReportHistory}
            disabled={reportLoading}
            title="Refresh report"
          >
            <RefreshCw className={`h-4 w-4 ${reportLoading ? 'animate-spin' : ''}`}/>
            <span className="sr-only">Refresh</span>
          </Button>
          {renderEmailProviderIcons()}
        </div>
      </CardHeader>

      <div>
        <div className="flex flex-col md:flex-row flex-wrap gap-4 relative">
          {/* Summary Content */}
          <CardContent className="flex-1 min-w-[300px] space-y-4 md:min-w-[420px]">
            {reportLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-64"/>
                <Skeleton className="h-24 w-full"/>
              </div>
            ) : reportError ? (
              <div className="px-3 py-3 bg-red-50/90 text-red-800 rounded-md backdrop-blur-[2px]">
                <p className="text-sm">{reportError}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={fetchReportHistory}>
                  Try Again
                </Button>
              </div>
            ) : latestReport ? (
              <>
                <div
                  className="px-4 py-4 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70">
                  {latestReport.content.summary && latestReport.content.summary.length > 0 ? (
                    <RichContent richTextList={latestReport.content.summary}></RichContent>
                  ) : (
                    generateContent(latestReport)
                  )}
                  <div className="pt-3 flex justify-center sm:justify-start">
                    <Button
                      variant="secondary"
                      onClick={() => latestReport && router.push(`/report/${latestReport.id}`)}
                      disabled={!latestReport || reportLoading}
                      size="sm"
                      className="bg-slate-200/90 hover:bg-slate-300/90 text-slate-800"
                    >
                      Check Report
                    </Button>
                  </div>
                </div>

                {/* Display stats below content */}
                {reportStats && reportStats.total > 0 && (
                  <div
                    className="flex flex-col gap-2 text-xs bg-slate-50/70 backdrop-blur-[2px] rounded-md p-3 border border-slate-200/60">
                    <div className="font-medium text-slate-700 pb-1 border-b border-slate-200/60">
                      {reportStats.total} {reportStats.total === 1 ? "Email" : "Emails"} Processed
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-lime-500/90"/>
                        <span className="text-slate-700 font-medium">
                          {reportStats.essential} Essential
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-400/80"/>
                        <span className="text-slate-700 font-medium">
                          {reportStats.nonEssential} Non-essential
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div
                className="px-4 py-4 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70">
                <p className="text-sm text-slate-800">No report history available. Click refresh to check for
                  reports.</p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
