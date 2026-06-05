import React, { useState } from 'react';
import { Search, UserPlus, Shield, X, ChevronRight, Lock, Eye, EyeOff, MoreHorizontal, AlertCircle } from 'lucide-react';
import { BAScreen, baUsers, BAUser, UserRole, UserStatus } from '../businessAdminData';

interface BAUsersScreenProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

const roleColors: Record<UserRole, { bg: string; text: string; border: string }> = {
  'super-admin':    { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  'business-admin': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  'manager':        { bg: 'bg-sky-100',    text: 'text-sky-700',    border: 'border-sky-200' },
  'employee':       { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200' },
};

const roleLabels: Record<UserRole, string> = {
  'super-admin': 'Super Admin', 'business-admin': 'Business Admin', 'manager': 'Business Manager', 'employee': 'Employee',
};

const statusConfig: Record<UserStatus, { bg: string; text: string; label: string }> = {
  active:    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Active' },
  invited:   { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Invited' },
  suspended: { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Suspended' },
  inactive:  { bg: 'bg-gray-100',   text: 'text-gray-700',   label: 'Inactive' },
};

const allAgents = ['Command', 'Sales', 'HR', 'Finance', 'DevOps', 'Support', 'Marketing'];

const agentColors: Record<string, string> = {
  Command: '#5C5FEF', Sales: '#0EA5E9', HR: '#10B981',
  Finance: '#F59E0B', DevOps: '#8B5CF6', Support: '#EC4899', Marketing: '#06B6D4',
};

const mockActivity = [
  { action: 'Logged in via SSO', time: 'Today 12:05 PM' },
  { action: 'Ran workflow: Pipeline Review', time: 'Today 11:30 AM' },
  { action: 'Asked Command: Q3 deal forecast', time: 'Today 10:45 AM' },
  { action: 'Workflow approved by manager', time: 'Today 9:30 AM' },
  { action: 'Sales generated proposal', time: 'Today 9:15 AM' },
  { action: 'Logged in via SSO', time: 'Yesterday 8:55 AM' },
  { action: 'Updated CRM contact: InnovateCo', time: 'Yesterday 3:20 PM' },
  { action: 'Password reset requested', time: 'May 30, 2026' },
];

export function BAUsersScreen({ onNavigate }: BAUsersScreenProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'access' | 'activity' | 'security'>('profile');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [users, setUsers] = useState(baUsers);

  // Invite modal state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('employee');
  const [inviteDept, setInviteDept] = useState('');

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const selectedUser = users.find(u => u.id === selectedUserId);

  const toggleSuspend = (userId: string) => {
    setUsers(prev => prev.map(u => u.id === userId
      ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' as UserStatus }
      : u
    ));
  };

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'profile', label: 'Profile' },
    { key: 'access', label: 'Access' },
    { key: 'activity', label: 'Activity' },
    { key: 'security', label: 'Security' },
  ];

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Left panel */}
      <div className={`flex flex-col overflow-hidden border-r border-border bg-white transition-all ${selectedUser ? 'w-[44%]' : 'flex-1'}`}>
        {/* Top bar */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 focus:outline-none bg-white"
            >
              <option value="all">All Roles</option>
              <option value="super-admin">Super Admin</option>
              <option value="business-admin">Business Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <button
              onClick={() => setShowInviteModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4" />
              Invite User
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {users.filter(u => u.status === 'active').length} active ·{' '}
            {users.filter(u => u.status === 'invited').length} invited ·{' '}
            {users.filter(u => u.status === 'suspended').length} suspended ·{' '}
            {users.length} total
          </p>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(user => {
            const rc = roleColors[user.role];
            const sc = statusConfig[user.status];
            const isSelected = selectedUserId === user.id;
            return (
              <div
                key={user.id}
                onClick={() => { setSelectedUserId(user.id); setActiveTab('profile'); }}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer hover:bg-muted/30 transition-colors ${isSelected ? 'bg-indigo-50 border-l-2 border-l-primary' : ''}`}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ background: user.color }}>
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    {!user.mfaEnabled && <AlertCircle className="w-3 h-3 text-amber-500" title="MFA not enabled" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.jobTitle} · {user.department}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.bg} ${rc.text}`}>
                    {roleLabels[user.role]}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
                    {sc.label}
                  </span>
                </div>
                {selectedUser && <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right detail panel */}
      {selectedUser && (
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* User hero */}
          <div className="px-6 pt-5 pb-0 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: selectedUser.color }}>
                  {selectedUser.initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-foreground">{selectedUser.name}</h2>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[selectedUser.status].bg} ${statusConfig[selectedUser.status].text}`}>
                      {statusConfig[selectedUser.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedUser.jobTitle}</p>
                  <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedUserId(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex gap-1">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'profile' && (
              <div className="space-y-5 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Department</label>
                    <input defaultValue={selectedUser.department} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">Job Title</label>
                    <input defaultValue={selectedUser.jobTitle} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Role</label>
                  <select defaultValue={selectedUser.role} className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
                    <option value="super-admin">Super Admin</option>
                    <option value="business-admin">Business Admin</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Agent Access</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.agentAccess.map(a => (
                      <span key={a} className="px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ background: agentColors[a] || '#94A3B8' }}>
                        {a}
                      </span>
                    ))}
                    {selectedUser.agentAccess.length === 0 && <span className="text-xs text-muted-foreground">No agent access</span>}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>Joined: {selectedUser.joinedDate}</span>
                  <span>Last active: {selectedUser.lastActive}</span>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Save Changes</button>
                  {selectedUser.status === 'invited' && (
                    <button className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">Resend Invite</button>
                  )}
                  <button
                    onClick={() => toggleSuspend(selectedUser.id)}
                    className={`px-4 py-2 border rounded-lg text-sm font-medium ${selectedUser.status === 'suspended' ? 'border-green-300 text-green-700 hover:bg-green-50' : 'border-red-300 text-red-700 hover:bg-red-50'}`}
                  >
                    {selectedUser.status === 'suspended' ? 'Unsuspend' : 'Suspend'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'access' && (
              <div className="space-y-5 max-w-lg">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Agent Access</h3>
                  <div className="space-y-2">
                    {allAgents.map(agent => {
                      const hasAccess = selectedUser.agentAccess.includes(agent) || selectedUser.agentAccess.includes('All Agents');
                      return (
                        <div key={agent} className="flex items-center justify-between py-2 border-b border-border">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ background: agentColors[agent] }} />
                            <span className="text-sm text-foreground">{agent}</span>
                          </div>
                          <button
                            className={`relative w-10 h-5 rounded-full transition-colors ${hasAccess ? 'bg-primary' : 'bg-muted'}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${hasAccess ? 'left-5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-3">Role Permissions — {roleLabels[selectedUser.role]}</h3>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Agent Configuration', value: selectedUser.role === 'business-admin' || selectedUser.role === 'super-admin' ? 'Full' : 'None' },
                      { label: 'User Management', value: selectedUser.role === 'super-admin' || selectedUser.role === 'business-admin' ? 'Full' : selectedUser.role === 'manager' ? 'Read' : 'None' },
                      { label: 'Workflow Creation', value: 'Full' },
                      { label: 'Reports', value: selectedUser.role === 'employee' ? 'None' : 'Read' },
                      { label: 'Audit Logs', value: selectedUser.role === 'employee' ? 'None' : 'Read' },
                      { label: 'Approval Override', value: selectedUser.role === 'employee' ? 'None' : 'Full' },
                    ].map(p => (
                      <div key={p.label} className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-muted-foreground">{p.label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.value === 'Full' ? 'bg-green-100 text-green-700' : p.value === 'Read' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-2 max-w-lg">
                <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
                {mockActivity.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span className="text-sm text-foreground flex-1">{item.action}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{item.time}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5 max-w-lg">
                <div className="p-4 border border-border rounded-xl space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Multi-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-foreground">{selectedUser.mfaEnabled ? 'MFA Enabled' : 'MFA Disabled'}</p>
                      <p className="text-xs text-muted-foreground">{selectedUser.mfaEnabled ? 'Authenticator app' : 'Not configured — user is at risk'}</p>
                    </div>
                    <button className={`relative w-10 h-5 rounded-full transition-colors ${selectedUser.mfaEnabled ? 'bg-primary' : 'bg-muted'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${selectedUser.mfaEnabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {!selectedUser.mfaEnabled && (
                    <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <p className="text-xs text-amber-700">MFA not configured. Consider enforcing for this user.</p>
                    </div>
                  )}
                </div>
                <div className="p-4 border border-border rounded-xl space-y-2">
                  <h3 className="text-sm font-semibold text-foreground">Login Method</h3>
                  <p className="text-sm text-muted-foreground">Google SSO</p>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Last login: {selectedUser.lastActive}</p>
                    <p>Recent IPs: 10.0.1.14, 192.168.1.45</p>
                  </div>
                </div>
                {selectedUser.status === 'suspended' && (
                  <div className="p-4 border border-red-200 bg-red-50 rounded-xl space-y-2">
                    <h3 className="text-sm font-semibold text-red-700">Account Suspended</h3>
                    <p className="text-xs text-red-600">Suspended on June 2, 2026 — 5 failed login attempts with MFA bypass attempt detected.</p>
                    <button onClick={() => toggleSuspend(selectedUser.id)} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
                      Unsuspend Account
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">Reset Password</button>
                  <button className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50">Remove User</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Invite User</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-1.5 rounded-lg hover:bg-muted">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Email Address</label>
                <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="name@manexa.ai"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Role</label>
                <select value={inviteRole} onChange={e => setInviteRole(e.target.value as UserRole)}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="business-admin">Business Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">Department</label>
                <input value={inviteDept} onChange={e => setInviteDept(e.target.value)} placeholder="e.g. Sales"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-2">Agent Access</label>
                <div className="grid grid-cols-3 gap-2">
                  {allAgents.map(agent => (
                    <label key={agent} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-xs text-foreground">{agent}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">Cancel</button>
                <button onClick={() => setShowInviteModal(false)} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Send Invite</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
