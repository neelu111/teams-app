import React from 'react';
import { WorkflowStatus, TaskStatus } from '../types';

const configs: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  draft:        { label: 'Draft',        bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400' },
  running:      { label: 'Running',      bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-500' },
  waiting:      { label: 'Waiting',      bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400' },
  'needs-action':{ label: 'Needs Action', bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
  scheduled:    { label: 'Scheduled',    bg: 'bg-purple-50',  text: 'text-purple-700', dot: 'bg-purple-500' },
  blocked:      { label: 'Blocked',      bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  completed:    { label: 'Completed',    bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  cancelled:    { label: 'Cancelled',    bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400' },
  failed:       { label: 'Failed',       bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  active:       { label: 'Active',       bg: 'bg-green-50',   text: 'text-green-700',  dot: 'bg-green-500' },
  idle:         { label: 'Idle',         bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400' },
  paused:       { label: 'Paused',       bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400' },
  error:        { label: 'Error',        bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-500' },
  pending:      { label: 'Pending',      bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400' },
  inactive:     { label: 'Inactive',     bg: 'bg-gray-100',   text: 'text-gray-500',   dot: 'bg-gray-400' },
};

const priorityConfigs: Record<string, { label: string; bg: string; text: string }> = {
  low:      { label: 'Low',      bg: 'bg-gray-100',  text: 'text-gray-600' },
  medium:   { label: 'Medium',   bg: 'bg-blue-50',   text: 'text-blue-700' },
  high:     { label: 'High',     bg: 'bg-orange-50', text: 'text-orange-700' },
  critical: { label: 'Critical', bg: 'bg-red-50',    text: 'text-red-700' },
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
}

export function StatusBadge({ status, size = 'sm', showDot = true }: StatusBadgeProps) {
  const cfg = configs[status] || configs['draft'];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${cfg.bg} ${cfg.text} ${padding}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${status === 'running' ? 'animate-pulse' : ''}`} />}
      {cfg.label}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: string;
  size?: 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const cfg = priorityConfigs[priority] || priorityConfigs['medium'];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded font-medium ${cfg.bg} ${cfg.text} ${padding}`}>
      {cfg.label}
    </span>
  );
}
