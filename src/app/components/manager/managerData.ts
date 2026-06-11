export type MScreen = 'dashboard' | 'team-overview' | 'ai' | 'team-work' | 'approvals' | 'employees' | 'reports' | 'notifications';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes-requested';
export type ApprovalCategory = 'discount' | 'expense' | 'contract' | 'deadline' | 'budget' | 'headcount';
export type EscalationSeverity = 'critical' | 'high' | 'medium';
export type MWorkflowStatus = 'running' | 'scheduled' | 'completed' | 'failed' | 'blocked';
export type MTaskStatus = 'pending' | 'in-progress' | 'needs-action' | 'completed' | 'overdue' | 'blocked';
export type MTaskPriority = 'urgent' | 'high' | 'medium' | 'low';
export type MNotifType = 'approval-required' | 'escalation' | 'workflow-blocked' | 'task-overdue' | 'completion' | 'team-update';

export interface MTeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  email: string;
  avatar: string;
  status: 'active' | 'away' | 'offline';
  taskCount: number;
  completedToday: number;
  overdueCount: number;
  workflowCount: number;
  completionRate: number;
  hoursThisWeek: number;
  department: string;
  joinedDate: string;
  currentFocus: string;
  color: string;
  activityFeed: { label: string; time: string; type: 'task' | 'workflow' | 'approval' | 'ai' }[];
  weeklyTasks: { day: string; completed: number; total: number }[];
}

export interface MApproval {
  id: string;
  title: string;
  category: ApprovalCategory;
  status: ApprovalStatus;
  requestedBy: string;
  requestedByInitials: string;
  requestedByRole: string;
  requestedByColor: string;
  requestedAt: string;
  timeLabel: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  dueDate?: string;
  dueDateLabel?: string;
  amount?: number;
  amountLabel?: string;
  description: string;
  businessContext: string;
  agentAnalysis: string;
  agentName: string;
  agentType: string;
  impact: string;
  riskIfDelayed: string;
  relatedWorkflowId?: string;
  relatedWorkflowTitle?: string;
  timeline: { event: string; time: string; actor: string; type: 'request' | 'update' | 'action' | 'escalation' }[];
  changesNotes?: string;
}

export interface MEscalation {
  id: string;
  title: string;
  severity: EscalationSeverity;
  description: string;
  employeeName: string;
  employeeInitials: string;
  employeeColor: string;
  agentName: string;
  timeLabel: string;
  overdueSince?: string;
  dealValue?: number;
  relatedApprovalId?: string;
  suggestedActions: string[];
}

export interface MTeamTask {
  id: string;
  title: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  status: MTaskStatus;
  priority: MTaskPriority;
  dueDate: string;
  dueDateLabel: string;
  isOverdue?: boolean;
  agentName?: string;
  agentType?: string;
  category: string;
  workflowId?: string;
  workflowTitle?: string;
  blockers?: string[];
  dependencies?: string[];
  description: string;
  completionRate?: number;
}

export interface MWorkflow {
  id: string;
  title: string;
  status: MWorkflowStatus;
  agent: string;
  agentType: string;
  assignedTo: string;
  assignedToInitials: string;
  assignedToColor: string;
  progress: number;
  taskCount: number;
  completedTasks: number;
  humanDependencies: number;
  startedAt: string;
  completedAt?: string;
  scheduledFor?: string;
  description: string;
  lastActivity: string;
  steps: { label: string; status: 'done' | 'active' | 'pending' | 'blocked'; assignee?: string }[];
  blockedReason?: string;
}

export interface MNotification {
  id: string;
  type: MNotifType;
  title: string;
  message: string;
  timeLabel: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  relatedId?: string;
  employeeName?: string;
}

// ─── Team Members ───────────────────────────────────────────────────────────

