import React, { useState } from 'react';
import { Search, Plus, Zap, Activity, CheckCircle2, Pause, AlertCircle, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Screen, AgentType } from '../types';
import { sampleAgents } from '../sampleData';
import { StatusBadge } from '../shared/StatusBadge';
import { AgentAvatar } from '../shared/AgentAvatar';

interface AgentsScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
}

const agentTypeLabels: Record<AgentType, string> = {
  super: 'Super Agent', sales: 'Sales', hr: 'Human Resources', finance: 'Finance',
  operations: 'Operations', support: 'Support', research: 'Research',
};

export function AgentsScreen({ onNavigate }: AgentsScreenProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'Active', 'Idle', 'Paused'];
  const filtered = sampleAgents.filter(a =>
    (filter === 'All' || a.status === filter.toLowerCase()) &&
    (a.name.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()))
  );

  const superAgent = sampleAgents.find(a => a.type === 'super');
  const specialists = filtered.filter(a => a.type !== 'super');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border flex items-center gap-3">
        <div className="flex gap-1">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative ml-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-48" />
        </div>
        <div className="ml-auto">
          <button onClick={() => onNavigate('agent-config')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Specialist
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Super Agent */}
        {superAgent && (filter === 'All' || filter === 'Active') && (
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Super Agent</h3>
            <div
              onClick={() => onNavigate('super-agent-config')}
              className="w-full bg-white border border-border rounded-2xl p-5 text-left hover:border-primary/40 hover:shadow-md transition-all group cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #FAFBFF 0%, #F0F1FE 100%)' }}
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <AgentAvatar type="super" name={superAgent.name} size="xl" showStatus status="active" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-base font-semibold text-foreground">{superAgent.name}</h3>
                    <StatusBadge status={superAgent.status} />
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">Super Agent</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 max-w-2xl">{superAgent.description}</p>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Workflows Today', value: superAgent.workflowsToday },
                      { label: 'Total Workflows', value: superAgent.totalWorkflows.toLocaleString() },
                      { label: 'Success Rate', value: `${superAgent.successRate}%` },
                      { label: 'Avg Response', value: superAgent.avgResponseTime },
                    ].map(stat => (
                      <div key={stat.label} className="text-center p-3 bg-white/80 rounded-xl border border-border/50">
                        <div className="text-lg font-semibold text-foreground">{stat.value}</div>
                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); onNavigate('super-agent-config'); }}
                    className="px-3 py-1.5 border border-border rounded-lg text-xs text-foreground hover:bg-white/80 transition-colors bg-white/60">
                    Configure
                  </button>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Specialist Agents */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Specialist Agents ({specialists.length})</h3>
          <div className="grid grid-cols-3 gap-4">
            {specialists.map(agent => (
              <div
                key={agent.id}
                onClick={() => onNavigate('agent-profile', agent.id)}
                className="bg-white border border-border rounded-2xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <AgentAvatar type={agent.type} name={agent.name} size="lg" showStatus status={agent.status} />
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={agent.status} />
                    <button
                      onClick={e => e.stopPropagation()}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                <div className="mb-1 flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{agent.name}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-3">{agentTypeLabels[agent.type]}</div>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">{agent.description}</p>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2.5 bg-muted/50 rounded-lg text-center">
                    <div className="text-sm font-semibold text-foreground">{agent.workflowsToday}</div>
                    <div className="text-xs text-muted-foreground">Today</div>
                  </div>
                  <div className="p-2.5 bg-muted/50 rounded-lg text-center">
                    <div className="text-sm font-semibold text-foreground">{agent.successRate}%</div>
                    <div className="text-xs text-muted-foreground">Success</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {agent.capabilities.slice(0, 3).map(cap => (
                    <span key={cap} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{cap}</span>
                  ))}
                  {agent.capabilities.length > 3 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">+{agent.capabilities.length - 3}</span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                  {agent.connectors.slice(0, 3).map(c => (
                    <span key={c} className="text-xs text-muted-foreground font-medium">{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
