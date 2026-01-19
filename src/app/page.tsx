'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import GroupView from '@/components/GroupView';
import AddExpenseModal from '@/components/AddExpenseModal';
import NewGroupModal from '@/components/NewGroupModal';
import EditGroupModal from '@/components/EditGroupModal';
import UpgradeModal from '@/components/UpgradeModal';
import OnboardingModal from '@/components/OnboardingModal';
import MobileNav from '@/components/MobileNav';
import ConfirmDialog from '@/components/ConfirmDialog';
import SettingsModal from '@/components/SettingsModal';
import Footer from '@/components/Footer';

export default function Home() {
  const { user, activeGroupId, setActiveGroup, deleteGroup } = useStore();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [showDeleteGroup, setShowDeleteGroup] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
          onSettings={() => setShowSettings(true)}
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
              onSettings={() => {
                setShowSettings(true);
                setShowMobileMenu(false);
              }}
            />
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-16 md:pt-0">
        <div className="flex-1">
          {activeGroupId ? (
            <GroupView
              groupId={activeGroupId}
              onAddExpense={() => setShowAddExpense(true)}
              onUpgrade={() => setShowUpgrade(true)}
              onEditGroup={() => setShowEditGroup(true)}
              onDeleteGroup={() => setShowDeleteGroup(true)}
            />
          ) : (
            <Dashboard onSelectGroup={(id) => setActiveGroup(id)} />
          )}
        </div>
        <Footer />
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
      
      {showEditGroup && activeGroupId && (
        <EditGroupModal
          groupId={activeGroupId}
          onClose={() => setShowEditGroup(false)}
        />
      )}
      
      {showDeleteGroup && activeGroupId && (
        <ConfirmDialog
          title="Delete Group"
          message="Are you sure you want to delete this group? All expenses and settlements in this group will be permanently deleted."
          confirmLabel="Delete Group"
          variant="danger"
          onConfirm={() => {
            deleteGroup(activeGroupId);
            setShowDeleteGroup(false);
          }}
          onCancel={() => setShowDeleteGroup(false)}
        />
      )}
      
      {showUpgrade && (
        <UpgradeModal onClose={() => setShowUpgrade(false)} />
      )}
      
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)}
          onUpgrade={() => {
            setShowSettings(false);
            setShowUpgrade(true);
          }}
        />
      )}
    </div>
  );
}