export const managerTeam: MTeamMember[] = [
  {
    id: 'tm-001',
    name: 'Abhi',
    initials: 'AB',
    role: 'Business Associate',
    email: 'abhi@manexa.ai',
    avatar: '🧑',
    status: 'active',
    taskCount: 7,
    completedToday: 2,
    overdueCount: 1,
    workflowCount: 4,
    completionRate: 92,
    hoursThisWeek: 32,
    department: 'Business',
    joinedDate: 'Jan 2024',
    currentFocus: 'InnovateCo status sync to manager by 3 PM',
    color: '#0EA5E9',
    activityFeed: [
      { label: 'Status update posted to Praveena via Command', time: '40 min ago', type: 'ai' },
      { label: 'Sales verified InnovateCo customer response', time: '55 min ago', type: 'workflow' },
      { label: 'TechCorp stakeholder email approved', time: 'Today', type: 'approval' },
      { label: 'CRM follow-up notes updated', time: 'Yesterday', type: 'task' },
      { label: 'Pipeline summary submitted', time: 'Yesterday', type: 'task' },
    ],
    weeklyTasks: [
      { day: 'Mon', completed: 3, total: 4 },
      { day: 'Tue', completed: 2, total: 3 },
      { day: 'Wed', completed: 1, total: 5 },
      { day: 'Thu', completed: 0, total: 2 },
      { day: 'Fri', completed: 0, total: 3 },
    ],
  },
  {
    id: 'tm-002',
    name: 'Ramesh',
    initials: 'RA',
    role: 'Business Associate',
    email: 'ramesh@manexa.ai',
    avatar: '🧑',
    status: 'active',
    taskCount: 5,
    completedToday: 2,
    overdueCount: 0,
    workflowCount: 2,
    completionRate: 95,
    hoursThisWeek: 36,
    department: 'Business',
    joinedDate: 'Mar 2023',
    currentFocus: 'Client follow-up tracker and daily status update',
    color: '#10B981',
    activityFeed: [
      { label: 'Customer reply summary sent to Neelu', time: '25 min ago', type: 'ai' },
      { label: 'Escalation note created for delayed response', time: '1 hr ago', type: 'workflow' },
      { label: 'Stakeholder call scheduled', time: 'Yesterday', type: 'task' },
      { label: 'Weekly activity report submitted', time: 'Yesterday', type: 'task' },
    ],
    weeklyTasks: [
      { day: 'Mon', completed: 4, total: 4 },
      { day: 'Tue', completed: 3, total: 3 },
      { day: 'Wed', completed: 2, total: 2 },
      { day: 'Thu', completed: 0, total: 3 },
      { day: 'Fri', completed: 0, total: 2 },
    ],
  },
  {
    id: 'tm-003',
    name: 'Koti',
    initials: 'KO',
    role: 'Operations Associate',
    email: 'koti@manexa.ai',
    avatar: '🧑',
    status: 'away',
    taskCount: 6,
    completedToday: 3,
    overdueCount: 0,
    workflowCount: 3,
    completionRate: 91,
    hoursThisWeek: 28,
    department: 'Business',
    joinedDate: 'Jun 2023',
    currentFocus: 'Operations checklist and vendor coordination',
    color: '#8B5CF6',
    activityFeed: [
      { label: 'Vendor tracker updated', time: '30 min ago', type: 'task' },
      { label: 'Reminder escalation resolved', time: '1 hr ago', type: 'workflow' },
      { label: 'Procurement checklist completed', time: 'Yesterday', type: 'task' },
      { label: 'DevOps sync sent to manager', time: 'Yesterday', type: 'ai' },
    ],
    weeklyTasks: [
      { day: 'Mon', completed: 3, total: 3 },
      { day: 'Tue', completed: 2, total: 3 },
      { day: 'Wed', completed: 3, total: 3 },
      { day: 'Thu', completed: 0, total: 3 },
      { day: 'Fri', completed: 0, total: 2 },
    ],
  },
  {
    id: 'tm-004',
    name: 'Kittu',
    initials: 'KI',
    role: 'Support Associate',
    email: 'kittu@manexa.ai',
    avatar: '🧑',
    status: 'active',
    taskCount: 9,
    completedToday: 4,
    overdueCount: 0,
    workflowCount: 2,
    completionRate: 89,
    hoursThisWeek: 40,
    department: 'Business',
    joinedDate: 'Sep 2024',
    currentFocus: 'Support queue triage and user follow-ups',
    color: '#F97316',
    activityFeed: [
      { label: 'Ticket response drafted with Support', time: '1 hr ago', type: 'workflow' },
      { label: 'Priority issue escalated to manager', time: '2 hrs ago', type: 'ai' },
      { label: 'Customer callback completed', time: 'Yesterday', type: 'task' },
      { label: 'Daily support summary sent', time: 'May 31', type: 'task' },
    ],
    weeklyTasks: [
      { day: 'Mon', completed: 5, total: 5 },
      { day: 'Tue', completed: 6, total: 6 },
      { day: 'Wed', completed: 4, total: 5 },
      { day: 'Thu', completed: 0, total: 6 },
      { day: 'Fri', completed: 0, total: 4 },
    ],
  },
  {
    id: 'tm-005',
    name: 'Divya',
    initials: 'DI',
    role: 'Business Associate',
    email: 'divya@manexa.ai',
    avatar: '👩',
    status: 'active',
    taskCount: 6,
    completedToday: 3,
    overdueCount: 0,
    workflowCount: 3,
    completionRate: 93,
    hoursThisWeek: 31,
    department: 'Business',
    joinedDate: 'May 2024',
    currentFocus: 'Competitive analysis review and report updates',
    color: '#14B8A6',
    activityFeed: [
      { label: 'Report summary sent to Neelu', time: '35 min ago', type: 'ai' },
      { label: 'Research notes validated with Marketing', time: '1 hr ago', type: 'workflow' },
      { label: 'Client insights sheet updated', time: 'Yesterday', type: 'task' },
      { label: 'Weekly review completed', time: 'May 31', type: 'task' },
    ],
    weeklyTasks: [
      { day: 'Mon', completed: 3, total: 4 },
      { day: 'Tue', completed: 3, total: 4 },
      { day: 'Wed', completed: 2, total: 3 },
      { day: 'Thu', completed: 0, total: 3 },
      { day: 'Fri', completed: 0, total: 2 },
    ],
  },
  {
    id: 'tm-006',
    name: 'Dhathri',
    initials: 'DH',
    role: 'People DevOps Associate',
    email: 'dhathri@manexa.ai',
    avatar: '👩',
    status: 'active',
    taskCount: 5,
    completedToday: 2,
    overdueCount: 0,
    workflowCount: 2,
    completionRate: 90,
    hoursThisWeek: 29,
    department: 'Business',
    joinedDate: 'May 2024',
    currentFocus: 'Employee coordination and approval follow-up',
    color: '#EF4444',
    activityFeed: [
      { label: 'Approval checklist updated with HR', time: '20 min ago', type: 'workflow' },
      { label: 'HR reminder sent to assignees', time: '1 hr ago', type: 'ai' },
      { label: 'Attendance sheet completed', time: 'Yesterday', type: 'task' },
      { label: 'Policy note reviewed', time: 'May 31', type: 'task' },
    ],
    weeklyTasks: [
      { day: 'Mon', completed: 2, total: 3 },
      { day: 'Tue', completed: 2, total: 3 },
      { day: 'Wed', completed: 2, total: 3 },
      { day: 'Thu', completed: 0, total: 2 },
      { day: 'Fri', completed: 0, total: 2 },
    ],
  },
  {
    id: 'tm-007',
    name: 'Swapna',
    initials: 'SW',
    role: 'Business Associate',
    email: 'swapna@manexa.ai',
    avatar: '👩',
    status: 'active',
    taskCount: 6,
    completedToday: 3,
    overdueCount: 1,
    workflowCount: 2,
    completionRate: 88,
    hoursThisWeek: 33,
    department: 'Business',
    joinedDate: 'May 2024',
    currentFocus: 'Finance coordination and stakeholder comms',
    color: '#06B6D4',
    activityFeed: [
      { label: 'Stakeholder email sent via Sales', time: '25 min ago', type: 'ai' },
      { label: 'Expense note verified with Finance', time: '55 min ago', type: 'workflow' },
      { label: 'Payment follow-up task updated', time: 'Yesterday', type: 'task' },
      { label: 'Finance summary shared', time: 'May 31', type: 'task' },
    ],
    weeklyTasks: [
      { day: 'Mon', completed: 3, total: 4 },
      { day: 'Tue', completed: 2, total: 4 },
      { day: 'Wed', completed: 3, total: 4 },
      { day: 'Thu', completed: 0, total: 3 },
      { day: 'Fri', completed: 0, total: 2 },
    ],
  },
];

