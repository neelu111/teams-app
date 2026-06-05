import React, { useState } from 'react';
import { Search, Filter, AlertCircle, CheckCircle2, Clock, ChevronRight, X, Zap, GitBranch } from 'lucide-react';
import { MScreen, MTeamTask, MTaskStatus, MTaskPriority, managerTeamTasks, managerTeam } from '../managerData';
import { AgentAvatar, UserAvatar } from '../../shared/AgentAvatar';

const statusConfig: Record<MTaskStatus, { label: string; color: string; bg: string; dot: string }> = {
  pending:      { label: 'Pending',      color: '#94A3B8', bg: 'bg-slate-50',   dot: 'bg-slate-400' },
  'in-progress':{ label: 'In Progress',  color: '#5C5FEF', bg: 'bg-indigo-50',  dot: 'bg-indigo-500' },
  'needs-action':{ label: 'Needs Action',color: '#F97316', bg: 'bg-orange-50',  dot: 'bg-orange-500' },
  completed:    { label: 'Completed',    color: '#10B981', bg: 'bg-green-50',   dot: 'bg-green-500' },
  overdue:      { label: 'Overdue',      color: '#EF4444', bg: 'bg-red-50',     dot: 'bg-red-500' },
  blocked:      { label: 'Blocked',      color: '#8B5CF6', bg: 'bg-purple-50',  dot: 'bg-purple-500' },
};

const priorityConfig: Record<MTaskPriority, { color: string; label: string }> = {
  urgent: { color: '#EF4444', label: 'Urgent' },
  high:   { color: '#F97316', label: 'High' },
  medium: { color: '#F59E0B', label: 'Medium' },
  low:    { color: '#94A3B8', label: 'Low' },
};

interface MTeamTasksProps {
  onNavigate: (screen: MScreen, id?: string) => void;
}

type TabKey = 'all' | 'needs-action' | 'overdue' | 'blocked' | 'completed';

