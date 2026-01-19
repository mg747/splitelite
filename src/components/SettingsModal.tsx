'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  X, 
  Settings, 
  User, 
  Shield, 
  Trash2, 
  Snowflake,
  AlertTriangle,
  Crown,
  LogOut
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';
import ConfirmDialog from './ConfirmDialog';

interface SettingsModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export default function SettingsModal({ onClose, onUpgrade }: SettingsModalProps) {
  const { user, freezeAccount, unfreezeAccount, deleteAccount } = useStore();
  const { t } = useTranslation();
  const [showFreezeConfirm, setShowFreezeConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState<'general' | 'account'>('general');
  
  const isFrozen = user?.status === 'frozen';
  
  const handleFreeze = () => {
    if (isFrozen) {
      unfreezeAccount();
    } else {
      freezeAccount();
    }
    setShowFreezeConfirm(false);
  };
  
  const handleDelete = () => {
    deleteAccount();
    setShowDeleteConfirm(false);
    onClose();
  };
  
  return (
    <>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="modal-3d bg-dark-900/95 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-primary-500/30 shadow-2xl neon-border">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/30 to-emerald-500/30 neon-glow">
                <Settings className="w-6 h-6 text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">{t('settings.title')}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex h-[500px]">
            {/* Sidebar */}
            <div className="w-48 border-r border-dark-700/50 p-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveSection('general')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === 'general'
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  General
                </button>
                <button
                  onClick={() => setActiveSection('account')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === 'account'
                      ? 'bg-primary-500/20 text-primary-400'
                      : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  {t('settings.account')}
                </button>
              </nav>
            </div>
            
            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeSection === 'general' && (
                <div className="space-y-6">
                  {/* Language & Currency */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">{t('settings.language')} & {t('settings.currency')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50">
                        <div>
                          <p className="font-medium text-white">{t('settings.language')}</p>
                          <p className="text-sm text-dark-400">Choose your preferred language</p>
                        </div>
                        <LanguageSelector />
                      </div>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-dark-800/50">
                        <div>
                          <p className="font-medium text-white">{t('settings.currency')}</p>
                          <p className="text-sm text-dark-400">Set your default currency</p>
                        </div>
                        <CurrencySelector />
                      </div>
                    </div>
                  </div>
                  
                  {/* Subscription */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">{t('settings.subscription')}</h3>
                    <div className="p-4 rounded-xl bg-dark-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${user?.isPremium ? 'bg-amber-500/20' : 'bg-dark-700'}`}>
                            <Crown className={`w-5 h-5 ${user?.isPremium ? 'text-amber-400' : 'text-dark-400'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {user?.isPremium ? 'Pro Plan' : 'Free Plan'}
                            </p>
                            <p className="text-sm text-dark-400">
                              {user?.isPremium ? 'All features unlocked' : 'Upgrade for more features'}
                            </p>
                          </div>
                        </div>
                        {!user?.isPremium && (
                          <button
                            onClick={onUpgrade}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium hover:opacity-90 transition-opacity"
                          >
                            Upgrade
                          </button>
                        )}
                        {user?.isPremium && (
                          <button className="text-sm text-primary-400 hover:text-primary-300">
                            {t('settings.manageSubscription')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeSection === 'account' && (
                <div className="space-y-6">
                  {/* Profile */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Profile</h3>
                    <div className="p-4 rounded-xl bg-dark-800/50">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-white text-2xl font-bold">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">{user?.name}</p>
                          <p className="text-dark-400">{user?.email}</p>
                          {isFrozen && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs">
                              <Snowflake className="w-3 h-3" />
                              Account Frozen
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Account Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                    <div className="space-y-3">
                      {/* Freeze Account */}
                      <div className="p-4 rounded-xl bg-dark-800/50 border border-dark-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                              <Snowflake className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">
                                {isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
                              </p>
                              <p className="text-sm text-dark-400">
                                {isFrozen 
                                  ? 'Reactivate your account to continue using SplitElite'
                                  : 'Temporarily disable your account. Your data will be preserved.'
                                }
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowFreezeConfirm(true)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              isFrozen
                                ? 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
                                : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            }`}
                          >
                            {isFrozen ? 'Unfreeze' : 'Freeze'}
                          </button>
                        </div>
                      </div>
                      
                      {/* Delete Account */}
                      <div className="p-4 rounded-xl bg-dark-800/50 border border-red-500/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-red-500/20">
                              <Trash2 className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">Delete Account</p>
                              <p className="text-sm text-dark-400">
                                Permanently delete your account and all data. This cannot be undone.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      {/* Sign Out */}
                      <div className="p-4 rounded-xl bg-dark-800/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-dark-700">
                              <LogOut className="w-5 h-5 text-dark-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{t('auth.signOut')}</p>
                              <p className="text-sm text-dark-400">Sign out of your account</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              deleteAccount();
                              onClose();
                            }}
                            className="px-4 py-2 rounded-lg bg-dark-700 text-dark-300 hover:bg-dark-600 hover:text-white font-medium transition-colors"
                          >
                            {t('auth.signOut')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Freeze Confirmation */}
      {showFreezeConfirm && (
        <ConfirmDialog
          title={isFrozen ? 'Unfreeze Account' : 'Freeze Account'}
          message={
            isFrozen
              ? 'Your account will be reactivated and you can continue using SplitElite.'
              : 'Your account will be temporarily disabled. You can unfreeze it anytime to regain access.'
          }
          confirmLabel={isFrozen ? 'Unfreeze' : 'Freeze'}
          variant={isFrozen ? 'default' : 'warning'}
          onConfirm={handleFreeze}
          onCancel={() => setShowFreezeConfirm(false)}
        />
      )}
      
      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <ConfirmDialog
          title="Delete Account"
          message="This will permanently delete your account, all groups, expenses, and settlements. This action cannot be undone."
          confirmLabel="Delete Forever"
          variant="danger"
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  );
}
