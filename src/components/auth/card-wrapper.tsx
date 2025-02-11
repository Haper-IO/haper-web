'use client'

import { Card,
CardContent,
CardHeader,
CardFooter
} from '@/components/ui/card';

import { Header } from '@/components/auth/header';
import { BackButton } from '@/components/auth/back-button';
import { Social } from '@/components/auth/social';
import React from "react";
import {Separator} from "@/components/ui/separator";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  authType: "login" | "signup",
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  authType
}: CardWrapperProps) => {
  return (
    <Card className={"w-[400px] shadow-md"}>
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <div className="flex items-center gap-4 px-4 mb-4">
        <Separator className="flex-1"/>
        <span className="text-sm text-muted-foreground">OR</span>
        <Separator className="flex-1"/>
      </div>
      <CardFooter>
        <Social authType={authType}/>
      </CardFooter>
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}>
        </BackButton>
      </CardFooter>
    </Card>
  )
}
