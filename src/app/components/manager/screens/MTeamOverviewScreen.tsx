import React, { useState } from 'react';
import { TrendingUp, CheckCircle2, AlertCircle, Clock, GitBranch, Zap, ChevronRight } from 'lucide-react';
import { MScreen, managerTeam, managerWorkflows, managerTeamTasks } from '../managerData';
import { UserAvatar } from '../../shared/AgentAvatar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface MTeamOverviewProps {
  onNavigate: (screen: MScreen, id?: string) => void;
}

const statusColors = {
  active: { dot: 'bg-green-500', label: 'Active', text: 'text-green-600' },
  away:   { dot: 'bg-yellow-400', label: 'Away', text: 'text-yellow-600' },
  offline:{ dot: 'bg-gray-400', label: 'Offline', text: 'text-gray-500' },
};

export function MTeamOverviewScreen({ onNavigate }: MTeamOverviewProps) {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const selected = managerTeam.find(m => m.id === selectedMember);

  const radarData = managerTeam.map(m => ({
    member: m.name.split(' ')[0],
    Completion: m.completionRate,
    Workload: Math.min((m.taskCount / 10) * 100, 100),
    Velocity: Math.round((m.completedToday / Math.max(m.taskCount, 1)) * 100),
    'AI Usage': Math.floor(Math.random() * 40 + 60),
  }));

  const workloadBarData = managerTeam.map(m => ({
    name: m.name.split(' ')[0],
    tasks: m.taskCount,
    completed: m.completedToday,
    overdue: m.overdueCount,
    color: m.color,
  }));

  return (
    <div className="h-full overflow-y-auto bg-background p-6">
      {/* Hidden gradient defs */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="team-ov-wk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5C5FEF" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Team Members', value: managerTeam.length, icon: TrendingUp, color: '#5C5FEF' },
          { label: 'Tasks In Flight', value: managerTeamTasks.filter(t => t.status !== 'completed').length, icon: Clock, color: '#0EA5E9' },
          { label: 'Avg Completion', value: `${Math.round(managerTeam.reduce((s, m) => s + m.completionRate, 0) / managerTeam.length)}%`, icon: CheckCircle2, color: '#10B981' },
          { label: 'Active Workflows', value: managerWorkflows.filter(w => w.status === 'running').length, icon: GitBranch, color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + '15' }}>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Team member cards */}
        <div className="col-span-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Team Members</h2>
          <div className="grid grid-cols-2 gap-4">
            {managerTeam.map(member => {
              const sc = statusColors[member.status];
              const isSelected = selectedMember === member.id;
              const overdueTask = managerTeamTasks.find(t => t.assignee === member.name && t.status === 'overdue');
              const blockedTask = managerTeamTasks.find(t => t.assignee === member.name && t.status === 'blocked');
              return (
                <div key={member.id}
                  onClick={() => setSelectedMember(isSelected ? null : member.id)}
                  className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all hover:shadow-sm ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative">
                      <UserAvatar initials={member.initials} name={member.name} size="lg" color={member.color} />
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${sc.dot} border-2 border-white`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.role}</p>
                      <p className={`text-xs font-medium ${sc.text}`}>{sc.label}</p>
                    </div>
                    <button onClick={e => { e.stopPropagation(); onNavigate('employees', member.id); }}
                      className="p-1 rounded-lg hover:bg-muted transition-colors">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Current focus */}
                  <div className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2 mb-4 line-clamp-2 leading-relaxed">
                    {member.currentFocus}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: 'Tasks', value: member.taskCount },
                      { label: 'Done', value: member.completedToday },
                      { label: 'Rate', value: `${member.completionRate}%` },
                    ].map(m => (
                      <div key={m.label} className="text-center p-2 bg-muted/20 rounded-lg">
                        <p className="text-sm font-bold text-foreground">{m.value}</p>
                        <p className="text-xs text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Alerts */}
                  {(overdueTask || blockedTask) && (
                    <div className="space-y-1.5">
                      {overdueTask && (
                        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{overdueTask.title}</span>
                        </div>
                      )}
                      {blockedTask && (
                        <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg">
                          <AlertCircle className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">Blocked: {blockedTask.title}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {!overdueTask && !blockedTask && (
                    <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>On track</span>
                    </div>
                  )}

                  {/* Weekly mini chart */}
                  <div className="mt-3 flex items-end gap-1 h-8">
                    {member.weeklyTasks.map((d, i) => (
                      <div key={i} className="flex-1 flex items-end gap-0.5">
                        <div className="w-full rounded-sm" style={{ height: `${(d.total / 6) * 100}%`, background: '#E2E8F0' }} />
                        <div className="w-full rounded-sm" style={{ height: `${(d.completed / 6) * 100}%`, background: member.color }} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    {member.weeklyTasks.map(d => <span key={d.day}>{d.day}</span>)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: chart */}
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-2xl p-5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Workload Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workloadBarData} layout="vertical" barSize={12} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} width={42} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Bar dataKey="tasks" name="Total Tasks" fill="#E2E8F0" radius={[0, 4, 4, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#5C5FEF" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Selected member detail */}
          {selected && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                {selected.name.split(' ')[0]}'s Activity
              </h3>
              <div className="space-y-2">
                {selected.activityFeed.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: selected.color }} />
                    <div>
                      <p className="text-xs text-foreground">{a.label}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => onNavigate('employees', selected.id)}
                className="mt-4 w-full flex items-center justify-center gap-2 py-2 border border-border rounded-lg text-xs text-primary hover:bg-primary/5 transition-colors">
                Full profile <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {!selected && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Team SLA</h3>
              {[
                { label: 'Task Completion', value: 96, color: '#10B981' },
                { label: 'Approval Response', value: 88, color: '#F59E0B' },
                { label: 'Workflow on-time', value: 91, color: '#5C5FEF' },
                { label: 'Escalation Response', value: 84, color: '#0EA5E9' },
              ].map(s => (
                <div key={s.label} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold" style={{ color: s.color }}>{s.value}%</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.value}%`, background: s.color }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
