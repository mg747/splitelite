'use client';

import { useState } from 'react';
import { X, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

type AuthMode = 'signin' | 'signup' | 'magic-link';

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, name);
        if (error) throw error;
        setSignUpSuccess(true);
        return;
      } else if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onSuccess?.();
        onClose();
      }
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
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // OAuth will redirect, so no need to close modal
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
      setIsLoading(false);
    }
  };

  if (signUpSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-dark-900 rounded-2xl w-full max-w-md border border-dark-700 shadow-2xl animate-slide-up p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-dark-400 mb-6">
            We sent a confirmation link to <span className="text-white">{email}</span>
          </p>
          <p className="text-dark-500 text-sm">
            Click the link in the email to verify your account and sign in.
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
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-dark-700" />
            <span className="text-dark-500 text-sm">{t('common.or')}</span>
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
                {mode === 'signup' && (
                  <p className="text-dark-500 text-xs mt-1">Minimum 8 characters</p>
                )}
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
