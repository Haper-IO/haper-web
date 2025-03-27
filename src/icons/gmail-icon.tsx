import Image from 'next/image'
import gmailIcon from '@/assets/images/gmail.webp' // or .svg if that's what you have

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
