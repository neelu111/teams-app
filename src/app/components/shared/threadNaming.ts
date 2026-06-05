// Intelligent thread title generation based on message content
const actionKeywords: Record<string, string[]> = {
  review: ['review', 'check', 'analyze', 'examine', 'verify', 'validate', 'inspect'],
  approve: ['approve', 'authorize', 'confirm', 'accept', 'sign off'],
  create: ['create', 'generate', 'build', 'setup', 'initialize', 'launch'],
  update: ['update', 'modify', 'change', 'edit', 'revise', 'adjust'],
  send: ['send', 'share', 'deliver', 'dispatch', 'transmit', 'mail'],
  schedule: ['schedule', 'book', 'plan', 'arrange', 'set', 'calendar'],
  fix: ['fix', 'resolve', 'repair', 'troubleshoot', 'debug', 'solve'],
  report: ['report', 'summary', 'analysis', 'findings', 'results', 'overview'],
};

const domainKeywords: Record<string, string[]> = {
  sales: ['lead', 'email', 'crm', 'hubspot', 'prospect', 'deal', 'pipeline', 'campaign', 'outreach', 'customer'],
  finance: ['invoice', 'payment', 'expense', 'budget', 'vendor', 'reconcil', 'transaction', 'cost', 'revenue'],
  hr: ['employee', 'onboard', 'hire', 'recruitment', 'payroll', 'benefit', 'leave', 'performance', 'review', 'training'],
  support: ['ticket', 'issue', 'problem', 'error', 'bug', 'troubleshoot', 'sla', 'escalat', 'urgent'],
  marketing: ['campaign', 'content', 'event', 'brand', 'strategy', 'analytics', 'social', 'messaging', 'market'],
  devops: ['deploy', 'server', 'database', 'infra', 'git', 'build', 'test', 'release', 'pipeline', 'config'],
};

interface TitleContext {
  mention?: string;
  action?: string;
  domain?: string;
  keywords?: string[];
}

function extractContext(text: string): TitleContext {
  const lower = text.toLowerCase();
  const context: TitleContext = {};

  // Extract mentioned agent/domain
  const mentionMatch = text.match(/@(\w+)/);
  if (mentionMatch) {
    context.mention = mentionMatch[1];
  }

  // Detect domain from keywords
  for (const [domain, words] of Object.entries(domainKeywords)) {
    if (words.some(word => lower.includes(word))) {
      context.domain = domain;
      context.keywords = words.filter(word => lower.includes(word));
      break;
    }
  }

  // Detect action verb
  for (const [action, verbs] of Object.entries(actionKeywords)) {
    if (verbs.some(verb => lower.includes(verb))) {
      context.action = action;
      break;
    }
  }

  return context;
}

function buildTitle(context: TitleContext, text: string): string {
  const lower = text.toLowerCase();
  let title = '';

  // Priority 1: Specific mention-based titles
  if (context.mention) {
    const mentionMap: Record<string, string> = {
      sales: 'Sales Request',
      finance: 'Finance Request',
      hr: 'HR Request',
      support: 'Support Request',
      marketing: 'Marketing Request',
      devops: 'DevOps Request',
      command: 'AI Assistance',
    };
    if (mentionMap[context.mention.toLowerCase()]) {
      return mentionMap[context.mention.toLowerCase()];
    }
  }

  // Priority 2: Action + Domain combo
  if (context.action && context.domain) {
    const domainNames: Record<string, string> = {
      sales: 'Sales',
      finance: 'Finance',
      hr: 'HR',
      support: 'Support',
      marketing: 'Marketing',
      devops: 'DevOps',
    };
    const actionNames: Record<string, string> = {
      review: 'Review',
      approve: 'Approval',
      create: 'Setup',
      update: 'Update',
      send: 'Send',
      schedule: 'Schedule',
      fix: 'Resolve',
      report: 'Report',
    };
    if (actionNames[context.action] && domainNames[context.domain]) {
      return `${actionNames[context.action]} — ${domainNames[context.domain]}`;
    }
  }

  // Priority 3: Domain-specific keywords
  if (context.domain && context.keywords && context.keywords.length > 0) {
    const keyword = context.keywords[0];
    const keywordTitles: Record<string, string> = {
      lead: 'Lead Email Review',
      invoice: 'Invoice Processing',
      employee: 'Employee Onboarding',
      ticket: 'Support Ticket',
      campaign: 'Campaign Management',
      deploy: 'Deployment Request',
      vendor: 'Vendor Management',
      proposal: 'Proposal Generation',
      analysis: 'Market Analysis',
    };
    if (keywordTitles[keyword]) {
      return keywordTitles[keyword];
    }
  }

  // Priority 4: Extract first meaningful phrase
  const words = text.split(/\s+/).filter(w => w.length > 3 && w !== 'from' && w !== 'with');
  if (words.length > 0) {
    // Capitalize first 2-3 words as title
    const titleWords = words.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    title = titleWords.join(' ');
    if (title.length > 40) {
      title = titleWords.slice(0, 2).join(' ');
    }
  }

  // Fallback: use first 40 chars
  if (!title) {
    title = text.slice(0, 40) + (text.length > 40 ? '...' : '');
  }

  return title;
}

export function generateThreadTitle(userMessage: string): string {
  if (!userMessage || userMessage.trim().length === 0) {
    return 'New Thread';
  }

  const context = extractContext(userMessage);
  return buildTitle(context, userMessage);
}
