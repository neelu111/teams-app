import React, { useState } from 'react';
import {
  Search, X, ChevronDown, Lock, Plus, Check,
  TrendingUp, Clock, Users, AlertTriangle,
} from 'lucide-react';
import { BAScreen, capabilities as initialCapabilities, Capability } from '../businessAdminData';

interface BACapabilitiesScreenProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

type CapabilityTab = 'config' | 'agents' | 'policies';

const RISK_CONFIG = {
  low:    { label: 'Low',    className: 'bg-green-100 text-green-700' },
  medium: { label: 'Medium', className: 'bg-amber-100 text-amber-700' },
  high:   { label: 'High',   className: 'bg-red-100 text-red-700' },
};

const ALL_AGENTS = ['Command', 'Sales', 'HR', 'Finance', 'DevOps', 'Support', 'Marketing'];
const ALL_ROLES  = ['super-admin', 'business-admin', 'manager', 'employee', 'sales-ops'];

const CATEGORY_FILTERS = [
  'All', 'Data Access', 'Communication', 'Finance',
  'Productivity', 'IT & Support', 'Research', 'Workflow', 'Integration',
] as const;

const RISK_FILTERS = ['All', 'Low', 'Medium', 'High'] as const;

const AGENT_COLORS: Record<string, string> = {
  Command: '#5C5FEF', Sales: '#0EA5E9', HR: '#10B981',
  Finance: '#F59E0B', DevOps:  '#8B5CF6', Support: '#EC4899', Marketing: '#06B6D4',
};

const AUDIT_TRAIL: Array<{ time: string; agent: string; user: string; action: string }> = [
  { time: '12:05 PM', agent: 'Sales',  user: 'Divya',   action: 'Executed' },
  { time: '11:58 AM', agent: 'Command', user: 'Kumar',     action: 'Triggered' },
  { time: '11:42 AM', agent: 'Sales',  user: 'Abhi',     action: 'Executed' },
  { time: '10:30 AM', agent: 'HR',   user: 'Dhathri',      action: 'Executed' },
  { time: '09:15 AM', agent: 'Support',   user: 'Anna Fischer',     action: 'Triggered' },
];

function RiskBadge({ level }: { level: 'low' | 'medium' | 'high' }) {
  const cfg = RISK_CONFIG[level];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      {category}
    </span>
  );
}

// ─── Config Tab ───────────────────────────────────────────────────────────────

