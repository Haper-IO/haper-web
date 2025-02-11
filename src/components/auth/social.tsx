'use client'

import {FcGoogle} from 'react-icons/fc';
// import { FaGithub } from 'react-icons/fa';

import {Button} from '@/components/ui/button';
import {oauthRedirect} from "@/app/actions/oauth";

export const Social = ({authType}: { authType: "login" | "signup" }) => {

  return (
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
