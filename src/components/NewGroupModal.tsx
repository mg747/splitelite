'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { GroupCategory, Member } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { X, Users, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface NewGroupModalProps {
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

export default function NewGroupModal({ onClose }: NewGroupModalProps) {
  const { user, addGroup, setActiveGroup } = useStore();
  const { t } = useTranslation();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<GroupCategory>('trip');
  const [members, setMembers] = useState<{ id: string; name: string; email: string }[]>([
    { id: uuidv4(), name: user?.name || '', email: user?.email || '' },
  ]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  
  const selectedType = groupTypes.find(t => t.value === category);
  
  const handleAddMember = () => {
    if (newMemberName.trim()) {
      setMembers([
        ...members,
        { id: uuidv4(), name: newMemberName.trim(), email: newMemberEmail.trim() },
      ]);
      setNewMemberName('');
      setNewMemberEmail('');
    }
  };
  
  const handleRemoveMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(m => m.id !== id));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || members.length === 0) return;
    
    const groupId = addGroup({
      name: name.trim(),
      description: description.trim(),
      emoji: selectedType?.emoji || '📁',
      members: members.map(m => ({
        id: m.id,
        name: m.name,
        email: m.email || undefined,
      })),
      currency: 'USD',
      category,
    });
    
    setActiveGroup(groupId);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-dark-700 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <Users className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">{t('groups.createGroup')}</h2>
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
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              {t('groups.groupName')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('groups.groupNamePlaceholder')}
              className="input"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              {t('groups.description')} ({t('groups.optional')})
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this group for?"
              className="input"
            />
          </div>
          
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Group Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {groupTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setCategory(type.value)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    category === type.value
                      ? 'bg-primary-500/20 border-2 border-primary-500'
                      : 'bg-dark-800 border-2 border-transparent hover:border-dark-600'
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
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Members
            </label>
            
            {/* Existing Members */}
            <div className="space-y-2 mb-4">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800"
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
                  {index === 0 && (
                    <span className="text-xs text-primary-400 font-medium">You</span>
                  )}
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-1 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {/* Add Member */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Name"
                  className="input flex-1"
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
                  className="input flex-1"
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
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || members.length === 0}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
