'use client';

import { useState } from 'react';
import { useStore } from '@/store';
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

const steps = [
  {
    icon: Wallet,
    title: 'Track Every Expense',
    subtitle: '"A man who doesn\'t spend time with his family can never be a real man."',
    description: 'Add expenses in seconds. Split bills equally or customize amounts for each person.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Users,
    title: 'Settle Up Easily',
    subtitle: '"We\'re not criminals. We\'re just... businessmen."',
    description: 'See who owes what at a glance. Our smart algorithm minimizes the number of payments needed.',
    color: 'from-primary-500 to-emerald-400',
  },
  {
    icon: Crown,
    title: 'Gain Insights',
    subtitle: '"Big fucks small."',
    description: 'Understand your spending with beautiful analytics. See trends and category breakdowns.',
    color: 'from-amber-400 to-yellow-500',
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
        {/* Smoke effect background */}
        <div className="smoke-bg"></div>
        
        {/* Vintage vignette */}
        <div className="fixed inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
        }}></div>
        
        <div className="w-full max-w-md text-center animate-fade-in relative z-10">
          {/* Progress - styled like vintage film strip */}
          <div className="flex gap-3 justify-center mb-12">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 w-16 rounded-full transition-all duration-500 ${
                  i <= step 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 neon-glow-gold' 
                    : 'bg-dark-700'
                }`}
              />
            ))}
          </div>
          
          {/* Icon with neon glow */}
          <div className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br ${currentStep.color} mb-6 neon-glow transform hover:scale-105 transition-transform`}>
            <currentStep.icon className="w-14 h-14 text-white drop-shadow-lg" />
          </div>
          
          {/* Content */}
          <h1 className="text-4xl font-bold text-white mb-3 peaky-title">
            {currentStep.title}
          </h1>
          <p className="text-amber-500/70 text-sm italic mb-4 font-serif">
            {currentStep.subtitle}
          </p>
          <p className="text-dark-300 text-lg mb-10 max-w-sm mx-auto">
            {currentStep.description}
          </p>
          
          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={() => setStep(step + 1)}
              className="btn-primary-3d w-full flex items-center justify-center gap-2 text-lg"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button
              onClick={() => setStep(steps.length)}
              className="text-dark-500 hover:text-amber-500 transition-colors text-sm"
            >
              Skip intro
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Sign up step - Peaky Blinders themed
  return (
    <div className="fixed inset-0 bg-dark-950 flex items-center justify-center z-50 p-4">
      {/* Smoke effect background */}
      <div className="smoke-bg"></div>
      
      {/* Vintage vignette */}
      <div className="fixed inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)'
      }}></div>
      
      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo - Peaky Blinders Style */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-2" />
          </div>
          <h1 className="text-5xl font-bold gradient-gold mb-3 peaky-title">SplitElite</h1>
          <p className="text-amber-600/60 italic font-serif">"By order of the Peaky Blinders"</p>
          <div className="peaky-divider mt-4 w-48 mx-auto"></div>
        </div>
        
        {/* Form */}
        <div className="card neon-border coin-decoration">
          <h2 className="text-2xl font-bold text-white mb-2 peaky-title">
            Join the Family
          </h2>
          <p className="text-dark-400 text-sm mb-6">Create your account to start splitting</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2 uppercase tracking-wider">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Thomas Shelby"
                className="input-neon"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-dark-300 mb-2 uppercase tracking-wider">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tommy@shelbycompany.ltd"
                className="input-neon"
              />
            </div>
            
            <button
              onClick={handleGetStarted}
              disabled={!name.trim() || !email.trim()}
              className="btn-primary-3d w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              Get Started Free
            </button>
          </div>
          
          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent" />
            <span className="text-amber-600/50 text-sm font-serif italic">or</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/50 to-transparent" />
          </div>
          
          {/* Demo Mode */}
          <button
            onClick={handleDemoMode}
            className="btn-secondary-3d w-full flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            Try Demo Mode
          </button>
          
          <p className="text-center text-dark-500 text-xs mt-4 italic">
            "Take a look around the Garrison..."
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
              <item.icon className="w-4 h-4 text-primary-400" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
