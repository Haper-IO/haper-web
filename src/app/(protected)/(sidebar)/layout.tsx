"use client"

import {AppSidebar} from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {Button} from "@/components/ui/button";
import {useFeedbackForm} from "@/hooks/tally-form";
import {useUserInfo} from "@/hooks/user-info";

export default function SidebarLayout({
                                        children,
                                      }: {
  children: React.ReactNode
}) {
  const {userInfo} = useUserInfo()
  const openTallyForm = useFeedbackForm()

  return (
    <main className="min-h-screen bg-transparent relative">
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          {children}
        </SidebarInset>
      </SidebarProvider>

      {/* Background texture */}
      <div
        className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] opacity-50"
      />

      {/*feedback form*/}
      <Button
        className="fixed right-4 top-4 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-full px-4 py-2 text-sm"
        onClick={userInfo ? () => openTallyForm(userInfo.id, userInfo.email) : undefined}
      >
        Give Feedback
      </Button>
    </main>
  )
}
