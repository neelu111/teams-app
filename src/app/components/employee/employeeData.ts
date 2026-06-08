export type EScreen = 'home' | 'ai' | 'tasks' | 'workflows' | 'notifications' | 'profile' | 'settings' | 'connectors';

export type TaskStatus = 'pending' | 'in-progress' | 'needs-action' | 'completed' | 'overdue';
export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type WorkflowStatus = 'running' | 'scheduled' | 'completed' | 'failed';
export type NotifType = 'task-assigned' | 'approval-required' | 'workflow-update' | 'reminder' | 'escalation' | 'completion';
export type MessageType = 'text' | 'workflow-card' | 'approval-card' | 'task-card';

export interface ETask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  dueDateLabel: string;
  isOverdue?: boolean;
  workflowId?: string;
  workflowTitle?: string;
  agentName?: string;
  agentType?: string;
  category: string;
  completedAt?: string;
  tags?: string[];
}

export interface EWorkflow {
  id: string;
  title: string;
  status: WorkflowStatus;
  agent: string;
  agentType: string;
  progress: number;
  taskCount: number;
  completedTasks: number;
  startedAt: string;
  completedAt?: string;
  scheduledFor?: string;
  description: string;
  lastActivity: string;
  steps: { label: string; status: 'done' | 'active' | 'pending' }[];
}

export interface ENotification {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  timestamp: string;
  timeLabel: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  relatedId?: string;
}

export interface EMessage {
  id: string;
  role: 'user' | 'agent' | 'system';
  agentName?: string;
  agentType?: string;
  content: string;
  timestamp: string;
  type: MessageType;
  cardData?: any;
}

export interface EThread {
  id: string;
  title: string;
  agentName: string;
  agentType: string;
  lastMessage: string;
  timestamp: string;
  timeLabel: string;
  unread: number;
  messages: EMessage[];
}

export interface EFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xlsx' | 'img' | 'ppt' | 'csv';
  size: string;
  modifiedAt: string;
  modifiedLabel: string;
  folder: string;
  generatedBy?: string;
  workflowId?: string;
  shared?: boolean;
}

