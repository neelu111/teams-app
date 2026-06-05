import React, { useState } from 'react';
import {
  Search, Shield, ShieldOff, ChevronRight, X,
  Lock, RefreshCw, Clock, CheckCircle2, XCircle,
  Smartphone, Globe, MapPin, Activity
} from 'lucide-react';
import { SAScreen, tenants } from '../superAdminData';

const platformUsers = [
  { id:'su-001', name:'Kumar',          initials:'KU', email:'kumar@manexa.ai',                role:'super-admin',    tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'Just now',   color:'#5C5FEF' },
  { id:'su-002', name:'Suresh',         initials:'SU', email:'suresh@manexa.ai',               role:'business-admin', tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'5 min ago',  color:'#8B5CF6' },
  { id:'su-003', name:'Praveena',       initials:'PR', email:'praveena@manexa.ai',             role:'manager',        tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'10 min ago', color:'#0EA5E9' },
  { id:'su-009', name:'Neelu',          initials:'NE', email:'neelu@manexa.ai',                role:'manager',        tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'12 min ago', color:'#10B981' },
  { id:'su-010', name:'Abhi',           initials:'AB', email:'abhi@manexa.ai',                 role:'employee',       tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'1 hr ago',   color:'#F97316' },
  { id:'su-011', name:'Ramesh',         initials:'RA', email:'ramesh@manexa.ai',               role:'employee',       tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'45 min ago', color:'#EC4899' },
  { id:'su-012', name:'Koti',           initials:'KO', email:'koti@manexa.ai',                 role:'employee',       tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:false, lastActive:'50 min ago', color:'#06B6D4' },
  { id:'su-013', name:'Kittu',          initials:'KI', email:'kittu@manexa.ai',                role:'employee',       tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:false, lastActive:'Today',      color:'#8B5CF6' },
  { id:'su-014', name:'Divya',          initials:'DI', email:'divya@manexa.ai',                role:'employee',       tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'Today',      color:'#F59E0B' },
  { id:'su-015', name:'Dhathri',        initials:'DH', email:'dhathri@manexa.ai',              role:'employee',       tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'20 min ago', color:'#EF4444' },
  { id:'su-016', name:'Swapna',         initials:'SW', email:'swapna@manexa.ai',               role:'employee',       tenant:'Manexa AI Labs',   tenantId:'tn-001', status:'active',    mfaEnabled:true,  lastActive:'35 min ago', color:'#14B8A6' },
  { id:'su-004', name:'Priya Sharma',   initials:'PS', email:'priya.s@globaltech.io',          role:'business-admin', tenant:'GlobalTech Inc',   tenantId:'tn-002', status:'active',    mfaEnabled:true,  lastActive:'2 min ago',  color:'#0EA5E9' },
  { id:'su-005', name:'Marcus Webb',    initials:'MW', email:'marcus.w@globaltech.io',         role:'manager',        tenant:'GlobalTech Inc',   tenantId:'tn-002', status:'active',    mfaEnabled:true,  lastActive:'10 min ago', color:'#10B981' },
  { id:'su-006', name:'Yuki Tanaka',    initials:'YT', email:'yuki.t@novastar.finance',        role:'business-admin', tenant:'MarketingStar Finance', tenantId:'tn-003', status:'active',    mfaEnabled:true,  lastActive:'5 min ago',  color:'#F59E0B' },
  { id:'su-007', name:'Elena Rossi',    initials:'ER', email:'elena.r@meridianhealth.org',     role:'business-admin', tenant:'Meridian Health',  tenantId:'tn-004', status:'active',    mfaEnabled:true,  lastActive:'1 min ago',  color:'#10B981' },
  { id:'su-008', name:'Tom Bradley',    initials:'TB', email:'tom.b@frontierlabs.dev',         role:'business-admin', tenant:'Frontier Labs',    tenantId:'tn-011', status:'suspended', mfaEnabled:false, lastActive:'Jun 1',      color:'#EF4444' },
];