// ─── Approvals ─────────────────────────────────────────────────────────────

export const managerApprovals: MApproval[] = [
  {
    id: 'ma-001',
    title: '15% Discount — InnovateCo Enterprise Deal',
    category: 'discount',
    status: 'pending',
    requestedBy: 'Divya',
    requestedByInitials: 'DV',
    requestedByRole: 'Sales Representative',
    requestedByColor: '#0EA5E9',
    requestedAt: '2026-06-01T12:00:00Z',
    timeLabel: '1 day ago',
    urgency: 'critical',
    dueDate: '2026-06-02T17:00:00Z',
    dueDateLabel: 'Today at 5 PM',
    amount: 36000,
    amountLabel: '$36k ARR reduction',
    description: 'Emma is requesting a 15% discount on the InnovateCo Enterprise plan renewal worth $240,000/year. InnovateCo is threatening to evaluate competitors if not resolved today.',
    businessContext: 'InnovateCo has been a customer for 3 years. Renewal is worth $240k ARR. They expanded from 50 to 200 seats this year. Account health score: 82/100. Competitor Salesforce has contacted their VP of Sales.',
    agentAnalysis: 'Sales recommends approval. The 15% discount keeps gross margin at 74% (above our 72% threshold). Comparable deals at this ARR range have averaged 12–18% discount. The account\'s 3-year history and 300% seat growth makes this high-retention value. Risk of churn is estimated at 68% without discount.',
    agentName: 'Sales',
    agentType: 'sales',
    impact: 'Approval: $240k ARR retained, $36k discount. Rejection: High churn risk on $240k account.',
    riskIfDelayed: 'Deal closes Friday. Competitor evaluation already underway. Every hour of delay increases churn risk by ~4%.',
    relatedWorkflowId: 'mw-002',
    relatedWorkflowTitle: 'InnovateCo Contract Negotiation',
    timeline: [
      { event: 'Renewal discussion initiated by Divya', time: 'May 28', actor: 'Divya', type: 'request' },
      { event: 'Sales analyzed deal and recommended 15% discount', time: 'May 30', actor: 'Sales (AI)', type: 'update' },
      { event: 'Formal discount request submitted', time: 'Jun 1, 12:00 PM', actor: 'Divya', type: 'request' },
      { event: 'Escalation: approval overdue 24h', time: 'Jun 2, 12:00 PM', actor: 'Command (AI)', type: 'escalation' },
    ],
  },
  {
    id: 'ma-002',
    title: 'Travel Expense Report — May Client Visits',
    category: 'expense',
    status: 'pending',
    requestedBy: 'Abhi',
    requestedByInitials: 'AB',
    requestedByRole: 'Account Executive',
    requestedByColor: '#10B981',
    requestedAt: '2026-06-02T09:00:00Z',
    timeLabel: '3 hrs ago',
    urgency: 'medium',
    dueDate: '2026-06-05T17:00:00Z',
    dueDateLabel: 'Due Friday',
    amount: 3200,
    amountLabel: '$3,200 reimbursement',
    description: 'Abhi is requesting reimbursement for May client visit expenses: 3 flights to SF/NYC/Boston, 4 hotel nights, client dinners. All receipts attached.',
    businessContext: 'Abhi visited GlobalTech (SF), Nexus Corp (NYC), and BlueStar (Boston) in May. These visits contributed to a $640k pipeline. His travel budget YTD is $8,200 of $15,000 approved limit.',
    agentAnalysis: 'Finance verified all 12 receipts against company policy. All expenses are within per-diem limits. Hotel rates and airfares are within policy thresholds. No policy violations detected. Recommended for approval.',
    agentName: 'Finance',
    agentType: 'finance',
    impact: '$3,200 reimbursement within approved budget. YTD travel spend remains at 55% of annual budget.',
    riskIfDelayed: 'Low risk. Standard reimbursement cycle. Employee impact only.',
    timeline: [
      { event: 'Receipts submitted by Abhi', time: 'Jun 2, 9:00 AM', actor: 'Abhi', type: 'request' },
      { event: 'Finance verified all receipts against policy', time: 'Jun 2, 9:15 AM', actor: 'Finance (AI)', type: 'update' },
      { event: 'Approval request sent to manager', time: 'Jun 2, 9:16 AM', actor: 'Finance (AI)', type: 'request' },
    ],
  },
  {
    id: 'ma-003',
    title: 'Conference Budget — Dreamforce 2026',
    category: 'budget',
    status: 'pending',
    requestedBy: 'Praveena',
    requestedByInitials: 'PR',
    requestedByRole: 'Sales Engineer',
    requestedByColor: '#8B5CF6',
    requestedAt: '2026-06-02T08:30:00Z',
    timeLabel: '3.5 hrs ago',
    urgency: 'high',
    dueDate: '2026-06-03T17:00:00Z',
    dueDateLabel: 'Tomorrow',
    amount: 2800,
    amountLabel: '$2,800 conference budget',
    description: 'Praveena is requesting budget to attend Dreamforce 2026 (Sep 17–20, San Francisco). Includes registration ($1,200), flights ($800), hotel ($600), and meals ($200). Early-bird deadline is June 3.',
    businessContext: 'Dreamforce is Salesforce\'s annual conference — a major competitive intelligence and customer relationship opportunity. Divya would represent Manexa AI Labs in 3 partner sessions and attend 2 prospect meetings pre-scheduled by Command.',
    agentAnalysis: 'Marketing researched the conference ROI. Last year\'s attendees averaged 2.3 new pipeline opportunities. Sarah has 4 meetings pre-booked with prospects. Expected pipeline impact: $180k–$320k. Conference budget line is $12k available.',
    agentName: 'Marketing',
    agentType: 'research',
    impact: 'Approval: Access to conference, 4 pre-booked meetings, competitive intel. $2,800 of $12k budget used.',
    riskIfDelayed: 'Early-bird registration closes June 3. Standard rate is $400 more. Missing deadline costs $400 additionally.',
    timeline: [
      { event: 'Praveena requested conference attendance', time: 'Jun 2, 8:30 AM', actor: 'Praveena', type: 'request' },
      { event: 'Marketing completed ROI analysis', time: 'Jun 2, 8:45 AM', actor: 'Marketing (AI)', type: 'update' },
      { event: 'Command pre-booked 4 prospect meetings', time: 'Jun 2, 9:00 AM', actor: 'Command (AI)', type: 'update' },
      { event: 'Approval request escalated — early-bird deadline', time: 'Jun 2, 10:00 AM', actor: 'Command (AI)', type: 'escalation' },
    ],
  },
  {
    id: 'ma-004',
    title: 'BlueStar Renewal Call — 7-Day Extension',
    category: 'deadline',
    status: 'approved',
    requestedBy: 'Divya',
    requestedByInitials: 'DV',
    requestedByRole: 'Sales Representative',
    requestedByColor: '#0EA5E9',
    requestedAt: '2026-06-01T10:00:00Z',
    timeLabel: 'Yesterday',
    urgency: 'medium',
    description: 'Divya is requesting a 7-day extension on the BlueStar renewal call deadline (from June 5 to June 12) due to BlueStar\'s VP of Sales being unavailable this week.',
    businessContext: 'BlueStar is a $120k ARR account up for renewal. Their VP of Sales is at a conference until June 9. Extension has been pre-agreed by BlueStar.',
    agentAnalysis: 'Sales confirms BlueStar account health is strong (87/100). No competitor activity detected. Extension risk is low.',
    agentName: 'Sales',
    agentType: 'sales',
    impact: '7-day extension. No revenue risk. BlueStar has confirmed intent to renew.',
    riskIfDelayed: 'None. BlueStar has pre-agreed to extension.',
    timeline: [
      { event: 'Extension request submitted', time: 'Jun 1, 10:00 AM', actor: 'Divya', type: 'request' },
      { event: 'Sales confirmed low risk', time: 'Jun 1, 10:05 AM', actor: 'Sales (AI)', type: 'update' },
      { event: 'Approved by Neelu', time: 'Jun 1, 11:00 AM', actor: 'Neelu', type: 'action' },
    ],
  },
  {
    id: 'ma-005',
    title: 'Additional Headcount — SDR Q3',
    category: 'headcount',
    status: 'changes-requested',
    requestedBy: 'Divya',
    requestedByInitials: 'DV',
    requestedByRole: 'Sales Representative',
    requestedByColor: '#0EA5E9',
    requestedAt: '2026-05-30T14:00:00Z',
    timeLabel: 'May 30',
    urgency: 'low',
    description: 'Request to hire 1 additional SDR for Q3 to support the expanded enterprise pipeline from TechCorp and InnovateCo wins.',
    businessContext: 'Q3 pipeline is 40% above Q2 forecast. Current SDR capacity (Abhi) covers ~60 accounts. New SDR would support 40 additional accounts.',
    agentAnalysis: 'HR analyzed workload data. Abhi is at 94% capacity. Hiring timeline is 6–8 weeks. Recommendation: Start hiring now to be ready for Q3 ramp.',
    agentName: 'HR',
    agentType: 'hr',
    impact: 'Cost: ~$75k annual salary + benefits. Expected revenue impact: $200–400k additional pipeline.',
    riskIfDelayed: 'Pipeline coverage gap in Q3. Abhi burnout risk at current rate.',
    changesNotes: 'Please provide Q3 revenue forecast data to support the business case. HR needs sign-off from VP Sales before proceeding.',
    timeline: [
      { event: 'Headcount request submitted', time: 'May 30', actor: 'Divya', type: 'request' },
      { event: 'HR analyzed workload capacity', time: 'May 30', actor: 'HR (AI)', type: 'update' },
      { event: 'Changes requested — needs VP Sales sign-off', time: 'Jun 1', actor: 'Neelu', type: 'action' },
    ],
  },
];