export const employeeTasks: ETask[] = [
  {
    id: 'et-001',
    title: 'Review Q3 Proposal for TechCorp',
    description: 'Sales has generated a Q3 proposal draft for TechCorp\'s 200-seat expansion. Please review pricing, executive summary, and technical appendix before sending to the client.',
    status: 'needs-action',
    priority: 'urgent',
    dueDate: '2026-06-02T17:00:00Z',
    dueDateLabel: 'Due today at 5 PM',
    workflowId: 'ewf-001',
    workflowTitle: 'TechCorp Proposal Generation',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Sales',
    tags: ['proposal', 'TechCorp', 'Q3'],
  },
  {
    id: 'et-002',
    title: 'Approve 15% Discount — InnovateCo',
    description: 'Sales team is requesting a 15% discount approval for a $240,000 annual deal with InnovateCo. Sales has analyzed comparable accounts and recommends approval.',
    status: 'overdue',
    priority: 'urgent',
    dueDate: '2026-06-01T12:00:00Z',
    dueDateLabel: '1 day overdue',
    isOverdue: true,
    workflowId: 'ewf-002',
    workflowTitle: 'InnovateCo Contract Negotiation',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Approvals',
    tags: ['approval', 'discount', 'InnovateCo'],
  },
  {
    id: 'et-003',
    title: 'Schedule BlueStar Renewal Call',
    description: 'Contract renewal is due in 30 days. Sales has prepared renewal terms. Please schedule a call with their account manager to discuss.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-06-03T17:00:00Z',
    dueDateLabel: 'Due tomorrow',
    workflowId: 'ewf-003',
    workflowTitle: 'BlueStar Contract Renewal',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Sales',
    tags: ['renewal', 'BlueStar'],
  },
  {
    id: 'et-004',
    title: 'Update CRM Records — June Calls',
    description: 'Log all customer calls from last week into HubSpot CRM. Sales can auto-import if you share the call summaries.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-05T17:00:00Z',
    dueDateLabel: 'Due Friday',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Admin',
    tags: ['CRM', 'HubSpot'],
  },
  {
    id: 'et-005',
    title: 'Submit Weekly Sales Report',
    description: 'Complete the weekly pipeline report for the sales team meeting. Command can generate a draft from your CRM data automatically.',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-05T09:00:00Z',
    dueDateLabel: 'Due Friday at 9 AM',
    category: 'Reporting',
    tags: ['report', 'pipeline'],
  },
  {
    id: 'et-006',
    title: 'TechCorp Onboarding Kickoff Call',
    description: 'Join the kickoff call with TechCorp\'s success team. Command has prepared an agenda, pre-reading material, and introductory deck.',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-06-04T14:00:00Z',
    dueDateLabel: 'Thu at 2 PM',
    workflowId: 'ewf-004',
    workflowTitle: 'TechCorp Customer Onboarding',
    agentName: 'Command',
    agentType: 'super',
    category: 'Customer',
    tags: ['onboarding', 'TechCorp'],
  },
  {
    id: 'et-007',
    title: 'Review Competitive Analysis — Q3',
    description: 'Marketing has completed the Q3 competitive intelligence report covering 5 key competitors. Please review and share with sales leadership.',
    status: 'needs-action',
    priority: 'medium',
    dueDate: '2026-06-06T17:00:00Z',
    dueDateLabel: 'Due Saturday',
    workflowId: 'ewf-005',
    workflowTitle: 'Q3 Competitive Intelligence',
    agentName: 'Marketing',
    agentType: 'research',
    category: 'Research',
    tags: ['research', 'competitive'],
  },
  {
    id: 'et-010',
    title: 'Post InnovateCo Status Update to Manager',
    description: 'Alex tagged you to provide the latest InnovateCo status before 3 PM. Use Sales for CRM/email verification and post summary back to manager thread.',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-06-02T15:00:00Z',
    dueDateLabel: 'Due today at 3 PM',
    workflowId: 'ewf-008',
    workflowTitle: 'Manager Status Sync — InnovateCo',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Manager Updates',
    tags: ['manager', 'status-sync', 'InnovateCo'],
  },
  {
    id: 'et-011',
    title: 'Send TechCorp Timeline Email to Stakeholders',
    description: 'Coordinate with Sales to send timeline update email to Priya (CS) and Alex (Manager), then log communication in onboarding workflow.',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-06-02T12:00:00Z',
    dueDateLabel: 'Completed today',
    completedAt: '2026-06-02T11:26:00Z',
    workflowId: 'ewf-009',
    workflowTitle: 'Stakeholder Communication Workflow',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Communication',
    tags: ['email', 'stakeholder', 'TechCorp'],
  },
  {
    id: 'et-008',
    title: 'Expense Report — May 2026',
    description: 'Submit expense report for May travel and client entertainment. Total: $2,340.',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-06-01T17:00:00Z',
    dueDateLabel: 'Completed Jun 1',
    completedAt: '2026-06-01T10:30:00Z',
    category: 'Admin',
  },
  {
    id: 'et-009',
    title: 'Q2 Sales Pipeline Review',
    description: 'Reviewed Q2 pipeline with sales manager. Forecasted $1.2M in new ARR.',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-05-30T17:00:00Z',
    dueDateLabel: 'Completed May 30',
    completedAt: '2026-05-30T15:00:00Z',
    category: 'Sales',
  },
];