export function MTeamTasksScreen({ onNavigate }: MTeamTasksProps) {
  const [tab, setTab] = useState<TabKey>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [tasks, setTasks] = useState<MTeamTask[]>(managerTeamTasks);

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.assignee.toLowerCase().includes(search.toLowerCase());
    const matchEmployee = employeeFilter === 'all' || t.assignee === employeeFilter;
    const matchTab = tab === 'all' || t.status === tab;
    return matchSearch && matchEmployee && matchTab;
  });

  const selected = tasks.find(t => t.id === selectedId);

  const tabCounts: Record<TabKey, number> = {
    all: tasks.length,
    'needs-action': tasks.filter(t => t.status === 'needs-action').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleDelegate = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'in-progress' as MTaskStatus } : t));
  };

  function TaskRow({ task }: { task: MTeamTask }) {
    const sc = statusConfig[task.status];
    const pc = priorityConfig[task.priority];
    const isSelected = selectedId === task.id;
    return (
      <div onClick={() => setSelectedId(isSelected ? null : task.id)}
        className={`flex items-center gap-3 px-5 py-3.5 border-b border-border hover:bg-muted/20 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : ''} ${task.status === 'blocked' ? 'bg-purple-50/30' : task.status === 'overdue' ? 'bg-red-50/30' : ''}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${sc.dot}`} />
        <UserAvatar initials={task.assigneeInitials} name={task.assignee} size="xs" color={task.assigneeColor} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
            {task.isOverdue && <span className="text-xs text-red-600 font-semibold flex-shrink-0">OVERDUE</span>}
            {task.status === 'blocked' && <span className="text-xs text-purple-600 font-semibold flex-shrink-0">BLOCKED</span>}
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
            <span>{task.assignee}</span>
            <span>·</span>
            <span>{task.category}</span>
            {task.agentName && <><span>·</span><span className="text-primary">via {task.agentName}</span></>}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sc.bg}`} style={{ color: sc.color }}>{sc.label}</span>
          <span className="text-xs" style={{ color: pc.color }}>●</span>
          <span className="text-xs text-muted-foreground w-24 text-right">{task.dueDateLabel}</span>
          {task.completionRate !== undefined && (
            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${task.completionRate}%` }} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Task list */}
      <div className={`flex flex-col overflow-hidden transition-all ${selectedId ? 'w-[55%]' : 'flex-1'}`}>
        {/* Header */}
        <div className="px-5 py-4 bg-white border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks or employees..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <select value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)}
              className="px-3 py-2 text-xs bg-white border border-border rounded-lg focus:outline-none text-foreground">
              <option value="all">All Employees</option>
              {managerTeam.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>
          <div className="flex gap-1">
            {([
              { key: 'all', label: 'All' },
              { key: 'needs-action', label: 'Needs Action' },
              { key: 'overdue', label: 'Overdue' },
              { key: 'blocked', label: 'Blocked' },
              { key: 'completed', label: 'Completed' },
            ] as const).map(t => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${tab === t.key ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/50'}`}>
                {t.label}
                {tabCounts[t.key] > 0 && (
                  <span className={`min-w-[18px] h-4 px-1 rounded-full text-xs flex items-center justify-center ${tab === t.key ? 'bg-white/30' : 'bg-muted text-muted-foreground'}`}>
                    {tabCounts[t.key]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* List header */}
        <div className="flex items-center gap-3 px-5 py-2 bg-muted/30 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <span className="w-1.5" />
          <span className="w-7" />
          <span className="flex-1">Task</span>
          <span className="flex-shrink-0 flex gap-8 pr-1">
            <span>Status</span>
            <span>Priority</span>
            <span className="w-24 text-right">Due</span>
            <span className="w-16">Progress</span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto bg-white">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">No tasks found</p>
              <p className="text-xs text-muted-foreground">Try adjusting your filters.</p>
            </div>
          ) : filtered.map(t => <TaskRow key={t.id} task={t} />)}
        </div>
      </div>

      {/* Task detail panel */}
      {selected && (
        <div className="flex-1 flex flex-col overflow-hidden bg-background border-l border-border">
          <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <UserAvatar initials={selected.assigneeInitials} name={selected.assignee} size="sm" color={selected.assigneeColor} />
              <div>
                <p className="text-sm font-semibold text-foreground">{selected.title}</p>
                <p className="text-xs text-muted-foreground">Assigned to {selected.assignee}</p>
              </div>
            </div>
            <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusConfig[selected.status].bg}`} style={{ color: statusConfig[selected.status].color }}>
                {statusConfig[selected.status].label}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted" style={{ color: priorityConfig[selected.priority].color }}>
                {priorityConfig[selected.priority].label} Priority
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground">{selected.category}</span>
              {selected.isOverdue && <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-600">OVERDUE</span>}
            </div>

            {/* Description */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Description</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
            </div>

            {/* Meta */}
            <div className="bg-white border border-border rounded-xl p-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                {[
                  { label: 'Assignee', value: selected.assignee },
                  { label: 'Due Date', value: selected.dueDateLabel },
                  { label: 'Category', value: selected.category },
                  { label: 'Agent', value: selected.agentName || 'None' },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-muted-foreground mb-0.5">{f.label}</p>
                    <p className="font-medium text-foreground">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Blockers */}
            {selected.blockers && selected.blockers.length > 0 && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Blockers
                </p>
                {selected.blockers.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-purple-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            {selected.completionRate !== undefined && (
              <div className="bg-white border border-border rounded-xl p-4">
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-semibold text-muted-foreground uppercase tracking-wider">Progress</span>
                  <span className="font-semibold text-primary">{selected.completionRate}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${selected.completionRate}%` }} />
                </div>
              </div>
            )}

            {/* Related workflow */}
            {selected.workflowId && (
              <button onClick={() => onNavigate('team-workflows', selected.workflowId)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground font-medium">{selected.workflowTitle || 'View workflow'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button onClick={() => onNavigate('ai')} className="flex items-center gap-2 flex-1 justify-center py-2.5 border border-border rounded-xl text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-all">
                <Zap className="w-3.5 h-3.5" /> Get AI Help
              </button>
              {selected.status === 'blocked' || selected.status === 'overdue' ? (
                <button onClick={() => handleDelegate(selected.id)} className="flex items-center gap-2 flex-1 justify-center py-2.5 bg-primary text-white rounded-xl text-xs font-medium hover:opacity-90 transition-opacity">
                  Unblock Task
                </button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
