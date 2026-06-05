import React, { useState } from 'react';
import {
  CheckCircle2, Clock, GitBranch, Zap, ArrowRight, ChevronRight,
  AlertCircle, TrendingUp, Bot, Sparkles, Calendar, FileText,
  BarChart3, MessageSquare, Plus, Circle
} from 'lucide-react';
import { EScreen, employeeTasks, employeeWorkflows, employeeNotifications, employeeThreads } from '../employeeData';
import { AgentAvatar } from '../../shared/AgentAvatar';

const agentColors: Record<string, string> = {
  super: '#5C5FEF', sales: '#0EA5E9', hr: '#10B981', finance: '#F59E0B',
  operations: '#8B5CF6', support: '#EC4899', research: '#06B6D4',
};

const priorityColors = { urgent: '#EF4444', high: '#F97316', medium: '#F59E0B', low: '#10B981' };
const priorityDot: Record<string, string> = {
  urgent: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500',
};

interface EHomeScreenProps {
  onNavigate: (screen: EScreen, id?: string) => void;
  activeUser: { name: string; avatar: string; role: string; department?: string };
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export function EHomeScreen({ onNavigate, activeUser }: EHomeScreenProps) {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);
  const [rejectedIds, setRejectedIds] = useState<string[]>([]);

  const firstName = activeUser.name.split(' ')[0];
  const urgentTasks = employeeTasks.filter(t => t.status !== 'completed').slice(0, 4);
  const pendingApprovals = employeeTasks.filter(t => t.status === 'needs-action' || t.status === 'overdue').slice(0, 3);
  const runningWorkflows = employeeWorkflows.filter(w => w.status === 'running').slice(0, 3);
  const unreadNotifs = employeeNotifications.filter(n => !n.read);
  const recentThreads = employeeThreads.slice(0, 3);

  const quickActions = [
    { icon: Sparkles, label: 'New AI Request', desc: 'Chat with Command', action: () => onNavigate('ai'), color: '#5C5FEF' },
    { icon: FileText, label: 'Create Proposal', desc: 'Via Sales', action: () => onNavigate('ai'), color: '#0EA5E9' },
    { icon: BarChart3, label: 'Generate Report', desc: 'Pipeline or analysis', action: () => onNavigate('ai'), color: '#8B5CF6' },
    { icon: Calendar, label: 'Schedule Meeting', desc: 'With any contact', action: () => onNavigate('calendar'), color: '#10B981' },
  ];

