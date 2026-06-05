import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Zap, ChevronRight, Check, X, Clock, GitBranch, AlertCircle, Sparkles, Hash, AtSign } from 'lucide-react';
import { Screen } from '../types';
import { AgentAvatar, UserAvatar } from '../shared/AgentAvatar';
import { StatusBadge } from '../shared/StatusBadge';
import { MentionOption, getActiveMention, getMentionSuggestions, insertMention, renderTextWithMentions, extractMentionLabels } from '../shared/mentions';

interface AIAssistantScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
}

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  agentName?: string;
  agentType?: any;
  content: string;
  timestamp: string;
  card?: 'workflow' | 'approval' | 'progress' | 'task';
  cardData?: any;
}

const initialMessages: Message[] = [
  {
    id: 'm1', role: 'agent', agentName: 'Command', agentType: 'super',
    content: 'Good morning, James! I\'m Command, your AI workforce agent. I have **3 items** that need your attention:\n\n• Finance is waiting for your approval on invoice batch ($127,450)\n• Support has flagged a critical SLA breach risk for TK-4521\n• Sales completed the weekly sales pipeline review',
    timestamp: '8:02 AM',
  },
  {
    id: 'm2', role: 'user', content: '@Sales Agent Check lead emails from HubSpot and send me a summary update at 2 PM', timestamp: '9:15 AM',
  },
  {
    id: 'm3', role: 'agent', agentName: 'Command', agentType: 'super',
    content: 'Got it! I\'m routing this to **Sales** (Sales Agent). Detecting intent: *CRM email review + scheduled report delivery*. Creating workflow now...',
    timestamp: '9:15 AM',
  },
  {
    id: 'm4', role: 'agent', agentName: 'Sales', agentType: 'sales',
    content: 'Workflow created! I\'ve connected to HubSpot and started analyzing lead emails from the last 7 days. Found **47 leads** with high-intent signals. I\'ll have the full summary ready for you at 2:00 PM.',
    timestamp: '9:15 AM',
    card: 'workflow',
    cardData: { id: 'wf-001', title: 'Lead Email Review & CRM Update', status: 'running', progress: 64, agent: 'Sales', tasks: ['Fetch HubSpot emails', 'Score lead intent', 'Update CRM records', 'Generate summary report', 'Schedule 2 PM delivery'] }
  },
  {
    id: 'm5', role: 'agent', agentName: 'Finance', agentType: 'finance',
    content: 'James, I need your approval on the June vendor payment batch. I\'ve verified all 3 invoices against purchase orders — everything matches. Total: **$127,450**.',
    timestamp: '11:00 AM',
    card: 'approval',
    cardData: { title: 'Vendor Payment Batch Approval', amount: '$127,450', invoices: 3, description: 'June vendor payments: Nexus Cloud ($42,500), DataStream ($55,000), TechOps ($29,950)', workflowId: 'wf-003' }
  },
];

const suggestedPrompts = [
  '@HR Agent Run weekly onboarding status report',
  '@Finance Agent Reconcile this month\'s expenses',
  '@Research Agent Analyze competitor pricing for Q3',
  '@Support Agent Show me open tickets by priority',
  '@Operations Agent Check inventory levels for Q3 planning',
];

