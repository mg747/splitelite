import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { User, Group, Expense, Settlement, Member, Split, ExpenseCategory, GroupCategory } from '@/types';
import { type Locale, type CurrencyCode, defaultLocale, getDefaultCurrency, detectLocale } from '@/i18n/config';

interface AppState {
  // Locale & Currency
  locale: Locale;
  currency: CurrencyCode;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: CurrencyCode) => void;
  // User
  user: User | null;
  setUser: (user: User | null) => void;
  upgradeToPremium: () => void;
  freezeAccount: () => void;
  unfreezeAccount: () => void;
  deleteAccount: () => void;
  
  // Groups
  groups: Group[];
  addGroup: (group: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateGroup: (id: string, updates: Partial<Group>) => void;
  deleteGroup: (id: string) => void;
  addMemberToGroup: (groupId: string, member: Omit<Member, 'id'>) => void;
  removeMemberFromGroup: (groupId: string, memberId: string) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => string;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  getGroupExpenses: (groupId: string) => Expense[];
  
  // Settlements
  settlements: Settlement[];
  addSettlement: (settlement: Omit<Settlement, 'id' | 'createdAt'>) => string;
  completeSettlement: (id: string) => void;
  cancelSettlement: (id: string) => void;
  getGroupSettlements: (groupId: string) => Settlement[];
  
  // UI State
  activeGroupId: string | null;
  setActiveGroup: (id: string | null) => void;
  
  // Demo data
  loadDemoData: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Locale & Currency
      locale: defaultLocale,
      currency: 'USD',
      setLocale: (locale) => {
        set({ locale, currency: getDefaultCurrency(locale) });
      },
      setCurrency: (currency) => set({ currency }),

      // User
      user: null,
      setUser: (user) => set({ user }),
      upgradeToPremium: () => set((state) => ({
        user: state.user ? { ...state.user, isPremium: true } : null
      })),
      freezeAccount: () => set((state) => ({
        user: state.user ? { ...state.user, status: 'frozen' } : null
      })),
      unfreezeAccount: () => set((state) => ({
        user: state.user ? { ...state.user, status: 'active' } : null
      })),
      deleteAccount: () => set({
        user: null,
        groups: [],
        expenses: [],
        settlements: [],
        activeGroupId: null,
      }),
      
      // Groups
      groups: [],
      addGroup: (groupData) => {
        const id = uuidv4();
        const now = new Date();
        const group: Group = {
          ...groupData,
          id,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ groups: [...state.groups, group] }));
        return id;
      },
      updateGroup: (id, updates) => set((state) => ({
        groups: state.groups.map((g) =>
          g.id === id ? { ...g, ...updates, updatedAt: new Date() } : g
        ),
      })),
      deleteGroup: (id) => set((state) => ({
        groups: state.groups.filter((g) => g.id !== id),
        expenses: state.expenses.filter((e) => e.groupId !== id),
        settlements: state.settlements.filter((s) => s.groupId !== id),
        activeGroupId: state.activeGroupId === id ? null : state.activeGroupId,
      })),
      addMemberToGroup: (groupId, memberData) => {
        const member: Member = { ...memberData, id: uuidv4() };
        set((state) => ({
          groups: state.groups.map((g) =>
            g.id === groupId
              ? { ...g, members: [...g.members, member], updatedAt: new Date() }
              : g
          ),
        }));
      },
      removeMemberFromGroup: (groupId, memberId) => set((state) => ({
        groups: state.groups.map((g) =>
          g.id === groupId
            ? { ...g, members: g.members.filter((m) => m.id !== memberId), updatedAt: new Date() }
            : g
        ),
      })),
      
      // Expenses
      expenses: [],
      addExpense: (expenseData) => {
        const id = uuidv4();
        const expense: Expense = {
          ...expenseData,
          id,
          createdAt: new Date(),
        };
        set((state) => ({ expenses: [...state.expenses, expense] }));
        return id;
      },
      updateExpense: (id, updates) => set((state) => ({
        expenses: state.expenses.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
      })),
      deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id),
      })),
      getGroupExpenses: (groupId) => get().expenses.filter((e) => e.groupId === groupId),
      
      // Settlements
      settlements: [],
      addSettlement: (settlementData) => {
        const id = uuidv4();
        const settlement: Settlement = {
          ...settlementData,
          id,
          createdAt: new Date(),
        };
        set((state) => ({ settlements: [...state.settlements, settlement] }));
        return id;
      },
      completeSettlement: (id) => set((state) => ({
        settlements: state.settlements.map((s) =>
          s.id === id ? { ...s, status: 'completed', completedAt: new Date() } : s
        ),
      })),
      cancelSettlement: (id) => set((state) => ({
        settlements: state.settlements.map((s) =>
          s.id === id ? { ...s, status: 'cancelled' } : s
        ),
      })),
      getGroupSettlements: (groupId) => get().settlements.filter((s) => s.groupId === groupId),
      
      // UI State
      activeGroupId: null,
      setActiveGroup: (id) => set({ activeGroupId: id }),
      
      // Demo data
      loadDemoData: () => {
        const userId = uuidv4();
        const user: User = {
          id: userId,
          name: 'Alex Johnson',
          email: 'alex@example.com',
          isPremium: false,
          createdAt: new Date(),
        };
        
        const members: Member[] = [
          { id: uuidv4(), name: 'Alex Johnson', email: 'alex@example.com' },
          { id: uuidv4(), name: 'Sarah Chen', email: 'sarah@example.com' },
          { id: uuidv4(), name: 'Mike Wilson', email: 'mike@example.com' },
          { id: uuidv4(), name: 'Emma Davis', email: 'emma@example.com' },
        ];
        
        const groupId = uuidv4();
        const group: Group = {
          id: groupId,
          name: 'Europe Trip 2024',
          description: 'Summer vacation across Europe',
          emoji: '✈️',
          members,
          createdAt: new Date('2024-06-01'),
          updatedAt: new Date(),
          currency: 'USD',
          category: 'trip',
        };
        
        const homeGroupId = uuidv4();
        const homeMembers: Member[] = [
          { id: uuidv4(), name: 'Alex Johnson', email: 'alex@example.com' },
          { id: uuidv4(), name: 'Jordan Lee', email: 'jordan@example.com' },
          { id: uuidv4(), name: 'Casey Brown', email: 'casey@example.com' },
        ];
        
        const homeGroup: Group = {
          id: homeGroupId,
          name: 'Apartment 4B',
          description: 'Monthly shared expenses',
          emoji: '🏠',
          members: homeMembers,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date(),
          currency: 'USD',
          category: 'home',
        };
        
        const expenses: Expense[] = [
          {
            id: uuidv4(),
            groupId,
            description: 'Flight tickets to Paris',
            amount: 1200,
            currency: 'USD',
            paidBy: members[0].id,
            splitBetween: members.map(m => ({ memberId: m.id, amount: 300, isPaid: false })),
            category: 'transport',
            date: new Date('2024-06-15'),
            createdAt: new Date('2024-06-15'),
          },
          {
            id: uuidv4(),
            groupId,
            description: 'Hotel in Paris (3 nights)',
            amount: 890,
            currency: 'USD',
            paidBy: members[1].id,
            splitBetween: members.map(m => ({ memberId: m.id, amount: 222.50, isPaid: false })),
            category: 'accommodation',
            date: new Date('2024-06-16'),
            createdAt: new Date('2024-06-16'),
          },
          {
            id: uuidv4(),
            groupId,
            description: 'Dinner at Le Petit Bistro',
            amount: 245,
            currency: 'USD',
            paidBy: members[2].id,
            splitBetween: members.map(m => ({ memberId: m.id, amount: 61.25, isPaid: false })),
            category: 'food',
            date: new Date('2024-06-17'),
            createdAt: new Date('2024-06-17'),
          },
          {
            id: uuidv4(),
            groupId,
            description: 'Louvre Museum tickets',
            amount: 68,
            currency: 'USD',
            paidBy: members[3].id,
            splitBetween: members.map(m => ({ memberId: m.id, amount: 17, isPaid: false })),
            category: 'entertainment',
            date: new Date('2024-06-18'),
            createdAt: new Date('2024-06-18'),
          },
          {
            id: uuidv4(),
            groupId,
            description: 'Train to Amsterdam',
            amount: 320,
            currency: 'USD',
            paidBy: members[0].id,
            splitBetween: members.map(m => ({ memberId: m.id, amount: 80, isPaid: false })),
            category: 'transport',
            date: new Date('2024-06-20'),
            createdAt: new Date('2024-06-20'),
          },
          {
            id: uuidv4(),
            groupId: homeGroupId,
            description: 'Electricity bill - January',
            amount: 156,
            currency: 'USD',
            paidBy: homeMembers[0].id,
            splitBetween: homeMembers.map(m => ({ memberId: m.id, amount: 52, isPaid: false })),
            category: 'utilities',
            date: new Date('2024-01-15'),
            createdAt: new Date('2024-01-15'),
          },
          {
            id: uuidv4(),
            groupId: homeGroupId,
            description: 'Weekly groceries',
            amount: 234,
            currency: 'USD',
            paidBy: homeMembers[1].id,
            splitBetween: homeMembers.map(m => ({ memberId: m.id, amount: 78, isPaid: false })),
            category: 'groceries',
            date: new Date('2024-01-20'),
            createdAt: new Date('2024-01-20'),
          },
        ];
        
        set({
          user,
          groups: [group, homeGroup],
          expenses,
          settlements: [],
          activeGroupId: groupId,
        });
      },
    }),
    {
      name: 'splitelite-storage',
    }
  )
);
