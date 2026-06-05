import React, { useState } from 'react';
import { Download, TrendingUp, Users, Activity, Shield, CheckCircle2, AlertTriangle, Zap } from 'lucide-react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { BAScreen, reportMetrics, systemMetrics, agentConfigs } from '../businessAdminData';

interface BAReportsProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

type ReportTab = 'agents' | 'workflows' | 'adoption' | 'health';

const AGENT_COLORS = ['#5C5FEF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];

const agentSuccessData = [
  { name: 'Sales',  successRate: 94.1 },
  { name: 'HR',   successRate: 98.7 },
  { name: 'Finance', successRate: 99.1 },
  { name: 'DevOps',   successRate: 95.8 },
  { name: 'Support',   successRate: 91.2 },
  { name: 'Marketing',  successRate: 96.8 },
];

const agentWorkflowData = [
  { name: 'Sales',  workflows: 421 },
  { name: 'HR',   workflows: 312 },
  { name: 'Finance', workflows: 289 },
  { name: 'DevOps',   workflows: 198 },
  { name: 'Support',   workflows: 634 },
  { name: 'Marketing',  workflows: 156 },
];

function KpiCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
          <Icon className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-xl font-bold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

function ExportButton() {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors">
      <Download className="w-3.5 h-3.5" />
      Export Report
    </button>
  );
}

