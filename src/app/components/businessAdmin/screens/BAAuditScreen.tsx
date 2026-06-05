import React, { useState } from 'react';
import { Search, Download, X, User, Bot, Monitor, ChevronDown, ChevronRight } from 'lucide-react';
import { BAScreen, auditLogs, AuditLog, AuditCategory, AuditSeverity } from '../businessAdminData';

interface BAAuditProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

const categoryColors: Record<AuditCategory, string> = {
  workflow:   'bg-blue-100 text-blue-700',
  user:       'bg-purple-100 text-purple-700',
  agent:      'bg-indigo-100 text-indigo-700',
  security:   'bg-red-100 text-red-700',
  connector:  'bg-amber-100 text-amber-700',
  capability: 'bg-green-100 text-green-700',
};

const categoryCounts: Record<string, number> = {
  All: auditLogs.length,
  workflow:   auditLogs.filter(l => l.category === 'workflow').length,
  user:       auditLogs.filter(l => l.category === 'user').length,
  agent:      auditLogs.filter(l => l.category === 'agent').length,
  security:   auditLogs.filter(l => l.category === 'security').length,
  connector:  auditLogs.filter(l => l.category === 'connector').length,
  capability: auditLogs.filter(l => l.category === 'capability').length,
};

const severityStyle: Record<AuditSeverity, string> = {
  critical: 'bg-red-600 text-white',
  error:    'border border-red-400 text-red-600',
  warning:  'bg-amber-100 text-amber-700',
  info:     'bg-slate-100 text-slate-600',
};

const statusDot: Record<AuditLog['status'], string> = {
  success: 'bg-green-500',
  failed:  'bg-red-500',
  blocked: 'bg-orange-500',
};

const ALL_CATEGORIES: AuditCategory[] = ['workflow', 'user', 'agent', 'security', 'connector', 'capability'];
const ALL_SEVERITIES: AuditSeverity[] = ['critical', 'error', 'warning', 'info'];
type ActorFilter = 'all' | 'user' | 'agent' | 'system';
type DateRange = 'today' | '7days' | '30days';

function ActorIcon({ type }: { type: AuditLog['actorType'] }) {
  if (type === 'user')   return <User className="w-3.5 h-3.5 text-purple-500" />;
  if (type === 'agent')  return <Bot  className="w-3.5 h-3.5 text-indigo-500" />;
  return <Monitor className="w-3.5 h-3.5 text-slate-400" />;
}

