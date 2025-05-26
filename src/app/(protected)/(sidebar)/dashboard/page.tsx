"use client"

import {LatestSummary, LastReport} from "@/app/(protected)/(sidebar)/dashboard/dashboard-cards"
import {StatusCard} from "@/app/(protected)/(sidebar)/dashboard/status-card"
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
import {useEffect} from "react";
import {useNextStep} from "nextstepjs";

export default function DashboardPage() {
  const { startNextStep } = useNextStep();

  useEffect(() => {
    if (!localStorage.getItem("user-guide-done")) {
      startNextStep("mainTour")
      localStorage.setItem("user-guide-done", "true");
    }

  }, [startNextStep]);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-3 p-2 pt-0">
        <div className="space-y-3 backdrop-blur-[1px]">
          {/* Message Tracking Status Section */}
          <StatusCard />
          {/* Latest Summary Section */}
          <LatestSummary/>
          {/* Last Report Section */}
          <LastReport/>
        </div>
      </div>
    </>
  )
}
