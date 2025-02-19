// SidebarNav.tsx
import { LucideIcon, LayoutDashboard, History } from "lucide-react"
import Link from "next/link"

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

interface SidebarNavProps {
  isOpen: boolean
}

export function SidebarNav({ isOpen }: SidebarNavProps) {
  return (
    <aside
      className={`fixed top-[61px] left-0 bottom-0 w-60 border-r bg-slate-50/75 transition-transform duration-300 z-10 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
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
  )
}
