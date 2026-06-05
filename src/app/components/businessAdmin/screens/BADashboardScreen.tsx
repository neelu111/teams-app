import React, { useState } from 'react';
import { Activity, Users, GitBranch, Zap, Wifi, WifiOff, AlertTriangle, CheckCircle2, TrendingUp, Shield, Clock } from 'lucide-react';
import { BAScreen, systemMetrics, agentConfigs, connectors } from '../businessAdminData';
import { AgentAvatar } from '../../shared/AgentAvatar';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BADashboardProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
  activeUser: { name: string; avatar: string; role: string };
}

export function BADashboardScreen({ onNavigate, activeUser }: BADashboardProps) {
  const firstName = activeUser.name.split(' ')[0];
  const connectorErrors = connectors.filter(c => c.status === 'error').length;
  const connectorRateLimited = connectors.filter(c => c.status === 'rate-limited').length;

  const kpiCards = [
    { label: 'Total Users',       value: systemMetrics.totalUsers,          sub: `${systemMetrics.activeUsers} active`,    icon: Users,     color: '#5C5FEF', bg: 'bg-indigo-50', onClick: () => onNavigate('users') },
    { label: 'Active Agents',     value: `${systemMetrics.activeAgents}/7`,  sub: 'All agents operational',                 icon: Zap,       color: '#10B981', bg: 'bg-green-50',  onClick: () => onNavigate('specialist-agents') },
    { label: 'Workflows Today',   value: systemMetrics.workflowsToday,       sub: `${systemMetrics.workflowsRunning} running, ${systemMetrics.workflowsBlocked} blocked`, icon: GitBranch, color: '#0EA5E9', bg: 'bg-sky-50',    onClick: () => onNavigate('workflows') },
    { label: 'Connectors',        value: `${systemMetrics.activeConnectors}/${systemMetrics.totalConnectors}`, sub: connectorErrors > 0 ? `${connectorErrors} error` : 'All healthy', icon: connectorErrors > 0 ? WifiOff : Wifi, color: connectorErrors > 0 ? '#EF4444' : '#10B981', bg: connectorErrors > 0 ? 'bg-red-50' : 'bg-green-50', onClick: () => onNavigate('connectors') },
    { label: 'Success Rate',      value: `${systemMetrics.workflowSuccessRate}%`, sub: '+2.1% vs last week',               icon: TrendingUp,color: '#F59E0B', bg: 'bg-amber-50',  onClick: () => onNavigate('reports') },
    { label: 'API Calls Today',   value: systemMetrics.apiCallsToday.toLocaleString(), sub: '↑ 18% vs yesterday',           icon: Activity,  color: '#8B5CF6', bg: 'bg-purple-50', onClick: () => onNavigate('audit') },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="ba-dash-api" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5C5FEF" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Header */}
      <div className="px-8 pt-7 pb-5" style={{ background: 'linear-gradient(135deg, #F0F1FE 0%, #FAF0FF 100%)' }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Welcome back, {firstName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Platform status · Tuesday, June 2, 2026</p>
          </div>
          {/* System Health pill */}
          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">System Health</span>
            <span className="text-xs font-bold text-green-600">{systemMetrics.systemUptime}% uptime</span>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {kpiCards.map(k => (
            <div key={k.label} onClick={k.onClick}
              className="bg-white rounded-xl p-4 border border-white/80 cursor-pointer hover:border-border hover:shadow-sm transition-all">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2.5 ${k.bg}`}>
                <k.icon className="w-4 h-4" style={{ color: k.color }} />
              </div>
              <p className="text-xl font-bold text-foreground leading-tight">{k.value}</p>
              <p className="text-xs font-medium text-foreground mt-0.5">{k.label}</p>
              <p className="text-xs text-muted-foreground">{k.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-5">
        {/* Left: Agent Activity + Weekly Workflows */}
        <div className="col-span-2 space-y-5">
          {/* API Activity */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Agent API Activity — Today</h2>
              <span className="text-xs text-muted-foreground">{systemMetrics.apiCallsToday.toLocaleString()} total calls</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={systemMetrics.agentActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Area type="monotone" dataKey="calls" name="API Calls" stroke="#5C5FEF" fill="url(#ba-dash-api)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Workflow Success */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Weekly Workflow Outcomes</h2>
              <button onClick={() => onNavigate('reports')} className="text-xs text-primary hover:underline">Full report</button>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={systemMetrics.weeklyWorkflows} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Bar dataKey="success" name="Successful" fill="#10B981" radius={[4, 4, 0, 0]} stackId="a" />
                <Bar dataKey="blocked" name="Blocked" fill="#F59E0B" radius={[0, 0, 0, 0]} stackId="a" />
                <Bar dataKey="failed" name="Failed" fill="#EF4444" radius={[0, 0, 4, 4]} stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Agent Status Grid */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Agent Status</h2>
              <button onClick={() => onNavigate('specialist-agents')} className="text-xs text-primary hover:underline">Configure agents</button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {agentConfigs.map(agent => (
                <div key={agent.id} className={`p-3 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${agent.status === 'active' ? 'border-border' : 'border-border opacity-60'}`}
                  onClick={() => onNavigate(agent.type === 'super' ? 'super-agent' : 'specialist-agents', agent.id)}>
                  <div className="flex items-center gap-2 mb-2">
                    <AgentAvatar type={agent.type as any} name={agent.name} size="xs" showStatus status={agent.status === 'active' ? 'active' : 'paused'} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{agent.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{agent.successRate}%</span>
                    <span className="text-muted-foreground">{agent.avgResponseTime}</span>
                  </div>
                  <div className="h-1 bg-muted rounded-full overflow-hidden mt-1.5">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${agent.successRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Connector Health */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Connector Health</h2>
              <button onClick={() => onNavigate('connectors')} className="text-xs text-primary hover:underline">Manage</button>
            </div>
            <div className="space-y-2.5">
              {systemMetrics.connectorHealth.map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                  <span className="text-xs text-foreground flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.latency}</span>
                  {c.errors > 0 && <span className="text-xs text-red-600 font-semibold">{c.errors} err</span>}
                </div>
              ))}
            </div>
            {(connectorErrors > 0 || connectorRateLimited > 0) && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {connectorErrors > 0 && `${connectorErrors} connector${connectorErrors > 1 ? 's' : ''} in error state. `}
                  {connectorRateLimited > 0 && `${connectorRateLimited} rate-limited.`}
                </p>
              </div>
            )}
          </div>

          {/* Recent Audit Events */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Recent Events</h2>
              </div>
              <button onClick={() => onNavigate('audit')} className="text-xs text-primary hover:underline">Audit log</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Account locked (kevin.z)',   time: '12:12 PM', severity: 'critical' },
                { label: 'QuickBooks errors (14)',      time: '11:55 AM', severity: 'error' },
                { label: 'LinkedIn rate limit',         time: '11:55 AM', severity: 'warning' },
                { label: 'Sales email blocked',          time: '11:40 AM', severity: 'warning' },
                { label: 'Daily security scan ✓',       time: '8:00 AM',  severity: 'info' },
              ].map((e, i) => {
                const colors = { critical: 'text-red-600', error: 'text-red-500', warning: 'text-amber-600', info: 'text-green-600' };
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${e.severity === 'critical' || e.severity === 'error' ? 'bg-red-500' : e.severity === 'warning' ? 'bg-amber-500' : 'bg-green-500'}`} />
                    <span className="text-xs text-foreground flex-1 truncate">{e.label}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{e.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform Quick Stats */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Platform Stats</h2>
            <div className="space-y-3 text-xs">
              {[
                { label: 'Hours Automated (MTD)', value: `${systemMetrics.hoursAutomated}h`, color: '#5C5FEF' },
                { label: 'Avg Response Time', value: systemMetrics.avgResponseTime, color: '#10B981' },
                { label: 'Approvals Pending', value: '3', color: '#F97316' },
                { label: 'Workflow Templates', value: '24', color: '#0EA5E9' },
                { label: 'MFA Coverage', value: '64%', color: '#8B5CF6' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-1 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-semibold" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
