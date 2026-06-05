import { useState } from 'react';
import {
  Search, X, Shield, Lock, Activity, ChevronRight,
  Settings, Zap, Bot, AlertTriangle
} from 'lucide-react';
import { SAScreen, platformMetrics } from '../superAdminData';

type AgentType = 'all' | 'super' | 'sales' | 'hr' | 'finance' | 'support' | 'research';

const allAgents = [
  // Manexa AI Labs
  { id: 'a-001', name: 'Command',     type: 'super',    tenant: 'Manexa AI Labs',   tenantColor: '#5C5FEF', emoji: '⚡', color: '#5C5FEF', status: 'active',  model: 'claude-opus-4-7',           successRate: 97.3, workflows: 1847,  avgResponse: '1.2s', rateLimit: 500 },
  { id: 'a-002', name: 'Sales',      type: 'sales',    tenant: 'Manexa AI Labs',   tenantColor: '#5C5FEF', emoji: '📈', color: '#0EA5E9', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 94.1, workflows: 421,   avgResponse: '2.3s', rateLimit: 200 },
  { id: 'a-003', name: 'HR',       type: 'hr',       tenant: 'Manexa AI Labs',   tenantColor: '#5C5FEF', emoji: '👥', color: '#10B981', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 98.7, workflows: 312,   avgResponse: '1.8s', rateLimit: 150 },
  { id: 'a-004', name: 'Finance',     type: 'finance',  tenant: 'Manexa AI Labs',   tenantColor: '#5C5FEF', emoji: '💳', color: '#F59E0B', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 99.1, workflows: 289,   avgResponse: '1.5s', rateLimit: 100 },
  { id: 'a-005', name: 'Support',       type: 'support',  tenant: 'Manexa AI Labs',   tenantColor: '#5C5FEF', emoji: '🎯', color: '#EC4899', status: 'active',  model: 'claude-haiku-4-5-20251001', successRate: 91.2, workflows: 634,   avgResponse: '0.8s', rateLimit: 300 },
  { id: 'a-006', name: 'Marketing',      type: 'research', tenant: 'Manexa AI Labs',   tenantColor: '#5C5FEF', emoji: '🔬', color: '#06B6D4', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 96.8, workflows: 156,   avgResponse: '4.2s', rateLimit: 50 },
  // GlobalTech Inc
  { id: 'a-007', name: 'Command-GT',  type: 'super',    tenant: 'GlobalTech Inc',   tenantColor: '#0EA5E9', emoji: '⚡', color: '#5C5FEF', status: 'active',  model: 'claude-opus-4-7',           successRate: 96.8, workflows: 4820,  avgResponse: '1.3s', rateLimit: 1000 },
  { id: 'a-008', name: 'Sales-GT',   type: 'sales',    tenant: 'GlobalTech Inc',   tenantColor: '#0EA5E9', emoji: '📈', color: '#0EA5E9', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 93.4, workflows: 1240,  avgResponse: '2.1s', rateLimit: 400 },
  { id: 'a-009', name: 'HR-GT',    type: 'hr',       tenant: 'GlobalTech Inc',   tenantColor: '#0EA5E9', emoji: '👥', color: '#10B981', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 97.9, workflows: 890,   avgResponse: '1.9s', rateLimit: 300 },
  { id: 'a-010', name: 'Finance-GT',  type: 'finance',  tenant: 'GlobalTech Inc',   tenantColor: '#0EA5E9', emoji: '💳', color: '#F59E0B', status: 'paused',  model: 'claude-sonnet-4-6',         successRate: 94.2, workflows: 710,   avgResponse: '1.6s', rateLimit: 200 },
  // Meridian Health
  { id: 'a-011', name: 'Command-MH',  type: 'super',    tenant: 'Meridian Health',  tenantColor: '#10B981', emoji: '⚡', color: '#5C5FEF', status: 'active',  model: 'claude-opus-4-7',           successRate: 98.1, workflows: 8420,  avgResponse: '1.1s', rateLimit: 2000 },
  { id: 'a-012', name: 'Sales-MH',   type: 'sales',    tenant: 'Meridian Health',  tenantColor: '#10B981', emoji: '📈', color: '#0EA5E9', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 95.3, workflows: 2140,  avgResponse: '2.2s', rateLimit: 500 },
  { id: 'a-013', name: 'HR-MH',    type: 'hr',       tenant: 'Meridian Health',  tenantColor: '#10B981', emoji: '👥', color: '#10B981', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 99.2, workflows: 3890,  avgResponse: '1.7s', rateLimit: 500 },
  { id: 'a-014', name: 'Finance-MH',  type: 'finance',  tenant: 'Meridian Health',  tenantColor: '#10B981', emoji: '💳', color: '#F59E0B', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 99.8, workflows: 4210,  avgResponse: '1.4s', rateLimit: 400 },
  // MarketingStar Finance
  { id: 'a-015', name: 'Command-NS',  type: 'super',    tenant: 'MarketingStar Finance', tenantColor: '#F59E0B', emoji: '⚡', color: '#5C5FEF', status: 'active',  model: 'claude-opus-4-7',           successRate: 97.5, workflows: 3840,  avgResponse: '1.2s', rateLimit: 800 },
  { id: 'a-016', name: 'Finance-NS',  type: 'finance',  tenant: 'MarketingStar Finance', tenantColor: '#F59E0B', emoji: '💳', color: '#F59E0B', status: 'active',  model: 'claude-sonnet-4-6',         successRate: 99.4, workflows: 2840,  avgResponse: '1.5s', rateLimit: 300 },
];

