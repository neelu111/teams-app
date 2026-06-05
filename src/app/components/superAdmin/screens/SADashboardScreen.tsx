import React from 'react';
import {
  Building2, Users, Zap, GitBranch, Activity, DollarSign,
  Shield, TrendingUp,
} from 'lucide-react';
import { SAScreen, platformMetrics, tenants, securityEvents, billingData } from '../superAdminData';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

interface SADashboardScreenProps {
  onNavigate: (screen: SAScreen, id?: string) => void;
  activeUser: { name: string; avatar: string; role: string };
}

function planBadgeClass(plan: string) {
  switch (plan) {
    case 'enterprise-plus': return 'bg-indigo-100 text-indigo-700';
    case 'enterprise':      return 'bg-sky-100 text-sky-700';
    case 'business':        return 'bg-green-100 text-green-700';
    case 'starter':         return 'bg-gray-100 text-gray-600';
    case 'trial':           return 'border border-amber-300 text-amber-700 bg-amber-50';
    default:                return 'bg-gray-100 text-gray-600';
  }
}

function planBadgeLabel(plan: string) {
  switch (plan) {
    case 'enterprise-plus': return 'Ent+';
    case 'enterprise':      return 'Enterprise';
    case 'business':        return 'Business';
    case 'starter':         return 'Starter';
    case 'trial':           return 'Trial';
    default:                return plan;
  }
}

