import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard, Zap, Bot, Users, Shield, Lock, Wifi,
  CheckSquare, GitBranch, FileText, BarChart2, Settings,
  PanelLeftClose, PanelLeftOpen, Bell, LogOut,
} from 'lucide-react';
import { BAScreen } from './businessAdminData';
import { BADashboardScreen } from './screens/BADashboardScreen';
import { BASuperAgentScreen } from './screens/BASuperAgentScreen';
import { BASpecialistAgentsScreen } from './screens/BASpecialistAgentsScreen';
import { BAUsersScreen } from './screens/BAUsersScreen';
import { BARolesScreen } from './screens/BARolesScreen';
import { BAPermissionsScreen } from './screens/BAPermissionsScreen';
import { BAConnectorsScreen } from './screens/BAConnectorsScreen';
import { BACapabilitiesScreen } from './screens/BACapabilitiesScreen';
import { BAAuditScreen } from './screens/BAAuditScreen';
import { BAReportsScreen } from './screens/BAReportsScreen';
import { BASettingsScreen } from './screens/BASettingsScreen';

interface BusinessAdminAppProps {
  activeUser: { id: string; name: string; avatar: string; role: string; email?: string; department?: string };
  onLogout: () => void;
}

interface NavItem {
  screen: BAScreen;
  label: string;
  icon: React.ElementType;
  group?: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { screen: 'dashboard',          label: 'Dashboard',          icon: LayoutDashboard, group: 'Overview' },
  { screen: 'super-agent',        label: 'Super Agent',        icon: Zap,             group: 'Agents' },
  { screen: 'specialist-agents',  label: 'Specialist Agents',  icon: Bot,             group: 'Agents' },
  { screen: 'users',              label: 'Users',              icon: Users,           group: 'Access' },
  { screen: 'roles',              label: 'Roles',              icon: Shield,          group: 'Access' },
  { screen: 'permissions',        label: 'Permissions',        icon: Lock,            group: 'Access' },
  { screen: 'connectors',         label: 'Connectors',         icon: Wifi,            group: 'Platform' },
  { screen: 'capabilities',       label: 'Capabilities',       icon: CheckSquare,     group: 'Platform' },
  { screen: 'audit',              label: 'Audit Center',       icon: FileText,        group: 'Observability' },
  { screen: 'reports',            label: 'Reports',            icon: BarChart2,       group: 'Observability' },
  { screen: 'settings',           label: 'Settings',           icon: Settings,        group: 'System' },
];

const screenTitles: Record<BAScreen, string> = {
  dashboard:         'Business Admin Dashboard',
  'super-agent':     'Super Agent Configuration',
  'specialist-agents': 'Specialist Agents',
  users:             'User Management',
  roles:             'Roles',
  permissions:       'Permissions & Access Rules',
  connectors:        'Connector Center',
  capabilities:      'Capability Management',
  audit:             'Audit Center',
  reports:           'Reports & Analytics',
  settings:          'Platform Settings',
};

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin',
  'business-admin': 'Business Admin',
  'manager': 'Business Manager',
  'employee': 'Employee',
};

export function BusinessAdminApp({ activeUser, onLogout }: BusinessAdminAppProps) {
  const [screen, setScreen] = useState<BAScreen>('dashboard');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  const expanded = pinned || hovered;

  const navigate = useCallback((nextScreen: BAScreen, id?: string) => {
    setScreen(nextScreen);
    setSelectedId(id);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':         return <BADashboardScreen onNavigate={navigate} activeUser={activeUser} />;
      case 'super-agent':       return <BASuperAgentScreen onNavigate={navigate} />;
      case 'specialist-agents': return <BASpecialistAgentsScreen onNavigate={navigate} />;
      case 'users':             return <BAUsersScreen onNavigate={navigate} />;
      case 'roles':             return <BARolesScreen onNavigate={navigate} />;
      case 'permissions':       return <BAPermissionsScreen onNavigate={navigate} />;
      case 'connectors':        return <BAConnectorsScreen onNavigate={navigate} />;
      case 'capabilities':      return <BACapabilitiesScreen onNavigate={navigate} />;
      case 'audit':             return <BAAuditScreen onNavigate={navigate} />;
      case 'reports':           return <BAReportsScreen onNavigate={navigate} />;
      case 'settings':          return <BASettingsScreen onNavigate={navigate} />;
      default:                  return <BADashboardScreen onNavigate={navigate} activeUser={activeUser} />;
    }
  };

  // Group nav items for display
  const groups = ['Overview', 'Agents', 'Access', 'Platform', 'Observability', 'System'];

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: '#0F1117', width: expanded ? 224 : 52, transition: 'width 0.2s ease' }}
        className="h-full flex-shrink-0 flex flex-col overflow-hidden z-20"
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-3 flex-shrink-0 border-b border-white/10">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 font-bold text-white text-sm">T</div>
          {expanded && <span className="ml-2.5 text-white font-semibold text-sm whitespace-nowrap overflow-hidden">Teams</span>}
          {expanded && (
            <button onClick={() => setPinned(p => !p)} className="ml-auto p-1 rounded text-white/40 hover:text-white/80 transition-colors">
              {pinned ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Role badge */}
        {expanded && (
          <div className="px-3 py-2 border-b border-white/10">
            <div className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-400 text-xs font-semibold text-center">
              Business Admin
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {groups.map(group => {
            const groupItems = navItems.filter(n => n.group === group);
            return (
              <div key={group}>
                {expanded && (
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                    {group}
                  </p>
                )}
                {groupItems.map(item => {
                  const Icon = item.icon;
                  const isActive = screen === item.screen;
                  return (
                    <div
                      key={item.screen}
                      onClick={() => navigate(item.screen)}
                      title={!expanded ? item.label : undefined}
                      className={`relative flex items-center h-9 mx-1.5 rounded-lg cursor-pointer transition-all mb-0.5
                        ${isActive ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/90 hover:bg-white/5'}`}
                      style={{ paddingLeft: expanded ? '10px' : '12px' }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {expanded && <span className="ml-2.5 text-sm font-medium whitespace-nowrap overflow-hidden">{item.label}</span>}
                      {item.badge && item.badge > 0 && !expanded && (
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                      )}
                      {item.badge && item.badge > 0 && expanded && (
                        <span className="ml-auto mr-2 min-w-[18px] h-4 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 h-14 px-3 hover:bg-white/5 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {activeUser.avatar || activeUser.name?.[0] || 'A'}
            </div>
            {expanded && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{activeUser.name}</p>
                <p className="text-white/40 text-xs truncate">{roleLabels[activeUser.role] || activeUser.role}</p>
              </div>
            )}
            <button
              onClick={onLogout}
              title="Log out"
              className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-14 flex-shrink-0 bg-white border-b border-border px-6 flex items-center justify-between">
          <h1 className="text-base font-semibold text-foreground">{screenTitles[screen]}</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">System Healthy</span>
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-hidden">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
