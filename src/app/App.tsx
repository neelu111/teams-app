import React, { useState, useCallback } from 'react';
import { Screen } from './components/types';
import { sampleNotifications, sampleUsers } from './components/sampleData';
import { EmployeeApp } from './components/employee/EmployeeApp';
import { ManagerApp } from './components/manager/ManagerApp';
import { BusinessAdminApp } from './components/businessAdmin/BusinessAdminApp';
import { SuperAdminApp } from './components/superAdmin/SuperAdminApp';

import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { LoginScreen } from './components/screens/LoginScreen';
import { WorkspaceScreen } from './components/screens/WorkspaceScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { AIAssistantScreen } from './components/screens/AIAssistantScreen';
import { WorkflowsScreen } from './components/screens/WorkflowsScreen';
import { WorkflowDetailScreen } from './components/screens/WorkflowDetailScreen';
import { TasksScreen } from './components/screens/TasksScreen';
import { TaskDetailScreen } from './components/screens/TaskDetailScreen';
import { AgentsScreen } from './components/screens/AgentsScreen';
import { AgentProfileScreen } from './components/screens/AgentProfileScreen';
import { ThreadsScreen } from './components/screens/ThreadsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ReportsScreen } from './components/screens/ReportsScreen';
import { AuditScreen } from './components/screens/AuditScreen';
import { UsersScreen } from './components/screens/UsersScreen';
import { RolesScreen } from './components/screens/RolesScreen';
import { SuperAgentConfigScreen } from './components/screens/SuperAgentConfigScreen';
import { AgentConfigScreen } from './components/screens/AgentConfigScreen';
import { ConnectorsScreen } from './components/screens/ConnectorsScreen';
import { AccessRulesScreen } from './components/screens/AccessRulesScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';

const screenTitles: Partial<Record<Screen, string>> = {
  dashboard: 'Dashboard',
  'ai-assistant': 'AI Assistant',
  workflows: 'Workflows',
  'workflow-detail': 'Workflow Details',
  tasks: 'Task Center',
  'task-detail': 'Task Details',
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
  capabilities: 'Capabilities',
  'access-rules': 'Access Rules',
  settings: 'Settings',
};