// ─── Escalations ──────────────────────────────────────────────────────────

export const managerEscalations: MEscalation[] = [
  {
    id: 'me-001',
    title: 'InnovateCo Deal at Risk — Approval Overdue 26h',
    severity: 'critical',
    description: '$240k renewal deal requires manager approval for 15% discount. Overdue by 26 hours. InnovateCo VP has indicated they are now evaluating Salesforce.',
    employeeName: 'Divya',
    employeeInitials: 'DV',
    employeeColor: '#0EA5E9',
    agentName: 'Command',
    timeLabel: '12 min ago',
    overdueSince: '26 hours',
    dealValue: 240000,
    relatedApprovalId: 'ma-001',
    suggestedActions: ['Approve discount request immediately', 'Call Emma to coordinate response', 'Have Sales draft retention offer'],
  },
  {
    id: 'me-002',
    title: 'TechCorp Onboarding Blocked — IT Provisioning',
    severity: 'high',
    description: 'TechCorp onboarding workflow is blocked at provisioning step. IT has not completed account setup. Kickoff call is Thursday 2 PM.',
    employeeName: 'Praveena',
    employeeInitials: 'PR',
    employeeColor: '#8B5CF6',
    agentName: 'Command',
    timeLabel: '1 hr ago',
    suggestedActions: ['Contact IT to escalate provisioning', 'Reschedule kickoff if not resolved by Thursday AM', 'Command can prepare interim environment'],
  },
];

