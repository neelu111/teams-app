import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Paperclip, Plus, Search, Sparkles, FileText, BarChart3,
  Mail, Calendar, Users, CheckCircle2, XCircle,
  MoreHorizontal, Bot, AlertCircle, Clock, CheckCircle, XOctagon, RefreshCw,
  ChevronRight, Bell, Zap,
} from 'lucide-react';
import { EScreen, EThread, EMessage, employeeThreads, employeeTasks } from '../employeeData';
import { AgentAvatar } from '../../shared/AgentAvatar';
import { MentionOption, getActiveMention, getMentionSuggestions, insertMention, renderTextWithMentions, extractMentionLabels } from '../../shared/mentions';
import { generateThreadTitle } from '../../shared/threadNaming';

const agentColors: Record<string, string> = {
  super: '#5C5FEF', sales: '#0EA5E9', hr: '#10B981',
  finance: '#F59E0B', research: '#06B6D4',
};

const suggestedPrompts = [
  { icon: FileText, label: 'Draft a proposal', desc: 'For a prospect or renewal', color: '#0EA5E9', prompt: 'Create a sales proposal for ' },
  { icon: BarChart3, label: 'Generate a report', desc: 'Pipeline, performance, analysis', color: '#5C5FEF', prompt: 'Generate a report on ' },
  { icon: Mail, label: 'Write an email', desc: 'Follow-up, intro, or update', color: '#8B5CF6', prompt: 'Write an email to ' },
  { icon: Search, label: 'Research a topic', desc: 'Competitor, prospect, market', color: '#06B6D4', prompt: 'Research ' },
  { icon: Calendar, label: 'Schedule a meeting', desc: 'With any contact or team', color: '#10B981', prompt: 'Schedule a meeting with ' },
  { icon: Users, label: 'Summarize a document', desc: 'Contract, report, or proposal', color: '#F59E0B', prompt: 'Summarize this document: ' },
];

const agents = [
  { name: 'Command', type: 'super', desc: 'General · Routes to specialists' },
  { name: 'Sales', type: 'sales', desc: 'Sales · Proposals & CRM' },
  { name: 'Marketing', type: 'research', desc: 'Research · Analysis & insights' },
  { name: 'HR', type: 'hr', desc: 'HR · People & scheduling' },
  { name: 'Finance', type: 'finance', desc: 'Finance · Expenses & invoices' },
];

