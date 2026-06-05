import React, { useState, useRef, useEffect } from 'react';
import { Search, Pin, ChevronRight, Send, Paperclip, MoreHorizontal } from 'lucide-react';
import { Screen } from '../types';
import { sampleThreads } from '../sampleData';
import { AgentAvatar, UserAvatar } from '../shared/AgentAvatar';
import { MentionOption, getActiveMention, getMentionSuggestions, insertMention, renderTextWithMentions, extractMentionLabels } from '../shared/mentions';

interface ThreadsScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
  threadId?: string;
}

const threadMessages: Record<string, { role: string; name: string; time: string; content: string; type?: string }[]> = {
  'thread-001': [
    { role: 'agent', name: 'Sales', time: '9:15 AM', content: 'Starting lead email review. Connected to HubSpot, fetching emails from the last 7 days.' },
    { role: 'user', name: 'Divya', time: '9:16 AM', content: 'Great! Please focus on the enterprise tier leads first.' },
    { role: 'agent', name: 'Sales', time: '9:31 AM', content: 'Done scoring all leads. Found 47 high-intent leads. Top 5 by score: TechCorp Inc, DataStream Co, BuildRight Ltd, CloudFirst, NextGen Solutions. Updating CRM now.' },
    { role: 'user', name: 'Neelu', time: '10:30 AM', content: '@Divya can you review the targeting list before I approve the email campaign?' },
    { role: 'agent', name: 'Sales', time: '11:30 AM', content: 'I\'ve identified 47 high-intent leads. Ready to proceed with outreach once you approve the targeting list. Workflow is at 64% — on track for the 2 PM delivery.' },
  ],
  'thread-002': [
    { role: 'agent', name: 'Finance', time: '7:30 AM', content: 'Good morning! I\'ve reviewed the June vendor invoices. Found 3 invoices ready for batch processing totaling $127,450.' },
    { role: 'agent', name: 'Finance', time: '8:00 AM', content: 'Invoice verification complete:\n• Nexus Cloud Solutions — INV-4892 — $42,500 ✓\n• DataStream Inc — INV-4901 — $55,000 ✓\n• TechOps Partners — INV-4887 — $29,950 ✓\nAll match purchase orders. Ready for your approval.' },
    { role: 'agent', name: 'Finance', time: '11:00 AM', content: 'James, I need your approval on the vendor payment batch. I\'ve verified all 3 invoices against purchase orders — everything matches. Total: $127,450. Please approve to trigger payment.' },
  ],
  'thread-003': [
    { role: 'agent', name: 'HR', time: '8:00 AM', content: 'New hire Dhathri starts today! I\'ve initiated the onboarding workflow. Current status: IT provisioning 55% complete.' },
    { role: 'agent', name: 'DevOps', time: '8:30 AM', content: 'MacBook Pro 16" has been ordered and is being configured. Expected delivery to desk by 2 PM today.' },
    { role: 'user', name: 'Praveena', time: '9:00 AM', content: 'Thanks! Make sure she gets access to all the Sales tools too — she\'ll be working with Neelu\'s team.' },
    { role: 'agent', name: 'HR', time: '10:45 AM', content: 'IT provisioning is 55% complete. Meetings scheduled for June 4 — 1:1s with Praveena, Neelu, and the business team. Welcome email sent to dhathri@manexa.ai.' },
  ],
};

