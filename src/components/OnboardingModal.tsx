'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { 
  ArrowRight, 
  Wallet, 
  Users, 
  PieChart, 
  Sparkles,
  Check
} from 'lucide-react';

interface OnboardingModalProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Wallet,
    title: 'Track Every Expense',
    description: 'Add expenses in seconds. Split bills equally or customize amounts for each person.',
    color: 'from-primary-500 to-emerald-400',
  },
  {
    icon: Users,
    title: 'Settle Up Easily',
    description: 'See who owes what at a glance. Our smart algorithm minimizes the number of payments needed.',
    color: 'from-blue-500 to-cyan-400',
  },
  {
    icon: PieChart,
    title: 'Gain Insights',
    description: 'Understand your spending with beautiful analytics. See trends and category breakdowns.',
    color: 'from-purple-500 to-pink-400',
  },
];

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const { setUser, loadDemoData } = useStore();
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
                  i <= step ? 'bg-primary-500' : 'bg-dark-700'
                }`}
              />
            ))}
          </div>
          
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${currentStep.color} mb-8`}>
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
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setStep(steps.length)}
              className="text-dark-400 hover:text-white transition-colors"
            >
              Skip intro
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
          <h1 className="text-4xl font-bold gradient-text mb-2">SplitElite</h1>
          <p className="text-dark-400">The smart way to split expenses</p>
        </div>
        
        {/* Form */}
        <div className="card">
          <h2 className="text-xl font-semibold text-white mb-6">
            Create your account
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="input"
              />
            </div>
            
            <button
              onClick={handleGetStarted}
              disabled={!name.trim() || !email.trim()}
              className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Get Started Free
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-700" />
            <span className="text-dark-500 text-sm">or</span>
            <div className="flex-1 h-px bg-dark-700" />
          </div>
          
          {/* Demo Mode */}
          <button
            onClick={handleDemoMode}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Try Demo Mode
          </button>
          
          <p className="text-center text-dark-500 text-xs mt-4">
            Demo mode loads sample data so you can explore all features
          </p>
        </div>
        
        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          {[
            { icon: Check, text: 'Free forever' },
            { icon: Check, text: 'No credit card' },
            { icon: Check, text: 'Instant setup' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-dark-400 text-sm">
              <item.icon className="w-4 h-4 text-green-400" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
