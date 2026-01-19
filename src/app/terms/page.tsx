'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfService() {
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
              <FileText className="w-5 h-5 text-primary-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Terms of Service</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-dark-400 text-sm mb-8">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Agreement to Terms</h2>
            <p className="text-dark-300 mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and SplitElite ("Company," "we," "us," or "our") governing your access to and use of the SplitElite application, website, and related services (collectively, the "Service").
            </p>
            <p className="text-dark-300 mb-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
            </p>
            <p className="text-dark-300">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on this page. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-dark-300 mb-4">
              SplitElite is an expense-splitting application that allows users to:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>Create and manage expense-sharing groups</li>
              <li>Track shared expenses and payments</li>
              <li>Calculate fair splits among group members</li>
              <li>View balances and suggested settlements</li>
              <li>Access analytics and insights (Pro features)</li>
            </ul>
            <p className="text-dark-300">
              The Service is provided "as is" and is intended for personal, non-commercial use for tracking shared expenses among friends, family, roommates, and other groups.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">3.1 Account Creation</h3>
            <p className="text-dark-300 mb-4">
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your account credentials secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">3.2 Account Eligibility</h3>
            <p className="text-dark-300 mb-4">
              You must be at least 13 years old to use the Service. If you are under 18, you represent that you have your parent or guardian's permission to use the Service.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">3.3 Account Termination</h3>
            <p className="text-dark-300">
              You may delete your account at any time through the Settings menu. We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent or harmful activities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Subscription and Payments</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">4.1 Free and Pro Plans</h3>
            <p className="text-dark-300 mb-4">
              SplitElite offers both free and paid subscription plans:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li><strong className="text-white">Free Plan:</strong> Basic expense tracking and splitting features</li>
              <li><strong className="text-white">Pro Plan:</strong> Advanced features including analytics, receipt scanning, and unlimited groups</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">4.2 Billing</h3>
            <p className="text-dark-300 mb-4">
              Pro subscriptions are billed in advance on a monthly or annual basis. By subscribing, you authorize us to charge your payment method for the subscription fee.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">4.3 Cancellation and Refunds</h3>
            <p className="text-dark-300 mb-4">
              You may cancel your Pro subscription at any time. Upon cancellation:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>You will retain access to Pro features until the end of your current billing period</li>
              <li>Your account will revert to the Free plan after the billing period ends</li>
              <li>We offer a 7-day money-back guarantee for new Pro subscriptions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">4.4 Price Changes</h3>
            <p className="text-dark-300">
              We reserve the right to modify subscription prices. We will provide at least 30 days' notice before any price increase takes effect for existing subscribers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use</h2>
            <p className="text-dark-300 mb-4">You agree not to use the Service to:</p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Attempt to gain unauthorized access to the Service or other accounts</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems to access the Service without permission</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use the Service for money laundering or other financial crimes</li>
              <li>Impersonate any person or entity</li>
            </ul>
            <p className="text-dark-300">
              We reserve the right to investigate and take appropriate action against anyone who violates these provisions, including removing content and terminating accounts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. User Content</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">6.1 Your Content</h3>
            <p className="text-dark-300 mb-4">
              You retain ownership of any content you submit to the Service, including expense descriptions, group names, and other information ("User Content"). By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, store, and display your content solely for the purpose of providing the Service.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">6.2 Content Responsibility</h3>
            <p className="text-dark-300">
              You are solely responsible for your User Content. You represent that you have all necessary rights to submit such content and that it does not violate any third-party rights or applicable laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Intellectual Property</h2>
            <p className="text-dark-300 mb-4">
              The Service and its original content (excluding User Content), features, and functionality are owned by SplitElite and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-dark-300">
              Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
            <p className="text-dark-300 mb-4">
              The Service may contain links to or integrate with third-party services, including:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>Payment processors (Stripe)</li>
              <li>Authentication providers (Google)</li>
              <li>Analytics services</li>
            </ul>
            <p className="text-dark-300">
              We are not responsible for the content, privacy policies, or practices of third-party services. Your use of such services is governed by their respective terms and policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Disclaimer of Warranties</h2>
            <p className="text-dark-300 mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>IMPLIED WARRANTIES OF MERCHANTABILITY</li>
              <li>FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>NON-INFRINGEMENT</li>
              <li>ACCURACY OR COMPLETENESS OF CONTENT</li>
            </ul>
            <p className="text-dark-300">
              We do not warrant that the Service will be uninterrupted, secure, or error-free, or that defects will be corrected.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Limitation of Liability</h2>
            <p className="text-dark-300 mb-4">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SPLITELITE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
            </p>
            <ul className="list-disc list-inside text-dark-300 space-y-2 mb-4">
              <li>Loss of profits, data, or goodwill</li>
              <li>Service interruption or computer damage</li>
              <li>Cost of substitute services</li>
              <li>Any damages arising from your use of the Service</li>
            </ul>
            <p className="text-dark-300">
              Our total liability for any claims arising from these Terms or your use of the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Indemnification</h2>
            <p className="text-dark-300">
              You agree to indemnify, defend, and hold harmless SplitElite and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Dispute Resolution</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">12.1 Informal Resolution</h3>
            <p className="text-dark-300 mb-4">
              Before filing a formal dispute, you agree to contact us at customersupport@splitelite.com to attempt to resolve the dispute informally.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">12.2 Arbitration</h3>
            <p className="text-dark-300 mb-4">
              Any disputes that cannot be resolved informally shall be resolved through binding arbitration, except that either party may seek injunctive relief in court for intellectual property infringement.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">12.3 Class Action Waiver</h3>
            <p className="text-dark-300">
              You agree to resolve disputes with us on an individual basis and waive any right to participate in class action lawsuits or class-wide arbitration.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">13. Governing Law</h2>
            <p className="text-dark-300">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any legal action or proceeding shall be brought exclusively in the courts located in the United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">14. Severability</h2>
            <p className="text-dark-300">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">15. Entire Agreement</h2>
            <p className="text-dark-300">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and SplitElite regarding the Service and supersede all prior agreements and understandings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">16. Contact Information</h2>
            <p className="text-dark-300 mb-4">
              If you have any questions about these Terms, please contact us:
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
