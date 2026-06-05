import React, { useState } from 'react';
import { Search, Filter, Plus, ChevronDown, MoreHorizontal, Clock, User, GitBranch, TrendingUp } from 'lucide-react';
import { Screen } from '../types';
import { sampleWorkflows } from '../sampleData';
import { StatusBadge, PriorityBadge } from '../shared/StatusBadge';
import { AgentAvatar } from '../shared/AgentAvatar';

interface WorkflowsScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
}

const statusFilters = ['All', 'Running', 'Needs Action', 'Waiting', 'Scheduled', 'Completed', 'Blocked', 'Failed'];

export function WorkflowsScreen({ onNavigate }: WorkflowsScreenProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updated');

  const filtered = sampleWorkflows.filter(wf => {
    const matchesFilter = activeFilter === 'All' ||
      wf.status === activeFilter.toLowerCase().replace(' ', '-');
    const matchesSearch = wf.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wf.agent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: sampleWorkflows.length,
    running: sampleWorkflows.filter(w => w.status === 'running').length,
    completed: sampleWorkflows.filter(w => w.status === 'completed').length,
    needsAction: sampleWorkflows.filter(w => w.status === 'needs-action' || w.status === 'blocked').length,
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total', value: stats.total, color: 'text-foreground' },
              { label: 'Running', value: stats.running, color: 'text-blue-600' },
              { label: 'Needs Action', value: stats.needsAction, color: 'text-orange-600' },
              { label: 'Completed', value: stats.completed, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <span className={`text-xl font-semibold ${s.color}`}>{s.value}</span>
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('ai-assistant')}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 overflow-x-auto">
            {statusFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === f
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all w-48"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              Sort: Recent
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground w-[38%]">Workflow</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[12%]">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[10%]">Agent</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[10%]">Priority</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[14%]">Progress</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[12%]">Updated</th>
              <th className="w-[4%]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {filtered.map(wf => (
              <tr
                key={wf.id}
                onClick={() => onNavigate('workflow-detail', wf.id)}
                className="hover:bg-muted/20 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <AgentAvatar type={wf.agentType} name={wf.agent} size="sm" />
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground leading-snug line-clamp-1">{wf.title}</div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="w-3 h-3" /> {wf.createdBy}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <GitBranch className="w-3 h-3" /> {wf.taskCount} tasks
                        </span>
                        {wf.approvalRequired && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 font-medium">Approval needed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4"><StatusBadge status={wf.status} /></td>
                <td className="px-4 py-4">
                  <span className="text-sm font-medium text-foreground">{wf.agent}</span>
                </td>
                <td className="px-4 py-4"><PriorityBadge priority={wf.priority} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden w-20">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${wf.progress}%`,
                        background: wf.status === 'completed' ? '#10B981' : wf.status === 'blocked' ? '#EF4444' : '#5C5FEF'
                      }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">{wf.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(wf.updated).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <button onClick={e => e.stopPropagation()} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white">
            <GitBranch className="w-10 h-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No workflows found</p>
            <p className="text-xs text-muted-foreground/70 mt-1">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
