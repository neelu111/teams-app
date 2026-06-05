import React, { useState } from 'react';
import {
  GitBranch, Search, Plus, X, CheckCircle2, AlertCircle, Clock, Loader2,
  PauseCircle, XCircle, ChevronRight, Play, RotateCcw, Bell, Settings,
  BarChart2, List, LayoutList, Users, Tag, Zap,
} from 'lucide-react';
import { BAScreen } from '../businessAdminData';

interface BAWorkflowsProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

type WorkflowTemplate = {
  id: string;
  name: string;
  type: 'template';
  agent: string;
  category: string;
  steps: number;
  usageCount: number;
  lastUsed: string;
  status: 'active' | 'draft';
};

type ActiveWorkflow = {
  id: string;
  name: string;
  agent: string;
  status: 'running' | 'blocked' | 'completed' | 'failed';
  blockedBy?: string;
  startedAt: string;
  completedAt?: string;
  steps: number;
  completedSteps: number;
  error?: string;
};

const workflowTemplates: WorkflowTemplate[] = [
  { id: 'wf-t-001', name: 'New Lead Nurture',          type: 'template', agent: 'Sales',  category: 'Sales',      steps: 5, usageCount: 84,  lastUsed: '1 hr ago',   status: 'active' },
  { id: 'wf-t-002', name: 'Invoice Processing',         type: 'template', agent: 'Finance', category: 'Finance',    steps: 6, usageCount: 67,  lastUsed: '2 hrs ago',  status: 'active' },
  { id: 'wf-t-003', name: 'Employee Onboarding',        type: 'template', agent: 'HR',   category: 'HR',         steps: 9, usageCount: 12,  lastUsed: '3 days ago', status: 'active' },
  { id: 'wf-t-004', name: 'Support Ticket Triage',      type: 'template', agent: 'Support',   category: 'Support',    steps: 4, usageCount: 142, lastUsed: '5 min ago',  status: 'active' },
  { id: 'wf-t-005', name: 'Procurement Request',        type: 'template', agent: 'DevOps',   category: 'Operations', steps: 7, usageCount: 28,  lastUsed: 'Yesterday',  status: 'active' },
  { id: 'wf-t-006', name: 'Competitor Analysis',        type: 'template', agent: 'Marketing',  category: 'Research',   steps: 5, usageCount: 34,  lastUsed: 'Today',      status: 'active' },
  { id: 'wf-t-007', name: 'Deal Close Checklist',       type: 'template', agent: 'Sales',  category: 'Sales',      steps: 8, usageCount: 41,  lastUsed: '30 min ago', status: 'active' },
  { id: 'wf-t-008', name: 'Monthly Report Generation',  type: 'template', agent: 'Command', category: 'Reporting',  steps: 3, usageCount: 5,   lastUsed: '1 week ago', status: 'draft' },
];

const activeWorkflows: ActiveWorkflow[] = [
  { id: 'wf-a-001', name: 'InnovateCo Discount Approval', agent: 'Sales',  status: 'blocked',   blockedBy: 'Human Approval', startedAt: '11:40 AM', steps: 5, completedSteps: 3 },
  { id: 'wf-a-002', name: 'TechCorp IT Provisioning',      agent: 'DevOps',   status: 'running',   startedAt: '10:30 AM', steps: 7, completedSteps: 4 },
  { id: 'wf-a-003', name: 'Q3 Pipeline Review',            agent: 'Command', status: 'completed', startedAt: '9:00 AM',  completedAt: '9:47 AM', steps: 6, completedSteps: 6 },
  { id: 'wf-a-004', name: 'QuickBooks Reconciliation',     agent: 'Finance', status: 'failed',    startedAt: '11:55 AM', steps: 6, completedSteps: 2, error: 'QuickBooks API unavailable' },
  { id: 'wf-a-005', name: 'Support Ticket Batch TK-4521',  agent: 'Support',   status: 'running',   startedAt: '12:00 PM', steps: 4, completedSteps: 2 },
  { id: 'wf-a-006', name: 'New Hire: Dhathri',           agent: 'HR',   status: 'running',   startedAt: '10:45 AM', steps: 9, completedSteps: 3 },
];