export const employeeWorkflows: EWorkflow[] = [
  {
    id: 'ewf-001',
    title: 'TechCorp Q3 Proposal',
    status: 'running',
    agent: 'Sales',
    agentType: 'sales',
    progress: 75,
    taskCount: 8,
    completedTasks: 6,
    startedAt: '2026-06-02T09:00:00Z',
    description: 'Generating a tailored Q3 proposal for TechCorp\'s 200-seat expansion based on usage patterns and growth goals.',
    lastActivity: '2 min ago — Proposal draft ready for review',
    steps: [
      { label: 'Account data retrieved', status: 'done' },
      { label: 'Usage analysis complete', status: 'done' },
      { label: 'Pricing configured', status: 'done' },
      { label: 'Executive summary written', status: 'done' },
      { label: 'Technical appendix drafted', status: 'done' },
      { label: 'Proposal formatted', status: 'done' },
      { label: 'Human review', status: 'active' },
      { label: 'Send to client', status: 'pending' },
    ],
  },
  {
    id: 'ewf-002',
    title: 'InnovateCo Contract Negotiation',
    status: 'running',
    agent: 'Sales',
    agentType: 'sales',
    progress: 40,
    taskCount: 10,
    completedTasks: 4,
    startedAt: '2026-06-01T14:00:00Z',
    description: 'Managing the contract negotiation and discount approval workflow for InnovateCo\'s $240k deal.',
    lastActivity: '1 day ago — Awaiting discount approval',
    steps: [
      { label: 'Deal analysis complete', status: 'done' },
      { label: 'Comparable accounts reviewed', status: 'done' },
      { label: 'Discount recommendation prepared', status: 'done' },
      { label: 'Manager approval requested', status: 'done' },
      { label: 'Waiting for approval', status: 'active' },
      { label: 'Contract drafted', status: 'pending' },
      { label: 'Legal review', status: 'pending' },
      { label: 'Signatures collected', status: 'pending' },
      { label: 'Deal closed', status: 'pending' },
      { label: 'CRM updated', status: 'pending' },
    ],
  },
  {
    id: 'ewf-003',
    title: 'BlueStar Contract Renewal',
    status: 'running',
    agent: 'Sales',
    agentType: 'sales',
    progress: 55,
    taskCount: 6,
    completedTasks: 3,
    startedAt: '2026-06-01T10:00:00Z',
    description: 'Coordinating the contract renewal for BlueStar Inc. with pricing adjustments and new terms.',
    lastActivity: '3 hours ago — Renewal terms prepared',
    steps: [
      { label: 'Contract reviewed', status: 'done' },
      { label: 'Renewal terms drafted', status: 'done' },
      { label: 'Pricing adjusted', status: 'done' },
      { label: 'Customer call scheduled', status: 'active' },
      { label: 'Terms agreed', status: 'pending' },
      { label: 'Contract signed', status: 'pending' },
    ],
  },
  {
    id: 'ewf-004',
    title: 'TechCorp Customer Onboarding',
    status: 'scheduled',
    agent: 'Command',
    agentType: 'super',
    progress: 0,
    taskCount: 12,
    completedTasks: 0,
    startedAt: '2026-06-04T09:00:00Z',
    scheduledFor: '2026-06-04T09:00:00Z',
    description: 'Full onboarding workflow including training, integration setup, and kickoff call for TechCorp.',
    lastActivity: 'Scheduled for Thu Jun 4 at 9 AM',
    steps: [
      { label: 'Welcome email sent', status: 'pending' },
      { label: 'Account provisioning', status: 'pending' },
      { label: 'Admin training scheduled', status: 'pending' },
      { label: 'Integrations configured', status: 'pending' },
      { label: 'User data migrated', status: 'pending' },
      { label: 'Kickoff call', status: 'pending' },
      { label: 'Success plan created', status: 'pending' },
      { label: 'Go-live', status: 'pending' },
    ],
  },
  {
    id: 'ewf-005',
    title: 'Q3 Competitive Intelligence',
    status: 'running',
    agent: 'Marketing',
    agentType: 'research',
    progress: 90,
    taskCount: 5,
    completedTasks: 4,
    startedAt: '2026-05-30T09:00:00Z',
    description: 'Comprehensive competitive analysis covering top 5 competitors for Q3 sales strategy.',
    lastActivity: '30 min ago — Final report ready for review',
    steps: [
      { label: 'Competitor list confirmed', status: 'done' },
      { label: 'Public data gathered', status: 'done' },
      { label: 'Pricing analysis complete', status: 'done' },
      { label: 'Positioning matrix built', status: 'done' },
      { label: 'Human review', status: 'active' },
    ],
  },
  {
    id: 'ewf-006',
    title: 'May Expense Reconciliation',
    status: 'completed',
    agent: 'Finance',
    agentType: 'finance',
    progress: 100,
    taskCount: 4,
    completedTasks: 4,
    startedAt: '2026-06-01T08:00:00Z',
    completedAt: '2026-06-01T11:30:00Z',
    description: 'Processing and reconciling May 2026 expense reports.',
    lastActivity: 'Completed Jun 1 at 11:30 AM',
    steps: [
      { label: 'Receipts collected', status: 'done' },
      { label: 'Categories verified', status: 'done' },
      { label: 'Approval obtained', status: 'done' },
      { label: 'Reimbursement processed', status: 'done' },
    ],
  },
  {
    id: 'ewf-007',
    title: 'Q3 Pipeline Report',
    status: 'scheduled',
    agent: 'Sales',
    agentType: 'sales',
    progress: 0,
    taskCount: 5,
    completedTasks: 0,
    scheduledFor: '2026-06-05T07:00:00Z',
    startedAt: '2026-06-05T07:00:00Z',
    description: 'Automated weekly pipeline report generation from CRM data for Friday leadership review.',
    lastActivity: 'Scheduled for Fri Jun 5 at 7 AM',
    steps: [
      { label: 'CRM data pulled', status: 'pending' },
      { label: 'Pipeline analyzed', status: 'pending' },
      { label: 'Forecast calculated', status: 'pending' },
      { label: 'Report formatted', status: 'pending' },
      { label: 'Distributed to team', status: 'pending' },
    ],
  },
  {
    id: 'ewf-008',
    title: 'Manager Status Sync — InnovateCo',
    status: 'completed',
    agent: 'Sales',
    agentType: 'sales',
    progress: 100,
    taskCount: 4,
    completedTasks: 4,
    startedAt: '2026-06-02T10:30:00Z',
    completedAt: '2026-06-02T10:36:00Z',
    description: 'Delegation flow where manager tagged employee to provide status; Sales verified CRM + email context and posted update to manager thread.',
    lastActivity: 'Completed 40 min ago — Manager received update',
    steps: [
      { label: 'Manager delegation received', status: 'done' },
      { label: 'CRM and customer email checked', status: 'done' },
      { label: 'Status summary prepared', status: 'done' },
      { label: 'Update posted to manager thread', status: 'done' },
    ],
  },
  {
    id: 'ewf-009',
    title: 'TechCorp Stakeholder Communication',
    status: 'completed',
    agent: 'Sales',
    agentType: 'sales',
    progress: 100,
    taskCount: 5,
    completedTasks: 5,
    startedAt: '2026-06-02T11:22:00Z',
    completedAt: '2026-06-02T11:26:00Z',
    description: 'Agent-assisted internal/external communication flow triggered by employee mention and recipient tagging.',
    lastActivity: 'Completed just now — Email delivered to Priya and Alex',
    steps: [
      { label: 'Recipients and message intent parsed', status: 'done' },
      { label: 'Draft generated by Sales', status: 'done' },
      { label: 'Employee confirmation captured', status: 'done' },
      { label: 'Email sent to tagged recipients', status: 'done' },
      { label: 'Workflow and thread audit updated', status: 'done' },
    ],
  },
  
];