export function BAAuditScreen({ onNavigate }: BAAuditProps) {
  const [categories, setCategories] = useState<AuditCategory[]>([]);
  const [severities,  setSeverities]  = useState<AuditSeverity[]>([]);
  const [actorFilter, setActorFilter] = useState<ActorFilter>('all');
  const [dateRange,   setDateRange]   = useState<DateRange>('today');
  const [search,      setSearch]      = useState('');
  const [selected,    setSelected]    = useState<AuditLog | null>(null);

  function toggleCategory(c: AuditCategory) {
    setCategories(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  }
  function toggleSeverity(s: AuditSeverity) {
    setSeverities(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }

  const filtered = auditLogs.filter(log => {
    if (categories.length > 0 && !categories.includes(log.category)) return false;
    if (severities.length > 0 && !severities.includes(log.severity)) return false;
    if (actorFilter !== 'all' && log.actorType !== actorFilter) return false;
    if (search && !`${log.actor} ${log.action} ${log.resource} ${log.detail}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const criticalCount  = filtered.filter(l => l.severity === 'critical').length;
  const errorCount     = filtered.filter(l => l.severity === 'error').length;
  const warningCount   = filtered.filter(l => l.severity === 'warning').length;

  const clearFilters = () => { setCategories([]); setSeverities([]); setActorFilter('all'); setDateRange('today'); setSearch(''); };

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* LEFT FILTER SIDEBAR */}
      <div className="w-[220px] shrink-0 flex flex-col border-r border-border bg-white overflow-y-auto">
        <div className="px-4 pt-5 pb-3 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Filters</h2>
          <button onClick={clearFilters} className="text-xs text-primary hover:underline">Clear</button>
        </div>

        <div className="p-4 space-y-5 text-xs">
          {/* Category */}
          <div>
            <p className="font-semibold text-foreground mb-2 uppercase tracking-wide text-[10px]">Category</p>
            <div className="space-y-1.5">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categories.length === 0}
                    onChange={() => setCategories([])}
                    className="rounded border-border accent-primary"
                  />
                  <span className="text-foreground">All</span>
                </span>
                <span className="text-muted-foreground">{categoryCounts['All']}</span>
              </label>
              {ALL_CATEGORIES.map(c => (
                <label key={c} className="flex items-center justify-between cursor-pointer">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={categories.includes(c)}
                      onChange={() => toggleCategory(c)}
                      className="rounded border-border accent-primary"
                    />
                    <span className="capitalize text-foreground">{c}</span>
                  </span>
                  <span className="text-muted-foreground">{categoryCounts[c]}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <p className="font-semibold text-foreground mb-2 uppercase tracking-wide text-[10px]">Severity</p>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={severities.length === 0} onChange={() => setSeverities([])} className="rounded border-border accent-primary" />
                <span className="text-foreground">All</span>
              </label>
              {ALL_SEVERITIES.map(s => (
                <label key={s} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={severities.includes(s)} onChange={() => toggleSeverity(s)} className="rounded border-border accent-primary" />
                  <span className="capitalize text-foreground">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actor Type */}
          <div>
            <p className="font-semibold text-foreground mb-2 uppercase tracking-wide text-[10px]">Actor Type</p>
            <div className="space-y-1.5">
              {(['all', 'user', 'agent', 'system'] as ActorFilter[]).map(a => (
                <label key={a} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="actor"
                    checked={actorFilter === a}
                    onChange={() => setActorFilter(a)}
                    className="accent-primary"
                  />
                  <span className="capitalize text-foreground">{a === 'all' ? 'All' : a === 'user' ? 'Users' : a === 'agent' ? 'Agents' : 'System'}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <p className="font-semibold text-foreground mb-2 uppercase tracking-wide text-[10px]">Date Range</p>
            <div className="space-y-1.5">
              {([
                { key: 'today',  label: 'Today' },
                { key: '7days',  label: 'Last 7 days' },
                { key: '30days', label: 'Last 30 days' },
              ] as { key: DateRange; label: string }[]).map(d => (
                <label key={d.key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="daterange"
                    checked={dateRange === d.key}
                    onChange={() => setDateRange(d.key)}
                    className="accent-primary"
                  />
                  <span className="text-foreground">{d.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="px-5 pt-5 pb-3 border-b border-border bg-white flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit logs..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">{filtered.length} events</span>
        </div>

        {/* Summary stats */}
        <div className="px-5 py-3 border-b border-border bg-white flex gap-3">
          {[
            { label: 'Total Events', value: filtered.length,  color: 'text-foreground',   bg: 'bg-slate-50' },
            { label: 'Critical',     value: criticalCount,    color: 'text-red-700',       bg: 'bg-red-50' },
            { label: 'Errors',       value: errorCount,       color: 'text-red-600',       bg: 'bg-red-50' },
            { label: 'Warnings',     value: warningCount,     color: 'text-amber-700',     bg: 'bg-amber-50' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-2.5 px-3 py-2 ${s.bg} rounded-xl border border-border`}>
              <span className={`text-lg font-bold ${s.color}`}>{s.value}</span>
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 z-10">
              <tr className="bg-slate-50 border-b border-border">
                {['Timestamp', 'Category', 'Severity', 'Actor', 'Action', 'Resource', 'Status'].map(col => (
                  <th key={col} className="px-4 py-2.5 text-left font-semibold text-muted-foreground whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(log => (
                <tr
                  key={log.id}
                  onClick={() => setSelected(selected?.id === log.id ? null : log)}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 ${selected?.id === log.id ? 'bg-primary/5' : 'bg-white'}`}
                >
                  <td className="px-4 py-3 whitespace-nowrap font-mono text-muted-foreground">{log.timeLabel}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${categoryColors[log.category]}`}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${severityStyle[log.severity]}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <ActorIcon type={log.actorType} />
                      <span className="text-foreground">{log.actor}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="truncate block text-foreground">{log.action}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[160px]">
                    <span className="truncate block text-muted-foreground">{log.resource}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${statusDot[log.status]}`} />
                      <span className="capitalize text-foreground">{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No audit logs match current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL SIDE PANEL */}
      {selected && (
        <div className="w-80 shrink-0 border-l border-border bg-white flex flex-col overflow-hidden">
          <div className="px-4 pt-4 pb-3 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Event Detail</h3>
            <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            <div>
              <p className="text-muted-foreground mb-0.5">Timestamp</p>
              <p className="font-mono text-foreground">{selected.timestamp}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Actor</p>
              <p className="font-semibold text-foreground flex items-center gap-1.5">
                <ActorIcon type={selected.actorType} />
                {selected.actor}
                <span className="capitalize text-muted-foreground font-normal">({selected.actorType})</span>
              </p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Category</p>
              <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${categoryColors[selected.category]}`}>
                {selected.category}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Severity</p>
              <span className={`px-2 py-0.5 rounded-full font-semibold capitalize ${severityStyle[selected.severity]}`}>
                {selected.severity}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Action</p>
              <p className="font-semibold text-foreground">{selected.action}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-0.5">Resource</p>
              <p className="text-foreground">{selected.resource}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Detail</p>
              <p className="text-foreground leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-border">{selected.detail}</p>
            </div>
            {selected.ip && (
              <div>
                <p className="text-muted-foreground mb-0.5">IP Address</p>
                <p className="font-mono text-foreground">{selected.ip}</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground mb-0.5">Status</p>
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${statusDot[selected.status]}`} />
                <span className="capitalize font-semibold text-foreground">{selected.status}</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
