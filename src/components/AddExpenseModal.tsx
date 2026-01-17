'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { splitEqually } from '@/lib/calculations';
import { ExpenseCategory, Split } from '@/types';
import { X, Receipt, Users, Calendar, DollarSign, Tag } from 'lucide-react';

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
  const { groups, addExpense } = useStore();
  const group = groups.find(g => g.id === groupId);
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(group?.members[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    group?.members.map(m => m.id) || []
  );
  
  if (!group) return null;
  
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
      currency: group.currency,
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-dark-700 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <Receipt className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Add Expense</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this expense for?"
              className="input"
              required
            />
          </div>
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="input pl-12"
                required
              />
            </div>
          </div>
          
          {/* Paid By */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Paid by
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="input"
            >
              {group.members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    category === cat.value
                      ? 'bg-primary-500/20 border-2 border-primary-500'
                      : 'bg-dark-800 border-2 border-transparent hover:border-dark-600'
                  }`}
                >
                  <span className="text-xl block mb-1">{cat.emoji}</span>
                  <span className="text-xs text-dark-300">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input pl-12"
              />
            </div>
          </div>
          
          {/* Split Between */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Split between
            </label>
            <div className="space-y-2">
              {group.members.map((member) => (
                <label
                  key={member.id}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedMembers.includes(member.id)
                      ? 'bg-primary-500/20 border border-primary-500/50'
                      : 'bg-dark-800 border border-transparent hover:border-dark-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.id)}
                    onChange={() => toggleMember(member.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                    selectedMembers.includes(member.id)
                      ? 'bg-primary-500 border-primary-500'
                      : 'border-dark-500'
                  }`}>
                    {selectedMembers.includes(member.id) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-white font-semibold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <span className="text-white font-medium">{member.name}</span>
                  {selectedMembers.includes(member.id) && amount && (
                    <span className="ml-auto text-dark-400 text-sm">
                      ${(parseFloat(amount) / selectedMembers.length).toFixed(2)}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!description || !amount || selectedMembers.length === 0}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