const activityItems = [
  { id: 1, action: 'Logged in', time: '12:14 PM', detail: 'Via Google SSO from Chrome/Mac' },
  { id: 2, action: 'Ran workflow', time: '11:52 AM', detail: 'Lead Qualification — 14 contacts processed' },
  { id: 3, action: 'Asked Command', time: '11:30 AM', detail: '"Summarise Q2 pipeline report"' },
  { id: 4, action: 'Approval action', time: '10:48 AM', detail: 'Approved invoice INV-2847 ($4,200)' },
  { id: 5, action: 'Logged in', time: 'Jun 2, 9:05 AM', detail: 'Via Google SSO from Safari/iPhone' },
];

const roleBadge = (role: string) => {
  const map: Record<string, string> = {
    'super-admin': 'bg-indigo-100 text-indigo-700',
    'business-admin': 'bg-purple-100 text-purple-700',
    'manager': 'bg-sky-100 text-sky-700',
    'employee': 'bg-green-100 text-green-700',
  };
  const label: Record<string, string> = {
    'super-admin': 'Super Admin',
    'business-admin': 'Biz Admin',
    'manager': 'Business Manager',
    'employee': 'Employee',
  };
  return { cls: map[role] ?? 'bg-muted text-muted-foreground', label: label[role] ?? role };
};