export function SADashboardScreen({ onNavigate, activeUser }: SADashboardScreenProps) {
  const firstName = activeUser.name.split(' ')[0];

  const kpiCards = [
    {
      label: 'Total Tenants',
      value: '12',
      sub: '11 active',
      icon: Building2,
      iconColor: '#3B82F6',
      iconBg: 'bg-blue-50',
      onClick: () => onNavigate('tenants'),
    },
    {
      label: 'Platform Users',
      value: '847',
      sub: '691 active',
      icon: Users,
      iconColor: '#10B981',
      iconBg: 'bg-green-50',
      onClick: () => onNavigate('users'),
    },
    {
      label: 'AI Agents',
      value: '84',
      sub: '79 running',
      icon: Zap,
      iconColor: '#5C5FEF',
      iconBg: 'bg-indigo-50',
      onClick: () => onNavigate('agent-oversight'),
    },
    {
      label: 'Workflows Today',
      value: '1,240',
      sub: 'platform-wide',
      icon: GitBranch,
      iconColor: '#0EA5E9',
      iconBg: 'bg-sky-50',
      onClick: () => onNavigate('agent-oversight'),
    },
    {
      label: 'API Calls Today',
      value: '284,200',
      sub: '↑ 22% vs yesterday',
      icon: Activity,
      iconColor: '#8B5CF6',
      iconBg: 'bg-purple-50',
      onClick: () => onNavigate('reports'),
    },
    {
      label: 'Model Cost MTD',
      value: '$18,420',
      sub: '3 models',
      icon: DollarSign,
      iconColor: '#F59E0B',
      iconBg: 'bg-amber-50',
      onClick: () => onNavigate('billing'),
    },
  ];

  const topTenants = [...tenants]
    .sort((a, b) => b.workflowsToday - a.workflowsToday)
    .slice(0, 6);

  const maxMrr = Math.max(...billingData.mrrByPlan.map(p => p.mrr));

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Hidden SVG gradients */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="sa-dash-api" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#5C5FEF" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="sa-dash-rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#10B981" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <div
        className="px-8 pt-7 pb-5"
        style={{ background: 'linear-gradient(135deg, #0F1117 0%, #1E1B4B 100%)' }}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Welcome back, {firstName}</h1>
            <p className="text-sm text-white/50 mt-0.5">Super Admin · Platform Overview · June 2, 2026</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Platform operational pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-white/20 rounded-lg shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-gray-800">Platform: Operational</span>
            </div>
            {/* MRR pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 rounded-lg shadow-sm">
              <span className="text-xs font-semibold text-white">MRR $52,400</span>
            </div>
          </div>
        </div>

        {/* KPI grid */}
        <div className="grid grid-cols-6 gap-3">
          {kpiCards.map(k => (
            <div
              key={k.label}
              onClick={k.onClick}
              className="bg-white rounded-xl p-4 border border-white/10 cursor-pointer hover:border-border hover:shadow-sm transition-all"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${k.iconBg}`}>
                <k.icon className="w-4 h-4" style={{ color: k.iconColor }} />
              </div>
              <p className="text-xl font-bold text-foreground leading-tight">{k.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{k.label}</p>
              <p className="text-xs text-muted-foreground">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5 p-6">

        {/* Left col — col-span-2 */}
        <div className="col-span-2 space-y-5">

          {/* Platform API Activity */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Platform API Activity — Today</h2>
              <span className="text-xs text-muted-foreground">
                {platformMetrics.apiCallsToday.toLocaleString()} total calls
              </span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={platformMetrics.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Area
                  type="monotone"
                  dataKey="calls"
                  name="API Calls"
                  stroke="#5C5FEF"
                  fill="url(#sa-dash-api)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Workflow Outcomes */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Weekly Workflow Outcomes</h2>
              <button onClick={() => onNavigate('reports')} className="text-xs text-primary hover:underline">
                Full report
              </button>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={platformMetrics.weeklyWorkflows} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Bar dataKey="success" name="Successful" fill="#10B981" stackId="a" />
                <Bar dataKey="blocked" name="Blocked"    fill="#F59E0B" stackId="a" />
                <Bar dataKey="failed"  name="Failed"     fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Tenant Activity table */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Top Tenant Activity</h2>
              <button onClick={() => onNavigate('tenants')} className="text-xs text-primary hover:underline">
                All tenants →
              </button>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-2 text-muted-foreground font-medium">Tenant</th>
                  <th className="text-left pb-2 text-muted-foreground font-medium">Plan</th>
                  <th className="text-right pb-2 text-muted-foreground font-medium">Users</th>
                  <th className="text-right pb-2 text-muted-foreground font-medium">Workflows</th>
                  <th className="text-right pb-2 text-muted-foreground font-medium">MRR</th>
                  <th className="text-right pb-2 text-muted-foreground font-medium">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {topTenants.map(t => (
                  <tr
                    key={t.id}
                    className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors"
                    onClick={() => onNavigate('tenants', t.id)}
                  >
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                          style={{ background: t.primaryColor + '22' }}
                        >
                          {t.logo}
                        </div>
                        <div>
                          <p className="font-medium text-foreground truncate max-w-[120px]">{t.name}</p>
                          <p className="text-muted-foreground">{t.domain}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${planBadgeClass(t.plan)}`}>
                        {planBadgeLabel(t.plan)}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-foreground">{t.users}</td>
                    <td className="py-2.5 text-right text-foreground font-medium">{t.workflowsToday}</td>
                    <td className="py-2.5 text-right text-foreground">
                      {t.mrr > 0 ? `$${t.mrr.toLocaleString()}` : t.status === 'trial' ? 'Trial' : 'Churned'}
                    </td>
                    <td className="py-2.5 text-right">
                      <span className={`font-medium ${t.uptime >= 99.9 ? 'text-green-600' : t.uptime >= 99 ? 'text-amber-600' : 'text-red-600'}`}>
                        {t.uptime > 0 ? `${t.uptime}%` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right col */}
        <div className="space-y-4">

          {/* Revenue card */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Revenue</h2>
              </div>
              <button onClick={() => onNavigate('billing')} className="text-xs text-primary hover:underline">
                View Billing →
              </button>
            </div>
            <div className="space-y-1 mb-4">
              <p className="text-2xl font-bold text-green-600">
                ${billingData.mrr.toLocaleString()}
                <span className="text-xs font-normal text-muted-foreground ml-1">MRR</span>
              </p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <div className="p-2 bg-muted/40 rounded-lg">
                  <p className="text-xs text-muted-foreground">ARR</p>
                  <p className="text-xs font-semibold text-foreground">${(billingData.arr / 1000).toFixed(0)}K</p>
                </div>
                <div className="p-2 bg-muted/40 rounded-lg">
                  <p className="text-xs text-muted-foreground">Growth</p>
                  <p className="text-xs font-semibold text-green-600">↑{billingData.growth}%</p>
                </div>
                <div className="p-2 bg-muted/40 rounded-lg">
                  <p className="text-xs text-muted-foreground">Margin</p>
                  <p className="text-xs font-semibold text-foreground">{billingData.grossMargin}%</p>
                </div>
              </div>
            </div>
            {/* MRR by plan mini-bars */}
            <div className="space-y-2">
              {billingData.mrrByPlan.map(p => (
                <div key={p.plan}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs text-muted-foreground">{p.plan}</span>
                    <span className="text-xs font-medium text-foreground">
                      {p.mrr > 0 ? `$${p.mrr.toLocaleString()}` : 'Free'}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${maxMrr > 0 ? (p.mrr / maxMrr) * 100 : 0}%`,
                        background: p.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Events card */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Security Events</h2>
              </div>
              <button onClick={() => onNavigate('audit')} className="text-xs text-primary hover:underline">
                View all →
              </button>
            </div>
            <div className="space-y-2.5">
              {securityEvents.slice(0, 8).map(e => (
                <div key={e.id} className="flex items-start gap-2.5">
                  {/* Severity dot */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5
                      ${e.severity === 'critical'
                        ? 'bg-red-500 animate-pulse'
                        : e.severity === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-green-500'
                      }`}
                  />
                  <div className="flex-1 min-w-0">
                    {/* Tenant pill */}
                    <span className="inline-flex px-1.5 py-0.5 bg-muted rounded text-xs text-muted-foreground mr-1">
                      {e.tenant}
                    </span>
                    <span className="text-xs text-foreground truncate block">{e.event}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">{e.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Health card */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Platform Health</h2>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Uptime',          value: '99.99%',  color: 'text-green-600' },
                { label: 'Avg Response',    value: '1.3s',    color: 'text-indigo-600' },
                { label: 'Error Rate',      value: '0.8%',    color: 'text-amber-600' },
                { label: 'Active Tenants',  value: '11/12',   color: 'text-foreground' },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className={`font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
