import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Zap, TrendingUp, CheckCircle2, GitBranch, Bot, Users } from 'lucide-react';
import { MScreen } from '../managerData';
import { AgentAvatar } from '../../shared/AgentAvatar';

interface MAIScreenProps {
  onNavigate: (screen: MScreen, id?: string) => void;
  activeUser?: { id: string; name: string; avatar?: string; role?: string };
}

interface Message {
  id: string;
  role: 'user' | 'agent' | 'system';
  content: string;
  agentName?: string;
  agentType?: string;
}

const agentColors: Record<string, string> = {
  super: '#5C5FEF', sales: '#0EA5E9', research: '#06B6D4',
  hr: '#8B5CF6', finance: '#F59E0B', support: '#10B981',
};

const suggestedPrompts = [
  { icon: TrendingUp, label: 'Team performance summary', prompt: 'Give me a summary of my team\'s performance this week — tasks completed, overdue items, and workflow status.', agentType: 'super' },
  { icon: CheckCircle2, label: 'Assign task to Emma', prompt: 'Assign Emma: follow up with InnovateCo and post status back before 3 PM. Tag Sales for support.', agentType: 'sales' },
  { icon: GitBranch, label: 'Ask task status from Emma', prompt: 'What is the latest status on Emma\'s InnovateCo follow-up task? If no update, ask Sales to check and update me.', agentType: 'super' },
  { icon: Users, label: 'Agent sends stakeholder email', prompt: 'Have Emma ask Sales to send an update email to Priya and me about TechCorp onboarding timeline.', agentType: 'sales' },
  { icon: Zap, label: 'Review pending approvals', prompt: 'What approvals are pending my action? Give me a prioritized list with recommendations.', agentType: 'sales' },
  { icon: TrendingUp, label: 'Generate weekly report', prompt: 'Generate the weekly team productivity report for leadership.', agentType: 'super' },
];

const mockResponses: Record<string, { agentName: string; agentType: string; content: string }> = {
  default: {
    agentName: 'Command',
    agentType: 'super',
    content: 'I\'m analyzing your team\'s current status. Your most urgent items are: (1) The InnovateCo discount approval is 26 hours overdue — this $240k deal is at risk. (2) TechCorp onboarding is blocked on IT provisioning before Thursday\'s kickoff call. (3) 3 approvals need your attention today. Would you like me to brief you on any of these?',
  },
  'team performance': {
    agentName: 'Command',
    agentType: 'super',
    content: '**Team Performance — Week of Jun 2**\n\n• Abhi: 98% completion rate — strongest performer. GlobalTech deal on track to close.\n• Divya: 1 overdue task (InnovateCo approval), otherwise on track.\n• Praveena: Away this morning but TechCorp integration scope is 60% complete.\n• Ramesh: 60% through 50-contact outreach, 4 replies. On pace.\n\n**Action Required:** Divya needs your approval on the InnovateCo discount ASAP.',
  },
  'approval': {
    agentName: 'Sales',
    agentType: 'sales',
    content: '**3 Approvals Pending — Prioritized:**\n\n🔴 **URGENT** — InnovateCo 15% Discount (Emma): $240k deal, 26h overdue. Sales recommends approval. Churn risk is 68% without action today.\n\n🟡 **HIGH** — Dreamforce Budget (Sarah): $2,800 for conference. Early-bird deadline tomorrow. ROI analysis shows $180–320k pipeline opportunity.\n\n🟢 **MEDIUM** — Travel Expenses (Tom): $3,200, Finance verified all receipts. Routine approval.\n\nShall I prepare approval actions for each?',
  },
  'assign task flow': {
    agentName: 'Command',
    agentType: 'super',
    content: '**Task assigned to Emma**\n\nI tagged Emma on: "Follow up with InnovateCo and post status by 3 PM."\nI also tagged Sales to assist with CRM + customer email context.\n\n**Workflow started:** Manager Delegation -> Employee Action -> Status Sync\n\nI\'ll notify you when Emma acknowledges and again when update is posted.',
  },
  'status check flow': {
    agentName: 'Sales',
    agentType: 'sales',
    content: '**Latest task status (Emma -> InnovateCo):**\n\n• Emma acknowledged the task at 10:31 AM\n• I checked CRM and customer thread at 10:34 AM\n• Customer accepted 15% terms, waiting for contract draft ETA\n• Status update posted to your manager thread at 10:36 AM\n\nWould you like me to request a fresh check-in from Emma at 2 PM?',
  },
  'stakeholder email flow': {
    agentName: 'Sales',
    agentType: 'sales',
    content: '**Stakeholder email flow completed**\n\nEmma tagged me to send update to Priya + you.\nEmail sent with:\n• TechCorp kickoff status\n• Revised API provisioning timeline\n• Owner actions (Sarah: integration checklist)\n\nI linked the email to TechCorp onboarding workflow and logged the audit trail.',
  },
  'blocked workflow': {
    agentName: 'Command',
    agentType: 'super',
    content: '**2 Workflows Currently Blocked:**\n\n🟣 **TechCorp Onboarding** — Blocked by IT provisioning. 2 TechCorp employees still locked out. Kickoff call is Thursday 2 PM. I\'d recommend escalating to IT Manager now to meet the deadline.\n\n🟣 **InnovateCo Contract Negotiation** — Blocked on your discount approval. This is preventing Sales from drafting the contract. Every hour of delay increases churn risk.\n\nWould you like me to draft the IT escalation email or take you to the approval?',
  },
};

