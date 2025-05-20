'use client'

import { useRef } from 'react'
import { NavigationUnauthenticated } from '@/components/navigation-bar'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle, MessageSquare, Clock, Filter, Zap, Tag, Compass, ThumbsUp } from 'lucide-react'
import { Accordion } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'

import { FeatureCard } from "@/components/feature-card";
import { FAQItem } from "@/components/faq-item";
import { TestimonialCard } from "@/components/testimonial-card";
import { FadeInWhenVisible } from "@/components/background-effect/fade-in-when-visible";

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

      {/* Hero Section */}
      <section className="relative min-h-screen py-8 md:py-16 bg-slate-50/75">
        <div className="flex items-center space-x-2 justify-center mb-4">
          <Badge className={"mb-4 bg-slate-50"} variant="homepage_section" size="lg">
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <motion.div
                animate={{scale: [1, 1.1, 1]}}
                transition={{duration: 2, repeat: Infinity}}
              >
                <Clock className="h-4 w-4 text-gray-600"/>
              </motion.div>
            </div>
            Save 5+ Hours Weekly & Eliminate Email Overwhelm
          </Badge>
        </div>

        {/* Content Container */}
        <div className="relative container px-4 mx-auto z-10">
          <div className="max-w-4xl mx-auto text-center mb-1">
            <motion.h1
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.8, ease: "easeOut"}}
              className="text-4xl md:text-5xl lg:text-6xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-800 via-gray-500 to-gray-600 mb-4 pb-1"
            >
              Manage Emails with Your Personal AI Front Desk
            </motion.h1>

            <div className="mt-8 mx-auto max-w-5xl rounded-2xl overflow-hidden border border-gray-200 shadow-xl mb-8">
              <Image 
                src="/haper_homepage_1.png"
                alt="Haper Email Summary Interface"
                width={1000}
                height={500}
                className="w-full object-contain"
                priority
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Start Free Trial
              </Button>
              <Button variant="outline" onClick={scrollToFeatures} className="" size="lg">
                See How It Works <ChevronDown size={18}/>
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white" ref={featuresRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <FadeInWhenVisible>
              <Badge className={"mb-4"} variant="homepage_section" size="lg"><Zap size={14} className={"mr-1"}/>Features</Badge>
              <h2 className="text-3xl font-medium mb-4">
                Smart features designed to save you time
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our AI-powered tools help you focus on what really matters by intelligently managing your inbox.
              </p>
            </FadeInWhenVisible>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Filter className="h-6 w-6 text-gray-600"/>}
              title="Smart Email Filtering"
              description="Automatically categorizes emails based on importance, saving you from inbox overload."
              delay={0.1}
            />

            <FeatureCard
              icon={<Clock className="h-6 w-6 text-gray-600"/>}
              title="Daily Summaries"
              description="Get concise reports of your important emails, helping you quickly catch up on what matters."
              delay={0.2}
            />

            <FeatureCard
              icon={<Zap className="h-6 w-6 text-gray-600"/>}
              title="Suggested Actions"
              description="Smart suggestions for how to handle each email, from replies to scheduling and archiving."
              delay={0.3}
            />

            <FeatureCard
              icon={<MessageSquare className="h-6 w-6 text-gray-600"/>}
              title="Chat Interface"
              description="Interact with your emails through a natural chat interface for quick actions."
              badge={<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none" size="sm">Coming soon</Badge>}
              delay={0.4}
            />

            <FeatureCard
              icon={<Tag className="h-6 w-6 text-gray-600"/>}
              title="Topic Tracking"
              description="Keep track of key topics across your emails without manual sorting."
              badge={<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none" size="sm">Coming soon</Badge>}
              delay={0.5}
            />

            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-gray-600"/>}
              title="Auto Organization"
              description="Let Haper clean and categorize your inbox automatically."
              badge={<Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 shadow-none" size="sm">Coming soon</Badge>}
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

                <Badge className={"mb-4"} variant="homepage_section" size="lg"><Compass size={14} className={"mr-1"}/> Our Vision</Badge>

                <h2 className="text-2xl font-medium mb-6">Enable users to focus on what the matter without worry about less important messages</h2>

                <p className="text-gray-700 mb-6">
                  At Haper, we believe your inbox should work for you, not against you. Our vision is to create a world
                  where email is no longer a source of stress but a tool that adapts to your needs.
                </p>
                <p className="text-gray-700 mb-6">
                  We&apos;re building an email experience that understands context, recognizes patterns, and helps you make
                  decisions
                  faster, letting you focus on what truly matters.
                </p>
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
              <Badge className={"mb-4"} variant="homepage_section" size="lg"> <ThumbsUp size={12} className={"mr-1"}/>Testimonials</Badge>
              <h2 className="text-3xl font-medium mb-4">What Our Early Users Say</h2>
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
                  <h2 className="text-3xl font-medium mb-4">Join Our Beta Program</h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Be among the first to experience Haper and help shape the future of email management.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.div
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                  >
                    <Button variant="default" size={"lg"}>
                      Request Beta Access
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                  >
                    <Button variant="outline" size={"lg"}>
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
              <h2 className="text-3xl font-medium mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-gray-600">
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
                &copy; {new Date().getFullYear()} Built in 2025. Haper. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
