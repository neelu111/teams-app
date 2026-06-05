import React, { useState } from 'react';
import { Search, Plus, CheckCircle2, AlertCircle, RefreshCw, ExternalLink, MoreHorizontal, Plug } from 'lucide-react';
import { Screen } from '../types';

interface ConnectorsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const connectors = [
  { id: 'c1', name: 'HubSpot CRM', category: 'Sales', status: 'connected', lastSync: '2 min ago', agent: 'Sales', icon: '🟠', desc: 'Access leads, contacts, deals, and email tracking', workflows: 421, color: '#FF7A59' },
  { id: 'c2', name: 'Salesforce', category: 'Sales', status: 'connected', lastSync: '5 min ago', agent: 'Sales', icon: '☁️', desc: 'Sync opportunities, accounts, and pipeline data', workflows: 89, color: '#00A1E0' },
  { id: 'c3', name: 'Gmail / Google Workspace', category: 'Communication', status: 'connected', lastSync: '1 min ago', agent: 'Sales, HR', icon: '✉️', desc: 'Read, send, and organize emails via Gmail API', workflows: 234, color: '#EA4335' },
  { id: 'c4', name: 'QuickBooks Online', category: 'Finance', status: 'connected', lastSync: '10 min ago', agent: 'Finance', icon: '🟢', desc: 'Access invoices, expenses, and financial reports', workflows: 289, color: '#2CA01C' },
  { id: 'c5', name: 'BambooHR', category: 'HR', status: 'connected', lastSync: '15 min ago', agent: 'HR', icon: '🟤', desc: 'Employee records, onboarding, and leave management', workflows: 156, color: '#79B43C' },
  { id: 'c6', name: 'Zendesk', category: 'Support', status: 'connected', lastSync: '3 min ago', agent: 'Support', icon: '💚', desc: 'Customer tickets, SLA monitoring, and escalations', workflows: 634, color: '#03363D' },
  { id: 'c7', name: 'Stripe', category: 'Finance', status: 'connected', lastSync: '30 min ago', agent: 'Finance', icon: '💜', desc: 'Payment processing, subscriptions, and billing data', workflows: 67, color: '#635BFF' },
  { id: 'c8', name: 'ServiceNow', category: 'Operations', status: 'connected', lastSync: '1 hr ago', agent: 'DevOps', icon: '🔴', desc: 'IT service management, incidents, and changes', workflows: 198, color: '#E8170B' },
  { id: 'c9', name: 'Perplexity AI', category: 'Research', status: 'connected', lastSync: '45 min ago', agent: 'Marketing', icon: '🔵', desc: 'Real-time web research and information synthesis', workflows: 156, color: '#20808D' },
  { id: 'c10', name: 'LinkedIn Sales Nav', category: 'Sales', status: 'disconnected', lastSync: 'Never', agent: 'Sales', icon: '💙', desc: 'Access prospect profiles and InMail messaging', workflows: 0, color: '#0077B5' },
  { id: 'c11', name: 'Slack', category: 'Communication', status: 'connected', lastSync: 'Real-time', agent: 'All Agents', icon: '🟣', desc: 'Post messages, manage channels, and receive events', workflows: 312, color: '#4A154B' },
  { id: 'c12', name: 'Workday', category: 'HR', status: 'error', lastSync: '2 hr ago', agent: 'HR', icon: '🟡', desc: 'Enterprise HR, payroll, and workforce planning', workflows: 45, color: '#F0AB00' },
];

const categories = ['All', 'Sales', 'Finance', 'HR', 'Support', 'Operations', 'Research', 'Communication'];

export function ConnectorsScreen({ onNavigate }: ConnectorsScreenProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = connectors.filter(c =>
    (category === 'All' || c.category === category) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const connected = connectors.filter(c => c.status === 'connected').length;
  const errored = connectors.filter(c => c.status === 'error').length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> <strong>{connected}</strong> Connected</span>
            {errored > 0 && <span className="flex items-center gap-1.5 text-red-600"><AlertCircle className="w-4 h-4" /> <strong>{errored}</strong> Error</span>}
            <span className="text-muted-foreground">{connectors.length - connected - errored} Disconnected</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
            <Plus className="w-4 h-4" /> Add Connector
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 overflow-x-auto">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${category === c ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative ml-auto">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search connectors..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none w-48" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-4">
          {filtered.map(c => (
            <div key={c.id} className="bg-white border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    c.status === 'connected' ? 'bg-green-50 text-green-700' :
                    c.status === 'error' ? 'bg-red-50 text-red-700' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'connected' ? 'bg-green-500' : c.status === 'error' ? 'bg-red-500' : 'bg-gray-400'}`} />
                    {c.status === 'connected' ? 'Connected' : c.status === 'error' ? 'Error' : 'Disconnected'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{c.desc}</p>

              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                <span>Agent: <strong className="text-foreground">{c.agent}</strong></span>
                <span>{c.workflows} workflows</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {c.status === 'connected' ? `Synced ${c.lastSync}` : c.status === 'error' ? '⚠ Sync failed' : 'Not connected'}
                </span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {c.status === 'connected' && (
                    <button className="p-1 rounded hover:bg-muted transition-colors">
                      <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <button className="text-xs px-2 py-1 rounded border border-border hover:bg-muted transition-colors font-medium">
                    {c.status === 'connected' ? 'Manage' : 'Connect'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add More */}
          <button className="bg-muted/30 border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-muted/50 transition-all min-h-[160px]">
            <div className="w-10 h-10 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Add Custom Connector</span>
            <span className="text-xs text-muted-foreground/70">REST API, Webhook, or OAuth</span>
          </button>
        </div>
      </div>
    </div>
  );
}
