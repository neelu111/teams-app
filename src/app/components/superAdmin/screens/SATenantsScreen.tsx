import React, { useState, useMemo } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { SAScreen, tenants, Tenant, TenantStatus, TenantPlan, planLimits } from '../superAdminData';

interface SATenantsScreenProps {
  onNavigate: (screen: SAScreen, id?: string) => void;
}

type TabKey = 'overview' | 'agents' | 'billing' | 'settings';

function planBadgeClass(plan: TenantPlan) {
  switch (plan) {
    case 'enterprise-plus': return 'bg-indigo-100 text-indigo-700';
    case 'enterprise':      return 'bg-sky-100 text-sky-700';
    case 'business':        return 'bg-green-100 text-green-700';
    case 'starter':         return 'bg-gray-100 text-gray-600';
    default:                return 'bg-gray-100 text-gray-600';
  }
}

function planBadgeLabel(plan: TenantPlan) {
  switch (plan) {
    case 'enterprise-plus': return 'Ent+';
    case 'enterprise':      return 'Enterprise';
    case 'business':        return 'Business';
    case 'starter':         return 'Starter';
    default:                return plan;
  }
}

function statusDotClass(status: TenantStatus) {
  switch (status) {
    case 'active':    return 'bg-green-500';
    case 'trial':     return 'bg-amber-500 animate-pulse';
    case 'suspended': return 'bg-red-500';
    case 'churned':   return 'bg-gray-400';
    case 'pending':   return 'bg-blue-400 animate-pulse';
    default:          return 'bg-gray-400';
  }
}

function uptimeColor(uptime: number) {
  if (uptime >= 99.9) return '#10B981';
  if (uptime >= 99)   return '#F59E0B';
  return '#EF4444';
}

function mfaColor(mfa: number) {
  if (mfa >= 90) return '#10B981';
  if (mfa >= 70) return '#F59E0B';
  return '#EF4444';
}

