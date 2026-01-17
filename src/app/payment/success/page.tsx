'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/store';
import { CheckCircle, Crown, ArrowRight, Loader2 } from 'lucide-react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { upgradeToPremium } = useStore();
  
  useEffect(() => {
    // Upgrade user to premium
    upgradeToPremium();
    
    // In production, verify the session with Stripe
    // const sessionId = searchParams.get('session_id');
    // if (sessionId) {
    //   verifySession(sessionId);
    // }
  }, [upgradeToPremium]);
  
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        {/* Success Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
        </div>
        
        {/* Content */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Welcome to Pro!
        </h1>
        <p className="text-dark-400 text-lg mb-8">
          Your payment was successful. You now have access to all premium features.
        </p>
        
        {/* Features unlocked */}
        <div className="card text-left mb-8">
          <h3 className="text-white font-semibold mb-4">You've unlocked:</h3>
          <ul className="space-y-3">
            {[
              'Receipt scanning with OCR',
              'Advanced spending analytics',
              'Export to CSV, PDF, Excel',
              'Recurring expense automation',
              'Payment reminders',
              'Unlimited groups',
              'Priority support',
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-dark-300">
                <CheckCircle className="w-5 h-5 text-primary-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        {/* CTA */}
        <button
          onClick={() => router.push('/')}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          Start Using Pro Features
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <p className="text-dark-500 text-sm mt-4">
          A receipt has been sent to your email
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
