import React, { useState, useCallback } from 'react';
import {
  Home, Bot, CheckSquare, GitBranch, Bell,
  User, PanelLeftClose, PanelLeftOpen, LogOut
} from 'lucide-react';
import { EScreen, employeeNotifications } from './employeeData';
import { EHomeScreen } from './screens/EHomeScreen';
import { EAIScreen } from './screens/EAIScreen';
import { ETasksScreen } from './screens/ETasksScreen';
import { EWorkflowsScreen } from './screens/EWorkflowsScreen';
import { ENotificationsScreen } from './screens/ENotificationsScreen';
import { EProfileScreen } from './screens/EProfileScreen';

interface EmployeeAppProps {
  activeUser: { id: string; name: string; avatar: string; role: string; email?: string; department?: string };
  onLogout: () => void;
}

const navItems: { screen: EScreen; label: string; icon: React.ElementType; badgeKey?: string }[] = [
  { screen: 'home',          label: 'Home',          icon: Home },
  { screen: 'ai',            label: 'AI Assistant',  icon: Bot },
  { screen: 'tasks',         label: 'My Tasks',      icon: CheckSquare },
  { screen: 'workflows',     label: 'Workflows',     icon: GitBranch },
  { screen: 'notifications', label: 'Notifications', icon: Bell, badgeKey: 'notifs' },
  { screen: 'profile',       label: 'Profile',       icon: User },
];

const screenTitles: Record<EScreen, string> = {
  home: 'Home', ai: 'AI Assistant', tasks: 'My Tasks', workflows: 'My Workflows',
  notifications: 'Notifications', profile: 'Profile',
};

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin', 'business-admin': 'Business Admin',
  'manager': 'Business Manager', 'employee': 'Employee',
};

export function EmployeeApp({ activeUser, onLogout }: EmployeeAppProps) {
  const [screen, setScreen] = useState<EScreen>('ai');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [notifCount] = useState(employeeNotifications.filter(n => !n.read).length);

  const expanded = pinned || hovered;

  const navigate = useCallback((nextScreen: EScreen, id?: string) => {
    setScreen(nextScreen);
    setSelectedId(id);
  }, []);

  const isFullScreen = screen === 'ai';

  const renderScreen = () => {
    switch (screen) {
      case 'home':          return <EHomeScreen onNavigate={navigate} activeUser={activeUser} />;
      case 'ai':            return <EAIScreen onNavigate={navigate} />;
      case 'tasks':         return <ETasksScreen onNavigate={navigate} initialTaskId={selectedId} />;
      case 'workflows':     return <EWorkflowsScreen onNavigate={navigate} initialWorkflowId={selectedId} />;
      case 'notifications': return <ENotificationsScreen onNavigate={navigate} />;
      case 'profile':       return <EProfileScreen onNavigate={navigate} activeUser={activeUser} onLogout={onLogout} />;
      default:              return <EHomeScreen onNavigate={navigate} activeUser={activeUser} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: '#0F1117', width: expanded ? 220 : 52, transition: 'width 0.2s ease' }}
        className="h-full flex-shrink-0 flex flex-col overflow-hidden z-20 relative"
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

        {/* Nav */}
        <nav className="flex-1 overflow-hidden py-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = screen === item.screen;
            const badge = item.badgeKey === 'notifs' ? notifCount : 0;
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

        {/* User profile */}
        <div className="border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 h-14 px-3 hover:bg-white/5 transition-colors">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
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
              <button
                onClick={() => navigate('ai')}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                Ask AI
              </button>
              <button
                onClick={() => navigate('notifications')}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {notifCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
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
