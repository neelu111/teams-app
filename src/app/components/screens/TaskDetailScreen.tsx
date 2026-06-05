import React, { useRef, useState } from 'react';
import { ArrowLeft, Clock, User, AlertCircle, MessageSquare, Paperclip, ChevronRight, CheckCircle2, RefreshCw } from 'lucide-react';
import { Screen } from '../types';
import { sampleTasks } from '../sampleData';
import { StatusBadge, PriorityBadge } from '../shared/StatusBadge';
import { AgentAvatar, UserAvatar } from '../shared/AgentAvatar';
import { MentionOption, getActiveMention, getMentionSuggestions, insertMention, renderTextWithMentions, extractMentionLabels } from '../shared/mentions';
import { generateThreadTitle } from '../shared/threadNaming';

interface TaskDetailScreenProps {
  taskId: string;
  onNavigate: (screen: Screen, id?: string) => void;
}

const activityLog = [
  { actor: 'Command', type: 'agent', time: '8:15 AM', message: 'Task created and assigned to Neelu via Lead Email Campaign workflow' },
  { actor: 'Sales', type: 'agent', time: '9:15 AM', message: 'Connected to HubSpot API. Fetched 47 lead records matching high-intent criteria.' },
  { actor: 'Sales', type: 'agent', time: '9:18 AM', message: 'CRM records updated with intent scores. Task ready for human review.' },
  { actor: 'Neelu', type: 'user', time: '10:30 AM', message: 'Please prioritize enterprise accounts (ARR > $50k) in the review.' },
];

export function TaskDetailScreen({ taskId, onNavigate }: TaskDetailScreenProps) {
  const [status, setStatus] = useState<string>('needs-action');
  const [comment, setComment] = useState('');
  const [activityItems, setActivityItems] = useState(activityLog);
  const [cursor, setCursor] = useState(0);
  const [mentionPickIndex, setMentionPickIndex] = useState(0);
  const [mentionNotice, setMentionNotice] = useState('');
  const [progress, setProgress] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const task = sampleTasks.find(t => t.id === taskId) || sampleTasks[0];

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

  const handlePost = () => {
    if (!comment.trim()) {
      return;
    }
    const taggedUsers = extractMentionLabels(comment);
    setActivityItems(prev => [
      ...prev,
      {
        actor: 'Kumar',
        type: 'user',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        message: comment.trim(),
      },
    ]);
    setComment('');
    if (taggedUsers.length > 0) {
      setMentionNotice(`Notified tagged users: ${taggedUsers.map(name => `@${name}`).join(', ')}`);
      setTimeout(() => setMentionNotice(''), 3000);
    }
  };

  const handleMarkComplete = () => setStatus('completed');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="bg-white border-b border-border px-6 py-4">
        <button onClick={() => onNavigate('tasks')} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
          <ArrowLeft className="w-4 h-4" /> Back to Tasks
        </button>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <div className="flex items-center gap-2.5 mb-2">
              <StatusBadge status={status} />
              <PriorityBadge priority={task.priority} />
              <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">{task.id}</span>
            </div>
            <h2 className="text-base font-semibold text-foreground mb-2">{task.title}</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User className="w-3 h-3" /> {task.assignee}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Due {new Date(task.due).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
              <button onClick={() => onNavigate('workflow-detail', task.workflow)} className="flex items-center gap-1 text-primary hover:underline">
                <ChevronRight className="w-3 h-3" /> View workflow
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status !== 'completed' && (
              <button onClick={handleMarkComplete}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                <CheckCircle2 className="w-4 h-4" /> Mark Complete
              </button>
            )}
            {status === 'completed' && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" /> Completed
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Description */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{task.description}</p>
          </div>

          {/* Agent Context */}
          {task.agent && (
            <div className="bg-accent border border-accent rounded-xl p-4">
              <div className="flex items-center gap-2.5 mb-2">
                <AgentAvatar type="sales" name={task.agent} size="sm" />
                <div>
                  <div className="text-xs font-semibold text-foreground">{task.agent} — AI Context</div>
                  <div className="text-xs text-muted-foreground">Auto-generated by AI agent</div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">I've pre-processed the HubSpot data and identified 47 leads with high-intent signals. Top 5 by score: TechCorp Inc ($120k ARR potential), DataStream Co ($85k), BuildRight Ltd ($72k), CloudFirst ($68k), and NextGen Solutions ($55k). I recommend reviewing the top 20 first for maximum impact.</p>
            </div>
          )}

          {/* Activity */}
          <div className="bg-white border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Activity</h3>
            <div className="space-y-4">
              {activityItems.map((item, i) => (
                <div key={i} className="flex gap-3">
                  {item.type === 'agent' ? (
                    <AgentAvatar type="sales" name={item.actor} size="xs" />
                  ) : (
                    <UserAvatar initials={item.actor.split(' ').map(n => n[0]).join('')} name={item.actor} size="xs" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-foreground">{item.actor}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {renderTextWithMentions(item.message, 'bg-primary/10 text-primary rounded px-1 py-0.5 font-medium')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="mt-4 pt-4 border-t border-border flex gap-3">
              <UserAvatar initials="K" name="Kumar" size="xs" />
              <div className="relative flex-1 border border-border rounded-lg focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
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
                  placeholder="Add a comment or update..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs resize-none focus:outline-none bg-transparent placeholder:text-muted-foreground"
                />
                {mentionSuggestions.length > 0 && (
                  <div className="absolute left-2 right-2 bottom-11 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-20">
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
                  <div className="px-3 pb-2 flex justify-end">
                    <button onClick={handlePost} className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium hover:opacity-90">Post</button>
                  </div>
                )}
              </div>
            </div>
            {mentionNotice && <p className="text-xs text-primary mt-2 ml-8">{mentionNotice}</p>}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="w-60 flex-shrink-0 border-l border-border bg-white overflow-y-auto p-4 space-y-4">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Task Details</div>
            <div className="space-y-3">
              {[
                { label: 'Status', value: <StatusBadge status={status} /> },
                { label: 'Priority', value: <PriorityBadge priority={task.priority} /> },
                { label: 'Assignee', value: (
                  <div className="flex items-center gap-1.5">
                    <UserAvatar initials={task.assignee.split(' ').map(n => n[0]).join('')} name={task.assignee} size="xs" />
                    <span className="text-xs text-foreground">{task.assignee}</span>
                  </div>
                )},
                { label: 'Due Date', value: <span className="text-xs font-medium text-foreground">{new Date(task.due).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span> },
                { label: 'Agent', value: <span className="text-xs font-medium text-foreground">{task.agent}</span> },
              ].map(item => (
                <div key={item.label}>
                  <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                  <div>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Workflow</div>
            <button onClick={() => onNavigate('workflow-detail', task.workflow)}
              className="w-full text-left p-2.5 bg-muted/40 rounded-lg hover:bg-accent transition-colors">
              <div className="text-xs font-medium text-foreground truncate">{sampleTasks.find(t => t.id === taskId)?.workflow}</div>
              <div className="text-xs text-primary mt-0.5 flex items-center gap-1 hover:underline">View details <ChevronRight className="w-3 h-3" /></div>
            </button>
          </div>

          <div className="border-t border-border pt-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">Actions</div>
            <div className="space-y-1.5">
              {['Reassign task', 'Add attachment', 'Set reminder', 'Duplicate task'].map(action => (
                <button key={action} className="w-full text-left text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded hover:bg-muted/50 transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
