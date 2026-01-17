export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  createdAt: Date;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  members: Member[];
  createdAt: Date;
  updatedAt: Date;
  currency: string;
  category: GroupCategory;
}

export interface Member {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export type GroupCategory = 'trip' | 'home' | 'couple' | 'event' | 'work' | 'other';

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string; // member id
  splitBetween: Split[];
  category: ExpenseCategory;
  date: Date;
  createdAt: Date;
  receiptUrl?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringFrequency?: 'weekly' | 'monthly' | 'yearly';
}

export interface Split {
  memberId: string;
  amount: number;
  percentage?: number;
  isPaid: boolean;
}

export type ExpenseCategory = 
  | 'food' 
  | 'transport' 
  | 'accommodation' 
  | 'entertainment' 
  | 'shopping' 
  | 'utilities' 
  | 'groceries'
  | 'health'
  | 'other';

export interface Balance {
  memberId: string;
  memberName: string;
  amount: number; // positive = owed to them, negative = they owe
}

export interface Settlement {
  id: string;
  groupId: string;
  from: string; // member id
  to: string; // member id
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  method?: PaymentMethod;
  reminderSent?: boolean;
}

export type PaymentMethod = 'cash' | 'venmo' | 'paypal' | 'zelle' | 'bank' | 'other';

export interface PremiumFeatures {
  receiptScanning: boolean;
  analytics: boolean;
  exportData: boolean;
  recurringExpenses: boolean;
  unlimitedGroups: boolean;
  prioritySupport: boolean;
  customCategories: boolean;
  settlementReminders: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: PremiumFeatures;
  stripePriceId?: string;
}

export interface Analytics {
  totalSpent: number;
  categoryBreakdown: { category: ExpenseCategory; amount: number; percentage: number }[];
  monthlyTrend: { month: string; amount: number }[];
  topSpenders: { memberId: string; name: string; amount: number }[];
  averageExpense: number;
  expenseCount: number;
}
