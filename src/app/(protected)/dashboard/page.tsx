"use client"

import {LatestSummary, LastReport} from "@/app/(protected)/dashboard/dashboard-cards"
import {StatusCard} from "@/app/(protected)/dashboard/status-card"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-transparent relative">

    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
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
        <Separator orientation="vertical" className="mr-2 h-4" />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="space-y-4 backdrop-blur-[1px]">
            {/* Message Tracking Status Section */}
            <StatusCard />
            {/* Latest Summary Section */}
            <LatestSummary/>
            {/* Last Report Section */}
            <LastReport/>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>

      <div className="container mx-auto">
        <div className="space-y-4">
          <div className="space-y-4 backdrop-blur-[1px]">
            {/* Message Tracking Status Section */}
            <StatusCard />
            {/* Latest Summary Section */}
            <LatestSummary/>
            {/* Last Report Section */}
            <LastReport/>
          </div>
        </div>
      </div>

      {/* Background texture */}
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"></div>
    </main>
  )
}