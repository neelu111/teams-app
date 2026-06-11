import { Workflow, Task, Agent, Thread, Notification, User } from './types';

export const sampleWorkflows: Workflow[] = [
  { id: 'wf-001', title: 'Check lead emails and update CRM at 2 PM', status: 'running', agent: 'Sales', agentType: 'sales', createdBy: 'Divya', progress: 64, created: '2026-06-02T08:15:00Z', updated: '2026-06-02T10:30:00Z', priority: 'high', taskCount: 7, completedTasks: 4, approvalRequired: false },
  { id: 'wf-002', title: 'Q2 Onboarding Compliance Report', status: 'completed', agent: 'HR', agentType: 'hr', createdBy: 'Praveena', progress: 100, created: '2026-06-01T09:00:00Z', updated: '2026-06-02T09:45:00Z', priority: 'medium', taskCount: 5, completedTasks: 5, approvalRequired: false },
  { id: 'wf-003', title: 'Batch invoice processing — June vendor payments', status: 'needs-action', agent: 'Finance', agentType: 'finance', createdBy: 'Kumar', progress: 45, created: '2026-06-02T07:30:00Z', updated: '2026-06-02T11:00:00Z', priority: 'critical', taskCount: 12, completedTasks: 5, approvalRequired: true },
  { id: 'wf-004', title: 'Escalate customer ticket TK-4521 — SLA breach risk', status: 'blocked', agent: 'Support', agentType: 'support', createdBy: 'Neelu', progress: 30, created: '2026-06-02T06:00:00Z', updated: '2026-06-02T10:15:00Z', priority: 'critical', taskCount: 4, completedTasks: 1, approvalRequired: false },
  { id: 'wf-005', title: 'Competitor pricing analysis Q3 2026', status: 'scheduled', agent: 'Marketing', agentType: 'research', createdBy: 'Praveena', progress: 0, created: '2026-06-02T11:00:00Z', updated: '2026-06-02T11:00:00Z', priority: 'medium', taskCount: 8, completedTasks: 0, approvalRequired: false },
  { id: 'wf-006', title: 'Procurement order for Q3 office supplies', status: 'waiting', agent: 'DevOps', agentType: 'operations', createdBy: 'Ramesh', progress: 75, created: '2026-06-01T14:00:00Z', updated: '2026-06-02T08:00:00Z', priority: 'low', taskCount: 6, completedTasks: 4, approvalRequired: true },
  { id: 'wf-007', title: 'Weekly sales pipeline review and forecast', status: 'running', agent: 'Sales', agentType: 'sales', createdBy: 'Neelu', progress: 82, created: '2026-06-02T09:00:00Z', updated: '2026-06-02T11:30:00Z', priority: 'high', taskCount: 5, completedTasks: 4, approvalRequired: false },
  { id: 'wf-008', title: 'Performance review cycle — Engineering team', status: 'draft', agent: 'HR', agentType: 'hr', createdBy: 'Praveena', progress: 0, created: '2026-06-02T10:00:00Z', updated: '2026-06-02T10:00:00Z', priority: 'medium', taskCount: 10, completedTasks: 0, approvalRequired: true },
  { id: 'wf-009', title: 'Expense report reconciliation May 2026', status: 'completed', agent: 'Finance', agentType: 'finance', createdBy: 'Kumar', progress: 100, created: '2026-05-31T09:00:00Z', updated: '2026-06-01T16:00:00Z', priority: 'medium', taskCount: 9, completedTasks: 9, approvalRequired: false },
  { id: 'wf-010', title: 'New hire IT provisioning — Dhathri', status: 'running', agent: 'DevOps', agentType: 'operations', createdBy: 'HR', progress: 55, created: '2026-06-02T08:00:00Z', updated: '2026-06-02T10:45:00Z', priority: 'high', taskCount: 8, completedTasks: 4, approvalRequired: false },
];

