import React, { useState } from 'react';
import { Search, Download, X, Clock, AlertTriangle } from 'lucide-react';
import { SAScreen, platformAuditLogs } from '../superAdminData';

const tenantColors: Record<string, string> = {
  'Manexa AI Labs': '#5C5FEF',
  'GlobalTech Inc': '#0EA5E9',
  'Meridian Health': '#10B981',
  'MarketingStar Finance': '#F59E0B',
  'Frontier Labs': '#EF4444',
  'Platform': '#8B5CF6',
  'PeakFlow Media': '#94A3B8',
};

const severityConfig = {
  critical: { pill: 'bg-red-500 text-white', label: 'Critical' },
  warning: { pill: 'bg-amber-100 text-amber-700', label: 'Warning' },
  info: { pill: 'bg-muted text-muted-foreground', label: 'Info' },
} as const;

const allTenants = [...new Set(platformAuditLogs.map(l => l.tenant))];
const allCategories = ['All', 'Workflow', 'User', 'Agent', 'Security', 'Connector', 'Billing', 'Platform'];
const allSeverities = ['All', 'Critical', 'Error', 'Warning', 'Info'];
const dateRanges = ['Today', 'Last 7 days', 'Last 30 days'];

export function SAAuditScreen({ onNavigate }: { onNavigate: (screen: SAScreen, id?: string) => void }) {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterTenant, setFilterTenant] = useState('All');
  const [filterDate, setFilterDate] = useState('Today');

  const filtered = platformAuditLogs.filter(log => {
    const matchSearch = !search ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = filterSeverity === 'All' || log.severity.toLowerCase() === filterSeverity.toLowerCase();
    const matchTenant = filterTenant === 'All' || log.tenant === filterTenant;
    return matchSearch && matchSeverity && matchTenant;
  });

  const selectedLog = platformAuditLogs.find(l => l.id === selectedLogId) ?? null;

  const summaryStats = {
    total: platformAuditLogs.length,
    critical: platformAuditLogs.filter(l => l.severity === 'critical').length,
    warnings: platformAuditLogs.filter(l => l.severity === 'warning').length,
    tenants: new Set(platformAuditLogs.map(l => l.tenant)).size,
  };

  const clearFilters = () => {
    setSearch('');
    setFilterCategory('All');
    setFilterSeverity('All');
    setFilterTenant('All');
    setFilterDate('Today');
  };

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* FILTER SIDEBAR */}
      <div className="w-[200px] flex-shrink-0 border-r border-border bg-white overflow-y-auto p-4 space-y-5">
        {/* Category */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Category</p>
          <div className="space-y-1">
            {allCategories.map(cat => (
              <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filterCategory === cat}
                  onChange={() => setFilterCategory(cat)}
                  className="w-3.5 h-3.5 accent-primary rounded"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Severity</p>
          <div className="space-y-1">
            {allSeverities.map(sev => (
              <label key={sev} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filterSeverity === sev}
                  onChange={() => setFilterSeverity(sev)}
                  className="w-3.5 h-3.5 accent-primary rounded"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">{sev}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tenant */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Tenant</p>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filterTenant === 'All'}
                onChange={() => setFilterTenant('All')}
                className="w-3.5 h-3.5 accent-primary rounded"
              />
              <span className="text-sm text-foreground">All</span>
            </label>
            {allTenants.map(t => (
              <label key={t} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filterTenant === t}
                  onChange={() => setFilterTenant(t)}
                  className="w-3.5 h-3.5 accent-primary rounded"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors truncate" title={t}>{t}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Date</p>
          <div className="space-y-1">
            {dateRanges.map(d => (
              <label key={d} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="date-range"
                  checked={filterDate === d}
                  onChange={() => setFilterDate(d)}
                  className="w-3.5 h-3.5 accent-primary"
                />
                <span className="text-sm text-foreground group-hover:text-primary transition-colors">{d}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={clearFilters} className="text-xs text-primary hover:underline">
          Clear Filters
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="bg-white border-b border-border px-5 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search events, actors, details…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <span className="flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {filtered.length}
            </span>
          </div>

          {/* Summary cards */}
          <div className="px-5 py-4 grid grid-cols-4 gap-3 flex-shrink-0 bg-background border-b border-border">
            {[
              { label: 'Total Events', value: summaryStats.total, cls: 'text-foreground' },
              { label: 'Critical', value: summaryStats.critical, cls: 'text-red-600' },
              { label: 'Warnings', value: summaryStats.warnings, cls: 'text-amber-600' },
              { label: 'Tenants Involved', value: summaryStats.tenants, cls: 'text-foreground' },
            ].map(s => (
              <div key={s.label} className="bg-white border border-border rounded-xl p-3 text-center">
                <p className={`text-xl font-bold ${s.cls}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="bg-muted/50 border-b border-border">
                  {['Time', 'Tenant', 'Actor', 'Action', 'Severity', 'Detail'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {filtered.map(log => {
                  const sev = severityConfig[log.severity as keyof typeof severityConfig];
                  const color = tenantColors[log.tenant] ?? '#94A3B8';
                  const isSelected = selectedLogId === log.id;
                  return (
                    <tr
                      key={log.id}
                      onClick={() => setSelectedLogId(isSelected ? null : log.id)}
                      className={`border-b border-border/50 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/20'}`}
                    >
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {log.time}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium text-white whitespace-nowrap"
                          style={{ backgroundColor: color }}
                        >
                          {log.tenant}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground">{log.actor}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{log.action}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sev.pill}`}>
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-xs">
                        <span className="truncate block" title={log.detail}>{log.detail}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 text-muted-foreground">
                <AlertTriangle className="w-8 h-8 mb-3 opacity-40" />
                <p className="text-sm">No events match filters</p>
              </div>
            )}
          </div>
        </div>

        {/* DETAIL PANEL */}
        {selectedLog && (
          <div className="w-[300px] flex-shrink-0 border-l border-border bg-white flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
              <h3 className="text-sm font-semibold text-foreground">Event Detail</h3>
              <button onClick={() => setSelectedLogId(null)} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${severityConfig[selectedLog.severity as keyof typeof severityConfig].pill}`}>
                  {severityConfig[selectedLog.severity as keyof typeof severityConfig].label}
                </span>
              </div>
              {[
                { label: 'Time', value: selectedLog.time },
                { label: 'Tenant', value: (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                    style={{ backgroundColor: tenantColors[selectedLog.tenant] ?? '#94A3B8' }}
                  >
                    {selectedLog.tenant}
                  </span>
                )},
                { label: 'Actor', value: selectedLog.actor },
                { label: 'Action', value: selectedLog.action },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs text-muted-foreground mb-1">{label}</p>
                  {typeof value === 'string'
                    ? <p className="text-sm text-foreground font-medium">{value}</p>
                    : value}
                </div>
              ))}
              <div>
                <p className="text-xs text-muted-foreground mb-1">Full Detail</p>
                <p className="text-sm text-foreground leading-relaxed bg-muted rounded-lg p-3">{selectedLog.detail}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
