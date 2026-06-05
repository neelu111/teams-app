import React, { useState } from 'react';
import {
  BarChart2, TrendingUp, Activity, DollarSign,
  Download, Zap
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { SAScreen, platformMetrics, billingData, tenants } from '../superAdminData';

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const planBadge = (plan: string) => {
  const map: Record<string, string> = {
    'enterprise-plus': 'bg-indigo-100 text-indigo-700',
    'enterprise': 'bg-sky-100 text-sky-700',
    'business': 'bg-green-100 text-green-700',
    'starter': 'bg-gray-100 text-gray-600',
  };
  const label: Record<string, string> = {
    'enterprise-plus': 'Enterprise+',
    'enterprise': 'Enterprise',
    'business': 'Business',
    'starter': 'Starter',
  };
  return { cls: map[plan] ?? 'bg-muted text-muted-foreground', label: label[plan] ?? plan };
};

const agentSuccessData = [
  { tenant: 'Manexa AI Labs', atlas: 97.3, sales: 94.1, finance: 99.1, support: 91.2 },
  { tenant: 'GlobalTech',   atlas: 96.8, sales: 93.4, finance: 94.2, support: 95.8 },
  { tenant: 'Meridian',     atlas: 98.1, sales: 95.3, finance: 99.8, support: 97.4 },
  { tenant: 'MarketingStar',     atlas: 97.5, sales: null,  finance: 99.4, support: null },
  { tenant: 'Apex Retail',  atlas: 96.2, sales: 92.8, finance: 95.1, support: 93.0 },
];

const rateCls = (v: number | null) => {
  if (v === null) return 'bg-muted text-muted-foreground';
  if (v >= 98) return 'bg-green-100 text-green-700';
  if (v >= 95) return 'bg-sky-100 text-sky-700';
  if (v >= 90) return 'bg-amber-100 text-amber-700';
  return 'bg-red-100 text-red-700';
};

const modelBarData = [
  { name: 'Opus 4.7',   calls: 84200,  color: '#5C5FEF' },
  { name: 'Sonnet 4.6', calls: 148400, color: '#0EA5E9' },
  { name: 'Haiku 4.5',  calls: 51600,  color: '#10B981' },
];

const uptimeCls = (u: number) => {
  if (u === 0) return 'text-muted-foreground';
  if (u >= 99.9) return 'text-green-600';
  if (u >= 99) return 'text-amber-600';
  return 'text-red-600';
};
const mfaCls = (m: number) => {
  if (m >= 90) return 'text-green-600';
  if (m >= 70) return 'text-amber-600';
  return 'text-red-600';
};

export function SAReportsScreen({ onNavigate }: { onNavigate: (screen: SAScreen, id?: string) => void }) {
  const [activeTab, setActiveTab] = useState<'platform' | 'agents' | 'revenue' | 'health'>('platform');

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'platform', label: 'Platform Usage' },
    { key: 'agents', label: 'Agent Performance' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'health', label: 'Tenant Health' },
  ];

  const sortedTenants = [...tenants].sort((a, b) => b.mrr - a.mrr);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Hidden SVG gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="sa-rpt-wf" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5C5FEF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sa-rpt-api" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sa-rpt-rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Tabs header */}
      <div className="bg-white border-b border-border px-6 flex-shrink-0 flex items-center justify-between">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === t.key ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {activeTab === 'health' && (
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">

        {/* PLATFORM USAGE TAB */}
        {activeTab === 'platform' && (
          <>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'API Calls Today', value: '284,200', icon: <Activity className="w-4 h-4 text-green-600" />, bg: 'bg-green-50' },
                { label: 'Workflows Today', value: '1,240', icon: <BarChart2 className="w-4 h-4 text-indigo-600" />, bg: 'bg-indigo-50' },
                { label: 'Active Tenants', value: '11', icon: <TrendingUp className="w-4 h-4 text-sky-600" />, bg: 'bg-sky-50' },
                { label: 'Hours Automated MTD', value: '14,820', icon: <Zap className="w-4 h-4 text-amber-600" />, bg: 'bg-amber-50' },
              ].map(c => (
                <div key={c.label} className="bg-white border border-border rounded-2xl p-5">
                  <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>{c.icon}</div>
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Hourly API Activity — Today</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={platformMetrics.hourlyActivity} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), 'API Calls']} />
                  <Area type="monotone" dataKey="calls" stroke="#10B981" fill="url(#sa-rpt-api)" strokeWidth={2} name="API Calls" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Weekly Workflow Outcomes</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={platformMetrics.weeklyWorkflows} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="success" name="Successful" fill="#10B981" stackId="a" />
                  <Bar dataKey="blocked" name="Blocked" fill="#F59E0B" stackId="a" />
                  <Bar dataKey="failed" name="Failed" fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-3 justify-center">
                {[['#10B981','Successful'],['#F59E0B','Blocked'],['#EF4444','Failed']].map(([c,l]) => (
                  <span key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: c }} />
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* AGENT PERFORMANCE TAB */}
        {activeTab === 'agents' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Claude Opus 4.7',   calls: 84200,  cost: 12840, cls: 'border-t-indigo-500' },
                { name: 'Claude Sonnet 4.6', calls: 148400, cost: 4820,  cls: 'border-t-sky-500' },
                { name: 'Claude Haiku 4.5',  calls: 51600,  cost: 760,   cls: 'border-t-green-500' },
              ].map(m => (
                <div key={m.name} className={`bg-white border border-border rounded-2xl p-5 border-t-2 ${m.cls}`}>
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{m.calls.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">calls · {fmt(m.cost)} cost</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">API Calls by Model</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={modelBarData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [v.toLocaleString(), 'Calls']} />
                  <Bar dataKey="calls" radius={[4, 4, 0, 0]}>
                    {modelBarData.map((m, i) => <Cell key={i} fill={m.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Cross-Tenant Success Rate */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Cross-Tenant Agent Success Rate</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">Tenant</th>
                    {['Command%', 'Sales%', 'Finance%', 'Support%'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-center text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agentSuccessData.map(row => (
                    <tr key={row.tenant} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{row.tenant}</td>
                      {[row.atlas, row.sales, row.finance, row.support].map((v, i) => (
                        <td key={i} className="px-4 py-3 text-center">
                          {v !== null
                            ? <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rateCls(v)}`}>{v.toFixed(1)}%</span>
                            : <span className="text-xs text-muted-foreground">—</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <>
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'MRR', value: fmt(52400), cls: 'text-foreground' },
                { label: 'ARR', value: fmt(628800), cls: 'text-foreground' },
                { label: 'Monthly Growth', value: '12.4%', cls: 'text-green-600' },
                { label: 'Churn Rate', value: '1.8%', cls: 'text-amber-600' },
              ].map(c => (
                <div key={c.label} className="bg-white border border-border rounded-2xl p-5 text-center">
                  <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">6-Month MRR Trend</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={billingData.revenueGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [fmt(v), 'MRR']} />
                  <Area type="monotone" dataKey="mrr" stroke="#F59E0B" fill="url(#sa-rpt-rev)" strokeWidth={2} name="MRR" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">MRR by Plan</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={billingData.mrrByPlan} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="plan" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => [fmt(v), 'MRR']} />
                  <Bar dataKey="mrr" radius={[4, 4, 0, 0]}>
                    {billingData.mrrByPlan.map((p, i) => <Cell key={i} fill={p.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top tenants by MRR */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Top Tenants by MRR</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    {['Tenant', 'Plan', 'MRR', 'Users', 'Joined'].map(h => (
                      <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedTenants.slice(0, 8).map(t => {
                    const { cls, label } = planBadge(t.plan);
                    return (
                      <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 font-medium text-foreground">{t.logo} {t.name}</td>
                        <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span></td>
                        <td className="px-5 py-3">{t.mrr > 0 ? fmt(t.mrr) : '—'}</td>
                        <td className="px-5 py-3 text-muted-foreground">{t.users}</td>
                        <td className="px-5 py-3 text-muted-foreground">{t.joinedDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* TENANT HEALTH TAB */}
        {activeTab === 'health' && (
          <>
            <p className="text-sm text-muted-foreground">
              Average uptime <span className="font-medium text-foreground">99.87%</span> · Average MFA <span className="font-medium text-foreground">78%</span>
            </p>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 border-b border-border">
                    {['Tenant', 'Plan', 'Status', 'Users', 'Agents', 'WF Today', 'Uptime', 'MFA', 'MRR'].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tenants.map(t => {
                    const { cls: planCls, label: planLabel } = planBadge(t.plan);
                    const isInactive = t.status === 'suspended' || t.status === 'churned';
                    return (
                      <tr
                        key={t.id}
                        className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${isInactive ? 'opacity-50' : ''}`}
                      >
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{t.logo} {t.name}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planCls}`}>{planLabel}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            t.status === 'active' ? 'bg-green-100 text-green-700' :
                            t.status === 'suspended' ? 'bg-red-100 text-red-700' :
                            t.status === 'trial' ? 'bg-amber-100 text-amber-700' :
                            'bg-gray-100 text-gray-500'
                          }`}>
                            {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{t.users}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.activeAgents}</td>
                        <td className="px-4 py-3 text-muted-foreground">{t.workflowsToday}</td>
                        <td className={`px-4 py-3 font-medium ${uptimeCls(t.uptime)}`}>
                          {t.uptime > 0 ? `${t.uptime}%` : '—'}
                        </td>
                        <td className={`px-4 py-3 font-medium ${mfaCls(t.mfaCoverage)}`}>
                          {t.mfaCoverage}%
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {t.mrr > 0 ? fmt(t.mrr) : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
