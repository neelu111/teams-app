import React, { useState } from 'react';
import {
  Settings, X, Plus, Save, RotateCcw, Shield, Database, Eye, Toggle2,
} from 'lucide-react';
import { BAScreen, agentConfigs, capabilities, AgentConfig } from '../businessAdminData';

interface BASpecialistAgentsScreenProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

type DetailTab = 'config' | 'system-prompt' | 'capabilities' | 'access-rules';

const MODELS = ['claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5-20251001'];

const SPECIALIST_IDS = ['agent-sales', 'agent-hr', 'agent-finance', 'agent-ops', 'agent-support', 'agent-research'];

function statusBadge(status: string) {
  if (status === 'active')  return 'bg-green-100 text-green-700';
  if (status === 'paused')  return 'bg-amber-100 text-amber-700';
  return 'bg-slate-100 text-slate-500';
}

function riskBadge(risk: 'low' | 'medium' | 'high') {
  if (risk === 'low')    return 'bg-green-100 text-green-700';
  if (risk === 'medium') return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
}

interface AgentCardProps {
  agent: AgentConfig;
  selected: boolean;
  narrow: boolean;
  onClick: () => void;
}

function AgentCard({ agent, selected, narrow, onClick }: AgentCardProps) {
  const isActive = agent.status === 'active';
  const borderColor = isActive ? agent.color : undefined;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
        selected ? 'shadow-md ring-2' : 'hover:border-border'
      }`}
      style={{
        borderColor: isActive ? (selected ? agent.color : agent.color + '60') : undefined,
        ringColor: agent.color,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: agent.color + '20', border: `1.5px solid ${agent.color}40` }}
          >
            {agent.emoji}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">{agent.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{agent.type}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${statusBadge(agent.status)}`}>
          {agent.status}
        </span>
      </div>

      {/* Success rate bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Success rate</span>
          <span className="text-xs font-semibold text-foreground">{agent.successRate}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${agent.successRate}%`, backgroundColor: agent.color }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>{agent.totalWorkflows.toLocaleString()} workflows</span>
        <span>{agent.avgResponseTime} avg</span>
      </div>

      {/* Model badge */}
      <div className="mb-3">
        <span className="px-2 py-0.5 rounded-md text-xs font-mono bg-slate-100 text-slate-600">{agent.model}</span>
      </div>

      {/* Connectors */}
      <div className="flex flex-wrap gap-1 mb-3">
        {agent.connectors.slice(0, 3).map(c => (
          <span key={c} className="px-2 py-0.5 rounded-full text-xs bg-slate-50 border border-border text-slate-600">{c}</span>
        ))}
        {agent.connectors.length > 3 && (
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-50 border border-border text-slate-500">
            +{agent.connectors.length - 3} more
          </span>
        )}
      </div>

      <button
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:bg-slate-50 hover:text-foreground transition-colors"
        onClick={e => { e.stopPropagation(); onClick(); }}
      >
        <Settings className="w-3.5 h-3.5" />
        Configure
      </button>
    </div>
  );
}

interface DetailPanelProps {
  agent: AgentConfig;
  onClose: () => void;
}

