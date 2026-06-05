import React, { useState } from 'react';
import { Search, Filter, Download, ChevronDown, Shield, User, Bot, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Screen } from '../types';

interface AuditScreenProps {
  onNavigate: (screen: Screen) => void;
}

const auditLogs = [
  { id: 'audit-001', timestamp: '2026-06-02T11:00:00Z', actor: 'Finance', actorType: 'agent', action: 'DATA_MODIFY', resource: 'Finance Records', detail: 'Updated 3 vendor invoice records (INV-4892, INV-4901, INV-4887)', workflowId: 'wf-003', severity: 'medium', ip: '10.0.0.3' },
  { id: 'audit-002', timestamp: '2026-06-02T10:47:00Z', actor: 'Sales', actorType: 'agent', action: 'DATA_READ', resource: 'HubSpot CRM', detail: 'Read 127 lead email records from HubSpot API', workflowId: 'wf-001', severity: 'low', ip: '10.0.0.2' },
  { id: 'audit-003', timestamp: '2026-06-02T10:30:00Z', actor: 'Kumar', actorType: 'user', action: 'WORKFLOW_VIEW', resource: 'Workflow wf-001', detail: 'Viewed workflow detail page', workflowId: 'wf-001', severity: 'info', ip: '192.168.1.1' },
  { id: 'audit-004', timestamp: '2026-06-02T10:15:00Z', actor: 'Support', actorType: 'agent', action: 'ESCALATION', resource: 'Ticket TK-4521', detail: 'Escalated customer ticket to manager — SLA breach risk in 2 hours', workflowId: 'wf-004', severity: 'high', ip: '10.0.0.6' },
  { id: 'audit-005', timestamp: '2026-06-02T09:45:00Z', actor: 'Sales', actorType: 'agent', action: 'DATA_MODIFY', resource: 'HubSpot CRM', detail: 'Updated 47 lead records with intent scores and campaign tags', workflowId: 'wf-001', severity: 'medium', ip: '10.0.0.2' },
  { id: 'audit-006', timestamp: '2026-06-02T09:30:00Z', actor: 'Neelu', actorType: 'user', action: 'COMMENT', resource: 'Workflow wf-001', detail: 'Added comment: "Please prioritize enterprise accounts in the review"', workflowId: 'wf-001', severity: 'info', ip: '192.168.1.22' },
  { id: 'audit-007', timestamp: '2026-06-02T09:00:00Z', actor: 'Command', actorType: 'agent', action: 'WORKFLOW_CREATE', resource: 'New Workflow', detail: 'Created workflow wf-001: Lead Email Review & CRM Update', workflowId: 'wf-001', severity: 'medium', ip: '10.0.0.1' },
  { id: 'audit-008', timestamp: '2026-06-02T08:45:00Z', actor: 'HR', actorType: 'agent', action: 'DATA_WRITE', resource: 'HR System', detail: 'Created onboarding record for Dhathri — User ID: user-006', workflowId: 'wf-010', severity: 'medium', ip: '10.0.0.4' },
  { id: 'audit-009', timestamp: '2026-06-02T08:30:00Z', actor: 'Praveena', actorType: 'user', action: 'POLICY_CHANGE', resource: 'Access Rules', detail: 'Updated access rule: Finance agents now require dual approval for payments > $50k', severity: 'high', ip: '192.168.1.5' },
  { id: 'audit-010', timestamp: '2026-06-02T08:00:00Z', actor: 'Kumar', actorType: 'user', action: 'LOGIN', resource: 'Authentication', detail: 'Successful login from Chrome on macOS — Workspace: Manexa AI Labs', severity: 'info', ip: '192.168.1.1' },
  { id: 'audit-011', timestamp: '2026-06-02T07:55:00Z', actor: 'Finance', actorType: 'agent', action: 'EXTERNAL_API', resource: 'QuickBooks API', detail: 'Retrieved payment records for invoice reconciliation — 89 transactions', workflowId: 'wf-009', severity: 'low', ip: '10.0.0.3' },
  { id: 'audit-012', timestamp: '2026-06-01T16:00:00Z', actor: 'Finance', actorType: 'agent', action: 'WORKFLOW_COMPLETE', resource: 'Workflow wf-009', detail: 'Expense reconciliation workflow completed. May 2026 total: $284,392', workflowId: 'wf-009', severity: 'medium', ip: '10.0.0.3' },
];

const severityConfig: Record<string, { color: string; bg: string; label: string }> = {
  info:   { color: '#6B7280', bg: '#F3F4F6', label: 'Info' },
  low:    { color: '#10B981', bg: '#ECFDF5', label: 'Low' },
  medium: { color: '#F59E0B', bg: '#FFFBEB', label: 'Medium' },
  high:   { color: '#EF4444', bg: '#FEF2F2', label: 'High' },
};

const actionColors: Record<string, string> = {
  DATA_READ:         '#6366F1',
  DATA_MODIFY:       '#F59E0B',
  DATA_WRITE:        '#8B5CF6',
  WORKFLOW_CREATE:   '#5C5FEF',
  WORKFLOW_VIEW:     '#6B7280',
  WORKFLOW_COMPLETE: '#10B981',
  ESCALATION:        '#EF4444',
  COMMENT:           '#0EA5E9',
  POLICY_CHANGE:     '#EC4899',
  EXTERNAL_API:      '#06B6D4',
  LOGIN:             '#64748B',
};

export function AuditScreen({ onNavigate }: AuditScreenProps) {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');

  const filters = ['All', 'High', 'Medium', 'Low', 'Info'];
  const filtered = auditLogs.filter(log => {
    const matchSev = severityFilter === 'All' || log.severity === severityFilter.toLowerCase();
    const matchSearch = log.detail.toLowerCase().includes(search.toLowerCase()) || log.actor.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchSearch;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border flex items-center gap-3">
        <Shield className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-1">
          {filters.map(f => (
            <button key={f} onClick={() => setSeverityFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${severityFilter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative ml-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search audit logs..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-56" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{filtered.length} entries</span>
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground w-[14%]">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[10%]">Actor</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[14%]">Action</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[10%]">Resource</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[34%]">Detail</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[10%]">Severity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-[8%]">IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {filtered.map(log => {
              const sev = severityConfig[log.severity];
              return (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-3">
                    <div className="text-xs text-muted-foreground font-mono">
                      {new Date(log.timestamp).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {log.actorType === 'agent' ? (
                        <Bot className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium text-foreground whitespace-nowrap">{log.actor}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded" style={{ color: actionColors[log.action] || '#6B7280', background: (actionColors[log.action] || '#6B7280') + '15' }}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-foreground">{log.resource}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-muted-foreground leading-relaxed">{log.detail}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: sev.color, background: sev.bg }}>
                      {sev.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-muted-foreground">{log.ip}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
