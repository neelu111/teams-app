import React, { useState } from 'react';
import {
  Settings, Zap, X, Plus, Save, RotateCcw, Activity, Shield, Database,
  Eye, ChevronRight, Users, Toggle2,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { BAScreen, agentConfigs, systemMetrics } from '../businessAdminData';

interface BASuperAgentScreenProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

type CommandTab = 'overview' | 'system-prompt' | 'routing' | 'model-settings' | 'performance';

const ATLAS_SYSTEM_PROMPT =
  "You are Command, the Super Agent for Manexa AI Labs' AI Workforce Platform. Your role is to:\n\n1. Understand user intent from natural language requests\n2. Route tasks to the appropriate specialist agent (Sales for sales, HR for HR, Finance for finance, DevOps for operations, Support for support, Marketing for research)\n3. Maintain context across multi-step workflows\n4. Coordinate multi-agent tasks that span departments\n5. Escalate to humans when approval is required or uncertainty is high\n\nAlways prioritize accuracy over speed. When routing is ambiguous, clarify with the user before proceeding. Never take irreversible actions without explicit confirmation.";

const SPECIALISTS = [
  { name: 'Sales',  type: 'sales',      emoji: '📈', color: '#0EA5E9' },
  { name: 'HR',   type: 'hr',         emoji: '👥', color: '#10B981' },
  { name: 'Finance', type: 'finance',    emoji: '💳', color: '#F59E0B' },
  { name: 'DevOps',   type: 'operations', emoji: '⚙️', color: '#8B5CF6' },
  { name: 'Support',   type: 'support',    emoji: '🎯', color: '#EC4899' },
  { name: 'Marketing',  type: 'research',   emoji: '🔬', color: '#06B6D4' },
];

const ROUTING_RULES = [
  { keyword: 'Sales',      agent: 'Sales',  color: '#0EA5E9' },
  { keyword: 'HR',         agent: 'HR',   color: '#10B981' },
  { keyword: 'Finance',    agent: 'Finance', color: '#F59E0B' },
  { keyword: 'Operations', agent: 'DevOps',   color: '#8B5CF6' },
  { keyword: 'Support',    agent: 'Support',   color: '#EC4899' },
  { keyword: 'Research',   agent: 'Marketing',  color: '#06B6D4' },
];

const ROUTING_DISTRIBUTION = [
  { name: 'Sales',  value: 421, color: '#0EA5E9' },
  { name: 'HR',   value: 312, color: '#10B981' },
  { name: 'Finance', value: 289, color: '#F59E0B' },
  { name: 'DevOps',   value: 198, color: '#8B5CF6' },
  { name: 'Support',   value: 634, color: '#EC4899' },
  { name: 'Marketing',  value: 156, color: '#06B6D4' },
];

const ACTIVITY_FEED = [
  { time: '12:00 PM', action: 'Approval gate triggered', detail: 'InnovateCo Discount', routedTo: 'Neelu', routeColor: '#5C5FEF', status: 'pending' },
  { time: '11:50 AM', action: 'Workflow orchestration', detail: 'TechCorp Proposal', routedTo: 'Sales', routeColor: '#0EA5E9', status: 'success' },
  { time: '11:40 AM', action: 'Email blocked', detail: 'Policy violation', routedTo: null, routeColor: null, status: 'blocked' },
  { time: '11:00 AM', action: 'Multi-agent pipeline', detail: '5 agents coordinated', routedTo: null, routeColor: null, status: 'success' },
  { time: '10:30 AM', action: 'New hire provisioning', detail: 'Dhathri', routedTo: 'DevOps', routeColor: '#8B5CF6', status: 'success' },
  { time: '10:15 AM', action: 'Invoice routing', detail: 'Vendor Invoice #4881', routedTo: 'Finance', routeColor: '#F59E0B', status: 'success' },
  { time: '10:00 AM', action: 'Capability enabled', detail: 'Email Read for Sales', routedTo: null, routeColor: null, status: 'success' },
  { time: '9:45 AM',  action: 'SLA breach escalation', detail: 'Ticket TK-4521', routedTo: 'Support', routeColor: '#EC4899', status: 'warning' },
  { time: '9:30 AM',  action: 'Competitor research', detail: 'Q3 Market Analysis', routedTo: 'Marketing', routeColor: '#06B6D4', status: 'success' },
  { time: '9:00 AM',  action: 'Daily pipeline review', detail: '5 agents coordinated', routedTo: null, routeColor: null, status: 'success' },
  { time: '8:30 AM',  action: 'HR record update', detail: 'Performance review cycle', routedTo: 'HR', routeColor: '#10B981', status: 'success' },
  { time: '8:00 AM',  action: 'Security scan complete', detail: 'No issues found', routedTo: null, routeColor: null, status: 'success' },
];

const ERROR_LOG = [
  { time: '11:40 AM', msg: 'Email blocked — policy violation (Sales)' },
  { time: '10:05 AM', msg: 'Routing ambiguous — clarification requested' },
  { time: '8:55 AM',  msg: 'Rate limit warning — LinkedIn API (Marketing)' },
];

const MODELS = ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

export function BASuperAgentScreen({ onNavigate }: BASuperAgentScreenProps) {
  const atlas = agentConfigs.find(a => a.id === 'agent-super')!;
  const [activeTab, setActiveTab] = useState<CommandTab>('overview');
  const [agentActive, setAgentActive] = useState(true);
  const [systemPrompt, setSystemPrompt] = useState(ATLAS_SYSTEM_PROMPT);
  const [keywords, setKeywords] = useState<string[]>([...atlas.routingKeywords]);
  const [newKeyword, setNewKeyword] = useState('');
  const [selectedModel, setSelectedModel] = useState(atlas.model);
  const [temperature, setTemperature] = useState(atlas.temperature);
  const [maxTokens, setMaxTokens] = useState(atlas.maxTokens);
  const [rateLimit, setRateLimit] = useState(atlas.rateLimitPerHour);

  const tabs: { key: CommandTab; label: string }[] = [
    { key: 'overview',       label: 'Overview' },
    { key: 'system-prompt',  label: 'System Prompt' },
    { key: 'routing',        label: 'Routing' },
    { key: 'model-settings', label: 'Model Settings' },
    { key: 'performance',    label: 'Performance' },
  ];

  const statCards = [
    { label: 'Total Workflows', value: '1,847', color: '#5C5FEF' },
    { label: 'Success Rate',    value: '97.3%', color: '#10B981' },
    { label: 'Avg Response',    value: '1.2s',  color: '#0EA5E9' },
    { label: 'Rate Limit',      value: '500/hr',color: '#F59E0B' },
  ];

  const totalRouted = ROUTING_DISTRIBUTION.reduce((s, r) => s + r.value, 0);

  function addKeyword() {
    const kw = newKeyword.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) setKeywords(prev => [...prev, kw]);
    setNewKeyword('');
  }

  function removeKeyword(kw: string) {
    setKeywords(prev => prev.filter(k => k !== kw));
  }

  const statusColor = (s: string) => {
    if (s === 'success') return 'bg-green-100 text-green-700';
    if (s === 'blocked') return 'bg-red-100 text-red-700';
    if (s === 'warning') return 'bg-amber-100 text-amber-700';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Recharts gradient defs */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="atlas-perf-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5C5FEF" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div className="flex flex-col" style={{ width: '55%', borderRight: '1px solid var(--border)' }}>
        {/* Agent Header */}
        <div className="px-6 pt-6 pb-4 bg-white border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: '#5C5FEF20', border: '2px solid #5C5FEF30' }}>
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-foreground">Command</h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {agentActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-slate-100 text-slate-600">
                    claude-opus-4-7
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Last modified: May 28</p>
              </div>
            </div>
            {/* Toggle */}
            <button
              onClick={() => setAgentActive(p => !p)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${agentActive ? 'bg-green-500' : 'bg-slate-300'}`}
              title={agentActive ? 'Deactivate Command' : 'Activate Command'}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${agentActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === t.key
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Stat cards */}
              <div className="grid grid-cols-4 gap-3">
                {statCards.map(s => (
                  <div key={s.label} className="bg-white rounded-xl border border-border p-3">
                    <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Connected specialists */}
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  Connected Specialists
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SPECIALISTS.map(sp => (
                    <span
                      key={sp.name}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{ backgroundColor: sp.color + '15', borderColor: sp.color + '40', color: sp.color }}
                    >
                      {sp.emoji} {sp.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Data Scope */}
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  Data Scope
                </h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">all</span>
              </div>

              {/* Capabilities */}
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  Capabilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {atlas.capabilities.map(cap => (
                    <span key={cap} className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── SYSTEM PROMPT ── */}
          {activeTab === 'system-prompt' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">System Prompt</label>
                <textarea
                  value={systemPrompt}
                  onChange={e => setSystemPrompt(e.target.value)}
                  className="w-full border border-border rounded-xl p-3 text-xs leading-relaxed bg-white text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                  style={{ fontFamily: 'monospace', fontSize: 12, height: 280 }}
                />
                <p className="text-xs text-muted-foreground mt-1">Character count: {systemPrompt.length}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={() => setSystemPrompt(ATLAS_SYSTEM_PROMPT)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset to Default
                </button>
              </div>
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-amber-500 text-xs">⚠️</span>
                <p className="text-xs text-amber-800">Changes take effect immediately on next interaction</p>
              </div>
            </div>
          )}

          {/* ── ROUTING ── */}
          {activeTab === 'routing' && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Routing Keywords</h3>
                <p className="text-xs text-muted-foreground mb-3">Command routes to specialists based on these keywords</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {keywords.map(kw => (
                    <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-700">
                      {kw}
                      <button onClick={() => removeKeyword(kw)} className="text-slate-400 hover:text-red-500 transition-colors ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Add keyword */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={e => setNewKeyword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addKeyword()}
                    placeholder="+ Add Keyword"
                    className="flex-1 border border-border rounded-lg px-3 py-1.5 text-xs text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
                  />
                  <button
                    onClick={addKeyword}
                    className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              {/* Routing rules */}
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Routing Rules</h3>
                <div className="space-y-2">
                  {ROUTING_RULES.map(r => (
                    <div key={r.keyword} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                        <span className="text-xs font-medium text-foreground">{r.keyword}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold" style={{ color: r.color }}>{r.agent}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── MODEL SETTINGS ── */}
          {activeTab === 'model-settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-border p-4 space-y-4">
                {/* Model selector */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Model</label>
                  <select
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value as any)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-xs text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    {MODELS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-foreground">Temperature</label>
                    <span className="text-xs font-mono text-muted-foreground">{temperature}</span>
                  </div>
                  <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="absolute top-0 left-0 h-full rounded-full bg-primary" style={{ width: `${(temperature / 1) * 100}%` }} />
                  </div>
                  <input
                    type="range"
                    min={0} max={1} step={0.05}
                    value={temperature}
                    onChange={e => setTemperature(parseFloat(e.target.value))}
                    className="w-full mt-1 accent-primary"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-0.5">
                    <span>0 (precise)</span>
                    <span>1 (creative)</span>
                  </div>
                </div>

                {/* HR Tokens */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">HR Tokens</label>
                  <input
                    type="number"
                    value={maxTokens}
                    onChange={e => setMaxTokens(parseInt(e.target.value))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-xs text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Rate Limit */}
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1.5">Rate Limit per Hour</label>
                  <input
                    type="number"
                    value={rateLimit}
                    onChange={e => setRateLimit(parseInt(e.target.value))}
                    className="w-full border border-border rounded-lg px-3 py-2 text-xs text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                {/* Human Approval */}
                <div className="flex items-center justify-between py-2 border-t border-border">
                  <div>
                    <p className="text-xs font-semibold text-foreground">Human Approval Required</p>
                    <p className="text-xs text-muted-foreground">Command handles its own routing decisions</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Off</span>
                </div>
              </div>

              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Save className="w-3.5 h-3.5" />
                Save Model Config
              </button>
            </div>
          )}

          {/* ── PERFORMANCE ── */}
          {activeTab === 'performance' && (
            <div className="space-y-5">
              {/* Area chart */}
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  Hourly API Calls — Today
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={systemMetrics.agentActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                    <Area type="monotone" dataKey="calls" name="API Calls" stroke="#5C5FEF" fill="url(#atlas-perf-grad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Success rate bar */}
              <div className="bg-white rounded-xl border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">Success Rate</h3>
                  <span className="text-sm font-bold text-green-600">97.3%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-green-500" style={{ width: '97.3%' }} />
                </div>
              </div>

              {/* Error log */}
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  Recent Errors
                </h3>
                <div className="space-y-2">
                  {ERROR_LOG.map((e, i) => (
                    <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground">{e.time} — </span>
                        <span className="text-xs text-foreground">{e.msg}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Panel header */}
        <div className="px-6 pt-6 pb-4 bg-white border-b border-border flex-shrink-0">
          <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4" style={{ color: '#5C5FEF' }} />
            Today's Command Activity
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Activity feed */}
          <div className="bg-white rounded-xl border border-border divide-y divide-border">
            {ACTIVITY_FEED.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <span className="text-xs text-muted-foreground w-16 flex-shrink-0 pt-0.5">{item.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.detail}</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {item.routedTo && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        backgroundColor: (item.routeColor ?? '#94A3B8') + '20',
                        color: item.routeColor ?? '#94A3B8',
                      }}
                    >
                      {item.routedTo}
                    </span>
                  )}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Routing Distribution */}
          <div className="bg-white rounded-xl border border-border p-4">
            <h3 className="text-sm font-semibold text-foreground mb-4">Routing Distribution</h3>
            <div className="grid grid-cols-2 gap-4 items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={ROUTING_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {ROUTING_DISTRIBUTION.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E2E8F0' }}
                    formatter={(val: number) => [val, 'Workflows']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {ROUTING_DISTRIBUTION.map(r => (
                  <div key={r.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: r.color }} />
                    <span className="text-xs text-foreground flex-1">{r.name}</span>
                    <span className="text-xs font-semibold" style={{ color: r.color }}>{r.value}</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ backgroundColor: r.color, width: `${(r.value / totalRouted) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