function DetailPanel({ agent, onClose }: DetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>('config');
  const [systemPrompt, setSystemPrompt] = useState(agent.systemPrompt);
  const [selectedModel, setSelectedModel] = useState(agent.model);
  const [temperature, setTemperature] = useState(agent.temperature);
  const [maxTokens, setMaxTokens] = useState(agent.maxTokens);
  const [rateLimit, setRateLimit] = useState(agent.rateLimitPerHour);
  const [approvalRequired, setApprovalRequired] = useState(agent.approvalRequired);
  const [agentStatus, setAgentStatus] = useState(agent.status);

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'config',        label: 'Config' },
    { key: 'system-prompt', label: 'System Prompt' },
    { key: 'capabilities',  label: 'Capabilities' },
    { key: 'access-rules',  label: 'Access Rules' },
  ];

  const agentCaps = capabilities.filter(c =>
    c.agentsAllowed.includes(agent.name) || c.agentsAllowed.includes('All Agents')
  );

  const ROLES_THAT_CAN_INVOKE = ['manager', 'employee'] as const;

  return (
    <div className="flex flex-col h-full bg-white border-l border-border" style={{ flex: 1, minWidth: 0 }}>
      {/* Detail header */}
      <div className="px-5 pt-5 pb-0 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: agent.color + '20', border: `1.5px solid ${agent.color}40` }}
            >
              {agent.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{agent.name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusBadge(agentStatus)}`}>
                  {agentStatus}
                </span>
              </div>
              <p className="text-xs text-muted-foreground capitalize">{agent.type} agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-t-lg text-xs font-medium transition-colors border-b-2 ${
                activeTab === t.key
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ── CONFIG ── */}
        {activeTab === 'config' && (
          <div className="space-y-4">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Status</label>
              <div className="flex gap-2">
                {(['active', 'paused', 'inactive'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setAgentStatus(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                      agentStatus === s
                        ? s === 'active'
                          ? 'bg-green-500 text-white border-green-500'
                          : s === 'paused'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-slate-500 text-white border-slate-500'
                        : 'border-border text-muted-foreground hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Model</label>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value as any)}
                className="w-full border border-border rounded-lg px-3 py-2 text-xs text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {MODELS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-foreground">Temperature</label>
                <span className="text-xs font-mono text-muted-foreground">{temperature}</span>
              </div>
              <input
                type="range"
                min={0} max={1} step={0.05}
                value={temperature}
                onChange={e => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-primary"
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

            {/* Human Approval Toggle */}
            <div className="flex items-center justify-between py-2 border-t border-border">
              <div>
                <p className="text-xs font-semibold text-foreground">Human Approval Required</p>
                <p className="text-xs text-muted-foreground">Pause for human review on sensitive actions</p>
              </div>
              <button
                onClick={() => setApprovalRequired(p => !p)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${approvalRequired ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${approvalRequired ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
              </button>
            </div>

            {/* Approval Threshold */}
            {approvalRequired && agent.humanApprovalThreshold && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Human Approval Threshold</label>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800">{agent.humanApprovalThreshold}</p>
                </div>
              </div>
            )}

            {/* Connectors */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Connectors Used</label>
              <div className="flex flex-wrap gap-1.5">
                {agent.connectors.map(c => (
                  <span key={c} className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 border border-blue-200 text-blue-700">{c}</span>
                ))}
              </div>
            </div>

            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              <Save className="w-3.5 h-3.5" />
              Save
            </button>
          </div>
        )}

        {/* ── SYSTEM PROMPT ── */}
        {activeTab === 'system-prompt' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-foreground">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              className="w-full border border-border rounded-xl p-3 text-xs leading-relaxed bg-white text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              style={{ fontFamily: 'monospace', fontSize: 12, height: 300 }}
            />
            <p className="text-xs text-muted-foreground">Character count: {systemPrompt.length}</p>
            <div className="flex gap-2">
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
                <Save className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                onClick={() => setSystemPrompt(agent.systemPrompt)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-border text-muted-foreground hover:text-foreground hover:bg-slate-50 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        )}

        {/* ── CAPABILITIES ── */}
        {activeTab === 'capabilities' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">
              {agentCaps.length} capabilities available to {agent.name}
            </p>
            {agentCaps.map(cap => {
              const [enabled, setEnabled] = useState(cap.enabled);
              return (
                <div key={cap.id} className="flex items-center gap-3 p-3 bg-white border border-border rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-foreground">{cap.name}</p>
                      <span className="px-1.5 py-0.5 rounded text-xs bg-slate-100 text-slate-600">{cap.category}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${riskBadge(cap.riskLevel)}`}>
                        {cap.riskLevel}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{cap.description}</p>
                  </div>
                  <button
                    onClick={() => setEnabled(p => !p)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ── ACCESS RULES ── */}
        {activeTab === 'access-rules' && (
          <div className="space-y-5">
            {/* Data Scope */}
            <div className="bg-white rounded-xl border border-border p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-muted-foreground" />
                Data Scope
              </h3>
              <ul className="space-y-1.5">
                {agent.dataScope.map(ds => (
                  <li key={ds} className="flex items-center gap-2 text-xs text-foreground">
                    <span className="text-slate-400">🔒</span>
                    <span className="capitalize">{ds.replace(/_/g, ' ')}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connector Access */}
            <div className="bg-white rounded-xl border border-border p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                Connector Access
              </h3>
              <div className="space-y-1.5">
                {agent.connectors.map(c => (
                  <div key={c} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-foreground">{c}</span>
                    <span className="ml-auto text-xs font-medium text-green-600">Connected</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Roles Allowed */}
            <div className="bg-white rounded-xl border border-border p-4">
              <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                Roles Allowed to Invoke
              </h3>
              <div className="flex flex-wrap gap-2">
                {ROLES_THAT_CAN_INVOKE.map(role => (
                  <span key={role} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 border border-indigo-200 text-indigo-700 capitalize">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Human Approval Threshold */}
            {agent.humanApprovalThreshold && (
              <div className="bg-white rounded-xl border border-border p-4">
                <h3 className="text-xs font-semibold text-foreground mb-2">Human Approval Threshold</h3>
                <p className="text-xs text-muted-foreground">{agent.humanApprovalThreshold}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function BASpecialistAgentsScreen({ onNavigate }: BASpecialistAgentsScreenProps) {
  const specialists = agentConfigs.filter(a => SPECIALIST_IDS.includes(a.id));
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const selectedAgent = selectedAgentId ? specialists.find(a => a.id === selectedAgentId) ?? null : null;

  const panelOpen = selectedAgent !== null;

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* ── LEFT PANEL ─────────────────────────────────────────── */}
      <div
        className="flex flex-col overflow-hidden transition-all duration-200"
        style={{ width: panelOpen ? '44%' : '100%', borderRight: panelOpen ? '1px solid var(--border)' : undefined }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-border flex-shrink-0">
          <div>
            <h1 className="text-base font-bold text-foreground">6 Specialist Agents</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Configure and manage your AI workforce</p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
            Create Agent
          </button>
        </div>

        {/* Agent grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className={`grid gap-4 ${panelOpen ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {specialists.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={selectedAgentId === agent.id}
                narrow={panelOpen}
                onClick={() => setSelectedAgentId(prev => prev === agent.id ? null : agent.id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT DETAIL PANEL ─────────────────────────────────── */}
      {selectedAgent && (
        <DetailPanel
          agent={selectedAgent}
          onClose={() => setSelectedAgentId(null)}
        />
      )}
    </div>
  );
}
