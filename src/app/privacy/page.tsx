'use client';

import React from 'react'
import { Footer } from '@/components/footer'
import { NavigationUnauthenticated } from '@/components/navigation-bar'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavigationUnauthenticated />

      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <div className="my-10">
          <h1 className="text-3xl font-bold mb-6">Haper Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last Updated: 18 March, 2025</p>

          <div className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
            <h3 className="text-xl font-medium mt-6 mb-3">1. License</h3>
            <p>
              haper, Inc. ("haper" or "We" and related connotations) is committed to protecting and respecting your privacy.
              This Privacy Policy ("Policy") details our commitment to protecting the privacy of individuals who visit our
              Website(haper.io) ("Website Visitors"), as well as users of our Services ("Subscribers"). This Policy
              describes how haper collects, uses, shares and secures the personal information you and/or Subscribers provide.
              It also describes your choices regarding use, access and correction of the respective personal information and
              how the personal information can be accessed and updated. In case of any questions or complaints regarding our
              Policy or practices, please get in touch at support@haper.io
            </p>
            <p>
              Website Visitors and Subscribers are collectively and individually referred to as "You" and related connotations.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Scope Of This Policy</h2>
            <p>
              This Policy applies to the information that we obtain through your use of "Services" or when you otherwise interact with haper.
            </p>
            <p>
              <strong>Sub-Contractor(s):</strong> Shall mean Data Processors and Sub-processors and same shall be enlisted at
              https://haper.io/third-party-subprocessors
            </p>
            <p>
              <strong>Gmail Restricted Scopes:</strong> Shall mean certain Google OAuth API scopes which are subjected to additional
              security and privacy requirements as mentioned in Google's API Services User Data Policy
            </p>
            <p>
              "Services" includes our:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2"><strong>Websites:</strong> haper's website, including but not limited to haper.io, help.haper.io, status.haper.io and any sub-domains and pages;</li>
              <li className="mb-2"><strong>SaaS Product:</strong> haper's "Cloud" hosted solutions; and</li>
              <li className="mb-2"><strong>Browser Extension:</strong> haper's browser extensions that a user has to install in their web browser to use Services.</li>
            </ul>
            <p>
              In this Policy, "personal information" means information relating to an identified or identifiable natural person.
              An identifiable person is one who can be identified, directly or indirectly, in particular by reference to an identifier
              such as family name, first name, photograph, postal address, email address, telephone numbers, date of birth, data relating
              to your transactions on the Website, detail of your orders and subscriptions, bank card number, Payment Information as well
              as any other information about you that you choose to provide us with. The use of information collected through our Service
              shall be limited to the purpose of providing the Service for which you have engaged with us.
            </p>
            <p>
              Subscribers/ Sub-Contractor to our Services are solely responsible for ensuring compliance with all applicable laws and
              regulations, as well as any and all privacy policies, agreements or other obligations, relating to the collection of personal
              information in connection with the use of our Services by individuals (also referred to as "data subjects") with whom our
              Subscribers/ Sub-Contractors interact. If you are an individual who interacts with a Subscriber/ Sub-Contractor using our
              Services, in addition to the rights available in Clause 13 below, you will be directed to contact our Subscriber/ Sub-Contractor
              for assistance with any requests or questions relating to your personal information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Information we collect</h2>
            <p>
              <strong>Registration and Contact Information.</strong> We collect personal information about you when you (a) register to use
              the Services and (b) otherwise provide contact information to us via email, mail, or through our Offerings. This information
              you provide may include your username, first and last name, email address, mailing address or phone number. We do not collect
              or process any special category data from you (viz. any data revealing racial/ ethnic origin, political opinions, religious/
              philosophical beliefs, processing of genetic data, biometric data, etc.).
            </p>
            <p>
              <strong>Payment Information.</strong> When you purchase the Services, we will also collect transaction information, which may
              include your credit card information, billing and mailing address, and other payment-related information ("Payment Information").
              We describe how Payment Information may be collected and processed in Clause 6 below.
            </p>
            <p>
              <strong>Technical, Usage and Location Information.</strong> We may collect information when you interact with our advertisements
              and other content on third-party sites or platforms, such as social networking sites. This may include information such as "Likes",
              profile information gathered from social networking sites or the fact that you viewed or interacted with our content.
            </p>
            <p>
              <strong>Analytics</strong> We collect analytics information when you use Services to help us improve them. We may also share
              anonymous data about your actions on our Websites with third-party service providers of analytics services. We also use web
              analytics software to allow us to better understand the functionality of our web application on your device. We do not link the information we
              store within the analytics software to any personally identifiable information/ personal information you submit within the
              web application.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Use the Information We Collect</h2>
            <p>We use your information in the following ways:</p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">To authenticate and provide access to Services;</li>
              <li className="mb-2">To provide, maintain and improve the Services;</li>
              <li className="mb-2">To process your inquiries and otherwise deliver customer service;</li>
              <li className="mb-2">To send you communication from the Services; including by sending you maintenance notifications, subscription expiring notifications, newsletters, promotions and special offers or information about new products and services. Your opt-out options for promotional communications are described in this Clause 4;</li>
              <li className="mb-2">Administer your account;</li>
              <li className="mb-2">To process your payments, we share and use Payment Information as described in Clause 6;</li>
              <li className="mb-2">To contact you for your reviews on the website and your experience using the Services; and</li>
              <li className="mb-2">To deliver you advertising, including by serving and managing ads on the Services or on third party sites and to tailor ads based on your interests and browsing history.</li>
            </ul>
            <p>
              <strong>Legal Basis for Processing (EEA only):</strong>
            </p>
            <p>
              If you are an individual from the European Economic Area (EEA), our legal basis for collecting and using the personal
              information will depend on the personal information concerned and the specific context in which we collect it. However,
              we will normally collect personal information from you only where: (a) we have your consent to do so, (b) where we need
              the personal information to perform a contract with you (e.g. to deliver the Services you have requested), or (c) where
              the processing is in our or a third party's legitimate interests (and not overridden by your data protection interests
              or fundamental rights and freedoms). In some cases, we may also have a legal obligation to collect personal information
              from you, or may otherwise need the personal information to protect your vital interests or those of another person.
            </p>
            <p>
              Where we rely on your consent to process the personal information, you have the right to withdraw or decline or opt-out
              of providing your consent at any time. Please note that this does not affect the lawfulness of the processing based on
              consent before its withdrawal.
            </p>
            <p>
              If we ask you to provide personal information to comply with a legal requirement or to perform a contract with you, we
              will make this clear at the relevant time and advise you whether the provision of your personal information is mandatory
              or not (as well as of the possible consequences if you do not provide your personal information). Similarly, if we collect
              and use your personal information in reliance on our (or a third party's) legitimate interests which are not already
              described in this Notice, we will make clear to you at the relevant time what those legitimate interests are.
            </p>
            <p>
              Table 1 below depicts the data categories collected and the legal basis applicable:
            </p>
            <table className="min-w-full border-collapse border border-gray-300 mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">S.No</th>
                  <th className="border border-gray-300 px-4 py-2">Data Category</th>
                  <th className="border border-gray-300 px-4 py-2">Legal Basis</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">1.</td>
                  <td className="border border-gray-300 px-4 py-2">Registration and Contact Information.</td>
                  <td className="border border-gray-300 px-4 py-2">Consent, Contractual Obligations, Legitimate Interests</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">2.</td>
                  <td className="border border-gray-300 px-4 py-2">Payment Information</td>
                  <td className="border border-gray-300 px-4 py-2">Contractual Obligations</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">3.</td>
                  <td className="border border-gray-300 px-4 py-2">Technical Usage and Location Information</td>
                  <td className="border border-gray-300 px-4 py-2">Contractual Obligations, Legitimate Interests</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">4.</td>
                  <td className="border border-gray-300 px-4 py-2">Third Party Platforms</td>
                  <td className="border border-gray-300 px-4 py-2">Contractual Obligations, Legitimate Interests</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">5.</td>
                  <td className="border border-gray-300 px-4 py-2">web</td>
                  <td className="border border-gray-300 px-4 py-2">Contractual Obligations, Legitimate Interests</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">6.</td>
                  <td className="border border-gray-300 px-4 py-2">Analytics</td>
                  <td className="border border-gray-300 px-4 py-2">Legitimate Interests</td>
                </tr>
              </tbody>
            </table>
            <p>
              If you have any questions about or need further information concerning the legal basis on which we collect and use your
              personal information, please contact us using the contact details provided further below in Clause 17.
            </p>
            <p>
              <strong>Compliance with the EU-U.S. Data Privacy Framework, UK Extension to the EU-U.S. DPF and Swiss-U.S. Data Privacy Framework Principles</strong>
            </p>
            <p>
              haper complies with the EU-U.S. Data Privacy Framework (EU-U.S. DPF), UK Extension to the EU-U.S. DPF and Swiss-U.S. Data
              Privacy Framework, as set forth by the U.S. Department of Commerce. haper Inc. has certified to the U.S. Department of Commerce
              that it adheres to the EU-U.S. Data Privacy Framework Principles (EU-U.S. DPF Principles) with regard to the processing of
              personal data received from the European Union, Switzerland and the United Kingdom in reliance on the EU-U.S. DPF, the UK
              Extension and Swiss-U.S. Data Privacy Framework to the EU-U.S. DPF. If there is any conflict between the terms in this privacy
              policy and the EU-U.S. DPF Principles, the Principles shall govern. To learn more about the Data Privacy Framework (DPF) program,
              and to view our certification, please visit https://www.dataprivacyframework.gov/
            </p>
            <p>
              In compliance with the EU-U.S. DPF, Swiss-U.S. Data Privacy Framework, and the UK Extension to the EU-U.S. DPF, haper commits
              to refer unresolved complaints concerning our handling of personal data received in reliance on the EU-U.S. DPF, Swiss-U.S. DPF,
              and the UK Extension to the EU-U.S. DPF to the EU Data Protection Authorities (DPAs) as an alternative dispute resolution provider
              for the EU-U.S. DPF, the Swiss Federal Data Protection and Information Commissioner (FDPIC) as an alternative dispute resolution
              provider for the Swiss-U.S. DPF, and the UK Information Commissioner's Office (ICO) as an alternative dispute resolution provider
              for the UK Extension to the EU-U.S. DPF. If you do not receive timely acknowledgment of your DPF Principles-related complaint from
              us, or if we have not addressed your DPF Principles-related complaint to your satisfaction, please visit EU Data Protection
              Authorities(DPAs), UK Information Commissioner's Office (ICO) and Swiss Federal Data Protection and Information Commissioner (FDPIC)
              for more information or to file a complaint.
            </p>
            <p>
              The services of EU Data Protection Authorities(DPAs), UK Information Commissioner's Office (ICO) and Swiss Federal Data Protection
              and Information Commissioner (FDPIC) are provided at no cost to you.
            </p>
            <p>
              If you have a question or complaint related to participation by haper in the DPF Frameworks, we encourage you to contact us via
              support@haper.io. For any complaints related to the DPF Frameworks that haper cannot resolve directly, we have chosen to
              co-operate with the relevant EU Data Protection Authority, or a panel established by the European data protection authorities,
              for resolving disputes with EU individuals, the UK Information Commissioner (for UK individuals) and the Swiss Federal Data
              Protection and Information Commissioner (FDPIC) for resolving disputes with Swiss individuals. As further explained in Annex I
              of DPF Principles, binding arbitration is available to address residual complaints not resolved by other means. haper is subject
              to the investigatory and enforcement powers of the U.S. Federal Trade Commission (FTC).
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Sharing Of Information Collected</h2>
            <p>
              We do not sell, trade, share or transfer your personal information to third parties, except in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">We may share your personal information with third parties to permit such parties to provide services that help us to provide our business activities, which may include assisting us with marketing, advertising our product/service offerings, or providing, maintaining and improving the features and functionality of the Services, among other things ("Sub-Contractors"). The data shared is limited to your name, email address, the company information and your communication history with haper. This will never include sharing any email data which haper has access to through the Gmail Restricted Scopes for your account. For example, we may provide personal information to our sub-contractors for direct emailing of our newsletters or notifications of our product/service offerings. All third parties are engaged under contract and obliged to meet appropriate security requirements and comply with all applicable legislation;</li>
              <li className="mb-2">We may share your personal information when we have a good faith belief that access, use, preservation or disclosure of such information is reasonably necessary to (a) satisfy any applicable law, regulation, legal process or enforceable governmental request, (b) enforce a Customer Agreement, including investigation of potential violations thereof, or (c) protect against imminent harm to our rights, property or safety, or that of our users or the public as required or permitted by law;</li>
              <li className="mb-2">We may share your personal information with third parties (including our Sub-Contractors and government entities) to detect, prevent, or otherwise address fraud or security or technical issues;</li>
              <li className="mb-2">We may share your Payment Information to process your payments, as further described in Clause 6 (Payment Information);</li>
              <li className="mb-2">We may share and/or transfer your personal information if we become involved in a merger, acquisition, bankruptcy, or any form of sale of some or all of our assets;</li>
              <li className="mb-2">We may share your personal information with a third party if we have your consent to do so; and</li>
              <li className="mb-2">We may share your personal information with our Indian subsidiary namely Grexit Software Private Limited for sub-processing. Such subsidiary shall comply with similar safeguards for processing/sub-processing of your personal information as we do.</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Payment Information</h2>
            <p>
              When you purchase the Services, any credit card information you provide as part of your Payment Information is collected and
              processed directly by our payment processor Stripe through their Stripe Checkout service. We never receive or store your full
              credit card information. Stripe commits to complying with the Payment Card Industry Data Security Standard (PCI-DSS) and using
              industry standard security. Stripe may use your Payment Information in accordance with their own Privacy Policy
              <a href="https://stripe.com/privacy" className="text-blue-600 hover:underline"> here</a>.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Onward Transfer of Personal Data</h2>
            <p>
              We may transfer information that we collect about you, including personal information, to affiliated entities, or to other third
              parties (including our Subcontractors) across borders and from your country or jurisdiction to other countries or jurisdictions
              around the world. If you are located outside the U.S. please note that you are transferring information, including personal
              information, to a country and jurisdiction that does not have the same data protection laws as your jurisdiction, and you consent
              to the transfer of information to the U.S. and the use and disclosure of information about you, including personal information,
              as described in this Policy. We shall at all times provide an adequate level of protection for the customer data processed, in
              accordance with the requirements of data protection laws.
            </p>
            <p>
              We may entail some of the third parties with whom we share personal data (originating in the EU), to provide specific services
              and products related to the haper website and our services, such as hosting, payment processing, analytics, etc. We require that
              these outside contractors agree to the Data Protection Amendment (combined with EU/UK Standard contractual clause), privacy policy,
              and security certifications. We will not share personal information (originating in the EU) with third parties, which do not provide
              an adequate level of data protection as defined by data protection laws in the EEA, Switzerland, or the UK. In cases of onward
              transfer to third parties, the data of EU or Swiss individuals received pursuant to the EU Standard Contractual Clauses, haper is
              potentially liable.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Standard Contractual Clauses</h2>
            <p>
              <strong>What are Standard Contractual Clauses?</strong> Standard contractual clauses (SCCs) are standardized and pre-approved model
              data protection clauses that allow controllers and processors to comply with their obligations under EU data protection law. They
              can be incorporated by controllers and processors into their contractual arrangements with other parties, for instance commercial
              partners.
            </p>
            <p>
              haper relies on Standard Contractual Clauses (SCCs) for transfers of personal data out of the EU, UK, and Switzerland. We have
              revised the DPA (Data Protection Amendment) mainly to account for and incorporate the new standard contractual clauses (SCCs) that
              the European Commission published on June 4, 2021 to address data transfers originating from the European Economic Area (EEA). The
              use and adherence to SCCs in contracts governing such data flows to meet this level of protection.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">9. Google API Services Usage Disclosure</h2>
            <p>
              haper's use and transfer to any other app of information received from Google APIs will adhere to Google API Services User Data
              Policy, including the Limited Use requirements.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">10. Cookies</h2>
            <p>
              When you use our Websites or Services, we may store some information on your computer. This information will be in the form of a
              "cookie" or similar technologies. Cookies are alphanumeric identifiers that are transferred to your computer or web device from
              your browser. We do not use cookies to spy on you or otherwise invade your privacy. They cannot invade your hard drive and steal
              information. We use cookies to help you navigate the Websites and Services as easily as possible, and to remember information about
              your current session. You must enable cookies on your web browser to use the Services.
            </p>
            <p>
              <strong>Essential Cookies:</strong> These cookies are essential for the basic functionalities offered by the Services. These class
              of cookies helps in keeping a user logged in to the Services and remember relevant information when they return to the Services.
              These cookies are essential for the basic functionalities offered by the Services. These class of cookies helps in keeping a user
              logged in to the Services and remember relevant information when they return to the Services.
            </p>
            <p>
              <strong>Insight Cookies:</strong> These are used for tracking the user activities within the Services, which in turn helps us in
              improving your user experience.
            </p>
            <p>
              <strong>Marketing Cookies:</strong> These are used for providing you with customized and interest-based ads based on your browsing
              behavior and other similar activities on our Websites.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">11. Public Forums/Blogs</h2>
            <p>
              haper may create and host a public discussion forum or Blogs for its users and the general public. Any information disclosed in
              these areas is deemed public information and each user is responsible for and should exercise caution when disclosing personal
              information on these forums/Blogs. haper is not responsible for any such information disclosed or any action taken as a result of
              the disclosed information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">12. Disclaimer of Warranties</h2>
            <p>
              We offer those who provide personal information a means to choose how we use the information provided. You may manage your receipt
              of marketing and non-transactional communications by clicking on the "unsubscribe" link located on the bottom of our marketing
              emails or you may send a request to support@haper.io
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">13. How Long We Retain Your Personal Information</h2>
            <p>
              We will retain your personal information for as long as is needed to fulfill the purposes outlined in this Policy, unless a longer
              retention period is necessary, required or permitted by law for archiving purposes in the public interest, scientific/historical
              research or statistical purposes (depending on circumstances, compatible processing purposes may include compliance/ legal
              consideration, tax, accounting, security & fraud prevention or other legal requirements). We delete all your data on the expiry of
              14 days after the termination of the Services, except as otherwise prohibited by applicable law. Please note that some of your
              content, data, information, text, files might remain in our backups for a period not exceeding two months. Some information about
              Your account, such as billing address, invoices or contact details for Your employees, might be retained in our systems solely for
              administrative purposes.
            </p>
            <p>
              For personal information that we process on behalf of our Subscribers/ Sub-Contractors, we will retain such personal information in
              accordance with the terms of our agreement with them, subject to applicable law.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">14. How Can you Opt-Out</h2>
            <p>
              In compliance with the EU-U.S. DPF, the UK Extension to the EU-U.S. DPF, and the Swiss-U.S. DPF, haper commits to resolve DPF
              Principles-related complaints about our collection and use of your personal information. EU and UK individuals and Swiss individuals
              with inquiries or complaints regarding our handling of personal data received in reliance on the EU-U.S. DPF and the UK Extension to
              the EU-U.S. DPF, and the Swiss-U.S. DPF should first contact haper at: support@haper.io.
            </p>
            <p>
              If you no longer wish to receive marketing communications from haper, you may click on the "unsubscribe" link located on the bottom
              of our marketing emails or you can contact us at support@haper.io.
            </p>
            <p>
              If you would like to object to the use of your Personal Data for analytics, you can contact us at support@haper.io.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">15. Accessing and Updating your personal information</h2>
            <p>
              Where we have not obtained personal information from you directly, but from the Subscribers/ Sub-Contractors or any other sources,
              you shall be intimated about the identity and contact details of the controller, purpose, recipients of personal information, etc.
              within a reasonable time period. Even upon request we will provide you with information, in case it is not available with you, about
              whether we hold, or process on behalf of a third party, any of your personal information. To request this information please contact
              us at support@haper.io. Subscribers to our Services may update or change their Account Information by editing their profile or
              organization record or by contacting support@haper.io for more detailed instructions. To make a request to have personal information
              maintained by us returned to you or removed, please email support@haper.io Requests to access, change, or remove your information
              will be handled within thirty (30) days.
            </p>
            <p>
              An individual who seeks access to, or who seeks to correct or, amend inaccuracies in, or delete personal information stored or
              processed by us on behalf of a Subscriber/ Sub-Contractor should direct his/her query to the Subscriber/ Sub-Contractor (the data
              controller). Upon receipt of a request from one of our Subscribers/ Sub-Contractor for us to remove the data, we will respond to
              their request within thirty (30) days. We will retain personal information that we store and process on behalf of our Subscribers/
              Sub-Contractors for as long as needed to provide the Services to our Subscribers/ Sub-Contractors. We will retain and use this
              personal information for archiving purposes as necessary to comply with our legal obligations, resolve disputes, and enforce our
              agreements.
            </p>
            <p>
              We may decline to process requests that are unreasonably repetitive or systematic, require disproportionate technical effort (for
              instance, requests concerning information residing on backup tapes), jeopardize the privacy of others, would be extremely impractical,
              or for which access is not otherwise required. In any case where we perform activities so as to fulfil your rights vide Clause 13
              below, we perform them free of charge, except if doing so would require a disproportionate effort or if the requested information is
              already available with you.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">16. Rights</h2>
            <p>
              To ensure fair and transparent processing, you shall have the following rights and any information that shall be shared by us with
              you vide these rights shall be in electronic form:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">ask for storage period of your personal information;</li>
              <li className="mb-2">request for access your personal information;</li>
              <li className="mb-2">right to rectification of personal information without undue delay;</li>
              <li className="mb-2">right to erasure of personal information without any undue delay, except where processing is necessary for legal purpose and public interest;</li>
              <li className="mb-2">right to restrict processing or to object to processing. We shall endeavour to communicate the recipients of your personal information about any rectification or erasure of personal information;</li>
              <li className="mb-2">right to request information of the recipients of the personal information;</li>
              <li className="mb-2">right to data portability, where technically feasible;</li>
              <li className="mb-2">right to lodge a complaint with a supervisory authority;</li>
              <li className="mb-2">right to lodge a complaint with a supervisory authority;</li>
              <li className="mb-2">right to know the source from where your personal information originated, in case it was not obtained directly from you;</li>
              <li className="mb-2">right to access (or obtain from us a confirmation if your personal information is being processed by us) the purpose of processing, recipients of your personal information. In the events your personal information is transferred to a third country, we hereby inform you that we undertake appropriate binding safeguards for such transfer;</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">17. Children's Personal Information</h2>
            <p>
              We do not knowingly collect any personal information from children under the age of 16. If you are under the age of 16, please do not
              submit any personal information through our Websites or Services. We encourage parents and legal guardians to monitor their children's
              Internet usage and to help enforce this Policy by instructing their children never to provide personal information through the Websites
              or Services without their permission. If you have reason to believe that a child under the age of 16 has provided personal information
              to us through the Websites or Services, please contact us at support@haper.io, and we will use commercially reasonable efforts to
              delete that information.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">18. Security</h2>
            <p>
              The security of your personal information is important to us. We maintain a variety of appropriate technical and organizational
              safeguards to protect your personal information. We limit access to personal information about you to employees who we believe
              reasonably need to come into contact with that information to provide products or services to you or in order to do their jobs.
              Further, we have implemented reasonable physical, electronic, and procedural safeguards designed to protect personal information
              about you. When you enter sensitive information (such as your password), we encrypt that information in transit using industry-standard
              Transport Layer Security (TLS) encryption technology. No method of transmission over the Internet, method of electronic storage or
              other security methods are one hundred percent secure. Therefore, while we strive to use reasonable efforts to protect your personal
              information, we cannot guarantee its absolute security. You can read more about our security practices
              <a href="https://haper.io/security" className="text-blue-600 hover:underline"> here</a>.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">19. Changes To This Policy</h2>
            <p>
              We reserve the right to change our Privacy Policy at any time. If we make changes, we will post them and we will indicate at the top
              of this page the date this policy was last revised. If we make material changes to this policy, we will notify you by email or through
              a prominent notice on the Website prior to the changes being effective. We encourage you to periodically review this page for the
              latest information on our privacy practices. Your continued use of the Websites or the Services constitutes your agreement to be bound
              by such changes to this Policy. You can choose to discontinue use of the Websites or Services, if you do not accept the terms of this
              Policy, or any modified version of this Policy.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">20. Contact Us</h2>
            <p>
              If you have questions or need to contact us about this Privacy Policy, please email our compliance officer at
              support@haper.io
            </p>

            <p className="mt-8 text-sm text-gray-500">Last Updated: 22 July, 2024</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
