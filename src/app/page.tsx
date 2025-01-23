'use client'

import { cn } from '@/lib/utils';
import { Poppins } from "next/font/google";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const font = Poppins({
  subsets: ['latin'],
  weight: '600'}
);

export default function Home()  {

  const router = useRouter();
  const handleSignUp = () => {
    router.push('/register');
  }

  return (
    <main className="flex h-full flex-col items-center justify-center
    bg-violet-950">
      <div className={"space-y-6 text-center"}>
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md",
          font.className)}>
          haper
        </h1>
        <p className="text-center text-slate-200">
          Your unified assistant that automatically collects, prioritizes, and responds to messages across Gmail, WhatsApp, and other platforms
        </p>
        <Button
          variant={"secondary"}
          onClick={handleSignUp}>
          Sign up
        </Button>
      </div>

    </main>
  )
}