export const sampleTasks: Task[] = [
  { id: 'task-001', title: 'Review Q3 sales pipeline data from HubSpot', status: 'needs-action', assignee: 'Neelu', workflow: 'wf-001', due: '2026-06-02T14:00:00Z', priority: 'high', agent: 'Sales', description: 'Sales has extracted pipeline data from HubSpot. Please review the 47 leads identified for follow-up and approve the email campaign targeting list.', created: '2026-06-02T08:15:00Z' },
  { id: 'task-002', title: 'Approve vendor invoice #INV-4892 ($42,500)', status: 'needs-action', assignee: 'Kumar', workflow: 'wf-003', due: '2026-06-02T12:00:00Z', priority: 'critical', agent: 'Finance', description: 'Finance has verified this invoice against the purchase order. Amount matches. Vendor: Nexus Cloud Solutions. Please approve to trigger payment.', created: '2026-06-02T07:30:00Z' },
  { id: 'task-003', title: 'Update employee handbook section 4.2', status: 'running', assignee: 'HR', workflow: 'wf-002', due: '2026-06-03T17:00:00Z', priority: 'medium', agent: 'HR', description: 'Updating remote work policy based on Q2 legal review. Currently processing 12 policy documents for consistency checking.', created: '2026-06-01T09:00:00Z' },
  { id: 'task-004', title: 'Respond to customer TK-4521 escalation', status: 'blocked', assignee: 'Divya', workflow: 'wf-004', due: '2026-06-02T13:00:00Z', priority: 'critical', agent: 'Support', description: 'Customer Manexa AI Labs (Enterprise tier) reports payment processing failure for 3 days. Engineering team response required before Support can proceed.', created: '2026-06-02T06:00:00Z' },
  { id: 'task-005', title: 'Verify office supply pricing from 3 vendors', status: 'waiting', assignee: 'Ramesh', workflow: 'wf-006', due: '2026-06-03T09:00:00Z', priority: 'low', agent: 'DevOps', description: 'DevOps has requested quotes from Staples, Office Depot, and Amazon Business. Awaiting responses from all 3 vendors.', created: '2026-06-01T14:00:00Z' },
  { id: 'task-006', title: 'Configure laptop for Dhathri', status: 'running', assignee: 'IT Team', workflow: 'wf-010', due: '2026-06-03T17:00:00Z', priority: 'high', agent: 'DevOps', description: 'MacBook Pro 16" setup in progress. Installing required software packages and configuring VPN access.', created: '2026-06-02T08:00:00Z' },
  { id: 'task-007', title: 'Schedule onboarding meetings for Dhathri', status: 'scheduled', assignee: 'HR', workflow: 'wf-010', due: '2026-06-04T09:00:00Z', priority: 'medium', agent: 'HR', description: 'Scheduled for June 4. HR will coordinate with team leads to arrange 1:1 introductions and orientation sessions.', created: '2026-06-02T08:00:00Z' },
  { id: 'task-008', title: 'Send weekly deal report to leadership', status: 'completed', assignee: 'Sales', workflow: 'wf-007', due: '2026-06-02T09:00:00Z', priority: 'high', agent: 'Sales', description: 'Weekly deal report sent to Kumar, Praveena, and Neelu at 9:02 AM. 12 active deals tracked, $1.2M pipeline value.', created: '2026-06-02T09:00:00Z' },
];

