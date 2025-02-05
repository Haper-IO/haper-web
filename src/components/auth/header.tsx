import {Inter} from "next/font/google";
import { cn } from "@/lib/utils";

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
        <h1 className={cn("text-3xl font-semibold",
          font.className)}>
          haper
        </h1>
        <p className={"text-muted-foreground text-sm"}>
          {label}
        </p>
      </div>
    </header>
  );
}



