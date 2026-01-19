'use client';

import { useStore } from '@/store';
import { useTranslations } from 'next-intl';
import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  Settings, 
  Crown,
  LogOut,
  ChevronRight
} from 'lucide-react';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';

interface SidebarProps {
  onNewGroup: () => void;
  onUpgrade: () => void;
}

export default function Sidebar({ onNewGroup, onUpgrade }: SidebarProps) {
  const { user, groups, activeGroupId, setActiveGroup } = useStore();
  const t = useTranslations();
  
  const groupEmojis: Record<string, string> = {
    trip: '✈️',
    home: '🏠',
    couple: '💑',
    event: '🎉',
    work: '💼',
    other: '📁',
  };
  
  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-dark-900/95 to-dark-950 border-r border-amber-900/20 flex flex-col vintage-texture">
      {/* Logo - Peaky Blinders Style */}
      <div className="p-6 border-b border-amber-900/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent"></div>
        <div className="relative">
          <h1 className="text-3xl font-bold peaky-title gradient-gold">{t('common.appName')}</h1>
          <p className="text-amber-600/70 text-sm mt-1 italic">"In the bleak midwinter..."</p>
          <div className="peaky-divider mt-4"></div>
        </div>
      </div>
      
      {/* User */}
      {user && (
        <div className="p-4 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-white font-semibold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-dark-400 truncate">{user.email}</p>
            </div>
            {user.isPremium ? (
              <span className="badge-premium">
                <Crown className="w-3 h-3 mr-1" />
                PRO
              </span>
            ) : (
              <span className="badge-free">Free</span>
            )}
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          <button
            onClick={() => setActiveGroup(null)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeGroupId === null
                ? 'bg-primary-500/20 text-primary-400'
                : 'text-dark-300 hover:bg-dark-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </button>
        </div>
        
        {/* Groups */}
        <div className="mt-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <span className="text-xs font-semibold text-dark-400 uppercase tracking-wider">
              {t('groups.members')}
            </span>
            <button
              onClick={onNewGroup}
              className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  activeGroupId === group.id
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{group.emoji || groupEmojis[group.category]}</span>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium truncate">{group.name}</p>
                  <p className="text-xs text-dark-500">{group.members.length} {t('common.members')}</p>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${
                  activeGroupId === group.id ? 'opacity-100' : ''
                }`} />
              </button>
            ))}
            
            {groups.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Users className="w-12 h-12 mx-auto text-dark-600 mb-3" />
                <p className="text-dark-400 text-sm">{t('dashboard.noGroups')}</p>
                <button
                  onClick={onNewGroup}
                  className="mt-3 text-primary-400 text-sm font-medium hover:text-primary-300"
                >
                  {t('dashboard.createFirstGroup')}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
      
      {/* Upgrade CTA */}
      {user && !user.isPremium && (
        <div className="p-4 border-t border-dark-700">
          <button
            onClick={onUpgrade}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20">
                <Crown className="w-5 h-5 text-amber-400" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-amber-300">{t('upgrade.upgradeToPro')}</p>
                <p className="text-xs text-amber-400/70">{t('upgrade.unlockFeatures')}</p>
              </div>
            </div>
          </button>
        </div>
      )}
      
      {/* Language & Currency */}
      <div className="p-4 border-t border-dark-700">
        <div className="flex items-center gap-2 mb-3">
          <LanguageSelector />
          <CurrencySelector />
        </div>
      </div>

      {/* Settings */}
      <div className="p-4 border-t border-dark-700">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">{t('settings.title')}</span>
        </button>
      </div>
    </aside>
  );
}
