import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Calendar, ChevronRight, Bot, X, GitBranch, Circle, AlertCircle } from 'lucide-react';
import { EScreen, EWorkflow, WorkflowStatus, employeeWorkflows } from '../employeeData';
import { AgentAvatar } from '../../shared/AgentAvatar';

const statusConfig: Record<WorkflowStatus, { label: string; color: string; bg: string; dot: string }> = {
  running:   { label: 'Running',   color: '#5C5FEF', bg: 'bg-indigo-50', dot: 'bg-indigo-500' },
  scheduled: { label: 'Scheduled', color: '#F59E0B', bg: 'bg-yellow-50', dot: 'bg-yellow-500' },
  completed: { label: 'Completed', color: '#10B981', bg: 'bg-green-50',  dot: 'bg-green-500' },
  failed:    { label: 'Failed',    color: '#EF4444', bg: 'bg-red-50',    dot: 'bg-red-500' },
};

const stepIcons = {
  done: <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />,
  active: <div className="w-4 h-4 rounded-full border-2 border-primary flex-shrink-0 relative"><div className="absolute inset-0.5 rounded-full bg-primary animate-pulse" /></div>,
  pending: <Circle className="w-4 h-4 text-border flex-shrink-0" />,
};

interface EWorkflowsScreenProps {
  onNavigate: (screen: EScreen, id?: string) => void;
  initialWorkflowId?: string;
}

export function EWorkflowsScreen({ onNavigate, initialWorkflowId }: EWorkflowsScreenProps) {
  const [tab, setTab] = useState<'all' | WorkflowStatus>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(initialWorkflowId || null);

  const tabs = [
    { key: 'all', label: 'All', count: employeeWorkflows.length },
    { key: 'running', label: 'Running', count: employeeWorkflows.filter(w => w.status === 'running').length },
    { key: 'scheduled', label: 'Scheduled', count: employeeWorkflows.filter(w => w.status === 'scheduled').length },
    { key: 'completed', label: 'Completed', count: employeeWorkflows.filter(w => w.status === 'completed').length },
  ];

  const filtered = employeeWorkflows.filter(w => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.agent.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    return tab === 'all' || w.status === tab;
  });

  const selected = employeeWorkflows.find(w => w.id === selectedId) || null;

  return (
    <div className="h-full flex overflow-hidden">
      {/* Workflow list */}
      <div className={`flex flex-col bg-white border-r border-border overflow-hidden transition-all ${selectedId ? 'w-[44%]' : 'flex-1'}`}>
        <div className="px-5 py-4 border-b border-border">
          <h1 className="text-sm font-semibold text-foreground mb-3">My Workflows</h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search workflows..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-3 py-2 border-b border-border bg-muted/20">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t.key ? 'bg-white shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label}
              {t.count > 0 && (
                <span className={`min-w-[18px] h-4 px-1 rounded-full text-xs flex items-center justify-center ${tab === t.key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <GitBranch className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No workflows found</p>
              <p className="text-xs text-muted-foreground">Ask Command to start a new workflow for you.</p>
            </div>
          ) : filtered.map(wf => {
            const sc = statusConfig[wf.status];
            const isSelected = selectedId === wf.id;
            return (
              <div key={wf.id}
                onClick={() => setSelectedId(isSelected ? null : wf.id)}
                className={`px-4 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/20'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <AgentAvatar type={wf.agentType as any} name={wf.agent} size="sm" showStatus status="active" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{wf.title}</p>
                      <p className="text-xs text-muted-foreground">{wf.agent}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${sc.bg}`} style={{ color: sc.color }}>
                    {sc.label}
                  </span>
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
                {wf.status === 'scheduled' && (
                  <div className="ml-9 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-xs text-muted-foreground">{wf.lastActivity}</span>
                  </div>
                )}
                {wf.status === 'completed' && (
                  <div className="ml-9 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs text-muted-foreground">{wf.lastActivity}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Workflow Detail */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <AgentAvatar type={selected.agentType as any} name={selected.agent} size="sm" showStatus status="active" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">{selected.title}</h2>
                <p className="text-xs text-muted-foreground">via {selected.agent} · {selected.taskCount} steps</p>
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

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Progress summary */}
            {selected.status === 'running' && (
              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">Overall Progress</span>
                  <span className="text-sm font-semibold text-primary">{selected.progress}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${selected.progress}%` }} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{selected.completedTasks} of {selected.taskCount} steps complete</span>
                  <span>{selected.lastActivity}</span>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About this workflow</h3>
              <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
            </div>

            {/* Timeline */}
            <div className="bg-white border border-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Workflow Timeline</h3>
              <div className="space-y-0">
                {selected.steps.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {i < selected.steps.length - 1 && (
                      <div className="absolute left-[7px] top-5 bottom-0 w-px bg-border" style={{ height: 'calc(100% - 8px)' }} />
                    )}
                    <div className="flex-shrink-0 z-10 mt-0.5">{stepIcons[step.status]}</div>
                    <div className={`flex-1 pb-4 ${i === selected.steps.length - 1 ? 'pb-0' : ''}`}>
                      <p className={`text-sm ${step.status === 'done' ? 'text-foreground' : step.status === 'active' ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                        {step.label}
                      </p>
                      {step.status === 'active' && (
                        <span className="inline-flex items-center gap-1 text-xs text-primary mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          In progress
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="bg-white border border-border rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Started</span>
                <span className="text-foreground font-medium">{new Date(selected.startedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
              {selected.completedAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="text-green-600 font-medium">{new Date(selected.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {selected.scheduledFor && !selected.completedAt && (
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Scheduled for</span>
                  <span className="text-yellow-600 font-medium">{new Date(selected.scheduledFor).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )}
            </div>

            {/* Ask AI about this workflow */}
            <button onClick={() => onNavigate('ai')}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
              <Bot className="w-4 h-4" />
              Ask Command about this workflow
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <GitBranch className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Select a workflow</h3>
          <p className="text-xs text-muted-foreground max-w-xs">Click any workflow to see its progress, timeline, and current status.</p>
        </div>
      )}
    </div>
  );
}
