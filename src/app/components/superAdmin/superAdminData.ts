export type SAScreen =
  | 'dashboard' | 'agent-oversight' | 'platform-config'
  | 'tenants' | 'users' | 'billing' | 'security' | 'audit' | 'reports';

export const platformMetrics = {
  totalTenants: 12, activeTenants: 11, totalUsers: 847, activeUsers: 691,
  totalAgents: 84, activeAgents: 79, totalWorkflowsToday: 1240,
  platformUptime: 99.99, avgResponseTime: '1.3s',
  apiCallsToday: 284200, totalApiCallsMTD: 4820000,
  hoursAutomatedMTD: 14820, errorRate: 0.8,
  modelCostMTD: 18420.50, revenueMMR: 52400, revenueARR: 628800,
  hourlyActivity: [
    { time: '8AM', calls: 8400 }, { time: '9AM', calls: 21200 },
    { time: '10AM', calls: 38400 }, { time: '11AM', calls: 47800 },
    { time: '12PM', calls: 31400 }, { time: '1PM', calls: 28200 },
    { time: '2PM', calls: 42100 }, { time: '3PM', calls: 51800 },
    { time: '4PM', calls: 37200 },
  ],
  weeklyWorkflows: [
    { day: 'Mon', success: 1082, failed: 28, blocked: 14 },
    { day: 'Tue', success: 1248, failed: 31, blocked: 18 },
    { day: 'Wed', success: 1394, failed: 24, blocked: 12 },
    { day: 'Thu', success: 1180, failed: 35, blocked: 22 },
    { day: 'Fri', success: 1240, failed: 28, blocked: 16 },
  ],
  modelUsage: [
    { model: 'Claude Opus 4.7',   calls: 84200,  cost: 12840.50 },
    { model: 'Claude Sonnet 4.6', calls: 148400, cost: 4820.00 },
    { model: 'Claude Haiku 4.5',  calls: 51600,  cost: 760.00 },
  ],
};

export type TenantStatus = 'active' | 'suspended' | 'trial' | 'churned' | 'pending';
export type TenantPlan = 'starter' | 'business' | 'enterprise' | 'enterprise-plus';

export interface Tenant {
  id: string; name: string; domain: string; logo: string;
  plan: TenantPlan; status: TenantStatus;
  users: number; agents: number; activeAgents: number;
  workflowsToday: number; apiCallsMTD: number; mrr: number;
  joinedDate: string; lastActive: string; adminEmail: string;
  region: string; mfaCoverage: number; uptime: number; primaryColor: string;
}

