'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { GroupCategory } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { X, Users, Plus, Trash2, Edit3 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface EditGroupModalProps {
  groupId: string;
  onClose: () => void;
}

const groupTypes: { value: GroupCategory; label: string; emoji: string }[] = [
  { value: 'trip', label: 'Trip', emoji: '✈️' },
  { value: 'home', label: 'Home', emoji: '🏠' },
  { value: 'couple', label: 'Couple', emoji: '💑' },
  { value: 'event', label: 'Event', emoji: '🎉' },
  { value: 'work', label: 'Work', emoji: '💼' },
  { value: 'other', label: 'Other', emoji: '📁' },
];

export default function EditGroupModal({ groupId, onClose }: EditGroupModalProps) {
  const { user, groups, updateGroup, addMemberToGroup, removeMemberFromGroup } = useStore();
  const { t } = useTranslation();
  const group = groups.find(g => g.id === groupId);
  
  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');
  const [category, setCategory] = useState<GroupCategory>(group?.category || 'other');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  if (!group) return null;
  
  const selectedType = groupTypes.find(t => t.value === category);
  
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      addMemberToGroup(groupId, {
        name: newMemberName.trim(),
        email: newMemberEmail.trim() || undefined,
      });
      setNewMemberName('');
      setNewMemberEmail('');
    }
  };
  
  const handleRemoveMember = (memberId: string) => {
    if (group.members.length > 1) {
      removeMemberFromGroup(groupId, memberId);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;
    
    updateGroup(groupId, {
      name: name.trim(),
      description: description.trim() || undefined,
      emoji: selectedType?.emoji || group.emoji,
      category,
    });
    
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="modal-3d bg-dark-900/95 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-primary-500/30 shadow-2xl neon-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-primary-500/30 to-emerald-500/30 neon-glow">
              <Edit3 className="w-6 h-6 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Edit Group</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-dark-700 text-dark-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Summer Trip 2024"
              className="input-neon"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group for?"
              className="input-neon"
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">
              Group Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {groupTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setCategory(type.value)}
                  className={`category-btn p-3 rounded-xl text-center transition-all transform hover:scale-105 ${
                    category === type.value
                      ? 'bg-gradient-to-br from-primary-500/30 to-emerald-500/30 border-2 border-primary-500 neon-glow'
                      : 'bg-dark-800/50 border-2 border-transparent hover:border-dark-600'
                  }`}
                >
                  <span className="text-2xl block mb-1">{type.emoji}</span>
                  <span className="text-xs text-dark-300">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Members */}
          <div>
            <label className="block text-sm font-semibold text-dark-300 uppercase tracking-wider mb-2">
              Members ({group.members.length})
            </label>
            
            {/* Existing Members */}
            <div className="space-y-2 mb-4">
              {group.members.map((member) => {
                const isCurrentUser = member.email === user?.email;
                return (
                  <div
                    key={member.id}
                    className="member-card flex items-center gap-3 p-3 rounded-xl bg-dark-800/50"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-emerald-400 flex items-center justify-center text-white font-semibold text-sm">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{member.name}</p>
                      {member.email && (
                        <p className="text-xs text-dark-400 truncate">{member.email}</p>
                      )}
                    </div>
                    {isCurrentUser && (
                      <span className="text-xs text-primary-400 font-medium">You</span>
                    )}
                    {!isCurrentUser && group.members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Add Member */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Name"
                  className="input-neon flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Email (optional)"
                  className="input-neon flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                  className="p-3 rounded-xl bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-dark-500">
                Press Enter or click + to add a member
              </p>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary-3d flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="btn-primary-3d flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
