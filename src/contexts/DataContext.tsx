'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from './AuthContext';

interface Group {
  id: string;
  name: string;
  description: string | null;
  emoji: string;
  currency: string;
  category: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface GroupMember {
  id: string;
  group_id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  is_registered: boolean;
  created_at: string;
}

interface Expense {
  id: string;
  group_id: string;
  description: string;
  amount: number;
  currency: string;
  paid_by: string;
  category: string;
  date: string;
  receipt_url: string | null;
  notes: string | null;
  is_recurring: boolean;
  recurring_frequency: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface ExpenseSplit {
  id: string;
  expense_id: string;
  member_id: string;
  amount: number;
  percentage: number | null;
  is_paid: boolean;
  created_at: string;
}

interface Settlement {
  id: string;
  group_id: string;
  from_member: string;
  to_member: string;
  amount: number;
  status: string;
  method: string | null;
  reminder_sent: boolean;
  reminder_sent_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface GroupWithMembers extends Group {
  members: GroupMember[];
}

interface ExpenseWithSplits extends Expense {
  splits: ExpenseSplit[];
}

interface GroupInsert {
  name: string;
  description?: string | null;
  emoji?: string;
  currency?: string;
  category?: string;
}

interface ExpenseInsert {
  group_id: string;
  description: string;
  amount: number;
  currency?: string;
  paid_by: string;
  category?: string;
  date?: string;
}

interface SettlementInsert {
  group_id: string;
  from_member: string;
  to_member: string;
  amount: number;
}

interface DataContextType {
  groups: GroupWithMembers[];
  expenses: ExpenseWithSplits[];
  settlements: Settlement[];
  loading: boolean;
  isConfigured: boolean;
  
  // Groups
  createGroup: (group: GroupInsert, members: { name: string; email?: string }[]) => Promise<string | null>;
  updateGroup: (id: string, updates: Partial<GroupInsert>) => Promise<boolean>;
  deleteGroup: (id: string) => Promise<boolean>;
  addMemberToGroup: (groupId: string, member: { name: string; email?: string }) => Promise<boolean>;
  removeMemberFromGroup: (groupId: string, memberId: string) => Promise<boolean>;
  
  // Expenses
  createExpense: (expense: ExpenseInsert, splits: { memberId: string; amount: number }[]) => Promise<string | null>;
  updateExpense: (id: string, updates: Partial<ExpenseInsert>, splits?: { memberId: string; amount: number }[]) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
  
  // Settlements
  createSettlement: (settlement: SettlementInsert) => Promise<string | null>;
  completeSettlement: (id: string) => Promise<boolean>;
  
  // Refresh
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [expenses, setExpenses] = useState<ExpenseWithSplits[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();
  const isConfigured = !!supabase;

  const fetchGroups = useCallback(async () => {
    if (!user || !supabase) return [];
    
    // Get groups where user is a member
    const { data: memberData } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', user.id);
    
    if (!memberData || memberData.length === 0) return [];
    
    const groupIds = memberData.map((m: { group_id: string }) => m.group_id);
    
    const { data: groupsData, error } = await supabase
      .from('groups')
      .select('*')
      .in('id', groupIds)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching groups:', error);
      return [];
    }
    
    // Fetch members for each group
    const groupsWithMembers: GroupWithMembers[] = await Promise.all(
      (groupsData || []).map(async (group: Group) => {
        const { data: members } = await supabase
          .from('group_members')
          .select('*')
          .eq('group_id', group.id);
        
        return {
          ...group,
          members: (members || []) as GroupMember[],
        };
      })
    );
    
    return groupsWithMembers;
  }, [user, supabase]);

  const fetchExpenses = useCallback(async (groupIds: string[]) => {
    if (groupIds.length === 0 || !supabase) return [];
    
    const { data: expensesData, error } = await supabase
      .from('expenses')
      .select('*')
      .in('group_id', groupIds)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
    
    // Fetch splits for each expense
    const expensesWithSplits: ExpenseWithSplits[] = await Promise.all(
      (expensesData || []).map(async (expense: Expense) => {
        const { data: splits } = await supabase
          .from('expense_splits')
          .select('*')
          .eq('expense_id', expense.id);
        
        return {
          ...expense,
          splits: (splits || []) as ExpenseSplit[],
        };
      })
    );
    
    return expensesWithSplits;
  }, [supabase]);

  const fetchSettlements = useCallback(async (groupIds: string[]) => {
    if (groupIds.length === 0 || !supabase) return [];
    
    const { data, error } = await supabase
      .from('settlements')
      .select('*')
      .in('group_id', groupIds)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching settlements:', error);
      return [];
    }
    
    return (data || []) as Settlement[];
  }, [supabase]);

  const refreshData = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setExpenses([]);
      setSettlements([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    const groupsData = await fetchGroups();
    setGroups(groupsData);
    
    const groupIds = groupsData.map(g => g.id);
    
    const [expensesData, settlementsData] = await Promise.all([
      fetchExpenses(groupIds),
      fetchSettlements(groupIds),
    ]);
    
    setExpenses(expensesData);
    setSettlements(settlementsData);
    setLoading(false);
  }, [user, fetchGroups, fetchExpenses, fetchSettlements]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user || !supabase) return;

