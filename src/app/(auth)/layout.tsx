import React, {Suspense} from "react";
import {NavigationUnauthenticated} from '@/components/navigation-bar'

export default function AuthLayout({
  children
} : { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <NavigationUnauthenticated />
      <div className="w-full h-screen flex items-center justify-center">
        <Suspense>
          {children}
        </Suspense>
      </div>
    </div>
  )
}
