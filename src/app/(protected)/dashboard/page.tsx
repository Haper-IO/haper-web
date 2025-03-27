"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUp,
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  History,
  LucideIcon,
  Loader2,
  PlayCircle,
  StopCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { EmailSummaryWithStats, EmailSummaryHistory } from "@/components/dashboard-cards"
import { startTracking, stopTracking, getTrackingStatus, TrackingStatus } from "@/lib/requests/client/message-tracking"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SidebarLinkProps {
  href: string
  icon: LucideIcon
  children: React.ReactNode
}

const SidebarLink = ({ href, icon: Icon, children }: SidebarLinkProps) => (
  <Link
    href={href}
    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md group transition-colors"
  >
    <Icon className="h-4 w-4 text-gray-500 group-hover:text-gray-900" />
    <span className="group-hover:text-gray-900">{children}</span>
  </Link>
)

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrackingStatus = async () => {
    try {
      setIsLoading(true)
      const response = await getTrackingStatus()
      setTrackingStatus(Array.isArray(response) ? response[0] : response)
    } catch (err) {
      console.error('Error fetching tracking status:', err)
      setError('Failed to fetch tracking status')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartTracking = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await startTracking()
      setTrackingStatus(Array.isArray(response) ? response[0] : response)
    } catch (err) {
      console.error('Error starting tracking:', err)
      setError('Failed to start message tracking')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStopTracking = async () => {
    if (!trackingStatus?.account_id) return
    
    try {
      setIsLoading(true)
      setError(null)
      const response = await stopTracking(trackingStatus.account_id)
      setTrackingStatus(Array.isArray(response) ? response[0] : response)
    } catch (err) {
      console.error('Error stopping tracking:', err)
      setError('Failed to stop message tracking')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrackingStatus()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
        <div className="px-5 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:flex"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5"/> : <PanelLeft className="h-5 w-5"/>}
          </Button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-[61px] left-0 bottom-0 w-60 border-r bg-slate-50/75 transition-transform duration-300 z-10 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } hidden md:block`}
      >
        <div className="p-5">
          <nav className="space-y-1">
            <SidebarLink href="#" icon={LayoutDashboard}>
              Overview
            </SidebarLink>
            <SidebarLink href="#" icon={History}>
              History
            </SidebarLink>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen pt-[61px] transition-[padding] duration-300 ${
          isSidebarOpen ? "md:pl-60" : "md:pl-0"
        }`}
      >
        {/* Message Tracking Status Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Message Processing Status</h2>
            {trackingStatus?.status === "Ongoing" ? (
              <Button
                onClick={handleStopTracking}
                disabled={isLoading}
                variant="destructive"
                className="flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <StopCircle className="h-4 w-4" />}
                Stop Processing
              </Button>
            ) : (
              <Button
                onClick={handleStartTracking}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />}
                Start Processing
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{trackingStatus?.status || 'Not Started'}</p>
            </div>
            <div>
              <p className="text-gray-500">Last Updated</p>
              <p className="font-medium">
                {trackingStatus?.updated_at 
                  ? new Date(trackingStatus.updated_at).toLocaleString()
                  : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container p-5 center mx-auto">
          <div className="grid gap-6">
            <EmailSummaryWithStats/>
            <EmailSummaryHistory/>
          </div>


        </div>
      </main>
    </div>
  )
}
