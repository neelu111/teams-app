import React, { useState } from 'react';
import { Building2, Bell, Shield, Palette, Globe, Key, LogOut, ChevronRight, Upload, Save, FileText } from 'lucide-react';
import { Screen } from '../types';
import { UserAvatar } from '../shared/AgentAvatar';
import { listAuditEvents } from '../shared/audit';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  activeUser?: { id?: string; name?: string; avatar?: string; role?: string; email?: string; department?: string };
}

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: Building2 },
  { id: 'workspace', label: 'Workspace', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'audit', label: 'Audit Log', icon: FileText },
];

export function SettingsScreen({ onNavigate, activeUser }: SettingsScreenProps) {
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(activeUser?.name || '');
  const [email, setEmail] = useState(activeUser?.email || '');
  const [timezone, setTimezone] = useState('America/New_York');
  const [workspaceName, setWorkspaceName] = useState('Manexa AI Labs');
  const [notifSettings, setNotifSettings] = useState({
    emailApprovals: true, emailCompletions: true, emailMentions: true,
    pushApprovals: true, pushCompletions: false, pushMentions: true,
    slackApprovals: true, slackCompletions: true, slackMentions: false,
  });

  const toggle = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ToggleRow = ({ label, sub, settingKey }: { label: string; sub: string; settingKey: keyof typeof notifSettings }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="text-xs text-muted-foreground">{sub}</div>
      </div>
      <button onClick={() => toggle(settingKey)}
        className={`relative w-10 h-5 rounded-full transition-colors ${notifSettings[settingKey] ? 'bg-primary' : 'bg-muted'}`}>
        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${notifSettings[settingKey] ? 'left-5' : 'left-0.5'}`} />
      </button>
    </div>
  );

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 bg-white border-r border-border flex flex-col py-3">
        <div className="px-4 mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Settings</span>
        </div>
        {settingsSections.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${activeSection === s.id ? 'bg-accent text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {s.label}
            </button>
          );
        })}
        <div className="mt-auto px-4 py-3 border-t border-border">
          <button onClick={() => onNavigate('login')} className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-xl">
          {activeSection === 'profile' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-0.5">Profile Settings</h2>
                <p className="text-xs text-muted-foreground">Manage your personal account information</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <UserAvatar initials={activeUser?.avatar || name?.[0] || 'A'} name={activeUser?.name || name || 'Employee'} size="lg" />
                  <div>
                    <div className="text-sm font-medium text-foreground mb-1">{name || activeUser?.name || 'Employee'}</div>
                    <div className="text-xs text-muted-foreground mb-2">{activeUser?.role || 'Employee'} · {activeUser?.department || 'Company'}</div>
                    <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                      <Upload className="w-3.5 h-3.5" /> Change photo
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Email Address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Time Zone</label>
                  <select value={timezone} onChange={e => setTimezone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white">
                    <option value="America/New_York">Eastern Time (UTC-5)</option>
                    <option value="America/Chicago">Central Time (UTC-6)</option>
                    <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
                    <option value="Europe/London">GMT (UTC+0)</option>
                    <option value="Asia/Singapore">Singapore (UTC+8)</option>
                  </select>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'workspace' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-0.5">Workspace Settings</h2>
                <p className="text-xs text-muted-foreground">Configure your Manexa AI Labs workspace</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Workspace Name</label>
                  <input type="text" value={workspaceName} onChange={e => setWorkspaceName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Domain</label>
                  <input type="text" defaultValue="manexa.ai" disabled
                    className="w-full px-3.5 py-2.5 text-sm bg-muted/40 border border-border rounded-lg text-muted-foreground cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Plan</label>
                  <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-indigo-900">Enterprise Plan</span>
                      <span className="text-xs text-indigo-600">Unlimited agents, workflows & users</span>
                    </div>
                    <button className="text-xs text-primary hover:underline">Manage</button>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-0.5">Notification Preferences</h2>
                <p className="text-xs text-muted-foreground">Choose when and how you receive notifications</p>
              </div>
              {[
                { channel: 'Email', prefix: 'email' as const, items: [
                  { label: 'Approval Requests', sub: 'When an agent needs your approval to proceed', key: 'emailApprovals' as const },
                  { label: 'Workflow Completions', sub: 'When a workflow finishes running', key: 'emailCompletions' as const },
                  { label: 'Mentions', sub: 'When someone mentions you in a thread', key: 'emailMentions' as const },
                ]},
                { channel: 'Push', prefix: 'push' as const, items: [
                  { label: 'Approval Requests', sub: 'Real-time push for urgent approvals', key: 'pushApprovals' as const },
                  { label: 'Workflow Completions', sub: 'Push when workflows complete', key: 'pushCompletions' as const },
                  { label: 'Mentions', sub: 'Push for direct mentions', key: 'pushMentions' as const },
                ]},
              ].map(group => (
                <div key={group.channel} className="bg-white border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{group.channel} Notifications</h3>
                  {group.items.map(item => (
                    <ToggleRow key={item.key} label={item.label} sub={item.sub} settingKey={item.key} />
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-0.5">Security Settings</h2>
                <p className="text-xs text-muted-foreground">Manage your account security and authentication</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                {[
                  { label: 'Two-Factor Authentication', desc: 'Enabled via Authenticator App', status: 'Enabled', color: 'text-green-600' },
                  { label: 'SSO Login', desc: 'Microsoft SSO configured for manexa.ai', status: 'Active', color: 'text-green-600' },
                  { label: 'Session Timeout', desc: 'Auto-logout after 8 hours of inactivity', status: '8 hours', color: 'text-foreground' },
                  { label: 'IP Allowlist', desc: 'Login restricted to corporate IP range', status: '2 ranges', color: 'text-foreground' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${item.color}`}>{item.status}</span>
                      <button className="text-xs text-primary hover:underline">Edit</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-red-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-red-700 mb-3">Danger Zone</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Delete Account</div>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                  </div>
                  <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50">Delete</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-0.5">API Keys</h2>
                <p className="text-xs text-muted-foreground">Manage API keys for programmatic access</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 space-y-3">
                {[
                  { name: 'Production Key', key: 'sk-teams-prod-••••••••••••4kX2', created: 'Jan 15, 2026', lastUsed: '2 min ago', status: 'active' },
                  { name: 'Development Key', key: 'sk-teams-dev-••••••••••••9mR7', created: 'Mar 1, 2026', lastUsed: 'Yesterday', status: 'active' },
                ].map(apiKey => (
                  <div key={apiKey.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-foreground">{apiKey.name}</div>
                      <div className="font-mono text-xs text-muted-foreground mt-0.5">{apiKey.key}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Created {apiKey.created} · Last used {apiKey.lastUsed}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">Active</span>
                      <button className="text-xs text-red-600 hover:underline">Revoke</button>
                    </div>
                  </div>
                ))}
                <button className="w-full py-2.5 border-2 border-dashed border-border rounded-lg text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all flex items-center justify-center gap-2">
                  <Key className="w-4 h-4" /> Generate New API Key
                </button>
              </div>
            </div>
          )}

          {activeSection === 'appearance' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-0.5">Appearance</h2>
                <p className="text-xs text-muted-foreground">Customize how Teams looks for you</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light', preview: 'bg-white' },
                      { id: 'dark', label: 'Dark', preview: 'bg-gray-900' },
                      { id: 'system', label: 'System', preview: 'bg-gradient-to-r from-white to-gray-900' },
                    ].map(theme => (
                      <button key={theme.id} className="flex flex-col items-center gap-2 p-3 border-2 border-primary rounded-xl transition-all first:border-primary">
                        <div className={`w-full h-12 rounded-lg ${theme.preview} border border-border`} />
                        <span className="text-xs font-medium text-foreground">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Density</label>
                  <div className="flex gap-2">
                    {['Comfortable', 'Compact', 'Dense'].map(d => (
                      <button key={d} className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${d === 'Comfortable' ? 'border-primary bg-accent text-primary' : 'border-border text-muted-foreground hover:border-primary/40'}`}>{d}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'audit' && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-0.5">Audit Log</h2>
                <p className="text-xs text-muted-foreground">Recent connector and agent actions for your account</p>
              </div>
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm font-semibold">Events</div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => {
                      const data = listAuditEvents();
                      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = 'audit-events.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                    }} className="px-3 py-1.5 border border-border rounded-lg text-sm text-foreground hover:bg-muted">Export JSON</button>
                    <button onClick={() => { localStorage.removeItem('employeeAudit_v1'); window.location.reload(); }} className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm">Clear</button>
                  </div>
                </div>
                <div className="space-y-2 max-h-[320px] overflow-y-auto">
                  {listAuditEvents().map(ev => (
                    <div key={ev.id} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-foreground">{ev.title}</div>
                        <div className="text-xs text-muted-foreground">{new Date(ev.time).toLocaleString()}</div>
                      </div>
                      {ev.meta && <div className="text-xs text-muted-foreground mt-1">{ev.meta}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
