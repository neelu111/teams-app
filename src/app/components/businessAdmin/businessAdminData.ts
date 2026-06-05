export type BAScreen =
  | 'dashboard' | 'super-agent' | 'specialist-agents' | 'users'
  | 'roles' | 'permissions' | 'connectors' | 'capabilities'
  | 'audit' | 'reports' | 'settings';

// ─── System Metrics ──────────────────────────────────────────────────────────

export const systemMetrics = {
  totalUsers: 11,
  activeUsers: 11,
  totalAgents: 7,
  activeAgents: 6,
  workflowsToday: 84,
  workflowsRunning: 12,
  workflowsBlocked: 2,
  workflowSuccessRate: 96.4,
  systemUptime: 99.97,
  avgResponseTime: '1.4s',
  totalConnectors: 14,
  activeConnectors: 12,
  apiCallsToday: 18420,
  hoursAutomated: 847,
  agentActivity: [
    { time: '8AM', calls: 120 }, { time: '9AM', calls: 340 }, { time: '10AM', calls: 580 },
    { time: '11AM', calls: 720 }, { time: '12PM', calls: 480 }, { time: '1PM', calls: 390 },
    { time: '2PM', calls: 610 }, { time: '3PM', calls: 820 }, { time: '4PM', calls: 540 },
  ],
  weeklyWorkflows: [
    { day: 'Mon', success: 72, failed: 3, blocked: 1 },
    { day: 'Tue', success: 88, failed: 2, blocked: 2 },
    { day: 'Wed', success: 95, failed: 4, blocked: 1 },
    { day: 'Thu', success: 81, failed: 1, blocked: 3 },
    { day: 'Fri', success: 84, failed: 2, blocked: 2 },
  ],
  connectorHealth: [
    { name: 'HubSpot CRM', status: 'healthy', latency: '82ms', calls: 4210, errors: 0 },
    { name: 'Gmail',        status: 'healthy', latency: '124ms', calls: 3820, errors: 2 },
    { name: 'Slack',        status: 'healthy', latency: '61ms',  calls: 2940, errors: 0 },
    { name: 'Google Cal',   status: 'healthy', latency: '98ms',  calls: 1820, errors: 1 },
    { name: 'QuickBooks',   status: 'degraded', latency: '840ms', calls: 890, errors: 14 },
    { name: 'Salesforce',   status: 'healthy', latency: '210ms', calls: 640, errors: 0 },
  ],
};

// ─── Agents ──────────────────────────────────────────────────────────────────

export type AgentStatus = 'active' | 'inactive' | 'paused' | 'configuring';
export type ModelId = 'claude-opus-4-7' | 'claude-sonnet-4-6' | 'claude-haiku-4-5-20251001';

export interface AgentConfig {
  id: string;
  name: string;
  type: string;
  emoji: string;
  color: string;
  status: AgentStatus;
  model: ModelId;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  capabilities: string[];
  connectors: string[];
  approvalRequired: boolean;
  rateLimitPerHour: number;
  totalWorkflows: number;
  successRate: number;
  avgResponseTime: string;
  createdAt: string;
  lastModified: string;
  routingKeywords: string[];
  dataScope: string[];
  humanApprovalThreshold?: string;
}

