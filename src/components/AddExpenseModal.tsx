'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { splitEqually } from '@/lib/calculations';
import { ExpenseCategory, Split } from '@/types';
import { currencies } from '@/i18n/config';
import { useTranslation } from '@/hooks/useTranslation';
import { X, Receipt, Calendar, ChevronDown } from 'lucide-react';

interface AddExpenseModalProps {
  groupId: string;
  onClose: () => void;
}

const categories: { value: ExpenseCategory; label: string; emoji: string }[] = [
  { value: 'food', label: 'Food & Dining', emoji: '🍔' },
  { value: 'transport', label: 'Transport', emoji: '🚗' },
  { value: 'accommodation', label: 'Accommodation', emoji: '🏨' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️' },
  { value: 'utilities', label: 'Utilities', emoji: '💡' },
  { value: 'groceries', label: 'Groceries', emoji: '🛒' },
  { value: 'health', label: 'Health', emoji: '💊' },
  { value: 'other', label: 'Other', emoji: '📦' },
];

export default function AddExpenseModal({ groupId, onClose }: AddExpenseModalProps) {
  const { groups, addExpense, currency: defaultCurrency } = useStore();
  const { t } = useTranslation();
  const group = groups.find(g => g.id === groupId);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency || 'USD');
  const [paidBy, setPaidBy] = useState(group?.members[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    group?.members.map(m => m.id) || []
  );
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  
  if (!group) return null;

  const currentCurrencyData = currencies.find(c => c.code === selectedCurrency) || currencies[0];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (!description || isNaN(amountNum) || amountNum <= 0) return;
    
    const splits: Split[] = splitEqually(amountNum, selectedMembers).map(s => ({
      ...s,
      isPaid: false,
    }));
    
    addExpense({
      groupId,
      description,
      amount: amountNum,
      currency: selectedCurrency,
      paidBy,
      splitBetween: splits,
      category,
      date: new Date(date),
    });
    
    onClose();
  };
  
  const toggleMember = (memberId: string) => {
    setSelectedMembers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="modal-3d bg-dark-900/95 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-primary-500/30 shadow-2xl animate-slide-up neon-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/30 to-emerald-500/30 neon-glow">
              <Receipt className="w-6 h-6 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">{t('expenses.addExpense')}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              className="input-neon"
              required
            />
          </div>
          
          {/* Amount with Currency Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider">
              Amount
            </label>
            <div className="flex gap-2">
              {/* Currency Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                  className="h-full px-4 py-3 rounded-xl bg-dark-800 border border-dark-600 hover:border-primary-500 transition-all flex items-center gap-2 text-white font-semibold min-w-[100px]"
                >
                  <span className="text-lg">{currentCurrencyData.symbol}</span>
                  <span className="text-sm text-dark-400">{selectedCurrency}</span>
                  <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showCurrencyDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 py-2 bg-dark-800 border border-dark-600 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto">
                    {currencies.map((curr) => (
                      <button
                        key={curr.code}
                        type="button"
                        onClick={() => {
                          setSelectedCurrency(curr.code);
                          setShowCurrencyDropdown(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-dark-700 transition-colors ${
                          selectedCurrency === curr.code ? 'text-primary-400 bg-primary-500/10' : 'text-dark-300'
                        }`}
                      >
                        <span className="w-6 font-semibold">{curr.symbol}</span>
                        <span>{curr.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Amount Input */}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input-neon flex-1 text-2xl font-bold"
                required
              />
            </div>
          </div>
          
          {/* Paid By */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider">
              Paid by
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="input-neon"
            >
              {group.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`category-btn p-3 rounded-xl text-center transition-all transform hover:scale-105 ${
                    category === cat.value
                      ? 'bg-gradient-to-br from-primary-500/30 to-emerald-500/30 border-2 border-primary-500 neon-glow'
                      : 'bg-dark-800/50 border-2 border-transparent hover:border-dark-600'
                  }`}
                >
                  <span className="text-2xl block mb-1">{cat.emoji}</span>
                  <span className="text-xs text-dark-300">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400 pointer-events-none" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-neon pr-12"
              />
            </div>
          </div>
          
          {/* Split Between */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider">
              Split between
            </label>
            <div className="space-y-2">
              {group.members.map((member) => (
                <label
                  key={member.id}
                  className={`member-card flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all transform hover:scale-[1.02] ${
                    selectedMembers.includes(member.id)
                      ? 'bg-gradient-to-r from-primary-500/20 to-emerald-500/20 border border-primary-500/50 neon-glow-subtle'
                      : 'bg-dark-800/50 border border-transparent hover:border-dark-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="sr-only"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    selectedMembers.includes(member.id)
                      ? 'bg-gradient-to-br from-primary-500 to-emerald-500 border-primary-500'
                      : 'border-dark-500'
                  }`}>
                    {selectedMembers.includes(member.id) && (
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold shadow-lg">
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-white font-semibold flex-1">{member.name}</span>
                  {selectedMembers.includes(member.id) && amount && (
                    <span className="text-primary-400 font-bold text-lg">
                      {currentCurrencyData.symbol}{(parseFloat(amount) / selectedMembers.length).toFixed(2)}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary-3d flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description || !amount || selectedMembers.length === 0}
              className="btn-primary-3d flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10">Add Expense</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