export const tenants: Tenant[] = [
  { id: 'tn-001', name: 'Manexa AI Labs',   domain: 'manexa.ai',            logo: '🏢', plan: 'business',        status: 'active',    users: 11,  agents: 7,  activeAgents: 6,  workflowsToday: 84,  apiCallsMTD: 284000,   mrr: 1299, joinedDate: 'Jan 2024', lastActive: 'Just now',   adminEmail: 'suresh@manexa.ai',              region: 'US-East',   mfaCoverage: 100, uptime: 99.97, primaryColor: '#5C5FEF' },
  { id: 'tn-002', name: 'GlobalTech Inc',     domain: 'globaltech.io',        logo: '🌐', plan: 'enterprise',      status: 'active',    users: 142, agents: 12, activeAgents: 12, workflowsToday: 284, apiCallsMTD: 840000,   mrr: 4800, joinedDate: 'Mar 2024', lastActive: '2 min ago',  adminEmail: 'ops@globaltech.io',             region: 'US-West',   mfaCoverage: 94,  uptime: 99.99, primaryColor: '#0EA5E9' },
  { id: 'tn-003', name: 'MarketingStar Finance',   domain: 'novastar.finance',     logo: '⭐', plan: 'enterprise',      status: 'active',    users: 89,  agents: 9,  activeAgents: 9,  workflowsToday: 192, apiCallsMTD: 620000,   mrr: 4800, joinedDate: 'Feb 2024', lastActive: '5 min ago',  adminEmail: 'tech@novastar.finance',         region: 'US-East',   mfaCoverage: 100, uptime: 99.99, primaryColor: '#F59E0B' },
  { id: 'tn-004', name: 'Meridian Health',    domain: 'meridianhealth.org',   logo: '🏥', plan: 'enterprise-plus', status: 'active',    users: 214, agents: 18, activeAgents: 17, workflowsToday: 310, apiCallsMTD: 1280000,  mrr: 9600, joinedDate: 'Nov 2023', lastActive: '1 min ago',  adminEmail: 'cto@meridianhealth.org',        region: 'EU-West',   mfaCoverage: 100, uptime: 100,   primaryColor: '#10B981' },
  { id: 'tn-005', name: 'Apex Retail',        domain: 'apexretail.com',       logo: '🛍️', plan: 'business',        status: 'active',    users: 63,  agents: 7,  activeAgents: 6,  workflowsToday: 118, apiCallsMTD: 390000,   mrr: 1299, joinedDate: 'Apr 2024', lastActive: '10 min ago', adminEmail: 'admin@apexretail.com',          region: 'US-Central', mfaCoverage: 78,  uptime: 99.95, primaryColor: '#EC4899' },
  { id: 'tn-006', name: 'Pulse Analytics',    domain: 'pulseanalytics.ai',    logo: '📊', plan: 'starter',         status: 'trial',     users: 8,   agents: 3,  activeAgents: 3,  workflowsToday: 24,  apiCallsMTD: 48000,    mrr: 0,    joinedDate: 'Jun 2026', lastActive: '30 min ago', adminEmail: 'founder@pulseanalytics.ai',     region: 'US-East',   mfaCoverage: 50,  uptime: 99.80, primaryColor: '#8B5CF6' },
  { id: 'tn-007', name: 'Cascade Logistics',  domain: 'cascadelog.com',       logo: '🚚', plan: 'business',        status: 'active',    users: 38,  agents: 5,  activeAgents: 5,  workflowsToday: 62,  apiCallsMTD: 210000,   mrr: 1299, joinedDate: 'May 2024', lastActive: '15 min ago', adminEmail: 'it@cascadelog.com',             region: 'US-West',   mfaCoverage: 71,  uptime: 99.91, primaryColor: '#06B6D4' },
  { id: 'tn-008', name: 'Solaris Energy',     domain: 'solarisenergy.com',    logo: '☀️', plan: 'enterprise',      status: 'active',    users: 94,  agents: 8,  activeAgents: 8,  workflowsToday: 148, apiCallsMTD: 520000,   mrr: 4800, joinedDate: 'Jan 2024', lastActive: '8 min ago',  adminEmail: 'sysadmin@solarisenergy.com',    region: 'EU-West',   mfaCoverage: 88,  uptime: 99.97, primaryColor: '#F97316' },
  { id: 'tn-009', name: 'BlueRidge Capital',  domain: 'blueridgecap.com',     logo: '💼', plan: 'enterprise',      status: 'active',    users: 56,  agents: 6,  activeAgents: 6,  workflowsToday: 82,  apiCallsMTD: 310000,   mrr: 4800, joinedDate: 'Feb 2024', lastActive: '20 min ago', adminEmail: 'ops@blueridgecap.com',          region: 'US-East',   mfaCoverage: 96,  uptime: 99.98, primaryColor: '#5C5FEF' },
  { id: 'tn-010', name: 'Nimbus Cloud',       domain: 'nimbuscloud.io',       logo: '☁️', plan: 'starter',         status: 'active',    users: 12,  agents: 3,  activeAgents: 3,  workflowsToday: 18,  apiCallsMTD: 62000,    mrr: 399,  joinedDate: 'May 2026', lastActive: '1 hr ago',   adminEmail: 'admin@nimbuscloud.io',          region: 'AP-South',  mfaCoverage: 33,  uptime: 99.70, primaryColor: '#0EA5E9' },
  { id: 'tn-011', name: 'Frontier Labs',      domain: 'frontierlabs.dev',     logo: '🔬', plan: 'business',        status: 'suspended', users: 24,  agents: 4,  activeAgents: 0,  workflowsToday: 0,   apiCallsMTD: 0,        mrr: 0,    joinedDate: 'Mar 2024', lastActive: 'Jun 1',      adminEmail: 'ceo@frontierlabs.dev',         region: 'US-West',   mfaCoverage: 50,  uptime: 0,     primaryColor: '#EF4444' },
  { id: 'tn-012', name: 'PeakFlow Media',     domain: 'peakflow.media',       logo: '📺', plan: 'starter',         status: 'churned',   users: 0,   agents: 0,  activeAgents: 0,  workflowsToday: 0,   apiCallsMTD: 0,        mrr: 0,    joinedDate: 'Oct 2023', lastActive: 'Apr 2026',   adminEmail: 'billing@peakflow.media',       region: 'US-East',   mfaCoverage: 0,   uptime: 0,     primaryColor: '#94A3B8' },
];

