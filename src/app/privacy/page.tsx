'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="border-b border-dark-700 bg-dark-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            href="/"
            className="p-2 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <Shield className="w-5 h-5 text-primary-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-dark-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
            <p className="text-dark-300 mb-4">
              Welcome to SplitElite ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our expense-splitting application and related services (collectively, the "Service").
            </p>
            <p className="text-dark-300">
              Please read this Privacy Policy carefully. By using SplitElite, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">2.1 Information You Provide</h3>
            <p className="text-dark-300 mb-4">We collect information that you voluntarily provide when using our Service:</p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li><strong className="text-white">Account Information:</strong> Name, email address, and profile picture (optional)</li>
              <li><strong className="text-white">Group Information:</strong> Group names, descriptions, and member details you add</li>
              <li><strong className="text-white">Expense Data:</strong> Expense descriptions, amounts, dates, categories, and payment information</li>
              <li><strong className="text-white">Payment Information:</strong> When upgrading to Pro, payment details are processed securely by Stripe</li>
              <li><strong className="text-white">Communications:</strong> Messages you send to our support team</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">2.2 Information Collected Automatically</h3>
            <p className="text-dark-300 mb-4">When you use our Service, we may automatically collect:</p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li><strong className="text-white">Device Information:</strong> Device type, operating system, browser type, and unique device identifiers</li>
              <li><strong className="text-white">Usage Data:</strong> Features used, pages visited, time spent, and interaction patterns</li>
              <li><strong className="text-white">Location Data:</strong> General location based on IP address (not precise GPS location)</li>
              <li><strong className="text-white">Cookies and Similar Technologies:</strong> To maintain sessions and remember preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">2.3 Information from Third Parties</h3>
            <p className="text-dark-300">
              If you sign in using a third-party service (e.g., Google), we may receive your name, email, and profile picture from that service according to your privacy settings with them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
            <p className="text-dark-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-dark-300 space-y-2">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process transactions and send related information</li>
              <li>Create and manage your account</li>
              <li>Calculate expense splits and balances</li>
              <li>Send notifications about settlements and group activity</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Monitor and analyze usage trends to improve user experience</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. How We Share Your Information</h2>
            <p className="text-dark-300 mb-4">We may share your information in the following situations:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">4.1 With Group Members</h3>
            <p className="text-dark-300 mb-4">
              When you join or create a group, other members can see your name, profile picture, and expense-related information within that group. This is essential for the expense-splitting functionality.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">4.2 With Service Providers</h3>
            <p className="text-dark-300 mb-4">
              We share information with third-party vendors who perform services on our behalf:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li><strong className="text-white">Stripe:</strong> Payment processing</li>
              <li><strong className="text-white">Vercel:</strong> Hosting and infrastructure</li>
              <li><strong className="text-white">Analytics providers:</strong> To understand usage patterns</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">4.3 For Legal Reasons</h3>
            <p className="text-dark-300 mb-4">
              We may disclose your information if required by law, court order, or government request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">4.4 Business Transfers</h3>
            <p className="text-dark-300">
              If SplitElite is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Storage and Security</h2>
            <p className="text-dark-300 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information, including:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>Encryption of data in transit (HTTPS/TLS)</li>
              <li>Encryption of sensitive data at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Secure payment processing through PCI-compliant providers</li>
            </ul>
            <p className="text-dark-300">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
            <p className="text-dark-300 mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>Provide our Service to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
            <p className="text-dark-300">
              When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights and Choices</h2>
            <p className="text-dark-300 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li><strong className="text-white">Access:</strong> Request a copy of your personal information</li>
              <li><strong className="text-white">Correction:</strong> Request correction of inaccurate information</li>
              <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information</li>
              <li><strong className="text-white">Portability:</strong> Request your data in a portable format</li>
              <li><strong className="text-white">Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong className="text-white">Freeze Account:</strong> Temporarily disable your account while preserving data</li>
            </ul>
            <p className="text-dark-300">
              To exercise these rights, please contact us at <a href="mailto:customersupport@splitelite.com" className="text-primary-400 hover:text-primary-300">customersupport@splitelite.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
            <p className="text-dark-300">
              Your information may be transferred to and processed in countries other than your own. These countries may have different data protection laws. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
            <p className="text-dark-300">
              SplitElite is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Privacy Policy</h2>
            <p className="text-dark-300">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
            <p className="text-dark-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-dark-800/50 rounded-xl p-6">
              <p className="text-white font-semibold mb-2">SplitElite Support</p>
              <p className="text-dark-300">Email: <a href="mailto:customersupport@splitelite.com" className="text-primary-400 hover:text-primary-300">customersupport@splitelite.com</a></p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-700 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-dark-400">
          <p>© {new Date().getFullYear()} SplitElite. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/help" className="hover:text-white transition-colors">Help Center</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
