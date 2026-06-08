import React from 'react';
import { Zap, Building2, Users, ArrowRight, Plus, Activity, ArrowLeft } from 'lucide-react';

interface WorkspaceScreenProps {
  onSelect: () => void;
  onBack: () => void;
}

const workspaces = [
  { id: 'ws-1', name: 'Manexa AI Labs', domain: 'manexa.ai', members: 11, workflows: 1847, plan: 'Enterprise', status: 'active', color: '#5C5FEF', initials: 'MA', lastActive: '2 minutes ago' },
  { id: 'ws-2', name: 'Manexa Research', domain: 'research.manexa.ai', members: 18, workflows: 234, plan: 'Business', status: 'active', color: '#10B981', initials: 'MR', lastActive: 'Yesterday' },
  { id: 'ws-3', name: 'Manexa Ventures', domain: 'ventures.manexa.ai', members: 8, workflows: 67, plan: 'Starter', status: 'inactive', color: '#F59E0B', initials: 'MV', lastActive: '3 days ago' },
];

export function WorkspaceScreen({ onSelect, onBack }: WorkspaceScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: '#F7F8FA' }}>
      <div className="w-full max-w-xl px-4">
        {/* Back button top-left */}
        <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
        </button>
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-semibold text-foreground">Teams</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-2">Select a workspace</h1>
          <p className="text-sm text-muted-foreground">Choose a workspace to continue, or create a new one</p>
        </div>

        <div className="space-y-2.5 mb-6">
          {workspaces.map(ws => (
            <button
              key={ws.id}
              onClick={onSelect}
              className="w-full bg-white rounded-xl border border-border p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-md transition-all duration-200 group text-left"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg flex-shrink-0"
                style={{ background: ws.color }}>
                {ws.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-foreground text-sm">{ws.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ws.plan === 'Enterprise' ? 'bg-indigo-50 text-indigo-700' : ws.plan === 'Business' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {ws.plan}
                  </span>
                  {ws.status === 'active' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{ws.domain}</div>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" /> {ws.members} members
                  </span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Activity className="w-3 h-3" /> {ws.workflows} workflows
                  </span>
                  <span className="text-xs text-muted-foreground">Active {ws.lastActive}</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </button>
          ))}
        </div>

        <button className="w-full bg-white rounded-xl border-2 border-dashed border-border p-4 flex items-center justify-center gap-2.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-200 group">
          <div className="w-8 h-8 rounded-lg border border-dashed border-current flex items-center justify-center">
            <Plus className="w-4 h-4" />
          </div>
          Create a new workspace
        </button>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Signed in as <span className="font-medium text-foreground">kumar@manexa.ai</span>
        </p>
      </div>
    </div>
  );
}