export const agentConfigs: AgentConfig[] = [
  {
    id: 'agent-super',
    name: 'Command',
    type: 'super',
    emoji: '⚡',
    color: '#5C5FEF',
    status: 'active',
    model: 'claude-opus-4-7',
    temperature: 0.3,
    maxTokens: 8192,
    systemPrompt: `You are Command, the Super Agent for Manexa AI Labs' AI Workforce Platform. Your role is to:\n\n1. Understand user intent from natural language requests\n2. Route tasks to the appropriate specialist agent (Sales for sales, HR for HR, Finance for finance, DevOps for operations, Support for support, Marketing for research)\n3. Maintain context across multi-step workflows\n4. Coordinate multi-agent tasks that span departments\n5. Escalate to humans when approval is required or uncertainty is high\n\nAlways prioritize accuracy over speed. When routing is ambiguous, clarify with the user before proceeding. Never take irreversible actions without explicit confirmation.`,
    capabilities: ['Intent Detection', 'Agent Routing', 'Context Memory', 'Multi-Agent Orchestration', 'Approval Management', 'Escalation Handling'],
    connectors: ['All Specialists'],
    approvalRequired: false,
    rateLimitPerHour: 500,
    totalWorkflows: 1847,
    successRate: 97.3,
    avgResponseTime: '1.2s',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-05-28T14:30:00Z',
    routingKeywords: ['sales', 'deal', 'lead', 'hr', 'employee', 'invoice', 'finance', 'ticket', 'support', 'research', 'analysis', 'procurement', 'ops'],
    dataScope: ['all'],
  },
  {
    id: 'agent-sales',
    name: 'Sales',
    type: 'sales',
    emoji: '📈',
    color: '#0EA5E9',
    status: 'active',
    model: 'claude-sonnet-4-6',
    temperature: 0.5,
    maxTokens: 4096,
    systemPrompt: `You are Sales, the Sales specialist agent for Manexa AI Labs. You specialize in:\n\n- CRM data management (HubSpot, Salesforce)\n- Lead qualification and scoring\n- Proposal generation and email outreach\n- Pipeline analysis and deal forecasting\n- Contract preparation assistance\n\nAlways pull real-time data from HubSpot before making recommendations. Flag deals at risk proactively. For discounts >10%, require manager approval before proceeding.`,
    capabilities: ['CRM Updates', 'Lead Scoring', 'Email Outreach', 'Pipeline Analysis', 'Deal Forecasting', 'Proposal Generation'],
    connectors: ['HubSpot', 'Salesforce', 'Gmail', 'Google Calendar'],
    approvalRequired: true,
    rateLimitPerHour: 200,
    totalWorkflows: 421,
    successRate: 94.1,
    avgResponseTime: '2.3s',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-05-30T10:00:00Z',
    routingKeywords: ['sales', 'deal', 'lead', 'crm', 'proposal', 'pipeline', 'revenue', 'customer', 'contract'],
    dataScope: ['crm', 'email', 'calendar'],
    humanApprovalThreshold: 'Discounts >10%, contracts >$100k, new connector access',
  },
  {
    id: 'agent-hr',
    name: 'HR',
    type: 'hr',
    emoji: '👥',
    color: '#10B981',
    status: 'active',
    model: 'claude-sonnet-4-6',
    temperature: 0.2,
    maxTokens: 4096,
    systemPrompt: `You are HR, the HR specialist agent for Manexa AI Labs. You handle:\n\n- Employee onboarding and offboarding\n- Policy compliance checks\n- Performance review coordination\n- Leave and absence management\n- Training scheduling\n\nAlways verify employee data against BambooHR before making changes. For terminations and compensation changes, always require HR Director approval. Maintain strict confidentiality.`,
    capabilities: ['Onboarding', 'Policy Compliance', 'Performance Reviews', 'Leave Management', 'Training Coordination'],
    connectors: ['BambooHR', 'Workday', 'Slack', 'Google Calendar'],
    approvalRequired: true,
    rateLimitPerHour: 150,
    totalWorkflows: 312,
    successRate: 98.7,
    avgResponseTime: '1.8s',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-05-20T11:00:00Z',
    routingKeywords: ['employee', 'onboarding', 'hr', 'policy', 'leave', 'performance', 'training', 'hire', 'offboard'],
    dataScope: ['hr_records', 'calendar', 'slack'],
    humanApprovalThreshold: 'Terminations, salary changes, new policy changes',
  },
  {
    id: 'agent-finance',
    name: 'Finance',
    type: 'finance',
    emoji: '💳',
    color: '#F59E0B',
    status: 'active',
    model: 'claude-sonnet-4-6',
    temperature: 0.1,
    maxTokens: 4096,
    systemPrompt: `You are Finance, the Finance specialist agent for Manexa AI Labs. You handle:\n\n- Invoice processing and verification\n- Expense report reconciliation\n- Budget analysis and reporting\n- Payment approval workflows\n- Financial document generation\n\nAll financial actions must be logged with timestamps. Payments over $10,000 require CFO approval. Never initiate payments without verified invoice matching purchase orders.`,
    capabilities: ['Invoice Processing', 'Expense Reports', 'Budget Analysis', 'Payment Approvals', 'Financial Reporting'],
    connectors: ['QuickBooks', 'Stripe', 'Expensify', 'NetSuite'],
    approvalRequired: true,
    rateLimitPerHour: 100,
    totalWorkflows: 289,
    successRate: 99.1,
    avgResponseTime: '1.5s',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-06-01T09:00:00Z',
    routingKeywords: ['invoice', 'payment', 'expense', 'budget', 'finance', 'accounting', 'receipt', 'reconcile'],
    dataScope: ['financial_records', 'invoices', 'expenses'],
    humanApprovalThreshold: 'Payments >$10k, budget overrides, new vendor setup',
  },
  {
    id: 'agent-ops',
    name: 'DevOps',
    type: 'operations',
    emoji: '⚙️',
    color: '#8B5CF6',
    status: 'active',
    model: 'claude-haiku-4-5-20251001',
    temperature: 0.3,
    maxTokens: 2048,
    systemPrompt: `You are DevOps, the Operations specialist agent for Manexa AI Labs. You manage:\n\n- IT provisioning and asset management\n- Procurement and vendor management\n- Facility and equipment requests\n- Process automation workflows\n\nAlways create a ServiceNow ticket for IT requests. Procurement over $5,000 requires manager approval. Check inventory before ordering new assets.`,
    capabilities: ['Procurement', 'IT Provisioning', 'Facility Management', 'Vendor Management', 'Asset Tracking'],
    connectors: ['ServiceNow', 'Jira', 'SAP', 'Slack'],
    approvalRequired: true,
    rateLimitPerHour: 100,
    totalWorkflows: 198,
    successRate: 95.8,
    avgResponseTime: '2.1s',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-04-10T14:00:00Z',
    routingKeywords: ['procurement', 'it', 'provisioning', 'equipment', 'vendor', 'facilities', 'asset', 'purchase'],
    dataScope: ['it_assets', 'procurement', 'facilities'],
    humanApprovalThreshold: 'Purchases >$5k, new vendor onboarding',
  },
  {
    id: 'agent-support',
    name: 'Support',
    type: 'support',
    emoji: '🎯',
    color: '#EC4899',
    status: 'active',
    model: 'claude-haiku-4-5-20251001',
    temperature: 0.4,
    maxTokens: 2048,
    systemPrompt: `You are Support, the Customer Support specialist agent for Manexa AI Labs. You handle:\n\n- Ticket triage and routing\n- SLA monitoring and escalation\n- Customer status updates\n- Knowledge base lookups\n- Resolution tracking\n\nAlways acknowledge customer tickets within 15 minutes. For SLA breach risk, escalate immediately to human agents. Never promise specific timelines without checking team capacity.`,
    capabilities: ['Ticket Triage', 'SLA Monitoring', 'Customer Updates', 'Escalation Management', 'Knowledge Base'],
    connectors: ['Zendesk', 'Intercom', 'Slack', 'PagerDuty'],
    approvalRequired: false,
    rateLimitPerHour: 300,
    totalWorkflows: 634,
    successRate: 91.2,
    avgResponseTime: '0.8s',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-05-15T16:00:00Z',
    routingKeywords: ['ticket', 'support', 'customer', 'bug', 'issue', 'complaint', 'help', 'sla'],
    dataScope: ['support_tickets', 'customer_records', 'knowledge_base'],
    humanApprovalThreshold: 'Refunds >$500, account suspension, SLA breach escalation',
  },
  {
    id: 'agent-research',
    name: 'Marketing',
    type: 'research',
    emoji: '🔬',
    color: '#06B6D4',
    status: 'active',
    model: 'claude-sonnet-4-6',
    temperature: 0.6,
    maxTokens: 8192,
    systemPrompt: `You are Marketing, the Research specialist agent for Manexa AI Labs. You conduct:\n\n- Market and competitive intelligence\n- Industry trend analysis\n- Pricing and positioning research\n- Due diligence support\n- Data synthesis and report generation\n\nAlways cite sources. Flag when information is older than 90 days. For confidential competitive research, encrypt outputs and restrict access to requestor only.`,
    capabilities: ['Market Research', 'Competitive Analysis', 'Trend Reports', 'Due Diligence', 'Data Synthesis'],
    connectors: ['Web Search', 'LinkedIn', 'Crunchbase', 'Google Drive'],
    approvalRequired: false,
    rateLimitPerHour: 50,
    totalWorkflows: 156,
    successRate: 96.8,
    avgResponseTime: '4.2s',
    createdAt: '2026-01-15T09:00:00Z',
    lastModified: '2026-05-01T09:00:00Z',
    routingKeywords: ['research', 'competitor', 'analysis', 'market', 'trend', 'intelligence', 'due diligence'],
    dataScope: ['public_web', 'internal_docs', 'google_drive'],
  },
];

