'use client'

import React from 'react'
import { Footer } from '@/components/Footer'
import { NavigationUnauthenticated } from '@/components/navigation-bar'

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationUnauthenticated />

      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <div className="my-10">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>

          <div className="prose prose-slate max-w-none">
            <p className="text-sm text-gray-500 mb-8">Last Updated: February 19, 2025</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using InfoFilter's services, you agree to be bound by these Terms of Service ("Terms").
              If you disagree with any part of these terms, you may not access our service.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description of Service</h2>
            <p>
              InfoFilter provides an information filtering platform that collects, summarizes, and manages
              messages from various communication platforms (Gmail, Discord, Slack, etc.) with your authorization.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Account Registration and Security</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">3.1 Registration Requirements</h3>
            <p>You must provide accurate, current, and complete information during registration.</p>

            <h3 className="text-xl font-medium mt-6 mb-3">3.2 Account Security</h3>
            <p>
              You are responsible for maintaining the confidentiality of your password and account information.
              Notify us immediately of any unauthorized access.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">3.3 Third-Party Account Access</h3>
            <p>
              Using our service requires granting us limited access to your third-party accounts.
              You represent that you have the authority to grant such access.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Google Account Authorization</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">4.1 Scope of Authorization</h3>
            <p>When connecting your Google account, you authorize us to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Access your Gmail messages</li>
              <li className="mb-2">Create and manage labels</li>
              <li className="mb-2">Send emails on your behalf (for auto-replies only)</li>
              <li className="mb-2">Access basic profile information</li>
            </ul>

            <h3 className="text-xl font-medium mt-6 mb-3">4.2 Limitations</h3>
            <p>We will:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Only access data necessary for providing our services</li>
              <li className="mb-2">Not store your messages beyond what's required for functionality</li>
              <li className="mb-2">Not share your data with unauthorized third parties</li>
              <li className="mb-2">Adhere to all Google API Services User Data Policies</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Violate any laws or regulations</li>
              <li className="mb-2">Impersonate others or misrepresent your affiliation</li>
              <li className="mb-2">Attempt to gain unauthorized access to our systems</li>
              <li className="mb-2">Use our service to distribute spam or malicious content</li>
              <li className="mb-2">Interfere with or disrupt our service</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">6.1 Our Intellectual Property</h3>
            <p>
              All content, features, and functionality of our service are owned by InfoFilter and protected by
              copyright, trademark, and other intellectual property laws.
            </p>

            <h3 className="text-xl font-medium mt-6 mb-3">6.2 Your Content</h3>
            <p>
              You retain ownership of your content. You grant us a license to use, reproduce, and display
              your content solely to provide our services to you.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Subscription and Billing</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">7.1 Free and Paid Services</h3>
            <p>We offer both free and paid subscription tiers with different features and limitations.</p>

            <h3 className="text-xl font-medium mt-6 mb-3">7.2 Payment Terms</h3>
            <p>For paid subscriptions:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Payments are charged at the beginning of each billing cycle</li>
              <li className="mb-2">Subscriptions automatically renew unless canceled</li>
              <li className="mb-2">Refunds are provided according to our Refund Policy</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Termination</h2>

            <h3 className="text-xl font-medium mt-6 mb-3">8.1 Termination by You</h3>
            <p>You may terminate your account at any time by following the instructions on our site.</p>

            <h3 className="text-xl font-medium mt-6 mb-3">8.2 Termination by Us</h3>
            <p>
              We may terminate or suspend your account for violations of these Terms or for any other
              reason at our discretion.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Disclaimer of Warranties</h2>
            <p>Our service is provided "as is" without warranties of any kind, either express or implied.</p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold us harmless from any claims, losses, or damages arising from
              your use of our service or violation of these Terms.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Governing Law</h2>
            <p>
              These Terms shall be governed by the laws of the State of California, without regard to
              its conflict of law provisions.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of material changes.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">14. Third-Party Services</h2>
            <p>
              Our service integrates with third-party services. Your use of such services is subject to
              their respective terms and policies.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">15. Contact Information</h2>
            <p>For questions about these Terms, please contact us at:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">Email: legal@infofilter.com</li>
              <li className="mb-2">Address: 123 Filter Street, San Francisco, CA 94105</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