export function SATenantsScreen({ onNavigate }: SATenantsScreenProps) {
  const [search, setSearch]               = useState('');
  const [planFilter, setPlanFilter]       = useState<TenantPlan | 'all'>('all');
  const [statusFilter, setStatusFilter]   = useState<TenantStatus | 'all'>('all');
  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [activeTab, setActiveTab]         = useState<TabKey>('overview');

  // Settings state for selected tenant
  const [editName, setEditName]           = useState('');
  const [editRegion, setEditRegion]       = useState('');
  const [editRetention, setEditRetention] = useState('90');

  const filtered = useMemo(() => {
    return tenants.filter(t => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.domain.toLowerCase().includes(search.toLowerCase());
      const matchPlan   = planFilter === 'all'   || t.plan   === planFilter;
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      return matchSearch && matchPlan && matchStatus;
    });
  }, [search, planFilter, statusFilter]);

  const selected = selectedId ? tenants.find(t => t.id === selectedId) ?? null : null;

  const handleSelect = (t: Tenant) => {
    setSelectedId(t.id);
    setActiveTab('overview');
    setEditName(t.name);
    setEditRegion(t.region);
    setEditRetention('90');
  };

  const planInfo = selected
    ? planLimits.find(p => p.plan === selected.plan) ?? planLimits[0]
    : null;

  const counts = {
    active:    tenants.filter(t => t.status === 'active').length,
    trial:     tenants.filter(t => t.status === 'trial').length,
    suspended: tenants.filter(t => t.status === 'suspended').length,
    churned:   tenants.filter(t => t.status === 'churned').length,
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'agents',   label: 'Agents' },
    { key: 'billing',  label: 'Billing' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="h-full flex overflow-hidden bg-background">

      {/* LEFT PANEL */}
      <div
        className="flex flex-col border-r border-border bg-white flex-shrink-0 overflow-hidden transition-all"
        style={{ width: selected ? '44%' : '100%' }}
      >
        {/* Search + filters + New */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tenants…"
                className="w-full pl-8 pr-3 h-8 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            {/* Plan filter */}
            {/* using <select> instead of a kit Dropdown — no kit present */}
            <select
              value={planFilter}
              onChange={e => setPlanFilter(e.target.value as TenantPlan | 'all')}
              className="h-8 px-2 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All plans</option>
              <option value="enterprise-plus">Enterprise+</option>
              <option value="enterprise">Enterprise</option>
              <option value="business">Business</option>
              <option value="starter">Starter</option>
            </select>
            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as TenantStatus | 'all')}
              className="h-8 px-2 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="suspended">Suspended</option>
              <option value="churned">Churned</option>
            </select>
            {/* New tenant */}
            <button className="h-8 px-3 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition flex items-center gap-1.5 flex-shrink-0">
              <Plus className="w-3.5 h-3.5" />
              New Tenant
            </button>
          </div>

          {/* Summary row */}
          <p className="text-xs text-muted-foreground">
            {tenants.length} tenants ·{' '}
            <span className="text-green-600 font-medium">{counts.active} active</span> ·{' '}
            <span className="text-amber-600 font-medium">{counts.trial} trial</span> ·{' '}
            <span className="text-red-600 font-medium">{counts.suspended} suspended</span> ·{' '}
            <span className="text-gray-500 font-medium">{counts.churned} churned</span>
          </p>
        </div>

        {/* Tenant list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(t => {
            const isSelected = t.id === selectedId;
            return (
              <div
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer transition-colors
                  ${isSelected ? 'bg-indigo-50 border-l-2 border-l-primary' : 'hover:bg-muted/30'}`}
              >
                {/* Logo circle */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: t.primaryColor + '22' }}
                >
                  {t.logo}
                </div>

                {/* Name + domain */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground truncate">{t.name}</span>
                    {/* Plan badge */}
                    <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${planBadgeClass(t.plan)}`}>
                      {planBadgeLabel(t.plan)}
                    </span>
                    {/* Status dot */}
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDotClass(t.status)}`} />
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{t.domain}</p>
                  {/* Sub row */}
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                    <span>{t.users} users · {t.activeAgents} agents</span>
                    <span className="ml-auto font-medium text-foreground">
                      {t.mrr > 0 ? `$${t.mrr.toLocaleString()}` : t.status === 'trial' ? 'Trial' : 'Churned'}
                    </span>
                    <span>{t.lastActive}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Search className="w-8 h-8 mb-3 opacity-40" />
              <p className="text-sm">No tenants match your filters</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT DETAIL PANEL */}
      {selected && planInfo && (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Panel header */}
          <div className="flex items-center justify-between px-5 py-3 bg-white border-b border-border flex-shrink-0">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                style={{ background: selected.primaryColor + '22' }}
              >
                {selected.logo}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.name}</p>
                <p className="text-xs text-muted-foreground">{selected.domain}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedId(null)}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-white px-5 flex-shrink-0">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-2.5 px-4 text-xs font-medium border-b-2 transition-colors -mb-px
                  ${activeTab === tab.key
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* ---- OVERVIEW TAB ---- */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Suspended banner */}
                {selected.status === 'suspended' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                    This tenant is suspended. All operations paused.
                  </div>
                )}

                {/* Hero */}
                <div className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ background: selected.primaryColor + '22' }}
                    >
                      {selected.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-semibold text-foreground">{selected.name}</h2>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${planBadgeClass(selected.plan)}`}>
                          {planBadgeLabel(selected.plan)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize
                          ${selected.status === 'active'    ? 'bg-green-100 text-green-700'
                          : selected.status === 'trial'     ? 'bg-amber-100 text-amber-700'
                          : selected.status === 'suspended' ? 'bg-red-100 text-red-700'
                          :                                   'bg-gray-100 text-gray-600'}`}
                        >
                          {selected.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{selected.domain}</p>
                    </div>
                  </div>

                  {/* 4 mini stat cards */}
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: 'Users',           value: selected.users },
                      { label: 'Agents Active',   value: selected.activeAgents },
                      { label: 'Workflows Today', value: selected.workflowsToday },
                      { label: 'API Calls MTD',   value: selected.apiCallsMTD > 0 ? `${(selected.apiCallsMTD / 1000).toFixed(0)}K` : '0' },
                    ].map(s => (
                      <div key={s.label} className="p-3 bg-muted/40 rounded-xl text-center">
                        <p className="text-sm font-bold text-foreground">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Uptime bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">Uptime</span>
                      <span className="text-xs font-semibold" style={{ color: uptimeColor(selected.uptime) }}>
                        {selected.uptime > 0 ? `${selected.uptime}%` : '—'}
                      </span>
                    </div>
                    <ProgressBar pct={selected.uptime} color={uptimeColor(selected.uptime)} />
                  </div>

                  {/* MFA bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">MFA Coverage</span>
                      <span className="text-xs font-semibold" style={{ color: mfaColor(selected.mfaCoverage) }}>
                        {selected.mfaCoverage}%
                      </span>
                    </div>
                    <ProgressBar pct={selected.mfaCoverage} color={mfaColor(selected.mfaCoverage)} />
                  </div>

                  {/* Meta rows */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs mb-4">
                    {[
                      { label: 'Admin Email', value: selected.adminEmail },
                      { label: 'Region',      value: selected.region },
                      { label: 'Joined',      value: selected.joinedDate },
                      { label: 'Last Active', value: selected.lastActive },
                    ].map(row => (
                      <div key={row.label}>
                        <p className="text-muted-foreground">{row.label}</p>
                        <p className="text-foreground font-medium">{row.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
                      Upgrade Plan
                    </button>
                    {selected.status === 'suspended' ? (
                      <button className="px-3 py-1.5 text-xs font-semibold border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition">
                        Unsuspend
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 text-xs font-semibold border border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition">
                        Suspend
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ---- AGENTS TAB ---- */}
            {activeTab === 'agents' && (
              <div className="space-y-4">
                <div className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-foreground">Agent Configuration</h2>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{selected.agents} agents · {selected.activeAgents} active</span>
                    </div>
                  </div>

                  {/* Command — always present */}
                  <div className="p-3 border border-border rounded-xl mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                        A
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Command</p>
                        <p className="text-xs text-muted-foreground">Super Agent · Orchestrator</p>
                      </div>
                      <span className="ml-auto px-1.5 py-0.5 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                        {selected.status === 'suspended' ? 'Paused' : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Specialist agents based on plan tier */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { name: 'Marketing',  role: 'Research & Outreach', color: 'bg-sky-100',    text: 'text-sky-700',    initial: 'N' },
                      { name: 'Sales',  role: 'Communication',       color: 'bg-purple-100', text: 'text-purple-700', initial: 'A' },
                      { name: 'Bolt',  role: 'Task Automation',     color: 'bg-amber-100',  text: 'text-amber-700',  initial: 'B' },
                      ...(selected.plan === 'enterprise' || selected.plan === 'enterprise-plus'
                        ? [
                            { name: 'Rex',   role: 'Data & Reporting',    color: 'bg-green-100',  text: 'text-green-700',  initial: 'R' },
                            { name: 'Sage',  role: 'Knowledge & Docs',    color: 'bg-rose-100',   text: 'text-rose-700',   initial: 'S' },
                          ]
                        : []),
                      ...(selected.plan === 'enterprise-plus'
                        ? [
                            { name: 'Echo',  role: 'Custom Integration',  color: 'bg-teal-100',   text: 'text-teal-700',   initial: 'E' },
                          ]
                        : []),
                    ].map(agent => (
                      <div key={agent.name} className="p-3 border border-border rounded-xl">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${agent.color} flex items-center justify-center text-xs font-bold ${agent.text}`}>
                            {agent.initial}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">{agent.name}</p>
                            <p className="text-xs text-muted-foreground">{agent.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-xs text-muted-foreground italic">
                    Agent configuration managed by tenant's Business Admin.
                  </p>
                </div>
              </div>
            )}

            {/* ---- BILLING TAB ---- */}
            {activeTab === 'billing' && (
              <div className="space-y-4">
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Billing Details</h2>

                  {/* Current plan */}
                  <div className="flex items-center justify-between mb-4 p-3 bg-muted/40 rounded-xl">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Plan</p>
                      <p className="text-sm font-semibold text-foreground">{planInfo.label}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Monthly Price</p>
                      <p className="text-sm font-bold text-foreground">${planInfo.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Renewal */}
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className="text-muted-foreground">Next renewal</span>
                    <span className="text-foreground font-medium">July 2, 2026</span>
                  </div>

                  {/* Usage bars */}
                  <div className="space-y-3 mb-5">
                    {[
                      {
                        label: 'Users',
                        used: selected.users,
                        limit: planInfo.users,
                      },
                      {
                        label: 'Agents',
                        used: selected.agents,
                        limit: planInfo.agents,
                      },
                      {
                        label: 'API Calls MTD',
                        used: selected.apiCallsMTD,
                        limit: planInfo.apiCallsMTD,
                        format: (v: number) => v > 0 ? `${(v / 1000).toFixed(0)}K` : '0',
                      },
                    ].map(row => {
                      const unlimited = row.limit === -1;
                      const pct = unlimited ? 0 : (row.used / row.limit) * 100;
                      const fmt = row.format ?? ((v: number) => String(v));
                      return (
                        <div key={row.label}>
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span className="text-muted-foreground">{row.label}</span>
                            <span className="text-foreground font-medium">
                              {fmt(row.used)} / {unlimited ? '∞' : fmt(row.limit)}
                              {!unlimited && (
                                <span className="text-muted-foreground ml-1">({pct.toFixed(0)}%)</span>
                              )}
                            </span>
                          </div>
                          <ProgressBar
                            pct={unlimited ? 0 : pct}
                            color={pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : '#5C5FEF'}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Payment status */}
                  <div className="flex items-center justify-between mb-4 text-xs">
                    <span className="text-muted-foreground">Payment Status</span>
                    <span className={`font-semibold ${selected.status === 'suspended' ? 'text-red-600' : 'text-green-600'}`}>
                      {selected.status === 'suspended' ? 'Failed' : 'Active'}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
                      Change Plan
                    </button>
                    <button className="px-3 py-1.5 text-xs font-semibold border border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---- SETTINGS TAB ---- */}
            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div className="bg-white border border-border rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-foreground mb-4">Tenant Settings</h2>

                  <div className="space-y-4">
                    {/* Tenant name */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Tenant Name</label>
                      <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        className="w-full h-8 px-3 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Domain (readonly) */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Domain</label>
                      <input
                        value={selected.domain}
                        readOnly
                        className="w-full h-8 px-3 text-xs bg-muted/60 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                      />
                    </div>

                    {/* Region */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Region</label>
                      <select
                        value={editRegion}
                        onChange={e => setEditRegion(e.target.value)}
                        className="w-full h-8 px-2 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="US-East">US-East</option>
                        <option value="US-West">US-West</option>
                        <option value="US-Central">US-Central</option>
                        <option value="EU-West">EU-West</option>
                        <option value="AP-South">AP-South</option>
                      </select>
                    </div>

                    {/* Primary color */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Brand Color</label>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full border border-border flex-shrink-0"
                          style={{ background: selected.primaryColor }}
                        />
                        <input
                          type="color"
                          defaultValue={selected.primaryColor}
                          className="w-full h-8 cursor-pointer rounded-lg border border-border"
                        />
                      </div>
                    </div>

                    {/* Data retention */}
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">Data Retention</label>
                      <select
                        value={editRetention}
                        onChange={e => setEditRetention(e.target.value)}
                        className="w-full h-8 px-2 text-xs bg-muted/40 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                        <option value="180">180 days</option>
                        <option value="365">1 year</option>
                      </select>
                    </div>

                    {/* Save */}
                    <button className="w-full py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition">
                      Save Changes
                    </button>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-white border border-red-200 rounded-2xl p-5">
                  <h2 className="text-sm font-semibold text-red-700 mb-3">Danger Zone</h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    These actions are irreversible. Proceed with caution.
                  </p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-xs font-semibold border border-red-400 text-red-600 rounded-lg hover:bg-red-50 transition">
                      Suspend Tenant
                    </button>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                      Delete Tenant
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${Math.min(pct, 100)}%`, background: color }}
      />
    </div>
  );
}
