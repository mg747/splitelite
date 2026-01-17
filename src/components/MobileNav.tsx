'use client';

import { useStore } from '@/store';
import { Menu, Plus, ArrowLeft } from 'lucide-react';

interface MobileNavProps {
  onMenuClick: () => void;
  onNewGroup: () => void;
  onAddExpense: () => void;
  showAddExpense: boolean;
}

export default function MobileNav({ 
  onMenuClick, 
  onNewGroup, 
  onAddExpense,
  showAddExpense 
}: MobileNavProps) {
  const { activeGroupId, groups, setActiveGroup } = useStore();
  
  const activeGroup = groups.find(g => g.id === activeGroupId);
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-dark-900/95 backdrop-blur-lg border-b border-dark-700 flex items-center justify-between px-4 z-40 md:hidden">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {activeGroupId ? (
          <button
            onClick={() => setActiveGroup(null)}
            className="p-2 -ml-2 rounded-lg hover:bg-dark-700 text-dark-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 rounded-lg hover:bg-dark-700 text-dark-300"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        {activeGroup ? (
          <div className="flex items-center gap-2">
            <span className="text-xl">{activeGroup.emoji}</span>
            <span className="font-semibold text-white truncate max-w-[150px]">
              {activeGroup.name}
            </span>
          </div>
        ) : (
          <h1 className="text-xl font-bold gradient-text">SplitElite</h1>
        )}
      </div>
      
      {/* Right side */}
      <div className="flex items-center gap-2">
        {showAddExpense ? (
          <button
            onClick={onAddExpense}
            className="p-2 rounded-xl bg-primary-500 text-white"
          >
            <Plus className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onNewGroup}
            className="p-2 rounded-xl bg-dark-700 text-dark-300 hover:text-white"
          >
            <Plus className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
