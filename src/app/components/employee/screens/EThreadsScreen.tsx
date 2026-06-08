import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, Bot } from 'lucide-react';
import { EScreen, EThread, EMessage, employeeThreads } from '../employeeData';
import { MentionOption, getActiveMention, getMentionSuggestions, insertMention, renderTextWithMentions, extractMentionLabels } from '../../shared/mentions';

interface EThreadsScreenProps {
  onNavigate: (screen: EScreen, id?: string) => void;
  initialThreadId?: string;
}

const agentColors: Record<string, string> = {
  super: '#5C5FEF', sales: '#0EA5E9', research: '#06B6D4',
  hr: '#8B5CF6', finance: '#F59E0B', support: '#10B981',
};

function WorkflowCard({ data }: { data: any }) {
  return (
    <div className="mt-2 border border-border rounded-xl p-3 bg-white max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <Bot className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-foreground">{data.title}</span>
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
        <span>{data.completedTasks}/{data.taskCount} steps</span>
        <span>{data.progress}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-2">
        <div className="h-full bg-primary rounded-full" style={{ width: `${data.progress}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">{data.lastStep}</p>
    </div>
  );
}

function ApprovalCard({ data, onApprove, onDecline, approved, declined }: {
  data: any; onApprove: () => void; onDecline: () => void; approved: boolean; declined: boolean;
}) {
  return (
    <div className="mt-2 border border-border rounded-xl p-3 bg-white max-w-xs">
      <p className="text-xs font-semibold text-foreground mb-1">{data.title}</p>
      <p className="text-xs text-muted-foreground mb-1">{data.description}</p>
      <div className="text-xs text-muted-foreground mb-2">
        <span className="font-medium">Impact: </span>{data.impact}
      </div>
      {approved ? (
        <div className="text-xs text-green-600 font-medium">✓ Approved</div>
      ) : declined ? (
        <div className="text-xs text-red-600 font-medium">✗ Declined</div>
      ) : (
        <div className="flex gap-2">
          <button onClick={onApprove} className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">Approve</button>
          <button onClick={onDecline} className="px-3 py-1.5 bg-muted text-muted-foreground rounded-lg text-xs font-medium hover:bg-muted/70 transition-colors">Decline</button>
        </div>
      )}
    </div>
  );
}

export function EThreadsScreen({ onNavigate, initialThreadId }: EThreadsScreenProps) {
  const initialThreads = [...employeeThreads].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const [threads, setThreads] = useState<EThread[]>(initialThreads);
  const [selectedId, setSelectedId] = useState<string | null>(initialThreadId || initialThreads[0]?.id || null);
  const [search, setSearch] = useState('');
  const [input, setInput] = useState('');
  const [cursor, setCursor] = useState(0);
  const [mentionPickIndex, setMentionPickIndex] = useState(0);
  const [mentionNotice, setMentionNotice] = useState('');
  const [approvedCards, setApprovedCards] = useState<string[]>([]);
  const [declinedCards, setDeclinedCards] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selected = threads.find(t => t.id === selectedId) || null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedId, selected?.messages.length]);

  const filteredThreads = threads.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.agentName.toLowerCase().includes(search.toLowerCase())
  );
  const mentionOptions: MentionOption[] = [
    { label: 'Command', type: 'agent' },
    { label: 'Sales', type: 'agent' },
    { label: 'HR', type: 'agent' },
    { label: 'Finance', type: 'agent' },
    { label: 'Support', type: 'agent' },
    { label: 'Marketing', type: 'agent' },
    { label: 'DevOps', type: 'agent' },
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

  const handleSend = () => {
    if (!input.trim() || !selected) return;
    const taggedUsers = extractMentionLabels(input);
    const newMsg: EMessage = {
      id: `m-${Date.now()}`, role: 'user',
      content: input.trim(), timestamp: new Date().toISOString(), type: 'text',
    };
    setThreads(prev => prev.map(t => t.id === selectedId
      ? { ...t, messages: [...t.messages, newMsg], lastMessage: input.trim() }
      : t
    ));
    setInput('');
    if (taggedUsers.length > 0) {
      setMentionNotice(`Notified tagged users: ${taggedUsers.map(name => `@${name}`).join(', ')}`);
      setTimeout(() => setMentionNotice(''), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const selectThread = (id: string) => {
    setSelectedId(id);
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: 0 } : t));
  };

  function MessageBubble({ msg, threadId }: { msg: EMessage; threadId: string }) {
    const cardKey = `${threadId}-${msg.id}`;
    if (msg.role === 'system') {
      return (
        <div className="flex justify-center my-3">
          <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">{msg.content}</span>
        </div>
      );
    }
    if (msg.role === 'user') {
      return (
        <div className="flex justify-end mb-3">
          <div className="max-w-[70%] bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed">
            {renderTextWithMentions(msg.content, 'bg-white/25 rounded px-1 py-0.5 font-semibold')}
          </div>
        </div>
      );
    }
    const agentColor = agentColors[msg.agentType || 'super'] || '#5C5FEF';
    return (
      <div className="flex items-start gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
          style={{ background: `linear-gradient(135deg, ${agentColor}, ${agentColor}99)` }}>
          {msg.agentName?.[0] ?? 'A'}
        </div>
        <div className="max-w-[70%]">
          {msg.agentName && (
            <p className="text-xs font-semibold mb-1" style={{ color: agentColor }}>{msg.agentName}</p>
          )}
          <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm text-foreground leading-relaxed">
            {renderTextWithMentions(msg.content, 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}
          </div>
          {msg.type === 'workflow-card' && msg.cardData && <WorkflowCard data={msg.cardData} />}
          {msg.type === 'approval-card' && msg.cardData && (
            <ApprovalCard
              data={msg.cardData}
              approved={approvedCards.includes(cardKey)}
              declined={declinedCards.includes(cardKey)}
              onApprove={() => setApprovedCards(p => [...p, cardKey])}
              onDecline={() => setDeclinedCards(p => [...p, cardKey])}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Thread list sidebar */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-sm font-semibold text-foreground mb-3">Threads</h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              type="text" placeholder="Search threads..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {filteredThreads.map(thread => {
            const agentColor = agentColors[thread.agentType] || '#5C5FEF';
            const isSelected = selectedId === thread.id;
            return (
              <div
                key={thread.id}
                onClick={() => selectThread(thread.id)}
                className={`px-4 py-3.5 cursor-pointer transition-colors ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : 'hover:bg-muted/20'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${agentColor}, ${agentColor}99)` }}>
                    {thread.agentName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>{thread.title}</p>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{thread.timeLabel}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{thread.agentName} · {thread.lastMessage}</p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center flex-shrink-0 font-bold">
                      {thread.unread}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      {selected ? (
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Chat header */}
          <div className="px-5 py-3.5 bg-white border-b border-border flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${agentColors[selected.agentType] || '#5C5FEF'}, ${agentColors[selected.agentType] || '#5C5FEF'}99)` }}>
              {selected.agentName[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{selected.title}</p>
              <p className="text-xs text-muted-foreground">with {selected.agentName}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {selected.messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} threadId={selected.id} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-5 py-4 bg-white border-t border-border flex-shrink-0">
            <div className="relative flex items-end gap-2 bg-muted/30 border border-border rounded-xl px-3 py-2">
              <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
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
                onKeyDown={handleKeyDown}
                placeholder={`Reply to ${selected.agentName}...`}
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed py-0.5"
                style={{ maxHeight: 120 }}
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
                className="p-1.5 rounded-lg bg-primary text-white flex-shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            {mentionNotice && (
              <p className="text-xs text-primary mt-2">{mentionNotice}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-background">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Bot className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground mb-1">Select a thread</h3>
          <p className="text-xs text-muted-foreground max-w-xs">Choose a conversation to continue, or start a new one from the AI Assistant.</p>
        </div>
      )}
    </div>
  );
}