type Agent = typeof allAgents[0];

const tenantOptions = ['All Tenants', 'Manexa AI Labs', 'GlobalTech Inc', 'Meridian Health', 'MarketingStar Finance'];

function getModelBadgeClass(model: string) {
  if (model.includes('opus')) return 'bg-indigo-600 text-white';
  if (model.includes('sonnet')) return 'bg-sky-500 text-white';
  return 'bg-emerald-500 text-white';
}

function getModelLabel(model: string) {
  if (model.includes('opus')) return 'Opus 4.7';
  if (model.includes('sonnet')) return 'Sonnet 4.6';
  return 'Haiku 4.5';
}

function getSuccessRateColor(rate: number) {
  if (rate >= 98) return 'text-emerald-600';
  if (rate >= 95) return 'text-sky-600';
  if (rate >= 90) return 'text-amber-600';
  return 'text-red-600';
}

const weeklyData = [264, 306, 345, 290, 310];
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const recentErrors = [
  { msg: 'API timeout — HubSpot 503', time: '12:10 PM' },
  { msg: 'Approval timeout', time: '11:30 AM' },
  { msg: 'Rate limit hit', time: '11:55 AM' },
];

function AgentDetailPanel({ agent, onClose }: { agent: Agent; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'performance' | 'config' | 'policies'>('performance');
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const [overrideValue, setOverrideValue] = useState(agent.rateLimit);
  const [contentSafety, setContentSafety] = useState(true);
  const [anomalyDetection, setAnomalyDetection] = useState(true);

  const maxBar = Math.max(...weeklyData);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-border">
        <div className="flex items-start gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ backgroundColor: agent.color + '22' }}
          >
            {agent.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-foreground">{agent.name}</h2>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                style={{ backgroundColor: agent.tenantColor }}
              >
                {agent.tenant}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${agent.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {agent.status === 'active' ? 'Active' : 'Paused'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getModelBadgeClass(agent.model)}`}>
                {getModelLabel(agent.model)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground capitalize mt-0.5">{agent.type} Agent</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-6">
        {(['performance', 'config', 'policies'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-sm font-medium border-b-2 -mb-px transition-colors capitalize ${
              activeTab === tab
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Total Workflows</p>
                <p className="text-2xl font-bold text-foreground">{agent.workflows.toLocaleString()}</p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Success Rate</p>
                <p className={`text-2xl font-bold ${getSuccessRateColor(agent.successRate)}`}>{agent.successRate}%</p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Avg Response</p>
                <p className="text-2xl font-bold text-foreground">{agent.avgResponse}</p>
              </div>
              <div className="bg-white border border-border rounded-2xl p-4">
                <p className="text-xs text-muted-foreground mb-1">Rate Limit/hr</p>
                <p className="text-2xl font-bold text-foreground">{agent.rateLimit.toLocaleString()}</p>
              </div>
            </div>

            {/* Success Rate Bar */}
            <div className="bg-white border border-border rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-foreground">Success Rate</p>
                <p className={`text-sm font-semibold ${getSuccessRateColor(agent.successRate)}`}>{agent.successRate}%</p>
              </div>
              <div className="w-full bg-muted rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all"
                  style={{ width: `${agent.successRate}%`, backgroundColor: agent.color }}
                />
              </div>
            </div>

            {/* Workflow Volume */}
            <div className="bg-white border border-border rounded-2xl p-4">
              <p className="text-sm font-medium text-foreground mb-4">Workflow Volume (This Week)</p>
              <svg width="100%" height="120" viewBox="0 0 260 120" preserveAspectRatio="none">
                {weeklyData.map((val, i) => {
                  const barHeight = (val / maxBar) * 90;
                  const x = i * 52 + 6;
                  return (
                    <g key={i}>
                      <rect
                        x={x}
                        y={100 - barHeight}
                        width={40}
                        height={barHeight}
                        rx={4}
                        fill={agent.color}
                        opacity={0.85}
                      />
                      <text x={x + 20} y={115} textAnchor="middle" fontSize={10} fill="#94a3b8">
                        {weekDays[i]}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Recent Errors */}
            <div className="bg-white border border-border rounded-2xl p-4">
              <p className="text-sm font-medium text-foreground mb-3">Recent Errors</p>
              <div className="space-y-2">
                {recentErrors.map((err, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                      <span className="text-sm text-foreground">{err.msg}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{err.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-2xl p-4 space-y-4">
              {/* Model */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Model</label>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getModelBadgeClass(agent.model)}`}>
                  {getModelLabel(agent.model)}
                </span>
              </div>

              {/* Temperature */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Temperature</label>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">0.3</span>
              </div>

              {/* HR Tokens */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">HR Tokens</label>
                <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-lg">
                  {agent.model.includes('opus') ? '32,768' : agent.model.includes('sonnet') ? '8,192' : '4,096'}
                </span>
              </div>

              {/* Rate Limit Override */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">Platform Override</p>
                    <p className="text-xs text-muted-foreground">Set a global ceiling for this agent</p>
                  </div>
                  <button
                    onClick={() => setOverrideEnabled(!overrideEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      overrideEnabled ? 'bg-indigo-600' : 'bg-muted-foreground/30'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                        overrideEnabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {overrideEnabled && (
                  <div className="mt-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Rate Limit Override (calls/hr)</label>
                    <input
                      type="number"
                      value={overrideValue}
                      onChange={(e) => setOverrideValue(Number(e.target.value))}
                      className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <p className="text-xs text-muted-foreground px-1">
              Per-agent config managed by tenant Business Admins. Super Admin sets platform-level limits only.
            </p>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors">
              Apply Override
            </button>
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="space-y-3">
            <div className="bg-white border border-border rounded-2xl divide-y divide-border">
              {/* Content Safety Filter */}
              <div className="flex items-center justify-between p-4">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-semibold text-foreground">Content Safety Filter</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Block harmful or policy-violating outputs before delivery</p>
                </div>
                <button
                  onClick={() => setContentSafety(!contentSafety)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    contentSafety ? 'bg-indigo-600' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      contentSafety ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Anomaly Detection */}
              <div className="flex items-center justify-between p-4">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-semibold text-foreground">Anomaly Detection (&gt;3× baseline)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Alert when agent volume exceeds 3× normal baseline</p>
                </div>
                <button
                  onClick={() => setAnomalyDetection(!anomalyDetection)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
                    anomalyDetection ? 'bg-indigo-600' : 'bg-muted-foreground/30'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      anomalyDetection ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Data Isolation — always on */}
              <div className="flex items-center justify-between p-4">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-semibold text-foreground">Data Isolation (tenant-scoped)</p>
                  <p className="text-xs text-muted-foreground mt-0.5">All agent data strictly scoped to the tenant workspace</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 flex-shrink-0">
                  <Lock size={14} />
                  <span className="text-xs font-medium">Always On</span>
                </div>
              </div>

              {/* Cross-tenant Restriction — always on */}
              <div className="flex items-center justify-between p-4">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-semibold text-foreground">Cross-tenant Restriction</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Agents cannot access data or APIs from other tenants</p>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 flex-shrink-0">
                  <Lock size={14} />
                  <span className="text-xs font-medium">Always On</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function SAAgentOversightScreen({ onNavigate }: { onNavigate: (screen: SAScreen, id?: string) => void }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AgentType>('all');
  const [tenantFilter, setTenantFilter] = useState('All Tenants');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const typeTabs: { key: AgentType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'super', label: 'Super' },
    { key: 'sales', label: 'Sales' },
    { key: 'hr', label: 'HR' },
    { key: 'finance', label: 'Finance' },
    { key: 'support', label: 'Support' },
    { key: 'research', label: 'Research' },
  ];

  const filtered = allAgents.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.tenant.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'all' || a.type === typeFilter;
    const matchTenant = tenantFilter === 'All Tenants' || a.tenant === tenantFilter;
    return matchSearch && matchType && matchTenant;
  });

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* LEFT PANEL */}
      <div
        className={`flex flex-col border-r border-border bg-white overflow-hidden flex-shrink-0 transition-all ${
          selectedAgent ? 'w-[320px]' : 'w-[360px]'
        }`}
      >
        {/* Panel Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-foreground text-base">
              {platformMetrics.totalAgents} Agents · {platformMetrics.activeAgents} Active
            </h2>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search agents or tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Type Filter Tabs */}
          <div className="flex flex-wrap gap-1 mb-3">
            {typeTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTypeFilter(tab.key)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  typeFilter === tab.key
                    ? 'bg-indigo-600 text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tenant Dropdown */}
          <select
            value={tenantFilter}
            onChange={(e) => setTenantFilter(e.target.value)}
            className="w-full text-xs border border-border rounded-lg px-2.5 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {tenantOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Agent List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((agent) => (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
              className={`w-full text-left px-4 py-3 border-b border-border hover:bg-muted/40 transition-colors ${
                selectedAgent?.id === agent.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Emoji circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: agent.color + '22' }}
                >
                  {agent.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-sm text-foreground truncate">{agent.name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{agent.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-md font-medium text-white"
                      style={{ backgroundColor: agent.tenantColor }}
                    >
                      {agent.tenant}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${getModelBadgeClass(agent.model)}`}>
                      {getModelLabel(agent.model)}
                    </span>
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span className={`text-xs font-semibold ${getSuccessRateColor(agent.successRate)}`}>
                      {agent.successRate}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bot size={32} className="mb-2 opacity-40" />
              <p className="text-sm">No agents found</p>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT DETAIL PANEL */}
      <div className="flex-1 overflow-hidden">
        {selectedAgent ? (
          <AgentDetailPanel agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
              <Bot size={32} className="opacity-40" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Select an agent</p>
              <p className="text-sm text-muted-foreground mt-1">Click any agent to view details, config, and policies</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
