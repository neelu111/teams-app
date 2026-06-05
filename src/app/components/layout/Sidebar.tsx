import React, { useState } from 'react';
import {
  LayoutDashboard, Bot, GitBranch, CheckSquare, Users, MessageSquare,
  Bell, BarChart3, Shield, Settings, ChevronDown, ChevronRight,
  Zap, Plug, Lock, UserCog, Activity, Building2, PanelLeftOpen, PanelLeftClose
} from 'lucide-react';
import { Screen } from '../types';

interface SidebarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  unreadCount: number;
  activeUser: { name: string; avatar: string; role: string };
}

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin',
  'business-admin': 'Business Admin',
  'manager': 'Business Manager',
  'employee': 'Employee',
};

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', screen: 'dashboard' as Screen, badge: undefined },
  { icon: Bot, label: 'AI Assistant', screen: 'ai-assistant' as Screen, badge: undefined },
  { icon: GitBranch, label: 'Workflows', screen: 'workflows' as Screen, badge: 3 },
  { icon: CheckSquare, label: 'Tasks', screen: 'tasks' as Screen, badge: 2 },
  { icon: Users, label: 'Agents', screen: 'agents' as Screen, badge: undefined },
  { icon: MessageSquare, label: 'Threads', screen: 'threads' as Screen, badge: 4 },
  { icon: Bell, label: 'Notifications', screen: 'notifications' as Screen, badge: undefined },
  { icon: BarChart3, label: 'Reports', screen: 'reports' as Screen, badge: undefined },
  { icon: Shield, label: 'Audit Center', screen: 'audit' as Screen, badge: undefined },
];

const adminItems = [
  { icon: UserCog, label: 'Users', screen: 'users' as Screen },
  { icon: Lock, label: 'Roles', screen: 'roles' as Screen },
  { icon: Zap, label: 'Super Agent', screen: 'super-agent-config' as Screen },
  { icon: Bot, label: 'Specialist Agents', screen: 'agent-config' as Screen },
  { icon: Plug, label: 'Connectors', screen: 'connectors' as Screen },
  { icon: Activity, label: 'Capabilities', screen: 'capabilities' as Screen },
  { icon: Lock, label: 'Access Rules', screen: 'access-rules' as Screen },
];

const adminScreens: Screen[] = ['users', 'roles', 'super-agent-config', 'agent-config', 'connectors', 'capabilities', 'access-rules'];

export function Sidebar({ currentScreen, onNavigate, unreadCount, activeUser }: SidebarProps) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [adminExpanded, setAdminExpanded] = useState(adminScreens.includes(currentScreen));

  const expanded = pinned || hovered;
  const w = expanded ? 220 : 52;

  return (
    <aside
      className="h-full flex flex-col flex-shrink-0 relative z-20 transition-all duration-200 ease-in-out overflow-hidden"
      style={{ width: w, background: '#0F1117' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Logo */}
      <div className="px-3 py-4 flex items-center gap-2.5 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', minHeight: 57 }}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/50 flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        {expanded && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="text-white font-semibold text-sm tracking-tight whitespace-nowrap">Teams</div>
            <div className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.35)' }}>Manexa AI Labs</div>
          </div>
        )}
        {expanded && (
          <button
            onClick={() => setPinned(p => !p)}
            className="flex-shrink-0 p-1 rounded transition-colors hover:bg-white/10"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            title={pinned ? 'Unpin sidebar' : 'Pin sidebar'}
          >
            {pinned ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeftOpen className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5" style={{ padding: expanded ? '12px 8px' : '12px 6px' }}>
        {navItems.map(item => {
          const Icon = item.icon;
          const active = currentScreen === item.screen;
          const badge = item.screen === 'notifications' ? unreadCount : item.badge;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              title={!expanded ? item.label : undefined}
              className={`w-full flex items-center rounded-lg text-sm transition-all duration-150 relative ${
                active ? 'text-white font-medium' : 'font-normal hover:text-white'
              }`}
              style={{
                gap: expanded ? 10 : 0,
                padding: expanded ? '7px 12px' : '7px 0',
                justifyContent: expanded ? 'flex-start' : 'center',
                background: active ? 'rgba(92, 95, 239, 0.18)' : 'transparent',
                color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
              }}
            >
              {active && expanded && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-r-full" />
              )}
              <div className="relative flex-shrink-0">
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : 'text-current'}`} />
                {!expanded && badge && badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] px-0.5 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ background: '#5C5FEF', color: '#fff' }}>
                    {badge}
                  </span>
                ) : null}
              </div>
              {expanded && (
                <>
                  <span className="flex-1 text-left whitespace-nowrap overflow-hidden">{item.label}</span>
                  {badge && badge > 0 ? (
                    <span className="flex-shrink-0 min-w-[18px] h-[18px] px-1 rounded-full text-xs font-medium flex items-center justify-center"
                      style={{ background: active ? '#5C5FEF' : 'rgba(92,95,239,0.5)', color: '#fff' }}>
                      {badge}
                    </span>
                  ) : null}
                </>
              )}
            </button>
          );
        })}

        {/* Administration */}
        <div className="pt-2">
          {expanded ? (
            <>
              <button
                onClick={() => setAdminExpanded(e => !e)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150"
                style={{ color: 'rgba(255,255,255,0.35)' }}
              >
                <Building2 className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">Administration</span>
                {adminExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              {adminExpanded && (
                <div className="ml-2 mt-0.5 space-y-0.5">
                  {adminItems.map(item => {
                    const Icon = item.icon;
                    const active = currentScreen === item.screen;
                    return (
                      <button
                        key={item.screen}
                        onClick={() => onNavigate(item.screen)}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all duration-150 whitespace-nowrap"
                        style={{
                          background: active ? 'rgba(92, 95, 239, 0.18)' : 'transparent',
                          color: active ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                        }}
                      >
                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-indigo-400' : ''}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-full h-px mb-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
              {adminItems.map(item => {
                const Icon = item.icon;
                const active = currentScreen === item.screen;
                return (
                  <button
                    key={item.screen}
                    onClick={() => onNavigate(item.screen)}
                    title={item.label}
                    className="flex items-center justify-center w-full py-1.5 rounded-lg transition-all duration-150"
                    style={{
                      background: active ? 'rgba(92, 95, 239, 0.18)' : 'transparent',
                      color: active ? '#C7D2FE' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)', padding: expanded ? '12px' : '12px 6px' }}>
        <button
          onClick={() => onNavigate('settings')}
          title={!expanded ? 'Settings — Kumar' : undefined}
          className="w-full flex items-center rounded-lg transition-all duration-150 group"
          style={{
            gap: expanded ? 10 : 0,
            padding: expanded ? '8px' : '8px 0',
            justifyContent: expanded ? 'flex-start' : 'center',
            color: 'rgba(255,255,255,0.55)',
          }}
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">{activeUser.avatar}</div>
          {expanded && (
            <>
              <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-medium text-white truncate">{activeUser.name}</div>
                <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{roleLabels[activeUser.role] ?? activeUser.role}</div>
              </div>
              <Settings className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
