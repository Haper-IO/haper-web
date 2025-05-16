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
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getReportHistory } from "@/lib/requests/client/report"
import { Report } from "@/lib/modal/report"
import { LastReport } from "@/app/(protected)/(sidebar)/dashboard/dashboard-cards"
import { HistoryPagination } from "./pagination"

export default function HistoryPage() {
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
              <div key={report.id} className="mb-4">
                <LastReport report={report} />
              </div>
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