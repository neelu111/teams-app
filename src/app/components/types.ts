export type Screen =
  | 'login'
  | 'workspace'
  | 'dashboard'
  | 'ai-assistant'
  | 'workflows'
  | 'workflow-detail'
  | 'tasks'
  | 'task-detail'
  | 'agents'
  | 'agent-profile'
  | 'threads'
  | 'thread-detail'
  | 'notifications'
  | 'reports'
  | 'audit'
  | 'users'
  | 'roles'
  | 'super-agent-config'
  | 'agent-config'
  | 'connectors'
  | 'capabilities'
  | 'access-rules'
  | 'settings';

export type WorkflowStatus = 'draft' | 'running' | 'waiting' | 'needs-action' | 'scheduled' | 'blocked' | 'completed' | 'cancelled' | 'failed';
export type TaskStatus = 'draft' | 'running' | 'waiting' | 'needs-action' | 'scheduled' | 'blocked' | 'completed' | 'cancelled' | 'failed';
export type AgentType = 'super' | 'sales' | 'hr' | 'finance' | 'operations' | 'support' | 'research';
export type UserRole = 'super-admin' | 'business-admin' | 'manager' | 'employee';

export interface NavState {
  screen: Screen;
  selectedId?: string;
}

export interface Workflow {
  id: string;
  title: string;
  status: WorkflowStatus;
  agent: string;
  agentType: AgentType;
  createdBy: string;
  progress: number;
  created: string;
  updated: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  taskCount: number;
  completedTasks: number;
  approvalRequired: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: string;
  workflow: string;
  due: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  agent: string;
  description: string;
  created: string;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  emoji: string;
  color: string;
  bgColor: string;
  status: 'active' | 'idle' | 'paused' | 'error';
  capabilities: string[];
  connectors: string[];
  workflowsToday: number;
  totalWorkflows: number;
  successRate: number;
  avgResponseTime: string;
  description: string;
}

export interface Thread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  participants: string[];
  unread: number;
  workflowId?: string;
  agentId?: string;
  pinned: boolean;
}

export interface Notification {
  id: string;
  type: 'approval' | 'completion' | 'error' | 'reminder' | 'mention' | 'assignment';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  workflowId?: string;
  taskId?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  status: 'active' | 'inactive' | 'pending';
  avatar: string;
  joinedAt: string;
  lastSeen: string;
  workflowsCreated: number;
  tasksCompleted: number;
}