export function ThreadsScreen({ onNavigate, threadId }: ThreadsScreenProps) {
  const [activeThread, setActiveThread] = useState(threadId || sampleThreads[0].id);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(threadMessages[activeThread] || threadMessages['thread-001']);
  const [cursor, setCursor] = useState(0);
  const [mentionPickIndex, setMentionPickIndex] = useState(0);
  const [mentionNotice, setMentionNotice] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessages(threadMessages[activeThread] || threadMessages['thread-001']);
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread]);

  const handleSend = () => {
    if (!message.trim()) return;
    const taggedUsers = extractMentionLabels(message);
    setMessages(prev => [...prev, {
      role: 'user', name: 'Kumar', time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), content: message
    }]);
    setMessage('');
    if (taggedUsers.length > 0) {
      setMentionNotice(`Notified tagged users: ${taggedUsers.map(name => `@${name}`).join(', ')}`);
      setTimeout(() => setMentionNotice(''), 3000);
    }
  };

  const thread = sampleThreads.find(t => t.id === activeThread) || sampleThreads[0];
  const agentColors: Record<string, any> = { Sales: 'sales', HR: 'hr', Finance: 'finance', Support: 'support', Marketing: 'research', DevOps: 'operations', Command: 'super' };
  const mentionOptions: MentionOption[] = [
    { label: 'Command', type: 'agent' },
    { label: 'Sales', type: 'agent' },
    { label: 'HR', type: 'agent' },
    { label: 'Finance', type: 'agent' },
    { label: 'Support', type: 'agent' },
    { label: 'Marketing', type: 'agent' },
    { label: 'DevOps', type: 'agent' },
    ...thread.participants.map(name => ({ label: name, type: 'user' as const })),
  ];
  const activeMention = getActiveMention(message, cursor);
  const mentionSuggestions = activeMention
    ? getMentionSuggestions(mentionOptions, activeMention.query).slice(0, 7)
    : [];

  const applyMentionSelection = (label: string) => {
    if (!activeMention) {
      return;
    }
    const { nextValue, nextCaret } = insertMention(message, activeMention, label);
    setMessage(nextValue);
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

  return (
    <div className="h-full flex overflow-hidden">
      {/* Thread List */}
      <div className="w-64 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search threads..." className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto py-2">
          {/* Pinned */}
          <div className="px-3 py-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pinned</span>
          </div>
          {sampleThreads.filter(t => t.pinned).map(t => (
            <ThreadListItem key={t.id} thread={t} active={activeThread === t.id} onClick={() => setActiveThread(t.id)} />
          ))}
          <div className="px-3 py-1 mt-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</span>
          </div>
          {sampleThreads.filter(t => !t.pinned).map(t => (
            <ThreadListItem key={t.id} thread={t} active={activeThread === t.id} onClick={() => setActiveThread(t.id)} />
          ))}
        </div>
      </div>

      {/* Thread Detail */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-border px-6 py-3 flex items-center gap-3">
          <AgentAvatar type={agentColors[thread.participants.find(p => Object.keys(agentColors).includes(p)) || 'Command'] || 'super'} name={thread.title} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground truncate">{thread.title}</h3>
              {thread.pinned && <Pin className="w-3.5 h-3.5 text-primary" />}
            </div>
            <div className="text-xs text-muted-foreground">{thread.participants.join(', ')}</div>
          </div>
          <div className="flex items-center gap-2">
            {thread.workflowId && (
              <button onClick={() => onNavigate('workflow-detail', thread.workflowId)} className="text-xs text-primary hover:underline flex items-center gap-1">
                View workflow <ChevronRight className="w-3 h-3" />
              </button>
            )}
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => {
            const isUser = msg.role === 'user';
            const agentType = agentColors[msg.name] || 'super';
            return (
              <div key={i} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                {isUser ? (
                  <UserAvatar initials={msg.name.split(' ').map(n => n[0]).join('')} name={msg.name} size="sm" />
                ) : (
                  <AgentAvatar type={agentType} name={msg.name} size="sm" />
                )}
                <div className={`max-w-lg ${isUser ? 'items-end' : ''} flex flex-col`}>
                  {!isUser && <div className="flex items-center gap-2 mb-1"><span className="text-xs font-semibold text-foreground">{msg.name}</span><span className="text-xs text-muted-foreground">{msg.time}</span></div>}
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isUser ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white border border-border text-foreground rounded-tl-sm shadow-sm'}`}>
                    {msg.content.split('\n').map((line, j) => (
                      <p key={j} className={j > 0 ? 'mt-1' : ''}>
                        {renderTextWithMentions(line, isUser ? 'bg-white/25 rounded px-1 py-0.5 font-semibold' : 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}
                      </p>
                    ))}
                  </div>
                  {isUser && <span className="text-xs text-muted-foreground mt-1">{msg.time}</span>}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 pb-5 pt-3">
          <div className="relative flex items-end gap-3 bg-white border border-border rounded-xl p-3 focus-within:border-primary/40 transition-all shadow-sm">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={e => {
                setMessage(e.target.value);
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
              placeholder="Reply in thread..."
              rows={2}
              className="flex-1 text-sm resize-none focus:outline-none bg-transparent placeholder:text-muted-foreground"
            />
            {mentionSuggestions.length > 0 && (
              <div className="absolute left-9 right-16 bottom-16 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-20">
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
            <div className="flex items-center gap-1.5">
              <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <Paperclip className="w-4 h-4" />
              </button>
              <button onClick={handleSend} disabled={!message.trim()}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all disabled:opacity-40">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          {mentionNotice && (
            <p className="text-xs text-primary mt-2">{mentionNotice}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ThreadListItem({ thread, active, onClick }: { thread: any; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-3 py-2.5 mx-1 rounded-lg transition-colors ${active ? 'bg-accent' : 'hover:bg-muted/40'}`}
      style={{ width: 'calc(100% - 8px)' }}>
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground truncate">{thread.title}</span>
            {thread.unread > 0 && (
              <span className="w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0 ml-1">{thread.unread}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5 leading-tight">{thread.lastMessage}</p>
          <span className="text-xs text-muted-foreground">{new Date(thread.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
        </div>
      </div>
    </button>
  );
}