export function SAUsersScreen({ onNavigate }: { onNavigate: (screen: SAScreen, id?: string) => void }) {
  const [selectedUserId, setSelectedUserId] = useState<string | null>('su-001');
  const [search, setSearch] = useState('');
  const [tenantFilter, setTenantFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'activity'>('profile');
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set(['su-008']));
  const [mfaIds, setMfaIds] = useState<Set<string>>(new Set(platformUsers.filter(u => u.mfaEnabled).map(u => u.id)));

  const filtered = platformUsers.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchTenant = tenantFilter === 'all' || u.tenant === tenantFilter;
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchTenant && matchRole && matchStatus;
  });

  const selectedUser = platformUsers.find(u => u.id === selectedUserId) ?? null;
  const isSuspended = (id: string) => suspendedIds.has(id);

  const toggleSuspend = (id: string) => {
    setSuspendedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const tabs = ['profile', 'security', 'activity'] as const;

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* LEFT LIST */}
      <div className="w-[360px] flex-shrink-0 border-r border-border flex flex-col bg-white">
        {/* Filters */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={tenantFilter}
              onChange={e => setTenantFilter(e.target.value)}
              className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none"
            >
              <option value="all">All Tenants</option>
              {tenants.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="flex-1 text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="super-admin">Super Admin</option>
              <option value="business-admin">Biz Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs border border-border rounded-lg px-2 py-1.5 bg-background focus:outline-none"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">847</span> total users across 12 tenants · <span className="font-medium text-foreground">691</span> active
          </p>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(user => {
            const { cls, label } = roleBadge(user.role);
            const suspended = isSuspended(user.id);
            const hasMfa = mfaIds.has(user.id);
            return (
              <button
                key={user.id}
                onClick={() => { setSelectedUserId(user.id); setActiveTab('profile'); }}
                className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted/40 transition-colors border-b border-border/50 ${selectedUserId === user.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
              >
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: user.color }}
                >
                  {user.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                    {/* Status dot */}
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${suspended ? 'bg-red-500' : 'bg-green-500'}`} />
                    {/* MFA */}
                    {hasMfa
                      ? <Shield className="w-3 h-3 text-green-500 flex-shrink-0" />
                      : <ShieldOff className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    }
                  </div>
                  <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{user.tenant}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">{user.lastActive}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            );
          })}
          {filtered.length > 0 && (
            <p className="text-xs text-muted-foreground text-center py-4 px-4">
              …and 839 more users across all tenants
            </p>
          )}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-10">No users match filters</p>
          )}
        </div>
      </div>

      {/* RIGHT PANEL */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Panel header */}
          <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ backgroundColor: selectedUser.color }}
              >
                {selectedUser.initials}
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">{selectedUser.name}</h2>
                <p className="text-xs text-muted-foreground">{selectedUser.email}</p>
              </div>
            </div>
            <button onClick={() => setSelectedUserId(null)} className="p-2 hover:bg-muted rounded-lg transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-border px-6">
            <div className="flex gap-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {activeTab === 'profile' && (
              <>
                {/* Info card */}
                <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Profile Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Full Name', value: selectedUser.name },
                      { label: 'Email', value: selectedUser.email },
                      { label: 'Role', value: (() => { const { cls, label } = roleBadge(selectedUser.role); return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span>; })() },
                      { label: 'Tenant', value: (
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedUser.color }} />
                          <span className="text-sm text-foreground">{selectedUser.tenant}</span>
                        </span>
                      )},
                      { label: 'Status', value: (
                        <span className={`flex items-center gap-1.5 text-sm ${isSuspended(selectedUser.id) ? 'text-red-600' : 'text-green-600'}`}>
                          {isSuspended(selectedUser.id) ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                          {isSuspended(selectedUser.id) ? 'Suspended' : 'Active'}
                        </span>
                      )},
                      { label: 'Last Active', value: selectedUser.lastActive },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-xs text-muted-foreground mb-1">{label}</p>
                        {typeof value === 'string' ? <p className="text-sm text-foreground">{value}</p> : value}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Actions */}
                <div className="bg-white border border-border rounded-2xl p-5 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Actions</h3>
                  <div className="flex gap-3 flex-wrap">
                    <button
                      onClick={() => toggleSuspend(selectedUser.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        isSuspended(selectedUser.id)
                          ? 'border-green-500 text-green-600 hover:bg-green-50'
                          : 'border-red-400 text-red-600 hover:bg-red-50'
                      }`}
                    >
                      {isSuspended(selectedUser.id) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {isSuspended(selectedUser.id) ? 'Unsuspend Account' : 'Suspend Account'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors">
                      <RefreshCw className="w-4 h-4" />
                      Force Password Reset
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">MFA &amp; Authentication</h3>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Multi-Factor Authentication</p>
                      <p className="text-xs text-muted-foreground">TOTP / Authenticator App</p>
                    </div>
                    <button
                      onClick={() => {
                        setMfaIds(prev => {
                          const next = new Set(prev);
                          if (next.has(selectedUser.id)) next.delete(selectedUser.id); else next.add(selectedUser.id);
                          return next;
                        });
                      }}
                      className={`relative w-11 h-6 rounded-full transition-colors ${mfaIds.has(selectedUser.id) ? 'bg-primary' : 'bg-muted'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${mfaIds.has(selectedUser.id) ? 'left-5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-border">
                    <div>
                      <p className="text-sm font-medium text-foreground">Login Method</p>
                      <p className="text-xs text-muted-foreground">Google SSO (OIDC)</p>
                    </div>
                    <Globe className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Recent Login IPs</p>
                    {[
                      { ip: '192.168.1.45', location: 'San Francisco, CA', time: 'Today 12:14 PM' },
                      { ip: '10.0.0.12', location: 'San Francisco, CA', time: 'Jun 2, 9:05 AM' },
                    ].map(item => (
                      <div key={item.ip} className="flex items-center gap-3 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="font-mono text-foreground">{item.ip}</span>
                        <span>{item.location}</span>
                        <span className="ml-auto">{item.time}</span>
                      </div>
                    ))}
                  </div>
                  {!mfaIds.has(selectedUser.id) && (
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                      <Smartphone className="w-4 h-4" />
                      Force MFA Enrollment
                    </button>
                  )}
                </div>
              </>
            )}

            {activeTab === 'activity' && (
              <div className="bg-white border border-border rounded-2xl p-5 space-y-1">
                <h3 className="text-sm font-semibold text-foreground mb-3">Recent Activity</h3>
                {activityItems.map((item, i) => (
                  <div key={item.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Activity className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Select a user</p>
            <p className="text-xs text-muted-foreground">Choose a user from the list to view details</p>
          </div>
        </div>
      )}
    </div>
  );
}
