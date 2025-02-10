'use client'

import {useRouter} from 'next/navigation';
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";

import {Logo_md} from "@/icons/logo-md";

export function NavigationUnauthenticated() {
  const router = useRouter();

  return (
    <header
      className="fixed left-0 top-0 right-0 flex z-50 items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-sm border-b"
    >
      <div className="w-full max-w-[1200px] px-4 py-3 flex justify-between items-center mx-auto">
        <Link href="/">
          <div className={"flex"}>
            <Logo_md/>
          </div>
        </Link>
        <div className="md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            {/*//TODO: add safety page*/}
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              Safety
            </Link>
            {/*//TODO: add about page*/}
            <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
          <Button variant="outline" size="sm" onClick={() => {
            router.push('/register');
          }}>
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
