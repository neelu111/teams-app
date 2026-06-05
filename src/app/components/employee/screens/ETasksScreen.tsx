import React, { useState } from 'react';
import {
  CheckCircle2, Clock, AlertCircle, Search, Filter, ChevronDown,
  ChevronRight, Bot, Tag, X, HelpCircle, CheckCheck, Sparkles,
  ArrowUpRight, Circle
} from 'lucide-react';
import { EScreen, ETask, TaskStatus, TaskPriority, employeeTasks } from '../employeeData';
import { AgentAvatar } from '../../shared/AgentAvatar';

const priorityConfig: Record<TaskPriority, { label: string; color: string; bg: string; dot: string }> = {
  urgent: { label: 'Urgent', color: '#EF4444', bg: 'bg-red-50', dot: 'bg-red-500' },
  high:   { label: 'High',   color: '#F97316', bg: 'bg-orange-50', dot: 'bg-orange-500' },
  medium: { label: 'Medium', color: '#F59E0B', bg: 'bg-yellow-50', dot: 'bg-yellow-500' },
  low:    { label: 'Low',    color: '#10B981', bg: 'bg-green-50', dot: 'bg-green-500' },
};

const statusConfig: Record<TaskStatus, { label: string; color: string; bg: string }> = {
  'needs-action':  { label: 'Needs Action', color: '#F97316', bg: 'bg-orange-50' },
  'in-progress':   { label: 'In Progress',  color: '#5C5FEF', bg: 'bg-indigo-50' },
  'pending':       { label: 'Pending',       color: '#9CA3AF', bg: 'bg-muted' },
  'completed':     { label: 'Completed',     color: '#10B981', bg: 'bg-green-50' },
  'overdue':       { label: 'Overdue',       color: '#EF4444', bg: 'bg-red-50' },
};

const tabFilters = [
  { key: 'all', label: 'All Tasks' },
  { key: 'action', label: 'Needs Action' },
  { key: 'today', label: 'Due Today' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'completed', label: 'Completed' },
];

interface ETasksScreenProps {
  onNavigate: (screen: EScreen, id?: string) => void;
  initialTaskId?: string;
}

export function ETasksScreen({ onNavigate, initialTaskId }: ETasksScreenProps) {
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(initialTaskId || null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [tasks, setTasks] = useState<ETask[]>(employeeTasks);

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (tab === 'action') return t.status === 'needs-action';
    if (tab === 'today') return t.dueDateLabel.includes('today') && t.status !== 'completed';
    if (tab === 'overdue') return t.status === 'overdue';
    if (tab === 'completed') return t.status === 'completed' || completedIds.includes(t.id);
    return true;
  });

  const counts = {
    all: tasks.length,
    action: tasks.filter(t => t.status === 'needs-action').length,
    today: tasks.filter(t => t.dueDateLabel.includes('today') && t.status !== 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'completed', completedAt: new Date().toISOString() } : t));
    setCompletedIds(p => [...p, id]);
  };

  const selected = tasks.find(t => t.id === selectedId) || null;

  return (
    <div className="h-full flex overflow-hidden">
      {/* Task list */}
      <div className={`flex flex-col overflow-hidden border-r border-border bg-white transition-all ${selectedId ? 'w-[52%]' : 'flex-1'}`}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold text-foreground">My Tasks</h1>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{filtered.length} tasks</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text" placeholder="Search tasks..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-3 py-2 border-b border-border bg-muted/20 overflow-x-auto">
          {tabFilters.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${tab === t.key ? 'bg-white shadow-sm text-foreground border border-border' : 'text-muted-foreground hover:text-foreground'}`}>
              {t.label}
              {(counts as any)[t.key] > 0 && (
                <span className={`min-w-[18px] h-4 px-1 rounded-full text-xs flex items-center justify-center ${tab === t.key ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                  {(counts as any)[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <CheckCheck className="w-12 h-12 text-green-400 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                {tab === 'overdue' ? 'No overdue tasks!' : tab === 'action' ? 'No actions needed!' : 'All caught up!'}
              </p>
              <p className="text-xs text-muted-foreground">
                {tab === 'completed' ? 'No completed tasks yet.' : 'Great work keeping on top of things.'}
              </p>
            </div>
          ) : (
            filtered.map(task => {
              const isCompleted = task.status === 'completed' || completedIds.includes(task.id);
              const pc = priorityConfig[task.priority];
              const sc = statusConfig[task.status];
              const isSelected = selectedId === task.id;

              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedId(isSelected ? null : task.id)}
                  className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/20'}`}
                >
                  <button
                    onClick={e => !isCompleted && handleComplete(task.id, e)}
                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 border-green-500' : 'border-border hover:border-primary'}`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                        {task.title}
                      </span>
                      {task.isOverdue && !isCompleted && (
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium flex-shrink-0">Overdue</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${pc.bg} font-medium`} style={{ color: pc.color }}>
                        {pc.label}
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{task.dueDateLabel}</span>
                      {task.agentName && (
                        <>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">via {task.agentName}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {!isCompleted && (
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={e => { e.stopPropagation(); handleComplete(task.id, e); }}
                        className="p-1.5 rounded-lg text-xs text-green-600 hover:bg-green-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Mark complete"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); onNavigate('ai'); }}
                        className="p-1.5 rounded-lg text-xs text-primary hover:bg-primary/10 transition-colors"
                        title="Get AI help"
                      >
                        <Sparkles className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <ChevronRight className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Task Detail Panel */}
      {selected && (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between flex-shrink-0">
            <h2 className="text-sm font-semibold text-foreground">Task Details</h2>
            <button onClick={() => setSelectedId(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* Title + status */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <button
                  onClick={e => handleComplete(selected.id, e)}
                  className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selected.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-border hover:border-primary'}`}
                >
                  {selected.status === 'completed' && <CheckCircle2 className="w-3 h-3 text-white" />}
                </button>
                <h1 className="text-base font-semibold text-foreground leading-snug">{selected.title}</h1>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
            </div>

            {/* Meta */}
            <div className="bg-white border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Status</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[selected.status].bg}`} style={{ color: statusConfig[selected.status].color }}>
                  {statusConfig[selected.status].label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Priority</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityConfig[selected.priority].bg}`} style={{ color: priorityConfig[selected.priority].color }}>
                  {priorityConfig[selected.priority].label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Due Date</span>
                <span className={`text-xs font-medium ${selected.isOverdue ? 'text-red-600' : 'text-foreground'}`}>{selected.dueDateLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Category</span>
                <span className="text-xs font-medium text-foreground">{selected.category}</span>
              </div>
              {selected.agentName && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Assigned by</span>
                  <div className="flex items-center gap-1.5">
                    <AgentAvatar type={selected.agentType as any || 'super'} name={selected.agentName} size="xs" />
                    <span className="text-xs font-medium text-foreground">{selected.agentName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Workflow link */}
            {selected.workflowTitle && (
              <button
                onClick={() => onNavigate('workflows', selected.workflowId)}
                className="w-full flex items-center gap-3 p-4 bg-white border border-border rounded-xl text-left hover:border-primary/30 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">Source Workflow</div>
                  <div className="text-xs text-muted-foreground truncate">{selected.workflowTitle}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            {/* Tags */}
            {selected.tags && selected.tags.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">Tags</p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map(tag => (
                    <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              {selected.status !== 'completed' && (
                <button
                  onClick={e => handleComplete(selected.id, e)}
                  className="w-full py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Mark as Complete
                </button>
              )}
              <button
                onClick={() => onNavigate('ai')}
                className="w-full py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Get AI Help
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
