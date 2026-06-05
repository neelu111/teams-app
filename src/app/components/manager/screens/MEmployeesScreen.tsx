import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, GitBranch, TrendingUp, Mail, ChevronRight } from 'lucide-react';
import { MScreen, managerTeam, managerTeamTasks, managerWorkflows } from '../managerData';
import { UserAvatar } from '../../shared/AgentAvatar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MEmployeesProps {
  onNavigate: (screen: MScreen, id?: string) => void;
  initialEmployeeId?: string;
}

const statusConfig = {
  active:  { label: 'Active',   color: 'text-green-600',  dot: 'bg-green-500',  bg: 'bg-green-50' },
  away:    { label: 'Away',     color: 'text-yellow-600', dot: 'bg-yellow-400', bg: 'bg-yellow-50' },
  offline: { label: 'Offline',  color: 'text-gray-500',   dot: 'bg-gray-400',   bg: 'bg-gray-50' },
};

const taskStatusColors = {
  'needs-action': '#F97316',
  'overdue': '#EF4444',
  'in-progress': '#5C5FEF',
  'pending': '#94A3B8',
  'completed': '#10B981',
  'blocked': '#8B5CF6',
};

export function MEmployeesScreen({ onNavigate, initialEmployeeId }: MEmployeesProps) {
  const [selectedId, setSelectedId] = useState<string>(initialEmployeeId || managerTeam[0].id);
  const selected = managerTeam.find(m => m.id === selectedId)!;

  const memberTasks = managerTeamTasks.filter(t => t.assignee === selected.name);
  const memberWorkflows = managerWorkflows.filter(w => w.assignedTo === selected.name);
  const openTasks = memberTasks.filter(t => t.status !== 'completed');
  const overdueTasks = memberTasks.filter(t => t.status === 'overdue');
  const blockedTasks = memberTasks.filter(t => t.status === 'blocked');

  const weeklyChartData = selected.weeklyTasks.map(d => ({
    day: d.day,
    Completed: d.completed,
    Remaining: Math.max(d.total - d.completed, 0),
  }));

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Employee list */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-sm font-semibold text-foreground">Team Members</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{managerTeam.length} people</p>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {managerTeam.map(member => {
            const sc = statusConfig[member.status];
            const isSelected = selectedId === member.id;
            const overdueCount = managerTeamTasks.filter(t => t.assignee === member.name && t.status === 'overdue').length;
            const blockedCount = managerTeamTasks.filter(t => t.assignee === member.name && t.status === 'blocked').length;
            return (
              <div key={member.id} onClick={() => setSelectedId(member.id)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/20'}`}>
                <div className="relative">
                  <UserAvatar initials={member.initials} name={member.name} size="sm" color={member.color} />
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ${sc.dot} border-2 border-white`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>{member.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  {overdueCount > 0 && <span className="text-xs text-red-600 font-semibold">{overdueCount} ov.</span>}
                  {blockedCount > 0 && <span className="text-xs text-purple-600 font-semibold">{blockedCount} bl.</span>}
                  {!overdueCount && !blockedCount && <span className="text-xs text-green-600">✓</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Employee detail */}
      <div className="flex-1 overflow-y-auto bg-background">
        {/* Header */}
        <div className="px-8 pt-6 pb-5" style={{ background: 'linear-gradient(135deg, #F0F1FE 0%, #FAF0FF 100%)' }}>
          <div className="flex items-start gap-5">
            <div className="relative">
              <UserAvatar initials={selected.initials} name={selected.name} size="lg" color={selected.color} />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${statusConfig[selected.status].dot} border-2 border-white`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-semibold text-foreground">{selected.name}</h1>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[selected.status].bg} ${statusConfig[selected.status].color}`}>
                  {statusConfig[selected.status].label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{selected.role} · {selected.department}</p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />{selected.email}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Joined {selected.joinedDate}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onNavigate('ai')} className="px-4 py-2 bg-white border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/30 transition-colors">
                Message via AI
              </button>
              <button onClick={() => onNavigate('team-tasks')} className="px-4 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                View Tasks
              </button>
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-5 gap-3 mt-5">
            {[
              { label: 'Open Tasks', value: openTasks.length, color: '#5C5FEF' },
              { label: 'Completed Today', value: selected.completedToday, color: '#10B981' },
              { label: 'Overdue', value: overdueTasks.length, color: overdueTasks.length > 0 ? '#EF4444' : '#10B981' },
              { label: 'Completion Rate', value: `${selected.completionRate}%`, color: '#F59E0B' },
              { label: 'Hours This Week', value: `${selected.hoursThisWeek}h`, color: '#0EA5E9' },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl p-3.5 border border-white/80 text-center">
                <p className="text-xl font-bold" style={{ color: k.color }}>{k.value}</p>
                <p className="text-xs text-muted-foreground">{k.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 grid grid-cols-3 gap-5">
          {/* Tasks */}
          <div className="col-span-2 space-y-4">
            {/* Current focus */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Current Focus</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.currentFocus}</p>
            </div>

            {/* Active tasks */}
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Tasks</h3>
                <button onClick={() => onNavigate('team-tasks')} className="text-xs text-primary hover:underline">View all</button>
              </div>
              <div className="divide-y divide-border">
                {memberTasks.slice(0, 6).map(task => (
                  <div key={task.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: (taskStatusColors as any)[task.status] || '#94A3B8' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{task.title}</p>
                      <p className="text-xs text-muted-foreground">{task.category}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {task.isOverdue && <span className="text-xs text-red-600 font-semibold">Overdue</span>}
                      {task.status === 'blocked' && <span className="text-xs text-purple-600 font-semibold">Blocked</span>}
                      <span className="text-xs text-muted-foreground">{task.dueDateLabel}</span>
                    </div>
                  </div>
                ))}
                {memberTasks.length === 0 && (
                  <div className="px-5 py-8 text-center text-xs text-muted-foreground">No tasks assigned</div>
                )}
              </div>
            </div>

            {/* Active workflows */}
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Active Workflows ({memberWorkflows.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {memberWorkflows.slice(0, 4).map(wf => (
                  <div key={wf.id} onClick={() => onNavigate('team-workflows', wf.id)}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 cursor-pointer transition-colors">
                    <GitBranch className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{wf.title}</p>
                      <p className="text-xs text-muted-foreground">via {wf.agent}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {wf.status === 'blocked' && <span className="text-xs text-purple-600 font-semibold">Blocked</span>}
                      {wf.status === 'running' && (
                        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${wf.progress}%` }} />
                        </div>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
                {memberWorkflows.length === 0 && (
                  <div className="px-5 py-8 text-center text-xs text-muted-foreground">No active workflows</div>
                )}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Weekly chart */}
            <div className="bg-white border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Task Velocity — This Week</h3>
              <ResponsiveContainer width="100%" height={120}>
                <BarChart data={weeklyChartData} barSize={10} barGap={2}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                  <Bar dataKey="Completed" stackId="a" fill={selected.color} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Remaining" stackId="a" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Performance */}
            <div className="bg-white border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Performance</h3>
              {[
                { label: 'Completion Rate', value: selected.completionRate },
                { label: 'On-time Delivery', value: selected.completionRate - 4 },
                { label: 'AI Adoption', value: 78 },
                { label: 'Workflow Efficiency', value: 85 },
              ].map(p => (
                <div key={p.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{p.label}</span>
                    <span className="font-semibold" style={{ color: selected.color }}>{p.value}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${p.value}%`, background: selected.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <div className="bg-white border border-border rounded-xl p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {selected.activityFeed.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: selected.color }} />
                    <div>
                      <p className="text-xs text-foreground leading-relaxed">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
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