export const planLimits = [
  { plan: 'starter',         label: 'Starter',          color: '#94A3B8', users: 10,  agents: 3,  apiCallsMTD: 50000,    price: 399,  tenantCount: 2 },
  { plan: 'business',        label: 'Business',         color: '#10B981', users: 100, agents: 10, apiCallsMTD: 500000,   price: 1299, tenantCount: 5 },
  { plan: 'enterprise',      label: 'Enterprise',       color: '#0EA5E9', users: 250, agents: 20, apiCallsMTD: 2000000,  price: 4800, tenantCount: 4 },
  { plan: 'enterprise-plus', label: 'Enterprise Plus',  color: '#5C5FEF', users: -1,  agents: -1, apiCallsMTD: -1,       price: 9600, tenantCount: 1 },
];

export const featureFlags = [
  { id: 'ff-001', name: 'Multi-Agent Orchestration', enabled: true,  plans: ['business','enterprise','enterprise-plus'], description: 'Allow Command to coordinate multiple specialist agents in a single workflow', usingTenants: 8 },
  { id: 'ff-002', name: 'Custom Agent Creation',      enabled: true,  plans: ['enterprise','enterprise-plus'],            description: 'Allow tenants to create custom specialist agents beyond the default set', usingTenants: 5 },
  { id: 'ff-003', name: 'Webhook Connectors',         enabled: true,  plans: ['business','enterprise','enterprise-plus'], description: 'Allow tenants to configure custom webhook-based connectors', usingTenants: 6 },
  { id: 'ff-004', name: 'Bulk SMS Capability',        enabled: false, plans: ['enterprise-plus'],                         description: 'Enable WhatsApp/SMS bulk messaging capability', usingTenants: 0 },
  { id: 'ff-005', name: 'AI Model Selection',         enabled: true,  plans: ['enterprise','enterprise-plus'],            description: 'Allow tenant admins to choose the Claude model per agent', usingTenants: 5 },
  { id: 'ff-006', name: 'Audit Export API',           enabled: true,  plans: ['enterprise','enterprise-plus'],            description: 'REST API for tenants to export audit logs to their own SIEM', usingTenants: 4 },
  { id: 'ff-007', name: 'SSO (SAML 2.0)',             enabled: true,  plans: ['enterprise','enterprise-plus'],            description: 'SAML 2.0 / OIDC SSO integration for enterprise identity providers', usingTenants: 5 },
  { id: 'ff-008', name: 'Data Residency (EU)',        enabled: true,  plans: ['enterprise-plus'],                         description: 'Enforce data residency in EU-West region for GDPR compliance', usingTenants: 2 },
  { id: 'ff-009', name: 'Cross-Thread Audit Linking', enabled: true,  plans: ['business','enterprise','enterprise-plus'], description: 'Persist relationship between specialist thread updates and manager/user threads', usingTenants: 9 },
  { id: 'ff-010', name: 'Human Dependency Escalation Policies', enabled: true, plans: ['enterprise','enterprise-plus'], description: 'Tenant-level escalation templates for no-response reminders and manager escalation', usingTenants: 4 },
];

