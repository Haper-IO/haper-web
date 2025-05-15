"use client"

import { useState, useEffect } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { getReportHistory } from "@/lib/requests/client/report"
import { Report } from "@/lib/modal/report"
import RichContent from "@/components/rich-content"
import { GmailIcon, OutlookIcon } from "@/icons/provider-icons"
import { HistoryPagination } from "./pagination"

export default function HistoryPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 5

  // Fetch report history
  const fetchReportHistory = () => {
    if (loading) return
    
    setLoading(true)
    setError(null)

    getReportHistory(currentPage, pageSize)
      .then((resp) => {
        setReports(resp.data.reports || [])
        setTotalPages(resp.data.total_page || 1)
      })
      .catch(() => {
        setError("Failed to load report history")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Fetch reports when component mounts or page changes
  useEffect(() => {
    fetchReportHistory()
  }, [currentPage])

  // ReportCard component to display a single report
  const ReportCard = ({ report }: { report: Report }) => {
    // Determine which email providers are present in the report
    const hasGmail = report?.content?.content?.gmail && report?.content?.content?.gmail.length > 0
    const hasOutlook = report?.content?.content?.outlook && report?.content?.content?.outlook.length > 0

    // Calculate message stats
    const calculateStats = () => {
      if (!report?.content?.content?.gmail) return {essential: 0, nonEssential: 0, total: 0}

      let essential = 0
      let nonEssential = 0

      report.content.content.gmail.forEach(account => {
        if (account.messages) {
          account.messages.forEach(message => {
            if (message.category === "Essential") {
              essential++
            } else {
              nonEssential++
            }
          })
        }
      })

      const total = essential + nonEssential
      return {essential, nonEssential, total}
    }

    // Render appropriate email provider icons
    const renderEmailProviderIcons = () => {
      if (!report || (!hasGmail && !hasOutlook)) {
        return <span className="text-gray-400 text-xs">No providers</span>
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
      )
    }

    const reportStats = calculateStats()

    return (
      <Card className="bg-slate-200/40 backdrop-blur-[2px]">
        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
          <Badge variant="default" size="md">Report</Badge>
          <Badge variant="secondary" size="md">
            {new Date(report.created_at).toLocaleString()}
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            {renderEmailProviderIcons()}
          </div>
        </CardHeader>

        <div className="flex flex-col md:flex-row flex-wrap gap-4 relative">
          <CardContent className="flex-1 min-w-[300px] space-y-4 md:min-w-[420px]">
            <div className="px-4 py-4 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70">
              {report.content.summary && report.content.summary.length > 0 ? (
                <RichContent richTextList={report.content.summary} />
              ) : (
                <p className="text-sm text-slate-500 italic">No essential emails in this report</p>
              )}
              <div className="pt-3 flex justify-center sm:justify-start">
                <Button
                  variant="secondary"
                  onClick={() => router.push(`/report/${report.id}`)}
                  size="sm"
                  className="bg-slate-200/90 hover:bg-slate-300/90 text-slate-800"
                >
                  Check Report
                </Button>
              </div>
            </div>

            {/* Display stats below content */}
            {reportStats && reportStats.total > 0 && (
              <div className="flex flex-col gap-2 text-xs bg-slate-50/70 backdrop-blur-[2px] rounded-md p-3 border border-slate-200/60">
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
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <>      
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Report History</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-col gap-6 p-4">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 2 }).map((_, index) => (
            <Card key={index} className="bg-slate-200/40 backdrop-blur-[2px]">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-32 ml-2" />
                <div className="ml-auto">
                  <Skeleton className="h-8 w-8" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))
        ) : error ? (
          // Error message
          <div className="px-4 py-4 bg-red-50/90 text-red-800 rounded-md backdrop-blur-[2px]">
            <p>{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2" 
              onClick={fetchReportHistory}
            >
              Try Again
            </Button>
          </div>
        ) : reports.length === 0 ? (
          // No reports
          <div className="px-4 py-4 bg-white/70 backdrop-blur-[2px] rounded-md shadow-sm border border-slate-200/70">
            <p className="text-sm text-slate-800">No report history available.</p>
          </div>
        ) : (
          // Report list
          <>
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
            
            {/* Use the extracted pagination component */}
            <HistoryPagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </>
  )
}
