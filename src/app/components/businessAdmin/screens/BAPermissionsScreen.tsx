import React from 'react';
import { Shield, Lock, Database, Mail, DollarSign, Settings, Search, FileText, Calendar, Edit } from 'lucide-react';
import { BAScreen, agentConfigs, connectors } from '../businessAdminData';

interface BAPermissionsScreenProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

const dataColumns = ['CRM', 'Email', 'HR Records', 'Financial', 'IT/DevOps', 'Research/Web', 'Calendar', 'Docs'];

const agentDataAccess: Record<string, string[]> = {
  Command:  ['CRM', 'Email', 'HR Records', 'Financial', 'IT/DevOps', 'Research/Web', 'Calendar', 'Docs'],
  Sales:   ['CRM', 'Email', 'Calendar'],
  HR:    ['HR Records', 'Calendar'],
  Finance:  ['Financial'],
  DevOps:    ['IT/DevOps'],
  Support:    ['CRM'],
  Marketing:   ['Research/Web', 'Docs'],
};

const Check = ({ has }: { has: boolean }) =>
  has
    ? <div className="flex items-center justify-center"><span className="text-green-600 font-bold">✓</span></div>
    : <div className="flex items-center justify-center"><span className="text-muted-foreground/30">—</span></div>;

const agentColorMap: Record<string, string> = {
  Command: '#5C5FEF', Sales: '#0EA5E9', HR: '#10B981',
  Finance: '#F59E0B', DevOps: '#8B5CF6', Support: '#EC4899', Marketing: '#06B6D4',
};

const agentEmojis: Record<string, string> = {
  Command: '⚡', Sales: '📈', HR: '👥', Finance: '💳', DevOps: '⚙️', Support: '🎯', Marketing: '🔬',
};

export function BAPermissionsScreen({ onNavigate }: BAPermissionsScreenProps) {
  const specialistAgents = agentConfigs.filter(a => a.type !== 'super');
  const allAgents = agentConfigs;

  const policies = [
    {
      icon: Shield,
      color: '#EF4444',
      title: 'Approval Gates',
      desc: 'All financial actions >$10k require CFO approval. Discounts >10% require manager approval. Email sends to external domains require user confirmation.',
    },
    {
      icon: Database,
      color: '#8B5CF6',
      title: 'Data Retention',
      desc: 'Agent conversation logs retained 90 days. Audit logs retained 2 years. PII automatically redacted from logs after 30 days.',
    },
    {
      icon: Lock,
      color: '#F59E0B',
      title: 'PII Handling',
      desc: 'No PII stored in agent memory between sessions. All email reads require explicit user consent. HR records accessible only by HR and authorized managers.',
    },
    {
      icon: Settings,
      color: '#0EA5E9',
      title: 'Rate Limiting',
      desc: 'Per-agent hourly limits enforced at platform level. Automatic throttle at 90% utilization. LinkedIn API: 50 calls/day hard limit due to rate-limited status.',
    },
  ];

  const connectorGrants = connectors.filter(c => c.status === 'connected' && c.agentsUsing.length > 0).slice(0, 6);

  return (
    <div className="h-full overflow-y-auto bg-background">
      <div className="p-6 space-y-6">
        {/* Agent Data Access Matrix */}
        <section className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Agent Data Access Matrix</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Which data sources each agent can read or write</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground w-36">Agent</th>
                  {dataColumns.map(col => (
                    <th key={col} className="text-center px-3 py-3 text-xs font-semibold text-muted-foreground">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allAgents.map((agent, i) => {
                  const access = agentDataAccess[agent.name] || [];
                  return (
                    <tr key={agent.id} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ background: agentColorMap[agent.name] + '20' }}>
                            {agentEmojis[agent.name]}
                          </div>
                          <span className="text-xs font-semibold text-foreground">{agent.name}</span>
                        </div>
                      </td>
                      {dataColumns.map(col => (
                        <td key={col} className="px-3 py-3 text-center">
                          <Check has={access.includes(col)} />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Access Policies */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Access Policies</h2>
          <div className="grid grid-cols-2 gap-4">
            {policies.map(policy => {
              const Icon = policy.icon;
              return (
                <div key={policy.title} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: policy.color + '15' }}>
                        <Icon className="w-4 h-4" style={{ color: policy.color }} />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{policy.title}</h3>
                    </div>
                    <button className="flex items-center gap-1 px-2.5 py-1 border border-border rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">
                      <Edit className="w-3 h-3" />
                      Edit
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{policy.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Connector Permission Grants */}
        <section className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Connector Permission Grants</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Which agents have read/write access to each connector</p>
          </div>
          <div className="divide-y divide-border">
            {connectorGrants.map(connector => (
              <div key={connector.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg flex-shrink-0">
                  {connector.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground">{connector.name}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{connector.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {connector.scopes.slice(0, 4).map(scope => (
                      <span key={scope} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{scope}</span>
                    ))}
                    {connector.scopes.length > 4 && (
                      <span className="text-xs text-muted-foreground">+{connector.scopes.length - 4} more</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 justify-end flex-shrink-0">
                  {connector.agentsUsing.map(agentName => (
                    <span key={agentName} className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: agentColorMap[agentName] || '#94A3B8' }}>
                      {agentName}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
