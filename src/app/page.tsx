'use client'

import { cn } from '@/lib/utils';
import { Poppins } from "next/font/google";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

import BackgroundPaths from "@/components/background-effect/bg-path-lines";

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
    <main className="w-full flex flex-col items-center justify-center
    bg-violet-950">

      <div className={"space-y-6 text-center"}>
        <BackgroundPaths/>
        <h1 className={cn("text-6xl font-semibold text-white drop-shadow-md",
          font.className)}>
          haper
        </h1>
        <p className="text-center text-slate-200">
          Your unified assistant that automatically collects, prioritizes, and responds to messages across Gmail,
          WhatsApp, and other platforms
        </p>
        <div
          className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
        >
          <Button
            variant="ghost"
            className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100
                            text-black dark:text-white transition-all duration-300
                            group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
            onClick={handleSignUp}
          >
            <span className="opacity-90 group-hover:opacity-100 transition-opacity">Discover Excellence</span>
            <span
              className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5
                                transition-all duration-300"
            >
                →
              </span>
          </Button>
        </div>

      </div>

    </main>
  )
}
