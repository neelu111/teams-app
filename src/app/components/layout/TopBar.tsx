import React, { useState } from 'react';
import { Search, Bell, Plus, ChevronRight } from 'lucide-react';
import { Screen } from '../types';

interface Breadcrumb {
  label: string;
  screen?: Screen;
}

interface TopBarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
  onNavigate: (screen: Screen) => void;
  unreadCount: number;
  actions?: React.ReactNode;
}

const screenTitles: Partial<Record<Screen, string>> = {
  dashboard: 'Dashboard',
  'ai-assistant': 'AI Assistant',
  workflows: 'Workflows',
  'workflow-detail': 'Workflow Detail',
  tasks: 'Task Center',
  'task-detail': 'Task Detail',
  agents: 'Agent Directory',
  'agent-profile': 'Agent Profile',
  threads: 'Threads',
  'thread-detail': 'Thread',
  notifications: 'Notifications',
  reports: 'Reports',
  audit: 'Audit Center',
  users: 'User Management',
  roles: 'Role Management',
  'super-agent-config': 'Super Agent Configuration',
  'agent-config': 'Specialist Agents',
  connectors: 'Connector Management',
  capabilities: 'Capability Management',
  'access-rules': 'Access Rules',
  settings: 'Settings',
};

export function TopBar({ title, breadcrumbs, onNavigate, unreadCount, actions }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-border flex items-center px-6 gap-4">
      {/* Breadcrumbs / Title */}
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <>
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
                {b.screen ? (
                  <button
                    onClick={() => onNavigate(b.screen!)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                  >
                    {b.label}
                  </button>
                ) : (
                  <span className="text-sm font-medium text-foreground truncate">{b.label}</span>
                )}
              </React.Fragment>
            ))}
          </>
        ) : (
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        )}
      </div>

      {/* Search */}
      <div className={`relative flex items-center transition-all duration-200 ${searchFocused ? 'w-72' : 'w-56'}`}>
        <Search className="absolute left-3 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Search workflows, tasks, agents..."
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          className="w-full pl-8 pr-3 py-2 text-xs bg-muted rounded-lg border border-transparent focus:border-primary/30 focus:bg-white focus:outline-none transition-all placeholder:text-muted-foreground"
        />
        {searchFocused && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-border shadow-lg py-2 z-50">
            <div className="px-3 py-1 text-xs text-muted-foreground font-medium uppercase tracking-wide">Recent</div>
            {['Lead email campaign workflow', 'Invoice approval task', 'Sales — Sales Agent'].map((item, i) => (
              <button key={i} className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted/60 transition-colors flex items-center gap-2">
                <Search className="w-3 h-3 text-muted-foreground" />
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {actions}

      {/* New Workflow Button */}
      <button
        onClick={() => onNavigate('ai-assistant')}
        className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
      >
        <Plus className="w-3.5 h-3.5" />
        New Request
      </button>

      {/* Notifications */}
      <button
        onClick={() => onNavigate('notifications')}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors"
      >
        <Bell className="w-4 h-4 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>
    </header>
  );
}