// Simple in-memory mock of connector connection state for the current user.
// Keys: connector id -> connected boolean
export let employeeConnectors: { [connectorId: string]: boolean } = {
  'google-calendar': false,
  'gmail': false,
  'google-drive': false,
  'outlook': false,
};

export const employeeNotifications: ENotification[] = [
  {
    id: 'en-009',
    type: 'task-assigned',
    title: 'Manager Tag: InnovateCo Status Needed',
    message: 'Alex tagged you to share InnovateCo status by 3 PM. Sales is available to verify CRM and customer email updates.',
    timestamp: '2026-06-02T10:30:00Z',
    timeLabel: '40 min ago',
    read: false,
    priority: 'high',
    relatedId: 'et-010',
  },
  {
    id: 'en-010',
    type: 'completion',
    title: 'Stakeholder Email Sent',
    message: 'Sales sent timeline update to Dhathri and Neelu, then logged communication in TechCorp onboarding workflow.',
    timestamp: '2026-06-02T11:26:00Z',
    timeLabel: 'Just now',
    read: false,
    priority: 'medium',
    relatedId: 'ewf-009',
  },
  {
    id: 'en-001',
    type: 'escalation',
    title: 'Escalation: Discount Approval Overdue',
    message: 'The InnovateCo discount approval is now 24 hours overdue. The $240k deal may be at risk if not actioned today.',
    timestamp: '2026-06-02T12:00:00Z',
    timeLabel: '12 min ago',
    read: false,
    priority: 'high',
    relatedId: 'et-002',
  },
  {
    id: 'en-002',
    type: 'task-assigned',
    title: 'Task Ready: Review TechCorp Proposal',
    message: 'Sales has completed the TechCorp Q3 proposal draft. Your review is required before 5 PM today.',
    timestamp: '2026-06-02T10:30:00Z',
    timeLabel: '1 hr ago',
    read: false,
    priority: 'high',
    relatedId: 'et-001',
  },
  {
    id: 'en-003',
    type: 'workflow-update',
    title: 'Competitive Analysis Ready',
    message: 'Marketing has completed the Q3 competitive intelligence report — 24 pages covering 5 competitors including positioning and pricing data.',
    timestamp: '2026-06-02T09:45:00Z',
    timeLabel: '2 hrs ago',
    read: false,
    priority: 'medium',
    relatedId: 'ewf-005',
  },
  {
    id: 'en-004',
    type: 'approval-required',
    title: 'Approval Required: 15% Discount',
    message: 'InnovateCo deal requires your approval for a 15% discount. Sales recommends approval based on deal size and account history.',
    timestamp: '2026-06-01T12:00:00Z',
    timeLabel: 'Yesterday',
    read: false,
    priority: 'high',
    relatedId: 'et-002',
  },
  {
    id: 'en-005',
    type: 'workflow-update',
    title: 'TechCorp Proposal — 75% Complete',
    message: 'Sales has drafted the executive summary and pricing sections. One step remaining: your review and approval.',
    timestamp: '2026-06-02T09:50:00Z',
    timeLabel: '2 hrs ago',
    read: true,
    priority: 'medium',
    relatedId: 'ewf-001',
  },
  {
    id: 'en-006',
    type: 'reminder',
    title: 'Reminder: Weekly Report Due Friday',
    message: 'Your weekly sales pipeline report is due Friday at 9 AM. Ask Command to auto-generate it from your CRM.',
    timestamp: '2026-06-02T08:00:00Z',
    timeLabel: '4 hrs ago',
    read: true,
    priority: 'medium',
  },
  {
    id: 'en-007',
    type: 'completion',
    title: 'Expense Report Processed',
    message: 'Finance has successfully processed your May 2026 expense report. Total approved: $2,340. Reimbursement in 3-5 business days.',
    timestamp: '2026-06-01T11:30:00Z',
    timeLabel: 'Yesterday',
    read: true,
    priority: 'low',
    relatedId: 'ewf-006',
  },
  {
    id: 'en-008',
    type: 'task-assigned',
    title: 'New Task: Onboarding Kickoff Prep',
    message: 'Command has prepared the TechCorp kickoff materials. Please review the agenda before Thursday\'s 2 PM call.',
    timestamp: '2026-06-01T16:00:00Z',
    timeLabel: 'Yesterday',
    read: true,
    priority: 'medium',
    relatedId: 'et-006',
  },
];

