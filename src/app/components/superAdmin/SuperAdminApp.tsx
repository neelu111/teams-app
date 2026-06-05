import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard, Building2, Users, Zap, CreditCard, Shield,
  FileText, BarChart2, Settings, Bell, PanelLeftClose, PanelLeftOpen, LogOut,
} from 'lucide-react';
import { SAScreen } from './superAdminData';
import { SADashboardScreen } from './screens/SADashboardScreen';
import { SAAgentOversightScreen } from './screens/SAAgentOversightScreen';
import { SAPlatformConfigScreen } from './screens/SAPlatformConfigScreen';
import { SATenantsScreen } from './screens/SATenantsScreen';
import { SAUsersScreen } from './screens/SAUsersScreen';
import { SABillingScreen } from './screens/SABillingScreen';
import { SASecurityScreen } from './screens/SASecurityScreen';
import { SAAuditScreen } from './screens/SAAuditScreen';
import { SAReportsScreen } from './screens/SAReportsScreen';

interface SuperAdminAppProps {
  activeUser: { id: string; name: string; avatar: string; role: string };
  onLogout: () => void;
}

interface NavItem {
  screen: SAScreen;
  label: string;
  icon: React.ElementType;
  group: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { screen: 'dashboard',        label: 'Dashboard',       icon: LayoutDashboard, group: 'Overview' },
  { screen: 'tenants',          label: 'Tenants',         icon: Building2,       group: 'Platform' },
  { screen: 'users',            label: 'All Users',       icon: Users,           group: 'Platform' },
  { screen: 'agent-oversight',  label: 'Agent Oversight', icon: Zap,             group: 'Platform' },
  { screen: 'billing',          label: 'Billing',         icon: CreditCard,      group: 'Business' },
  { screen: 'security',         label: 'Security',        icon: Shield,          group: 'Business', badge: 2 },
  { screen: 'audit',            label: 'Audit Log',       icon: FileText,        group: 'Business' },
  { screen: 'reports',          label: 'Reports',         icon: BarChart2,       group: 'Business' },
  { screen: 'platform-config',  label: 'Platform Config', icon: Settings,        group: 'System' },
];

const screenTitles: Record<SAScreen, string> = {
  dashboard:          'Super Admin Dashboard',
  'agent-oversight':  'Agent Oversight',
  'platform-config':  'Platform Configuration',
  tenants:            'Tenant Management',
  users:              'All Users',
  billing:            'Billing & Revenue',
  security:           'Security Center',
  audit:              'Audit Log',
  reports:            'Reports & Analytics',
};

const navGroups = ['Overview', 'Platform', 'Business', 'System'];

export function SuperAdminApp({ activeUser, onLogout }: SuperAdminAppProps) {
  const [screen, setScreen] = useState<SAScreen>('dashboard');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  const expanded = pinned || hovered;

  const navigate = useCallback((nextScreen: SAScreen, id?: string) => {
    setScreen(nextScreen);
    setSelectedId(id);
  }, []);

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':        return <SADashboardScreen onNavigate={navigate} activeUser={activeUser} />;
      case 'agent-oversight':  return <SAAgentOversightScreen onNavigate={navigate} />;
      case 'platform-config':  return <SAPlatformConfigScreen onNavigate={navigate} />;
      case 'tenants':          return <SATenantsScreen onNavigate={navigate} />;
      case 'users':            return <SAUsersScreen onNavigate={navigate} />;
      case 'billing':          return <SABillingScreen onNavigate={navigate} />;
      case 'security':         return <SASecurityScreen onNavigate={navigate} />;
      case 'audit':            return <SAAuditScreen onNavigate={navigate} />;
      case 'reports':          return <SAReportsScreen onNavigate={navigate} />;
      default:                 return <SADashboardScreen onNavigate={navigate} activeUser={activeUser} />;
    }
  };

  const firstName = activeUser.name.split(' ')[0];
  const initials = activeUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: '#0A0B0F',
          width: expanded ? 224 : 52,
          transition: 'width 0.2s ease',
        }}
        className="h-full flex-shrink-0 flex flex-col overflow-hidden z-20"
      >
        {/* Logo row */}
        <div className="h-14 flex items-center px-3 flex-shrink-0 border-b border-white/8">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 font-bold text-white text-sm">
            T
          </div>
          {expanded && (
            <span className="ml-2.5 text-white font-semibold text-sm whitespace-nowrap overflow-hidden flex-1">
              Teams
            </span>
          )}
          {expanded && (
            <button
              onClick={() => setPinned(p => !p)}
              className="ml-auto p-1 rounded text-white/40 hover:text-white/80 transition-colors"
              title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
            >
              {pinned ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>

        {/* Super Admin badge */}
        {expanded && (
          <div className="px-3 py-2 border-b border-white/8">
            <div
              className="px-2 py-1 rounded-md text-xs font-semibold text-center text-white"
              style={{ background: 'linear-gradient(135deg, #5C5FEF 0%, #7C3AED 100%)' }}
            >
              Super Admin
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2">
          {navGroups.map(group => {
            const items = navItems.filter(n => n.group === group);
            return (
              <div key={group}>
                {expanded && (
                  <p className="px-3 pt-3 pb-1 text-xs font-semibold text-white/30 uppercase tracking-wider whitespace-nowrap">
                    {group}
                  </p>
                )}
                {items.map(item => {
                  const Icon = item.icon;
                  const isActive = screen === item.screen;
                  return (
                    <div
                      key={item.screen}
                      onClick={() => navigate(item.screen)}
                      title={!expanded ? item.label : undefined}
                      className={`relative flex items-center h-9 mx-1.5 rounded-lg cursor-pointer transition-all mb-0.5
                        ${isActive
                          ? 'bg-white/10 text-white'
                          : 'text-white/50 hover:text-white/90 hover:bg-white/5'
                        }`}
                      style={{ paddingLeft: expanded ? '10px' : '12px' }}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {expanded && (
                        <span className="ml-2.5 text-sm font-medium whitespace-nowrap overflow-hidden flex-1">
                          {item.label}
                        </span>
                      )}
                      {/* Badge: collapsed = red dot, expanded = pill */}
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
        <div className="border-t border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2 h-14 px-3 hover:bg-white/5 transition-colors">
            {/* Gradient avatar */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #5C5FEF 0%, #7C3AED 100%)' }}
            >
              {initials}
            </div>
            {expanded && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{activeUser.name}</p>
                <p className="text-white/40 text-xs truncate">Super Admin</p>
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
            {/* Platform status pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-green-700">12 Tenants · 99.99% Uptime</span>
            </div>
            {/* Bell */}
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
