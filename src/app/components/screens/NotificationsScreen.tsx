import React, { useState } from 'react';
import { Bell, CheckCheck, Filter, AlertCircle, CheckCircle2, Info, AtSign, GitBranch, Clock, ChevronRight, Check, X } from 'lucide-react';
import { Screen } from '../types';
import { sampleNotifications } from '../sampleData';

interface NotificationsScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
  onMarkRead: () => void;
}

const typeIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  approval:   { icon: AlertCircle, color: '#F97316', bg: '#FFF7ED' },
  completion: { icon: CheckCircle2, color: '#10B981', bg: '#ECFDF5' },
  error:      { icon: AlertCircle, color: '#EF4444', bg: '#FEF2F2' },
  reminder:   { icon: Clock, color: '#8B5CF6', bg: '#F5F3FF' },
  mention:    { icon: AtSign, color: '#5C5FEF', bg: '#EEEEFF' },
  assignment: { icon: GitBranch, color: '#0EA5E9', bg: '#E0F2FE' },
};

function timeAgo(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationsScreen({ onNavigate, onMarkRead }: NotificationsScreenProps) {
  const [filter, setFilter] = useState('All');
  const [notifications, setNotifications] = useState(sampleNotifications);
  useNotificationsSync(setNotifications);

  const filters = ['All', 'Unread', 'Approvals', 'Completions', 'Mentions'];
  const filtered = notifications.filter(n => {
    if (filter === 'Unread') return !n.read;
    if (filter === 'Approvals') return n.type === 'approval';
    if (filter === 'Completions') return n.type === 'completion';
    if (filter === 'Mentions') return n.type === 'mention';
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onMarkRead();
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const grouped = {
    today: filtered.filter(n => {
      const d = new Date(n.timestamp);
      const now = new Date();
      return d.toDateString() === now.toDateString();
    }),
    earlier: filtered.filter(n => {
      const d = new Date(n.timestamp);
      const now = new Date();
      return d.toDateString() !== now.toDateString();
    }),
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border flex items-center gap-3">
        <div className="flex items-center gap-2 mr-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">{unreadCount} unread</span>
          )}
        </div>
        <div className="flex gap-1">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded hover:bg-muted/50">
            <CheckCheck className="w-3.5 h-3.5" /> Mark all read
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-3xl mx-auto w-full">
        {grouped.today.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Today</h3>
            <div className="space-y-2">
              {grouped.today.map(notif => <NotifCard key={notif.id} notif={notif} onRead={() => markRead(notif.id)} onNavigate={onNavigate} />)}
            </div>
          </div>
        )}
        {grouped.earlier.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Earlier</h3>
            <div className="space-y-2">
              {grouped.earlier.map(notif => <NotifCard key={notif.id} notif={notif} onRead={() => markRead(notif.id)} onNavigate={onNavigate} />)}
            </div>
          </div>
        )}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground/70 mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Listen for external updates to the shared `sampleNotifications` array
// so other components (like ThreadsScreen) can push notifications.
// This avoids creating a full global store for the demo.
export function useNotificationsSync(setNotifications: (n: any) => void) {
  React.useEffect(() => {
    const handler = () => setNotifications([...sampleNotifications]);
    window.addEventListener('notifications-updated', handler as EventListener);
    return () => window.removeEventListener('notifications-updated', handler as EventListener);
  }, [setNotifications]);
}

function NotifCard({ notif, onRead, onNavigate }: { notif: any; onRead: () => void; onNavigate: any }) {
  const cfg = typeIcons[notif.type] || typeIcons.reminder;
  const Icon = cfg.icon;
  const [approved, setApproved] = useState<boolean | null>(null);

  return (
    <div
      className={`bg-white border rounded-xl p-4 transition-all hover:shadow-sm ${notif.read ? 'border-border opacity-80' : 'border-primary/20 shadow-sm'}`}
      onClick={() => !notif.read && onRead()}
    >
      <div className="flex gap-3">
        {!notif.read && <div className="absolute w-1.5 h-1.5 rounded-full bg-primary mt-1.5" style={{ position: 'relative', flexShrink: 0, marginTop: 6, marginLeft: -8 }}></div>}
        <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: cfg.bg }}>
          <Icon className="w-4 h-4" style={{ color: cfg.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <span className="text-sm font-semibold text-foreground">{notif.title}</span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(notif.timestamp)}</span>
              {!notif.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">{notif.message}</p>

          {notif.type === 'approval' && approved === null && (
            <div className="flex items-center gap-2">
              <button onClick={e => { e.stopPropagation(); setApproved(true); onRead(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
                <Check className="w-3 h-3" /> Approve
              </button>
              <button onClick={e => { e.stopPropagation(); setApproved(false); onRead(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-medium hover:bg-muted/50 transition-colors">
                <X className="w-3 h-3" /> Reject
              </button>
              {notif.workflowId && (
                <button onClick={() => onNavigate('workflow-detail', notif.workflowId)}
                  className="text-xs text-primary hover:underline flex items-center gap-1 ml-1">
                  View workflow <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
          {notif.type === 'approval' && approved !== null && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${approved ? 'bg-green-50 text-green-700' : 'bg-muted text-muted-foreground'}`}>
              {approved ? <><Check className="w-3 h-3" /> Approved</> : <><X className="w-3 h-3" /> Rejected</>}
            </div>
          )}

          {notif.workflowId && notif.type !== 'approval' && (
            <button onClick={() => onNavigate('workflow-detail', notif.workflowId)}
              className="text-xs text-primary hover:underline flex items-center gap-1">
              View workflow <ChevronRight className="w-3 h-3" />
            </button>
          )}
          {notif.threadLink && (
            <button onClick={() => onNavigate('threads', notif.threadLink)}
              className="text-xs text-primary hover:underline flex items-center gap-1 ml-2">
              Open subthread <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