export function MAIScreen({ onNavigate }: MAIScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getResponse = (userInput: string) => {
    const lower = userInput.toLowerCase();
    if (lower.includes('assign emma') || lower.includes('assign task') || lower.includes('follow up with innovateco')) return mockResponses['assign task flow'];
    if (lower.includes('latest status') || lower.includes('status on emma') || lower.includes('ask aria to check')) return mockResponses['status check flow'];
    if (lower.includes('send an update email') || lower.includes('stakeholder email') || lower.includes('priya')) return mockResponses['stakeholder email flow'];
    if (lower.includes('performance') || lower.includes('summary')) return mockResponses['team performance'];
    if (lower.includes('approval') || lower.includes('pending') || lower.includes('innovat')) return mockResponses['approval'];
    if (lower.includes('block') || lower.includes('workflow')) return mockResponses['blocked workflow'];
    return mockResponses['default'];
  };

  const handleSend = (content?: string) => {
    const text = content || input.trim();
    if (!text) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const response = getResponse(text);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: `a-${Date.now()}`,
        role: 'agent',
        agentName: response.agentName,
        agentType: response.agentType,
        content: response.content,
      }]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-background">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full px-8 py-12">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Good morning, Alex</h2>
            <p className="text-sm text-muted-foreground mb-8 text-center max-w-md">
              Command and your specialist agents are ready. Ask about your team, approvals, workflow status, or get AI-powered insights.
            </p>
            <div className="grid grid-cols-2 gap-3 w-full max-w-xl">
              {suggestedPrompts.map((p, i) => (
                <button key={i} onClick={() => handleSend(p.prompt)}
                  className="flex items-start gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary/30 hover:shadow-sm transition-all text-left group">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: agentColors[p.agentType] + '15' }}>
                    <p.icon className="w-4 h-4" style={{ color: agentColors[p.agentType] }} />
                  </div>
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors leading-snug">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-8 py-6 max-w-3xl mx-auto space-y-1">
            {messages.map(msg => {
              if (msg.role === 'user') {
                return (
                  <div key={msg.id} className="flex justify-end mb-4">
                    <div className="max-w-[70%] bg-primary text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                );
              }
              const agentColor = agentColors[msg.agentType || 'super'] || '#5C5FEF';
              return (
                <div key={msg.id} className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${agentColor}, ${agentColor}99)` }}>
                    {msg.agentName?.[0] ?? 'A'}
                  </div>
                  <div className="max-w-[75%]">
                    {msg.agentName && <p className="text-xs font-semibold mb-1.5" style={{ color: agentColor }}>{msg.agentName}</p>}
                    <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-foreground leading-relaxed whitespace-pre-line">
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
            {isTyping && (
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div className="bg-white border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Quick actions when not empty */}
      {!isEmpty && (
        <div className="px-8 py-2 flex gap-2 overflow-x-auto flex-shrink-0">
          {['Pending approvals', 'Blocked workflows', 'Team status', 'InnovateCo deal'].map(q => (
            <button key={q} onClick={() => handleSend(q)}
              className="px-3 py-1.5 bg-white border border-border rounded-full text-xs text-muted-foreground hover:border-primary/40 hover:text-primary whitespace-nowrap transition-all flex-shrink-0">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-8 py-4 bg-white border-t border-border flex-shrink-0">
        <div className="flex items-end gap-2 bg-muted/30 border border-border rounded-xl px-4 py-3 max-w-3xl mx-auto">
          <button className="p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
            <Paperclip className="w-4 h-4" />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Command about your team, approvals, workflows, or reports..."
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed py-0.5"
            style={{ maxHeight: 120 }}
          />
          <button onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-primary text-white flex-shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">Command routes to the right specialist. Sales for sales, HR for HR, Finance for finance, Marketing for research.</p>
      </div>
    </div>
  );
}
