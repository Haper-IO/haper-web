'use client'

import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { Logo_md } from "@/icons/logo-md"
import { useState } from "react"

const NavigationLinks = () => (
  <>
    <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
      Safety
    </Link>
    <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
      About
    </Link>
  </>
)

export function NavigationUnauthenticated() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 right-0 z-50 bg-slate-50/20 backdrop-blur-sm border-b">
      <div className="w-full max-w-[1200px] px-4 py-3 flex justify-between items-center mx-auto relative">
        <Link href="/">
          <div className="flex">
            <Logo_md />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6">
            <NavigationLinks />
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/register')}
          >
            Join Beta Test
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b md:hidden">
            <div className="px-4 py-3 flex flex-col gap-4">
              <nav className="flex flex-col gap-4">
                <NavigationLinks />
              </nav>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/register')}
                className="w-full"
              >
                Join Beta Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export function NavigationAuthenticated() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="fixed left-0 top-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b">
      <div className="w-full max-w-[1200px] px-4 py-3 flex justify-between items-center mx-auto relative">
        <Link href="/">
          <div className="flex">
            <Logo_md />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <NavigationLinks />
          </nav>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/register')}
          >
            Join Beta Test
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b md:hidden">
            <div className="px-4 py-3 flex flex-col gap-4">
              <nav className="flex flex-col gap-4">
                <NavigationLinks />
              </nav>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/register')}
                className="w-full"
              >
                Join Beta Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
