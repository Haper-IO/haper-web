'use client'

import { useRef } from 'react'
import { NavigationUnauthenticated } from '@/components/navigation-bar'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ChevronDown, CheckCircle, MessageSquare, Clock, Filter, Zap, Tag } from 'lucide-react'
import {
  Accordion,
} from "@/components/ui/accordion"

import { FeatureCard } from "@/components/feature-card";
import { FAQItem } from "@/components/faq-item";
import { TestimonialCard } from "@/components/testimonial-card";
import { GradientTitle } from "@/components/text-effect/header-gradient";
import { FadeInWhenVisible } from "@/components/background-effect/fade-in-when-visible";

import Spline from '@splinetool/react-spline';

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

      <section className="relative min-h-screen py-24 md:py-32 bg-slate-50/75">
        {/* Spline Background Container */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <Spline
            scene="https://prod.spline.design/qvpf9Bfmso51VoKI/scene.splinecode"
            className="w-full h-full pointer-events-none"
            onLoad={(spline) => {
              spline.setZoom(0.6); // Adjust scene zoom level
            }}
            onMouseDown={(e) => e.preventDefault()} // Prevent scene interactions
          />
        </div>

        {/* Content Container */}
        <div className="container px-4 mx-auto relative z-10">
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
                className="bg-lime-600 hover:bg-lime-500 text-white px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
                size="lg"
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                onClick={scrollToFeatures}
                className="border-gray-300 hover:bg-gray-100 text-gray-700 px-8 py-6 text-lg rounded-lg flex items-center gap-2 backdrop-blur-sm"
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
                &copy; {new Date().getFullYear()} Built in 2025. Haper. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
