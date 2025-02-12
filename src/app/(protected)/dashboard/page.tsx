"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ArrowUp,
  PanelLeftClose,
  PanelLeft,
  LayoutDashboard,
  History,
  LucideIcon
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { EmailSummary, ReplyHistory, MessageStats } from "@/components/dashboard-cards"

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

  return (
    <div className="min-h-screen bg-white">
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
            {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed top-[61px] left-0 bottom-0 w-60 border-r bg-white transition-transform duration-300 z-10 ${
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
        {/* Dashboard Content */}
        <div className="p-5">
          <div className="grid gap-6">
            <EmailSummary />
            <div className="grid gap-6 md:grid-cols-2">
              <MessageStats />
              <ReplyHistory />
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto mt-12">
            <div className="relative">
              <Input
                placeholder="Quiz me on vocabulary"
                className="w-full pl-4 pr-10 py-6 text-lg rounded-xl border-gray-200 focus:border-gray-300 focus:ring-0"
              />
              <ArrowUp className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button variant="secondary" size="sm" className="rounded-full">
                Search with ChatGPT
              </Button>
              <Button variant="secondary" size="sm" className="rounded-full">
                Talk with ChatGPT
              </Button>
              <Button variant="secondary" size="sm" className="rounded-full">
                Research
              </Button>
              <Button variant="secondary" size="sm" className="rounded-full">
                Sora
              </Button>
              <Button variant="secondary" size="sm" className="rounded-full">
                More
              </Button>
            </div>
          </div>
        </div>

        {/* Fixed Elements */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 animate-bounce">↓</div>
          Scroll to explore
        </div>

        <div className="fixed bottom-0 left-0 right-0 h-[300px] bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-yellow-500/20 blur-3xl -z-10" />
      </main>
    </div>
  )
}
