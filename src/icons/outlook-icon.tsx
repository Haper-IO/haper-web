import Image from 'next/image'
import outlookIcon from '@/assets/images/outlook.png' // or .svg if that's what you have

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