import React, { useState } from 'react';
import { Zap, Save, ChevronRight, ToggleLeft, ToggleRight, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Screen } from '../types';
import { AgentAvatar } from '../shared/AgentAvatar';

interface SuperAgentConfigScreenProps {
  onNavigate: (screen: Screen) => void;
}

const steps = ['Create Workspace', 'Create Super Agent', 'Add Specialist Agents', 'Configure Connectors', 'Set Capabilities', 'Configure Access', 'Activate'];
const completedSteps = [0, 1, 2, 3, 4, 5, 6];

export function SuperAgentConfigScreen({ onNavigate }: SuperAgentConfigScreenProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'routing' | 'memory' | 'approval'>('general');
  const [agentName, setAgentName] = useState('Command');
  const [greeting, setGreeting] = useState('Good morning! I\'m Command, your AI workforce agent. How can I help you today?');
  const [memoryEnabled, setMemoryEnabled] = useState(true);
  const [contextWindow, setContextWindow] = useState('30');
  const [autoApproval, setAutoApproval] = useState(false);
  const [maxWorkflows, setMaxWorkflows] = useState('50');
  const [status, setStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');
  const [activated, setActivated] = useState(true);

  const handleSave = () => {
    setStatus('saving');
    setTimeout(() => setStatus('saved'), 1000);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Setup Progress Sidebar */}
      <div className="w-56 flex-shrink-0 bg-white border-r border-border flex flex-col p-4">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Setup Progress</div>
        <div className="space-y-1">
          {steps.map((step, i) => {
            const done = completedSteps.includes(i);
            const current = i === 1;
            return (
              <div key={i} className={`flex items-center gap-2.5 px-2 py-2 rounded-lg ${current ? 'bg-accent' : ''}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold ${done ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                  {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-xs ${current ? 'font-semibold text-primary' : done ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{step}</span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground">Setup complete</span>
            <span className="text-xs font-semibold text-green-600">100%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-green-500 w-full" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AgentAvatar type="super" name="Command" size="md" showStatus status={activated ? 'active' : 'paused'} />
            <div>
              <h2 className="text-base font-semibold text-foreground">Super Agent Configuration</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">Command — Manexa AI Labs workspace</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${activated ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                  {activated ? '● Active' : '● Paused'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {status !== 'saved' && (
              <span className="text-xs text-amber-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Unsaved changes
              </span>
            )}
            {status === 'saved' && (
              <span className="text-xs text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
              <Save className="w-4 h-4" />
              {status === 'saving' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-border px-6">
          <div className="flex gap-1">
            {(['general', 'routing', 'memory', 'approval'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="max-w-2xl space-y-5">
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Agent Identity</h3>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Agent Name</label>
                  <input type="text" value={agentName} onChange={e => { setAgentName(e.target.value); setStatus('unsaved'); }}
                    className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Greeting Message</label>
                  <textarea value={greeting} onChange={e => { setGreeting(e.target.value); setStatus('unsaved'); }}
                    rows={3} className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">HR Concurrent Workflows</label>
                  <input type="number" value={maxWorkflows} onChange={e => setMaxWorkflows(e.target.value)}
                    className="w-32 px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-all" />
                </div>
              </div>

              <div className="bg-white border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">Agent Activation</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Enable or disable the Super Agent for all users</p>
                  </div>
                  <button onClick={() => setActivated(a => !a)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${activated ? 'bg-primary' : 'bg-muted'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${activated ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                {!activated && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                    Super Agent is paused. Users will not be able to create new workflows until you reactivate.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'routing' && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-white border border-border rounded-xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Specialist Agent Routing</h3>
                <p className="text-xs text-muted-foreground mb-4">Configure how Command routes requests to specialist agents</p>
                <div className="space-y-3">
                  {[
                    { agent: 'Sales (Sales)', triggers: ['lead', 'crm', 'deal', 'sales', 'pipeline', 'prospect', 'revenue'] },
                    { agent: 'HR (HR)', triggers: ['onboarding', 'employee', 'policy', 'leave', 'performance', 'hr', 'hire'] },
                    { agent: 'Finance (Finance)', triggers: ['invoice', 'expense', 'payment', 'budget', 'finance', 'vendor'] },
                    { agent: 'Support (Support)', triggers: ['ticket', 'customer', 'support', 'issue', 'complaint', 'sla'] },
                    { agent: 'DevOps (Operations)', triggers: ['procurement', 'supply', 'inventory', 'facility', 'logistics'] },
                    { agent: 'Marketing (Research)', triggers: ['research', 'analysis', 'market', 'competitor', 'data', 'report'] },
                  ].map(item => (
                    <div key={item.agent} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                      <span className="text-sm font-medium text-foreground w-32 flex-shrink-0">{item.agent}</span>
                      <div className="flex-1 flex flex-wrap gap-1">
                        {item.triggers.map(t => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent text-primary font-mono">{t}</span>
                        ))}
                        <button className="text-xs px-2 py-0.5 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">+ Add</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'memory' && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Context Memory Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Enable Context Memory</div>
                    <p className="text-xs text-muted-foreground mt-0.5">Command remembers conversation context across sessions</p>
                  </div>
                  <button onClick={() => setMemoryEnabled(m => !m)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${memoryEnabled ? 'bg-primary' : 'bg-muted'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${memoryEnabled ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Context Window (days)</label>
                  <input type="number" value={contextWindow} onChange={e => setContextWindow(e.target.value)}
                    className="w-24 px-3 py-2 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white" />
                </div>
                <div className="flex items-start gap-2.5 p-3 bg-accent rounded-lg">
                  <Zap className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">Memory helps Command provide more accurate routing and personalized responses based on past interactions and workflow outcomes.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'approval' && (
            <div className="max-w-2xl space-y-4">
              <div className="bg-white border border-border rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Workflow Approval Settings</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">Auto-Approve Low Risk Workflows</div>
                    <p className="text-xs text-muted-foreground mt-0.5">Skip approval for read-only and reporting workflows</p>
                  </div>
                  <button onClick={() => setAutoApproval(a => !a)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${autoApproval ? 'bg-primary' : 'bg-muted'}`}>
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${autoApproval ? 'left-6' : 'left-0.5'}`} />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Require approval for', desc: 'Financial transactions > $5,000', enabled: true },
                    { label: 'Require approval for', desc: 'Data exports and bulk modifications', enabled: true },
                    { label: 'Require approval for', desc: 'External API writes', enabled: true },
                    { label: 'Notify on', desc: 'All workflow completions', enabled: false },
                  ].map((rule, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <div className="text-xs text-muted-foreground">{rule.label}</div>
                        <div className="text-sm text-foreground font-medium">{rule.desc}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${rule.enabled ? 'bg-green-500' : 'bg-muted'}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
