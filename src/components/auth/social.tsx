'use client'

import {FcGoogle} from 'react-icons/fc';
// import { FaGithub } from 'react-icons/fa';
import {useRouter} from 'next/navigation';

import {Button} from '@/components/ui/button';
import {googleOAuthRedirect} from "@/app/actions/oauth";

export const Social = ({authType}: { authType: "login" | "signup" }) => {
  const router = useRouter();

  return (
    <div className={"flex items-center w-full gap-x-2"}>
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => googleOAuthRedirect(authType)}
      >
        <FcGoogle className={"w-5 h-5"}/>
        {`${authType === "login" ? "Login" : "Sign Up"} with Google`}
      </Button>
      {/*<Button*/}
      {/*  size = "lg"*/}
      {/*  className = "w-full"*/}
      {/*  variant = "outline"*/}
      {/*  onClick={() => {}}>*/}
      {/*  <FaGithub className={"w-5 h-5"} />*/}
      {/*</Button>*/}
    </div>
  )
}
