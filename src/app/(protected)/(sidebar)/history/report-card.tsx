import {Report} from "@/lib/modal/report";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getReportHistory} from "@/lib/requests/client/report";
import {Mail, RefreshCw} from "lucide-react";
import {GmailIcon, OutlookIcon} from "@/icons/provider-icons";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Skeleton} from "@/components/ui/skeleton";
import {Button} from "@/components/ui/button";
import RichContent from "@/components/rich-content";
import {formatUpdateTime} from "@/lib/utils";

export function ReportCard({ report: providedReport }: { report?: Report }) {
  const router = useRouter();
  const [latestReport, setLatestReport] = useState<Report | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState<string | null>(null);

  // Use provided report or fetched report
  const report = providedReport || latestReport;

  // Determine which email providers are present in the report
  const hasGmail = report?.content?.content?.gmail && report?.content?.content?.gmail.length > 0;
  const hasOutlook = report?.content?.content?.outlook && report?.content?.content?.outlook.length > 0;

  const fetchReportHistory = () => {
    if (reportLoading || providedReport) {
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
  const calculateStats = (reportData: Report) => {
    if (!reportData?.content?.content?.gmail) return {essential: 0, nonEssential: 0, total: 0};

    let essential = 0;
    let nonEssential = 0;

    reportData.content.content.gmail.forEach(account => {
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

  const reportStats = report ? calculateStats(report) : null;

  useEffect(() => {
    // Only fetch if no report was provided
    if (!providedReport) {
      fetchReportHistory();
    }
  }, [providedReport]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Badge variant="outline" size="md" className="bg-slate-50 text-slate-700 border-slate-300 font-medium">{providedReport ? "Report" : "Last Report"}</Badge>
        {report ? (
          <Badge variant="secondary" size="md">
            {formatUpdateTime(report.created_at)}
          </Badge>
        ) : reportLoading ? (
          <Skeleton className="h-6 w-32"/>
        ) : (
          <Badge variant="secondary" size="md">No data available</Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          {!providedReport && (
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
          )}
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
            ) : report ? (
              <>
                <div
                  className="px-4 py-4 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70">
                  {report.content.summary && report.content.summary.length > 0 ? (
                    <RichContent richTextList={report.content.summary}></RichContent>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No essential emails in this report</p>
                  )}
                  <div className="pt-3 flex justify-center sm:justify-start">
                    <Button
                      variant="secondary"
                      onClick={() => report && router.push(`/report/${report.id}`)}
                      disabled={!report || reportLoading}
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
