'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  ArrowRight, 
  Wallet, 
  Users, 
  PieChart, 
  Sparkles,
  Check,
  Crown
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { setUser, loadDemoData } = useStore();
  const { t } = useTranslation();
  
  const steps = [
    {
      icon: Wallet,
      title: t('onboarding.trackExpenses'),
      description: t('onboarding.trackExpensesDesc'),
      color: 'from-primary-500 to-emerald-400',
    },
    {
      icon: Users,
      title: t('onboarding.settleUp'),
      description: t('onboarding.settleUpDesc'),
      color: 'from-blue-500 to-cyan-400',
    },
    {
      icon: PieChart,
      title: t('onboarding.gainInsights'),
      description: t('onboarding.gainInsightsDesc'),
      color: 'from-purple-500 to-pink-400',
    },
  ];
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  
  const handleGetStarted = () => {
    if (name.trim() && email.trim()) {
      setUser({
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        isPremium: false,
        createdAt: new Date(),
      });
      onComplete();
    }
  };
  
  const handleDemoMode = () => {
    loadDemoData();
    onComplete();
  };
  
  if (step < steps.length) {
    const currentStep = steps[step];
    
    return (
      <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md text-center animate-fade-in">
          {/* Progress */}
          <div className="flex gap-2 justify-center mb-12">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 w-12 rounded-full transition-all ${
                  i <= step ? 'bg-primary-500 neon-glow-subtle' : 'bg-dark-700'
                }`}
              />
            ))}
          </div>
          
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${currentStep.color} mb-8 neon-glow`}>
            <currentStep.icon className="w-12 h-12 text-white" />
          </div>
          
          {/* Content */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {currentStep.title}
          </h1>
          <p className="text-dark-400 text-lg mb-12 max-w-sm mx-auto">
            {currentStep.description}
          </p>
          
          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary-3d w-full flex items-center justify-center gap-2"
            >
              {t('onboarding.continue')}
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setStep(steps.length)}
              className="text-dark-400 hover:text-white transition-colors"
            >
              {t('onboarding.skipIntro')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Sign up step
  return (
    <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">{t('common.appName')}</h1>
          <p className="text-dark-400">{t('common.tagline')}</p>
        </div>
        
        {/* Form */}
        <div className="card neon-border">
          <h2 className="text-xl font-semibold text-white mb-6">
            {t('auth.createAccount')}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                {t('onboarding.yourName')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-neon"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                {t('onboarding.emailAddress')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="input-neon"
              />
            </div>
            
            <button
              onClick={handleGetStarted}
              disabled={!name.trim() || !email.trim()}
              className="btn-primary-3d w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('onboarding.getStarted')}
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-700" />
            <span className="text-dark-500 text-sm">{t('common.or')}</span>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          
          {/* Demo Mode */}
          <button
            onClick={handleDemoMode}
            className="btn-secondary-3d w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {t('onboarding.tryDemo')}
          </button>
          
          <p className="text-center text-dark-500 text-xs mt-4">
            {t('onboarding.demoNote')}
          </p>
        </div>
        
        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: Check, text: t('onboarding.freeForever') },
            { icon: Check, text: t('onboarding.noCreditCard') },
            { icon: Check, text: t('onboarding.instantSetup') },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-dark-400 text-sm">
              <item.icon className="w-4 h-4 text-primary-400" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