export const sampleAgents: Agent[] = [
  {
    id: 'agent-super', name: 'Command', type: 'super', emoji: '⚡', color: '#5C5FEF', bgColor: '#EEEEFF',
    status: 'active', capabilities: ['Intent Detection', 'Agent Routing', 'Context Memory', 'Multi-Agent Orchestration', 'Approval Management'],
    connectors: ['All Specialists'], workflowsToday: 23, totalWorkflows: 1847, successRate: 97.3, avgResponseTime: '1.2s',
    description: 'Command is the Super Agent that understands every request, detects intent, and routes work to the right specialist. It maintains context across all conversations and manages complex multi-agent workflows.'
  },
  {
    id: 'agent-sales', name: 'Sales', type: 'sales', emoji: '📈', color: '#0EA5E9', bgColor: '#E0F2FE',
    status: 'active', capabilities: ['CRM Updates', 'Lead Scoring', 'Email Outreach', 'Pipeline Analysis', 'Deal Forecasting'],
    connectors: ['HubSpot', 'Salesforce', 'Gmail', 'LinkedIn'], workflowsToday: 8, totalWorkflows: 421, successRate: 94.1, avgResponseTime: '2.3s',
    description: 'Sales manages all sales-related workflows — from lead qualification to deal tracking. She connects with your CRM and communication tools to keep the pipeline moving.'
  },
  {
    id: 'agent-hr', name: 'HR', type: 'hr', emoji: '👥', color: '#10B981', bgColor: '#D1FAE5',
    status: 'active', capabilities: ['Onboarding', 'Policy Compliance', 'Performance Reviews', 'Leave Management', 'Training Coordination'],
    connectors: ['BambooHR', 'Workday', 'Slack', 'Google Calendar'], workflowsToday: 5, totalWorkflows: 312, successRate: 98.7, avgResponseTime: '1.8s',
    description: 'HR handles all HR workflows from new hire onboarding to compliance reporting. He keeps your people processes running smoothly and ensures policy adherence.'
  },
  {
    id: 'agent-finance', name: 'Finance', type: 'finance', emoji: '💳', color: '#F59E0B', bgColor: '#FEF3C7',
    status: 'active', capabilities: ['Invoice Processing', 'Expense Reports', 'Budget Analysis', 'Payment Approvals', 'Financial Reporting'],
    connectors: ['QuickBooks', 'Stripe', 'Expensify', 'NetSuite'], workflowsToday: 6, totalWorkflows: 289, successRate: 99.1, avgResponseTime: '1.5s',
    description: 'Finance automates financial workflows — processing invoices, reconciling expenses, and generating reports. He maintains strict audit trails for all financial operations.'
  },
  {
    id: 'agent-ops', name: 'DevOps', type: 'operations', emoji: '⚙️', color: '#8B5CF6', bgColor: '#EDE9FE',
    status: 'idle', capabilities: ['Procurement', 'IT Provisioning', 'Facility Management', 'Vendor Management', 'Asset Tracking'],
    connectors: ['ServiceNow', 'Jira', 'SAP', 'Slack'], workflowsToday: 3, totalWorkflows: 198, successRate: 95.8, avgResponseTime: '2.1s',
    description: 'DevOps manages operational workflows — from IT provisioning to procurement. He coordinates between departments and external vendors to keep business operations running.'
  },
  {
    id: 'agent-support', name: 'Support', type: 'support', emoji: '🎯', color: '#EC4899', bgColor: '#FCE7F3',
    status: 'active', capabilities: ['Ticket Triage', 'SLA Monitoring', 'Customer Updates', 'Escalation Management', 'Knowledge Base'],
    connectors: ['Zendesk', 'Intercom', 'Jira', 'PagerDuty'], workflowsToday: 12, totalWorkflows: 634, successRate: 91.4, avgResponseTime: '0.9s',
    description: 'Support manages customer support workflows — triaging tickets, monitoring SLAs, and escalating critical issues. He integrates with your support tools to provide fast, consistent customer service.'
  },
  {
    id: 'agent-research', name: 'Marketing', type: 'research', emoji: '🔬', color: '#06B6D4', bgColor: '#CFFAFE',
    status: 'idle', capabilities: ['Market Research', 'Competitive Analysis', 'Data Synthesis', 'Report Generation', 'Trend Analysis'],
    connectors: ['Perplexity', 'Clearbit', 'SimilarWeb', 'Google Analytics'], workflowsToday: 2, totalWorkflows: 156, successRate: 96.2, avgResponseTime: '4.5s',
    description: 'Marketing conducts research workflows — analyzing markets, tracking competitors, and synthesizing data into actionable reports. She turns raw information into strategic intelligence.'
  },
];

