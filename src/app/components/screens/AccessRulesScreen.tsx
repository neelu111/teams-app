import React, { useState } from 'react';
import { Plus, Lock, Shield, MoreHorizontal, ChevronDown, Zap, AlertTriangle, Check } from 'lucide-react';
import { Screen } from '../types';

interface AccessRulesScreenProps {
  onNavigate: (screen: Screen) => void;
}

const rules = [
  { id: 'r1', name: 'Finance Dual Approval', type: 'approval', agent: 'Finance', condition: 'Financial transaction > $5,000', action: 'Require dual manager approval', enabled: true, severity: 'high', createdBy: 'Praveena', usageCount: 89 },
  { id: 'r2', name: 'Data Export Restriction', type: 'restriction', agent: 'All Agents', condition: 'Bulk data export requested', action: 'Block and notify admin', enabled: true, severity: 'high', createdBy: 'Kumar', usageCount: 12 },
  { id: 'r3', name: 'Working Hours Gate', type: 'time', agent: 'All Agents', condition: 'Request outside 7AM-8PM', action: 'Queue for next business day', enabled: true, severity: 'medium', createdBy: 'Praveena', usageCount: 234 },
  { id: 'r4', name: 'PII Data Access', type: 'data', agent: 'HR', condition: 'Access employee PII data', action: 'Log access and notify HR manager', enabled: true, severity: 'high', createdBy: 'Kumar', usageCount: 45 },
  { id: 'r5', name: 'External Communications Cap', type: 'rate', agent: 'Sales', condition: 'Email send rate > 100/hour', action: 'Rate limit and alert', enabled: false, severity: 'medium', createdBy: 'Neelu', usageCount: 3 },
  { id: 'r6', name: 'Vendor Payment Limit', type: 'approval', agent: 'Finance', condition: 'Single vendor payment > $25,000', action: 'Require CFO approval', enabled: true, severity: 'critical', createdBy: 'Kumar', usageCount: 27 },
  { id: 'r7', name: 'New Employee Data Write', type: 'approval', agent: 'HR', condition: 'Creating new employee records', action: 'Require HR manager confirmation', enabled: true, severity: 'medium', createdBy: 'Praveena', usageCount: 18 },
];

const typeColors: Record<string, { color: string; bg: string; label: string; icon: React.ElementType }> = {
  approval:    { color: '#F97316', bg: '#FFF7ED', label: 'Approval Gate', icon: Check },
  restriction: { color: '#EF4444', bg: '#FEF2F2', label: 'Restriction', icon: Lock },
  time:        { color: '#8B5CF6', bg: '#F5F3FF', label: 'Time Gate', icon: Zap },
  data:        { color: '#0EA5E9', bg: '#E0F2FE', label: 'Data Policy', icon: Shield },
  rate:        { color: '#F59E0B', bg: '#FFFBEB', label: 'Rate Limit', icon: AlertTriangle },
};

const severityColors: Record<string, string> = {
  critical: 'bg-red-50 text-red-700',
  high: 'bg-orange-50 text-orange-700',
  medium: 'bg-amber-50 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
};

export function AccessRulesScreen({ onNavigate }: AccessRulesScreenProps) {
  const [rulesState, setRulesState] = useState(rules);

  const toggleRule = (id: string) => {
    setRulesState(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" /><strong>{rulesState.filter(r => r.enabled).length}</strong> active rules</span>
          <span className="text-muted-foreground">{rulesState.filter(r => !r.enabled).length} disabled</span>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Create Rule
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-3 max-w-4xl">
          {rulesState.map(rule => {
            const typeCfg = typeColors[rule.type];
            const TypeIcon = typeCfg.icon;
            return (
              <div key={rule.id} className={`bg-white border rounded-xl p-4 transition-all ${rule.enabled ? 'border-border' : 'border-border opacity-60'}`}>
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: typeCfg.bg }}>
                    <TypeIcon className="w-4 h-4" style={{ color: typeCfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-sm font-semibold text-foreground">{rule.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ color: typeCfg.color, background: typeCfg.bg }}>{typeCfg.label}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${severityColors[rule.severity]}`}>{rule.severity}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
                      <div>
                        <span className="text-xs text-muted-foreground">When: </span>
                        <span className="text-xs text-foreground font-medium">{rule.condition}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Then: </span>
                        <span className="text-xs text-foreground font-medium">{rule.action}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Agent: </span>
                        <span className="text-xs text-foreground">{rule.agent}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Triggered {rule.usageCount} times</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">Created by {rule.createdBy}</div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button onClick={() => toggleRule(rule.id)}
                      className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${rule.enabled ? 'bg-primary' : 'bg-muted'}`}>
                      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${rule.enabled ? 'left-5' : 'left-0.5'}`} />
                    </button>
                    <button className="p-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add New Rule */}
          <button className="w-full bg-muted/30 border-2 border-dashed border-border rounded-xl p-4 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all">
            <Plus className="w-4 h-4" /> Create new access rule
          </button>
        </div>
      </div>
    </div>
  );
}
