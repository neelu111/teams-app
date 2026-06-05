import React, { useState } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, BarChart2,
  Download, FileText, CreditCard, Zap, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { SAScreen, billingData, tenants, platformMetrics } from '../superAdminData';

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

const fmt = (n: number) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const paymentStatus = (t: typeof tenants[0]) => {
  if (t.status === 'suspended') return { label: 'Failed', cls: 'bg-red-100 text-red-700' };
  if (t.status === 'trial') return { label: 'Trial', cls: 'bg-amber-100 text-amber-700' };
  if (t.status === 'churned') return { label: 'Churned', cls: 'bg-gray-100 text-gray-500' };
  return { label: 'Active', cls: 'bg-green-100 text-green-700' };
};

const modelColors = ['#5C5FEF', '#0EA5E9', '#10B981'];

export function SABillingScreen({ onNavigate }: { onNavigate: (screen: SAScreen, id?: string) => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'tenants' | 'model-costs' | 'invoices'>('overview');

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'tenants', label: 'Tenants' },
    { key: 'model-costs', label: 'Model Costs' },
    { key: 'invoices', label: 'Invoices' },
  ];

  const sortedTenants = [...tenants].sort((a, b) => b.mrr - a.mrr);
  const mrrMax = Math.max(...billingData.mrrByPlan.map(p => p.mrr));

  const modelData = [
    { name: 'Opus 4.7', calls: 84200, cost: 12840 },
    { name: 'Sonnet 4.6', calls: 148400, cost: 4820 },
    { name: 'Haiku 4.5', calls: 51600, cost: 760 },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Hidden SVG gradients */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="sa-bill-rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sa-bill-cost" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Tabs header */}
      <div className="bg-white border-b border-border px-6 flex-shrink-0">
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
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Monthly Recurring Revenue', value: fmt(52400), badge: '+12.4%', badgeCls: 'bg-green-100 text-green-700', icon: <DollarSign className="w-4 h-4" />, iconCls: 'bg-green-100 text-green-600' },
                { label: 'Annual Recurring Revenue', value: fmt(628800), icon: <TrendingUp className="w-4 h-4" />, iconCls: 'bg-sky-100 text-sky-600' },
                { label: 'Gross Margin', value: '64.8%', icon: <BarChart2 className="w-4 h-4" />, iconCls: 'bg-indigo-100 text-indigo-600' },
                { label: 'Model Cost MTD', value: fmt(18420), icon: <Zap className="w-4 h-4" />, iconCls: 'bg-amber-100 text-amber-600' },
              ].map(c => (
                <div key={c.label} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${c.iconCls}`}>{c.icon}</div>
                    {c.badge && <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.badgeCls}`}>{c.badge}</span>}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </div>
              ))}
            </div>

            {/* MRR by plan */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">MRR by Plan</h3>
              <div className="space-y-3">
                {billingData.mrrByPlan.map(p => (
                  <div key={p.plan} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-32 flex-shrink-0">{p.plan}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${mrrMax > 0 ? (p.mrr / mrrMax) * 100 : 0}%`, backgroundColor: p.color }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-20 text-right">
                      {p.mrr > 0 ? fmt(p.mrr) : 'Free'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dual area chart */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Revenue vs. Model Cost (6 months)</h3>
              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={billingData.revenueGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number, n: string) => [fmt(v), n === 'mrr' ? 'Revenue' : 'Cost']} />
                  <Area type="monotone" dataKey="mrr" stroke="#10B981" fill="url(#sa-bill-rev)" strokeWidth={2} name="mrr" />
                  <Area type="monotone" dataKey="cost" stroke="#EF4444" fill="url(#sa-bill-cost)" strokeWidth={2} name="cost" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-6 mt-3 justify-center">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-0.5 bg-green-500 inline-block rounded" />Revenue</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" />Model Cost</span>
              </div>
            </div>
          </>
        )}

        {/* REVENUE TAB */}
        {activeTab === 'revenue' && (
          <>
            <div className="bg-white border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">6-Month MRR Growth</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={billingData.revenueGrowth} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="sa-rev-area" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Area type="monotone" dataKey="mrr" stroke="#10B981" fill="url(#sa-rev-area)" strokeWidth={2} name="MRR" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Monthly Growth', value: '12.4%', cls: 'text-green-600' },
                { label: 'Churn Rate', value: '1.8%', cls: 'text-amber-600' },
                { label: 'Avg Revenue / Account', value: fmt(4367), cls: 'text-foreground' },
              ].map(c => (
                <div key={c.label} className="bg-white border border-border rounded-2xl p-5 text-center">
                  <p className={`text-2xl font-bold ${c.cls}`}>{c.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
                </div>
              ))}
            </div>
            {/* Top revenue tenants */}
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Top Revenue Tenants</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Tenant', 'Plan', 'MRR', 'Users', 'Joined'].map(h => (
                      <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedTenants.slice(0, 6).map(t => {
                    const { cls, label } = planBadge(t.plan);
                    return (
                      <tr key={t.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-5 py-3 font-medium text-foreground">{t.logo} {t.name}</td>
                        <td className="px-5 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cls}`}>{label}</span></td>
                        <td className="px-5 py-3 font-medium">{t.mrr > 0 ? fmt(t.mrr) : '—'}</td>
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

        {/* TENANTS TAB */}
        {activeTab === 'tenants' && (
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">All Tenants — Billing Status</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['Tenant', 'Plan', 'MRR', 'Users', 'API Calls MTD', 'Status', 'Payment'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tenants.map(t => {
                  const { cls: planCls, label: planLabel } = planBadge(t.plan);
                  const pay = paymentStatus(t);
                  const isFailed = t.status === 'suspended';
                  return (
                    <tr
                      key={t.id}
                      className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${isFailed ? 'bg-red-50/50' : ''}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{t.logo} {t.name}</td>
                      <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planCls}`}>{planLabel}</span></td>
                      <td className="px-4 py-3">{t.mrr > 0 ? fmt(t.mrr) : t.status === 'trial' ? 'Trial' : '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.users}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.apiCallsMTD > 0 ? t.apiCallsMTD.toLocaleString() : '—'}</td>
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
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${pay.cls} px-2 py-0.5 rounded-full w-fit`}>
                          {isFailed && <AlertTriangle className="w-3 h-3" />}
                          {pay.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MODEL COSTS TAB */}
        {activeTab === 'model-costs' && (
          <>
            <div className="grid grid-cols-3 gap-4">
              {[
                { name: 'Claude Opus 4.7', cost: 12840, calls: 84200, cls: 'border-t-indigo-500' },
                { name: 'Claude Sonnet 4.6', cost: 4820, calls: 148400, cls: 'border-t-sky-500' },
                { name: 'Claude Haiku 4.5', cost: 760, calls: 51600, cls: 'border-t-green-500' },
              ].map(m => (
                <div key={m.name} className={`bg-white border border-border rounded-2xl p-5 border-t-2 ${m.cls}`}>
                  <p className="text-sm font-semibold text-foreground">{m.name}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{fmt(m.cost)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.calls.toLocaleString()} calls this month</p>
                </div>
              ))}
            </div>
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Cost by Model</h3>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total MTD</p>
                  <p className="text-base font-bold text-foreground">{fmt(18420)}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={modelData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {modelData.map((_, i) => <Cell key={i} fill={modelColors[i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total MTD</p>
                  <p className="text-lg font-bold text-foreground">{fmt(18420)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Projected Next Month</p>
                  <p className="text-lg font-bold text-amber-600">{fmt(21400)}</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Invoice History</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                <FileText className="w-4 h-4" />
                Generate Invoice
              </button>
            </div>
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Month', 'Revenue', 'Costs', 'Margin', 'Status', 'Download'].map(h => (
                      <th key={h} className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billingData.invoices.map(inv => (
                    <tr key={inv.month} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3 font-medium text-foreground">{inv.month}</td>
                      <td className="px-5 py-3">{fmt(inv.revenue)}</td>
                      <td className="px-5 py-3">{fmt(inv.costs)}</td>
                      <td className="px-5 py-3">{inv.margin.toFixed(1)}%</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {inv.status === 'paid' ? 'Paid' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                          <Download className="w-3.5 h-3.5" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