// ─── Users ───────────────────────────────────────────────────────────────────

export type UserRole = 'super-admin' | 'business-admin' | 'manager' | 'employee';
export type UserStatus = 'active' | 'invited' | 'suspended' | 'inactive';

export interface BAUser {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  department: string;
  status: UserStatus;
  lastActive: string;
  joinedDate: string;
  agentAccess: string[];
  color: string;
  mfaEnabled: boolean;
  jobTitle: string;
}

export const baUsers: BAUser[] = [
  { id: 'u-001', name: 'Kumar',      initials: 'KU', email: 'kumar@manexa.ai',      role: 'super-admin',    department: 'Executive', status: 'active', lastActive: 'Just now',   joinedDate: 'Jan 2024', agentAccess: ['All Agents'],                 color: '#5C5FEF', mfaEnabled: true,  jobTitle: 'Super Admin' },
  { id: 'u-002', name: 'Suresh',     initials: 'SU', email: 'suresh@manexa.ai',     role: 'business-admin', department: 'Platform',  status: 'active', lastActive: '5 min ago',  joinedDate: 'Jan 2024', agentAccess: ['All Agents'],                 color: '#8B5CF6', mfaEnabled: true,  jobTitle: 'Business Admin' },
  { id: 'u-003', name: 'Praveena',   initials: 'PR', email: 'praveena@manexa.ai',   role: 'manager',        department: 'Business',  status: 'active', lastActive: '10 min ago', joinedDate: 'Feb 2024', agentAccess: ['Command', 'Sales', 'Marketing'],      color: '#0EA5E9', mfaEnabled: true,  jobTitle: 'Business Manager' },
  { id: 'u-004', name: 'Neelu',      initials: 'NE', email: 'neelu@manexa.ai',      role: 'manager',        department: 'Business',  status: 'active', lastActive: '12 min ago', joinedDate: 'Feb 2024', agentAccess: ['Command', 'Sales', 'Marketing'],      color: '#10B981', mfaEnabled: true,  jobTitle: 'Business Manager' },
  { id: 'u-005', name: 'Abhi',       initials: 'AB', email: 'abhi@manexa.ai',       role: 'employee',       department: 'Business',  status: 'active', lastActive: '1 hr ago',   joinedDate: 'Mar 2024', agentAccess: ['Command', 'Sales'],              color: '#F97316', mfaEnabled: true,  jobTitle: 'Business Associate' },
  { id: 'u-006', name: 'Ramesh',     initials: 'RA', email: 'ramesh@manexa.ai',     role: 'employee',       department: 'Business',  status: 'active', lastActive: '45 min ago', joinedDate: 'Mar 2024', agentAccess: ['Command', 'Sales', 'DevOps'],       color: '#EC4899', mfaEnabled: true,  jobTitle: 'Business Associate' },
  { id: 'u-007', name: 'Koti',       initials: 'KO', email: 'koti@manexa.ai',       role: 'employee',       department: 'Business',  status: 'active', lastActive: '50 min ago', joinedDate: 'Apr 2024', agentAccess: ['Command', 'DevOps'],               color: '#06B6D4', mfaEnabled: false, jobTitle: 'Operations Associate' },
  { id: 'u-008', name: 'Kittu',      initials: 'KI', email: 'kittu@manexa.ai',      role: 'employee',       department: 'Business',  status: 'active', lastActive: 'Today',      joinedDate: 'Apr 2024', agentAccess: ['Command', 'Support'],               color: '#8B5CF6', mfaEnabled: false, jobTitle: 'Support Associate' },
  { id: 'u-009', name: 'Divya',      initials: 'DI', email: 'divya@manexa.ai',      role: 'employee',       department: 'Business',  status: 'active', lastActive: 'Today',      joinedDate: 'May 2024', agentAccess: ['Command', 'Sales', 'Marketing'],      color: '#F59E0B', mfaEnabled: true,  jobTitle: 'Business Associate' },
  { id: 'u-010', name: 'Dhathri',    initials: 'DH', email: 'dhathri@manexa.ai',    role: 'employee',       department: 'Business',  status: 'active', lastActive: '20 min ago', joinedDate: 'May 2024', agentAccess: ['Command', 'HR'],               color: '#EF4444', mfaEnabled: true,  jobTitle: 'People DevOps Associate' },
  { id: 'u-011', name: 'Swapna',     initials: 'SW', email: 'swapna@manexa.ai',     role: 'employee',       department: 'Business',  status: 'active', lastActive: '35 min ago', joinedDate: 'May 2024', agentAccess: ['Command', 'Sales', 'Finance'],     color: '#14B8A6', mfaEnabled: true,  jobTitle: 'Business Associate' },
];

// ─── Roles ───────────────────────────────────────────────────────────────────

export interface RoleDefinition {
  id: string;
  name: string;
  label: string;
  color: string;
  bg: string;
  userCount: number;
  description: string;
  isSystem: boolean;
  permissions: Record<string, 'full' | 'read' | 'none'>;
}