const agentEmoji: Record<string, string> = {
  Sales: '📈', Finance: '💳', HR: '👥', Support: '🎯', DevOps: '⚙️', Marketing: '🔬', Command: '⚡',
};

const categoryColors: Record<string, string> = {
  Sales: 'bg-sky-100 text-sky-700',
  Finance: 'bg-amber-100 text-amber-700',
  HR: 'bg-green-100 text-green-700',
  Support: 'bg-pink-100 text-pink-700',
  Operations: 'bg-purple-100 text-purple-700',
  Research: 'bg-cyan-100 text-cyan-700',
  Reporting: 'bg-slate-100 text-slate-600',
};

const templateSteps: Record<string, string[]> = {
  'wf-t-001': ['Trigger: New lead form submitted', 'Command: Intent & lead scoring', 'Sales: CRM lookup & enrichment', 'Sales: Personalized email outreach', 'Sales: Follow-up sequence scheduled'],
  'wf-t-002': ['Trigger: Invoice received via email', 'Finance: OCR & data extraction', 'Finance: PO matching & validation', 'Human Approval Gate (>$10k)', 'Finance: Payment initiation', 'Finance: Reconciliation & log'],
  'wf-t-003': ['Trigger: New hire added in BambooHR', 'HR: Profile setup & accounts', 'DevOps: IT equipment provisioning', 'HR: Training schedule created', 'HR: Buddy program assignment', 'HR: Day-1 welcome Slack message', 'DevOps: Access rights configured', 'HR: 30-day check-in scheduled', 'HR: Onboarding complete'],
  'wf-t-004': ['Trigger: Ticket received in Zendesk', 'Support: Category & priority classification', 'Support: SLA window assigned', 'Support: Auto-response sent to customer'],
  'wf-t-005': ['Trigger: Procurement request submitted', 'DevOps: Budget validation', 'DevOps: Vendor lookup & comparison', 'Human Approval Gate (>$5k)', 'DevOps: PO creation in SAP', 'DevOps: Vendor notification', 'DevOps: Delivery tracking setup'],
  'wf-t-006': ['Trigger: Research request received', 'Marketing: Web search & source gathering', 'Marketing: Data synthesis & analysis', 'Marketing: Competitive matrix built', 'Marketing: Report generation & delivery'],
  'wf-t-007': ['Trigger: Deal moved to Close stage', 'Sales: CRM data completeness check', 'Human Approval Gate (contract review)', 'Sales: Contract template generation', 'Sales: DocuSign envelope sent', 'Command: Finance & legal notification', 'Sales: CRM closed-won update', 'Sales: Onboarding handoff initiated'],
  'wf-t-008': ['Trigger: 1st of month at 8:00 AM', 'Command: Data aggregation from all agents', 'Command: Report generation & formatting'],
};

const activeStepDetails: Record<string, string[]> = {
  'wf-a-001': ['Trigger: Discount request received', 'Sales: CRM contact lookup', 'Sales: Deal validation', 'Human Approval Gate — Waiting', 'Sales: Send updated proposal'],
  'wf-a-002': ['Trigger: IT provisioning request', 'DevOps: Ticket created in ServiceNow', 'DevOps: Asset inventory check', 'DevOps: Laptop & peripherals ordered', 'DevOps: VPN & access provisioning', 'DevOps: Slack & tool setup', 'DevOps: Provisioning complete'],
  'wf-a-003': ['Trigger: Scheduled pipeline review', 'Command: CRM data pull', 'Sales: Pipeline risk analysis', 'Finance: Revenue projection', 'Marketing: Market context', 'Command: Report compiled & sent'],
  'wf-a-004': ['Trigger: Invoice batch processing', 'Finance: PDF extraction', 'Finance: PO matching — FAILED', 'Finance: Error: API unavailable', 'Finance: Retry attempt 1', 'Finance: Retry attempt 2'],
  'wf-a-005': ['Trigger: Ticket batch TK-4521', 'Support: Priority classification', 'Support: Auto-responses sent', 'Support: Escalation check'],
  'wf-a-006': ['Trigger: Dhathri added in HR', 'HR: Profile setup & IT request', 'DevOps: IT provisioning started', 'HR: Training schedule', 'HR: Access configuration', 'DevOps: Laptop shipping', 'HR: Buddy assignment', 'HR: Welcome message', 'HR: Onboarding complete'],
};

