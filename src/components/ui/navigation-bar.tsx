'use client'

import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

import { Logo } from "@/icons/logo";

export default function Navigation() {
  const router = useRouter();
  const handleSignUp = () => {
    router.push('/register');
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b">
      <div className="w-full max-w-[1200px] px-4 py-3 flex justify-between items-center mx-auto">
        <Link href={"/"}>
          <div className={"flex"}>
          <Logo/>
          </div>
        </Link>
        <div className="md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              API
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Safety
            </Link>
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          <Button variant="outline" size="sm" onClick={handleSignUp}>
            Join Beta Test
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5"/>
        </Button>
      </div>
    </header>
);
}
