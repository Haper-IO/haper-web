import Image from 'next/image'
import gmailIcon from '@/assets/images/gmail.webp'
import outlookIcon from "@/assets/images/outlook.png"; // or .svg if that's what you have

export function GmailIcon({ className }: { className?: string }) {
  return (
    <Image
      src={gmailIcon}
      alt="Gmail"
      width={24}
      height={24}
      className={className}
    />
  )
}

export function OutlookIcon({ className }: { className?: string }) {
  return (
    <Image
      src={outlookIcon}
      alt="Outlook"
      width={24}
      height={24}
      className={className}
    />
  )
}
