import React, { useState, useCallback } from 'react';
import {
  LayoutDashboard, Users, Bot, CheckSquare, GitBranch,
  CheckCircle2, UserCheck, BarChart2, Bell,
  PanelLeftClose, PanelLeftOpen, LogOut
} from 'lucide-react';
import { MScreen, managerNotifications } from './managerData';
import { MDashboardScreen } from './screens/MDashboardScreen';
import { MTeamOverviewScreen } from './screens/MTeamOverviewScreen';
import { MAIScreen } from './screens/MAIScreen';
import { MTeamTasksScreen } from './screens/MTeamTasksScreen';
import { MTeamWorkflowsScreen } from './screens/MTeamWorkflowsScreen';
import { MApprovalsScreen } from './screens/MApprovalsScreen';
import { MEmployeesScreen } from './screens/MEmployeesScreen';
import { MReportsScreen } from './screens/MReportsScreen';
import { MNotificationsScreen } from './screens/MNotificationsScreen';

interface ManagerAppProps {
  activeUser: { id: string; name: string; avatar: string; role: string; email?: string; department?: string };
  onLogout: () => void;
}

const navItems: { screen: MScreen; label: string; icon: React.ElementType; badgeKey?: string }[] = [
  { screen: 'dashboard',      label: 'Dashboard',       icon: LayoutDashboard },
  { screen: 'team-overview',  label: 'Team Overview',   icon: Users },
  { screen: 'ai',             label: 'AI Assistant',    icon: Bot },
  { screen: 'team-tasks',     label: 'Team Tasks',      icon: CheckSquare },
  { screen: 'team-workflows', label: 'Team Workflows',  icon: GitBranch },
  { screen: 'approvals',      label: 'Approvals',       icon: CheckCircle2, badgeKey: 'approvals' },
  { screen: 'employees',      label: 'Employees',       icon: UserCheck },
  { screen: 'reports',        label: 'Reports',         icon: BarChart2 },
  { screen: 'notifications',  label: 'Notifications',   icon: Bell, badgeKey: 'notifs' },
];

const screenTitles: Record<MScreen, string> = {
  dashboard:      'Manager Dashboard',
  'team-overview':'Team Overview',
  ai:             'AI Assistant',
  'team-tasks':   'Team Tasks',
  'team-workflows':'Team Workflows',
  approvals:      'Approvals Center',
  employees:      'Employees',
  reports:        'Reports',
  notifications:  'Notifications',
};

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin', 'business-admin': 'Business Admin',
  'manager': 'Business Manager', 'employee': 'Employee',
};

const fullScreens: MScreen[] = ['ai'];

export function ManagerApp({ activeUser, onLogout }: ManagerAppProps) {
  const [screen, setScreen] = useState<MScreen>('dashboard');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);

  const unreadNotifs = managerNotifications.filter(n => !n.read).length;
  const pendingApprovals = 3;

  const expanded = pinned || hovered;

  const navigate = useCallback((nextScreen: MScreen, id?: string) => {
    setScreen(nextScreen);
    setSelectedId(id);
  }, []);

  const isFullScreen = fullScreens.includes(screen);

  const getBadge = (key?: string) => {
    if (key === 'notifs') return unreadNotifs;
    if (key === 'approvals') return pendingApprovals;
    return 0;
  };

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':      return <MDashboardScreen onNavigate={navigate} activeUser={activeUser} />;
      case 'team-overview':  return <MTeamOverviewScreen onNavigate={navigate} />;
      case 'ai':             return <MAIScreen onNavigate={navigate} />;
      case 'team-tasks':     return <MTeamTasksScreen onNavigate={navigate} />;
      case 'team-workflows': return <MTeamWorkflowsScreen onNavigate={navigate} initialWorkflowId={selectedId} />;
      case 'approvals':      return <MApprovalsScreen onNavigate={navigate} initialApprovalId={selectedId} />;
      case 'employees':      return <MEmployeesScreen onNavigate={navigate} initialEmployeeId={selectedId} />;
      case 'reports':        return <MReportsScreen onNavigate={navigate} />;
      case 'notifications':  return <MNotificationsScreen onNavigate={navigate} />;
      default:               return <MDashboardScreen onNavigate={navigate} activeUser={activeUser} />;
    }
  };

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
            <div className="px-2 py-1 rounded-md bg-amber-500/20 text-amber-400 text-xs font-semibold text-center">
              Manager View
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-hidden py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = screen === item.screen;
            const badge = getBadge(item.badgeKey);
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
                {badge > 0 && !expanded && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                )}
                {badge > 0 && expanded && (
                  <span className="ml-auto mr-2 min-w-[18px] h-4 px-1 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                    {badge}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* User profile + logout */}
        <div className="border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 h-14 px-3 hover:bg-white/5 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {activeUser.avatar}
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
        {!isFullScreen && (
          <div className="h-14 flex-shrink-0 bg-white border-b border-border px-6 flex items-center justify-between">
            <h1 className="text-base font-semibold text-foreground">{screenTitles[screen]}</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate('ai')}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                Ask AI
              </button>
              <button onClick={() => navigate('approvals')}
                className="relative flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors">
                <CheckCircle2 className="w-4 h-4" />
                {pendingApprovals > 0 && (
                  <span className="min-w-[18px] h-4 px-1 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                    {pendingApprovals}
                  </span>
                )}
              </button>
              <button onClick={() => navigate('notifications')}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadNotifs > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
            </div>
          </div>
        )}
        <main className="flex-1 overflow-hidden">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}
