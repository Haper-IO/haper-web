import {Inter} from "next/font/google";
import { cn } from "@/lib/utils";
import { Logo_lg } from "@/icons/logo-lg";

const font = Inter({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = (
  {label}: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="w-full flex flex-col gap-y-4 items-center justify-center">
        <Logo_lg/>
        <p className={"text-muted-foreground text-sm"}>
          {label}
        </p>
      </div>
    </header>
  );
}



