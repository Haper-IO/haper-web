import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
  badge?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FeatureCard = ({ icon, title, description, delay = 0, badge }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-start p-4 sm:p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full">
      <div className="p-2 mb-3 sm:mb-4 bg-gray-50/50 rounded-lg">
        {icon}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2 sm:mb-1 w-full">
        <h3 className="text-base sm:text-lg font-semibold leading-tight">{title}</h3>
        {badge && <div className="self-start sm:self-auto">{badge}</div>}
      </div>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}