// ─── Team Tasks ─────────────────────────────────────────────────────────────

export const managerTeamTasks: MTeamTask[] = [
  {
    id: 'mt-001',
    title: 'Review Q3 Proposal for TechCorp',
    assignee: 'Divya',
    assigneeInitials: 'DV',
    assigneeColor: '#0EA5E9',
    status: 'needs-action',
    priority: 'urgent',
    dueDate: '2026-06-02T17:00:00Z',
    dueDateLabel: 'Today at 5 PM',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Sales',
    workflowId: 'mw-001',
    workflowTitle: 'TechCorp Q3 Proposal',
    description: 'Sales has completed the TechCorp proposal draft. Divya needs to review pricing and executive summary before sending.',
  },
  {
    id: 'mt-002',
    title: 'Approve 15% Discount — InnovateCo',
    assignee: 'Divya',
    assigneeInitials: 'DV',
    assigneeColor: '#0EA5E9',
    status: 'overdue',
    priority: 'urgent',
    dueDate: '2026-06-01T12:00:00Z',
    dueDateLabel: '1 day overdue',
    isOverdue: true,
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Approvals',
    workflowId: 'mw-002',
    description: 'InnovateCo discount approval needed. Deal at risk.',
  },
  {
    id: 'mt-003',
    title: 'Schedule BlueStar Renewal Call',
    assignee: 'Divya',
    assigneeInitials: 'DV',
    assigneeColor: '#0EA5E9',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-06-12T17:00:00Z',
    dueDateLabel: 'Jun 12',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Sales',
    description: 'Extension approved. Call to be scheduled for week of June 9.',
  },
  {
    id: 'mt-004',
    title: 'Close GlobalTech Contract',
    assignee: 'Abhi',
    assigneeInitials: 'AB',
    assigneeColor: '#10B981',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2026-06-06T17:00:00Z',
    dueDateLabel: 'Sat Jun 6',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Sales',
    description: 'GlobalTech contract negotiations in final stage. Close by end of week.',
    completionRate: 80,
  },
  {
    id: 'mt-005',
    title: 'TechCorp Integration Scope Document',
    assignee: 'Praveena',
    assigneeInitials: 'PR',
    assigneeColor: '#8B5CF6',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-06-04T14:00:00Z',
    dueDateLabel: 'Thu Jun 4',
    category: 'Technical',
    description: 'Technical integration scope required before Thursday kickoff call.',
    completionRate: 60,
  },
  {
    id: 'mt-006',
    title: 'TechCorp Onboarding Kickoff Call',
    assignee: 'Praveena',
    assigneeInitials: 'PR',
    assigneeColor: '#8B5CF6',
    status: 'blocked',
    priority: 'high',
    dueDate: '2026-06-04T14:00:00Z',
    dueDateLabel: 'Thu Jun 4, 2 PM',
    agentName: 'Command',
    agentType: 'super',
    category: 'Customer',
    workflowId: 'mw-004',
    description: 'Kickoff call scheduled. Blocked on IT account provisioning.',
    blockers: ['IT provisioning not complete — accounts not created'],
  },
  {
    id: 'mt-007',
    title: 'Enterprise Outbound Sequence — 50 Contacts',
    assignee: 'Koti',
    assigneeInitials: 'KT',
    assigneeColor: '#F97316',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2026-06-06T17:00:00Z',
    dueDateLabel: 'Fri Jun 6',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Prospecting',
    completionRate: 60,
    description: '50 enterprise outreach contacts this week. Sales running personalized sequences.',
  },
  {
    id: 'mt-008',
    title: 'Submit Weekly Sales Report',
    assignee: 'Divya',
    assigneeInitials: 'DV',
    assigneeColor: '#0EA5E9',
    status: 'pending',
    priority: 'medium',
    dueDate: '2026-06-05T09:00:00Z',
    dueDateLabel: 'Fri Jun 5, 9 AM',
    category: 'Reporting',
    description: 'Weekly pipeline report for leadership review.',
  },
  {
    id: 'mt-009',
    title: 'Nexus Corp Discovery Call',
    assignee: 'Koti',
    assigneeInitials: 'KT',
    assigneeColor: '#F97316',
    status: 'pending',
    priority: 'high',
    dueDate: '2026-06-03T15:00:00Z',
    dueDateLabel: 'Wed Jun 3, 3 PM',
    category: 'Sales',
    description: 'Discovery call with Nexus Corp VP of Engineering.',
  },
  {
    id: 'mt-010',
    title: 'Competitive Analysis Review — Q3',
    assignee: 'Abhi',
    assigneeInitials: 'AB',
    assigneeColor: '#10B981',
    status: 'needs-action',
    priority: 'medium',
    dueDate: '2026-06-06T17:00:00Z',
    dueDateLabel: 'Sat Jun 6',
    agentName: 'Marketing',
    agentType: 'research',
    category: 'Research',
    description: 'Marketing completed Q3 competitive analysis. Abhi to review and share with team.',
  },
  {
    id: 'mt-011',
    title: 'Q2 Quota Review Presentation',
    assignee: 'Abhi',
    assigneeInitials: 'AB',
    assigneeColor: '#10B981',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-05-31T17:00:00Z',
    dueDateLabel: 'Completed May 31',
    category: 'Reporting',
    description: 'Q2 quota review presented to leadership. Tom hit 108%.',
  },
  {
    id: 'mt-012',
    title: 'May Expense Report Submission',
    assignee: 'Divya',
    assigneeInitials: 'DV',
    assigneeColor: '#0EA5E9',
    status: 'completed',
    priority: 'low',
    dueDate: '2026-06-01T17:00:00Z',
    dueDateLabel: 'Completed Jun 1',
    category: 'Admin',
    description: 'May expense report submitted and approved.',
  },
  {
    id: 'mt-013',
    title: 'InnovateCo Status Sync from Divya',
    assignee: 'Divya',
    assigneeInitials: 'DV',
    assigneeColor: '#0EA5E9',
    status: 'completed',
    priority: 'high',
    dueDate: '2026-06-02T15:00:00Z',
    dueDateLabel: 'Completed 10:36 AM',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Manager Updates',
    workflowId: 'mw-009',
    workflowTitle: 'Manager Delegation & Status Sync',
    description: 'Emma acknowledged manager request, Sales verified CRM/email context, and status was posted back to manager thread.',
  },
  {
    id: 'mt-014',
    title: 'TechCorp Stakeholder Update Sent',
    assignee: 'Divya',
    assigneeInitials: 'DV',
    assigneeColor: '#0EA5E9',
    status: 'completed',
    priority: 'medium',
    dueDate: '2026-06-02T11:30:00Z',
    dueDateLabel: 'Completed 11:26 AM',
    agentName: 'Sales',
    agentType: 'sales',
    category: 'Communication',
    workflowId: 'mw-010',
    workflowTitle: 'Stakeholder Communication Workflow',
    description: 'Sales sent timeline email to Priya and Alex with revised onboarding date and owner actions.',
  },
];

