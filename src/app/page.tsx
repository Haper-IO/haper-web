'use client'

import { useRef, useEffect, ReactNode } from 'react'
import { NavigationUnauthenticated } from '@/components/navigation-bar'
import BackgroundPaths from "@/components/background-effect/bg-path-lines"
import { motion, useInView, useAnimation } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle, MessageSquare, Clock, Filter, Zap, Tag } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Types
interface FadeInWhenVisibleProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  delay?: number;
}

interface FAQItemProps {
  question: string;
  answer: string;
  value: string;
}

// Fade In Animation Component
const FadeInWhenVisible = ({ children, delay = 0, className = "" }: FadeInWhenVisibleProps) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [controls, isInView])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => {
  return (
    <FadeInWhenVisible delay={delay} className="flex flex-col items-start p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-3 mb-4 bg-lime-50 rounded-lg">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </FadeInWhenVisible>
  )
}

// Testimonial Card Component
const TestimonialCard = ({ quote, author, role, delay = 0 }: TestimonialCardProps) => {
  return (
    <FadeInWhenVisible delay={delay} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="mb-4">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9.33333 17.3333C11.5425 17.3333 13.3333 15.5425 13.3333 13.3333C13.3333 11.1241 11.5425 9.33333 9.33333 9.33333C7.12419 9.33333 5.33333 11.1241 5.33333 13.3333C5.33333 15.5425 7.12419 17.3333 9.33333 17.3333Z" fill="#E2E8F0"/>
          <path d="M9.33333 17.3333C11.5425 17.3333 13.3333 19.1242 13.3333 21.3333V24C13.3333 24.7364 12.7364 25.3333 12 25.3333H6.66667C5.93029 25.3333 5.33333 24.7364 5.33333 24V21.3333C5.33333 19.1242 7.12419 17.3333 9.33333 17.3333Z" fill="#E2E8F0"/>
          <path d="M22.6667 17.3333C24.8758 17.3333 26.6667 15.5425 26.6667 13.3333C26.6667 11.1241 24.8758 9.33333 22.6667 9.33333C20.4575 9.33333 18.6667 11.1241 18.6667 13.3333C18.6667 15.5425 20.4575 17.3333 22.6667 17.3333Z" fill="#E2E8F0"/>
          <path d="M22.6667 17.3333C24.8758 17.3333 26.6667 19.1242 26.6667 21.3333V24C26.6667 24.7364 26.0697 25.3333 25.3333 25.3333H20C19.2636 25.3333 18.6667 24.7364 18.6667 24V21.3333C18.6667 19.1242 20.4575 17.3333 22.6667 17.3333Z" fill="#E2E8F0"/>
        </svg>
      </div>
      <p className="text-gray-700 mb-6">{quote}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </FadeInWhenVisible>
  )
}

// FAQ Item Component
const FAQItem = ({ question, answer, value }: FAQItemProps) => {
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

// Gradient Title Component
// Updated GradientTitle with centered text
function GradientTitle({ title }: { title: string }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-lime-600 via-emerald-600 to-lime-600 bg-size-200 animate-gradient-x text-center"
    >
      {title}
    </motion.h1>
  )
}