export const modelPolicies = [
  { modelId: 'claude-opus-4-7',           label: 'Claude Opus 4.7',   enabled: true,  maxTokens: 32768, rateLimit: 1000,  costPerMToken: 15.00, plans: ['enterprise','enterprise-plus'],            calls: 84200,  cost: 12840.50 },
  { modelId: 'claude-sonnet-4-6',         label: 'Claude Sonnet 4.6', enabled: true,  maxTokens: 8192,  rateLimit: 5000,  costPerMToken: 3.00,  plans: ['business','enterprise','enterprise-plus'],  calls: 148400, cost: 4820.00 },
  { modelId: 'claude-haiku-4-5-20251001', label: 'Claude Haiku 4.5',  enabled: true,  maxTokens: 4096,  rateLimit: 20000, costPerMToken: 0.25,  plans: ['starter','business','enterprise','enterprise-plus'], calls: 51600, cost: 760.00 },
];

export const securityEvents = [
  { id: 'se-009', time: '12:18 PM', tenant: 'GlobalTech Inc',  severity: 'warning',  event: 'Cross-region data route blocked by residency policy', actor: 'System Policy Engine', ip: 'n/a' },
  { id: 'se-010', time: '12:16 PM', tenant: 'Manexa AI Labs',  severity: 'info',     event: 'Manager-to-employee delegation audit chain verified', actor: 'Command (Agent)', ip: 'n/a' },
  { id: 'se-001', time: '12:12 PM', tenant: 'Manexa AI Labs',  severity: 'critical', event: 'Account locked after 5 failed login attempts', actor: 'swapna@manexa.ai',          ip: '192.168.1.45' },
  { id: 'se-002', time: '11:55 AM', tenant: 'Manexa AI Labs',  severity: 'warning',  event: 'LinkedIn API rate limit reached',               actor: 'Marketing Agent',                ip: 'n/a' },
  { id: 'se-003', time: '11:40 AM', tenant: 'Manexa AI Labs',  severity: 'warning',  event: 'Capability policy bypass attempt blocked',       actor: 'Sales Agent',                ip: 'n/a' },
  { id: 'se-004', time: '10:15 AM', tenant: 'Manexa AI Labs',  severity: 'warning',  event: 'Unusual API volume — 3× above baseline',         actor: 'Marketing Agent',                ip: 'n/a' },
  { id: 'se-005', time: '9:48 AM',  tenant: 'GlobalTech Inc',  severity: 'info',     event: 'New admin user invited',                         actor: 'priya.s@globaltech.io',     ip: '10.12.0.4' },
  { id: 'se-006', time: '9:20 AM',  tenant: 'Meridian Health', severity: 'info',     event: 'SSO policy updated — MFA enforced',              actor: 'elena.r@meridianhealth.org',ip: '172.16.0.1' },
  { id: 'se-007', time: '8:45 AM',  tenant: 'Frontier Labs',   severity: 'critical', event: 'Tenant suspended — payment failure (3rd attempt)',actor: 'System',                   ip: 'n/a' },
  { id: 'se-008', time: '8:00 AM',  tenant: 'Platform',        severity: 'info',     event: 'Daily security scan complete — no issues found', actor: 'System',                    ip: 'n/a' },
];

export const billingData = {
  mrr: 52400, arr: 628800, growth: 12.4, churnRate: 1.8,
  avgRevenuePerAccount: 4367, modelCostMTD: 18420.50, grossMargin: 64.8,
  revenueGrowth: [
    { month: 'Jan', mrr: 32000, cost: 11200 }, { month: 'Feb', mrr: 38400, cost: 13440 },
    { month: 'Mar', mrr: 41200, cost: 14420 }, { month: 'Apr', mrr: 44800, cost: 15680 },
    { month: 'May', mrr: 48200, cost: 16870 }, { month: 'Jun', mrr: 52400, cost: 18420 },
  ],
  mrrByPlan: [
    { plan: 'Enterprise Plus', mrr: 19200, tenants: 2,  color: '#5C5FEF' },
    { plan: 'Enterprise',      mrr: 24000, tenants: 4,  color: '#0EA5E9' },
    { plan: 'Business',        mrr: 7794,  tenants: 6,  color: '#10B981' },
    { plan: 'Starter (paid)',  mrr: 399,   tenants: 1,  color: '#F59E0B' },
    { plan: 'Trial (free)',    mrr: 0,     tenants: 1,  color: '#94A3B8' },
  ],
  invoices: [
    { month: 'Jun 2026', revenue: 52400, costs: 18420, margin: 64.8, status: 'pending' },
    { month: 'May 2026', revenue: 48200, costs: 16870, margin: 65.0, status: 'paid' },
    { month: 'Apr 2026', revenue: 44800, costs: 15680, margin: 65.0, status: 'paid' },
    { month: 'Mar 2026', revenue: 41200, costs: 14420, margin: 65.0, status: 'paid' },
    { month: 'Feb 2026', revenue: 38400, costs: 13440, margin: 65.0, status: 'paid' },
  ],
};

