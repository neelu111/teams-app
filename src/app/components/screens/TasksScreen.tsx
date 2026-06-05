import React, { useState } from 'react';
import { Search, Filter, ChevronRight, Clock, AlertCircle, CheckCircle2, Circle, RefreshCw, X, Calendar } from 'lucide-react';
import { Screen } from '../types';
import { sampleTasks } from '../sampleData';
import { StatusBadge, PriorityBadge } from '../shared/StatusBadge';
import { AgentAvatar, UserAvatar } from '../shared/AgentAvatar';

interface TasksScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
}

const statusColumns = [
  { key: 'needs-action', label: 'Needs Action', color: '#F97316', bgColor: '#FFF7ED' },
  { key: 'running', label: 'Running', color: '#3B82F6', bgColor: '#EFF6FF' },
  { key: 'waiting', label: 'Waiting', color: '#F59E0B', bgColor: '#FFFBEB' },
  { key: 'scheduled', label: 'Scheduled', color: '#8B5CF6', bgColor: '#F5F3FF' },
  { key: 'completed', label: 'Completed', color: '#10B981', bgColor: '#ECFDF5' },
  { key: 'blocked', label: 'Blocked', color: '#EF4444', bgColor: '#FEF2F2' },
];

const taskStatusIcon: Record<string, React.ReactNode> = {
  'needs-action': <AlertCircle className="w-3.5 h-3.5 text-orange-500" />,
  running: <RefreshCw className="w-3.5 h-3.5 text-blue-500 animate-spin" />,
  waiting: <Clock className="w-3.5 h-3.5 text-amber-500" />,
  scheduled: <Calendar className="w-3.5 h-3.5 text-purple-500" />,
  completed: <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />,
  blocked: <X className="w-3.5 h-3.5 text-red-500" />,
  draft: <Circle className="w-3.5 h-3.5 text-muted-foreground" />,
};

export function TasksScreen({ onNavigate }: TasksScreenProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');

  const filtered = sampleTasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.assignee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-3 bg-white border-b border-border flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg overflow-hidden">
          <button onClick={() => setView('kanban')} className={`px-3 py-1.5 transition-colors ${view === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
            Kanban
          </button>
          <button onClick={() => setView('list')} className={`px-3 py-1.5 transition-colors ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
            List
          </button>
        </div>
        <div className="relative ml-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-48" />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors ml-1">
          <Filter className="w-3.5 h-3.5" /> Filter
        </button>
        <div className="ml-auto flex items-center gap-4 text-xs">
          {statusColumns.map(col => (
            <span key={col.key} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
              <span className="text-muted-foreground">{col.label}</span>
              <span className="font-medium text-foreground">{filtered.filter(t => t.status === col.key).length}</span>
            </span>
          ))}
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
          <div className="flex gap-3 h-full min-w-max">
            {statusColumns.map(col => {
              const colTasks = filtered.filter(t => t.status === col.key);
              return (
                <div key={col.key} className="w-72 flex flex-col rounded-xl border border-border overflow-hidden" style={{ background: col.bgColor + '40' }}>
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border" style={{ background: col.bgColor }}>
                    <div className="flex items-center gap-2">
                      {taskStatusIcon[col.key]}
                      <span className="text-xs font-semibold" style={{ color: col.color }}>{col.label}</span>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white border border-border" style={{ color: col.color }}>{colTasks.length}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {colTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => onNavigate('task-detail', task.id)}
                        className="w-full bg-white border border-border rounded-xl p-3 text-left hover:border-primary/30 hover:shadow-sm transition-all group"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-xs font-medium text-foreground leading-snug">{task.title}</p>
                          <PriorityBadge priority={task.priority} />
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <UserAvatar initials={task.assignee.split(' ').map(n => n[0]).join('')} name={task.assignee} size="xs" />
                            <span className="text-xs text-muted-foreground truncate max-w-[80px]">{task.assignee.split(' ')[0]}</span>
                          </div>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {new Date(task.due).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </span>
                        </div>
                        {task.agent && (
                          <div className="mt-2 pt-2 border-t border-border flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="text-xs">Via {task.agent}</span>
                          </div>
                        )}
                      </button>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="flex items-center justify-center py-8">
                        <p className="text-xs text-muted-foreground/50">No tasks</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-muted/40 border-b border-border">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground">Task</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Assignee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Due</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {filtered.map(task => (
                <tr key={task.id} onClick={() => onNavigate('task-detail', task.id)} className="hover:bg-muted/20 cursor-pointer">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      {taskStatusIcon[task.status]}
                      <span className="text-sm font-medium text-foreground">{task.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar initials={task.assignee.split(' ').map(n => n[0]).join('')} name={task.assignee} size="xs" />
                      <span className="text-xs text-foreground">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={task.priority} /></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(task.due).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{task.agent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
