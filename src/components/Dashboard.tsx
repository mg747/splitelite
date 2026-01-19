'use client';

import { useStore } from '@/store';
import { calculateBalances, generateAnalytics } from '@/lib/calculations';
import { useCurrency } from '@/hooks/useCurrency';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Receipt, 
  ArrowRight,
  Wallet,
  PieChart
} from 'lucide-react';

interface DashboardProps {
  onSelectGroup: (groupId: string) => void;
}

export default function Dashboard({ onSelectGroup }: DashboardProps) {
  const { user, groups, expenses } = useStore();
  const { formatAmount } = useCurrency();
  const { t } = useTranslation();
  
  // Calculate total balances across all groups
  const totalOwed = groups.reduce((total, group) => {
    const groupExpenses = expenses.filter(e => e.groupId === group.id);
    const balances = calculateBalances(groupExpenses, group.members);
    const userMember = group.members.find(m => m.email === user?.email);
    if (userMember) {
      const userBalance = balances.find(b => b.memberId === userMember.id);
      if (userBalance && userBalance.amount > 0) {
        return total + userBalance.amount;
      }
    }
    return total;
  }, 0);
  
  const totalOwe = groups.reduce((total, group) => {
    const groupExpenses = expenses.filter(e => e.groupId === group.id);
    const balances = calculateBalances(groupExpenses, group.members);
    const userMember = group.members.find(m => m.email === user?.email);
    if (userMember) {
      const userBalance = balances.find(b => b.memberId === userMember.id);
      if (userBalance && userBalance.amount < 0) {
        return total + Math.abs(userBalance.amount);
      }
    }
    return total;
  }, 0);
  
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {t('dashboard.welcomeBack', { name: user?.name?.split(' ')[0] || '' })}
          </h1>
          <p className="text-dark-400 mt-1 text-sm md:text-base">{t('dashboard.overview')}</p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl bg-green-500/20">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
              </div>
              <span className="text-xs text-dark-400 hidden sm:block">{t('dashboard.youreOwed')}</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-green-400">
              {formatAmount(totalOwed)}
            </p>
            <p className="text-xs md:text-sm text-dark-400 mt-1">{t('dashboard.youreOwed')}</p>
          </div>
          
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl bg-red-500/20">
                <TrendingDown className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
              </div>
              <span className="text-xs text-dark-400 hidden sm:block">{t('dashboard.youOwe')}</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-red-400">
              {formatAmount(totalOwe)}
            </p>
            <p className="text-xs md:text-sm text-dark-400 mt-1">{t('dashboard.youOwe')}</p>
          </div>
          
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl bg-blue-500/20">
                <Receipt className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
              </div>
              <span className="text-xs text-dark-400 hidden sm:block">{t('dashboard.totalTracked')}</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-white">
              {formatAmount(totalExpenses)}
            </p>
            <p className="text-xs md:text-sm text-dark-400 mt-1">{expenses.length} {t('common.expenses')}</p>
          </div>
          
          <div className="card p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="p-2 md:p-3 rounded-xl bg-purple-500/20">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
              </div>
              <span className="text-xs text-dark-400 hidden sm:block">{t('dashboard.activeGroups')}</span>
            </div>
            <p className="text-xl md:text-3xl font-bold text-white">{groups.length}</p>
            <p className="text-xs md:text-sm text-dark-400 mt-1">
              {groups.reduce((sum, g) => sum + g.members.length, 0)} {t('common.members')}
            </p>
          </div>
        </div>
        
        {/* Groups and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Groups */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{t('dashboard.yourGroups')}</h2>
              <button className="text-primary-400 text-sm font-medium hover:text-primary-300">
                {t('dashboard.viewAll')}
              </button>
            </div>
            
            <div className="space-y-4">
              {groups.slice(0, 4).map((group) => {
                const groupExpenses = expenses.filter(e => e.groupId === group.id);
                const balances = calculateBalances(groupExpenses, group.members);
                const userMember = group.members.find(m => m.email === user?.email);
                const userBalance = userMember 
                  ? balances.find(b => b.memberId === userMember.id)?.amount || 0
                  : 0;
                
                return (
                  <button
                    key={group.id}
                    onClick={() => onSelectGroup(group.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all group"
                  >
                    <span className="text-3xl">{group.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-white">{group.name}</p>
                      <p className="text-sm text-dark-400">{group.members.length} {t('common.members')}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        userBalance > 0 ? 'text-green-400' : userBalance < 0 ? 'text-red-400' : 'text-dark-400'
                      }`}>
                        {userBalance > 0 ? '+' : ''}{formatAmount(userBalance)}
                      </p>
                      <p className="text-xs text-dark-500">{t('dashboard.yourBalance')}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-dark-500 group-hover:text-primary-400 transition-colors" />
                  </button>
                );
              })}
              
              {groups.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-dark-600 mb-3" />
                  <p className="text-dark-400">{t('dashboard.noGroups')}</p>
                  <p className="text-sm text-dark-500 mt-1">{t('dashboard.createFirstGroup')}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{t('dashboard.recentActivity')}</h2>
              <button className="text-primary-400 text-sm font-medium hover:text-primary-300">
                {t('dashboard.viewAll')}
              </button>
            </div>
            
            <div className="space-y-4">
              {recentExpenses.map((expense) => {
                const group = groups.find(g => g.id === expense.groupId);
                const payer = group?.members.find(m => m.id === expense.paidBy);
                
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-dark-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{expense.description}</p>
                      <p className="text-sm text-dark-400">
                        {payer?.name} paid • {group?.name}
                      </p>
                    </div>
                    <p className="font-semibold text-white">
                      {formatAmount(expense.amount)}
                    </p>
                  </div>
                );
              })}
              
              {recentExpenses.length === 0 && (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 mx-auto text-dark-600 mb-3" />
                  <p className="text-dark-400">{t('dashboard.noExpenses')}</p>
                  <p className="text-sm text-dark-500 mt-1">{t('dashboard.addFirstExpense')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
