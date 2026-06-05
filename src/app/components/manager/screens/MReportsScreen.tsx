import React, { useState } from 'react';
import { TrendingUp, Clock, CheckCircle2, Zap } from 'lucide-react';
import { MScreen, reportData, managerTeam } from '../managerData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend
} from 'recharts';

interface MReportsProps {
  onNavigate: (screen: MScreen, id?: string) => void;
}

type ReportTab = 'productivity' | 'workflows' | 'sla' | 'performance';

const tabLabels: Record<ReportTab, string> = {
  productivity: 'Productivity',
  workflows: 'Workflows',
  sla: 'SLA',
  performance: 'Team Performance',
};

export function MReportsScreen({ onNavigate }: MReportsProps) {
  const [tab, setTab] = useState<ReportTab>('productivity');

  const slaColors = { good: '#10B981', warn: '#F59E0B', poor: '#EF4444' };
  const getSlaColor = (v: number) => v >= 95 ? slaColors.good : v >= 85 ? slaColors.warn : slaColors.poor;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Hidden gradient defs */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="rpt-mgr-comp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5C5FEF" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rpt-mgr-saved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Tabs */}
      <div className="px-6 py-3 bg-white border-b border-border flex items-center gap-1 flex-shrink-0">
        {(Object.keys(tabLabels) as ReportTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/50'}`}>
            {tabLabels[t]}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <span>Jun 1 – Jun 2, 2026</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-background">
        {tab === 'productivity' && (
          <div className="space-y-5">
            {/* Summary KPIs */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Tasks Completed', value: '134', trend: '+12%', icon: CheckCircle2, color: '#10B981' },
                { label: 'Hours Saved by AI', value: '136h', trend: '+24%', icon: Zap, color: '#5C5FEF' },
                { label: 'Avg Completion Rate', value: '93%', trend: '+3%', icon: TrendingUp, color: '#0EA5E9' },
                { label: 'On-time Delivery', value: '91%', trend: '-2%', icon: Clock, color: '#F59E0B' },
              ].map(k => (
                <div key={k.label} className="bg-white border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: k.color + '15' }}>
                      <k.icon className="w-4 h-4" style={{ color: k.color }} />
                    </div>
                    <span className={`text-xs font-semibold ${k.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{k.trend} vs last week</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{k.value}</p>
                  <p className="text-xs text-muted-foreground">{k.label}</p>
                </div>
              ))}
            </div>

            {/* Weekly productivity chart */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Task Completion</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={reportData.productivityWeekly} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completed" name="Completed" fill="#5C5FEF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="assigned" name="Assigned" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="aiAssisted" name="AI Assisted" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Hours saved trend */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Hours Saved by AI — Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={reportData.hoursSavedTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                  <Area type="monotone" dataKey="hours" name="Hours Saved" stroke="#10B981" fill="url(#rpt-mgr-saved)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab === 'workflows' && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Workflows Run', value: '47', color: '#5C5FEF' },
                { label: 'Completed', value: '42', color: '#10B981' },
                { label: 'Currently Blocked', value: '2', color: '#EF4444' },
              ].map(s => (
                <div key={s.label} className="bg-white border border-border rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Workflows by Agent</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={reportData.workflowsByAgent} layout="vertical" barSize={14} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis type="category" dataKey="agent" tick={{ fontSize: 12, fill: '#64748B' }} width={40} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completed" name="Completed" fill="#10B981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="running" name="Running" fill="#5C5FEF" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="scheduled" name="Scheduled" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Human dependency insight */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-2">Human Dependency Analysis</h3>
              <p className="text-xs text-muted-foreground mb-4">Steps in active workflows waiting on human action</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Pending Reviews', value: 3, color: '#F97316' },
                  { label: 'Pending Approvals', value: 3, color: '#EF4444' },
                  { label: 'Avg Wait Time', value: '4.2h', color: '#5C5FEF' },
                ].map(s => (
                  <div key={s.label} className="text-center p-4 rounded-xl bg-muted/20">
                    <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'sla' && (
          <div className="space-y-5">
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">SLA Compliance by Category</h3>
              <div className="space-y-5">
                {reportData.slaCompliance.map(s => (
                  <div key={s.category}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.category}</p>
                        <p className="text-xs text-muted-foreground">Target: {s.target}h · Actual: {s.actual}h avg</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold" style={{ color: getSlaColor(s.compliance) }}>{s.compliance}%</p>
                        <p className="text-xs text-muted-foreground">compliance</p>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${s.compliance}%`, background: getSlaColor(s.compliance) }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Approval Response Times</h3>
                {[
                  { label: '< 1 hour', count: 2, pct: 40 },
                  { label: '1–4 hours', count: 1, pct: 20 },
                  { label: '4–24 hours', count: 1, pct: 20 },
                  { label: '> 24 hours', count: 1, pct: 20 },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground w-20 flex-shrink-0">{b.label}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${b.pct}%` }} />
                    </div>
                    <span className="text-xs font-medium text-foreground w-6 text-right">{b.count}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Escalation Rate</h3>
                {[
                  { label: 'Resolved < 4h', count: 3, pct: 60, color: '#10B981' },
                  { label: 'Resolved 4–24h', count: 1, pct: 20, color: '#F59E0B' },
                  { label: 'Unresolved > 24h', count: 1, pct: 20, color: '#EF4444' },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-3 mb-2">
                    <span className="text-xs text-muted-foreground w-28 flex-shrink-0">{b.label}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: b.color }} />
                    </div>
                    <span className="text-xs font-medium text-foreground w-4 text-right">{b.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'performance' && (
          <div className="space-y-5">
            {/* Per-employee table */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Individual Performance — June 2026</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider">
                      <th className="text-left px-5 py-2.5 font-semibold">Employee</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Completion</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Tasks Done</th>
                      <th className="text-right px-4 py-2.5 font-semibold">Hours Saved</th>
                      <th className="text-right px-4 py-2.5 font-semibold">AI Usage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reportData.teamPerformance.map((row, i) => {
                      const member = managerTeam[i];
                      return (
                        <tr key={row.name} className="hover:bg-muted/20 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              {member && <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: member.color }}>{member.initials}</div>}
                              <span className="font-medium text-foreground">{row.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-semibold" style={{ color: row.completionRate >= 95 ? '#10B981' : row.completionRate >= 88 ? '#F59E0B' : '#EF4444' }}>
                              {row.completionRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-foreground font-medium">{row.tasksCompleted}</td>
                          <td className="px-4 py-3 text-right text-foreground font-medium">{row.hoursaved}h</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{ width: `${row.aiUsage}%` }} />
                              </div>
                              <span className="text-xs text-foreground font-medium w-8">{row.aiUsage}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Comparison bar */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Task Velocity Comparison</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={reportData.teamPerformance} barGap={6}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="tasksCompleted" name="Tasks Completed" fill="#5C5FEF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hoursaved" name="Hours Saved" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