export const roleDefinitions: RoleDefinition[] = [
  {
    id: 'super-admin',
    name: 'super-admin',
    label: 'Super Admin',
    color: '#5C5FEF',
    bg: 'bg-indigo-50',
    userCount: 1,
    description: 'Full platform access including system configuration, all agents, all data, and all users.',
    isSystem: true,
    permissions: {
      'Agent Configuration': 'full', 'User Management': 'full', 'Role Management': 'full',
      'Connector Management': 'full', 'Capability Management': 'full', 'Audit Logs': 'full',
      'Reports': 'full', 'Settings': 'full', 'Workflow Creation': 'full', 'Approval Override': 'full',
    },
  },
  {
    id: 'business-admin',
    name: 'business-admin',
    label: 'Business Admin',
    color: '#8B5CF6',
    bg: 'bg-purple-50',
    userCount: 1,
    description: 'Configures agents, connectors, capabilities, and manages users. Cannot modify system-level settings.',
    isSystem: true,
    permissions: {
      'Agent Configuration': 'full', 'User Management': 'full', 'Role Management': 'full',
      'Connector Management': 'full', 'Capability Management': 'full', 'Audit Logs': 'read',
      'Reports': 'full', 'Settings': 'read', 'Workflow Creation': 'full', 'Approval Override': 'full',
    },
  },
  {
    id: 'manager',
    name: 'manager',
    label: 'Business Manager',
    color: '#0EA5E9',
    bg: 'bg-sky-50',
    userCount: 2,
    description: 'Oversees team workflows, approves requests, and views team analytics. Cannot configure agents or connectors.',
    isSystem: true,
    permissions: {
      'Agent Configuration': 'none', 'User Management': 'read', 'Role Management': 'none',
      'Connector Management': 'none', 'Capability Management': 'none', 'Audit Logs': 'read',
      'Reports': 'read', 'Settings': 'none', 'Workflow Creation': 'full', 'Approval Override': 'full',
    },
  },
  {
    id: 'employee',
    name: 'employee',
    label: 'Employee',
    color: '#10B981',
    bg: 'bg-green-50',
    userCount: 7,
    description: 'Can create and run workflows via assigned agents. No admin access.',
    isSystem: true,
    permissions: {
      'Agent Configuration': 'none', 'User Management': 'none', 'Role Management': 'none',
      'Connector Management': 'none', 'Capability Management': 'none', 'Audit Logs': 'none',
      'Reports': 'none', 'Settings': 'none', 'Workflow Creation': 'full', 'Approval Override': 'none',
    },
  },
  {
    id: 'sales-ops',
    name: 'sales-ops',
    label: 'Sales DevOps',
    color: '#F97316',
    bg: 'bg-orange-50',
    userCount: 0,
    description: 'Custom role for sales operations with read access to CRM connector and sales reports.',
    isSystem: false,
    permissions: {
      'Agent Configuration': 'none', 'User Management': 'none', 'Role Management': 'none',
      'Connector Management': 'read', 'Capability Management': 'none', 'Audit Logs': 'none',
      'Reports': 'read', 'Settings': 'none', 'Workflow Creation': 'full', 'Approval Override': 'none',
    },
  },
];

// ─── Connectors ──────────────────────────────────────────────────────────────

export type ConnectorStatus = 'connected' | 'disconnected' | 'error' | 'pending' | 'rate-limited';
export type ConnectorCategory = 'CRM' | 'Communication' | 'Finance' | 'HR' | 'Productivity' | 'IT' | 'Data' | 'Marketing' | 'Custom';

export interface Connector {
  id: string;
  name: string;
  category: ConnectorCategory;
  icon: string;
  status: ConnectorStatus;
  connectedBy?: string;
  connectedAt?: string;
  lastSync?: string;
  apiCalls: number;
  errors: number;
  latency?: string;
  description: string;
  agentsUsing: string[];
  scopes: string[];
  authType: 'oauth2' | 'api-key' | 'basic' | 'webhook';
}