export const sampleThreads: Thread[] = [
  { id: 'thread-001', title: 'Lead Email Campaign Strategy', lastMessage: 'Sales: I\'ve identified 47 high-intent leads. Ready to proceed with outreach?', timestamp: '2026-06-02T11:30:00Z', participants: ['Divya', 'Sales', 'Neelu'], unread: 2, workflowId: 'wf-001', agentId: 'agent-sales', pinned: true },
  { id: 'thread-002', title: 'June Vendor Invoice Approval', lastMessage: 'Finance: Invoice #INV-4892 verified. Awaiting your approval to proceed.', timestamp: '2026-06-02T11:00:00Z', participants: ['Finance', 'Kumar'], unread: 1, workflowId: 'wf-003', agentId: 'agent-finance', pinned: true },
  { id: 'thread-003', title: 'Dhathri Onboarding', lastMessage: 'HR: IT provisioning is 55% complete. Meetings scheduled for June 4.', timestamp: '2026-06-02T10:45:00Z', participants: ['HR', 'DevOps', 'Praveena', 'Dhathri'], unread: 0, workflowId: 'wf-010', agentId: 'agent-hr', pinned: false },
  { id: 'thread-004', title: 'TK-4521 Customer Escalation', lastMessage: 'Support: Engineering team response still pending. SLA breach in 2 hours.', timestamp: '2026-06-02T10:15:00Z', participants: ['Support', 'Divya', 'Engineering Team'], unread: 3, workflowId: 'wf-004', agentId: 'agent-support', pinned: false },
  { id: 'thread-005', title: 'Q3 Competitor Pricing Analysis', lastMessage: 'Marketing: Research scheduled for today at 3 PM. Will take approximately 2 hours.', timestamp: '2026-06-02T09:00:00Z', participants: ['Marketing', 'Praveena'], unread: 0, workflowId: 'wf-005', agentId: 'agent-research', pinned: false },
  { id: 'thread-006', title: 'Weekly Sales Forecast', lastMessage: 'Sales: Q3 pipeline at $2.4M. 3 deals at risk — recommend urgent follow-up.', timestamp: '2026-06-02T09:30:00Z', participants: ['Sales', 'Neelu', 'Kumar'], unread: 0, workflowId: 'wf-007', agentId: 'agent-sales', pinned: false },
];

// Add example subthreads for thread-001
sampleThreads[0].subthreads = [
  {
    id: 'sub-001',
    title: 'Targeting list review — Divya & Neelu',
    participants: ['Divya', 'Neelu', 'Sales'],
    lastMessage: 'Neelu: Reviewed — looks good, approve the top 10.',
    timestamp: '2026-06-02T12:15:00Z',
    messages: [
      { role: 'user', name: 'Divya', time: '11:40 AM', content: 'Shared the targeting list draft. Please review.' },
      { role: 'user', name: 'Neelu', time: '11:52 AM', content: 'Looking now — I will flag the top accounts.' },
      { role: 'agent', name: 'Sales', time: '12:05 PM', content: 'Added scores and tags to the list.' },
      { role: 'user', name: 'Neelu', time: '12:15 PM', content: 'Reviewed — looks good, approve the top 10.' },
    ],
  },
];