function ConfigTab({
  capability,
  onUpdate,
}: {
  capability: Capability;
  onUpdate: (updated: Partial<Capability>) => void;
}) {
  const [description,       setDescription]       = useState(capability.description);
  const [enabled,           setEnabled]           = useState(capability.enabled);
  const [requiresApproval,  setRequiresApproval]  = useState(capability.requiresApproval);
  const [riskLevel,         setRiskLevel]         = useState<'low' | 'medium' | 'high'>(capability.riskLevel);
  const [dataScope,         setDataScope]         = useState(capability.dataScope ?? '');
  const [agentsAllowed,     setAgentsAllowed]     = useState<string[]>(capability.agentsAllowed);
  const [rolesAllowed,      setRolesAllowed]      = useState<string[]>(capability.rolesAllowed);

  function toggleAgent(agent: string) {
    setAgentsAllowed(prev =>
      prev.includes(agent) ? prev.filter(a => a !== agent) : [...prev, agent]
    );
  }

  function toggleRole(role: string) {
    setRolesAllowed(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  }

  function handleSave() {
    onUpdate({ description, enabled, requiresApproval, riskLevel, dataScope, agentsAllowed, rolesAllowed });
  }

  return (
    <div className="space-y-5">
      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Description</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Toggle row */}
      <div className="bg-background border border-border rounded-xl divide-y divide-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Enabled</p>
            <p className="text-xs text-muted-foreground">Allow agents to use this capability</p>
          </div>
          {/* using <button> instead of Radix Switch: no kit Toggle component configured */}
          <button
            onClick={() => setEnabled(v => !v)}
            className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Requires Approval</p>
            <p className="text-xs text-muted-foreground">Human approval required before execution</p>
          </div>
          <button
            onClick={() => setRequiresApproval(v => !v)}
            className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${requiresApproval ? 'bg-primary' : 'bg-gray-200'}`}
          >
            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${requiresApproval ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* Risk level */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Risk Level</label>
        <div className="relative w-40">
          {/* using <select> instead of Radix Select: no kit Select component configured */}
          <select
            value={riskLevel}
            onChange={e => setRiskLevel(e.target.value as 'low' | 'medium' | 'high')}
            className="w-full pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Data scope */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Data Scope</label>
        <input
          type="text"
          value={dataScope}
          onChange={e => setDataScope(e.target.value)}
          placeholder="e.g. Business emails only, no personal accounts"
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Usage stats */}
      <div className="bg-background border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Usage Stats</h4>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{capability.usageCount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total Uses</p>
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{capability.lastUsed ?? 'Never'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Last Used</p>
          </div>
          <div>
            <p className="text-lg font-bold text-green-600">↑ 12%</p>
            <p className="text-xs text-muted-foreground mt-0.5">This Week</p>
          </div>
        </div>
      </div>

      {/* Agents allowed */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">Agents Allowed</label>
        <div className="flex flex-wrap gap-2">
          {ALL_AGENTS.map(agent => {
            const isAllowed = agentsAllowed.includes(agent) || agentsAllowed.includes('All Agents');
            return (
              <button
                key={agent}
                onClick={() => toggleAgent(agent)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isAllowed
                    ? 'border-transparent text-white'
                    : 'border-border text-muted-foreground hover:border-gray-300'
                }`}
                style={isAllowed ? { backgroundColor: AGENT_COLORS[agent] } : {}}
              >
                {isAllowed && <Check className="w-3 h-3" />}
                {agent}
              </button>
            );
          })}
        </div>
      </div>

      {/* Roles allowed */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-2">Roles Allowed</label>
        <div className="flex flex-wrap gap-2">
          {ALL_ROLES.map(role => {
            const isAllowed = rolesAllowed.includes(role);
            return (
              <button
                key={role}
                onClick={() => toggleRole(role)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  isAllowed
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'border-border text-muted-foreground hover:border-gray-300'
                }`}
              >
                {isAllowed && <Check className="w-3 h-3" />}
                {role}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        Save Changes
      </button>
    </div>
  );
}

// ─── Agents Tab ───────────────────────────────────────────────────────────────

function AgentsTab({ capability }: { capability: Capability }) {
  const allowedAgents = capability.agentsAllowed.includes('All Agents')
    ? ALL_AGENTS
    : capability.agentsAllowed;

  const notAllowedAgents = ALL_AGENTS.filter(a => !allowedAgents.includes(a));

  return (
    <div className="space-y-5">
      {/* Allowed agents */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Agents with Access</h4>
        <div className="space-y-2">
          {allowedAgents.map(agent => (
            <div key={agent}
              className="flex items-center gap-3 px-4 py-2.5 bg-background border border-border rounded-xl">
              {/* inline colored div with emoji/initials — no AgentAvatar import */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: AGENT_COLORS[agent] ?? '#94A3B8' }}
              >
                {agent[0]}
              </div>
              <span className="text-sm font-medium text-foreground flex-1">{agent}</span>
              <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">Allowed</span>
              <button className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 text-muted-foreground hover:text-red-600 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Not allowed agents */}
      {notAllowedAgents.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Not Granted</h4>
          <div className="space-y-2">
            {notAllowedAgents.map(agent => (
              <div key={agent}
                className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 border border-border rounded-xl opacity-70">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 opacity-50"
                  style={{ backgroundColor: AGENT_COLORS[agent] ?? '#94A3B8' }}
                >
                  {agent[0]}
                </div>
                <span className="text-sm text-muted-foreground flex-1">{agent}</span>
                <button className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  <Plus className="w-3 h-3" /> Grant
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant to agent dropdown */}
      <div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-xs">
            {/* using <select> instead of Radix Select: no kit Select component configured */}
            <select className="w-full pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="">+ Grant to Agent…</option>
              {notAllowedAgents.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
          <button className="px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Grant
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Policies Tab ─────────────────────────────────────────────────────────────

function PoliciesTab({ capability }: { capability: Capability }) {
  const [policyNotes, setPolicyNotes] = useState(
    capability.dataScope
      ? `Data Scope: ${capability.dataScope}\n\nAdditional usage restrictions may apply. Ensure all executions comply with company data policy.`
      : 'No custom policy notes. Standard capability usage policy applies.'
  );

  return (
    <div className="space-y-5">
      {/* Usage policies */}
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Usage Policies</h4>
        <textarea
          value={policyNotes}
          onChange={e => setPolicyNotes(e.target.value)}
          rows={5}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button className="mt-2 px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          Save Notes
        </button>
      </div>

      {/* Approval workflow */}
      {capability.requiresApproval && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-semibold text-amber-800">Approval Workflow</h4>
          </div>
          <p className="text-xs text-amber-700">
            This capability requires human approval before execution. Approval must be granted by a <strong>Manager or above</strong>.
            Requests are routed via the Human Approval Gate workflow.
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs">
            <span className="text-amber-700 font-medium">Approvers:</span>
            <div className="flex gap-2">
              {['manager', 'business-admin', 'super-admin'].map(role => (
                <span key={role} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-medium">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit trail */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-gray-50">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Audit Trail — Last 5 Uses</h4>
        </div>
        {capability.usageCount > 0 ? (
          <div className="divide-y divide-border">
            {AUDIT_TRAIL.map((entry, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                <span className="text-xs text-muted-foreground w-16 flex-shrink-0">{entry.time}</span>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: AGENT_COLORS[entry.agent] ?? '#94A3B8' }}
                >
                  {entry.agent[0]}
                </div>
                <span className="text-xs font-medium text-foreground flex-shrink-0">{entry.agent}</span>
                <span className="text-xs text-muted-foreground flex-1 truncate">via {entry.user}</span>
                <span className="text-xs text-green-700 font-medium flex-shrink-0">{entry.action}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-4 text-center">
            <p className="text-sm text-muted-foreground">No uses recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function CapabilityDetailPanel({
  capability,
  onClose,
  onUpdate,
}: {
  capability: Capability;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Capability>) => void;
}) {
  const [tab, setTab] = useState<CapabilityTab>('config');

  const tabs: { id: CapabilityTab; label: string }[] = [
    { id: 'config',   label: 'Config' },
    { id: 'agents',   label: 'Agents' },
    { id: 'policies', label: 'Policies' },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-l border-border min-w-0">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">{capability.name}</h3>
            <div className="flex items-center flex-wrap gap-2 mt-1">
              <CategoryBadge category={capability.category} />
              <RiskBadge level={capability.riskLevel} />
              {capability.requiresApproval && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                  <Lock className="w-3 h-3" />
                  Requires Approval
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-muted-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mt-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'config' && (
          <ConfigTab
            capability={capability}
            onUpdate={updates => onUpdate(capability.id, updates)}
          />
        )}
        {tab === 'agents'   && <AgentsTab   capability={capability} />}
        {tab === 'policies' && <PoliciesTab capability={capability} />}
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function BACapabilitiesScreen({ onNavigate }: BACapabilitiesScreenProps) {
  const [caps, setCaps]                            = useState<Capability[]>(initialCapabilities);
  const [selectedCapabilityId, setSelectedCapabilityId] = useState<string | null>(null);
  const [searchQuery,          setSearchQuery]          = useState('');
  const [filterCategory,       setFilterCategory]       = useState<string>('All');
  const [filterRisk,           setFilterRisk]           = useState<string>('All');

  const selectedCapability = caps.find(c => c.id === selectedCapabilityId) ?? null;

  function toggleCapability(id: string) {
    setCaps(prev => prev.map(c => c.id === id ? { ...c, enabled: !c.enabled } : c));
  }

  function updateCapability(id: string, updates: Partial<Capability>) {
    setCaps(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }

  const filtered = caps.filter(c => {
    const matchSearch   = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'All' || c.category === filterCategory;
    const matchRisk     = filterRisk === 'All' || c.riskLevel === filterRisk.toLowerCase();
    return matchSearch && matchCategory && matchRisk;
  });

  // Group by category
  const grouped = filtered.reduce<Record<string, Capability[]>>((acc, cap) => {
    if (!acc[cap.category]) acc[cap.category] = [];
    acc[cap.category].push(cap);
    return acc;
  }, {});

  const enabledCount        = caps.filter(c => c.enabled).length;
  const disabledCount       = caps.filter(c => !c.enabled).length;
  const requiresApprovalCount = caps.filter(c => c.requiresApproval).length;

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* ─── Left Panel ─────────────────────────── */}
      <div
        className={`flex flex-col border-r border-border bg-white transition-all duration-200 ${
          selectedCapability ? 'w-[440px] flex-shrink-0' : 'flex-1'
        } overflow-hidden`}
      >
        {/* Top toolbar */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search capabilities…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {/* using <select> for category filter — no kit Select component configured */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORY_FILTERS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={filterRisk}
                onChange={e => setFilterRisk(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {RISK_FILTERS.map(r => (
                  <option key={r} value={r}>{r} Risk</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Summary */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-green-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {enabledCount} enabled
            </span>
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              {disabledCount} disabled
            </span>
            <span className="flex items-center gap-1.5 text-orange-700 font-medium">
              <Lock className="w-3 h-3" />
              {requiresApprovalCount} require approval
            </span>
          </div>
        </div>

        {/* Capability list grouped by category */}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(grouped).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Search className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-muted-foreground">No capabilities match your filters.</p>
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                {/* Category header */}
                <div className="sticky top-0 z-10 px-5 py-2 bg-gray-50 border-b border-border">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{category}</span>
                </div>

                {items.map(cap => {
                  const isSelected = selectedCapability?.id === cap.id;
                  return (
                    <div
                      key={cap.id}
                      onClick={() => setSelectedCapabilityId(isSelected ? null : cap.id)}
                      className={`flex items-center gap-3 px-5 py-3 cursor-pointer border-b border-border transition-colors ${
                        isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Name + badges */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-foreground">{cap.name}</span>
                          <RiskBadge level={cap.riskLevel} />
                          {cap.requiresApproval && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                              <Lock className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {cap.usageCount.toLocaleString()} uses
                          </span>
                          {cap.lastUsed && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cap.lastUsed}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleCapability(cap.id); }}
                        className={`relative inline-flex items-center w-9 h-[18px] rounded-full transition-colors flex-shrink-0 ${cap.enabled ? 'bg-primary' : 'bg-gray-200'}`}
                        title={cap.enabled ? 'Disable' : 'Enable'}
                      >
                        <span className={`inline-block w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${cap.enabled ? 'translate-x-[19px]' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── Right Panel ─────────────────────────── */}
      {selectedCapability && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <CapabilityDetailPanel
            capability={selectedCapability}
            onClose={() => setSelectedCapabilityId(null)}
            onUpdate={updateCapability}
          />
        </div>
      )}
    </div>
  );
}