export const connectors: Connector[] = [
  { id: 'cn-001', name: 'HubSpot CRM',      category: 'CRM',           icon: '🔶', status: 'connected',    connectedBy: 'Suresh', connectedAt: 'Jan 15', lastSync: '2 min ago',  apiCalls: 4210, errors: 0,  latency: '82ms',  description: 'CRM contacts, deals, pipeline, and activity data.', agentsUsing: ['Sales', 'Command'], scopes: ['contacts:read', 'contacts:write', 'deals:read', 'deals:write', 'reports:read'], authType: 'oauth2' },
  { id: 'cn-002', name: 'Salesforce',        category: 'CRM',           icon: '☁️',  status: 'connected',    connectedBy: 'Suresh', connectedAt: 'Jan 15', lastSync: '5 min ago',  apiCalls: 640,  errors: 0,  latency: '210ms', description: 'Enterprise CRM for large account management.', agentsUsing: ['Sales'], scopes: ['api', 'refresh_token', 'offline_access'], authType: 'oauth2' },
  { id: 'cn-003', name: 'Gmail',             category: 'Communication', icon: '✉️',  status: 'connected',    connectedBy: 'Suresh', connectedAt: 'Jan 15', lastSync: '1 min ago',  apiCalls: 3820, errors: 2,  latency: '124ms', description: 'Email read, compose, and send operations.', agentsUsing: ['Sales', 'HR', 'Support'], scopes: ['gmail.readonly', 'gmail.send', 'gmail.compose'], authType: 'oauth2' },
  { id: 'cn-004', name: 'Slack',             category: 'Communication', icon: '💬',  status: 'connected',    connectedBy: 'Suresh', connectedAt: 'Jan 16', lastSync: '30 sec ago', apiCalls: 2940, errors: 0,  latency: '61ms',  description: 'Team messaging, notifications, and channel management.', agentsUsing: ['Command', 'HR', 'Support', 'DevOps'], scopes: ['channels:read', 'chat:write', 'users:read'], authType: 'oauth2' },
  { id: 'cn-005', name: 'Google Calendar',   category: 'Productivity',  icon: '📅',  status: 'connected',    connectedBy: 'Kumar',   connectedAt: 'Jan 15', lastSync: '10 min ago', apiCalls: 1820, errors: 1,  latency: '98ms',  description: 'Calendar events, scheduling, and availability.', agentsUsing: ['HR', 'Sales'], scopes: ['calendar.readonly', 'calendar.events'], authType: 'oauth2' },
  { id: 'cn-006', name: 'Google Drive',      category: 'Productivity',  icon: '📁',  status: 'connected',    connectedBy: 'Suresh', connectedAt: 'Jan 15', lastSync: '15 min ago', apiCalls: 920,  errors: 0,  latency: '145ms', description: 'File storage, sharing, and document access.', agentsUsing: ['Marketing', 'Command'], scopes: ['drive.readonly', 'drive.file'], authType: 'oauth2' },
  { id: 'cn-007', name: 'QuickBooks',        category: 'Finance',       icon: '📊',  status: 'error',        connectedBy: 'Divya',      connectedAt: 'Feb 1',  lastSync: '2 hrs ago',  apiCalls: 890,  errors: 14, latency: '840ms', description: 'Invoice processing, expense reports, and financial data.', agentsUsing: ['Finance'], scopes: ['accounting', 'payments', 'reports'], authType: 'oauth2' },
  { id: 'cn-008', name: 'Stripe',            category: 'Finance',       icon: '💳',  status: 'connected',    connectedBy: 'Divya',      connectedAt: 'Jan 20', lastSync: '1 hr ago',   apiCalls: 340,  errors: 0,  latency: '92ms',  description: 'Payment processing and subscription management.', agentsUsing: ['Finance'], scopes: ['read_write'], authType: 'api-key' },
  { id: 'cn-009', name: 'BambooHR',          category: 'HR',            icon: '🎋',  status: 'connected',    connectedBy: 'Dhathri',    connectedAt: 'Jan 15', lastSync: '30 min ago', apiCalls: 420,  errors: 0,  latency: '180ms', description: 'Employee records, onboarding, and HR workflows.', agentsUsing: ['HR'], scopes: ['employees:read', 'employees:write', 'time_off:read'], authType: 'api-key' },
  { id: 'cn-010', name: 'Zendesk',           category: 'IT',            icon: '🎫',  status: 'connected',    connectedBy: 'Suresh', connectedAt: 'Jan 18', lastSync: '5 min ago',  apiCalls: 1240, errors: 3,  latency: '112ms', description: 'Customer support ticket management and SLA tracking.', agentsUsing: ['Support'], scopes: ['tickets:read', 'tickets:write', 'users:read'], authType: 'oauth2' },
  { id: 'cn-011', name: 'Outlook / M365',    category: 'Communication', icon: '📧',  status: 'disconnected', connectedBy: undefined,        connectedAt: undefined,lastSync: undefined,     apiCalls: 0,    errors: 0,  latency: undefined,'description': 'Microsoft email and calendar integration.', agentsUsing: [], scopes: ['Mail.Read', 'Mail.Send', 'Calendars.ReadWrite'], authType: 'oauth2' },
  { id: 'cn-012', name: 'WhatsApp Business', category: 'Communication', icon: '📱',  status: 'disconnected', connectedBy: undefined,        connectedAt: undefined,lastSync: undefined,     apiCalls: 0,    errors: 0,  latency: undefined, description: 'WhatsApp Business API for customer messaging.', agentsUsing: [], scopes: ['messages', 'contacts'], authType: 'api-key' },
  { id: 'cn-013', name: 'ServiceNow',        category: 'IT',            icon: '🔧',  status: 'connected',    connectedBy: 'Ramesh',  connectedAt: 'Mar 1',  lastSync: '20 min ago', apiCalls: 380,  errors: 0,  latency: '220ms', description: 'ITSM tickets, asset management, and change requests.', agentsUsing: ['DevOps'], scopes: ['incident.read', 'incident.write', 'asset.read'], authType: 'basic' },
  { id: 'cn-014', name: 'LinkedIn',          category: 'Marketing',     icon: '💼',  status: 'rate-limited', connectedBy: 'Suresh', connectedAt: 'Apr 1',  lastSync: '6 hrs ago',  apiCalls: 180,  errors: 0,  latency: '310ms', description: 'Professional network for lead research and outreach.', agentsUsing: ['Marketing', 'Sales'], scopes: ['r_liteprofile', 'r_emailaddress', 'w_member_social'], authType: 'oauth2' },
  { id: 'cn-015', name: 'Microsoft Teams',   category: 'Communication', icon: '🟦',  status: 'connected',    connectedBy: 'Suresh', connectedAt: 'May 20', lastSync: '3 min ago',  apiCalls: 760,  errors: 1,  latency: '136ms', description: 'Internal chat/channel messaging for manager and employee notifications.', agentsUsing: ['Command', 'Sales', 'HR'], scopes: ['ChannelMessage.Send', 'Chat.ReadWrite', 'User.Read.All'], authType: 'oauth2' },
  { id: 'cn-016', name: 'Webhook Gateway',   category: 'Custom',        icon: '🧩',  status: 'pending',      connectedBy: 'Suresh', connectedAt: 'Jun 2',  lastSync: 'Pending approval', apiCalls: 0, errors: 0, latency: undefined, description: 'Custom integration endpoint for external system callbacks and workflow events.', agentsUsing: ['DevOps', 'Command'], scopes: ['workflow.event.write', 'thread.update.write'], authType: 'webhook' },
];

// ─── Capabilities ─────────────────────────────────────────────────────────────

export interface Capability {
  id: string;
  name: string;
  category: string;
  description: string;
  enabled: boolean;
  agentsAllowed: string[];
  rolesAllowed: string[];
  requiresApproval: boolean;
  usageCount: number;
  lastUsed?: string;
  riskLevel: 'low' | 'medium' | 'high';
  dataScope?: string;
}