// ─── Team Workflows ──────────────────────────────────────────────────────────

export const managerWorkflows: MWorkflow[] = [
  {
    id: 'mw-001',
    title: 'TechCorp Q3 Proposal',
    status: 'running',
    agent: 'Sales',
    agentType: 'sales',
    assignedTo: 'Divya',
    assignedToInitials: 'DV',
    assignedToColor: '#0EA5E9',
    progress: 75,
    taskCount: 8,
    completedTasks: 6,
    humanDependencies: 1,
    startedAt: '2026-06-02T09:00:00Z',
    description: 'Full proposal generation workflow for TechCorp 200-seat expansion.',
    lastActivity: '2 min ago — Awaiting Divya\'s review',
    steps: [
      { label: 'Account data retrieved', status: 'done' },
      { label: 'Usage analysis complete', status: 'done' },
      { label: 'Pricing configured', status: 'done' },
      { label: 'Executive summary written', status: 'done' },
      { label: 'Technical appendix drafted', status: 'done' },
      { label: 'Proposal formatted', status: 'done' },
      { label: 'Human review (Divya)', status: 'active', assignee: 'Divya' },
      { label: 'Send to client', status: 'pending' },
    ],
  },
  {
    id: 'mw-002',
    title: 'InnovateCo Contract Negotiation',
    status: 'blocked',
    agent: 'Sales',
    agentType: 'sales',
    assignedTo: 'Divya',
    assignedToInitials: 'DV',
    assignedToColor: '#0EA5E9',
    progress: 40,
    taskCount: 10,
    completedTasks: 4,
    humanDependencies: 1,
    startedAt: '2026-06-01T14:00:00Z',
    description: 'Contract negotiation and discount approval for InnovateCo $240k deal.',
    lastActivity: '1 day ago — Blocked on discount approval',
    blockedReason: 'Manager discount approval overdue 26 hours. Deal at risk.',
    steps: [
      { label: 'Deal analysis complete', status: 'done' },
      { label: 'Comparable accounts reviewed', status: 'done' },
      { label: 'Discount recommendation prepared', status: 'done' },
      { label: 'Manager approval requested', status: 'done' },
      { label: 'Awaiting manager approval', status: 'blocked', assignee: 'Neelu' },
      { label: 'Contract drafted', status: 'pending' },
      { label: 'Legal review', status: 'pending' },
      { label: 'Signatures collected', status: 'pending' },
      { label: 'Deal closed', status: 'pending' },
      { label: 'CRM updated', status: 'pending' },
    ],
  },
  {
    id: 'mw-003',
    title: 'BlueStar Contract Renewal',
    status: 'running',
    agent: 'Sales',
    agentType: 'sales',
    assignedTo: 'Divya',
    assignedToInitials: 'DV',
    assignedToColor: '#0EA5E9',
    progress: 55,
    taskCount: 6,
    completedTasks: 3,
    humanDependencies: 1,
    startedAt: '2026-06-01T10:00:00Z',
    description: 'Contract renewal workflow for BlueStar Inc. $120k ARR.',
    lastActivity: '3 hrs ago — Call rescheduled to June 9',
    steps: [
      { label: 'Contract reviewed', status: 'done' },
      { label: 'Renewal terms drafted', status: 'done' },
      { label: 'Pricing adjusted', status: 'done' },
      { label: 'Customer call scheduled (Divya)', status: 'active', assignee: 'Divya' },
      { label: 'Terms agreed', status: 'pending' },
      { label: 'Contract signed', status: 'pending' },
    ],
  },
  {
    id: 'mw-004',
    title: 'TechCorp Customer Onboarding',
    status: 'blocked',
    agent: 'Command',
    agentType: 'super',
    assignedTo: 'Praveena',
    assignedToInitials: 'PR',
    assignedToColor: '#8B5CF6',
    progress: 15,
    taskCount: 12,
    completedTasks: 2,
    humanDependencies: 2,
    startedAt: '2026-06-04T09:00:00Z',
    description: 'Full TechCorp onboarding including provisioning, training, and kickoff.',
    lastActivity: '1 hr ago — Blocked on IT provisioning',
    blockedReason: 'IT has not completed account provisioning. 2 employees still locked out.',
    steps: [
      { label: 'Welcome email sent', status: 'done' },
      { label: 'Account provisioning (IT)', status: 'blocked', assignee: 'IT Team' },
      { label: 'Admin training scheduled', status: 'pending' },
      { label: 'Integrations configured (Praveena)', status: 'pending', assignee: 'Praveena' },
      { label: 'User data migrated', status: 'pending' },
      { label: 'Kickoff call', status: 'pending' },
    ],
  },
  {
    id: 'mw-005',
    title: 'Q3 Competitive Intelligence',
    status: 'running',
    agent: 'Marketing',
    agentType: 'research',
    assignedTo: 'Abhi',
    assignedToInitials: 'AB',
    assignedToColor: '#10B981',
    progress: 90,
    taskCount: 5,
    completedTasks: 4,
    humanDependencies: 1,
    startedAt: '2026-05-30T09:00:00Z',
    description: 'Q3 competitive analysis for 5 key competitors.',
    lastActivity: '30 min ago — Awaiting Abhi\'s review',
    steps: [
      { label: 'Competitor list confirmed', status: 'done' },
      { label: 'Public data gathered', status: 'done' },
      { label: 'Pricing analysis complete', status: 'done' },
      { label: 'Positioning matrix built', status: 'done' },
      { label: 'Human review (Abhi)', status: 'active', assignee: 'Abhi' },
    ],
  },
  {
    id: 'mw-006',
    title: 'GlobalTech Contract Preparation',
    status: 'running',
    agent: 'Sales',
    agentType: 'sales',
    assignedTo: 'Abhi',
    assignedToInitials: 'AB',
    assignedToColor: '#10B981',
    progress: 85,
    taskCount: 6,
    completedTasks: 5,
    humanDependencies: 1,
    startedAt: '2026-06-01T13:00:00Z',
    description: 'Contract preparation and signature collection for GlobalTech $420k deal.',
    lastActivity: '2 hrs ago — Contract sent for signature',
    steps: [
      { label: 'Deal terms finalized', status: 'done' },
      { label: 'Contract drafted by legal', status: 'done' },
      { label: 'Pricing confirmed', status: 'done' },
      { label: 'Contract reviewed', status: 'done' },
      { label: 'Sent for e-signature', status: 'done' },
      { label: 'Counter-signed and closed', status: 'active', assignee: 'Tom' },
    ],
  },
  {
    id: 'mw-007',
    title: 'Enterprise Outbound Sequence',
    status: 'running',
    agent: 'Sales',
    agentType: 'sales',
    assignedTo: 'David Kim',
    assignedToInitials: 'DK',
    assignedToColor: '#F97316',
    progress: 60,
    taskCount: 5,
    completedTasks: 3,
    humanDependencies: 0,
    startedAt: '2026-06-02T08:00:00Z',
    description: 'Personalized outreach to 50 enterprise prospects via multi-channel sequence.',
    lastActivity: '1 hr ago — 30 contacts reached, 4 replies',
    steps: [
      { label: 'Contact list built and verified', status: 'done' },
      { label: 'Personalized emails sent (30/50)', status: 'done' },
      { label: 'LinkedIn follow-ups queued', status: 'done' },
      { label: 'Reply handling and booking', status: 'active' },
      { label: 'Lead handoff to David', status: 'pending' },
    ],
  },
  {
    id: 'mw-008',
    title: 'Q3 Pipeline Report — Auto-generation',
    status: 'scheduled',
    agent: 'Sales',
    agentType: 'sales',
    assignedTo: 'Emma Thompson',
    assignedToInitials: 'ET',
    assignedToColor: '#0EA5E9',
    progress: 0,
    taskCount: 5,
    completedTasks: 0,
    humanDependencies: 0,
    startedAt: '2026-06-05T07:00:00Z',
    scheduledFor: '2026-06-05T07:00:00Z',
    description: 'Automated weekly pipeline report from CRM data for Friday leadership review.',
    lastActivity: 'Scheduled for Fri Jun 5 at 7 AM',
    steps: [
      { label: 'CRM data pulled', status: 'pending' },
      { label: 'Pipeline analyzed', status: 'pending' },
      { label: 'Forecast calculated', status: 'pending' },
      { label: 'Report formatted', status: 'pending' },
      { label: 'Distributed to leadership', status: 'pending' },
    ],
  },
  {
    id: 'mw-009',
    title: 'Manager Delegation & Status Sync',
    status: 'completed',
    agent: 'Command',
    agentType: 'super',
    assignedTo: 'Emma Thompson',
    assignedToInitials: 'ET',
    assignedToColor: '#0EA5E9',
    progress: 100,
    taskCount: 4,
    completedTasks: 4,
    humanDependencies: 1,
    startedAt: '2026-06-02T10:30:00Z',
    completedAt: '2026-06-02T10:36:00Z',
    description: 'Manager requested status, employee coordinated with Sales, and update was synced back to manager thread.',
    lastActivity: 'Completed 40 min ago — manager thread updated',
    steps: [
      { label: 'Manager task tagged to Emma', status: 'done' },
      { label: 'Sales verified latest deal context', status: 'done' },
      { label: 'Status summary generated', status: 'done' },
      { label: 'Update delivered to manager', status: 'done' },
    ],
  },
  {
    id: 'mw-010',
    title: 'Stakeholder Communication Workflow',
    status: 'completed',
    agent: 'Sales',
    agentType: 'sales',
    assignedTo: 'Divya',
    assignedToInitials: 'DV',
    assignedToColor: '#0EA5E9',
    progress: 100,
    taskCount: 5,
    completedTasks: 5,
    humanDependencies: 1,
    startedAt: '2026-06-02T11:22:00Z',
    completedAt: '2026-06-02T11:26:00Z',
    description: 'Employee used mention flow to have Sales draft, confirm, and send stakeholder update email with audit linkage.',
    lastActivity: 'Completed just now — Priya and Alex received update',
    steps: [
      { label: 'Tagged recipients parsed from request', status: 'done' },
      { label: 'Draft prepared by Sales', status: 'done' },
      { label: 'Employee confirmation received', status: 'done' },
      { label: 'Email dispatched to tagged users', status: 'done' },
      { label: 'Workflow and thread logs linked', status: 'done' },
    ],
  },
];

