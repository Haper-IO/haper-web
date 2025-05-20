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
    <div className="flex flex-col items-start p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-2 mb-4 bg-gray-50/50 rounded-lg">
        {icon}
      </div>
      <div className="flex items-center gap-2 mb-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        {badge}
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
