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
    <main className="w-full flex items-center justify-center">

      <div className="fixed inset-0 w-full h-full overflow-hidden dark:bg-neutral-950 bg-white">
        <BackgroundPaths/>
      </div>

    </main>
  )
}
