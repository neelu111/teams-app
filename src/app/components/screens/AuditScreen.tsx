import React, { useEffect, useState } from 'react';
import { Search, Filter, Download, ChevronDown, Shield, User, Bot, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Screen } from '../types';
import { listAuditEvents, clearAuditEvents } from '../shared/audit';
import { listConnectors } from '../shared/connectors';

interface AuditScreenProps {
  onNavigate: (screen: Screen) => void;
}

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
  const [activeScope, setActiveScope] = useState<'global' | string>('global');
  const [events, setEvents] = useState<any[]>([]);
  const [connectors, setConnectors] = useState<string[]>([]);

  const filters = ['All', 'High', 'Medium', 'Low', 'Info'];

  useEffect(() => {
    // load connectors list
    const cs = Object.keys(listConnectors()).filter(k => !!k);
    setConnectors(cs);
    // if navigation requested a specific connector, pick it
    try {
      const requested = localStorage.getItem('audit_selected_connector');
      if (requested) {
        setActiveScope(requested);
        localStorage.removeItem('audit_selected_connector');
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const evs = activeScope === 'global' ? listAuditEvents() : listAuditEvents(activeScope);
    setEvents(evs);
  }, [activeScope]);

  const filtered = events.filter(log => {
    const sev = (log as any).severity || ((log as any).meta && (log as any).meta.includes('ERROR') ? 'high' : 'info');
    const matchSev = severityFilter === 'All' || sev === severityFilter.toLowerCase();
    const detail = (log as any).detail || (log as any).meta || '';
    const actor = (log as any).actor || (log as any).title || '';
    const action = (log as any).action || '';
    const matchSearch = detail.toLowerCase().includes(search.toLowerCase()) || actor.toLowerCase().includes(search.toLowerCase()) || action.toLowerCase().includes(search.toLowerCase());
    return matchSev && matchSearch;
  });

  const doExport = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = activeScope === 'global' ? 'audit-events.json' : `audit-${activeScope}.json`; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  };

  const doClear = () => {
    if (activeScope === 'global') {
      clearAuditEvents();
    } else {
      clearAuditEvents(activeScope);
    }
    setEvents([]);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border flex items-center gap-3">
        <Shield className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-2">
          <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeScope === 'global' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60'}`} onClick={() => setActiveScope('global')}>All</button>
          {connectors.map(c => (
            <button key={c} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeScope === c ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-muted/60'}`} onClick={() => setActiveScope(c)}>{c}</button>
          ))}
        </div>
        <div className="relative ml-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search audit logs..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 w-56" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{filtered.length} entries</span>
          <button onClick={doExport} className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors">
            <Download className="w-3.5 h-3.5" /> Export
          </button>
          <button onClick={doClear} className="px-3 py-1.5 border border-red-100 text-red-600 rounded-lg text-sm">Clear</button>
        </div>
      </div>

      {/* Timeline / Cards */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {filtered.map((log: any) => {
            const sev = severityConfig[(log.severity || 'info')];
            const time = new Date(log.time || log.timestamp || log.time || Date.now());
            const timeAgo = (() => {
              const d = Date.now() - time.getTime();
              const s = Math.floor(d / 1000);
              if (s < 60) return `${s}s ago`;
              const m = Math.floor(s / 60);
              if (m < 60) return `${m}m ago`;
              const h = Math.floor(m / 60);
              if (h < 24) return `${h}h ago`;
              const days = Math.floor(h / 24);
              return `${days}d ago`;
            })();
            return (
              <div key={log.id || (log.time + Math.random())} className="bg-white border border-border rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/80">
                    {log.actorType === 'agent' ? <Bot className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold text-foreground">{log.actor || log.title}</div>
                      <div className="text-xs text-muted-foreground">{log.connectorId ? `· ${log.connectorId}` : ''}</div>
                      <div className="ml-auto text-xs font-mono text-muted-foreground">{timeAgo}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{log.detail || log.meta || ''}</div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: sev.color, background: sev.bg }}>{sev.label}</span>
                      {log.connectorId && <span className="text-xs px-2 py-0.5 rounded border border-border text-foreground">{log.connectorId}</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
