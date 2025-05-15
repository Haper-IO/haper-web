import Image from 'next/image'
import waitingIllustration from '@/assets/images/waiting_illustration.svg';

export function WaitingIllustration ({ className }: { className?: string }) {
  return (
    <Image
      src={waitingIllustration}
      alt="Waiting"
      width={200}
      height={200}
      className={className}
    />
  )
}
