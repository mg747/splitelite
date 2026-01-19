'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { 
  calculateBalances, 
  calculateOptimalSettlements, 
  getCategoryEmoji,
  getCategoryLabel,
  generateAnalytics
} from '@/lib/calculations';
import { useCurrency } from '@/hooks/useCurrency';
import { 
  Plus, 
  ArrowRight, 
  Receipt, 
  Users, 
  TrendingUp,
  TrendingDown,
  Check,
  X,
  MoreVertical,
  Calendar,
  Crown,
  BarChart3,
  Download,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';
import { Expense, Settlement } from '@/types';

interface GroupViewProps {
  groupId: string;
  onAddExpense: () => void;
  onUpgrade: () => void;
}

export default function GroupView({ groupId, onAddExpense, onUpgrade }: GroupViewProps) {
  const { user, groups, expenses, settlements, completeSettlement, addSettlement } = useStore();
  const { formatAmount } = useCurrency();
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'analytics'>('expenses');
  
  const group = groups.find(g => g.id === groupId);
  if (!group) return null;
  
  const groupExpenses = expenses.filter(e => e.groupId === groupId);
  const groupSettlements = settlements.filter(s => s.groupId === groupId);
  const balances = calculateBalances(groupExpenses, group.members);
  const suggestedSettlements = calculateOptimalSettlements(balances, groupId);
  const analytics = generateAnalytics(groupExpenses, group.members);
  
  const totalSpent = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const handleSettleUp = (settlement: Omit<Settlement, 'id' | 'createdAt'>) => {
    addSettlement(settlement);
  };
  
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-4xl md:text-5xl">{group.emoji}</span>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{group.name}</h1>
              <p className="text-dark-400 mt-1 text-sm md:text-base">
                {group.members.length} members • {groupExpenses.length} expenses
              </p>
            </div>
          </div>
          <button onClick={onAddExpense} className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="card p-3 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Receipt className="w-4 h-4 md:w-5 md:h-5 text-primary-400" />
              <span className="text-dark-400 text-xs md:text-base hidden sm:block">Total Spent</span>
            </div>
            <p className="text-lg md:text-3xl font-bold text-white">{formatAmount(totalSpent)}</p>
            <p className="text-xs text-dark-500 sm:hidden">Total</p>
          </div>
          
          <div className="card p-3 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
              <span className="text-dark-400 text-xs md:text-base hidden sm:block">Per Person</span>
            </div>
            <p className="text-lg md:text-3xl font-bold text-white">
              {formatAmount(totalSpent / group.members.length)}
            </p>
            <p className="text-xs text-dark-500 sm:hidden">Per person</p>
          </div>
          
          <div className="card p-3 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />
              <span className="text-dark-400 text-xs md:text-base hidden sm:block">Last Activity</span>
            </div>
            <p className="text-sm md:text-xl font-bold text-white">
              {groupExpenses.length > 0 
                ? format(new Date(groupExpenses[groupExpenses.length - 1].date), 'MMM d')
                : 'None'
              }
            </p>
            <p className="text-xs text-dark-500 sm:hidden">Last</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
          {(['expenses', 'balances', 'analytics'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === 'analytics' && !user?.isPremium) {
                  onUpgrade();
                  return;
                }
                setActiveTab(tab);
              }}
              className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap text-sm md:text-base ${
                activeTab === tab
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-white'
              }`}
            >
              {tab === 'expenses' && <Receipt className="w-4 h-4" />}
              {tab === 'balances' && <Users className="w-4 h-4" />}
              {tab === 'analytics' && (
                <>
                  <BarChart3 className="w-4 h-4" />
                  {!user?.isPremium && <Crown className="w-3 h-3 text-amber-400" />}
                </>
              )}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content */}
        {activeTab === 'expenses' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">All Expenses</h2>
            
            {groupExpenses.length === 0 ? (
              <div className="text-center py-12">
                <Receipt className="w-16 h-16 mx-auto text-dark-600 mb-4" />
                <p className="text-dark-400 text-lg">No expenses yet</p>
                <p className="text-dark-500 mt-1">Add your first expense to start tracking</p>
                <button onClick={onAddExpense} className="btn-primary mt-6">
                  <Plus className="w-5 h-5 mr-2 inline" />
                  Add First Expense
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {[...groupExpenses]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => {
                    const payer = group.members.find(m => m.id === expense.paidBy);
                    
                    return (
                      <div
                        key={expense.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center text-2xl">
                          {getCategoryEmoji(expense.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white">{expense.description}</p>
                          <p className="text-sm text-dark-400">
                            {payer?.name} paid • {format(new Date(expense.date), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white text-lg">
                            {formatAmount(expense.amount)}
                          </p>
                          <p className="text-xs text-dark-500">
                            {formatAmount(expense.amount / expense.splitBetween.length)}/person
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'balances' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Individual Balances */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6">Member Balances</h2>
              <div className="space-y-4">
                {balances.map((balance) => (
                  <div
                    key={balance.memberId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-white font-semibold">
                      {balance.memberName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{balance.memberName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {balance.amount > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      ) : balance.amount < 0 ? (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      ) : null}
                      <p className={`font-bold ${
                        balance.amount > 0 
                          ? 'text-green-400' 
                          : balance.amount < 0 
                            ? 'text-red-400' 
                            : 'text-dark-400'
                      }`}>
                        {balance.amount > 0 ? '+' : ''}{formatAmount(balance.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Suggested Settlements */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6">Settle Up</h2>
              
              {suggestedSettlements.length === 0 ? (
                <div className="text-center py-8">
                  <Check className="w-12 h-12 mx-auto text-green-400 mb-3" />
                  <p className="text-green-400 font-medium">All settled up!</p>
                  <p className="text-dark-500 text-sm mt-1">No payments needed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestedSettlements.map((settlement, index) => {
                    const from = group.members.find(m => m.id === settlement.from);
                    const to = group.members.find(m => m.id === settlement.to);
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-semibold text-sm">
                            {from?.name.charAt(0)}
                          </div>
                          <ArrowRight className="w-4 h-4 text-dark-500" />
                          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 font-semibold text-sm">
                            {to?.name.charAt(0)}
                          </div>
                          <div className="ml-2">
                            <p className="text-sm text-white">
                              <span className="text-red-400">{from?.name}</span>
                              {' → '}
                              <span className="text-green-400">{to?.name}</span>
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-white">
                          {formatAmount(settlement.amount)}
                        </p>
                        <button
                          onClick={() => handleSettleUp(settlement)}
                          className="p-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Premium Features Teaser */}
              {!user?.isPremium && (
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-amber-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-300">
                        Send payment reminders
                      </p>
                      <p className="text-xs text-amber-400/70">
                        Upgrade to Pro to nudge friends
                      </p>
                    </div>
                    <button
                      onClick={onUpgrade}
                      className="text-xs font-medium text-amber-400 hover:text-amber-300"
                    >
                      Upgrade
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && user?.isPremium && (
          <div className="space-y-6">
            {/* Category Breakdown */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Spending by Category</h2>
                <button className="btn-secondary text-sm flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              
              {analytics.categoryBreakdown.length === 0 ? (
                <p className="text-dark-400 text-center py-8">No data yet</p>
              ) : (
                <div className="space-y-4">
                  {analytics.categoryBreakdown.map((cat) => (
                    <div key={cat.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{getCategoryEmoji(cat.category)}</span>
                          <span className="text-white font-medium">
                            {getCategoryLabel(cat.category)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-semibold">
                            {formatAmount(cat.amount)}
                          </span>
                          <span className="text-dark-400 text-sm ml-2">
                            ({cat.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full transition-all"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Top Spenders */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-6">Top Spenders</h2>
              <div className="space-y-3">
                {analytics.topSpenders.map((spender, index) => (
                  <div
                    key={spender.memberId}
                    className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0 ? 'bg-amber-500 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-amber-700 text-white' :
                      'bg-dark-600 text-dark-300'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{spender.name}</p>
                    </div>
                    <p className="font-bold text-white">{formatAmount(spender.amount)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <p className="text-dark-400 mb-2">Total Expenses</p>
                <p className="text-3xl font-bold text-white">{analytics.expenseCount}</p>
              </div>
              <div className="card text-center">
                <p className="text-dark-400 mb-2">Average Expense</p>
                <p className="text-3xl font-bold text-white">
                  {formatAmount(analytics.averageExpense)}
                </p>
              </div>
              <div className="card text-center">
                <p className="text-dark-400 mb-2">Total Tracked</p>
                <p className="text-3xl font-bold gradient-text">
                  {formatAmount(analytics.totalSpent)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
