import React, { useState } from 'react';
import { Search, X, GitBranch, AlertCircle, CheckCircle2, Clock, Calendar, Bot, Users } from 'lucide-react';
import { MScreen, MWorkflow, MWorkflowStatus, managerWorkflows, managerTeam } from '../managerData';
import { AgentAvatar, UserAvatar } from '../../shared/AgentAvatar';

const statusConfig: Record<MWorkflowStatus, { label: string; color: string; bg: string; dot: string }> = {
  running:   { label: 'Running',   color: '#5C5FEF', bg: 'bg-indigo-50',  dot: 'bg-indigo-500' },
  scheduled: { label: 'Scheduled', color: '#F59E0B', bg: 'bg-yellow-50',  dot: 'bg-yellow-500' },
  completed: { label: 'Completed', color: '#10B981', bg: 'bg-green-50',   dot: 'bg-green-500' },
  failed:    { label: 'Failed',    color: '#EF4444', bg: 'bg-red-50',     dot: 'bg-red-500' },
  blocked:   { label: 'Blocked',   color: '#8B5CF6', bg: 'bg-purple-50',  dot: 'bg-purple-500' },
};

const stepStatusIcons = {
  done:    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />,
  active:  <div className="w-4 h-4 rounded-full border-2 border-primary flex-shrink-0 relative"><div className="absolute inset-0.5 rounded-full bg-primary animate-pulse" /></div>,
  pending: <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />,
  blocked: <AlertCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />,
};

interface MTeamWorkflowsProps {
  onNavigate: (screen: MScreen, id?: string) => void;
  initialWorkflowId?: string;
}

