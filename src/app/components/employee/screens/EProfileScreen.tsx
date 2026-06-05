import React, { useState } from 'react';
import {
  User, Mail, Phone, MapPin, Building2, TrendingUp, CheckCircle2,
  GitBranch, Clock, Bell, Shield, Link, ChevronRight, Edit3, Check, X
} from 'lucide-react';
import { EScreen } from '../employeeData';

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin', 'business-admin': 'Business Admin',
  'manager': 'Business Manager', 'employee': 'Employee',
};
const roleColors: Record<string, string> = {
  'super-admin': '#5C5FEF', 'business-admin': '#8B5CF6',
  'manager': '#0EA5E9', 'employee': '#10B981',
};

interface EProfileScreenProps {
  onNavigate: (screen: EScreen) => void;
  activeUser: { name: string; avatar: string; role: string; email?: string; department?: string };
  onLogout: () => void;
}

const integrations = [
  { name: 'HubSpot CRM', icon: '🔶', status: 'connected', desc: 'Read/write CRM data' },
  { name: 'Google Calendar', icon: '📅', status: 'connected', desc: 'Scheduling & meetings' },
  { name: 'Google Drive', icon: '📁', status: 'connected', desc: 'File storage & sharing' },
  { name: 'Gmail', icon: '✉️', status: 'connected', desc: 'Email operations' },
  { name: 'Slack', icon: '💬', status: 'connected', desc: 'Team notifications' },
  { name: 'Zoom', icon: '🎥', status: 'disconnected', desc: 'Video meetings' },
];

export function EProfileScreen({ onNavigate, activeUser, onLogout }: EProfileScreenProps) {
  const [tab, setTab] = useState<'overview' | 'notifications' | 'integrations' | 'security'>('overview');
  const [notifSettings, setNotifSettings] = useState({
    taskAssigned: true, approvalRequired: true, workflowUpdate: true,
    reminder: true, escalation: true, completion: false,
    emailDigest: true, slackNotifs: false,
  });

  const stats = [
    { label: 'Tasks Completed', value: '312', icon: CheckCircle2, color: '#10B981' },
    { label: 'Workflows Created', value: '78', icon: GitBranch, color: '#5C5FEF' },
    { label: 'Hours Saved', value: '142h', icon: Clock, color: '#F59E0B' },
    { label: 'Success Rate', value: '96.2%', icon: TrendingUp, color: '#0EA5E9' },
  ];

  const recentActivity = [
    { label: 'TechCorp proposal generated via Sales', time: '2 hrs ago', color: '#0EA5E9' },
    { label: 'Competitive analysis reviewed from Marketing', time: '2 hrs ago', color: '#06B6D4' },
    { label: 'InnovateCo discount request submitted', time: 'Yesterday', color: '#F97316' },
    { label: 'Expense report processed by Finance', time: 'Yesterday', color: '#F59E0B' },
    { label: 'Q2 pipeline report generated', time: 'May 30', color: '#5C5FEF' },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-muted'}`}>
      <span className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );

  const roleColor = roleColors[activeUser.role] || '#5C5FEF';

  return (
    <div className="h-full overflow-y-auto">
      {/* Profile hero */}
      <div className="px-8 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #F0F1FE 0%, #FAF0FF 100%)' }}>
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}CC)` }}>
            {activeUser.avatar}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-semibold text-foreground">{activeUser.name}</h1>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium text-white" style={{ background: roleColor }}>
                {roleLabels[activeUser.role] || activeUser.role}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {activeUser.email && (
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{activeUser.email}</span>
              )}
              {activeUser.department && (
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{activeUser.department} · Manexa AI Labs</span>
              )}
            </div>
          </div>
          <button onClick={onLogout}
            className="px-4 py-2 border border-border bg-white rounded-lg text-sm text-muted-foreground hover:bg-muted/50 transition-colors">
            Log out
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mt-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-xl p-4 border border-white/80">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: stat.color + '15' }}>
                  <stat.icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-xl font-semibold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 py-3 bg-white border-b border-border sticky top-0 z-10">
        {(['overview', 'notifications', 'integrations', 'security'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${tab === t ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="px-8 py-6">
        {tab === 'overview' && (
          <div className="grid grid-cols-2 gap-5">
            {/* Personal Info */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Personal Information</h3>
                <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: activeUser.name, icon: User },
                  { label: 'Email', value: activeUser.email || 'Not set', icon: Mail },
                  { label: 'Department', value: activeUser.department || 'Not set', icon: Building2 },
                  { label: 'Role', value: roleLabels[activeUser.role] || activeUser.role, icon: Shield },
                  { label: 'Location', value: 'San Francisco, CA', icon: MapPin },
                  { label: 'Phone', value: '+1 (415) 555-0123', icon: Phone },
                ].map(field => (
                  <div key={field.label} className="flex items-center gap-3">
                    <field.icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">{field.label}</p>
                      <p className="text-sm text-foreground font-medium">{field.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent Preferences */}
            <div className="col-span-2 bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">My AI Agents</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: 'Command', type: 'super', desc: 'Primary coordinator', uses: 24 },
                  { name: 'Sales', type: 'sales', desc: 'Sales & proposals', uses: 18 },
                  { name: 'Marketing', type: 'research', desc: 'Market research', uses: 6 },
                  { name: 'HR', type: 'hr', desc: 'HR & scheduling', uses: 3 },
                  { name: 'Finance', type: 'finance', desc: 'Expenses & reports', uses: 5 },
                  { name: 'Support', type: 'support', desc: 'Customer support', uses: 1 },
                ].map(agent => (
                  <div key={agent.name} className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-base">
                      {agent.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.uses} interactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="max-w-xl space-y-4">
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">In-App Notifications</h3>
              <div className="space-y-4">
                {Object.entries({
                  taskAssigned: 'Task Assigned',
                  approvalRequired: 'Approval Required',
                  workflowUpdate: 'Workflow Updates',
                  reminder: 'Reminders',
                  escalation: 'Escalations',
                  completion: 'Completions',
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{label}</span>
                    <Toggle
                      checked={(notifSettings as any)[key]}
                      onChange={() => setNotifSettings(p => ({ ...p, [key]: !(p as any)[key] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Delivery Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailDigest', label: 'Daily email digest' },
                  { key: 'slackNotifs', label: 'Slack notifications' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{label}</span>
                    <Toggle
                      checked={(notifSettings as any)[key]}
                      onChange={() => setNotifSettings(p => ({ ...p, [key]: !(p as any)[key] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'integrations' && (
          <div className="max-w-xl space-y-3">
            {integrations.map(int => (
              <div key={int.name} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">{int.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{int.name}</p>
                    {int.status === 'connected' ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 font-medium">Connected</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">Disconnected</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{int.desc}</p>
                </div>
                {int.status === 'connected' ? (
                  <button className="text-xs text-muted-foreground hover:text-red-600 transition-colors">Disconnect</button>
                ) : (
                  <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">Connect</button>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'security' && (
          <div className="max-w-xl space-y-4">
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Security Settings</h3>
              <div className="space-y-3">
                {[
                  { label: 'Change Password', desc: 'Last changed 30 days ago' },
                  { label: 'Two-Factor Authentication', desc: 'Enabled via authenticator app' },
                  { label: 'Active Sessions', desc: '2 devices — MacBook, iPhone' },
                  { label: 'API Access Tokens', desc: '1 active token' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
