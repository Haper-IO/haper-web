'use client'

import {NavigationUnauthenticated} from '@/components/navigation-bar'
import BackgroundPaths from "@/components/background-effect/bg-path-lines";

export default function Home() {
  return (
    <div className="w-full">
      <NavigationUnauthenticated />
      <div className="w-full h-screen overflow-hidden dark:bg-neutral-950 bg-white">
        <BackgroundPaths />
      </div>
    </div>
  )
}
