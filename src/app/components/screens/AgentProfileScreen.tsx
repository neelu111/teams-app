import React, { useState } from 'react';
import { ArrowLeft, Zap, CheckCircle2, Link, Activity, Clock, Settings, Toggle, Plus, MoreHorizontal } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Screen } from '../types';
import { sampleAgents, sampleWorkflows } from '../sampleData';
import { StatusBadge } from '../shared/StatusBadge';
import { AgentAvatar } from '../shared/AgentAvatar';

interface AgentProfileScreenProps {
  agentId: string;
  onNavigate: (screen: Screen, id?: string) => void;
}

const perfData = [
  { day: 'Mon', workflows: 8, success: 7 }, { day: 'Tue', workflows: 12, success: 11 },
  { day: 'Wed', workflows: 9, success: 9 }, { day: 'Thu', workflows: 15, success: 14 },
  { day: 'Fri', workflows: 11, success: 10 }, { day: 'Sat', workflows: 3, success: 3 },
  { day: 'Sun', workflows: 2, success: 2 },
];

export function AgentProfileScreen({ agentId, onNavigate }: AgentProfileScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities' | 'connectors' | 'workflows'>('overview');
  const agent = sampleAgents.find(a => a.id === agentId) || sampleAgents[1];
  const agentWorkflows = sampleWorkflows.filter(w => w.agent === agent.name);

  const connectorList = [
    { name: agent.connectors[0] || 'HubSpot CRM', status: 'connected', lastSync: '2 minutes ago' },
    { name: agent.connectors[1] || 'Gmail API', status: 'connected', lastSync: '5 minutes ago' },
    { name: agent.connectors[2] || 'LinkedIn Sales Nav', status: 'connected', lastSync: '1 hour ago' },
    { name: agent.connectors[3] || 'Salesforce', status: 'disconnected', lastSync: 'Never' },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <button onClick={() => onNavigate('agents')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Agents
        </button>
        <div className="flex items-start gap-5">
          <AgentAvatar type={agent.type} name={agent.name} size="xl" showStatus status={agent.status} />
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <h2 className="text-xl font-semibold text-foreground">{agent.name}</h2>
              <StatusBadge status={agent.status} />
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium capitalize">{agent.type} Agent</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed mb-3">{agent.description}</p>
            <div className="flex items-center gap-5">
              {[
                { label: 'Workflows Today', value: agent.workflowsToday },
                { label: 'Total Workflows', value: agent.totalWorkflows.toLocaleString() },
                { label: 'Success Rate', value: `${agent.successRate}%` },
                { label: 'Avg Response', value: agent.avgResponseTime },
                { label: 'Capabilities', value: agent.capabilities.length },
                { label: 'Connectors', value: agent.connectors.length },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-semibold text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => onNavigate('ai-assistant')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <Zap className="w-4 h-4" /> Chat with {agent.name}
            </button>
            <button onClick={() => onNavigate('agent-config')}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
              <Settings className="w-4 h-4" /> Configure
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-border px-6">
        <div className="flex gap-1">
          {(['overview', 'capabilities', 'connectors', 'workflows'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* Performance Chart */}
            <div className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Performance — Last 7 Days</h3>
                  <p className="text-xs text-muted-foreground">Workflows executed vs successful</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: agent.color }} />Executed</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />Successful</span>
                </div>
              </div>
              <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
                <defs>
                  <linearGradient id="agent-prof-exec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={agent.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={agent.color} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="agent-prof-succ" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </svg>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={perfData}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                  <Area type="monotone" dataKey="workflows" stroke={agent.color} strokeWidth={2} fill="url(#agent-prof-exec)" />
                  <Area type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} fill="url(#agent-prof-succ)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Workflows */}
            <div className="bg-white border border-border rounded-xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Recent Workflows</h3>
                <button onClick={() => setActiveTab('workflows')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              <div className="divide-y divide-border">
                {agentWorkflows.slice(0, 4).map(wf => (
                  <button key={wf.id} onClick={() => onNavigate('workflow-detail', wf.id)}
                    className="w-full flex items-center gap-4 px-5 py-3 hover:bg-muted/20 text-left transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{wf.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{wf.createdBy}</div>
                    </div>
                    <StatusBadge status={wf.status} />
                    <div className="text-xs text-muted-foreground w-12 text-right">{wf.progress}%</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="bg-white border border-border rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Capabilities ({agent.capabilities.length})</h3>
              <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add capability
              </button>
            </div>
            <div className="divide-y divide-border">
              {agent.capabilities.map((cap, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: agent.bgColor }}>
                      <Zap className="w-4 h-4" style={{ color: agent.color }} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{cap}</div>
                      <div className="text-xs text-muted-foreground">Enabled · Used in {Math.floor(Math.random() * 50 + 10)} workflows</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">Active</span>
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'connectors' && (
          <div className="bg-white border border-border rounded-xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Connectors ({connectorList.length})</h3>
              <button onClick={() => onNavigate('connectors')} className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                <Plus className="w-3.5 h-3.5" /> Add connector
              </button>
            </div>
            <div className="divide-y divide-border">
              {connectorList.map((c, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">Last sync: {c.lastSync}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.status === 'connected' ? 'bg-green-50 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {c.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                    <button className="text-xs text-primary hover:underline px-2 py-1">{c.status === 'connected' ? 'Manage' : 'Connect'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'workflows' && (
          <div className="space-y-2">
            {agentWorkflows.map(wf => (
              <button key={wf.id} onClick={() => onNavigate('workflow-detail', wf.id)}
                className="w-full bg-white border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/30 text-left transition-all">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{wf.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{wf.createdBy} · {wf.taskCount} tasks</div>
                </div>
                <StatusBadge status={wf.status} />
                <div className="w-24">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${wf.progress}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 text-right">{wf.progress}%</div>
                </div>
              </button>
            ))}
            {agentWorkflows.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">No workflows for this agent yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
