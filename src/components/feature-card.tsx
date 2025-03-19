import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <div className="flex flex-col items-start p-6 bg-gray-100 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-2 mb-4 bg-gray-50/50 rounded-lg">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