function WorkflowCard({ data }: { data: any }) {
  const statusColors: Record<string, { bg: string; text: string; label: string }> = {
    running:      { bg: 'bg-blue-50',   text: 'text-blue-600',   label: 'Running' },
    waiting:      { bg: 'bg-amber-50',  text: 'text-amber-600',  label: 'Waiting' },
    'needs-action': { bg: 'bg-red-50', text: 'text-red-600',    label: 'Needs Action' },
    completed:    { bg: 'bg-green-50',  text: 'text-green-600',  label: 'Completed' },
    blocked:      { bg: 'bg-rose-50',   text: 'text-rose-600',   label: 'Blocked' },
    scheduled:    { bg: 'bg-purple-50', text: 'text-purple-600', label: 'Scheduled' },
  };
  const s = statusColors[data.status] || statusColors.running;
  return (
    <div className="mt-2 border border-blue-100 rounded-xl bg-blue-50/40 overflow-hidden max-w-md">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-foreground leading-tight">{data.title}</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${s.bg} ${s.text}`}>{s.label}</span>
        </div>
        {data.lastStep && <p className="text-xs text-muted-foreground mb-2 pl-8">{data.lastStep}</p>}
        <div className="pl-8">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>{data.completedTasks}/{data.taskCount} steps</span>
            <span>{data.progress}%</span>
          </div>
          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${data.progress}%` }} />
          </div>
        </div>
      </div>
      <div className="border-t border-blue-100 px-4 py-2.5 bg-white/60 flex items-center gap-2">
        <button className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90 transition-opacity">
          Review & Approve
        </button>
        <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
          Add context
        </button>
        <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
          View source
        </button>
      </div>
    </div>
  );
}

function ApprovalCard({ data, onApprove, onReject, state }: { data: any; onApprove: () => void; onReject: () => void; state: 'pending' | 'approved' | 'rejected' }) {
  return (
    <div className="mt-2 border border-orange-100 rounded-xl bg-orange-50/40 overflow-hidden max-w-md">
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-start gap-2 mb-2">
          <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <div className="text-xs font-semibold text-foreground leading-tight">{data.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{data.description}</div>
          </div>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium flex-shrink-0">Needs Action</span>
        </div>
        <div className="space-y-1 text-xs pl-9 mb-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Requested by</span>
            <span className="font-medium text-foreground">{data.requestedBy}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Financial impact</span>
            <span className="font-medium text-foreground">{data.impact}</span>
          </div>
          {data.deadline && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Deadline</span>
              <span className="font-medium text-orange-600">{data.deadline}</span>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-orange-100 px-4 py-2.5 bg-white/60">
        {state === 'pending' ? (
          <div className="flex gap-2">
            <button onClick={onApprove} className="flex-1 py-1.5 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
            </button>
            <button onClick={onReject} className="flex-1 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/70 transition-colors flex items-center justify-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> Decline
            </button>
            <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">
              Reply
            </button>
          </div>
        ) : (
          <div className={`py-1.5 rounded-lg text-xs font-medium text-center ${state === 'approved' ? 'bg-green-50 text-green-700' : 'bg-muted text-muted-foreground'}`}>
            {state === 'approved' ? '✓ Approved — agent will proceed' : '✕ Declined — agent notified'}
          </div>
        )}
      </div>
    </div>
  );
}

function MessageBubble({ msg, onApprove, onReject, approvalStates }: { msg: EMessage; onApprove: (id: string) => void; onReject: (id: string) => void; approvalStates: Record<string, 'pending' | 'approved' | 'rejected'> }) {
  const isUser = msg.role === 'user';
  const isSystem = msg.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{msg.content}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && msg.agentType && (
        <div className="flex-shrink-0 mb-1">
          <AgentAvatar type={msg.agentType as any} name={msg.agentName || ''} size="sm" />
        </div>
      )}
      <div className={`max-w-[70%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isUser && (
          <span className="text-xs font-medium mb-1 px-1" style={{ color: agentColors[msg.agentType || 'super'] }}>
            {msg.agentName}
          </span>
        )}
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'text-white rounded-br-sm'
              : 'bg-white border border-border text-foreground rounded-bl-sm'
          }`}
          style={isUser ? { background: 'linear-gradient(135deg, #5C5FEF, #7C3AED)' } : {}}
        >
          {msg.content.split('\n').map((line, index) => (
            <p key={index} className={index > 0 ? 'mt-1' : ''}>
              {renderTextWithMentions(line, isUser ? 'bg-white/25 rounded px-1 py-0.5 font-semibold' : 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}
            </p>
          ))}
        </div>
        {msg.type === 'workflow-card' && msg.cardData && <WorkflowCard data={msg.cardData} />}
        {msg.type === 'approval-card' && msg.cardData && (
          <ApprovalCard
            data={msg.cardData}
            state={approvalStates[msg.id] || 'pending'}
            onApprove={() => onApprove(msg.id)}
            onReject={() => onReject(msg.id)}
          />
        )}
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

interface EAIScreenProps {
  onNavigate: (screen: EScreen, id?: string) => void;
  activeUser?: { name: string; avatar: string };
  initialThreadId?: string;
}

// ── Right Panel Work Control ───────────────────────────────────────────────────
const needsActionTasks = [
  { id: 'et-001', title: 'Review TechCorp Q3 Proposal', agent: 'Sales', status: 'needs-action', label: 'Needs Action', due: 'Due today at 5 PM', labelColor: 'bg-red-50 text-red-600', detail: { goal: 'Generate and send Q3 expansion proposal', owner: 'Sales (Sales Agent)', source: 'TechCorp Q3 Proposal thread', due: 'Today, 5:00 PM', perms: 'Your review required before send' } },
  { id: 'et-002', title: 'Approve 15% Discount — InnovateCo', agent: 'Sales', status: 'overdue', label: 'Overdue', due: '1 day overdue', labelColor: 'bg-rose-50 text-rose-700', detail: { goal: 'Approve discount and close $240k deal', owner: 'Sales (Sales Agent)', source: 'InnovateCo Discount Decision thread', due: 'Yesterday, 12:00 PM', perms: 'Manager approval required' } },
  { id: 'et-007', title: 'Review Competitive Analysis — Q3', agent: 'Marketing', status: 'needs-action', label: 'Review', due: 'Due Saturday', labelColor: 'bg-amber-50 text-amber-700', detail: { goal: 'Review and share Q3 competitive report', owner: 'Marketing (Research Agent)', source: 'Q3 Competitive Research thread', due: 'Saturday, 5:00 PM', perms: 'Your sign-off to share with leadership' } },
];

const auditEvents = [
  { color: 'bg-green-500', title: 'Sales created workflow', meta: 'TechCorp Q3 Proposal — today at 9:02 AM', },
  { color: 'bg-blue-500',  title: 'Account data retrieved', meta: 'Connector: HubSpot CRM — 47 records pulled', },
  { color: 'bg-blue-500',  title: 'Proposal draft generated', meta: '24 pages · custom pricing configured', },
  { color: 'bg-amber-500', title: 'Human review requested', meta: 'Waiting on your approval before send', },
];

function WorkControlPanel({ onApproveTask }: { onApproveTask: (id: string) => void }) {
  const [selectedTask, setSelectedTask] = useState(needsActionTasks[0]);
  const [taskStates, setTaskStates] = useState<Record<string, 'pending' | 'approved' | 'rejected'>>({});
  const [hovered, setHovered] = useState(false);
  const [pinned, setPinned] = useState(false);
  const expanded = pinned || hovered;

  const handleApprove = (id: string) => {
    setTaskStates(p => ({ ...p, [id]: 'approved' }));
    onApproveTask(id);
  };
  const handleReject = (id: string) => setTaskStates(p => ({ ...p, [id]: 'rejected' }));
  const pendingCount = needsActionTasks.filter(t => !taskStates[t.id]).length;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex-shrink-0 border-l border-border bg-white flex flex-col overflow-hidden transition-all duration-200"
      style={{ width: expanded ? 320 : 48 }}
    >
      <div className="px-3 py-3.5 border-b border-border flex-shrink-0 flex items-center justify-between gap-2">
        {expanded && (
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-foreground">Work Control</div>
            <div className="text-xs text-muted-foreground">Tasks, actions & audit trail</div>
          </div>
        )}
        <button
          onClick={() => setPinned(p => !p)}
          title={pinned ? 'Unpin panel' : 'Pin Work Control panel'}
          className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${pinned ? 'bg-primary text-primary-foreground' : 'bg-primary/10 hover:bg-primary/20'}`}
        >
          <Zap className={`w-3.5 h-3.5 ${pinned ? 'text-white' : 'text-primary'}`} />
        </button>
      </div>

      {/* Collapsed indicator strip */}
      {!expanded && (
        <div className="flex flex-col items-center py-4 gap-3">
          {/* Pending badge */}
          {pendingCount > 0 && (
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold leading-none">{pendingCount}</span>
            </div>
          )}
          {/* Vertical label */}
          <span
            className="text-xs font-semibold text-muted-foreground select-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', letterSpacing: '0.05em' }}
          >
            Work Control
          </span>
        </div>
      )}

      <div className={`flex-1 overflow-y-auto ${expanded ? '' : 'invisible'}`}>
        {/* Tasks Needing Action */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-foreground">Needs Action</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                {pendingCount} pending
            </span>
          </div>
          <div className="space-y-2">
            {needsActionTasks.map(task => {
              const state = taskStates[task.id];
              const isSelected = selectedTask.id === task.id;
              return (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className={`rounded-lg border p-2.5 cursor-pointer transition-all ${isSelected ? 'border-primary/30 bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/20'} ${state ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-medium text-foreground leading-tight">{task.title}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${task.labelColor}`}>{task.label}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">{task.agent} · {task.due}</div>
                  {!state ? (
                    <div className="flex gap-1.5">
                      <button onClick={e => { e.stopPropagation(); handleApprove(task.id); }} className="flex-1 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors">
                        Approve
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleReject(task.id); }} className="flex-1 py-1 border border-border rounded text-xs text-muted-foreground hover:bg-muted transition-colors">
                        Decline
                      </button>
                    </div>
                  ) : (
                    <div className={`py-1 rounded text-xs font-medium text-center ${state === 'approved' ? 'bg-green-50 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {state === 'approved' ? '✓ Approved' : '✕ Declined'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Task Detail */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-foreground">Selected Task</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${selectedTask.labelColor}`}>{selectedTask.label}</span>
          </div>
          <div className="space-y-2 mb-3">
            {[
              ['Goal', selectedTask.detail.goal],
              ['Owner Agent', selectedTask.detail.owner],
              ['Source Thread', selectedTask.detail.source],
              ['Due', selectedTask.detail.due],
              ['Permissions', selectedTask.detail.perms],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2 pb-2 border-b border-border/50 last:border-0 last:pb-0">
                <span className="text-xs text-muted-foreground flex-shrink-0">{label}</span>
                <span className="text-xs font-medium text-foreground text-right">{value}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {['Approve', 'Deny', 'Reply', 'Add context', 'View source', 'Change due date'].map(action => (
              <button
                key={action}
                className={`py-1.5 rounded-lg text-xs font-medium border transition-colors col-span-${action === 'View source' || action === 'Change due date' ? '2' : '1'} ${action === 'Approve' ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : action === 'Deny' ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' : 'border-border text-muted-foreground hover:bg-muted'}`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="p-3">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-semibold text-foreground">Audit Trail</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">4 events</span>
          </div>
          <div className="space-y-3">
            {auditEvents.map((e, i) => (
              <div key={i} className="flex gap-2.5">
                <div className="flex flex-col items-center">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5 ${e.color}`} />
                  {i < auditEvents.length - 1 && <div className="w-px flex-1 bg-border mt-1.5 min-h-[16px]" />}
                </div>
                <div className="pb-1">
                  <div className="text-xs font-medium text-foreground leading-tight">{e.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{e.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EAIScreen({ onNavigate, activeUser, initialThreadId }: EAIScreenProps) {
  const [threads, setThreads] = useState<EThread[]>(employeeThreads);
  const [selectedId, setSelectedId] = useState<string | null>(initialThreadId || null);
  const [input, setInput] = useState('');
  const [cursor, setCursor] = useState(0);
  const [mentionPickIndex, setMentionPickIndex] = useState(0);
  const [mentionNotice, setMentionNotice] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvalStates, setApprovalStates] = useState<Record<string, 'pending' | 'approved' | 'rejected'>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedThread = threads.find(t => t.id === selectedId) || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedThread?.messages.length, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const taggedUsers = extractMentionLabels(input);
    const userMsg: EMessage = {
      id: `m-${Date.now()}`, role: 'user',
      content: input, timestamp: new Date().toISOString(), type: 'text',
    };

    if (!selectedId) {
      const newThread: EThread = {
        id: `eth-${Date.now()}`,
        title: generateThreadTitle(input),
        agentName: 'Command', agentType: 'super',
        lastMessage: input,
        timestamp: new Date().toISOString(),
        timeLabel: 'Just now', unread: 0,
        messages: [userMsg],
      };
      setThreads(prev => [newThread, ...prev]);
      setSelectedId(newThread.id);
    } else {
      setThreads(prev => prev.map(t =>
        t.id === selectedId
          ? { ...t, messages: [...t.messages, userMsg], lastMessage: input }
          : t
      ));
    }
    setInput('');
    if (taggedUsers.length > 0) {
      setMentionNotice(`Notified tagged users: ${taggedUsers.map(name => `@${name}`).join(', ')}`);
      setTimeout(() => setMentionNotice(''), 3000);
    }
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const reply: EMessage = {
        id: `m-${Date.now() + 1}`, role: 'agent',
        agentName: 'Command', agentType: 'super',
        content: 'I\'m on it! I\'ll route this to the right specialist and keep you updated as we make progress.',
        timestamp: new Date().toISOString(), type: 'text',
      };
      setThreads(prev => prev.map(t =>
        t.id === (selectedId || prev[0]?.id)
          ? { ...t, messages: [...t.messages, reply], lastMessage: reply.content }
          : t
      ));
    }, 1800);
  };

  const filteredThreads = threads.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mentionOptions: MentionOption[] = [
    ...agents.map(agent => ({ label: agent.name, type: 'agent' as const })),
    { label: 'Kumar', type: 'user' },
    { label: 'Suresh', type: 'user' },
    { label: 'Praveena', type: 'user' },
    { label: 'Neelu', type: 'user' },
    { label: 'Abhi', type: 'user' },
    { label: 'Ramesh', type: 'user' },
    { label: 'Koti', type: 'user' },
    { label: 'Kittu', type: 'user' },
    { label: 'Divya', type: 'user' },
    { label: 'Dhathri', type: 'user' },
    { label: 'Swapna', type: 'user' },
  ];
  const activeMention = getActiveMention(input, cursor);
  const mentionSuggestions = activeMention
    ? getMentionSuggestions(mentionOptions, activeMention.query).slice(0, 7)
    : [];

  const applyMentionSelection = (label: string) => {
    if (!activeMention) {
      return;
    }
    const { nextValue, nextCaret } = insertMention(input, activeMention, label);
    setInput(nextValue);
    setMentionPickIndex(0);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextCaret, nextCaret);
        setCursor(nextCaret);
      }
    });
  };

  useEffect(() => {
    setMentionPickIndex(0);
  }, [activeMention?.query]);

  const handleApprove = (msgId: string) => setApprovalStates(p => ({ ...p, [msgId]: 'approved' }));
  const handleReject = (msgId: string) => setApprovalStates(p => ({ ...p, [msgId]: 'rejected' }));

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Thread sidebar */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <button
            onClick={() => setSelectedId(null)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #5C5FEF, #8B5CF6)' }}
          >
            <Plus className="w-4 h-4" /> New Conversation
          </button>
        </div>
        <div className="px-3 py-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/60 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredThreads.map(thread => (
            <button
              key={thread.id}
              onClick={() => setSelectedId(thread.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors border-b border-border/50 ${selectedId === thread.id ? 'bg-primary/5' : 'hover:bg-muted/30'}`}
            >
              <AgentAvatar type={thread.agentType as any} name={thread.agentName} size="sm" showStatus status="active" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-xs font-medium truncate ${selectedId === thread.id ? 'text-primary' : 'text-foreground'}`}>
                    {thread.title}
                  </span>
                  {thread.unread > 0 && (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 ml-1" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{thread.timeLabel}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {!selectedThread ? (
          /* Welcome / empty state */
          <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 py-12">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #5C5FEF, #8B5CF6)' }}>
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">What can I help you with?</h2>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-8">
              Ask Command to start a workflow, create documents, research topics, or manage your tasks. I'll route your request to the right specialist.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xl mb-8">
              {suggestedPrompts.slice(0, 4).map(p => (
                <button
                  key={p.label}
                  onClick={() => setInput(p.prompt)}
                  className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl text-left hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.color + '15' }}>
                    <p.icon className="w-4 h-4" style={{ color: p.color }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="w-full max-w-xl">
              <p className="text-xs text-muted-foreground text-center mb-3">Or talk directly to a specialist agent</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {agents.map(a => (
                  <button key={a.name}
                    onClick={() => setInput(`@${a.name} `)}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-border rounded-lg hover:border-primary/30 transition-colors"
                  >
                    <AgentAvatar type={a.type as any} name={a.name} size="xs" showStatus status="active" />
                    <div className="text-left">
                      <div className="text-xs font-medium text-foreground">{a.name}</div>
                      <div className="text-xs text-muted-foreground">{a.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Thread header */}
            <div className="px-4 py-3 bg-white border-b border-border flex items-center gap-3 flex-shrink-0">
              <AgentAvatar type={selectedThread.agentType as any} name={selectedThread.agentName} size="sm" showStatus status="active" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{selectedThread.title}</div>
                <div className="text-xs text-muted-foreground">via {selectedThread.agentName} · Command AI Platform</div>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors flex-shrink-0">
                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
              {selectedThread.messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  approvalStates={approvalStates}
                />
              ))}
              {isTyping && (
                <div className="flex items-end gap-2.5">
                  <div className="flex-shrink-0">
                    <AgentAvatar type="super" name="Command" size="sm" />
                  </div>
                  <div className="bg-white border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </>
        )}

        {/* Input area */}
        <div className="px-4 py-3 border-t border-border bg-white flex-shrink-0">
          <div className="flex gap-2 mb-2 overflow-x-auto">
            {agents.slice(0, 5).map(a => (
              <button key={a.name}
                onClick={() => { setInput(p => `@${a.name} ` + p); textareaRef.current?.focus(); }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border text-xs text-muted-foreground hover:border-primary/30 hover:text-foreground transition-colors bg-muted/30 flex-shrink-0"
              >
                <AgentAvatar type={a.type as any} name={a.name} size="xs" />
                <span>@{a.name}</span>
              </button>
            ))}
          </div>
          <div className="relative flex items-end gap-2 bg-muted/40 border border-border rounded-2xl px-4 py-3">
            <button className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mb-0.5">
              <Paperclip className="w-4 h-4" />
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                setCursor(e.target.selectionStart);
              }}
              onClick={e => setCursor((e.target as HTMLTextAreaElement).selectionStart)}
              onKeyUp={e => setCursor((e.target as HTMLTextAreaElement).selectionStart)}
              onKeyDown={e => {
                if (mentionSuggestions.length > 0) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setMentionPickIndex(prev => (prev + 1) % mentionSuggestions.length);
                    return;
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setMentionPickIndex(prev => (prev - 1 + mentionSuggestions.length) % mentionSuggestions.length);
                    return;
                  }
                  if (e.key === 'Enter' || e.key === 'Tab') {
                    e.preventDefault();
                    applyMentionSelection(mentionSuggestions[mentionPickIndex]?.label || mentionSuggestions[0].label);
                    return;
                  }
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Command anything... (Shift+Enter for new line)"
              rows={1}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none max-h-32"
              style={{ lineHeight: '1.5' }}
            />
            {mentionSuggestions.length > 0 && (
              <div className="absolute left-3 right-12 bottom-14 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-20">
                {mentionSuggestions.map((option, idx) => (
                  <button
                    key={`${option.type}-${option.label}`}
                    onClick={() => applyMentionSelection(option.label)}
                    className={`w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between ${idx === mentionPickIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted/60 text-foreground'}`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold ${option.type === 'agent' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-700'}`}>
                        {option.label[0]}
                      </span>
                      <span>@{option.label}</span>
                    </span>
                    <span className="text-xs text-muted-foreground">{option.type === 'agent' ? 'Agent' : 'User'}</span>
                  </button>
                ))}
              </div>
            )}
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
              style={{ background: input.trim() ? 'linear-gradient(135deg, #5C5FEF, #8B5CF6)' : undefined, backgroundColor: !input.trim() ? '#E5E7EB' : undefined }}
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          {mentionNotice && (
            <p className="text-center text-xs text-primary mt-2">{mentionNotice}</p>
          )}
          <p className="text-center text-xs text-muted-foreground/60 mt-2">Command may make mistakes. Review important outputs before sharing.</p>
        </div>
      </div>

      {/* Right Work Control Panel */}
      <WorkControlPanel onApproveTask={(id) => {}} />
    </div>
  );
}
