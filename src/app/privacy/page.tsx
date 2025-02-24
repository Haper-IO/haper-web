'use client';

import React from 'react'
import { Footer } from '@/components/Footer'
import { NavigationUnauthenticated } from '@/components/navigation-bar'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationUnauthenticated />

      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <div className="my-10">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <p>
              Welcome to InfoFilter (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We respect your privacy and are committed to protecting
              your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard
              your information when you use our information filtering platform.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2"><strong>Account Information</strong>: Name, email address, password, profile information</li>
              <li className="mb-2"><strong>Third-Party Account Access</strong>: With your explicit permission, we access your accounts on platforms like Gmail, Discord, Slack, etc.</li>
              <li className="mb-2"><strong>Communication Preferences</strong>: Your settings for summaries and auto-replies</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2"><strong>Usage Data</strong>: Interactions with our service, features used, time spent</li>
              <li className="mb-2"><strong>Device Information</strong>: IP address, browser type, operating system</li>
              <li className="mb-2"><strong>Cookies and Similar Technologies</strong>: For functionality, analytics, and personalization</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Provide our core message filtering, summarization, and auto-reply services</li>
              <li className="mb-2">Authenticate your identity and maintain your account</li>
              <li className="mb-2">Analyze and improve our platform</li>
              <li className="mb-2">Communicate with you about service updates</li>
              <li className="mb-2">Comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Third-Party Integrations</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">4.1 Gmail Integration</h3>
            <p>When you connect your Gmail account, we:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Access your emails to generate summaries and auto-replies</li>
              <li className="mb-2">Store necessary metadata to maintain functionality</li>
              <li className="mb-2">Do not permanently store full email content after processing</li>
              <li className="mb-2">Cannot send emails without your authorization</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">4.2 Other Platform Integrations</h3>
            <p>
              Similar access patterns apply to Discord, Slack, and other supported platforms,
              each requiring explicit authorization.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Third-party service providers who help deliver our services</li>
              <li className="mb-2">Legal authorities when required by law</li>
              <li className="mb-2">Business partners with your consent</li>
              <li className="mb-2">In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>We do not sell your personal information.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information,
              including encryption, access controls, and regular security assessments.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have rights to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Access your personal information</li>
              <li className="mb-2">Correct inaccurate data</li>
              <li className="mb-2">Delete your data</li>
              <li className="mb-2">Restrict/object to processing</li>
              <li className="mb-2">Data portability</li>
              <li className="mb-2">Withdraw consent</li>
            </ul>
            <p>To exercise these rights, contact us at privacy@infofilter.com.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Children&apos;s Privacy</h2>
            <p>
              Our service is not directed to children under 16. We do not knowingly collect information
              from children under 16.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. International Data Transfers</h2>
            <p>
              We may transfer your information to countries other than your residence. We ensure
              appropriate safeguards are in place to protect your information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of material changes
              via email or through our platform.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Google API Services User Data Policy</h2>
            <p>
              Our use and transfer of information received from Google APIs to any other app will adhere to
              <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline"> Google API Services User Data Policy</a>,
              including the Limited Use requirements.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Email: privacy@infofilter.com</li>
              <li className="mb-2">Address: 123 Filter Street, San Francisco, CA 94105</li>
            </ul>

            <p className="mt-8 text-sm text-gray-500">Last Updated: February 19, 2025</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