export const capabilities: Capability[] = [
  { id: 'cap-001', name: 'CRM Read',            category: 'Data Access',  description: 'Read contacts, deals, and pipeline from CRM', enabled: true,  agentsAllowed: ['Sales', 'Command'],       rolesAllowed: ['manager', 'employee'], requiresApproval: false, usageCount: 8420, lastUsed: '2 min ago',  riskLevel: 'low' },
  { id: 'cap-002', name: 'CRM Write',            category: 'Data Access',  description: 'Create and update CRM records',               enabled: true,  agentsAllowed: ['Sales'],                rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 2140, lastUsed: '5 min ago',  riskLevel: 'medium' },
  { id: 'cap-003', name: 'Email Send',           category: 'Communication',description: 'Send emails on behalf of users',             enabled: true,  agentsAllowed: ['Sales', 'HR', 'Support'],  rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 3820, lastUsed: '1 min ago',  riskLevel: 'medium', dataScope: 'Sender domain must match @manexa.ai' },
  { id: 'cap-004', name: 'Email Read',           category: 'Communication',description: 'Read user emails (with consent)',            enabled: true,  agentsAllowed: ['Sales', 'Support'],         rolesAllowed: ['employee'],            requiresApproval: true,  usageCount: 1240, lastUsed: '10 min ago', riskLevel: 'high', dataScope: 'Business emails only, no personal accounts' },
  { id: 'cap-005', name: 'Calendar Create',      category: 'Productivity', description: 'Create and update calendar events',          enabled: true,  agentsAllowed: ['HR', 'Sales'],         rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 920,  lastUsed: '15 min ago', riskLevel: 'low' },
  { id: 'cap-006', name: 'Invoice Processing',   category: 'Finance',      description: 'Read and process vendor invoices',           enabled: true,  agentsAllowed: ['Finance'],               rolesAllowed: ['manager'],             requiresApproval: true,  usageCount: 890,  lastUsed: '1 hr ago',   riskLevel: 'high', dataScope: 'Must match PO within 5% variance' },
  { id: 'cap-007', name: 'Payment Initiation',   category: 'Finance',      description: 'Initiate payments up to $10,000',           enabled: true,  agentsAllowed: ['Finance'],               rolesAllowed: ['manager'],             requiresApproval: true,  usageCount: 210,  lastUsed: '2 hrs ago',  riskLevel: 'high' },
  { id: 'cap-008', name: 'HR Record Read',       category: 'Data Access',  description: 'Read employee HR records',                   enabled: true,  agentsAllowed: ['HR'],                 rolesAllowed: ['manager'],             requiresApproval: false, usageCount: 640,  lastUsed: '30 min ago', riskLevel: 'medium' },
  { id: 'cap-009', name: 'HR Record Write',      category: 'Data Access',  description: 'Update employee records',                    enabled: true,  agentsAllowed: ['HR'],                 rolesAllowed: ['manager'],             requiresApproval: true,  usageCount: 180,  lastUsed: '2 hrs ago',  riskLevel: 'high' },
  { id: 'cap-010', name: 'Ticket Create',        category: 'IT & Support', description: 'Create support or IT tickets',               enabled: true,  agentsAllowed: ['Support', 'DevOps'],          rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 1840, lastUsed: '5 min ago',  riskLevel: 'low' },
  { id: 'cap-011', name: 'Escalation',           category: 'IT & Support', description: 'Escalate tickets to human agents',           enabled: true,  agentsAllowed: ['Support', 'Command'],        rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 320,  lastUsed: '20 min ago', riskLevel: 'medium' },
  { id: 'cap-012', name: 'Web Search',           category: 'Research',     description: 'Search the public web for information',      enabled: true,  agentsAllowed: ['Marketing', 'Command'],       rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 840,  lastUsed: '1 hr ago',   riskLevel: 'low' },
  { id: 'cap-013', name: 'Document Generation',  category: 'Productivity', description: 'Generate formatted documents and reports',   enabled: true,  agentsAllowed: ['All Agents'],          rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 2840, lastUsed: '3 min ago',  riskLevel: 'low' },
  { id: 'cap-014', name: 'Bulk SMS',             category: 'Communication',description: 'Send bulk SMS notifications',                enabled: false, agentsAllowed: ['Support', 'Sales'],         rolesAllowed: ['manager'],             requiresApproval: true,  usageCount: 0,                         riskLevel: 'high' },
  { id: 'cap-015', name: 'Human Approval Gate',  category: 'Workflow',     description: 'Pause workflow for human approval',          enabled: true,  agentsAllowed: ['All Agents'],          rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 640,  lastUsed: '10 min ago', riskLevel: 'low' },
  { id: 'cap-016', name: 'Workflow Scheduling',  category: 'Workflow',     description: 'Schedule recurring workflows',               enabled: true,  agentsAllowed: ['Command'],               rolesAllowed: ['employee'],            requiresApproval: false, usageCount: 420,  lastUsed: '30 min ago', riskLevel: 'low' },
  { id: 'cap-017', name: 'Database Query',       category: 'Data Access',  description: 'Query internal databases (read-only)',       enabled: true,  agentsAllowed: ['Finance', 'Marketing'],       rolesAllowed: ['manager'],             requiresApproval: true,  usageCount: 120,  lastUsed: '3 hrs ago',  riskLevel: 'high' },
  { id: 'cap-018', name: 'API Webhook',          category: 'Integration',  description: 'Trigger external webhook endpoints',         enabled: false, agentsAllowed: ['DevOps'],                 rolesAllowed: ['manager'],             requiresApproval: true,  usageCount: 0,                         riskLevel: 'high' },
  { id: 'cap-019', name: 'Human Dependency Assignment', category: 'Workflow', description: 'Assign workflow step to a human user and track reminders/escalations', enabled: true, agentsAllowed: ['Command', 'Sales', 'DevOps', 'HR'], rolesAllowed: ['manager', 'employee'], requiresApproval: false, usageCount: 286, lastUsed: '18 min ago', riskLevel: 'medium', dataScope: 'Assignee must be in same workspace and role policy' },
  { id: 'cap-020', name: 'Cross-Thread Update', category: 'Workflow', description: 'Post workflow status from specialist thread into manager/user thread', enabled: true, agentsAllowed: ['Command', 'Sales', 'Support'], rolesAllowed: ['manager', 'employee'], requiresApproval: false, usageCount: 412, lastUsed: '7 min ago', riskLevel: 'low', dataScope: 'Thread link required and audit event must be persisted' },
  { id: 'cap-021', name: 'Role-Based Agent Access Check', category: 'Governance', description: 'Evaluate per-role and per-user permission before agent execution', enabled: true, agentsAllowed: ['Command'], rolesAllowed: ['super-admin', 'business-admin', 'manager', 'employee'], requiresApproval: false, usageCount: 9220, lastUsed: 'Just now', riskLevel: 'low', dataScope: 'Workspace access rules + per-agent grants' },
  { id: 'cap-022', name: 'Reminder & Escalation Scheduler', category: 'Workflow', description: 'Schedule reminder checkpoints and escalate when human response is missing', enabled: true, agentsAllowed: ['Command', 'DevOps', 'Support', 'HR'], rolesAllowed: ['manager', 'employee'], requiresApproval: false, usageCount: 534, lastUsed: '11 min ago', riskLevel: 'medium' },
];

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export type AuditCategory = 'workflow' | 'user' | 'agent' | 'security' | 'connector' | 'capability';
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLog {
  id: string;
  timestamp: string;
  timeLabel: string;
  category: AuditCategory;
  severity: AuditSeverity;
  actor: string;
  actorType: 'user' | 'agent' | 'system';
  action: string;
  resource: string;
  detail: string;
  ip?: string;
  status: 'success' | 'failed' | 'blocked';
}

