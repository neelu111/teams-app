import React, { useState } from 'react';
import { BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Download, Calendar, Filter, TrendingUp, TrendingDown, CheckCircle2, Clock, AlertCircle, Users } from 'lucide-react';
import { Screen } from '../types';
import { AgentAvatar } from '../shared/AgentAvatar';
import { sampleAgents } from '../sampleData';

interface ReportsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const workflowByAgent = [
  { agent: 'Sales', completed: 421, failed: 24, running: 8 },
  { agent: 'Support', completed: 634, failed: 55, running: 12 },
  { agent: 'Finance', completed: 289, failed: 3, running: 6 },
  { agent: 'HR', completed: 312, failed: 4, running: 5 },
  { agent: 'DevOps', completed: 198, failed: 9, running: 3 },
  { agent: 'Marketing', completed: 156, failed: 6, running: 2 },
];

const weeklyTrend = [
  { week: 'W1 May', workflows: 145, tasks: 412 },
  { week: 'W2 May', workflows: 162, tasks: 489 },
  { week: 'W3 May', workflows: 178, tasks: 521 },
  { week: 'W4 May', workflows: 203, tasks: 598 },
  { week: 'W1 Jun', workflows: 189, tasks: 547 },
  { week: 'W2 Jun', workflows: 234, tasks: 671 },
];

const statusDist = [
  { name: 'Completed', value: 1847, color: '#10B981' },
  { name: 'Running', value: 45, color: '#5C5FEF' },
  { name: 'Failed', value: 101, color: '#EF4444' },
  { name: 'Cancelled', value: 67, color: '#9CA3AF' },
];

const agentPerf = [
  { name: 'Finance', rate: 99.1, color: '#F59E0B' },
  { name: 'HR', rate: 98.7, color: '#10B981' },
  { name: 'Marketing', rate: 96.2, color: '#06B6D4' },
  { name: 'DevOps', rate: 95.8, color: '#8B5CF6' },
  { name: 'Sales', rate: 94.1, color: '#0EA5E9' },
  { name: 'Support', rate: 91.4, color: '#EC4899' },
];

function MetricCard({ label, value, sub, icon: Icon, color, trend }: any) {
  return (
    <div className="bg-white border border-border rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: color + '18' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-semibold text-foreground">{value}</div>
      <div className="text-xs font-medium text-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
    </div>
  );
}

export function ReportsScreen({ onNavigate }: ReportsScreenProps) {
  const [period, setPeriod] = useState('This Month');
  const periods = ['Today', 'This Week', 'This Month', 'Q2 2026', 'All Time'];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-3 bg-white border-b border-border flex items-center gap-3">
        <div className="flex gap-1">
          {periods.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60'}`}>
              {p}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          <MetricCard label="Total Workflows" value="2,060" sub="All-time executions" icon={CheckCircle2} color="#5C5FEF" trend={18} />
          <MetricCard label="Success Rate" value="97.3%" sub="Across all agents" icon={TrendingUp} color="#10B981" trend={2.1} />
          <MetricCard label="Avg Completion Time" value="24m" sub="Down from 31m last month" icon={Clock} color="#F59E0B" trend={-23} />
          <MetricCard label="Human Interventions" value="127" sub="Approvals + escalations" icon={Users} color="#EC4899" trend={-8} />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-4">
          {/* Weekly Trend */}
          <div className="col-span-2 bg-white border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Workflow Volume Trend</h3>
                <p className="text-xs text-muted-foreground">Last 6 weeks — workflows and tasks executed</p>
              </div>
            </div>
            <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
              <defs>
                <linearGradient id="rpt-trend-wf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5C5FEF" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="rpt-trend-task" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={weeklyTrend}>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Area type="monotone" dataKey="workflows" stroke="#5C5FEF" strokeWidth={2} fill="url(#rpt-trend-wf)" name="Workflows" />
                <Area type="monotone" dataKey="tasks" stroke="#10B981" strokeWidth={2} fill="url(#rpt-trend-task)" name="Tasks" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Status Distribution */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Status Distribution</h3>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie data={statusDist} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {statusDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {statusDist.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span className="text-xs text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{s.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Workflows by Agent</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={workflowByAgent} barSize={12}>
                <XAxis dataKey="agent" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #E5E7EB' }} />
                <Bar dataKey="completed" fill="#10B981" radius={[3, 3, 0, 0]} name="Completed" stackId="a" />
                <Bar dataKey="failed" fill="#EF4444" radius={[3, 3, 0, 0]} name="Failed" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Agent Success Rates</h3>
            <div className="space-y-3">
              {agentPerf.map(a => (
                <div key={a.name} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-foreground w-10">{a.name}</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${a.rate}%`, background: a.color }} />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-12 text-right">{a.rate}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