export const platformAuditLogs = [
  { id: 'pal-011', time: '12:18 PM', tenant: 'Platform',        actor: 'System',       action: 'Policy rollout',            severity: 'info',     detail: 'Cross-thread audit linking policy enabled for business+ plans across 9 tenants' },
  { id: 'pal-012', time: '12:16 PM', tenant: 'GlobalTech Inc',  actor: 'System',       action: 'Residency enforcement',     severity: 'warning',  detail: 'Blocked workflow event replication to non-EU region due to Data Residency policy' },
  { id: 'pal-013', time: '12:15 PM', tenant: 'Manexa AI Labs',  actor: 'Command (Agent)',action: 'Delegation chain logged',   severity: 'info',     detail: 'Manager assignment -> employee action -> specialist update chain validated and stored for audit export API' },
  { id: 'pal-001', time: '12:12 PM', tenant: 'Manexa AI Labs',  actor: 'System',        action: 'Account locked',         severity: 'critical', detail: 'swapna@manexa.ai locked after 5 failed attempts from 192.168.1.45' },
  { id: 'pal-002', time: '11:55 AM', tenant: 'Manexa AI Labs',  actor: 'Marketing (Agent)',  action: 'Rate limit reached',      severity: 'warning',  detail: 'LinkedIn API at 100% daily limit — Marketing throttled for remainder of day' },
  { id: 'pal-003', time: '10:45 AM', tenant: 'Manexa AI Labs',  actor: 'Suresh',        action: 'User invited',            severity: 'info',     detail: 'dhathri@manexa.ai invited as employee (expires 7 days)' },
  { id: 'pal-004', time: '9:48 AM',  tenant: 'GlobalTech Inc',  actor: 'Priya Sharma',  action: 'New admin created',       severity: 'info',     detail: 'New business-admin user added to GlobalTech workspace' },
  { id: 'pal-005', time: '9:20 AM',  tenant: 'Meridian Health', actor: 'Elena Rossi',   action: 'SSO policy updated',      severity: 'info',     detail: 'MFA enforcement enabled for all users across Meridian Health' },
  { id: 'pal-006', time: '8:45 AM',  tenant: 'Frontier Labs',   actor: 'System',        action: 'Tenant suspended',        severity: 'critical', detail: 'Payment failed 3× — tenant access suspended automatically' },
  { id: 'pal-007', time: '8:30 AM',  tenant: 'Platform',        actor: 'Kumar',  action: 'Platform config updated', severity: 'info',     detail: 'Feature flag "Bulk SMS" disabled globally' },
  { id: 'pal-008', time: '8:00 AM',  tenant: 'Platform',        actor: 'System',        action: 'Daily security scan',     severity: 'info',     detail: 'All 11 active tenants scanned. No vulnerabilities detected.' },
  { id: 'pal-009', time: 'Jun 1',    tenant: 'PeakFlow Media',  actor: 'System',        action: 'Tenant churned',          severity: 'warning',  detail: 'Subscription cancelled. Data retention: 30 days.' },
  { id: 'pal-010', time: 'Jun 1',    tenant: 'Platform',        actor: 'Kumar',  action: 'Model policy updated',    severity: 'info',     detail: 'claude-opus-4-7 restricted to enterprise & enterprise-plus plans' },
];
