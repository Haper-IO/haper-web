'use client'

import { Card,
CardContent,
CardHeader,
CardFooter
} from '@/components/ui/card';

import { Header } from '@/components/auth/header';
import { BackButton } from '@/components/auth/back-button';
import React from "react";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import {oauthRedirect} from "@/app/actions/oauth";
import {FcGoogle} from "react-icons/fc";

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
        <div className={"flex items-center w-full gap-x-2"}>
          <Button
            size="lg"
            className="w-full"
            variant="outline"
            onClick={() => oauthRedirect("google", authType)}
          >
            <FcGoogle className={"w-5 h-5"}/>
            {`${authType === "login" ? "Login" : "Sign Up"} with Google`}
          </Button>
        </div>
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
