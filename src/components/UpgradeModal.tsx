'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { useTranslations } from 'next-intl';
import { 
  X, 
  Crown, 
  Check, 
  Zap, 
  BarChart3, 
  Download, 
  Bell, 
  Camera,
  Repeat,
  Users,
  Headphones,
  Sparkles
} from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
}

const plans = [
  {
    id: 'monthly',
    name: 'Pro Monthly',
    price: 4.99,
    interval: 'month',
    popular: false,
  },
  {
    id: 'yearly',
    name: 'Pro Yearly',
    price: 39.99,
    interval: 'year',
    popular: true,
    savings: '33%',
  },
];

const features = [
  {
    icon: Camera,
    title: 'Receipt Scanning',
    description: 'Snap a photo and auto-extract expense details',
    free: false,
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Spending insights, trends, and category breakdowns',
    free: false,
  },
  {
    icon: Download,
    title: 'Export Data',
    description: 'Download expenses as CSV, PDF, or Excel',
    free: false,
  },
  {
    icon: Repeat,
    title: 'Recurring Expenses',
    description: 'Auto-add monthly bills and subscriptions',
    free: false,
  },
  {
    icon: Bell,
    title: 'Payment Reminders',
    description: 'Nudge friends who owe you money',
    free: false,
  },
  {
    icon: Users,
    title: 'Unlimited Groups',
    description: 'Create as many groups as you need',
    free: false,
  },
  {
    icon: Sparkles,
    title: 'Custom Categories',
    description: 'Create your own expense categories',
    free: false,
  },
  {
    icon: Headphones,
    title: 'Priority Support',
    description: '24/7 support with faster response times',
    free: false,
  },
];

export default function UpgradeModal({ onClose }: UpgradeModalProps) {
  const { upgradeToPremium, user, locale, currency } = useStore();
  const t = useTranslations('upgrade');
  const [selectedPlan, setSelectedPlan] = useState('yearly');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleUpgrade = async () => {
    setIsProcessing(true);
    
    try {
      // Call Stripe checkout API with locale and currency
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan === 'yearly' ? 'pro-yearly' : 'pro-monthly',
          userId: user?.id,
          userEmail: user?.email,
          currency: currency.toLowerCase(),
          locale: locale,
        }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        // Demo mode fallback
        await new Promise(resolve => setTimeout(resolve, 1500));
        upgradeToPremium();
        onClose();
      }
    } catch (error) {
      console.error('Checkout error:', error);
      // Demo mode fallback
      await new Promise(resolve => setTimeout(resolve, 1500));
      upgradeToPremium();
      onClose();
    }
    
    setIsProcessing(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-dark-700 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="relative p-8 text-center border-b border-dark-700 bg-gradient-to-b from-amber-500/10 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to SplitElite Pro
          </h2>
          <p className="text-dark-400">
            Unlock powerful features to manage expenses like a pro
          </p>
        </div>
        
        {/* Pricing */}
        <div className="p-6 border-b border-dark-700">
          <div className="grid grid-cols-2 gap-4">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-4 rounded-xl text-left transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-2 border-amber-500'
                    : 'bg-dark-800 border-2 border-transparent hover:border-dark-600'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold">
                    Best Value
                  </span>
                )}
                
                <p className="text-white font-semibold mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="text-dark-400">/{plan.interval}</span>
                </div>
                {plan.savings && (
                  <p className="text-green-400 text-sm mt-1">Save {plan.savings}</p>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Features */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Everything in Pro
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-xl bg-dark-800/50"
              >
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <feature.icon className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{feature.title}</p>
                  <p className="text-dark-400 text-xs">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="p-6 border-t border-dark-700 bg-dark-800/50">
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg hover:shadow-lg hover:shadow-amber-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Upgrade Now
              </>
            )}
          </button>
          
          <p className="text-center text-dark-500 text-sm mt-4">
            Cancel anytime. 7-day money-back guarantee.
          </p>
          
          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-dark-700">
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Check className="w-4 h-4 text-green-400" />
              Secure payment
            </div>
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Check className="w-4 h-4 text-green-400" />
              Instant access
            </div>
            <div className="flex items-center gap-2 text-dark-400 text-sm">
              <Check className="w-4 h-4 text-green-400" />
              No hidden fees
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
