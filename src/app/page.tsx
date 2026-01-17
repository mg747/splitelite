'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import GroupView from '@/components/GroupView';
import AddExpenseModal from '@/components/AddExpenseModal';
import NewGroupModal from '@/components/NewGroupModal';
import UpgradeModal from '@/components/UpgradeModal';
import OnboardingModal from '@/components/OnboardingModal';
import MobileNav from '@/components/MobileNav';

export default function Home() {
  const { user, activeGroupId, setActiveGroup } = useStore();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);
  
  // Show onboarding if no user
  useEffect(() => {
    if (isHydrated && !user) {
      setShowOnboarding(true);
    }
  }, [isHydrated, user]);
  
  // Loading state during hydration
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-4">SplitElite</h1>
          <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }
  
  // Onboarding
  if (showOnboarding && !user) {
    return <OnboardingModal onComplete={() => setShowOnboarding(false)} />;
  }
  
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          onNewGroup={() => setShowNewGroup(true)}
          onUpgrade={() => setShowUpgrade(true)}
        />
      </div>
      
      {/* Mobile Header */}
      <MobileNav
        onMenuClick={() => setShowMobileMenu(true)}
        onNewGroup={() => setShowNewGroup(true)}
        onAddExpense={() => activeGroupId && setShowAddExpense(true)}
        showAddExpense={!!activeGroupId}
      />
      
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 animate-slide-up">
            <Sidebar
              onNewGroup={() => {
                setShowNewGroup(true);
                setShowMobileMenu(false);
              }}
              onUpgrade={() => {
                setShowUpgrade(true);
                setShowMobileMenu(false);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0">
        {activeGroupId ? (
          <GroupView
            groupId={activeGroupId}
            onAddExpense={() => setShowAddExpense(true)}
            onUpgrade={() => setShowUpgrade(true)}
          />
        ) : (
          <Dashboard onSelectGroup={(id) => setActiveGroup(id)} />
        )}
      </main>
      
      {/* Modals */}
      {showAddExpense && activeGroupId && (
        <AddExpenseModal
          groupId={activeGroupId}
          onClose={() => setShowAddExpense(false)}
        />
      )}
      
      {showNewGroup && (
        <NewGroupModal onClose={() => setShowNewGroup(false)} />
      )}
      
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  );
}