  const deadlines = [
    { label: 'Today', items: employeeTasks.filter(t => t.dueDateLabel.includes('today') && t.status !== 'completed') },
    { label: 'Tomorrow', items: employeeTasks.filter(t => t.dueDateLabel.includes('tomorrow')) },
    { label: 'This Week', items: employeeTasks.filter(t => t.dueDateLabel.includes('Friday') || t.dueDateLabel.includes('Thu') || t.dueDateLabel.includes('Sat')) },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Welcome banner */}
      <div className="px-8 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #F0F1FE 0%, #FAF0FF 100%)' }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{getGreeting()}, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground mt-1">Tuesday, June 2, 2026 · {unreadNotifs.length} unread updates · {urgentTasks.filter(t => t.isOverdue).length} overdue items</p>
          </div>
          <button
            onClick={() => onNavigate('ai')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: 'linear-gradient(135deg, #5C5FEF, #8B5CF6)', boxShadow: '0 4px 14px rgba(92,95,239,0.35)' }}
          >
            <Sparkles className="w-4 h-4" />
            Ask Command
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Due Today', value: urgentTasks.filter(t => t.dueDateLabel.includes('today')).length, color: '#EF4444', icon: Clock, action: () => onNavigate('tasks') },
            { label: 'Needs Action', value: pendingApprovals.length, color: '#F97316', icon: AlertCircle, action: () => onNavigate('tasks') },
            { label: 'Active Workflows', value: runningWorkflows.length, color: '#5C5FEF', icon: GitBranch, action: () => onNavigate('workflows') },
            { label: 'Hours Saved', value: '6.2h', color: '#10B981', icon: TrendingUp, action: () => {} },
          ].map(stat => (
            <button key={stat.label} onClick={stat.action}
              className="bg-white rounded-xl p-4 text-left border border-white/80 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.color + '15' }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="text-xl font-semibold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(qa => (
              <button key={qa.label} onClick={qa.action}
                className="flex items-center gap-3 p-3.5 bg-white border border-border rounded-xl text-left hover:border-primary/30 hover:shadow-sm transition-all group">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: qa.color + '15' }}>
                  <qa.icon className="w-4 h-4" style={{ color: qa.color }} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-foreground">{qa.label}</div>
                  <div className="text-xs text-muted-foreground">{qa.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {/* Left column: Active Tasks + Recent Conversations */}
          <div className="col-span-2 space-y-5">
            {/* Active Tasks */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="text-sm font-semibold text-foreground">Active Tasks</h2>
                <button onClick={() => onNavigate('tasks')} className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-border">
                {urgentTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors group">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityDot[task.priority]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground truncate">{task.title}</span>
                        {task.isOverdue && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-medium flex-shrink-0">Overdue</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.agentName && (
                          <span className="text-xs text-muted-foreground">via {task.agentName}</span>
                        )}
                        {task.agentName && <span className="text-muted-foreground/40">·</span>}
                        <span className="text-xs text-muted-foreground">{task.dueDateLabel}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onNavigate('tasks', task.id)}
                        className="px-2.5 py-1.5 text-xs rounded-lg border border-border hover:bg-muted/50 text-muted-foreground transition-colors">
                        View
                      </button>
                      {(task.status === 'needs-action' || task.status === 'pending') && (
                        <button className="px-2.5 py-1.5 text-xs rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors">
                          Complete
                        </button>
                      )}
                    </div>
                    {!['needs-action', 'pending', 'overdue'].includes(task.status) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize flex-shrink-0">
                        {task.status}
                      </span>
                    )}
                    {task.status === 'needs-action' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 font-medium flex-shrink-0">
                        Action needed
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recent AI Conversations */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Recent AI Conversations</h2>
                </div>
                <button onClick={() => onNavigate('ai')} className="text-xs text-primary hover:underline flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="divide-y divide-border">
                {recentThreads.map(thread => (
                  <button key={thread.id} onClick={() => onNavigate('ai', thread.id)}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors text-left">
                    <AgentAvatar type={thread.agentType as any} name={thread.agentName} size="sm" showStatus status="active" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-sm font-medium text-foreground">{thread.title}</span>
                        <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{thread.timeLabel}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                    </div>
                    {thread.unread > 0 && (
                      <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
                <button onClick={() => onNavigate('ai')}
                  className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors text-left">
                  <div className="w-7 h-7 rounded-full border-2 border-dashed border-border flex items-center justify-center flex-shrink-0">
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <span className="text-sm text-muted-foreground">Start a new conversation with Command</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Pending Approvals */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
                <AlertCircle className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-foreground">Needs Your Action</h2>
              </div>
              <div className="divide-y divide-border">
                {pendingApprovals.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">All caught up!</p>
                  </div>
                ) : pendingApprovals.map(task => (
                  <div key={task.id} className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[task.priority]}`} />
                      <div>
                        <p className="text-xs font-medium text-foreground leading-snug">{task.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.dueDateLabel}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!approvedIds.includes(task.id) && !rejectedIds.includes(task.id) ? (
                        <>
                          <button
                            onClick={() => setApprovedIds(p => [...p, task.id])}
                            className="flex-1 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                            Approve
                          </button>
                          <button
                            onClick={() => setRejectedIds(p => [...p, task.id])}
                            className="flex-1 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/70 transition-colors">
                            Decline
                          </button>
                        </>
                      ) : approvedIds.includes(task.id) ? (
                        <div className="flex-1 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium text-center">✓ Approved</div>
                      ) : (
                        <div className="flex-1 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium text-center">✕ Declined</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workflow Progress */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Active Workflows</h2>
                </div>
                <button onClick={() => onNavigate('workflows')} className="text-xs text-primary hover:underline">All</button>
              </div>
              <div className="divide-y divide-border">
                {runningWorkflows.map(wf => (
                  <button key={wf.id} onClick={() => onNavigate('workflows', wf.id)}
                    className="w-full px-4 py-3 text-left hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-foreground truncate pr-2">{wf.title}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{wf.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1.5">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${wf.progress}%` }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">{wf.agent}</span>
                      <span className="text-muted-foreground/40 text-xs">·</span>
                      <span className="text-xs text-muted-foreground">{wf.completedTasks}/{wf.taskCount} tasks</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Upcoming Deadlines</h2>
              </div>
              <div className="p-3 space-y-2">
                {deadlines.map(group => group.items.length > 0 && (
                  <div key={group.label}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1">{group.label}</div>
                    {group.items.map(t => (
                      <button key={t.id} onClick={() => onNavigate('tasks', t.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors text-left">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[t.priority]}`} />
                        <span className="text-xs text-foreground truncate">{t.title}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
