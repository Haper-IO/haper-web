import * as React from "react"
import { cn } from "@/lib/utils"

type CardProps = React.HTMLAttributes<HTMLDivElement>

const Card = ({ className, ...props }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={cn(
        "relative rounded-xl border bg-slate-50/50 text-card-foreground shadow-sm outline-slate-200",
        className
      )}
      {...props}
    />
  )
}
Card.displayName = "Card"

const CardHeader = ({ className, ...props }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pl-6 pr-6 pt-6 pb-4", className)}
      {...props}
    />
  )
}
CardHeader.displayName = "CardHeader"

const CardTitle = ({ className, ...props }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
}
CardTitle.displayName = "CardTitle"

const CardDescription = ({ className, ...props }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}
CardDescription.displayName = "CardDescription"

const CardContent = ({ className, ...props }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
}
CardContent.displayName = "CardContent"

const CardFooter = ({ className, ...props }: CardProps) => {
  const ref = React.useRef<HTMLDivElement>(null)
  return (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
}
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