export function MTeamWorkflowsScreen({ onNavigate, initialWorkflowId }: MTeamWorkflowsProps) {
  const [tab, setTab] = useState<'all' | MWorkflowStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(initialWorkflowId || null);
  const [employeeFilter, setEmployeeFilter] = useState('all');

  const filtered = managerWorkflows.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.agent.toLowerCase().includes(search.toLowerCase()) ||
      w.assignedTo.toLowerCase().includes(search.toLowerCase());
    const matchEmployee = employeeFilter === 'all' || w.assignedTo === employeeFilter;
    const matchTab = tab === 'all' || w.status === tab;
    return matchSearch && matchEmployee && matchTab;
  });

  const selected = managerWorkflows.find(w => w.id === selectedId);

  const tabCounts = {
    all: managerWorkflows.length,
    running: managerWorkflows.filter(w => w.status === 'running').length,
    blocked: managerWorkflows.filter(w => w.status === 'blocked').length,
    scheduled: managerWorkflows.filter(w => w.status === 'scheduled').length,
    completed: managerWorkflows.filter(w => w.status === 'completed').length,
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* List */}
      <div className={`flex flex-col bg-white border-r border-border overflow-hidden transition-all ${selectedId ? 'w-[44%]' : 'flex-1'}`}>
        <div className="px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workflows..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <select value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-border rounded-lg focus:outline-none text-foreground">
              <option value="all">All Employees</option>
              {managerTeam.map(m => <option key={m.id} value={m.name}>{m.name.split(' ')[0]}</option>)}
            </select>
          </div>
          <div className="flex gap-0.5 overflow-x-auto">
            {([
              { key: 'all', label: 'All' },
              { key: 'running', label: 'Running' },
              { key: 'blocked', label: 'Blocked' },
              { key: 'scheduled', label: 'Scheduled' },
              { key: 'completed', label: 'Completed' },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-white shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'}`}>
                {t.label}
                {tabCounts[t.key] > 0 && (
                  <span className={`min-w-[18px] h-4 px-1 rounded-full text-xs flex items-center justify-center ${tab === t.key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    {tabCounts[t.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.map(wf => {
            const sc = statusConfig[wf.status];
            const isSelected = selectedId === wf.id;
            return (
              <div key={wf.id} onClick={() => setSelectedId(isSelected ? null : wf.id)}
                className={`px-4 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/20'} ${wf.status === 'blocked' ? 'bg-purple-50/20' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <AgentAvatar type={wf.agentType as any} name={wf.agent} size="sm" showStatus status="active" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{wf.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <UserAvatar initials={wf.assignedToInitials} name={wf.assignedTo} size="xs" color={wf.assignedToColor} />
                        <p className="text-xs text-muted-foreground">{wf.assignedTo.split(' ')[0]} · {wf.agent}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg}`} style={{ color: sc.color }}>{sc.label}</span>
                    {wf.humanDependencies > 0 && (
                      <span className="text-xs text-orange-600 flex items-center gap-1">
                        <Users className="w-3 h-3" />{wf.humanDependencies} pending
                      </span>
                    )}
                  </div>
                </div>
                {wf.status === 'running' && (
                  <div className="ml-9">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>{wf.completedTasks}/{wf.taskCount} steps</span>
                      <span>{wf.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${wf.progress}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 truncate">{wf.lastActivity}</p>
                  </div>
                )}
                {wf.status === 'blocked' && (
                  <div className="ml-9 flex items-start gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-purple-700 leading-relaxed">{wf.blockedReason}</span>
                  </div>
                )}
                {wf.status === 'scheduled' && (
                  <div className="ml-9 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">{wf.lastActivity}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <AgentAvatar type={selected.agentType as any} name={selected.agent} size="sm" showStatus status="active" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">{selected.title}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <UserAvatar initials={selected.assignedToInitials} name={selected.assignedTo} size="xs" color={selected.assignedToColor} />
                  <p className="text-xs text-muted-foreground">{selected.assignedTo} · via {selected.agent}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[selected.status].bg}`} style={{ color: statusConfig[selected.status].color }}>
                {statusConfig[selected.status].label}
              </span>
              <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Blocked alert */}
            {selected.status === 'blocked' && selected.blockedReason && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-purple-900 mb-1">Workflow Blocked</p>
                  <p className="text-sm text-purple-700">{selected.blockedReason}</p>
                  <button onClick={() => onNavigate('ai')} className="mt-2 text-xs text-purple-600 font-medium hover:underline">
                    Ask Command to help resolve →
                  </button>
                </div>
              </div>
            )}

            {/* Progress */}
            {selected.status === 'running' && (
              <div className="bg-white border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">Overall Progress</span>
                  <span className="text-sm font-semibold text-primary">{selected.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${selected.progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{selected.completedTasks} of {selected.taskCount} steps complete</span>
                  <span>{selected.lastActivity}</span>
                </div>
              </div>
            )}

            {/* Human dependencies */}
            {selected.humanDependencies > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5" /> {selected.humanDependencies} Human Action{selected.humanDependencies > 1 ? 's' : ''} Required
                </p>
                {selected.steps.filter(s => (s.status === 'active' || s.status === 'blocked') && s.assignee).map((s, i) => (
                  <div key={i} className="text-sm text-orange-700">
                    <span className="font-medium">{s.assignee}</span>: {s.label}
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About this Workflow</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
            </div>

            {/* Step timeline */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Workflow Steps</p>
              <div className="space-y-0">
                {selected.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {i < selected.steps.length - 1 && (
                      <div className="absolute left-[7px] top-5 w-px bg-border" style={{ height: 'calc(100% - 8px)' }} />
                    )}
                    <div className="flex-shrink-0 z-10 mt-0.5">{stepStatusIcons[step.status]}</div>
                    <div className={`flex-1 pb-4 ${i === selected.steps.length - 1 ? 'pb-0' : ''}`}>
                      <div className="flex items-center justify-between">
                        <p className={`text-sm ${step.status === 'done' ? 'text-foreground' : step.status === 'active' ? 'text-primary font-medium' : step.status === 'blocked' ? 'text-purple-700 font-medium' : 'text-muted-foreground'}`}>
                          {step.label}
                        </p>
                        {step.assignee && (
                          <span className="text-xs text-muted-foreground">{step.assignee}</span>
                        )}
                      </div>
                      {step.status === 'active' && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> In progress
                        </span>
                      )}
                      {step.status === 'blocked' && (
                        <span className="inline-flex items-center gap-1 text-xs text-purple-600 mt-0.5">
                          <AlertCircle className="w-3 h-3" /> Blocked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white border border-border rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Started</span>
                <span className="font-medium text-foreground">{new Date(selected.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              {selected.scheduledFor && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scheduled for</span>
                  <span className="font-medium text-yellow-600">{new Date(selected.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            <button onClick={() => onNavigate('ai')}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
              <Bot className="w-4 h-4" /> Ask Command about this workflow
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <GitBranch className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Select a workflow</h3>
          <p className="text-xs text-muted-foreground max-w-xs">View steps, progress, human dependencies, and blockers.</p>
        </div>
      )}
    </div>
  );
}
