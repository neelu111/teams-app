import React, { useState } from 'react';
import {
  CheckCircle2, XCircle, MessageSquare, AlertCircle, Clock,
  ChevronRight, Bot, DollarSign, FileText, Calendar, Users, TrendingDown, AlertTriangle
} from 'lucide-react';
import { MScreen, MApproval, ApprovalStatus, managerApprovals } from '../managerData';
import { AgentAvatar, UserAvatar } from '../../shared/AgentAvatar';

const statusConfig: Record<ApprovalStatus, { label: string; color: string; bg: string }> = {
  pending:           { label: 'Pending',           color: '#F59E0B', bg: 'bg-yellow-50' },
  approved:          { label: 'Approved',          color: '#10B981', bg: 'bg-green-50' },
  rejected:          { label: 'Rejected',          color: '#EF4444', bg: 'bg-red-50' },
  'changes-requested': { label: 'Changes Requested', color: '#8B5CF6', bg: 'bg-purple-50' },
};

const urgencyConfig = {
  critical: { color: '#EF4444', bg: 'bg-red-50', label: 'Critical' },
  high:     { color: '#F97316', bg: 'bg-orange-50', label: 'High' },
  medium:   { color: '#F59E0B', bg: 'bg-yellow-50', label: 'Medium' },
  low:      { color: '#10B981', bg: 'bg-green-50', label: 'Low' },
};

const categoryIcons: Record<string, React.ElementType> = {
  discount: TrendingDown,
  expense:  DollarSign,
  budget:   DollarSign,
  contract: FileText,
  deadline: Calendar,
  headcount: Users,
};

const timelineTypeColors = {
  request:   '#5C5FEF',
  update:    '#0EA5E9',
  action:    '#10B981',
  escalation: '#EF4444',
};

interface MApprovalsScreenProps {
  onNavigate: (screen: MScreen, id?: string) => void;
  initialApprovalId?: string;
}