export const sampleNotifications: Notification[] = [
  { id: 'notif-001', type: 'approval', title: 'Approval Required', message: 'Finance needs your approval for vendor payment batch totaling $127,450. 3 invoices pending.', timestamp: '2026-06-02T11:00:00Z', read: false, workflowId: 'wf-003', priority: 'high' },
  { id: 'notif-002', type: 'error', title: 'Workflow Blocked', message: 'Customer escalation TK-4521 is blocked. SLA breach in 2 hours. Immediate action required.', timestamp: '2026-06-02T10:15:00Z', read: false, workflowId: 'wf-004', priority: 'high' },
  { id: 'notif-003', type: 'completion', title: 'Workflow Completed', message: 'Sales completed the Q2 Sales Pipeline Review. Report available in Reports dashboard.', timestamp: '2026-06-02T09:45:00Z', read: false, workflowId: 'wf-007', priority: 'low' },
  { id: 'notif-004', type: 'mention', title: 'You were mentioned', message: 'Neelu mentioned you in the Lead Campaign thread: "@Divya can you review the targeting list?"', timestamp: '2026-06-02T09:30:00Z', read: true, workflowId: 'wf-001', priority: 'medium' },
  { id: 'notif-005', type: 'assignment', title: 'Task Assigned to You', message: 'Support assigned "Review customer complaint response draft" to you. Due in 1 hour.', timestamp: '2026-06-02T09:00:00Z', read: true, taskId: 'task-004', priority: 'high' },
  { id: 'notif-006', type: 'reminder', title: 'Workflow Scheduled', message: 'Marketing will begin the Q3 Competitor Analysis at 3:00 PM today. You\'ll receive updates every 30 minutes.', timestamp: '2026-06-02T08:00:00Z', read: true, workflowId: 'wf-005', priority: 'low' },
  { id: 'notif-007', type: 'completion', title: 'Expense Report Complete', message: 'Finance has finished reconciling May 2026 expenses. Total: $284,392. Variance: +$2,140 from budget.', timestamp: '2026-06-01T16:00:00Z', read: true, workflowId: 'wf-009', priority: 'low' },
];

export const sampleUsers: User[] = [
  { id: 'user-001', name: 'Kumar', email: 'kumar@manexa.ai', role: 'super-admin', department: 'Executive', status: 'active', avatar: 'KU', joinedAt: '2024-01-15', lastSeen: '2026-06-02T11:30:00Z', workflowsCreated: 198, tasksCompleted: 784 },
  { id: 'user-002', name: 'Suresh', email: 'suresh@manexa.ai', role: 'business-admin', department: 'Platform', status: 'active', avatar: 'SU', joinedAt: '2024-03-01', lastSeen: '2026-06-02T11:15:00Z', workflowsCreated: 173, tasksCompleted: 640 },
  { id: 'user-003', name: 'Praveena', email: 'praveena@manexa.ai', role: 'manager', department: 'Business', status: 'active', avatar: 'PR', joinedAt: '2024-04-15', lastSeen: '2026-06-02T10:45:00Z', workflowsCreated: 141, tasksCompleted: 552 },
  { id: 'user-004', name: 'Abhi', email: 'abhi@manexa.ai', role: 'employee', department: 'Business', status: 'active', avatar: 'AB', joinedAt: '2024-06-01', lastSeen: '2026-06-02T11:00:00Z', workflowsCreated: 84, tasksCompleted: 306 },
  { id: 'user-005', name: 'Neelu', email: 'neelu@manexa.ai', role: 'manager', department: 'Business', status: 'active', avatar: 'NE', joinedAt: '2024-08-15', lastSeen: '2026-06-02T10:30:00Z', workflowsCreated: 120, tasksCompleted: 498 },
  { id: 'user-006', name: 'Ramesh', email: 'ramesh@manexa.ai', role: 'employee', department: 'Business', status: 'active', avatar: 'RA', joinedAt: '2024-09-02', lastSeen: '2026-06-02T09:20:00Z', workflowsCreated: 63, tasksCompleted: 214 },
  { id: 'user-007', name: 'Swapna', email: 'swapna@manexa.ai', role: 'employee', department: 'Business', status: 'active', avatar: 'SW', joinedAt: '2024-09-18', lastSeen: '2026-06-02T08:55:00Z', workflowsCreated: 57, tasksCompleted: 201 },
];
