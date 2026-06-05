import React, { useState } from 'react';
import { Plus, Save, Trash2, MoreHorizontal, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { Screen } from '../types';
import { sampleAgents } from '../sampleData';
import { StatusBadge } from '../shared/StatusBadge';
import { AgentAvatar } from '../shared/AgentAvatar';

interface AgentConfigScreenProps {
  onNavigate: (screen: Screen, id?: string) => void;
}

export function AgentConfigScreen({ onNavigate }: AgentConfigScreenProps) {
  const [selectedAgentId, setSelectedAgentId] = useState(sampleAgents[1].id);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);

  const specialists = sampleAgents.filter(a => a.type !== 'super');
  const agent = specialists.find(a => a.id === selectedAgentId) || specialists[0];

  const [agentName, setAgentName] = useState(agent.name);
  const [description, setDescription] = useState(agent.description);
  const [capabilities, setCapabilities] = useState(agent.capabilities);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSaved(true); }, 1000);
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Agent List Sidebar */}
      <div className="w-60 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Specialist Agents</span>
          <button className="p-1 rounded hover:bg-muted transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {specialists.map(a => (
            <button key={a.id} onClick={() => setSelectedAgentId(a.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all ${selectedAgentId === a.id ? 'bg-accent border border-primary/20' : 'hover:bg-muted/40'}`}>
              <AgentAvatar type={a.type} name={a.name} size="sm" showStatus status={a.status} />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">{a.name}</div>
                <div className="text-xs text-muted-foreground capitalize">{a.type}</div>
              </div>
              <StatusBadge status={a.status} showDot={false} />
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-border">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-border rounded-xl text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Specialist Agent
          </button>
        </div>
      </div>

      {/* Agent Config Detail */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AgentAvatar type={agent.type} name={agent.name} size="md" showStatus status={agent.status} />
            <div>
              <h2 className="text-base font-semibold text-foreground">{agent.name}</h2>
              <div className="text-xs text-muted-foreground capitalize">{agent.type} Agent</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved ? (
              <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Saved</span>
            ) : (
              <span className="text-xs text-amber-600 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> Unsaved</span>
            )}
            <button onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
              <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
            </button>
            <button className="p-2 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl space-y-5">
            {/* Identity */}
            <div className="bg-white border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Agent Identity</h3>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Agent Name</label>
                <input type="text" value={agentName} onChange={e => { setAgentName(e.target.value); setSaved(false); }}
                  className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Description</label>
                <textarea value={description} onChange={e => { setDescription(e.target.value); setSaved(false); }}
                  rows={3} className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Status</label>
                <select className="px-3 py-2 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white">
                  <option value="active">Active</option>
                  <option value="idle">Idle</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Capabilities */}
            <div className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Capabilities</h3>
                <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
              <div className="space-y-2">
                {capabilities.map((cap, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg group">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: agent.bgColor }}>
                        <Zap className="w-3.5 h-3.5" style={{ color: agent.color }} />
                      </div>
                      <span className="text-sm text-foreground">{cap}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Active</span>
                      <button onClick={() => setCapabilities(prev => prev.filter((_, j) => j !== i))}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Connectors */}
            <div className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Connected Integrations</h3>
                <button onClick={() => onNavigate('connectors')} className="text-xs text-primary hover:underline">Manage connectors</button>
              </div>
              <div className="space-y-2">
                {agent.connectors.map((connector, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {connector[0]}
                      </div>
                      <span className="text-sm text-foreground">{connector}</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700">Connected</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white border border-red-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-red-700 mb-3">Danger Zone</h3>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Delete this agent</div>
                  <p className="text-xs text-muted-foreground mt-0.5">Permanently delete {agent.name} and all associated data. This cannot be undone.</p>
                </div>
                <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                  Delete Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