export const employeeThreads: EThread[] = [
  {
    id: 'eth-001',
    title: 'TechCorp Q3 Proposal',
    agentName: 'Sales',
    agentType: 'sales',
    lastMessage: 'The proposal draft is ready for your review. I\'ve included custom pricing tiers for the 200-seat expansion.',
    timestamp: '2026-06-02T10:28:00Z',
    timeLabel: '1 hr ago',
    unread: 1,
    messages: [
      {
        id: 'm1', role: 'user',
        content: 'I need to create a Q3 proposal for TechCorp. They want to expand from 100 to 300 seats and are interested in the Enterprise plan.',
        timestamp: '2026-06-02T09:00:00Z', type: 'text',
      },
      {
        id: 'm2', role: 'agent', agentName: 'Command', agentType: 'super',
        content: 'Great! I\'ll route this to Sales, our Sales specialist. She has access to TechCorp\'s account history and can create a tailored proposal with the right pricing and positioning.',
        timestamp: '2026-06-02T09:01:00Z', type: 'text',
      },
      {
        id: 'm3', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'Hi Emma! On it. I\'m pulling TechCorp\'s account data, usage metrics, and comparable Enterprise accounts to build the best proposal. This should take about 90 minutes.',
        timestamp: '2026-06-02T09:02:00Z', type: 'text',
      },
      {
        id: 'm4', role: 'system',
        content: 'Sales started workflow: TechCorp Q3 Proposal Generation',
        timestamp: '2026-06-02T09:02:30Z', type: 'text',
      },
      {
        id: 'm5', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'Update: I\'ve completed the account analysis, pulled their top 3 use cases, and configured Enterprise pricing with a volume discount structure. Building the document now.',
        timestamp: '2026-06-02T09:45:00Z', type: 'text',
      },
      {
        id: 'm6', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'The proposal draft is ready for your review. I\'ve included custom pricing tiers for the 200-seat expansion.',
        timestamp: '2026-06-02T10:28:00Z', type: 'workflow-card',
        cardData: {
          title: 'TechCorp Q3 Proposal Generation',
          progress: 75, status: 'running',
          completedTasks: 6, taskCount: 8,
          lastStep: 'Proposal draft ready — awaiting your review',
        },
      },
    ],
  },
  {
    id: 'eth-002',
    title: 'InnovateCo Discount Decision',
    agentName: 'Sales',
    agentType: 'sales',
    lastMessage: 'I recommend approving the 15% discount. The deal is at risk if we wait longer.',
    timestamp: '2026-06-01T14:30:00Z',
    timeLabel: 'Yesterday',
    unread: 0,
    messages: [
      {
        id: 'm1', role: 'user',
        content: 'InnovateCo is asking for a discount on a $240k deal. They want 20% but we normally cap at 15%. What should I do?',
        timestamp: '2026-06-01T13:00:00Z', type: 'text',
      },
      {
        id: 'm2', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'I analyzed InnovateCo\'s deal profile against 12 comparable accounts. A 15% discount is within our approved range and keeps gross margin above the 72% threshold. I wouldn\'t go to 20% — that requires CFO approval and slows the deal.',
        timestamp: '2026-06-01T13:05:00Z', type: 'text',
      },
      {
        id: 'm3', role: 'user',
        content: 'OK, let\'s go with 15%. Can you prepare the approval request?',
        timestamp: '2026-06-01T13:10:00Z', type: 'text',
      },
      {
        id: 'm4', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'I recommend approving the 15% discount. The deal is at risk if we wait longer.',
        timestamp: '2026-06-01T14:30:00Z', type: 'approval-card',
        cardData: {
          title: 'Discount Approval Request',
          description: '15% discount on $240,000/year InnovateCo Enterprise deal',
          requestedBy: 'Divya (via Sales)',
          impact: '$36,000 ARR reduction · Margin stays at 74%',
          deadline: 'Deal closes Friday',
        },
      },
    ],
  },
  {
    id: 'eth-003',
    title: 'Q3 Competitive Research',
    agentName: 'Marketing',
    agentType: 'research',
    lastMessage: 'Research complete. I found significant pricing gaps vs competitor C that you can exploit in deals.',
    timestamp: '2026-06-02T09:45:00Z',
    timeLabel: '2 hrs ago',
    unread: 0,
    messages: [
      {
        id: 'm1', role: 'user',
        content: 'Can you research our top 5 competitors for the Q3 sales playbook? Focus on pricing and positioning.',
        timestamp: '2026-05-30T09:00:00Z', type: 'text',
      },
      {
        id: 'm2', role: 'agent', agentName: 'Marketing', agentType: 'research',
        content: 'Absolutely. I\'ll research pricing pages, G2 reviews, LinkedIn job postings (signals product direction), and recent press. This will take 2-3 days for thorough coverage.',
        timestamp: '2026-05-30T09:05:00Z', type: 'text',
      },
      {
        id: 'm3', role: 'agent', agentName: 'Marketing', agentType: 'research',
        content: 'Research complete. I found significant pricing gaps vs competitor C that you can exploit in deals.',
        timestamp: '2026-06-02T09:45:00Z', type: 'text',
      },
    ],
  },
  {
    id: 'eth-004',
    title: 'Manager Follow-up: InnovateCo Status',
    agentName: 'Command',
    agentType: 'super',
    lastMessage: 'I posted the latest status to Alex: customer confirmed acceptance of 15% discount terms.',
    timestamp: '2026-06-02T11:20:00Z',
    timeLabel: '40 min ago',
    unread: 1,
    messages: [
      {
        id: 'm1', role: 'system',
        content: 'Manager Alex tagged you on task: InnovateCo discount follow-up',
        timestamp: '2026-06-02T10:30:00Z', type: 'text',
      },
      {
        id: 'm2', role: 'user',
        content: 'Manager asked for status. @Sales check latest customer response and help me send an update to Alex.',
        timestamp: '2026-06-02T10:31:00Z', type: 'text',
      },
      {
        id: 'm3', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'Got it. I checked CRM notes and the latest email thread. Customer accepted the 15% proposal language and asked for contract draft ETA. I can post this status to Alex now.',
        timestamp: '2026-06-02T10:34:00Z', type: 'text',
      },
      {
        id: 'm4', role: 'user',
        content: 'Please send it. Mention contract draft by 3 PM and legal review in progress.',
        timestamp: '2026-06-02T10:35:00Z', type: 'text',
      },
      {
        id: 'm5', role: 'agent', agentName: 'Command', agentType: 'super',
        content: 'Update sent to Alex in manager thread. I logged your status update and linked it to InnovateCo workflow.',
        timestamp: '2026-06-02T10:36:00Z', type: 'text',
      },
      {
        id: 'm6', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'I posted the latest status to Alex: customer confirmed acceptance of 15% discount terms.',
        timestamp: '2026-06-02T11:20:00Z', type: 'workflow-card',
        cardData: {
          title: 'InnovateCo Status Sync to Manager',
          progress: 100, status: 'completed',
          completedTasks: 4, taskCount: 4,
          lastStep: 'Manager update delivered and workflow timeline updated',
        },
      },
    ],
  },
  {
    id: 'eth-005',
    title: 'Stakeholder Email via Agent',
    agentName: 'Sales',
    agentType: 'sales',
    lastMessage: 'Email sent to Priya (Customer Success) and Alex with summary + next steps.',
    timestamp: '2026-06-02T11:35:00Z',
    timeLabel: 'Just now',
    unread: 1,
    messages: [
      {
        id: 'm1', role: 'user',
        content: '@Sales draft and send an email to @Dhathri and @Neelu: TechCorp kickoff is on track, but API provisioning needs 1 more day.',
        timestamp: '2026-06-02T11:22:00Z', type: 'text',
      },
      {
        id: 'm2', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'Draft ready. Subject: "TechCorp kickoff update and next steps". Recipients: Dhathri, Neelu. Do you want me to include revised timeline and owner actions?',
        timestamp: '2026-06-02T11:24:00Z', type: 'text',
      },
      {
        id: 'm3', role: 'user',
        content: 'Yes. Add revised date: Friday 11 AM. Mention that Sarah owns integration checklist.',
        timestamp: '2026-06-02T11:25:00Z', type: 'text',
      },
      {
        id: 'm4', role: 'agent', agentName: 'Sales', agentType: 'sales',
        content: 'Sent. I also logged the communication in TechCorp onboarding workflow and tagged Sarah for checklist completion.',
        timestamp: '2026-06-02T11:26:00Z', type: 'workflow-card',
        cardData: {
          title: 'Stakeholder Communication Workflow',
          progress: 100, status: 'completed',
          completedTasks: 5, taskCount: 5,
          lastStep: 'Email sent to Priya and Alex with updated timeline',
        },
      },
    ],
  },
  {
    id: 'eth-006',
    title: 'Onboarding: Integrations Checklist',
    agentName: 'HR',
    agentType: 'hr',
    lastMessage: 'DevOps completed the integration credentials; HR will schedule access review.',
    timestamp: '2026-06-03T09:45:00Z',
    timeLabel: 'Yesterday',
    unread: 0,
    messages: [
      { id: 'm1', role: 'user', content: '@HR Please ensure Dhathri has access to HubSpot and Salesforce before Friday.', timestamp: '2026-06-02T08:10:00Z', type: 'text' },
      { id: 'm2', role: 'agent', agentName: 'HR', agentType: 'hr', content: 'Acknowledged. I will coordinate with DevOps for provisioning and with Sales for access scopes.', timestamp: '2026-06-02T08:12:00Z', type: 'text' },
      { id: 'm3', role: 'agent', agentName: 'DevOps', agentType: 'operations', content: 'Provisioning complete: HubSpot and Salesforce credentials created. Notifying IT for SSO enrollment.', timestamp: '2026-06-02T10:00:00Z', type: 'workflow-card', cardData: { title: 'Onboarding Provisioning', progress: 100, status: 'completed', completedTasks: 4, taskCount: 4, lastStep: 'SSO enrollment scheduled' } },
      { id: 'm4', role: 'user', content: '@DevOps thanks — @HR can you schedule an access review and add Dhathri to the Sales channel?', timestamp: '2026-06-02T10:15:00Z', type: 'text' },
      { id: 'm5', role: 'agent', agentName: 'HR', agentType: 'hr', content: 'Access review scheduled for June 4 at 2 PM. I added Dhathri to the Sales channel and sent welcome docs.', timestamp: '2026-06-02T11:00:00Z', type: 'text' },
    ],
  },
  {
    id: 'eth-007',
    title: 'Feature Request: Bulk Export',
    agentName: 'Command',
    agentType: 'super',
    lastMessage: 'Command queued a feature request and created an approval for prioritization.',
    timestamp: '2026-06-03T14:20:00Z',
    timeLabel: 'Today',
    unread: 0,
    messages: [
      { id: 'm1', role: 'user', content: '@Command Sales needs a bulk CSV export of quarterly deals for forecasting — high priority for leadership.', timestamp: '2026-06-03T13:05:00Z', type: 'text' },
      { id: 'm2', role: 'agent', agentName: 'Command', agentType: 'super', content: 'Understood. I drafted a feature request and recommended priority: high. Creating approval request for Product and Finance.', timestamp: '2026-06-03T13:06:00Z', type: 'text' },
      { id: 'm3', role: 'agent', agentName: 'Finance', agentType: 'finance', content: 'Finance: supportive — this helps export revenue schedules for forecasting. Approving for budget review.', timestamp: '2026-06-03T13:20:00Z', type: 'text' },
      { id: 'm4', role: 'agent', agentName: 'Marketing', agentType: 'research', content: 'Marketing: also useful for campaign ROI breakdowns. Please include tag filters.', timestamp: '2026-06-03T13:35:00Z', type: 'text' },
      { id: 'm5', role: 'agent', agentName: 'Command', agentType: 'super', content: 'Approval required: Allocate dev time for CSV export (estimated 2 sprints).', timestamp: '2026-06-03T13:50:00Z', type: 'approval-card', cardData: { title: 'Approve: Bulk Export Feature', description: 'CSV export for quarterly deals with tag filters', requestedBy: 'Sales (via Command)', impact: 'Enables forecasting exports · reduces manual effort', deadline: '2026-06-10' } },
    ],
  },
  {
    id: 'eth-008',
    title: 'Payroll Discrepancy — May',
    agentName: 'Finance',
    agentType: 'finance',
    lastMessage: 'Finance identified the missing stipend and created a follow-up task for HR.',
    timestamp: '2026-06-04T08:30:00Z',
    timeLabel: 'Today',
    unread: 1,
    messages: [
      { id: 'm1', role: 'user', content: '@Kumar I noticed my May stipend is missing from the payroll run. Can someone check?', timestamp: '2026-06-04T07:45:00Z', type: 'text' },
      { id: 'm2', role: 'agent', agentName: 'Finance', agentType: 'finance', content: 'Investigating: checking payroll batch and reconciliation logs. Please confirm your employee ID and last four of SSN via DM.', timestamp: '2026-06-04T07:50:00Z', type: 'text' },
      { id: 'm3', role: 'user', content: '@Kumar Employee ID KU-001, last4 1234. Thanks.', timestamp: '2026-06-04T07:52:00Z', type: 'text' },
      { id: 'm4', role: 'agent', agentName: 'Finance', agentType: 'finance', content: 'Found discrepancy: stipend line omitted due to mapping error. Creating a task to process a supplemental payment.', timestamp: '2026-06-04T08:00:00Z', type: 'task-card', cardData: { title: 'Supplemental Payroll: Kumar', taskId: 'et-011' } },
      { id: 'm5', role: 'agent', agentName: 'HR', agentType: 'hr', content: 'HR: I will validate the stipend entitlement and confirm the supplemental payment schedule with Finance.', timestamp: '2026-06-04T08:10:00Z', type: 'text' },
    ],
  },
];