// ─── Notifications ──────────────────────────────────────────────────────────

export const managerNotifications: MNotification[] = [
  {
    id: 'mn-009',
    type: 'team-update',
    title: 'Emma posted InnovateCo status update',
    message: 'Sales verified customer acceptance of 15% terms and Emma posted status back to your manager thread.',
    timeLabel: '38 min ago',
    read: false,
    priority: 'high',
    relatedId: 'mw-009',
    employeeName: 'Emma Thompson',
  },
  {
    id: 'mn-010',
    type: 'completion',
    title: 'Stakeholder email delivered via Sales',
    message: 'TechCorp timeline update email was sent to Dhathri and you. Workflow audit trail attached.',
    timeLabel: 'Just now',
    read: false,
    priority: 'medium',
    relatedId: 'mw-010',
    employeeName: 'Emma Thompson',
  },
  {
    id: 'mn-001',
    type: 'escalation',
    title: 'Critical: InnovateCo Deal at Risk',
    message: 'The $240k InnovateCo discount approval is 26 hours overdue. Deal churn risk is now at 68%. Immediate action required.',
    timeLabel: '12 min ago',
    read: false,
    priority: 'high',
    relatedId: 'ma-001',
    employeeName: 'Emma Thompson',
  },
  {
    id: 'mn-002',
    type: 'approval-required',
    title: 'Approval: Dreamforce Conference Budget',
    message: 'Sarah Chen is requesting $2,800 for Dreamforce. Early-bird deadline is tomorrow. Marketing\'s ROI analysis shows $180–320k pipeline opportunity.',
    timeLabel: '1 hr ago',
    read: false,
    priority: 'high',
    relatedId: 'ma-003',
    employeeName: 'Sarah Chen',
  },
  {
    id: 'mn-003',
    type: 'workflow-blocked',
    title: 'Workflow Blocked: TechCorp Onboarding',
    message: 'TechCorp onboarding is blocked on IT provisioning. Kickoff call is Thursday 2 PM. Command recommends escalating to IT Manager.',
    timeLabel: '1 hr ago',
    read: false,
    priority: 'high',
    relatedId: 'mw-004',
    employeeName: 'Sarah Chen',
  },
  {
    id: 'mn-004',
    type: 'approval-required',
    title: 'Approval: Tom\'s Travel Expenses',
    message: 'Tom Martinez submitted $3,200 in May travel expenses. Finance verified all receipts — no policy violations. Routine approval.',
    timeLabel: '3 hrs ago',
    read: false,
    priority: 'medium',
    relatedId: 'ma-002',
    employeeName: 'Tom Martinez',
  },
  {
    id: 'mn-005',
    type: 'team-update',
    title: 'GlobalTech Contract Sent for Signature',
    message: 'Tom Martinez\'s $420k GlobalTech deal is in final signature stage. Sales sent contract via DocuSign. Expected close: today.',
    timeLabel: '2 hrs ago',
    read: true,
    priority: 'medium',
    relatedId: 'mw-006',
    employeeName: 'Tom Martinez',
  },
  {
    id: 'mn-006',
    type: 'completion',
    title: 'May Expense Reconciliation Complete',
    message: 'Finance processed all May expense reports for your team. Total: $5,540 approved across 3 team members. No exceptions.',
    timeLabel: 'Yesterday',
    read: true,
    priority: 'low',
  },
  {
    id: 'mn-007',
    type: 'task-overdue',
    title: 'Overdue: InnovateCo Approval (Emma)',
    message: 'Emma\'s InnovateCo discount approval task has been overdue for 26 hours. The $240k deal requires your immediate attention.',
    timeLabel: 'Yesterday',
    read: true,
    priority: 'high',
    relatedId: 'mt-002',
    employeeName: 'Emma Thompson',
  },
  {
    id: 'mn-008',
    type: 'team-update',
    title: 'Tom Closed Q2 at 108% Quota',
    message: 'Tom Martinez closed the quarter at 108% of quota. Final deals: GlobalTech (in progress), NexusCorp ($85k), 3 SMB accounts.',
    timeLabel: 'May 31',
    read: true,
    priority: 'low',
    employeeName: 'Tom Martinez',
  },
];

