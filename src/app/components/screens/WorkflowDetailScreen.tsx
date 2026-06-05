import React, { useRef, useState } from 'react';
import { ArrowLeft, Clock, User, CheckCircle2, Circle, AlertCircle, Zap, MessageSquare, FileText, Link2, Calendar, MoreHorizontal, Check, X, RefreshCw, ChevronRight } from 'lucide-react';
import { Screen } from '../types';
import { sampleWorkflows } from '../sampleData';
import { StatusBadge, PriorityBadge } from '../shared/StatusBadge';
import { AgentAvatar, UserAvatar } from '../shared/AgentAvatar';
import { MentionOption, getActiveMention, getMentionSuggestions, insertMention, renderTextWithMentions, extractMentionLabels } from '../shared/mentions';
import { generateThreadTitle } from '../shared/threadNaming';

interface WorkflowDetailScreenProps {
  workflowId: string;
  onNavigate: (screen: Screen, id?: string) => void;
}

const timelineEvents = [
  { id: 1, type: 'created', title: 'Workflow created', actor: 'Divya', time: '8:15 AM', desc: 'Workflow initiated via AI Assistant chat' },
  { id: 2, type: 'agent', title: 'Command routed to Sales', actor: 'Command', time: '8:15 AM', desc: 'Intent detected: CRM email review + scheduled delivery' },
  { id: 3, type: 'started', title: 'Sales started processing', actor: 'Sales', time: '8:15 AM', desc: 'Connected to HubSpot API, fetching lead emails from last 7 days' },
  { id: 4, type: 'completed', title: 'HubSpot emails fetched', actor: 'Sales', time: '8:18 AM', desc: '127 emails retrieved, filtering for lead communications' },
  { id: 5, type: 'completed', title: 'Lead intent scoring complete', actor: 'Sales', time: '8:31 AM', desc: '47 high-intent leads identified using ML scoring model' },
  { id: 6, type: 'completed', title: 'CRM records updated', actor: 'Sales', time: '8:47 AM', desc: '47 lead records updated in HubSpot with intent scores and tags' },
  { id: 7, type: 'running', title: 'Generating summary report', actor: 'Sales', time: '10:30 AM', desc: 'Compiling lead list, intent signals, and recommended actions' },
  { id: 8, type: 'pending', title: 'Deliver report at 2:00 PM', actor: 'Sales', time: '2:00 PM', desc: 'Summary report will be delivered to Divya via AI Assistant' },
];

const tasks = [
  { id: 't1', title: 'Fetch HubSpot lead emails', status: 'completed', assignee: 'Sales', duration: '3m' },
  { id: 't2', title: 'Score lead intent signals', status: 'completed', assignee: 'Sales', duration: '13m' },
  { id: 't3', title: 'Update CRM records', status: 'completed', assignee: 'Sales', duration: '16m' },
  { id: 't4', title: 'Generate summary report', status: 'running', assignee: 'Sales', duration: '—' },
  { id: 't5', title: 'Review targeting list', status: 'needs-action', assignee: 'Neelu', duration: '—' },
  { id: 't6', title: 'Send 2 PM update to Emma', status: 'scheduled', assignee: 'Sales', duration: '—' },
  { id: 't7', title: 'Archive processed emails', status: 'scheduled', assignee: 'Sales', duration: '—' },
];

const taskStatusIcon = {
  completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
  running: <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />,
  'needs-action': <AlertCircle className="w-4 h-4 text-orange-500" />,
  scheduled: <Clock className="w-4 h-4 text-muted-foreground" />,
  waiting: <Circle className="w-4 h-4 text-amber-400" />,
  blocked: <X className="w-4 h-4 text-red-500" />,
};

