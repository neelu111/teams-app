import React, { useState } from 'react';
import { Bell, CheckCheck, AlertTriangle, CheckCircle2, Clock, GitBranch, Users, ArrowUpRight } from 'lucide-react';
import { MScreen, MNotification, MNotifType, managerNotifications } from '../managerData';

const typeConfig: Record<MNotifType, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  'approval-required': { icon: CheckCircle2, color: '#F97316', bg: 'bg-orange-50', label: 'Approval Required' },
  'escalation':        { icon: AlertTriangle, color: '#EF4444', bg: 'bg-red-50',    label: 'Escalation' },
  'workflow-blocked':  { icon: GitBranch,    color: '#8B5CF6', bg: 'bg-purple-50', label: 'Workflow Blocked' },
  'task-overdue':      { icon: Clock,        color: '#EF4444', bg: 'bg-red-50',    label: 'Task Overdue' },
  'completion':        { icon: CheckCheck,   color: '#10B981', bg: 'bg-green-50',  label: 'Completed' },
  'team-update':       { icon: Users,        color: '#5C5FEF', bg: 'bg-indigo-50', label: 'Team Update' },
};

interface MNotificationsProps {
  onNavigate: (screen: MScreen, id?: string) => void;
}

export function MNotificationsScreen({ onNavigate }: MNotificationsProps) {
  const [notifs, setNotifs] = useState<MNotification[]>(managerNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | MNotifType>('all');

  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: `Unread (${notifs.filter(n => !n.read).length})` },
    { key: 'escalation', label: 'Escalations' },
    { key: 'approval-required', label: 'Approvals' },
    { key: 'workflow-blocked', label: 'Workflows' },
  ];

  const filtered = notifs.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const today = filtered.filter(n => n.timeLabel.includes('hr') || n.timeLabel === 'Just now' || n.timeLabel.includes('min') || n.timeLabel === 'Today');
  const yesterday = filtered.filter(n => n.timeLabel === 'Yesterday');
  const older = filtered.filter(n => !today.includes(n) && !yesterday.includes(n));

  const groups = [
    { label: 'Today', items: today },
    { label: 'Yesterday', items: yesterday },
    { label: 'Earlier', items: older },
  ].filter(g => g.items.length > 0);

  function NotifCard({ n }: { n: MNotification }) {
    const tc = typeConfig[n.type];
    const Icon = tc.icon;
    return (
      <div onClick={() => markRead(n.id)}
        className={`relative flex items-start gap-4 p-5 border-b border-border hover:bg-muted/10 transition-colors cursor-pointer ${!n.read ? 'bg-primary/[0.02]' : ''}`}>
        {!n.read && <span className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />}
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${tc.bg}`}>
          <Icon className="w-4 h-4" style={{ color: tc.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="text-xs font-semibold mr-2" style={{ color: tc.color }}>{tc.label}</span>
              {n.employeeName && <span className="text-xs text-muted-foreground">{n.employeeName}</span>}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">{n.timeLabel}</span>
          </div>
          <p className="text-sm font-medium text-foreground mb-0.5">{n.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed">{n.message}</p>
          {(n.type === 'escalation' || n.type === 'approval-required') && n.relatedId && (
            <button onClick={e => { e.stopPropagation(); onNavigate('approvals', n.relatedId); }}
              className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              Take action <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
          {n.type === 'workflow-blocked' && n.relatedId && (
            <button onClick={e => { e.stopPropagation(); onNavigate('team-workflows', n.relatedId); }}
              className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline font-medium">
              View workflow <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-foreground" />
          <h1 className="text-sm font-semibold text-foreground">Notifications</h1>
          {notifs.filter(n => !n.read).length > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center">
              {notifs.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
          <CheckCheck className="w-3.5 h-3.5" /> Mark all read
        </button>
      </div>

      <div className="flex gap-1 px-4 py-2.5 bg-white border-b border-border overflow-x-auto flex-shrink-0">
        {filterTabs.map(t => (
          <button key={t.key} onClick={() => setFilter(t.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filter === t.key ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mb-4">
              <Bell className="w-7 h-7 text-green-500" />
            </div>
            <p className="text-sm font-semibold text-foreground mb-1">All caught up!</p>
            <p className="text-xs text-muted-foreground">No notifications to show here.</p>
          </div>
        ) : groups.map(group => (
          <div key={group.label}>
            <div className="px-5 py-2 bg-muted/30 border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{group.label}</span>
            </div>
            {group.items.map(n => <NotifCard key={n.id} n={n} />)}
          </div>
        ))}
      </div>
    </div>
  );
}
