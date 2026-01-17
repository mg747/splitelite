'use client';

import { useState } from 'react';
import { X, Mail, Chrome, Loader2 } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: { id: string; name: string; email: string }) => void;
}

type AuthMode = 'signin' | 'signup' | 'magic-link';

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // In production with Supabase:
      // const { createClient } = await import('@/lib/supabase/client');
      // const supabase = createClient();
      // 
      // if (mode === 'signup') {
      //   const { data, error } = await supabase.auth.signUp({
      //     email,
      //     password,
      //     options: { data: { name } }
      //   });
      //   if (error) throw error;
      // } else if (mode === 'signin') {
      //   const { data, error } = await supabase.auth.signInWithPassword({
      //     email,
      //     password,
      //   });
      //   if (error) throw error;
      // } else if (mode === 'magic-link') {
      //   const { error } = await supabase.auth.signInWithOtp({ email });
      //   if (error) throw error;
      //   setMagicLinkSent(true);
      //   return;
      // }

      // Demo mode - simulate auth
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'magic-link') {
        setMagicLinkSent(true);
        return;
      }

      onSuccess({
        id: crypto.randomUUID(),
        name: name || email.split('@')[0],
        email,
      });
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');

    try {
      // In production with Supabase:
      // const { createClient } = await import('@/lib/supabase/client');
      // const supabase = createClient();
      // const { error } = await supabase.auth.signInWithOAuth({
      //   provider: 'google',
      //   options: {
      //     redirectTo: `${window.location.origin}/auth/callback`,
      //   },
      // });
      // if (error) throw error;

      // Demo mode
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess({
        id: crypto.randomUUID(),
        name: 'Demo User',
        email: 'demo@example.com',
      });
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-dark-900 rounded-2xl w-full max-w-md border border-dark-700 shadow-2xl animate-slide-up p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-dark-400 mb-6">
            We sent a magic link to <span className="text-white">{email}</span>
          </p>
          <p className="text-dark-500 text-sm">
            Click the link in the email to sign in. The link expires in 1 hour.
          </p>
          <button
            onClick={onClose}
            className="btn-secondary w-full mt-6"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 rounded-2xl w-full max-w-md border border-dark-700 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-white">
            {mode === 'signin' && 'Welcome back'}
            {mode === 'signup' && 'Create account'}
            {mode === 'magic-link' && 'Sign in with email'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Google Sign In */}
          <button
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Chrome className="w-5 h-5" />
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-700" />
            <span className="text-dark-500 text-sm">or</span>
            <div className="flex-1 h-px bg-dark-700" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input"
                required
              />
            </div>

            {mode !== 'magic-link' && (
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input"
                  required
                  minLength={8}
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {mode === 'signin' && 'Sign In'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'magic-link' && 'Send Magic Link'}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-6 space-y-3 text-center">
            {mode === 'signin' && (
              <>
                <button
                  onClick={() => setMode('magic-link')}
                  className="text-primary-400 text-sm hover:text-primary-300"
                >
                  Sign in with magic link instead
                </button>
                <p className="text-dark-500 text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setMode('signup')}
                    className="text-primary-400 hover:text-primary-300"
                  >
                    Sign up
                  </button>
                </p>
              </>
            )}

            {mode === 'signup' && (
              <p className="text-dark-500 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => setMode('signin')}
                  className="text-primary-400 hover:text-primary-300"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'magic-link' && (
              <button
                onClick={() => setMode('signin')}
                className="text-dark-400 text-sm hover:text-white"
              >
                Back to password sign in
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
