import { Mail, RefreshCw, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getNewestReport, Report, ReportResponse } from "@/lib/requests/client/report"
import { Skeleton } from "@/components/ui/skeleton"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"

const mockReport: ReportResponse = {
  "report": {
    "content": {
      "content": {
        "content_source": [
          "gmail"
        ],
        "gmail": [
          {
            "account_id": "9b5f44cc-af57-4c59-ac53-b4e5a94907cc",
            "email": "kaigezhengzz@gmail.com",
            "messages": [
              {
                "action": "Read",
                "action_result": null,
                "category": "Essential",
                "id": 0,
                "message_id": "195ee6ac5c01b870",
                "receive_at": "2025-03-31T22:55:18+00:00",
                "sender": "Kaige Zheng <phantomgran@gmail.com>",
                "subject": "Fwd: Talk about Travel Plan for next week",
                "summary": "Billy reminds Kaige about their upcoming travel plan with Dr. Bieler, emphasizing the need to schedule the flight and requesting a password number by tomorrow, stressing its urgency.",
                "tags": [
                  "Travel",
                  "Urgent",
                  "Planning",
                  "Request",
                  "Communication"
                ],
                "thread_id": "195ee5cac52ce2c4"
              },
              {
                "action": "Read",
                "action_result": null,
                "category": "Essential",
                "id": 0,
                "message_id": "195ee6b39f055ff1",
                "receive_at": "2025-03-31T22:55:47+00:00",
                "sender": "Grant Z <phantomgran1@gmail.com>",
                "subject": "Fwd: Please fix the direction in your thesis proposal",
                "summary": "Grant emphasizes the need for Kaige to adhere to the specified direction in their thesis proposal, focusing on niobium heat treatment topics and requests feedback by tomorrow.",
                "tags": [
                  "Thesis",
                  "Direction",
                  "Niobium",
                  "Heat Treatment",
                  "Urgent"
                ],
                "thread_id": "195ee58f9ffaee48"
              }
            ]
          }
        ],
        "outlook": []
      },
      "messages_in_queue": {
        "gmail": 0
      },
      "summary": [
        {
          "text": {
            "content": "You have received 1 email from "
          },
          "type": "text"
        },
        {
          "email": {
            "address": "phantomgran@gmail.com",
            "name": "Kaige Zheng"
          },
          "type": "email"
        },
        {
          "text": {
            "content": " regarding the travel plan for next week, where Billy reminds Kaige about scheduling the flight and requests a password number by tomorrow, stressing its urgency. Additionally, you have received 1 email from "
          },
          "type": "text"
        },
        {
          "email": {
            "address": "phantomgran1@gmail.com",
            "name": "Grant Z"
          },
          "type": "email"
        },
        {
          "text": {
            "content": " regarding the thesis proposal, emphasizing the need to adhere to the specified direction on niobium heat treatment topics and requesting feedback by tomorrow."
          },
          "type": "text"
        }
      ]
    },
    "created_at": "Mon, 31 Mar 2025 22:40:45 GMT",
    "finalized_at": null,
    "id": "a402561c-b584-4c31-827b-f00c4578dec0"
  }
}

const mockReportHistory = {
  "data": {
    "reports": [
      {
        "content": {
          "content": {
            "content_source": ["gmail"],
            "gmail": [
              {
                "account_id": "9b5f44cc-af57-4c59-ac53-b4e5a94907cc",
                "email": "kaigezhengzz@gmail.com",
                "messages": [
                  {
                    "action": "Delete",
                    "action_result": null,
                    "category": "NonEssential",
                    "id": 0,
                    "message_id": "195eea25d3d47039",
                    "receive_at": "2025-03-31T23:56:09+00:00",
                    "sender": "LinkedIn <messages-noreply@linkedin.com>",
                    "subject": "Kaige, add Iris Sun - Product Designer - Center for Career and Professional Development",
                    "summary": "Kaige Zheng has been invited to connect with Iris Sun, a Product Designer. The email encourages Kaige to connect with Iris and highlights mutual connections.",
                    "tags": [
                      "Invitation",
                      "Networking",
                      "LinkedIn",
                      "Connection",
                      "Professional"
                    ],
                    "thread_id": "195eea25d3d47039"
                  }
                ]
              }
            ],
            "outlook": []
          },
          "messages_in_queue": {
            "gmail": 1
          },
          "summary": []
        },
        "created_at": "Mon, 31 Mar 2025 22:56:18 GMT",
        "finalized_at": "Tue, 01 Apr 2025 03:54:02 GMT",
        "id": "d89cfc01-e0f2-4c1d-a61f-b0fb97038b91"
      }
    ],
    "total_page": 7
  },
  "elapsed": 94,
  "message": "success",
  "status": 0,
  "uri": "/api/v1/report/history"
};

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
        .map(message => message.sender),
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

  return {
    title: "Email Summary Report",
    updateTime: new Date(report.created_at).toLocaleString(),
    summaries: report.content.summary ?
      report.content.summary.map(item =>
        item.type === 'text' ? item.text?.content :
          item.type === 'email' ? item.email?.name :
            null
      ).filter(Boolean) : [],
    accountReports,
    totalCounts
  };
}