const tooltipStyle = { contentStyle: { fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' } };

export function BAReportsScreen({ onNavigate }: BAReportsProps) {
  const [tab, setTab] = useState<ReportTab>('agents');

  const specialistAgents = agentConfigs.filter(a => a.type !== 'super');

  const tabs: { key: ReportTab; label: string; icon: React.ElementType }[] = [
    { key: 'agents',    label: 'Agent Performance',  icon: Zap },
    { key: 'workflows', label: 'Workflow Analytics', icon: Activity },
    { key: 'adoption',  label: 'User Adoption',      icon: Users },
    { key: 'health',    label: 'Platform Health',    icon: Shield },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Gradient defs — single hidden SVG at root */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="ba-rpt-area1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5C5FEF" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ba-rpt-area2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ba-rpt-line1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#8B5CF6" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Tab bar */}
      <div className="flex items-center gap-1 px-6 pt-5 pb-0 border-b border-border bg-white">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${tab === t.key ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">

        {/* ── AGENT PERFORMANCE ── */}
        {tab === 'agents' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Agent Performance</h2>
              <ExportButton />
            </div>

            {/* Agent metric cards */}
            <div className="grid grid-cols-3 gap-3">
              {specialistAgents.map(agent => (
                <div key={agent.id} className="bg-white border border-border rounded-2xl p-4">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: `${agent.color}18` }}>
                      {agent.emoji}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{agent.type}</p>
                    </div>
                    <div className="ml-auto">
                      <span className="text-lg font-bold text-foreground">{agent.successRate}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                    <div className="h-full rounded-full" style={{ width: `${agent.successRate}%`, backgroundColor: agent.color }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: 'Workflows',  value: agent.totalWorkflows.toString() },
                      { label: 'Avg. Time',  value: agent.avgResponseTime },
                      { label: 'Rate/Hr',    value: agent.rateLimitPerHour.toString() },
                    ].map(m => (
                      <div key={m.label}>
                        <p className="text-sm font-bold text-foreground">{m.value}</p>
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white border border-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Success Rate by Agent</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={agentSuccessData} {...tooltipStyle}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis domain={[85, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [`${v}%`, 'Success Rate']} />
                    <Bar dataKey="successRate" radius={[6, 6, 0, 0]} fill="#5C5FEF">
                      {agentSuccessData.map((_, i) => (
                        <Cell key={i} fill={AGENT_COLORS[i % AGENT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Workflows per Agent</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={agentWorkflowData} {...tooltipStyle}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                    <Tooltip {...tooltipStyle} formatter={(v: number) => [v, 'Workflows']} />
                    <Bar dataKey="workflows" radius={[6, 6, 0, 0]}>
                      {agentWorkflowData.map((_, i) => (
                        <Cell key={i} fill={AGENT_COLORS[i % AGENT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ── WORKFLOW ANALYTICS ── */}
        {tab === 'workflows' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Workflow Analytics</h2>
              <ExportButton />
            </div>

            {/* KPIs */}
            <div className="flex gap-3">
              <KpiCard label="Total This Week"  value="1,235"    sub="+8% vs last week"  icon={Activity}  color="#5C5FEF" />
              <KpiCard label="Success Rate"     value="96.4%"    sub="+2.1% vs last week" icon={CheckCircle2} color="#10B981" />
              <KpiCard label="Avg Duration"     value="2.8 min"  sub="–0.3 min vs last week" icon={TrendingUp} color="#F59E0B" />
              <KpiCard label="Blocked"          value="8"        sub="Awaiting approval"  icon={AlertTriangle} color="#F97316" />
            </div>

            {/* Weekly trend area */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Workflow Volume</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={reportMetrics.weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Area type="monotone" dataKey="workflows" name="Workflows" stroke="#5C5FEF" fill="url(#ba-rpt-area1)" strokeWidth={2} />
                  <Area type="monotone" dataKey="hoursaved" name="Hours Saved" stroke="#10B981" fill="url(#ba-rpt-area2)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Daily outcomes stacked bar */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Daily Workflow Outcomes</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={systemMetrics.weeklyWorkflows}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="success" name="Successful" fill="#10B981" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="blocked" name="Blocked"    fill="#F59E0B" stackId="a" />
                  <Bar dataKey="failed"  name="Failed"     fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── USER ADOPTION ── */}
        {tab === 'adoption' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">User Adoption</h2>
              <ExportButton />
            </div>

            {/* KPIs */}
            <div className="flex gap-3">
              <KpiCard label="Total Users"  value="47"    sub="Across all departments" icon={Users}      color="#5C5FEF" />
              <KpiCard label="Active Users" value="38"    sub="Used platform this week" icon={Activity}   color="#10B981" />
              <KpiCard label="Active Rate"  value="80.9%" sub="+5% vs last month"       icon={TrendingUp} color="#F59E0B" />
              <KpiCard label="MFA Coverage" value="64%"   sub="30 of 47 users"          icon={Shield}     color="#8B5CF6" />
            </div>

            {/* Department bar chart */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Users vs Active by Department</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={reportMetrics.adoptionByDept} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="dept" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="users"  name="Total Users"  fill="#5C5FEF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" name="Active Users" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Department table */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Department Breakdown</h3>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-border">
                    {['Department', 'Users', 'Active', 'Workflows', 'Avg Weekly'].map(col => (
                      <th key={col} className="px-4 py-2.5 text-left font-semibold text-muted-foreground">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reportMetrics.adoptionByDept.map(d => (
                    <tr key={d.dept} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">{d.dept}</td>
                      <td className="px-4 py-3 text-foreground">{d.users}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <span className="text-foreground">{d.active}</span>
                          <span className="text-muted-foreground">({Math.round((d.active / d.users) * 100)}%)</span>
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{d.workflows.toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground">{d.avgWeekly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PLATFORM HEALTH ── */}
        {tab === 'health' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-foreground">Platform Health</h2>
              <ExportButton />
            </div>

            {/* KPIs */}
            <div className="flex gap-3">
              <KpiCard label="Uptime"           value="99.97%"  sub="Last 30 days"           icon={Shield}     color="#10B981" />
              <KpiCard label="Avg API Response" value="1.4s"    sub="-0.2s vs last week"      icon={Activity}   color="#5C5FEF" />
              <KpiCard label="API Calls Today"  value="18,420"  sub="+18% vs yesterday"       icon={TrendingUp} color="#F59E0B" />
              <KpiCard label="Hours Automated"  value="847h"    sub="Month to date"           icon={Zap}        color="#8B5CF6" />
            </div>

            {/* API calls line chart */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">API Calls by Hour — Today</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={systemMetrics.agentActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="calls" name="API Calls" stroke="#8B5CF6" strokeWidth={2} dot={{ fill: '#8B5CF6', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Connector health */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Connector Health</h3>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-border">
                    {['Connector', 'Status', 'Latency', 'API Calls', 'Errors'].map(col => (
                      <th key={col} className="px-4 py-2.5 text-left font-semibold text-muted-foreground">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {systemMetrics.connectorHealth.map(c => (
                    <tr key={c.name} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${c.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                          <span className="capitalize text-foreground">{c.status}</span>
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={c.status === 'degraded' ? 'text-red-600 font-semibold' : 'text-foreground'}>{c.latency}</span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{c.calls.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={c.errors > 0 ? 'text-red-600 font-semibold' : 'text-muted-foreground'}>{c.errors}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Security summary */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Security Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'MFA Coverage',       value: '64%',  sub: '30 of 47 users',   color: '#8B5CF6' },
                  { label: 'SSO Users',           value: '38',   sub: 'Google SSO active', color: '#10B981' },
                  { label: 'Suspended Accounts',  value: '1',    sub: 'swapna@manexa.ai',  color: '#EF4444' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl p-4 border border-border">
                    <p className="text-xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
