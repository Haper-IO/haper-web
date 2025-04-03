import { Mail, RefreshCw, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { generateReport, getNewestReport, getReportHistory, Report } from "@/lib/requests/client/report"
import { Skeleton } from "@/components/ui/skeleton"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"


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
    { essential: 0, nonEssential: 0 }
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
  const hasGmail = (report as Report)?.content?.content?.gmail && (report as Report)?.content?.content?.gmail.length > 0;
  const hasOutlook = (report as Report)?.content?.content?.outlook && (report as Report)?.content?.content?.outlook.length > 0;

  // Fetch report when component mounts
  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = () => {
    if (reportLoading) {
      return;
    }
    setReportLoading(true);
    setReportError(null);
    console.log("Fetching newest report...");

    getNewestReport()
      .then((resp) => {
        console.log("API response:", resp);
        if (resp?.report) {
          setReport(resp.report);
          console.log("Report fetched:", resp.report);
        } else {
          console.log("No report data in response");
        }
      })
      .catch((error) => {
        console.error("Error fetching report:", error);
        setReportError("Failed to load report data");
      })
      .finally(() => {
        setReportLoading(false);
      });
  };

  const handleGenerateReport = () => {
    if (isGenerating) {
      return;
    }
    setIsGenerating(true);
    setReportError(null);

    generateReport()
      .then((resp) => {
        if (resp?.report) {
          setReport(resp.report);
          console.log("New report generated:", resp.report);
          // Navigate to the report page after successful generation
          if (resp.report?.id) {
            router.push(`/report/${resp.report.id}`);
          }
        } else {
          console.log("No report data in response");
          setReportError("Failed to generate report");
        }
      })
      .catch((error) => {
        console.error("Error generating report:", error);
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
      return Array.from(uniqueSenders).map(name => ({ name }));
    }) || []
  } : null;

  const reportStatsData = reportSummary ? {
    essentialCount: reportSummary.totalCounts.essential,
    nonEssentialCount: reportSummary.totalCounts.nonEssential,
    essentialPercentage: reportSummary.totalCounts.essential / (reportSummary.totalCounts.essential + reportSummary.totalCounts.nonEssential) * 100,
    nonEssentialPercentage: reportSummary.totalCounts.nonEssential / (reportSummary.totalCounts.essential + reportSummary.totalCounts.nonEssential) * 100
  } : null;

  // Function to highlight names
  const renderHighlightedContent = (content: string, highlights: Array<{ name: string }>) => {
    if (!content || !highlights || highlights.length === 0) {
      return <p className="text-sm text-slate-800 leading-relaxed">{content}</p>;
    }

    // Debug to check if we have highlights
    console.log("Highlighting senders:", highlights.map(h => h.name).join(", "));
    
    // Sort by length (longest first) to avoid partial replacements
    const sortedHighlights = [...highlights].sort((a, b) => 
      b.name.length - a.name.length
    );
    
    let result = content;
    sortedHighlights.forEach(person => {
      if (person.name && person.name.length > 1) {
        try {
          // Escape special regex characters to prevent errors
          const escapedName = person.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          // Use a simpler regex without word boundaries which can be too restrictive
          const regex = new RegExp(escapedName, 'g');
          result = result.replace(
            regex,
            `<span class="text-lime-600 font-medium">${person.name}</span>`
          );
        } catch (e) {
          console.error("Error highlighting name:", person.name, e);
        }
      }
    });

    return <p className="text-sm text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{__html: result}}/>;
  };

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
    <Card className="bg-slate-200/50">
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
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleGenerateReport}
            disabled={isGenerating || reportLoading}
            title="Generate new report"
          >
            <PlusCircle className={`h-4 w-4 ${isGenerating ? 'animate-pulse' : ''}`}/>
            <span className="sr-only">Generate New Report</span>
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
              <div className="px-3 py-3 bg-red-50 text-red-800 rounded-md">
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
                <div className="px-4 py-4 bg-white/80 rounded-md shadow-sm border border-slate-200 max-w-[800px]">
                  {renderHighlightedContent(reportSummaryData.content, reportSummaryData.highlightedPeople)}
                </div>
                {/* Button Section */}
                  <div className="pt-3 flex justify-center sm:justify-start">
                    <Button
                      variant="default"
                      onClick={() => report && router.push(`/report/${report.id}`)}
                      disabled={!report || reportLoading || isGenerating}
                      size = "sm"
                    >
                      Quick Batch Actions
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
              <div className="px-3 py-3 bg-white/80 rounded-md">
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
                      className="stroke-slate-400"
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
                      className="stroke-lime-400"
                      strokeWidth="4"
                      strokeDasharray={`${reportStatsData.essentialPercentage} 100`}
                      transform={`rotate(${reportStatsData.nonEssentialPercentage * 3.6 - 90} 18 18)`}
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-lime-400"/>
                    <span className="text-sm text-gray-600">
                    Essential ({reportStatsData.essentialCount})
                    </span>
                    <span className="ml-auto text-sm font-medium">
                    {Math.round(reportStatsData.essentialPercentage)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-slate-400"/>
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
    console.log("Fetching report history...");

    // Use real API call to fetch report history
    getReportHistory(1, 2)
      .then((resp) => {
        console.log("Report history API response:", resp);
        console.log("Reports fetched:", resp?.reports);
        const reports = resp?.reports || [];
        if (reports[0]) {
          setLatestReport(reports[0]);
          console.log("Latest report fetched:", reports[0]);
        } else {
          console.log("No reports available");
          setLatestReport(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching report history:", error);
        setReportError("Failed to load report history");
      })
      .finally(() => {
        setReportLoading(false);
      });
  };

  // Generate a better summary of all messages in the report
  const generateSummaryFromMessages = (report: Report) => {
    if (!report?.content?.content?.gmail) return "No messages found in this report.";

    let allMessages: {
      sender: string;
      subject: string;
      summary: string;
      category: string;
    }[] = [];

    // Collect all messages from all accounts
    report.content.content.gmail.forEach(account => {
      if (account.messages && account.messages.length > 0) {
        allMessages = [...allMessages, ...account.messages.map(msg => ({
          sender: msg.sender,
          subject: msg.subject,
          summary: msg.summary,
          category: msg.category
        }))];
      }
    });

    if (allMessages.length === 0) {
      return "No messages found in this report.";
    }

    // Sort messages by category (Essential first)
    allMessages.sort((a, b) => {
      if (a.category === "Essential" && b.category !== "Essential") return -1;
      if (a.category !== "Essential" && b.category === "Essential") return 1;
      return 0;
    });

    // Generate summary text
    const essentialCount = allMessages.filter(m => m.category === "Essential").length;
    const nonEssentialCount = allMessages.filter(m => m.category !== "Essential").length;

    let summaryText = `This report processed ${allMessages.length} emails: ${essentialCount} essential and ${nonEssentialCount} non-essential. `;

    // Add detailed summary for essential messages (up to 3)
    const essentialMessages = allMessages.filter(m => m.category === "Essential").slice(0, 3);
    if (essentialMessages.length > 0) {
      summaryText += "Essential emails include: ";
      essentialMessages.forEach((msg, index) => {
        const sender = msg.sender.includes('<') ? msg.sender.split('<')[0].trim() : msg.sender;
        summaryText += `${sender} regarding "${msg.subject}"`;
        if (index < essentialMessages.length - 1) {
          summaryText += ", ";
        }
      });
      if (essentialCount > 3) {
        summaryText += `, and ${essentialCount - 3} more`;
      }
      summaryText += ". ";
    }

    return summaryText;
  };

  // Calculate message stats with safeguards for zero values
  const calculateStats = (report: Report) => {
    if (!report?.content?.content?.gmail) return { essential: 0, nonEssential: 0, total: 0 };

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
    return { essential, nonEssential, total };
  };

  // Highlight sender names in text
  const renderHighlightedContent = (summaryText: string, report: Report) => {
    if (!report?.content?.content?.gmail) return summaryText;
    
    // Extract all essential senders
    const essentialSenders: string[] = [];
    report.content.content.gmail.forEach(account => {
      if (account.messages) {
        account.messages.forEach(message => {
          if (message.category === "Essential") {
            const sender = message.sender.includes('<') 
              ? message.sender.split('<')[0].trim() 
              : message.sender;
            if (!essentialSenders.includes(sender)) {
              essentialSenders.push(sender);
            }
          }
        });
      }
    });
    
    // Highlight each sender in the text
    let result = summaryText;
    essentialSenders.forEach(sender => {
      const regex = new RegExp(sender, 'g');
      result = result.replace(
        regex,
        `<span class="text-lime-600 font-medium">${sender}</span>`
      );
    });

    return result;
  };

  // Generate content for the report if summary is empty
  const generateContent = (report: Report) => {
    const summaryText = generateSummaryFromMessages(report);
    const highlightedSummary = renderHighlightedContent(summaryText, report);
    
    return (
      <div className="space-y-2">
        <p className="text-sm text-slate-800 leading-relaxed" dangerouslySetInnerHTML={{__html: highlightedSummary}} />

        {report?.content?.content?.gmail && report.content.content.gmail.some(account =>
          account.messages && account.messages.length > 0
        ) && (
          <div className="space-y-2 mt-3 pt-2 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-700">Sample messages:</p>
            {report.content.content.gmail.flatMap(account =>
              account.messages?.slice(0, 2).map((msg, idx) => (
                <div key={`${account.account_id}-${idx}`} className="px-3 py-2 bg-slate-50 rounded-md">
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-medium ${msg.category === "Essential" ? 'text-lime-600' : 'text-slate-800'}`}>
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

    // Clean up function
    return () => {
      setReportLoading(false);
    };
  }, []);

  return (
    <Card className="bg-slate-200/50">
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
              <div className="px-3 py-3 bg-red-50 text-red-800 rounded-md">
                <p className="text-sm">{reportError}</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={fetchReportHistory}>
                  Try Again
                </Button>
              </div>
            ) : latestReport ? (
              <>
                <div className="px-4 py-4 bg-white/80 rounded-md shadow-sm border border-slate-200">
                  {latestReport.content?.summary && Array.isArray(latestReport.content.summary) && latestReport.content.summary.length > 0 ? (
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {latestReport.content.summary.map((item: {
                        type: string;
                        text?: { content: string };
                        email?: { name: string }
                      }, index: number) => {
                        if (item.type === 'text' && item.text) {
                          return <span key={index}>{item.text.content}</span>;
                        } else if (item.type === 'email' && item.email) {
                          return (
                            <span key={index} className="font-medium text-lime-600">
                              {item.email.name}
                            </span>
                          );
                        }
                        return null;
                      })}
                    </p>
                  ) : (
                    generateContent(latestReport)
                  )}
                  <div className="pt-3 flex justify-center sm:justify-start">
                    <Button
                      variant="secondary"
                      onClick={() => latestReport && router.push(`/report/${latestReport.id}`)}
                      disabled={!latestReport || reportLoading}
                      size="sm"
                    >
                      Check Report
                    </Button>
                  </div>
                </div>

                {/* Display stats below content */}
                {reportStats && reportStats.total > 0 && (
                  <div className="flex flex-col gap-2 text-xs bg-slate-50/70 rounded-md p-3">
                    <div className="font-medium text-slate-700 pb-1 border-b border-slate-200/60">
                      {reportStats.total} {reportStats.total === 1 ? "Email" : "Emails"} Processed
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-lime-500"/>
                        <span className="text-slate-700 font-medium">
                          {reportStats.essential} Essential
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-slate-400"/>
                        <span className="text-slate-700 font-medium">
                          {reportStats.nonEssential} Non-essential
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-4 bg-white/80 rounded-md shadow-sm border border-slate-200">
                <p className="text-sm text-slate-800">No report history available. Click refresh to check for reports.</p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