    const groupsChannel = supabase
      .channel('groups-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, () => {
        refreshData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, () => {
        refreshData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses' }, () => {
        refreshData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expense_splits' }, () => {
        refreshData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settlements' }, () => {
        refreshData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(groupsChannel);
    };
  }, [user, supabase, refreshData]);

  // Group operations
  const createGroup = async (
    group: GroupInsert,
    members: { name: string; email?: string }[]
  ): Promise<string | null> => {
    if (!user || !supabase) return null;
    
    const { data: groupData, error: groupError } = await supabase
      .from('groups')
      .insert({ ...group, created_by: user.id })
      .select()
      .single();
    
    if (groupError || !groupData) {
      console.error('Error creating group:', groupError);
      return null;
    }
    
    // Add members
    const memberInserts = members.map((m, index) => ({
      group_id: (groupData as Group).id,
      name: m.name,
      email: m.email || null,
      user_id: index === 0 ? user.id : null, // First member is the creator
      is_registered: index === 0,
    }));
    
    const { error: membersError } = await supabase
      .from('group_members')
      .insert(memberInserts);
    
    if (membersError) {
      console.error('Error adding members:', membersError);
    }
    
    await refreshData();
    return (groupData as Group).id;
  };

  const updateGroup = async (
    id: string,
    updates: Partial<GroupInsert>
  ): Promise<boolean> => {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('groups')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating group:', error);
      return false;
    }
    
    await refreshData();
    return true;
  };

  const deleteGroup = async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('groups')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting group:', error);
      return false;
    }
    
    await refreshData();
    return true;
  };

  const addMemberToGroup = async (
    groupId: string,
    member: { name: string; email?: string }
  ): Promise<boolean> => {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        name: member.name,
        email: member.email || null,
        is_registered: false,
      });
    
    if (error) {
      console.error('Error adding member:', error);
      return false;
    }
    
    await refreshData();
    return true;
  };

  const removeMemberFromGroup = async (
    groupId: string,
    memberId: string
  ): Promise<boolean> => {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('group_members')
      .delete()
      .eq('id', memberId)
      .eq('group_id', groupId);
    
    if (error) {
      console.error('Error removing member:', error);
      return false;
    }
    
    await refreshData();
    return true;
  };

  // Expense operations
  const createExpense = async (
    expense: ExpenseInsert,
    splits: { memberId: string; amount: number }[]
  ): Promise<string | null> => {
    if (!user || !supabase) return null;
    
    const { data: expenseData, error: expenseError } = await supabase
      .from('expenses')
      .insert({ ...expense, created_by: user.id })
      .select()
      .single();
    
    if (expenseError || !expenseData) {
      console.error('Error creating expense:', expenseError);
      return null;
    }
    
    // Add splits
    const splitInserts = splits.map(s => ({
      expense_id: (expenseData as Expense).id,
      member_id: s.memberId,
      amount: s.amount,
      is_paid: false,
    }));
    
    const { error: splitsError } = await supabase
      .from('expense_splits')
      .insert(splitInserts);
    
    if (splitsError) {
      console.error('Error adding splits:', splitsError);
    }
    
    await refreshData();
    return (expenseData as Expense).id;
  };

  const updateExpense = async (
    id: string,
    updates: Partial<ExpenseInsert>,
    splits?: { memberId: string; amount: number }[]
  ): Promise<boolean> => {
    if (!supabase) return false;
    
    const { error: expenseError } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', id);
    
    if (expenseError) {
      console.error('Error updating expense:', expenseError);
      return false;
    }
    
    if (splits) {
      // Delete existing splits and insert new ones
      await supabase.from('expense_splits').delete().eq('expense_id', id);
      
      const splitInserts = splits.map(s => ({
        expense_id: id,
        member_id: s.memberId,
        amount: s.amount,
        is_paid: false,
      }));
      
      await supabase.from('expense_splits').insert(splitInserts);
    }
    
    await refreshData();
    return true;
  };

  const deleteExpense = async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting expense:', error);
      return false;
    }
    
    await refreshData();
    return true;
  };

  // Settlement operations
  const createSettlement = async (
    settlement: SettlementInsert
  ): Promise<string | null> => {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('settlements')
      .insert(settlement)
      .select()
      .single();
    
    if (error || !data) {
      console.error('Error creating settlement:', error);
      return null;
    }
    
    await refreshData();
    return (data as Settlement).id;
  };

  const completeSettlement = async (id: string): Promise<boolean> => {
    if (!supabase) return false;
    
    const { error } = await supabase
      .from('settlements')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) {
      console.error('Error completing settlement:', error);
      return false;
    }
    
    await refreshData();
    return true;
  };

  return (
    <DataContext.Provider
      value={{
        groups,
        expenses,
        settlements,
        loading,
        isConfigured,
        createGroup,
        updateGroup,
        deleteGroup,
        addMemberToGroup,
        removeMemberFromGroup,
        createExpense,
        updateExpense,
        deleteExpense,
        createSettlement,
        completeSettlement,
        refreshData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
