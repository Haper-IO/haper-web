import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

export const FAQItem = ({ question, answer, value }: FAQItemProps) => {
  return (
    <AccordionItem value={value} className="border-b border-gray-200">
      <AccordionTrigger className="text-lg font-medium py-4 text-left hover:text-lime-600 transition-colors">
        {question}
      </AccordionTrigger>
      <AccordionContent className="text-gray-600 pb-4">
        {answer}
      </AccordionContent>
    </AccordionItem>
  )
}