export const auditLogs: AuditLog[] = [
  { id: 'al-019', timestamp: '2026-06-02T12:14:00Z', timeLabel: '12:14 PM', category: 'capability', severity: 'info', actor: 'Command', actorType: 'agent', action: 'Role access evaluation passed', resource: 'Abhi -> Sales (InnovateCo status sync)', detail: 'Manager-tagged task validated against role policy and user grant before Sales executed status check.', status: 'success' },
  { id: 'al-020', timestamp: '2026-06-02T12:13:00Z', timeLabel: '12:13 PM', category: 'workflow', severity: 'info', actor: 'Sales', actorType: 'agent', action: 'Cross-thread status posted', resource: 'Manager Delegation & Status Sync', detail: 'Employee specialist thread update mirrored to manager thread with workflow link and event trail.', status: 'success' },
  { id: 'al-021', timestamp: '2026-06-02T12:11:00Z', timeLabel: '12:11 PM', category: 'connector', severity: 'info', actor: 'Suresh', actorType: 'user', action: 'Connector connected', resource: 'Microsoft Teams', detail: 'Teams connector enabled for manager/employee notification delivery and status update channels.', ip: '10.0.1.12', status: 'success' },
  { id: 'al-022', timestamp: '2026-06-02T12:09:00Z', timeLabel: '12:09 PM', category: 'workflow', severity: 'warning', actor: 'Command', actorType: 'agent', action: 'Reminder escalation triggered', resource: 'TechCorp onboarding blocker', detail: 'Human dependency reminder sent to IT owner after no response in 30 minutes; escalation copied to manager.', status: 'success' },
  { id: 'al-001', timestamp: '2026-06-02T12:12:00Z', timeLabel: '12:12 PM', category: 'security',   severity: 'critical', actor: 'System',       actorType: 'system', action: 'Failed login attempt (5x)',      resource: 'swapna@manexa.ai',       detail: 'Account locked after 5 failed attempts from IP 192.168.1.45. MFA bypass attempted.', ip: '192.168.1.45', status: 'blocked' },
  { id: 'al-002', timestamp: '2026-06-02T12:10:00Z', timeLabel: '12:10 PM', category: 'workflow',   severity: 'error',    actor: 'Finance',        actorType: 'agent',  action: 'Workflow execution failed',     resource: 'Invoice Processing #4892', detail: 'QuickBooks API returned 503. Invoice matching failed after 3 retries.', status: 'failed' },
  { id: 'al-003', timestamp: '2026-06-02T12:05:00Z', timeLabel: '12:05 PM', category: 'user',       severity: 'info',     actor: 'Suresh',      actorType: 'user',  action: 'User role changed',             resource: 'koti@manexa.ai',          detail: 'Role updated from employee to employee (MFA enforcement enabled).', ip: '10.0.1.12', status: 'success' },
  { id: 'al-004', timestamp: '2026-06-02T12:00:00Z', timeLabel: '12:00 PM', category: 'agent',      severity: 'info',     actor: 'Command',        actorType: 'agent',  action: 'Approval gate triggered',      resource: 'InnovateCo Discount wf',   detail: 'Discount approval (15%) routed to Neelu. Awaiting response.', status: 'success' },
  { id: 'al-005', timestamp: '2026-06-02T11:55:00Z', timeLabel: '11:55 AM', category: 'connector',  severity: 'warning',  actor: 'System',       actorType: 'system', action: 'Rate limit warning',            resource: 'LinkedIn API',             detail: 'LinkedIn API at 94% of daily rate limit. Marketing may be throttled after 2:30 PM.', status: 'success' },
  { id: 'al-006', timestamp: '2026-06-02T11:50:00Z', timeLabel: '11:50 AM', category: 'workflow',   severity: 'info',     actor: 'Sales',         actorType: 'agent',  action: 'Workflow completed',            resource: 'TechCorp Q3 Proposal',     detail: 'Proposal generation completed in 89 min. 8/8 steps passed. Awaiting Divya review.', status: 'success' },
  { id: 'al-007', timestamp: '2026-06-02T11:40:00Z', timeLabel: '11:40 AM', category: 'capability', severity: 'warning',  actor: 'Sales',         actorType: 'agent',  action: 'Approval required — bypassed', resource: 'Email Send to InnovateCo', detail: 'Sales attempted to send external email without manager approval. Request blocked per policy.', status: 'blocked' },
  { id: 'al-008', timestamp: '2026-06-02T11:30:00Z', timeLabel: '11:30 AM', category: 'security',   severity: 'info',     actor: 'Kumar',        actorType: 'user',   action: 'SSO login',                     resource: 'Platform',                 detail: 'Successful login via Google SSO from MacBook Pro. MFA verified.', ip: '10.0.0.1', status: 'success' },
  { id: 'al-009', timestamp: '2026-06-02T11:20:00Z', timeLabel: '11:20 AM', category: 'connector',  severity: 'error',    actor: 'System',       actorType: 'system', action: 'Connector health degraded',     resource: 'QuickBooks',               detail: 'QuickBooks response time exceeding 800ms threshold. 14 errors in last 2 hours. Auto-retry enabled.', status: 'failed' },
  { id: 'al-010', timestamp: '2026-06-02T11:00:00Z', timeLabel: '11:00 AM', category: 'agent',      severity: 'info',     actor: 'Suresh',      actorType: 'user',  action: 'Agent model updated',           resource: 'Finance (Finance Agent)',     detail: 'Model changed from claude-sonnet-4-6 to claude-sonnet-4-6 (temperature: 0.1). Deployed.', ip: '10.0.1.12', status: 'success' },
  { id: 'al-011', timestamp: '2026-06-02T10:45:00Z', timeLabel: '10:45 AM', category: 'user',       severity: 'info',     actor: 'Suresh',      actorType: 'user',  action: 'User invited',                  resource: 'dhathri@manexa.ai',        detail: 'Invitation sent to Dhathri (People DevOps Associate). Role: employee. Expires in 7 days.', ip: '10.0.1.12', status: 'success' },
  { id: 'al-012', timestamp: '2026-06-02T10:30:00Z', timeLabel: '10:30 AM', category: 'workflow',   severity: 'info',     actor: 'HR',          actorType: 'agent',  action: 'New hire provisioning started', resource: 'Dhathri — wf-010',         detail: 'Command delegated to DevOps. IT provisioning workflow started. ETA: 2 hours.', status: 'success' },
  { id: 'al-013', timestamp: '2026-06-02T10:15:00Z', timeLabel: '10:15 AM', category: 'security',   severity: 'warning',  actor: 'System',       actorType: 'system', action: 'Unusual API volume',            resource: 'Marketing (Research Agent)',     detail: 'Marketing made 180 LinkedIn API calls in 1 hour — 3x above normal. Possible loop detected.', status: 'success' },
  { id: 'al-014', timestamp: '2026-06-02T10:00:00Z', timeLabel: '10:00 AM', category: 'capability', severity: 'info',     actor: 'Suresh',      actorType: 'user',  action: 'Capability enabled',            resource: 'Email Read',               detail: 'Email Read capability enabled for Sales. Scoped to business accounts only.', ip: '10.0.1.12', status: 'success' },
  { id: 'al-015', timestamp: '2026-06-02T09:45:00Z', timeLabel: '9:45 AM',  category: 'workflow',   severity: 'warning',  actor: 'Support',          actorType: 'agent',  action: 'SLA breach risk',               resource: 'Ticket TK-4521',           detail: 'Customer ticket TK-4521 approaching SLA breach. Escalating to human agent. 45 min remaining.', status: 'success' },
  { id: 'al-016', timestamp: '2026-06-02T09:00:00Z', timeLabel: '9:00 AM',  category: 'agent',      severity: 'info',     actor: 'Command',        actorType: 'agent',  action: 'Workflow orchestration',        resource: 'Daily pipeline review',    detail: 'Command orchestrated 5-agent pipeline review. Sales (sales), Finance (finance), HR (hr) coordinated.', status: 'success' },
  { id: 'al-017', timestamp: '2026-06-02T08:00:00Z', timeLabel: '8:00 AM',  category: 'security',   severity: 'info',     actor: 'System',       actorType: 'system', action: 'Daily security scan',           resource: 'Platform',                 detail: 'Automated security scan complete. No vulnerabilities detected. All agents operating within policy bounds.', status: 'success' },
  { id: 'al-018', timestamp: '2026-06-01T17:30:00Z', timeLabel: 'Jun 1',    category: 'connector',  severity: 'info',     actor: 'Suresh',      actorType: 'user',  action: 'Connector disconnected',        resource: 'Outlook / M365',           detail: 'Microsoft 365 connector disconnected. Migration to Gmail complete.', ip: '10.0.1.12', status: 'success' },
];

