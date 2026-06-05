import React from 'react';
import { AgentType } from '../types';

const agentColors: Record<AgentType, { bg: string; ring: string; glow: string }> = {
  super:      { bg: 'from-indigo-500 to-purple-600', ring: 'ring-indigo-200', glow: 'shadow-indigo-200' },
  sales:      { bg: 'from-sky-400 to-blue-600',      ring: 'ring-blue-200',   glow: 'shadow-blue-200' },
  hr:         { bg: 'from-emerald-400 to-green-600', ring: 'ring-green-200',  glow: 'shadow-green-200' },
  finance:    { bg: 'from-amber-400 to-orange-500',  ring: 'ring-amber-200',  glow: 'shadow-amber-200' },
  operations: { bg: 'from-violet-500 to-purple-700', ring: 'ring-purple-200', glow: 'shadow-purple-200' },
  support:    { bg: 'from-pink-400 to-rose-600',     ring: 'ring-pink-200',   glow: 'shadow-pink-200' },
  research:   { bg: 'from-cyan-400 to-teal-600',     ring: 'ring-cyan-200',   glow: 'shadow-cyan-200' },
};

const agentEmojis: Record<AgentType, string> = {
  super: '⚡', sales: '📈', hr: '👥', finance: '💳', operations: '⚙️', support: '🎯', research: '🔬',
};

interface AgentAvatarProps {
  type: AgentType;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  status?: 'active' | 'idle' | 'paused' | 'error';
}

const sizes = {
  xs: { outer: 'w-6 h-6', emoji: 'text-xs', status: 'w-1.5 h-1.5 -bottom-0 -right-0' },
  sm: { outer: 'w-8 h-8', emoji: 'text-sm', status: 'w-2 h-2 -bottom-0.5 -right-0.5' },
  md: { outer: 'w-10 h-10', emoji: 'text-base', status: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5' },
  lg: { outer: 'w-12 h-12', emoji: 'text-xl', status: 'w-3 h-3 bottom-0 right-0' },
  xl: { outer: 'w-16 h-16', emoji: 'text-2xl', status: 'w-3.5 h-3.5 bottom-0.5 right-0.5' },
};

const statusColors: Record<string, string> = {
  active: 'bg-green-500', idle: 'bg-gray-400', paused: 'bg-amber-400', error: 'bg-red-500',
};

export function AgentAvatar({ type, name, size = 'md', showStatus, status = 'active' }: AgentAvatarProps) {
  const colors = agentColors[type];
  const s = sizes[size];
  return (
    <div className="relative inline-flex flex-shrink-0">
      <div className={`${s.outer} rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-sm`} title={name}>
        <span className={s.emoji}>{agentEmojis[type]}</span>
      </div>
      {showStatus && (
        <span className={`absolute ${s.status} ${statusColors[status]} rounded-full ring-2 ring-white`} />
      )}
    </div>
  );
}

interface UserAvatarProps {
  initials: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

const avatarColors = [
  'bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-rose-500',
  'bg-amber-500', 'bg-cyan-500', 'bg-pink-500', 'bg-indigo-500',
];

export function UserAvatar({ initials, name, size = 'md', color }: UserAvatarProps) {
  const colorIndex = name.charCodeAt(0) % avatarColors.length;
  const bg = color || avatarColors[colorIndex];
  const szMap = { xs: 'w-6 h-6 text-xs', sm: 'w-7 h-7 text-xs', md: 'w-8 h-8 text-xs', lg: 'w-10 h-10 text-sm' };
  return (
    <div className={`${szMap[size]} ${bg} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`} title={name}>
      {initials}
    </div>
  );
}