export function MApprovalsScreen({ onNavigate, initialApprovalId }: MApprovalsScreenProps) {
  const [approvals, setApprovals] = useState<MApproval[]>(managerApprovals);
  const [selectedId, setSelectedId] = useState<string | null>(initialApprovalId || managerApprovals.find(a => a.status === 'pending')?.id || null);
  const [filterStatus, setFilterStatus] = useState<'all' | ApprovalStatus>('all');
  const [changesNote, setChangesNote] = useState('');
  const [showChangesInput, setShowChangesInput] = useState(false);

  const filtered = approvals.filter(a => filterStatus === 'all' || a.status === filterStatus);
  const selected = approvals.find(a => a.id === selectedId) || null;

  const handleApprove = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id
      ? { ...a, status: 'approved', timeline: [...a.timeline, { event: 'Approved by Neelu', time: 'Just now', actor: 'Neelu', type: 'action' as const }] }
      : a
    ));
  };

  const handleReject = (id: string) => {
    setApprovals(prev => prev.map(a => a.id === id
      ? { ...a, status: 'rejected', timeline: [...a.timeline, { event: 'Rejected by Neelu', time: 'Just now', actor: 'Neelu', type: 'action' as const }] }
      : a
    ));
  };

  const handleRequestChanges = (id: string) => {
    if (!changesNote.trim()) return;
    setApprovals(prev => prev.map(a => a.id === id
      ? { ...a, status: 'changes-requested', changesNotes: changesNote, timeline: [...a.timeline, { event: `Changes requested: ${changesNote}`, time: 'Just now', actor: 'Neelu', type: 'action' as const }] }
      : a
    ));
    setChangesNote('');
    setShowChangesInput(false);
  };

  const statusCounts = {
    all: approvals.length,
    pending: approvals.filter(a => a.status === 'pending').length,
    approved: approvals.filter(a => a.status === 'approved').length,
    rejected: approvals.filter(a => a.status === 'rejected').length,
    'changes-requested': approvals.filter(a => a.status === 'changes-requested').length,
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Left: Approval List */}
      <div className={`flex flex-col bg-white border-r border-border overflow-hidden transition-all ${selectedId ? 'w-[40%]' : 'flex-1'}`}>
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold text-foreground">Approvals Center</h1>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-orange-600">{statusCounts.pending} pending</span>
              <span>·</span>
              <span>{statusCounts.approved} approved</span>
            </div>
          </div>
          {/* Filter tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {([
              { key: 'all', label: `All (${statusCounts.all})` },
              { key: 'pending', label: `Pending (${statusCounts.pending})` },
              { key: 'approved', label: `Approved` },
              { key: 'rejected', label: `Rejected` },
              { key: 'changes-requested', label: `Changes` },
            ] as const).map(tab => (
              <button key={tab.key} onClick={() => setFilterStatus(tab.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${filterStatus === tab.key ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-muted/50'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filtered.map(ap => {
            const sc = statusConfig[ap.status];
            const uc = urgencyConfig[ap.urgency];
            const Icon = categoryIcons[ap.category] || FileText;
            const isSelected = selectedId === ap.id;
            return (
              <div key={ap.id} onClick={() => setSelectedId(isSelected ? null : ap.id)}
                className={`px-4 py-4 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/20'} ${ap.status === 'pending' && ap.urgency === 'critical' ? 'bg-red-50/30' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${uc.bg}`}>
                    <Icon className="w-4 h-4" style={{ color: uc.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-sm font-medium text-foreground leading-snug">{ap.title}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${sc.bg}`} style={{ color: sc.color }}>{sc.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserAvatar initials={ap.requestedByInitials} name={ap.requestedBy} size="xs" color={ap.requestedByColor} />
                      <span className="text-xs text-muted-foreground">{ap.requestedBy}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{ap.timeLabel}</span>
                    </div>
                    {ap.dueDateLabel && ap.status === 'pending' && (
                      <div className={`flex items-center gap-1 mt-1.5 text-xs ${ap.urgency === 'critical' ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                        <Clock className="w-3 h-3" /> {ap.dueDateLabel}
                      </div>
                    )}
                    {ap.amount && (
                      <p className="text-xs font-semibold text-foreground mt-1">{ap.amountLabel}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Approval Detail */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Detail header */}
          <div className="px-6 py-4 bg-white border-b border-border flex-shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <h2 className="text-base font-semibold text-foreground mb-1">{selected.title}</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[selected.status].bg}`} style={{ color: statusConfig[selected.status].color }}>
                    {statusConfig[selected.status].label}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${urgencyConfig[selected.urgency].bg}`} style={{ color: urgencyConfig[selected.urgency].color }}>
                    {urgencyConfig[selected.urgency].label} Priority
                  </span>
                  {selected.dueDateLabel && (
                    <span className={`text-xs flex items-center gap-1 ${selected.urgency === 'critical' ? 'text-red-600 font-semibold' : 'text-muted-foreground'}`}>
                      <Clock className="w-3 h-3" /> {selected.dueDateLabel}
                    </span>
                  )}
                </div>
              </div>
              {/* Action buttons (only for pending) */}
              {selected.status === 'pending' && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setShowChangesInput(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" /> Request Changes
                  </button>
                  <button onClick={() => handleReject(selected.id)}
                    className="flex items-center gap-1.5 px-3 py-2 border border-red-200 bg-red-50 rounded-lg text-xs font-medium text-red-600 hover:bg-red-100 transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button onClick={() => handleApprove(selected.id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              )}
              {selected.status === 'approved' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </div>
              )}
              {selected.status === 'rejected' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
                  <XCircle className="w-3.5 h-3.5" /> Rejected
                </div>
              )}
            </div>
            {/* Changes requested input */}
            {showChangesInput && selected.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <input
                  value={changesNote}
                  onChange={e => setChangesNote(e.target.value)}
                  placeholder="Describe what changes are needed..."
                  className="flex-1 px-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button onClick={() => handleRequestChanges(selected.id)} disabled={!changesNote.trim()}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 disabled:opacity-40 transition-colors">
                  Send
                </button>
              </div>
            )}
          </div>

          {/* Detail content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Requester + context */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Requested By</p>
                <div className="flex items-center gap-3">
                  <UserAvatar initials={selected.requestedByInitials} name={selected.requestedBy} size="md" color={selected.requestedByColor} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.requestedBy}</p>
                    <p className="text-xs text-muted-foreground">{selected.requestedByRole}</p>
                    <p className="text-xs text-muted-foreground">{selected.timeLabel}</p>
                  </div>
                </div>
              </div>
              {selected.amount && (
                <div className="bg-white border border-border rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Financial Impact</p>
                  <p className="text-2xl font-bold text-foreground">${selected.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{selected.amountLabel}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Request Details</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.description}</p>
            </div>

            {/* Business Context */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Context</p>
              <p className="text-sm text-foreground leading-relaxed">{selected.businessContext}</p>
            </div>

            {/* AI Analysis */}
            <div className="bg-white border border-indigo-100 rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #F0F1FE 0%, #FAFBFF 100%)' }}>
              <div className="flex items-center gap-2 mb-2">
                <AgentAvatar type={selected.agentType as any} name={selected.agentName} size="xs" showStatus status="active" />
                <p className="text-xs font-semibold text-foreground">{selected.agentName} Analysis</p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{selected.agentAnalysis}</p>
            </div>

            {/* Impact grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-border rounded-xl p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Impact</p>
                <p className="text-sm text-foreground leading-relaxed">{selected.impact}</p>
              </div>
              <div className={`rounded-xl p-4 border ${selected.urgency === 'critical' ? 'bg-red-50 border-red-200' : 'bg-white border-border'}`}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3" /> Risk if Delayed
                </p>
                <p className="text-sm text-foreground leading-relaxed">{selected.riskIfDelayed}</p>
              </div>
            </div>

            {/* Changes notes */}
            {selected.changesNotes && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-purple-700 uppercase tracking-wider mb-2">Changes Requested</p>
                <p className="text-sm text-foreground">{selected.changesNotes}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-white border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Approval Timeline</p>
              <div className="space-y-0">
                {selected.timeline.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 relative">
                    {i < selected.timeline.length - 1 && (
                      <div className="absolute left-[9px] top-5 w-px bg-border" style={{ height: 'calc(100% - 8px)' }} />
                    )}
                    <span className="w-4.5 h-4.5 rounded-full flex-shrink-0 border-2 border-white ring-2 z-10 mt-0.5"
                      style={{ background: timelineTypeColors[ev.type] }}
                    />
                    <div className="pb-4 flex-1">
                      <p className="text-sm text-foreground">{ev.event}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{ev.time} · {ev.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Related workflow */}
            {selected.relatedWorkflowId && (
              <button onClick={() => onNavigate('team-workflows', selected.relatedWorkflowId)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-border rounded-xl hover:border-primary/30 hover:bg-primary/5 transition-all text-left">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground font-medium">Related workflow: {selected.relatedWorkflowTitle}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Select an approval</h3>
          <p className="text-xs text-muted-foreground max-w-xs">Choose a request to review its full context, AI analysis, and take action.</p>
        </div>
      )}
    </div>
  );
}