// ─── Report Data ─────────────────────────────────────────────────────────────

export const reportData = {
  productivityWeekly: [
    { week: 'May 5', completed: 28, assigned: 32, aiAssisted: 18 },
    { week: 'May 12', completed: 31, assigned: 35, aiAssisted: 22 },
    { week: 'May 19', completed: 34, assigned: 36, aiAssisted: 26 },
    { week: 'May 26', completed: 29, assigned: 33, aiAssisted: 24 },
    { week: 'Jun 2', completed: 12, assigned: 26, aiAssisted: 10 },
  ],
  workflowsByAgent: [
    { agent: 'Sales', completed: 24, running: 5, scheduled: 2 },
    { agent: 'Command', completed: 8, running: 2, scheduled: 1 },
    { agent: 'Marketing', completed: 6, running: 1, scheduled: 0 },
    { agent: 'Finance', completed: 4, running: 0, scheduled: 0 },
    { agent: 'HR', completed: 2, running: 0, scheduled: 0 },
  ],
  slaCompliance: [
    { category: 'Approvals', target: 24, actual: 18, compliance: 94 },
    { category: 'Escalations', target: 4, actual: 3.2, compliance: 88 },
    { category: 'Task Completion', target: 48, actual: 41, compliance: 96 },
    { category: 'Workflow SLA', target: 72, actual: 68, compliance: 91 },
  ],
  teamPerformance: [
    { name: 'Emma T.', completionRate: 94, tasksCompleted: 42, hoursaved: 28, aiUsage: 87 },
    { name: 'Tom M.', completionRate: 98, tasksCompleted: 51, hoursaved: 31, aiUsage: 72 },
    { name: 'Sarah C.', completionRate: 91, tasksCompleted: 38, hoursaved: 22, aiUsage: 65 },
    { name: 'David K.', completionRate: 89, tasksCompleted: 67, hoursaved: 19, aiUsage: 94 },
  ],
  hoursSavedTrend: [
    { month: 'Jan', hours: 82 }, { month: 'Feb', hours: 95 }, { month: 'Mar', hours: 110 },
    { month: 'Apr', hours: 128 }, { month: 'May', hours: 147 }, { month: 'Jun', hours: 62 },
  ],
};
