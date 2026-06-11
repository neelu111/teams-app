import React, { useState } from 'react';
import { EScreen } from '../employeeData';
import { ETasksScreen } from './ETasksScreen';
import { EWorkflowsScreen } from './EWorkflowsScreen';

interface EWorkTabProps {
  onNavigate: (s: EScreen, id?: string) => void;
  initialTaskId?: string;
  initialWorkflowId?: string;
}

export function EWorkTab({ onNavigate, initialTaskId, initialWorkflowId }: EWorkTabProps) {
  const [tab, setTab] = useState<'tasks' | 'workflows'>(initialTaskId ? 'tasks' : 'workflows');

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-3 bg-white border-b border-border flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-lg overflow-hidden">
          <button onClick={() => setTab('workflows')} className={`px-3 py-1.5 transition-colors ${tab === 'workflows' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
            Workflows
          </button>
          <button onClick={() => setTab('tasks')} className={`px-3 py-1.5 transition-colors ${tab === 'tasks' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'}`}>
            Tasks
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === 'workflows' ? (
          <EWorkflowsScreen onNavigate={onNavigate} initialWorkflowId={initialWorkflowId} />
        ) : (
          <ETasksScreen onNavigate={onNavigate} initialTaskId={initialTaskId} />
        )}
      </div>
    </div>
  );
}