// Main Component
export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null)

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <NavigationUnauthenticated/>

      {/* Simplified Hero Section */}
      <section className="relative py-24 md:py-32 bg-white/75">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{duration: 1}}
              className="mb-8"
            >
              <GradientTitle title="Reclaim Your Time with Smarter Email Management"/>
            </motion.div>

            <motion.p
              className="text-xl text-gray-600 md:text-2xl mb-12 mx-auto max-w-3xl leading-relaxed"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.3}}
            >
              Transform your inbox from a time-sink to a productivity powerhouse. Haper's AI cuts through
              the noise, giving you back hours every week.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.5}}
            >
              <Button
                className="bg-lime-600 hover:bg-lime-500 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
                size="lg"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                onClick={scrollToFeatures}
                className="border-gray-300 hover:bg-gray-100 text-gray-700 px-8 py-6 text-lg rounded-lg flex items-center gap-2"
                size="lg"
              >
                See How It Works <ChevronDown size={18}/>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white" ref={featuresRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-4">Smart features designed to save you time</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered tools help you focus on what really matters by intelligently managing your inbox.
              </p>
            </FadeInWhenVisible>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Filter className="h-6 w-6 text-lime-600"/>}
              title="Smart Email Filtering"
              description="Automatically categorizes emails based on importance, saving you from inbox overload."
              delay={0.1}
            />

            <FeatureCard
              icon={<Clock className="h-6 w-6 text-lime-600"/>}
              title="Daily Summaries"
              description="Get concise reports of your important emails, helping you quickly catch up on what matters."
              delay={0.2}
            />

            <FeatureCard
              icon={<Zap className="h-6 w-6 text-lime-600"/>}
              title="Suggested Actions"
              description="Smart suggestions for how to handle each email, from replies to scheduling and archiving."
              delay={0.3}
            />

            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-lime-600"/>}
              title="Chat Interface"
              description="Coming soon: Interact with your emails through a natural chat interface for quick actions."
              delay={0.4}
            />

            <FeatureCard
              icon={<Tag className="h-6 w-6 text-lime-600"/>}
              title="Topic Tracking"
              description="Coming soon: Keep track of key topics across your emails without manual sorting."
              delay={0.5}
            />

            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-lime-600"/>}
              title="Auto Organization"
              description="Coming soon: Let Haper clean and categorize your inbox automatically."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:space-x-12">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <FadeInWhenVisible>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-96 flex items-center justify-center">
                  <p className="text-gray-400 text-xl">App Screenshot Placeholder</p>
                </div>
              </FadeInWhenVisible>
            </div>

            <div className="md:w-1/2">
              <FadeInWhenVisible delay={0.2}>
                <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                <p className="text-gray-600 mb-6 text-lg">
                  At Haper, we believe your inbox should work for you, not against you. Our vision is to create a world
                  where
                  email is no longer a source of stress but a tool that adapts to your needs.
                </p>
                <p className="text-gray-600 mb-6 text-lg">
                  We're building an email experience that understands context, recognizes patterns, and helps you make
                  decisions
                  faster, letting you focus on what truly matters.
                </p>

                <div className="flex items-center space-x-4 mt-8">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-lime-100 flex items-center justify-center">
                    <motion.div
                      animate={{scale: [1, 1.1, 1]}}
                      transition={{duration: 2, repeat: Infinity}}
                    >
                      <Clock className="h-6 w-6 text-lime-600"/>
                    </motion.div>
                  </div>
                  <p className="font-medium">Save 5+ hours every week on email management</p>
                </div>
              </FadeInWhenVisible>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-4">What Our Early Users Say</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Feedback from professionals who are already using Haper to transform their inbox.
              </p>
            </FadeInWhenVisible>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Haper has been a game-changer for managing my overflowing inbox. The daily summaries save me at least an hour every day."
              author="Sarah J."
              role="Marketing Director"
              delay={0.1}
            />

            <TestimonialCard
              quote="I love how it automatically categorizes my emails. Finally, I can focus on important messages without getting distracted."
              author="Michael T."
              role="Software Engineer"
              delay={0.2}
            />

            <TestimonialCard
              quote="The suggested actions feature is incredibly accurate. It's like having a personal assistant managing my emails."
              author="Priya K."
              role="Project Manager"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Beta Access Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInWhenVisible>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">Join Our Beta Program</h2>
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Be among the first to experience Haper and help shape the future of email management.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.div
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                  >
                    <Button
                      className="w-full bg-lime-600 hover:bg-lime-500 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all">
                      Request Beta Access
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                  >
                    <Button variant="outline"
                            className="w-full border-gray-300 hover:bg-gray-100 text-gray-700 px-8 py-6 text-lg rounded-lg transition-all">
                      Learn More
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">
                Find answers to common questions about Haper.
              </p>
            </FadeInWhenVisible>
          </div>

          <FadeInWhenVisible delay={0.2}>
            <Accordion type="single" collapsible className="w-full">
              <FAQItem
                value="item-1"
                question="What email providers does Haper support?"
                answer="Currently, Haper supports Gmail, with plans to expand to Outlook, Yahoo Mail, and other providers in the near future."
              />

              <FAQItem
                value="item-2"
                question="Is my email data secure with Haper?"
                answer="Absolutely. We use end-to-end encryption and never store the content of your emails on our servers. Your privacy and security are our top priorities."
              />

              <FAQItem
                value="item-3"
                question="How accurate is the AI in categorizing emails?"
                answer="Our AI achieves over 95% accuracy in identifying important emails. It continuously learns from your interactions to improve over time."
              />

              <FAQItem
                value="item-4"
                question="When will the chat interface be available?"
                answer="The chat interface is currently in development and will be available to beta users within the next few months."
              />

              <FAQItem
                value="item-5"
                question="Is there a cost to join the beta program?"
                answer="The beta program is completely free. Beta users will also receive special pricing when we launch."
              />
            </Accordion>
          </FadeInWhenVisible>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <span className="text-2xl font-bold">haper</span>
            </div>

            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-500">
                &copy; {new Date().getFullYear()} Haper. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