function CapabilitiesScreen({ onNavigate }: { onNavigate: (screen: Screen, id?: string) => void }) {
  const capabilities = [
    { id: 'cap-1', name: 'CRM Integration', desc: 'Read and write to CRM systems (HubSpot, Salesforce)', agents: ['Sales'], enabled: true, category: 'Sales', usageCount: 421 },
    { id: 'cap-2', name: 'Email Operations', desc: 'Read, compose, and send emails via Gmail or Outlook', agents: ['Sales', 'HR'], enabled: true, category: 'Communication', usageCount: 234 },
    { id: 'cap-3', name: 'Invoice Processing', desc: 'Extract, verify, and process vendor invoices', agents: ['Finance'], enabled: true, category: 'Finance', usageCount: 289 },
    { id: 'cap-4', name: 'HR Record Management', desc: 'Create and update employee records in HR systems', agents: ['HR'], enabled: true, category: 'HR', usageCount: 156 },
    { id: 'cap-5', name: 'Ticket Triage', desc: 'Classify and route support tickets by priority and type', agents: ['Support'], enabled: true, category: 'Support', usageCount: 634 },
    { id: 'cap-6', name: 'Web Research', desc: 'Search and synthesize information from the web', agents: ['Marketing'], enabled: true, category: 'Research', usageCount: 156 },
    { id: 'cap-7', name: 'Document Generation', desc: 'Create formatted reports, summaries, and documents', agents: ['All Agents'], enabled: true, category: 'Productivity', usageCount: 892 },
    { id: 'cap-8', name: 'Calendar Management', desc: 'Schedule meetings and manage calendar events', agents: ['HR', 'Sales'], enabled: false, category: 'Productivity', usageCount: 78 },
    { id: 'cap-9', name: 'Data Export', desc: 'Export data to CSV, PDF, or Excel formats', agents: ['All Agents'], enabled: true, category: 'Productivity', usageCount: 312 },
    { id: 'cap-10', name: 'Bulk SMS / Notifications', desc: 'Send bulk SMS or push notifications', agents: ['Support', 'Sales'], enabled: false, category: 'Communication', usageCount: 23 },
  ];

  const [caps, setCaps] = useState(capabilities);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <span><strong>{caps.filter(c => c.enabled).length}</strong> active capabilities</span>
          <span className="text-muted-foreground">{caps.filter(c => !c.enabled).length} disabled</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          + Add Capability
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-3 max-w-4xl">
          {caps.map(cap => (
            <div key={cap.id} className={`bg-white border rounded-xl p-4 transition-all ${cap.enabled ? 'border-border' : 'border-border opacity-60'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="text-sm font-semibold text-foreground">{cap.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{cap.category}</div>
                </div>
                <button
                  onClick={() => setCaps(prev => prev.map(c => c.id === cap.id ? { ...c, enabled: !c.enabled } : c))}
                  className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${cap.enabled ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${cap.enabled ? 'left-5' : 'left-0.5'}`} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{cap.desc}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-1">
                  {cap.agents.map(a => (
                    <span key={a} className="px-2 py-0.5 rounded-full bg-muted font-medium">{a}</span>
                  ))}
                </div>
                <span>{cap.usageCount} uses</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [appState, setAppState] = useState<'login' | 'workspace' | 'app'>('login');
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [activeUserId, setActiveUserId] = useState('user-001');

  const activeUser = sampleUsers.find(u => u.id === activeUserId) ?? sampleUsers[0];

  const navigate = useCallback((nextScreen: Screen, id?: string) => {
    setScreen(nextScreen);
    setSelectedId(id);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (appState === 'login') {
    return <LoginScreen onLogin={(userId) => { setActiveUserId(userId); setAppState('workspace'); }} />;
  }
  if (appState === 'workspace') {
    return <WorkspaceScreen onSelect={() => setAppState('app')} onBack={() => setAppState('login')} />;
  }

  if (activeUser.role === 'manager') {
    return <ManagerApp activeUser={activeUser} onLogout={() => setAppState('login')} />;
  }

  if (activeUser.role === 'employee') {
    return <EmployeeApp activeUser={activeUser} onLogout={() => setAppState('login')} />;
  }

  if (activeUser.role === 'business-admin') {
    return <BusinessAdminApp activeUser={activeUser} onLogout={() => setAppState('login')} />;
  }

  if (activeUser.role === 'super-admin') {
    return <SuperAdminApp activeUser={activeUser} onLogout={() => setAppState('login')} />;
  }

  const getBreadcrumbs = () => {
    if (screen === 'workflow-detail') return [{ label: 'Workflows', screen: 'workflows' as Screen }, { label: 'Workflow Details' }];
    if (screen === 'task-detail') return [{ label: 'Tasks', screen: 'tasks' as Screen }, { label: 'Task Details' }];
    if (screen === 'agent-profile') return [{ label: 'Agents', screen: 'agents' as Screen }, { label: 'Agent Profile' }];
    if (screen === 'thread-detail') return [{ label: 'Threads', screen: 'threads' as Screen }, { label: 'Thread' }];
    return undefined;
  };

  const isFullScreen = screen === 'ai-assistant' || screen === 'threads' || screen === 'thread-detail';

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard': return <DashboardScreen onNavigate={navigate} activeUser={activeUser} />;
      case 'ai-assistant': return <AIAssistantScreen onNavigate={navigate} />;
      case 'workflows': return <WorkflowsScreen onNavigate={navigate} />;
      case 'workflow-detail': return <WorkflowDetailScreen workflowId={selectedId || 'wf-001'} onNavigate={navigate} />;
      case 'tasks': return <TasksScreen onNavigate={navigate} />;
      case 'task-detail': return <TaskDetailScreen taskId={selectedId || 'task-001'} onNavigate={navigate} />;
      case 'agents': return <AgentsScreen onNavigate={navigate} />;
      case 'agent-profile': return <AgentProfileScreen agentId={selectedId || 'agent-sales'} onNavigate={navigate} />;
      case 'threads': return <ThreadsScreen onNavigate={navigate} threadId={selectedId} activeUser={activeUser} />;
      case 'thread-detail': return <ThreadsScreen onNavigate={navigate} threadId={selectedId} activeUser={activeUser} />;
      case 'notifications': return <NotificationsScreen onNavigate={navigate} onMarkRead={markAllRead} />;
      case 'reports': return <ReportsScreen onNavigate={navigate} />;
      case 'audit': return <AuditScreen onNavigate={navigate} />;
      case 'users': return <UsersScreen onNavigate={navigate} />;
      case 'roles': return <RolesScreen onNavigate={navigate} />;
      case 'super-agent-config': return <SuperAgentConfigScreen onNavigate={navigate} />;
      case 'agent-config': return <AgentConfigScreen onNavigate={navigate} />;
      case 'connectors': return <ConnectorsScreen onNavigate={navigate} />;
      case 'capabilities': return <CapabilitiesScreen onNavigate={navigate} />;
      case 'access-rules': return <AccessRulesScreen onNavigate={navigate} />;
      case 'settings': return <SettingsScreen onNavigate={navigate} />;
      default: return <DashboardScreen onNavigate={navigate} />;
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <Sidebar currentScreen={screen} onNavigate={navigate} unreadCount={unreadCount} activeUser={activeUser} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {!isFullScreen && (
          <TopBar
            title={screenTitles[screen] || ''}
            breadcrumbs={getBreadcrumbs()}
            onNavigate={navigate}
            unreadCount={unreadCount}
          />
        )}
        {isFullScreen && (
          <div className="h-14 flex-shrink-0 bg-white border-b border-border px-6 flex items-center justify-between">
            <h1 className="text-base font-semibold text-foreground">{screenTitles[screen]}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('ai-assistant')}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
              >
                AI Assistant
              </button>
              <button
                onClick={() => navigate('notifications')}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-muted-foreground text-sm">🔔</span>
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
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
