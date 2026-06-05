import React from 'react';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { GitBranch, CheckSquare, Bot, Users, ArrowUpRight, ArrowRight, Clock, AlertTriangle, CheckCircle2, Zap, TrendingUp } from 'lucide-react';
import { Screen } from '../types';
import { sampleWorkflows, sampleTasks, sampleAgents, sampleNotifications } from '../sampleData';
import { StatusBadge } from '../shared/StatusBadge';
import { AgentAvatar } from '../shared/AgentAvatar';

const activityData = [
  { time: '8AM', workflows: 2, tasks: 5 }, { time: '9AM', workflows: 5, tasks: 12 },
  { time: '10AM', workflows: 8, tasks: 18 }, { time: '11AM', workflows: 12, tasks: 23 },
  { time: '12PM', workflows: 10, tasks: 20 }, { time: '1PM', workflows: 7, tasks: 15 },
  { time: '2PM', workflows: 9, tasks: 19 }, { time: '3PM', workflows: 11, tasks: 22 },
];

const weekData = [
  { day: 'Mon', completed: 18 }, { day: 'Tue', completed: 24 },
  { day: 'Wed', completed: 21 }, { day: 'Thu', completed: 28 },
  { day: 'Fri', completed: 32 }, { day: 'Sat', completed: 8 }, { day: 'Sun', completed: 5 },
];

interface DashboardScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
  activeUser: { name: string; avatar: string; role: string };
}

function KpiCard({ icon: Icon, label, value, sub, color, trend }: { icon: React.ElementType; label: string; value: string; sub: string; color: string; trend?: string }) {
  return (
    <div className="bg-white rounded-xl border border-border p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center`} style={{ background: color + '18' }}>
          <Icon className="w-4.5 h-4.5" style={{ color }} />
        </div>
        {trend && (
          <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        <div className="text-xs font-medium text-foreground mt-0.5">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
      </div>
    </div>
  );
}

export function DashboardScreen({ onNavigate, activeUser }: DashboardScreenProps) {
  const runningWorkflows = sampleWorkflows.filter(w => w.status === 'running').length;
  const needsAction = sampleTasks.filter(t => t.status === 'needs-action').length;
  const unread = sampleNotifications.filter(n => !n.read).length;
  const activeAgents = sampleAgents.filter(a => a.status === 'active').length;

  const urgentItems = [
    ...sampleNotifications.filter(n => !n.read && n.priority === 'high').slice(0, 3),
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Good morning, {activeUser.name.split(' ')[0]} 👋</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Tuesday, June 2, 2026 · Here's what's happening across your workspace</p>
        </div>
        <button
          onClick={() => onNavigate('ai-assistant')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-all"
          style={{ background: 'linear-gradient(135deg, #5C5FEF, #8B5CF6)' }}
        >
          <Zap className="w-4 h-4" />
          Chat with Command
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4">
        <KpiCard icon={GitBranch} label="Active Workflows" value={String(runningWorkflows)} sub={`${sampleWorkflows.filter(w => w.status === 'needs-action').length} need approval`} color="#5C5FEF" trend="+12%" />
        <KpiCard icon={CheckSquare} label="Tasks Needing Action" value={String(needsAction)} sub="2 overdue, 1 critical" color="#EF4444" />
        <KpiCard icon={Bot} label="Agents Active" value={`${activeAgents}/${sampleAgents.length}`} sub="97.3% success rate today" color="#10B981" trend="+2.1%" />
        <KpiCard icon={Users} label="Team Members" value="127" sub="6 online now" color="#F59E0B" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Workflow Activity</h3>
              <p className="text-xs text-muted-foreground">Today's workflow and task volume</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500" />Workflows</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" />Tasks</span>
            </div>
          </div>
          <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
            <defs>
              <linearGradient id="dash-area-wf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5C5FEF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="dash-area-task" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
          </svg>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={activityData}>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
              <Area type="monotone" dataKey="workflows" stroke="#5C5FEF" strokeWidth={2} fill="url(#dash-area-wf)" name="Workflows" />
              <Area type="monotone" dataKey="tasks" stroke="#10B981" strokeWidth={2} fill="url(#dash-area-task)" name="Tasks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Summary */}
        <div className="bg-white rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Weekly Completions</h3>
              <p className="text-xs text-muted-foreground">Workflows completed per day</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={weekData} barSize={20}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
              <Bar dataKey="completed" fill="#5C5FEF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Workflows */}
        <div className="col-span-2 bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Recent Workflows</h3>
            <button onClick={() => onNavigate('workflows')} className="text-xs text-primary hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {sampleWorkflows.slice(0, 5).map(wf => (
              <button
                key={wf.id}
                onClick={() => onNavigate('workflow-detail', wf.id)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors text-left"
              >
                <AgentAvatar type={wf.agentType} name={wf.agent} size="sm" showStatus status="active" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{wf.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{wf.agent} · {wf.completedTasks}/{wf.taskCount} tasks</div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="w-16">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{wf.progress}%</span>
                    </div>
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${wf.progress}%`, background: wf.status === 'completed' ? '#10B981' : wf.status === 'blocked' ? '#EF4444' : '#5C5FEF' }} />
                    </div>
                  </div>
                  <StatusBadge status={wf.status} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Urgent Items + Agent Status */}
        <div className="space-y-4">
          {/* Urgent Items */}
          <div className="bg-white rounded-xl border border-border">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-semibold text-foreground">Needs Attention</h3>
            </div>
            <div className="divide-y divide-border">
              {urgentItems.map(notif => (
                <button key={notif.id} onClick={() => onNavigate('notifications')}
                  className="w-full px-4 py-3 text-left hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${notif.type === 'approval' ? 'bg-orange-500' : 'bg-red-500'}`} />
                    <span className="text-xs font-medium text-foreground">{notif.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{notif.message}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Agent Quick Status */}
          <div className="bg-white rounded-xl border border-border">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Agent Status</h3>
              <button onClick={() => onNavigate('agents')} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="p-3 space-y-1.5">
              {sampleAgents.map(agent => (
                <div key={agent.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                  <AgentAvatar type={agent.type} name={agent.name} size="xs" showStatus status={agent.status} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground">{agent.name}</div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{agent.workflowsToday}</span> today
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
