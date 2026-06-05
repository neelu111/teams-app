import React, { useState } from 'react';
import {
  AlertCircle, CheckCircle2, GitBranch, Clock, TrendingUp, Users,
  ChevronRight, Zap, ArrowUpRight, AlertTriangle
} from 'lucide-react';
import { MScreen, managerApprovals, managerEscalations, managerWorkflows, managerTeam, reportData } from '../managerData';
import { UserAvatar } from '../../shared/AgentAvatar';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MDashboardProps {
  onNavigate: (screen: MScreen, id?: string) => void;
  activeUser: { name: string; avatar: string; role: string };
}

const urgencyConfig = {
  critical: { color: '#EF4444', bg: 'bg-red-50', label: 'Critical', dot: 'bg-red-500' },
  high:     { color: '#F97316', bg: 'bg-orange-50', label: 'High', dot: 'bg-orange-500' },
  medium:   { color: '#F59E0B', bg: 'bg-yellow-50', label: 'Medium', dot: 'bg-yellow-500' },
  low:      { color: '#10B981', bg: 'bg-green-50', label: 'Low', dot: 'bg-green-500' },
};

const severityConfig = {
  critical: { color: '#EF4444', bg: 'bg-red-50', border: 'border-red-200' },
  high:     { color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-200' },
  medium:   { color: '#F59E0B', bg: 'bg-yellow-50', border: 'border-yellow-200' },
};

export function MDashboardScreen({ onNavigate, activeUser }: MDashboardProps) {
  const firstName = activeUser.name.split(' ')[0];
  const pendingApprovals = managerApprovals.filter(a => a.status === 'pending');
  const urgentApprovals = pendingApprovals.filter(a => a.urgency === 'critical' || a.urgency === 'high');
  const runningWorkflows = managerWorkflows.filter(w => w.status === 'running');
  const blockedWorkflows = managerWorkflows.filter(w => w.status === 'blocked');
  const overdueTasksCount = 2;
  const totalHoursSaved = managerTeam.reduce((s, m) => s + m.hoursThisWeek, 0);

  const stats = [
    { label: 'Pending Approvals', value: pendingApprovals.length, sub: `${urgentApprovals.length} urgent`, icon: AlertCircle, color: '#F97316', bg: 'bg-orange-50', onClick: () => onNavigate('approvals') },
    { label: 'Escalations', value: managerEscalations.length, sub: '1 critical', icon: AlertTriangle, color: '#EF4444', bg: 'bg-red-50', onClick: () => onNavigate('approvals') },
    { label: 'Active Workflows', value: runningWorkflows.length + blockedWorkflows.length, sub: `${blockedWorkflows.length} blocked`, icon: GitBranch, color: '#5C5FEF', bg: 'bg-indigo-50', onClick: () => onNavigate('team-workflows') },
    { label: 'Team Tasks Due', value: 8, sub: `${overdueTasksCount} overdue`, icon: Clock, color: '#0EA5E9', bg: 'bg-sky-50', onClick: () => onNavigate('team-tasks') },
  ];

  const workloadData = managerTeam.map(m => ({
    name: m.name.split(' ')[0],
    tasks: m.taskCount,
    completed: m.completedToday,
    overdue: m.overdueCount,
    color: m.color,
  }));

  return (
    <div className="h-full overflow-y-auto bg-background">
      {/* Hidden gradient defs for recharts */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="mgr-trend" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5C5FEF" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#5C5FEF" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      {/* Hero */}
      <div className="px-8 pt-7 pb-5" style={{ background: 'linear-gradient(135deg, #F0F1FE 0%, #FAF0FF 100%)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Good morning, {firstName} 👋</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tuesday, June 2, 2026 · You have <span className="font-semibold text-orange-600">{pendingApprovals.length} pending approvals</span> and <span className="font-semibold text-red-600">{managerEscalations.length} escalations</span> requiring attention.</p>
          </div>
          <button onClick={() => onNavigate('ai')} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity shadow-sm">
            <Zap className="w-4 h-4" /> Ask AI
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {stats.map(stat => (
            <div key={stat.label} onClick={stat.onClick} className="bg-white rounded-xl p-4 border border-white/80 cursor-pointer hover:border-border hover:shadow-sm transition-all">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${stat.bg}`}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs font-medium text-foreground mt-0.5">{stat.label}</div>
              <div className="text-xs text-muted-foreground">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-5">
        {/* Escalations */}
        <div className="col-span-2 space-y-5">
          {/* Active Escalations */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-semibold text-foreground">Active Escalations</h2>
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">{managerEscalations.length}</span>
              </div>
            </div>
            {managerEscalations.map(esc => {
              const sc = severityConfig[esc.severity];
              return (
                <div key={esc.id} className={`p-5 border-b border-border last:border-0 ${esc.severity === 'critical' ? 'bg-red-50/40' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${sc.bg}`} style={{ color: sc.color }}>
                      {esc.severity.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground mb-1">{esc.title}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{esc.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <UserAvatar initials={esc.employeeInitials} name={esc.employeeName} size="xs" color={esc.employeeColor} />
                        <span className="text-xs text-muted-foreground">{esc.employeeName}</span>
                        {esc.dealValue && <span className="text-xs font-semibold text-foreground">${(esc.dealValue / 1000).toFixed(0)}k deal</span>}
                        <span className="text-xs text-muted-foreground ml-auto">{esc.timeLabel}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        {esc.relatedApprovalId && (
                          <button onClick={() => onNavigate('approvals', esc.relatedApprovalId)}
                            className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
                            Take Action
                          </button>
                        )}
                        <button onClick={() => onNavigate('ai')} className="px-3 py-1.5 bg-muted text-foreground rounded-lg text-xs font-medium hover:bg-muted/70 transition-colors">
                          Ask AI
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pending Approvals */}
          <div className="bg-white border border-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Pending Approvals</h2>
              </div>
              <button onClick={() => onNavigate('approvals')} className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            {pendingApprovals.slice(0, 3).map(ap => {
              const uc = urgencyConfig[ap.urgency];
              return (
                <div key={ap.id} onClick={() => onNavigate('approvals', ap.id)}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 cursor-pointer transition-colors">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${uc.dot}`} />
                  <UserAvatar initials={ap.requestedByInitials} name={ap.requestedBy} size="sm" color={ap.requestedByColor} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{ap.title}</p>
                    <p className="text-xs text-muted-foreground">{ap.requestedBy} · {ap.timeLabel}</p>
                  </div>
                  {ap.amount && <span className="text-xs font-semibold text-foreground flex-shrink-0">${(ap.amount / 1000).toFixed(ap.amount < 10000 ? 1 : 0)}k</span>}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${uc.bg}`} style={{ color: uc.color }}>{uc.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              );
            })}
          </div>

          {/* Productivity trend */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Team Productivity — Weekly</h2>
              <span className="text-xs text-muted-foreground">Tasks completed vs assigned</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={reportData.productivityWeekly} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }} />
                <Bar dataKey="completed" name="Completed" fill="#5C5FEF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="assigned" name="Assigned" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Team Workload */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Team Workload</h2>
              <button onClick={() => onNavigate('team-overview')} className="text-xs text-primary hover:underline">Overview</button>
            </div>
            <div className="space-y-3">
              {managerTeam.map(member => (
                <div key={member.id}>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <UserAvatar initials={member.initials} name={member.name} size="xs" color={member.color} />
                    <span className="text-xs font-medium text-foreground flex-1 truncate">{member.name.split(' ')[0]}</span>
                    <span className="text-xs text-muted-foreground">{member.taskCount} tasks</span>
                    {member.overdueCount > 0 && (
                      <span className="text-xs text-red-600 font-medium">{member.overdueCount} overdue</span>
                    )}
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(member.taskCount / 10) * 100}%`, background: member.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Workflows */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">Active Workflows</h2>
              <button onClick={() => onNavigate('team-workflows')} className="text-xs text-primary hover:underline">View all</button>
            </div>
            <div className="space-y-2.5">
              {managerWorkflows.filter(w => w.status === 'running' || w.status === 'blocked').slice(0, 4).map(wf => (
                <div key={wf.id} className={`p-3 rounded-xl border ${wf.status === 'blocked' ? 'border-red-200 bg-red-50/40' : 'border-border'}`}>
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-xs font-medium text-foreground leading-snug flex-1 mr-2">{wf.title}</p>
                    {wf.status === 'blocked' && <span className="text-xs text-red-600 font-semibold flex-shrink-0">Blocked</span>}
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <UserAvatar initials={wf.assignedToInitials} name={wf.assignedTo} size="xs" color={wf.assignedToColor} />
                    <span className="text-xs text-muted-foreground">{wf.assignedTo.split(' ')[0]}</span>
                  </div>
                  {wf.status !== 'blocked' && (
                    <div className="h-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${wf.progress}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">This Week</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Hours Saved', value: `${totalHoursSaved}h`, color: '#5C5FEF' },
                { label: 'AI Workflows', value: managerWorkflows.length, color: '#10B981' },
                { label: 'Tasks Done', value: managerTeam.reduce((s, m) => s + m.completedToday, 0), color: '#0EA5E9' },
                { label: 'Team Rate', value: '93%', color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-muted/30 text-center">
                  <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
