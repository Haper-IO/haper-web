interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  delay?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const TestimonialCard = ({ quote, author, role, delay = 0 }: TestimonialCardProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="mb-3 sm:mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8">
          <path d="M9.33333 17.3333C11.5425 17.3333 13.3333 15.5425 13.3333 13.3333C13.3333 11.1241 11.5425 9.33333 9.33333 9.33333C7.12419 9.33333 5.33333 11.1241 5.33333 13.3333C5.33333 15.5425 7.12419 17.3333 9.33333 17.3333Z" fill="#E2E8F0"/>
          <path d="M9.33333 17.3333C11.5425 17.3333 13.3333 19.1242 13.3333 21.3333V24C13.3333 24.7364 12.7364 25.3333 12 25.3333H6.66667C5.93029 25.3333 5.33333 24.7364 5.33333 24V21.3333C5.33333 19.1242 7.12419 17.3333 9.33333 17.3333Z" fill="#E2E8F0"/>
          <path d="M22.6667 17.3333C24.8758 17.3333 26.6667 15.5425 26.6667 13.3333C26.6667 11.1241 24.8758 9.33333 22.6667 9.33333C20.4575 9.33333 18.6667 11.1241 18.6667 13.3333C18.6667 15.5425 20.4575 17.3333 22.6667 17.3333Z" fill="#E2E8F0"/>
          <path d="M22.6667 17.3333C24.8758 17.3333 26.6667 19.1242 26.6667 21.3333V24C26.6667 24.7364 26.0697 25.3333 25.3333 25.3333H20C19.2636 25.3333 18.6667 24.7364 18.6667 24V21.3333C18.6667 19.1242 20.4575 17.3333 22.6667 17.3333Z" fill="#E2E8F0"/>
        </svg>
      </div>
      <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 flex-grow leading-relaxed">{quote}</p>
      <div>
        <p className="font-semibold text-sm sm:text-base">{author}</p>
        <p className="text-xs sm:text-sm text-gray-500">{role}</p>
      </div>
    </div>
  )
}