function WorkflowCard({ data, onView }: { data: any; onView: () => void }) {
  return (
    <div className="mt-3 bg-white border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border bg-muted/30">
        <GitBranch className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Workflow Created</span>
        <StatusBadge status="running" />
      </div>
      <div className="px-4 py-3">
        <div className="font-medium text-sm text-foreground mb-3">{data.title}</div>
        <div className="space-y-1.5 mb-3">
          {data.tasks.map((task: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${i < 3 ? 'bg-green-100 text-green-600' : i === 3 ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                {i < 3 ? <Check className="w-2.5 h-2.5" /> : i === 3 ? <Zap className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
              </span>
              <span className={i < 3 ? 'text-muted-foreground line-through' : i === 3 ? 'text-foreground font-medium' : 'text-muted-foreground'}>{task}</span>
            </div>
          ))}
        </div>
        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progress</span><span className="font-medium text-foreground">{data.progress}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${data.progress}%` }} />
          </div>
        </div>
        <button onClick={onView} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
          View workflow details <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function ApprovalCard({ data, onApprove, onReject }: { data: any; onApprove: () => void; onReject: () => void }) {
  const [decided, setDecided] = useState<'approved' | 'rejected' | null>(null);
  return (
    <div className="mt-3 bg-white border border-orange-200 rounded-xl overflow-hidden shadow-sm">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-orange-100 bg-orange-50">
        <AlertCircle className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-medium text-orange-900">Approval Required</span>
      </div>
      <div className="px-4 py-3">
        <div className="font-medium text-sm text-foreground mb-1">{data.title}</div>
        <div className="text-xs text-muted-foreground mb-2">{data.description}</div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl font-semibold text-foreground">{data.amount}</span>
          <span className="text-xs text-muted-foreground">· {data.invoices} invoices</span>
        </div>
        {!decided ? (
          <div className="flex items-center gap-2">
            <button onClick={() => { setDecided('approved'); onApprove(); }} className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
              <Check className="w-3.5 h-3.5" /> Approve
            </button>
            <button onClick={() => { setDecided('rejected'); onReject(); }} className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted/50 transition-colors">
              <X className="w-3.5 h-3.5" /> Reject
            </button>
            <button className="text-xs text-primary hover:underline ml-1">View details</button>
          </div>
        ) : (
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium ${decided === 'approved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {decided === 'approved' ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
            {decided === 'approved' ? 'Approved — Finance will process payments now' : 'Rejected — Finance has been notified'}
          </div>
        )}
      </div>
    </div>
  );
}

const threads = [
  { id: 'thread-001', title: 'Lead Email Campaign', agent: 'Sales', time: '11:30 AM', active: false },
  { id: 'thread-002', title: 'Vendor Invoice Approval', agent: 'Finance', time: '11:00 AM', active: true },
  { id: 'thread-003', title: 'Dhathri Onboarding', agent: 'HR', time: '10:45 AM', active: false },
  { id: 'thread-004', title: 'TK-4521 Escalation', agent: 'Support', time: '10:15 AM', active: false },
];

export function AIAssistantScreen({ onNavigate }: AIAssistantScreenProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeThread, setActiveThread] = useState('thread-002');
  const [cursor, setCursor] = useState(0);
  const [mentionPickIndex, setMentionPickIndex] = useState(0);
  const [mentionNotice, setMentionNotice] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const mentionOptions: MentionOption[] = [
    { label: 'Command', type: 'agent' },
    { label: 'Sales', type: 'agent' },
    { label: 'HR', type: 'agent' },
    { label: 'Finance', type: 'agent' },
    { label: 'Support', type: 'agent' },
    { label: 'Marketing', type: 'agent' },
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
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMentionPickIndex(0);
  }, [activeMention?.query]);

  const handleSend = () => {
    if (!input.trim()) return;
    const taggedUsers = extractMentionLabels(input);
    const userMsg: Message = { id: `m${Date.now()}`, role: 'user', content: input, timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (taggedUsers.length > 0) {
      setMentionNotice(`Notified tagged users: ${taggedUsers.map(name => `@${name}`).join(', ')}`);
      setTimeout(() => setMentionNotice(''), 3000);
    }
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const response: Message = {
        id: `m${Date.now() + 1}`, role: 'agent', agentName: 'Command', agentType: 'super',
        content: 'I\'m analyzing your request and routing it to the appropriate specialist agent. One moment...',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 1500);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Thread Sidebar */}
      <div className="w-56 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversations</h3>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          <button
            onClick={() => setActiveThread('new')}
            className="w-full flex items-center gap-2 px-3 py-2 mx-1 rounded-lg text-xs text-primary hover:bg-accent transition-colors mb-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-medium">New conversation</span>
          </button>
          {threads.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveThread(t.id)}
              className={`w-full text-left px-3 py-2.5 mx-1 rounded-lg transition-colors ${activeThread === t.id ? 'bg-accent' : 'hover:bg-muted/40'}`}
              style={{ width: 'calc(100% - 8px)' }}
            >
              <div className="text-xs font-medium text-foreground truncate">{t.title}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xs text-muted-foreground">{t.agent}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">{t.time}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="px-6 py-3 border-b border-border bg-white flex items-center gap-3">
          <AgentAvatar type="super" name="Command" size="sm" showStatus status="active" />
          <div>
            <div className="text-sm font-semibold text-foreground">Command — Super Agent</div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Active · 6 agents available
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => onNavigate('workflows')} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors">Workflows</button>
            <button onClick={() => onNavigate('threads')} className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors">All Threads</button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role !== 'user' ? (
                <AgentAvatar type={msg.agentType || 'super'} name={msg.agentName || 'Command'} size="sm" />
              ) : (
                <UserAvatar initials="K" name="Kumar" size="sm" />
              )}
              <div className={`max-w-xl ${msg.role === 'user' ? 'items-end' : ''} flex flex-col`}>
                {msg.role !== 'user' && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-foreground">{msg.agentName}</span>
                    <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  </div>
                )}
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'}`}>
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1' : ''}>
                      {line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, j) => {
                        if (part.startsWith('**')) {
                          return <strong key={j}>{renderTextWithMentions(part.slice(2, -2), msg.role === 'user' ? 'bg-white/25 rounded px-1 py-0.5 font-semibold' : 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}</strong>;
                        }
                        if (part.startsWith('*')) {
                          return <em key={j}>{renderTextWithMentions(part.slice(1, -1), msg.role === 'user' ? 'bg-white/25 rounded px-1 py-0.5 font-semibold' : 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}</em>;
                        }
                        return <React.Fragment key={j}>{renderTextWithMentions(part, msg.role === 'user' ? 'bg-white/25 rounded px-1 py-0.5 font-semibold' : 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}</React.Fragment>;
                      })}
                    </p>
                  ))}
                </div>
                {msg.card === 'workflow' && (
                  <WorkflowCard data={msg.cardData} onView={() => onNavigate('workflow-detail', msg.cardData?.id)} />
                )}
                {msg.card === 'approval' && (
                  <ApprovalCard data={msg.cardData} onApprove={() => {}} onReject={() => {}} />
                )}
                {msg.role === 'user' && (
                  <span className="text-xs text-muted-foreground mt-1">{msg.timestamp}</span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <AgentAvatar type="super" name="Command" size="sm" />
              <div className="px-4 py-3 bg-white border border-border rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length < 3 && (
          <div className="px-6 pb-2">
            <div className="text-xs text-muted-foreground mb-2 font-medium">Suggested prompts</div>
            <div className="flex flex-wrap gap-2">
              {suggestedPrompts.map((p, i) => (
                <button key={i} onClick={() => setInput(p)}
                  className="text-xs px-3 py-1.5 bg-white border border-border rounded-full hover:border-primary/40 hover:text-primary transition-colors">
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-6 pb-5 pt-3">
          <div className="relative bg-white border border-border rounded-xl shadow-sm focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <div className="flex items-center px-3 pt-3 pb-1 gap-2 border-b border-border/50">
              <AtSign className="w-3.5 h-3.5 text-primary" />
              <div className="flex gap-1.5">
                {['Command', 'Sales', 'HR', 'Finance', 'Support', 'Marketing'].map(a => (
                  <button key={a} onClick={() => setInput(`@${a} `)} className="text-xs px-2 py-0.5 rounded-full bg-accent text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-colors">@{a}</button>
                ))}
              </div>
            </div>
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
              placeholder="Message Command or @mention a specialist agent..."
              rows={3}
              className="w-full px-4 py-3 text-sm resize-none focus:outline-none bg-transparent placeholder:text-muted-foreground"
            />
            {mentionSuggestions.length > 0 && (
              <div className="absolute left-3 right-3 bottom-[88px] bg-white border border-border rounded-lg shadow-lg overflow-hidden z-20">
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
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                  <Hash className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{mentionNotice || '⏎ to send · ⇧⏎ for newline'}</span>
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