type TabType = 'templates' | 'active' | 'all';
type DetailTab = 'overview' | 'steps' | 'settings';

function StatusBadge({ status }: { status: ActiveWorkflow['status'] }) {
  const map = {
    running:   'bg-blue-100 text-blue-700',
    blocked:   'bg-orange-100 text-orange-700',
    completed: 'bg-green-100 text-green-700',
    failed:    'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[status]}`}>
      {status}
    </span>
  );
}

function TemplateCard({ tpl, selected, onClick }: { tpl: WorkflowTemplate; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${selected ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/40'}`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-sm font-semibold text-foreground leading-tight">{tpl.name}</p>
        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${tpl.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
          {tpl.status}
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span>{agentEmoji[tpl.agent]} {tpl.agent}</span>
        <span>·</span>
        <span className={`px-1.5 py-0.5 rounded-md font-medium ${categoryColors[tpl.category] ?? 'bg-slate-100 text-slate-600'}`}>{tpl.category}</span>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{tpl.steps} steps</span>
        <span className="flex items-center gap-1"><BarChart2 className="w-3 h-3" />{tpl.usageCount} runs</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{tpl.lastUsed}</span>
      </div>
    </div>
  );
}

function ActiveWorkflowRow({ wf, selected, onClick }: { wf: ActiveWorkflow; selected: boolean; onClick: () => void }) {
  const pct = Math.round((wf.completedSteps / wf.steps) * 100);
  const barColor = wf.status === 'failed' ? 'bg-red-500' : wf.status === 'blocked' ? 'bg-orange-400' : wf.status === 'completed' ? 'bg-green-500' : 'bg-blue-500';
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${selected ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/40'}`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-sm font-semibold text-foreground truncate">{wf.name}</p>
        <StatusBadge status={wf.status} />
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
        <span>{agentEmoji[wf.agent]} {wf.agent}</span>
        <span>·</span>
        <span>Started {wf.startedAt}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">{wf.completedSteps}/{wf.steps}</span>
      </div>
    </div>
  );
}

function TemplateDetail({ tpl, onClose }: { tpl: WorkflowTemplate; onClose: () => void }) {
  const [tab, setTab] = useState<DetailTab>('overview');
  const [enabled, setEnabled] = useState(tpl.status === 'active');
  const steps = templateSteps[tpl.id] ?? [];

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'steps',    label: 'Steps' },
    { key: 'settings', label: 'Settings' },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-foreground truncate">{tpl.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{agentEmoji[tpl.agent]} {tpl.agent} · {tpl.category}</p>
        </div>
        <button onClick={onClose} className="ml-3 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex gap-1 px-5 pt-3 border-b border-border">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-t-lg transition-colors ${tab === t.key ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Category',    value: tpl.category },
                { label: 'Agent',       value: `${agentEmoji[tpl.agent]} ${tpl.agent}` },
                { label: 'Total Runs',  value: tpl.usageCount.toString() },
                { label: 'Last Used',   value: tpl.lastUsed },
                { label: 'Steps',       value: tpl.steps.toString() },
                { label: 'Status',      value: tpl.status },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm font-semibold text-foreground capitalize">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground leading-relaxed">
                Automates the {tpl.name.toLowerCase()} process end-to-end using {tpl.agent} as the primary agent.
                Triggers automatically based on defined conditions and handles {tpl.steps} sequential steps
                with built-in error handling and approval gates where required.
              </p>
            </div>
          </div>
        )}
        {tab === 'steps' && (
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div className="flex-1 py-2 px-3 bg-slate-50 rounded-lg border border-border">
                  <p className="text-sm text-foreground">{step}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute ml-[11px] mt-7 w-px h-3 bg-border" style={{ position: 'relative', left: -steps.length }} />
                )}
              </div>
            ))}
          </div>
        )}
        {tab === 'settings' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-border">
              <div>
                <p className="text-sm font-semibold text-foreground">Enable Template</p>
                <p className="text-xs text-muted-foreground">Allow users to trigger this workflow</p>
              </div>
              <button
                onClick={() => setEnabled(!enabled)}
                className={`w-10 h-6 rounded-full transition-colors ${enabled ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <span className={`block w-4 h-4 bg-white rounded-full shadow transition-transform mx-1 ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground mb-1">Default Agent</p>
              <p className="text-sm font-semibold text-foreground">{agentEmoji[tpl.agent]} {tpl.agent}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-border">
              <p className="text-xs text-muted-foreground mb-2">Allowed Roles</p>
              <div className="flex flex-wrap gap-1.5">
                {['Employee', 'Manager', 'Business Admin'].map(role => (
                  <span key={role} className="px-2 py-1 bg-white border border-border rounded-lg text-xs font-medium text-foreground">{role}</span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-5 py-4 border-t border-border">
        <button className="w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          <Play className="w-4 h-4" />
          Run Workflow
        </button>
      </div>
    </div>
  );
}

function ActiveDetail({ wf, onClose }: { wf: ActiveWorkflow; onClose: () => void }) {
  const steps = activeStepDetails[wf.id] ?? [];
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={wf.status} />
          </div>
          <h2 className="text-base font-bold text-foreground truncate">{wf.name}</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{agentEmoji[wf.agent]} {wf.agent} · Started {wf.startedAt}</p>
        </div>
        <button onClick={onClose} className="ml-3 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>

      {wf.status === 'blocked' && (
        <div className="mx-5 mt-4 p-3 bg-orange-50 border border-orange-200 rounded-xl">
          <p className="text-xs font-semibold text-orange-700 mb-1 flex items-center gap-1.5">
            <PauseCircle className="w-3.5 h-3.5" />
            Waiting for: Neelu
          </p>
          <p className="text-xs text-orange-600 mb-2">InnovateCo 15% discount approval</p>
          <button className="px-3 py-1.5 bg-orange-600 text-white text-xs font-semibold rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5">
            <Bell className="w-3 h-3" />
            Send Reminder
          </button>
        </div>
      )}

      {wf.status === 'failed' && wf.error && (
        <div className="mx-5 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-xs font-semibold text-red-700 mb-1 flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Error
          </p>
          <p className="text-xs text-red-600 mb-2">{wf.error}</p>
          <button className="px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3" />
            Retry Workflow
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Progress</p>
        <div className="space-y-0">
          {steps.map((step, i) => {
            const isDone = i < wf.completedSteps;
            const isActive = i === wf.completedSteps && wf.status === 'running';
            const isBlocked = i === wf.completedSteps && wf.status === 'blocked';
            const isFailed = i === wf.completedSteps && wf.status === 'failed';

            let Icon = Clock;
            let iconClass = 'text-slate-400';
            let iconBg = 'bg-slate-100';
            if (isDone) { Icon = CheckCircle2; iconClass = 'text-green-600'; iconBg = 'bg-green-100'; }
            else if (isActive) { Icon = Loader2; iconClass = 'text-blue-600'; iconBg = 'bg-blue-100'; }
            else if (isBlocked) { Icon = PauseCircle; iconClass = 'text-orange-600'; iconBg = 'bg-orange-100'; }
            else if (isFailed) { Icon = XCircle; iconClass = 'text-red-600'; iconBg = 'bg-red-100'; }

            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
                    <Icon className={`w-3.5 h-3.5 ${iconClass} ${isActive ? 'animate-spin' : ''}`} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-px flex-1 my-1 ${isDone ? 'bg-green-300' : 'bg-slate-200'}`} style={{ minHeight: 16 }} />
                  )}
                </div>
                <div className="pb-3 pt-1">
                  <p className={`text-sm ${isDone ? 'text-foreground' : isActive || isBlocked || isFailed ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                    {step}
                  </p>
                  {isDone && <p className="text-xs text-green-600 mt-0.5">Completed</p>}
                  {isActive && <p className="text-xs text-blue-600 mt-0.5">In progress...</p>}
                  {isBlocked && <p className="text-xs text-orange-600 mt-0.5">Awaiting approval</p>}
                  {isFailed && <p className="text-xs text-red-600 mt-0.5">{wf.error}</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border space-y-2">
          {[
            { label: 'Assigned Agent', value: `${agentEmoji[wf.agent]} ${wf.agent}` },
            { label: 'Started At',     value: wf.startedAt },
            ...(wf.completedAt ? [{ label: 'Completed At', value: wf.completedAt }] : []),
            { label: 'Progress',       value: `${wf.completedSteps} of ${wf.steps} steps` },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-semibold text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BAWorkflowsScreen({ onNavigate }: BAWorkflowsProps) {
  const [tab, setTab] = useState<TabType>('templates');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const runningCount = activeWorkflows.filter(w => w.status === 'running' || w.status === 'blocked').length;

  const filteredTemplates = workflowTemplates.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.agent.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredActive = activeWorkflows.filter(w =>
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.agent.toLowerCase().includes(search.toLowerCase())
  );

  const allToday = [
    ...workflowTemplates.map(t => ({ kind: 'template' as const, item: t })),
    ...activeWorkflows.map(w => ({ kind: 'active' as const, item: w })),
  ].filter(({ item }) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedTemplate = workflowTemplates.find(t => t.id === selectedId);
  const selectedActive   = activeWorkflows.find(w => w.id === selectedId);
  const hasSelection     = selectedTemplate || selectedActive;

  const listWidth = hasSelection ? 'w-72 shrink-0' : 'flex-1';

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* LEFT PANEL */}
      <div className={`${listWidth} flex flex-col border-r border-border transition-all duration-200`}>
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-base font-bold text-foreground">Workflows</h1>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity">
              <Plus className="w-3.5 h-3.5" />
              Create Template
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search workflows..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-slate-50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {([
            { key: 'templates', label: 'Templates' },
            { key: 'active',    label: 'Active', badge: runningCount },
            { key: 'all',       label: 'All Today' },
          ] as { key: TabType; label: string; badge?: number }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border-b-2 ${tab === t.key ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'}`}
            >
              {t.label}
              {t.badge !== undefined && t.badge > 0 && (
                <span className="min-w-[18px] h-[18px] px-1 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {tab === 'templates' && filteredTemplates.map(t => (
            <TemplateCard
              key={t.id}
              tpl={t}
              selected={selectedId === t.id}
              onClick={() => setSelectedId(selectedId === t.id ? null : t.id)}
            />
          ))}

          {tab === 'active' && filteredActive.map(w => (
            <ActiveWorkflowRow
              key={w.id}
              wf={w}
              selected={selectedId === w.id}
              onClick={() => setSelectedId(selectedId === w.id ? null : w.id)}
            />
          ))}

          {tab === 'all' && allToday.map(({ kind, item }) =>
            kind === 'template' ? (
              <TemplateCard
                key={item.id}
                tpl={item as WorkflowTemplate}
                selected={selectedId === item.id}
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
              />
            ) : (
              <ActiveWorkflowRow
                key={item.id}
                wf={item as ActiveWorkflow}
                selected={selectedId === item.id}
                onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
              />
            )
          )}

          {tab === 'templates' && filteredTemplates.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">No templates found</div>
          )}
          {tab === 'active' && filteredActive.length === 0 && (
            <div className="py-10 text-center text-sm text-muted-foreground">No active workflows</div>
          )}
        </div>
      </div>

      {/* RIGHT DETAIL PANEL */}
      {hasSelection && (
        <div className="flex-1 overflow-hidden bg-white border-l border-border">
          {selectedTemplate && (
            <TemplateDetail tpl={selectedTemplate} onClose={() => setSelectedId(null)} />
          )}
          {selectedActive && (
            <ActiveDetail wf={selectedActive} onClose={() => setSelectedId(null)} />
          )}
        </div>
      )}

      {!hasSelection && (
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <GitBranch className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-sm font-semibold text-muted-foreground">Select a workflow to view details</p>
            <p className="text-xs text-muted-foreground mt-1">Click any template or active workflow</p>
          </div>
        </div>
      )}
    </div>
  );
}