// Email Summary Component
export function EmailSummaryWithStats() {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(null);
  const [generatedReport, setGeneratedReport] = useState<Report | null>(mockReport.report);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Determine which email providers are present in the report
  const hasGmail = (report as Report)?.content?.content?.gmail && (report as Report)?.content?.content?.gmail.length > 0;
  const hasOutlook = (report as Report)?.content?.content?.outlook && (report as Report)?.content?.content?.outlook.length > 0;


  const fetchReport = () => {
    if (reportLoading) {
      return;
    }
    setReportLoading(true);
    setReportError(null);
    getNewestReport()
      .then((resp) => {
        if (resp.data && resp.data.report) {
          setReport(resp.data.report);
          console.log("Report fetched:", resp.data.report);
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

    // Simulate API call with mock data
    setTimeout(() => {
      console.log("Report generation started with mock data");
      setGeneratedReport(mockReport.report);
      setIsGenerating(false);
    }, 1000);
  };

  const reportSummary = generatedReport? transToReportSummary(generatedReport) : null;

  const reportSummaryData = reportSummary ? {
    title: reportSummary.title,
    content: reportSummary.summaries.join(" "),
    highlightedPeople: reportSummary.accountReports?.flatMap(account =>
      account.essentialSenders.map((name: string) => ({ name }))
    ) || []
  } : null;

  const reportStatsData = reportSummary ? {
    essentialCount: reportSummary.totalCounts.essential,
    nonEssentialCount: reportSummary.totalCounts.nonEssential,
    essentialPercentage: reportSummary.totalCounts.essential / (reportSummary.totalCounts.essential + reportSummary.totalCounts.nonEssential) * 100,
    nonEssentialPercentage: reportSummary.totalCounts.nonEssential / (reportSummary.totalCounts.essential + reportSummary.totalCounts.nonEssential) * 100
  } : null;


  // Function to highlight names
  const renderHighlightedContent = (content: string, highlights: Array<{ name: string }>) => {
    let result = content;
    highlights.forEach(person => {
      const regex = new RegExp(person.name, 'g');
      result = result.replace(
        regex,
        `<span class="text-lime-600 font-medium">${person.name}</span>`
      );
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
        {generatedReport ? (
          <Badge variant="secondary" size="md">
            Created {new Date(generatedReport.created_at).toLocaleString()}
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
                  <Button variant="outline" size="sm" onClick={fetchReport}>
                    Try Again
                  </Button>
                </div>
              </div>
            ) : reportSummaryData ? (
              <>
                <h3 className="font-medium text-black-900">{reportSummaryData.title}</h3>
                <div className="px-4 py-4 bg-white rounded-md shadow-sm border border-slate-200 max-w-[800px]">
                  {renderHighlightedContent(reportSummaryData.content, reportSummaryData.highlightedPeople)}
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
              <div className="px-3 py-3 bg-white-50/70 rounded-md">
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
            ) : reportStatsData ? (
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
              <div className="flex justify-center items-center h-40">
                <p className="text-sm text-gray-500">No statistics available</p>
              </div>
            )}
          </CardContent>
        </div>

        {/* Button Section */}
        <CardContent>
          <div className="pt-3 flex justify-center sm:justify-start">
            <Button
              variant="default"
              onClick={() => router.push("/report")}
              disabled={!report || reportLoading || isGenerating}
            >
              Quick Batch Actions
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export function EmailSummaryHistory({
  onCheckLastReport
}: {
  onCheckLastReport?: () => void
}) {
  const router = useRouter();
  const [report, setReport] = useState<Report | null>(mockReport.report);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Determine which email providers are present in the report
  const hasGmail = report?.content?.content?.gmail && report?.content?.content?.gmail.length > 0;
  const hasOutlook = report?.content?.content?.outlook && report?.content?.content?.outlook.length > 0;

  // Get data from report if available
  const reportSummaryData = report ? {
    title: "Previous Email Report",
    updateTime: new Date(report.created_at).toLocaleString(),
    content: report.content.summary.map((item: { type: string; text?: { content: string }; email?: { name: string } }, index: number) => {
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
    })
  } : null;

  const fetchHistoryReport = () => {
    if (reportLoading) {
      return;
    }
    setReportLoading(true);
    setReportError(null);
    getNewestReport()
      .then((response) => {
        if (response.data && response.data.report) {
          setReport(response.data.report);
          console.log("History report fetched:", response.data.report);
        }
      })
      .catch((error) => {
        console.error("Error fetching history report:", error);
        setReportError("Failed to load report history");
      })
      .finally(() => {
        setReportLoading(false);
      });
  };

  useEffect(() => {
    fetchHistoryReport();
  }, []);


  const handleCheckLastReport = () => {
    if (onCheckLastReport) {
      onCheckLastReport();
    } else {
      router.push("/report");
    }
  };

  // Render appropriate email provider icons
  const renderEmailProviderIcons = () => {
    if (!report || (!hasGmail && !hasOutlook)) {
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
        <Badge variant="default" size="md">Last Report</Badge>
        {report ? (
          <Badge variant="secondary" size="md">
            Updated {new Date(report.created_at).toLocaleString()}
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
            onClick={fetchHistoryReport}
            disabled={reportLoading}
          >
            <RefreshCw className={`h-4 w-4 ${reportLoading ? 'animate-spin' : ''}`}/>
            <span className="sr-only">Refresh</span>
          </Button>
          {renderEmailProviderIcons()}
        </div>
      </CardHeader>
      <CardContent className="container space-y-4">
        {reportLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-6 w-64"/>
            <Skeleton className="h-24 w-full"/>
          </div>
        ) : reportError ? (
          <div className="px-3 py-3 bg-red-50 text-red-800 rounded-md">
            <p className="text-sm">{reportError}</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={fetchHistoryReport}>
              Try Again
            </Button>
          </div>
        ) : report && reportSummaryData ? (
          <>
            <h3 className="font-medium text-gray-900">{reportSummaryData.title}</h3>
            <div className="text-md px-3 py-3 bg-slate-50/70 rounded-md">
              <p className="text-sm text-slate-800 leading-relaxed">
                {reportSummaryData.content}
              </p>
            </div>
            {/* Display provider information if available */}
            {(hasGmail || hasOutlook) && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Data sources:</span>
                {hasGmail && (
                  <span className="flex items-center gap-1">
                  <GmailIcon className="h-3 w-3"/>
                  Gmail
                </span>
                )}
                {hasOutlook && (
                  <span className="flex items-center gap-1">
                  <OutlookIcon className="h-3 w-3"/>
                  Outlook
                </span>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="px-3 py-3 bg-slate-50/70 rounded-md">
            <p className="text-sm text-slate-800">No report history available. Click refresh to check for reports.</p>
          </div>
        )}
        <div className="pt-3">
          <Button
            variant="outline"
            className="ml-auto"
            onClick={handleCheckLastReport}
            disabled={!report || reportLoading}
          >
            Check Last Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function LastReport() {
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
    
    // For development, use mock data
    setTimeout(() => {
      // Use type assertion to overcome type mismatch
      setLatestReport(mockReportHistory.data.reports[0] as unknown as Report);
      setReportLoading(false);
    }, 500);
  };

  useEffect(() => {
    // Initial load uses the mock data
    setLatestReport(mockReportHistory.data.reports[0] as unknown as Report);
    
    // Clean up function
    return () => {
      setReportLoading(false);
    };
  }, []);

  // Generate content for the report if summary is empty
  const generateContent = (report: Report) => {
    if (report?.content?.content?.gmail && report.content.content.gmail.length > 0) {
      const messages = report.content.content.gmail[0].messages;
      if (messages && messages.length > 0) {
        // Just show summary of the first message
        return (
          <div>
            <p className="text-sm text-slate-800">
              {messages[0].summary}
            </p>
            <div className="mt-2 text-xs text-slate-600">
              <span className="font-medium">From:</span> {messages[0].sender.includes('<') ? messages[0].sender.split('<')[0].trim() : messages[0].sender}
            </div>
          </div>
        );
      }
    }
    return <span>No content available for this report</span>;
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

  // Calculate message stats
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
  
  const reportStats = latestReport ? calculateStats(latestReport) : null;

  return (
    <Card className="bg-slate-200/50">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Badge variant="emphasis" size="md">Last Report</Badge>
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
                <div className="px-4 py-4 bg-white rounded-md shadow-sm border border-slate-200">
                  {latestReport.content.summary && latestReport.content.summary.length > 0 ? 
                    latestReport.content.summary.map((item: { type: string; text?: { content: string }; email?: { name: string } }, index: number) => {
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
                    }) : 
                    generateContent(latestReport)
                  }
                </div>
                
                {/* Display stats below content */}
                {reportStats && reportStats.total > 0 && (
                  <div className="flex flex-col gap-2 text-xs bg-slate-50/70 rounded-md p-3">
                    <div className="font-medium text-slate-700 pb-1 border-b border-slate-200/60">
                      {reportStats.total} Emails Processed
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
              <div className="px-4 py-4 bg-white rounded-md shadow-sm border border-slate-200">
                <p className="text-sm text-slate-800">No report history available. Click refresh to check for reports.</p>
              </div>
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