export const employeeFiles: EFile[] = [
  { id: 'ef-001', name: 'TechCorp_Q3_Proposal_Draft.pdf', type: 'pdf', size: '2.4 MB', modifiedAt: '2026-06-02T10:28:00Z', modifiedLabel: '1 hr ago', folder: 'Workflow Outputs', generatedBy: 'Sales', workflowId: 'ewf-001', shared: false },
  { id: 'ef-002', name: 'Q3_Competitive_Analysis_Report.pdf', type: 'pdf', size: '5.1 MB', modifiedAt: '2026-06-02T09:45:00Z', modifiedLabel: '2 hrs ago', folder: 'Workflow Outputs', generatedBy: 'Marketing', workflowId: 'ewf-005', shared: true },
  { id: 'ef-003', name: 'InnovateCo_Discount_Analysis.xlsx', type: 'xlsx', size: '840 KB', modifiedAt: '2026-06-01T14:00:00Z', modifiedLabel: 'Yesterday', folder: 'Workflow Outputs', generatedBy: 'Sales', workflowId: 'ewf-002', shared: false },
  { id: 'ef-004', name: 'BlueStar_Renewal_Terms.docx', type: 'doc', size: '1.2 MB', modifiedAt: '2026-06-01T09:00:00Z', modifiedLabel: 'Yesterday', folder: 'Workflow Outputs', generatedBy: 'Sales', workflowId: 'ewf-003', shared: true },
  { id: 'ef-005', name: 'TechCorp_Onboarding_Agenda.pdf', type: 'pdf', size: '520 KB', modifiedAt: '2026-06-01T16:00:00Z', modifiedLabel: 'Yesterday', folder: 'Workflow Outputs', generatedBy: 'Command', workflowId: 'ewf-004', shared: true },
  { id: 'ef-006', name: 'May_Expense_Report.pdf', type: 'pdf', size: '340 KB', modifiedAt: '2026-06-01T11:30:00Z', modifiedLabel: 'Yesterday', folder: 'My Uploads', shared: false },
  { id: 'ef-007', name: 'Q2_Pipeline_Summary.xlsx', type: 'xlsx', size: '1.8 MB', modifiedAt: '2026-05-30T15:00:00Z', modifiedLabel: 'May 30', folder: 'My Uploads', shared: true },
  { id: 'ef-008', name: 'Sales_Playbook_2026.pdf', type: 'pdf', size: '8.2 MB', modifiedAt: '2026-05-15T09:00:00Z', modifiedLabel: 'May 15', folder: 'Shared with Me', shared: true },
  { id: 'ef-009', name: 'Enterprise_Pricing_Guide.pdf', type: 'pdf', size: '1.5 MB', modifiedAt: '2026-05-20T12:00:00Z', modifiedLabel: 'May 20', folder: 'Shared with Me', shared: true },
  { id: 'ef-010', name: 'Customer_Success_Framework.ppt', type: 'ppt', size: '6.7 MB', modifiedAt: '2026-04-01T09:00:00Z', modifiedLabel: 'Apr 1', folder: 'Shared with Me', shared: true },
];