export function WorkflowDetailScreen({ workflowId, onNavigate }: WorkflowDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'audit' | 'comments'>('timeline');
  const [comment, setComment] = useState('');
  const [commentThread, setCommentThread] = useState([
    { id: 'c1', name: 'Neelu', time: '10:45 AM', text: 'Sales, please make sure to prioritize enterprise leads (Tier 1) in the summary report. We have a board review Friday.' },
  ]);
  const [cursor, setCursor] = useState(0);
  const [mentionPickIndex, setMentionPickIndex] = useState(0);
  const [mentionNotice, setMentionNotice] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wf = sampleWorkflows.find(w => w.id === workflowId) || sampleWorkflows[0];

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
  const activeMention = getActiveMention(comment, cursor);
  const mentionSuggestions = activeMention
    ? getMentionSuggestions(mentionOptions, activeMention.query).slice(0, 7)
    : [];

  const applyMentionSelection = (label: string) => {
    if (!activeMention) {
      return;
    }
    const { nextValue, nextCaret } = insertMention(comment, activeMention, label);
    setComment(nextValue);
    setMentionPickIndex(0);
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(nextCaret, nextCaret);
        setCursor(nextCaret);
      }
    });
  };

  const handlePostComment = () => {
    if (!comment.trim()) {
      return;
    }
    const taggedUsers = extractMentionLabels(comment);
    setCommentThread(prev => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        name: 'Kumar',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        text: comment.trim(),
      },
    ]);
    setComment('');
    if (taggedUsers.length > 0) {
      setMentionNotice(`Notified tagged users: ${taggedUsers.map(name => `@${name}`).join(', ')}`);
      setTimeout(() => setMentionNotice(''), 3000);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <button onClick={() => onNavigate('workflows')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Workflows
        </button>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <AgentAvatar type={wf.agentType} name={wf.agent} size="lg" showStatus status="active" />
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <h2 className="text-base font-semibold text-foreground">{wf.title}</h2>
                <StatusBadge status={wf.status} />
                <PriorityBadge priority={wf.priority} />
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {wf.createdBy}</span>
                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> {wf.agent} Agent</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Created {new Date(wf.created).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                <span>{wf.completedTasks}/{wf.taskCount} tasks</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {wf.status === 'running' && (
              <button className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors">Pause</button>
            )}
            <button className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted/50 transition-colors">Share</button>
            <button className="p-1.5 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
            <span>Overall Progress</span>
            <span className="font-medium text-foreground">{wf.progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all" style={{ width: `${wf.progress}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="bg-white border-b border-border px-6">
            <div className="flex gap-1">
              {(['timeline', 'tasks', 'audit', 'comments'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                    activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'timeline' && (
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-4">
                  {timelineEvents.map((event, i) => (
                    <div key={event.id} className="flex gap-4 relative">
                      <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center z-10 ${
                        event.type === 'completed' ? 'bg-green-50 ring-2 ring-green-200' :
                        event.type === 'running' ? 'bg-blue-50 ring-2 ring-blue-200' :
                        event.type === 'pending' ? 'bg-muted ring-2 ring-border' :
                        'bg-accent ring-2 ring-accent'
                      }`}>
                        {event.type === 'completed' ? <CheckCircle2 className="w-4 h-4 text-green-500" /> :
                         event.type === 'running' ? <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" /> :
                         event.type === 'pending' ? <Circle className="w-4 h-4 text-muted-foreground" /> :
                         event.type === 'agent' ? <Zap className="w-4 h-4 text-primary" /> :
                         <Circle className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="flex-1 bg-white border border-border rounded-xl p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{event.title}</span>
                          <span className="text-xs text-muted-foreground">{event.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1.5">{event.desc}</p>
                        <span className="text-xs text-muted-foreground font-medium">{event.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/30 transition-colors cursor-pointer" onClick={() => onNavigate('task-detail', task.id)}>
                    {taskStatusIcon[task.status as keyof typeof taskStatusIcon] || <Circle className="w-4 h-4 text-muted-foreground" />}
                    <div className="flex-1 min-w-0">
                      <span className={`text-sm font-medium ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{task.title}</span>
                    </div>
                    <StatusBadge status={task.status} />
                    <span className="text-xs text-muted-foreground w-20 text-right">{task.assignee}</span>
                    {task.duration !== '—' && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{task.duration}</span>}
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-4">
                {commentThread.map(item => (
                  <div key={item.id} className="flex gap-3 bg-white border border-border rounded-xl p-4">
                    <UserAvatar initials={item.name[0]} name={item.name} size="sm" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {renderTextWithMentions(item.text, 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="flex gap-3">
                  <UserAvatar initials="K" name="Kumar" size="sm" />
                  <div className="relative flex-1 bg-white border border-border rounded-xl p-3">
                    <textarea
                      ref={textareaRef}
                      value={comment}
                      onChange={e => {
                        setComment(e.target.value);
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
                      }}
                      placeholder="Add a comment..."
                      rows={2}
                      className="w-full text-sm resize-none focus:outline-none bg-transparent placeholder:text-muted-foreground"
                    />
                    {mentionSuggestions.length > 0 && (
                      <div className="absolute left-3 right-3 bottom-12 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-20">
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
                    {comment && (
                      <div className="flex justify-end mt-2">
                        <button onClick={handlePostComment} className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
                          Post comment
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {mentionNotice && <p className="text-xs text-primary ml-11">{mentionNotice}</p>}
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="space-y-2">
                {[
                  { action: 'Workflow created', user: 'Divya', time: '8:15 AM', ip: '192.168.1.45' },
                  { action: 'HubSpot API connected', user: 'Sales (System)', time: '8:15 AM', ip: '10.0.0.1' },
                  { action: 'Lead data accessed', user: 'Sales (System)', time: '8:18 AM', ip: '10.0.0.1' },
                  { action: 'CRM records modified (47)', user: 'Sales (System)', time: '8:47 AM', ip: '10.0.0.1' },
                  { action: 'Workflow viewed', user: 'Neelu', time: '9:30 AM', ip: '192.168.1.22' },
                  { action: 'Comment added', user: 'Neelu', time: '10:45 AM', ip: '192.168.1.22' },
                ].map((entry, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white border border-border rounded-lg px-4 py-3 text-sm">
                    <span className="text-muted-foreground text-xs w-24 flex-shrink-0">{entry.time}</span>
                    <span className="flex-1 font-medium text-foreground">{entry.action}</span>
                    <span className="text-muted-foreground text-xs">{entry.user}</span>
                    <span className="text-muted-foreground text-xs font-mono bg-muted px-2 py-0.5 rounded">{entry.ip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 flex-shrink-0 border-l border-border bg-white overflow-y-auto p-4 space-y-4">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Details</div>
            <div className="space-y-2.5">
              {[
                { label: 'Owner Agent', value: wf.agent },
                { label: 'Created by', value: wf.createdBy },
                { label: 'Created', value: '8:15 AM today' },
                { label: 'Last updated', value: '10:30 AM today' },
                { label: 'Workflow ID', value: wf.id, mono: true },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                  <div className={`text-xs font-medium text-foreground ${item.mono ? 'font-mono bg-muted px-1.5 py-0.5 rounded' : ''}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Connectors Used</div>
            <div className="space-y-1.5">
              {['HubSpot CRM', 'Gmail API', 'AI Scoring Model'].map(c => (
                <div key={c} className="flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-foreground">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {wf.approvalRequired && (
            <div className="border-t border-border pt-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Approval</div>
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-xs text-orange-800 mb-2.5">This workflow requires manager approval before proceeding.</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-1">
                    <Check className="w-3 h-3" /> Approve
                  </button>
                  <button className="flex-1 py-1.5 border border-orange-300 text-orange-700 rounded-lg text-xs font-medium hover:bg-orange-100 transition-colors flex items-center justify-center gap-1">
                    <X className="w-3 h-3" /> Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="border-t border-border pt-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Linked Thread</div>
            <button onClick={() => onNavigate('thread-detail', 'thread-001')} className="w-full text-left p-2.5 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
              <div className="text-xs font-medium text-foreground">Lead Email Campaign</div>
              <div className="text-xs text-muted-foreground mt-0.5">2 unread messages</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
