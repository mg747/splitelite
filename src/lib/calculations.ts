import { Expense, Balance, Member, Settlement, Analytics, ExpenseCategory } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

/**
 * Calculate balances for all members in a group based on expenses
 * Positive balance = others owe this person
 * Negative balance = this person owes others
 */
export function calculateBalances(expenses: Expense[], members: Member[]): Balance[] {
  const balanceMap = new Map<string, number>();
  
  // Initialize all members with 0 balance
  members.forEach(member => {
    balanceMap.set(member.id, 0);
  });
  
  expenses.forEach(expense => {
    // Person who paid gets credited the full amount
    const currentPaidByBalance = balanceMap.get(expense.paidBy) || 0;
    balanceMap.set(expense.paidBy, currentPaidByBalance + expense.amount);
    
    // Each person in the split owes their share
    expense.splitBetween.forEach(split => {
      if (!split.isPaid) {
        const currentBalance = balanceMap.get(split.memberId) || 0;
        balanceMap.set(split.memberId, currentBalance - split.amount);
      }
    });
  });
  
  return members.map(member => ({
    memberId: member.id,
    memberName: member.name,
    amount: Math.round((balanceMap.get(member.id) || 0) * 100) / 100,
  }));
}

/**
 * Calculate optimal settlements to minimize transactions
 * Uses a greedy algorithm to match creditors with debtors
 */
export function calculateOptimalSettlements(
  balances: Balance[],
  groupId: string
): Omit<Settlement, 'id' | 'createdAt'>[] {
  const settlements: Omit<Settlement, 'id' | 'createdAt'>[] = [];
  
  // Separate into creditors (positive balance) and debtors (negative balance)
  const creditors = balances
    .filter(b => b.amount > 0.01)
    .map(b => ({ ...b }))
    .sort((a, b) => b.amount - a.amount);
    
  const debtors = balances
    .filter(b => b.amount < -0.01)
    .map(b => ({ ...b, amount: Math.abs(b.amount) }))
    .sort((a, b) => b.amount - a.amount);
  
  let i = 0;
  let j = 0;
  
  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    
    const settlementAmount = Math.min(creditor.amount, debtor.amount);
    
    if (settlementAmount > 0.01) {
      settlements.push({
        groupId,
        from: debtor.memberId,
        to: creditor.memberId,
        amount: Math.round(settlementAmount * 100) / 100,
        status: 'pending',
      });
    }
    
    creditor.amount -= settlementAmount;
    debtor.amount -= settlementAmount;
    
    if (creditor.amount < 0.01) i++;
    if (debtor.amount < 0.01) j++;
  }
  
  return settlements;
}

/**
 * Split expense equally among members
 */
export function splitEqually(amount: number, memberIds: string[]): { memberId: string; amount: number }[] {
  const perPerson = amount / memberIds.length;
  const rounded = Math.floor(perPerson * 100) / 100;
  const remainder = Math.round((amount - rounded * memberIds.length) * 100) / 100;
  
  return memberIds.map((memberId, index) => ({
    memberId,
    amount: index === 0 ? rounded + remainder : rounded,
  }));
}

/**
 * Split expense by percentages
 */
export function splitByPercentage(
  amount: number,
  splits: { memberId: string; percentage: number }[]
): { memberId: string; amount: number; percentage: number }[] {
  const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
  
  if (Math.abs(totalPercentage - 100) > 0.01) {
    throw new Error('Percentages must sum to 100');
  }
  
  return splits.map(split => ({
    memberId: split.memberId,
    amount: Math.round((amount * split.percentage / 100) * 100) / 100,
    percentage: split.percentage,
  }));
}

/**
 * Split expense by exact amounts
 */
export function splitByAmount(
  totalAmount: number,
  splits: { memberId: string; amount: number }[]
): { memberId: string; amount: number }[] {
  const totalSplit = splits.reduce((sum, s) => sum + s.amount, 0);
  
  if (Math.abs(totalSplit - totalAmount) > 0.01) {
    throw new Error('Split amounts must equal total amount');
  }
  
  return splits;
}

/**
 * Generate analytics for premium users
 */
export function generateAnalytics(expenses: Expense[], members: Member[]): Analytics {
  if (expenses.length === 0) {
    return {
      totalSpent: 0,
      categoryBreakdown: [],
      monthlyTrend: [],
      topSpenders: [],
      averageExpense: 0,
      expenseCount: 0,
    };
  }
  
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  
  // Category breakdown
  const categoryTotals = new Map<ExpenseCategory, number>();
  expenses.forEach(expense => {
    const current = categoryTotals.get(expense.category) || 0;
    categoryTotals.set(expense.category, current + expense.amount);
  });
  
  const categoryBreakdown = Array.from(categoryTotals.entries())
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage: Math.round((amount / totalSpent) * 1000) / 10,
    }))
    .sort((a, b) => b.amount - a.amount);
  
  // Monthly trend (last 6 months)
  const monthlyTrend: { month: string; amount: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const monthDate = subMonths(new Date(), i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    
    const monthTotal = expenses
      .filter(e => isWithinInterval(new Date(e.date), { start: monthStart, end: monthEnd }))
      .reduce((sum, e) => sum + e.amount, 0);
    
    monthlyTrend.push({
      month: format(monthDate, 'MMM'),
      amount: Math.round(monthTotal * 100) / 100,
    });
  }
  
  // Top spenders (who paid the most)
  const spenderTotals = new Map<string, number>();
  expenses.forEach(expense => {
    const current = spenderTotals.get(expense.paidBy) || 0;
    spenderTotals.set(expense.paidBy, current + expense.amount);
  });
  
  const topSpenders = Array.from(spenderTotals.entries())
    .map(([memberId, amount]) => ({
      memberId,
      name: members.find(m => m.id === memberId)?.name || 'Unknown',
      amount: Math.round(amount * 100) / 100,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);
  
  return {
    totalSpent: Math.round(totalSpent * 100) / 100,
    categoryBreakdown,
    monthlyTrend,
    topSpenders,
    averageExpense: Math.round((totalSpent / expenses.length) * 100) / 100,
    expenseCount: expenses.length,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Get category emoji
 */
export function getCategoryEmoji(category: ExpenseCategory): string {
  const emojis: Record<ExpenseCategory, string> = {
    food: '🍔',
    transport: '🚗',
    accommodation: '🏨',
    entertainment: '🎬',
    shopping: '🛍️',
    utilities: '💡',
    groceries: '🛒',
    health: '💊',
    other: '📦',
  };
  return emojis[category];
}

/**
 * Get category label
 */
export function getCategoryLabel(category: ExpenseCategory): string {
  const labels: Record<ExpenseCategory, string> = {
    food: 'Food & Dining',
    transport: 'Transport',
    accommodation: 'Accommodation',
    entertainment: 'Entertainment',
    shopping: 'Shopping',
    utilities: 'Utilities',
    groceries: 'Groceries',
    health: 'Health',
    other: 'Other',
  };
  return labels[category];
}