// ─── Reports ──────────────────────────────────────────────────────────────────

export const reportMetrics = {
  agentPerformance: agentConfigs.filter(a => a.type !== 'super').map(a => ({
    name: a.name, successRate: a.successRate, workflows: a.totalWorkflows,
    avgTime: parseFloat(a.avgResponseTime), rateLimit: a.rateLimitPerHour,
  })),
  weeklyTrend: [
    { week: 'May 5',  workflows: 284, users: 32, hoursaved: 128, errors: 8 },
    { week: 'May 12', workflows: 312, users: 34, hoursaved: 147, errors: 6 },
    { week: 'May 19', workflows: 341, users: 36, hoursaved: 162, errors: 9 },
    { week: 'May 26', workflows: 298, users: 37, hoursaved: 141, errors: 5 },
    { week: 'Jun 2',  workflows: 84,  users: 38, hoursaved: 42,  errors: 2 },
  ],
  adoptionByDept: [
    { dept: 'Sales',     users: 8,  active: 8,  workflows: 312, avgWeekly: 39 },
    { dept: 'Finance',   users: 4,  active: 4,  workflows: 189, avgWeekly: 24 },
    { dept: 'HR',        users: 3,  active: 3,  workflows: 142, avgWeekly: 18 },
    { dept: 'Support',   users: 6,  active: 5,  workflows: 208, avgWeekly: 26 },
    { dept: 'DevOps',       users: 4,  active: 3,  workflows: 98,  avgWeekly: 12 },
    { dept: 'Engineering',users: 12, active: 8, workflows: 64,  avgWeekly: 8 },
  ],
  capabilityUsage: capabilities.filter(c => c.usageCount > 0).map(c => ({
    name: c.name, count: c.usageCount, category: c.category,
  })).sort((a, b) => b.count - a.count).slice(0, 8),
};
