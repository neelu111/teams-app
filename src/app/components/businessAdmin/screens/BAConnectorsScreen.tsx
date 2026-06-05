import React, { useState } from 'react';
import {
  Search, Plus, X, ChevronDown, Lock, AlertTriangle, RefreshCw,
  Eye, Wifi, WifiOff, Clock, Zap, Activity, Settings, Shield,
  RotateCcw, Trash2, Bell, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { BAScreen, connectors, Connector, ConnectorStatus } from '../businessAdminData';

interface BAConnectorsScreenProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

type ConnectorTab = 'overview' | 'scopes' | 'health' | 'settings';

const STATUS_CONFIG: Record<ConnectorStatus, { label: string; className: string }> = {
  connected:    { label: 'Connected',     className: 'bg-green-100 text-green-700' },
  error:        { label: 'Error',         className: 'bg-red-100 text-red-700' },
  'rate-limited':{ label: 'Rate Limited', className: 'bg-amber-100 text-amber-700' },
  disconnected: { label: 'Disconnected',  className: 'bg-gray-100 text-gray-500' },
  pending:      { label: 'Pending',       className: 'bg-blue-100 text-blue-700' },
};

const AUTH_LABEL: Record<string, string> = {
  oauth2:  'OAuth2',
  'api-key': 'API Key',
  basic:   'Basic',
  webhook: 'Webhook',
};

const CATEGORIES = ['All', 'CRM', 'Communication', 'Finance', 'HR', 'Productivity', 'IT', 'Marketing'] as const;

function StatusBadge({ status }: { status: ConnectorStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.label}
    </span>
  );
}

function AuthBadge({ authType }: { authType: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
      {AUTH_LABEL[authType] ?? authType}
    </span>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ connector }: { connector: Connector }) {
  const isConnected    = connector.status === 'connected';
  const isError        = connector.status === 'error';
  const isDisconnected = connector.status === 'disconnected';
  const isRateLimited  = connector.status === 'rate-limited';

  const agentColors: Record<string, string> = {
    Sales:  '#0EA5E9', Command: '#5C5FEF', HR:  '#10B981',
    Finance: '#F59E0B', DevOps:  '#8B5CF6',  Support:  '#EC4899', Marketing: '#06B6D4',
  };

  return (
    <div className="space-y-5">
      {/* Error banner for error state */}
      {isError && (
        <div className="flex items-start gap-3 p-3.5 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-700">Connection Error</p>
            <p className="text-xs text-red-600 mt-0.5">
              {connector.name === 'QuickBooks'
                ? '14 errors in last 2 hours — 503 Service Unavailable. QuickBooks may be experiencing an outage.'
                : `${connector.errors} error${connector.errors !== 1 ? 's' : ''} detected. Check credentials or service status.`}
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
              <RotateCcw className="w-3 h-3" /> Retry
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
              <Eye className="w-3 h-3" /> View Errors
            </button>
          </div>
        </div>
      )}

      {/* Rate-limited banner */}
      {isRateLimited && (
        <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-700">Rate Limit Warning</p>
            <p className="text-xs text-amber-600 mt-0.5">94% of daily limit used. Requests may be throttled until reset.</p>
          </div>
        </div>
      )}

      {/* Connection details */}
      <div className="bg-background border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Connection Details</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Connected By</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{connector.connectedBy ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Connected On</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{connector.connectedAt ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last Sync</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{connector.lastSync ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Auth Type</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{AUTH_LABEL[connector.authType]}</p>
          </div>
        </div>
      </div>

      {/* Usage stats */}
      {(isConnected || isError || isRateLimited) && (
        <div className="bg-background border border-border rounded-xl p-4">
          <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Usage Stats</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-foreground">{connector.apiCalls.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">API Calls Today</p>
            </div>
            <div>
              <p className={`text-xl font-bold ${connector.errors > 0 ? 'text-red-600' : 'text-foreground'}`}>{connector.errors}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Errors Today</p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{connector.latency ?? '—'}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Avg Latency</p>
            </div>
          </div>
        </div>
      )}

      {/* Agents using */}
      <div className="bg-background border border-border rounded-xl p-4">
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Agents Using</h4>
        {connector.agentsUsing.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {connector.agentsUsing.map(agent => (
              <span key={agent} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: agentColors[agent] ?? '#94A3B8' }}>
                {agent}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No agents are using this connector.</p>
        )}
      </div>

      {/* Disconnected: Connect CTA */}
      {isDisconnected && (
        <div className="bg-background border border-border rounded-xl p-5 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <WifiOff className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-foreground mb-1">Not Connected</p>
          <p className="text-xs text-muted-foreground mb-4">
            {connector.authType === 'oauth2'
              ? 'Click to authenticate via OAuth2. You will be redirected to the service login page.'
              : connector.authType === 'api-key'
              ? 'Enter your API key below to connect this service.'
              : 'Provide your credentials to establish a connection.'}
          </p>
          {connector.authType === 'api-key' && (
            <input
              type="text"
              placeholder="Enter API Key…"
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
          <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            {connector.authType === 'oauth2' ? 'Connect via OAuth2' : 'Connect'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Scopes Tab ───────────────────────────────────────────────────────────────

function ScopesTab({ connector }: { connector: Connector }) {
  const scopeUsage: Record<string, string> = {
    'contacts:read':       'CRM Read capability — read lead and contact data',
    'contacts:write':      'CRM Write capability — create/update contacts',
    'deals:read':          'Pipeline Analysis — read deal stage and value',
    'deals:write':         'Deal Forecasting — update deal stages',
    'reports:read':        'Reports — pull CRM reports',
    'gmail.readonly':      'Email Read — read inbox messages',
    'gmail.send':          'Email Send — send on behalf of user',
    'gmail.compose':       'Email Send — draft emails',
    'channels:read':       'Notifications — read Slack channels',
    'chat:write':          'Notifications — post messages to channels',
    'users:read':          'User lookup — resolve user identities',
    'calendar.readonly':   'Calendar Check — read free/busy',
    'calendar.events':     'Calendar Create — create/update events',
    'drive.readonly':      'Document Access — read files',
    'drive.file':          'Document Generation — create files',
    'accounting':          'Invoice Processing — access accounting data',
    'payments':            'Payment Initiation — initiate payments',
    'reports':             'Financial Reporting — pull finance reports',
    'read_write':          'Full API access for payments and subscriptions',
    'api':                 'Full Salesforce API access',
    'refresh_token':       'Persistent authentication via refresh token',
    'offline_access':      'Background sync without user session',
    'employees:read':      'HR Record Read — read employee profiles',
    'employees:write':     'HR Record Write — update employee data',
    'time_off:read':       'Leave Management — check time-off balances',
    'tickets:read':        'Ticket Create — read existing tickets',
    'tickets:write':       'Ticket Create — create and update tickets',
    'Mail.Read':           'Email Read — read inbox',
    'Mail.Send':           'Email Send — send messages',
    'Calendars.ReadWrite': 'Calendar Create — full calendar access',
    'messages':            'Bulk SMS — send messages to contacts',
    'contacts':            'Contact lookup — read contact list',
    'r_liteprofile':       'Profile Read — read basic profile info',
    'r_emailaddress':      'Email Read — read account email',
    'w_member_social':     'Social Post — post on behalf of user',
    'incident.read':       'Ticket Create — read IT incidents',
    'incident.write':      'Ticket Create — create/update incidents',
    'asset.read':          'Asset Tracking — read IT asset records',
  };

  return (
    <div className="space-y-5">
      <div>
        <h4 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Granted Scopes</h4>
        <div className="flex flex-wrap gap-2">
          {connector.scopes.map(scope => (
            <span key={scope}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              <Lock className="w-3 h-3 text-gray-400 flex-shrink-0" />
              {scope}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-gray-50">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Scope Usage</h4>
        </div>
        <div className="divide-y divide-border">
          {connector.scopes.map(scope => (
            <div key={scope} className="flex items-center gap-3 px-4 py-2.5">
              <code className="text-xs font-mono text-primary bg-primary/5 px-2 py-0.5 rounded w-48 flex-shrink-0 truncate">
                {scope}
              </code>
              <span className="text-xs text-muted-foreground">
                {scopeUsage[scope] ?? 'Internal use'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-border">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          <Trash2 className="w-4 h-4" />
          Revoke Access
        </button>
        <p className="text-xs text-muted-foreground mt-1.5">
          Revoking access will disconnect this connector and remove all granted permissions immediately.
        </p>
      </div>
    </div>
  );
}

// ─── Health Tab ───────────────────────────────────────────────────────────────

const LATENCY_HISTORY: Record<string, Array<{ hour: string; value: string }>> = {
  'cn-001': [{ hour: '7AM', value: '78ms' }, { hour: '8AM', value: '80ms' }, { hour: '9AM', value: '85ms' }, { hour: '10AM', value: '82ms' }, { hour: '11AM', value: '79ms' }, { hour: '12PM', value: '82ms' }],
  'cn-002': [{ hour: '7AM', value: '198ms' }, { hour: '8AM', value: '205ms' }, { hour: '9AM', value: '212ms' }, { hour: '10AM', value: '218ms' }, { hour: '11AM', value: '207ms' }, { hour: '12PM', value: '210ms' }],
  'cn-003': [{ hour: '7AM', value: '118ms' }, { hour: '8AM', value: '122ms' }, { hour: '9AM', value: '130ms' }, { hour: '10AM', value: '125ms' }, { hour: '11AM', value: '120ms' }, { hour: '12PM', value: '124ms' }],
  'cn-004': [{ hour: '7AM', value: '58ms' }, { hour: '8AM', value: '60ms' }, { hour: '9AM', value: '65ms' }, { hour: '10AM', value: '62ms' }, { hour: '11AM', value: '59ms' }, { hour: '12PM', value: '61ms' }],
  'cn-007': [{ hour: '7AM', value: '240ms' }, { hour: '8AM', value: '380ms' }, { hour: '9AM', value: '520ms' }, { hour: '10AM', value: '700ms' }, { hour: '11AM', value: '840ms' }, { hour: '12PM', value: '840ms' }],
  'cn-014': [{ hour: '7AM', value: '290ms' }, { hour: '8AM', value: '300ms' }, { hour: '9AM', value: '310ms' }, { hour: '10AM', value: '315ms' }, { hour: '11AM', value: '308ms' }, { hour: '12PM', value: '310ms' }],
};

const ERROR_LOGS: Record<string, Array<{ time: string; code: string; description: string }>> = {
  'cn-003': [
    { time: '11:42 AM', code: 'QUOTA_EXCEEDED', description: 'Daily send quota reached for user aria@manexa.ai' },
    { time: '09:15 AM', code: 'AUTH_REFRESH', description: 'Token refresh required — rotated successfully' },
  ],
  'cn-005': [
    { time: '10:50 AM', code: 'CONFLICT', description: 'Event creation conflict — slot already booked' },
  ],
  'cn-007': [
    { time: '12:10 PM', code: '503', description: 'Service Unavailable — QuickBooks server error' },
    { time: '12:04 PM', code: '503', description: 'Service Unavailable — retry 3/3 failed' },
    { time: '11:58 AM', code: '503', description: 'Service Unavailable — invoice sync failed' },
    { time: '11:50 AM', code: '500', description: 'Internal Server Error — payment endpoint' },
    { time: '11:40 AM', code: '503', description: 'Service Unavailable — report generation failed' },
  ],
  'cn-010': [
    { time: '11:20 AM', code: 'TIMEOUT', description: 'Request timeout after 30s on ticket list endpoint' },
    { time: '10:05 AM', code: 'RATE_LIMIT', description: 'Rate limit hit on ticket update endpoint' },
    { time: '09:30 AM', code: '404', description: 'Ticket TK-4501 not found — already deleted' },
  ],
};

function HealthTab({ connector }: { connector: Connector }) {
  const isDisconnected = connector.status === 'disconnected';

  if (isDisconnected) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <WifiOff className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">Not connected</p>
        <p className="text-xs text-muted-foreground mt-1">Connect this service to view health data.</p>
      </div>
    );
  }

  const history = LATENCY_HISTORY[connector.id] ?? [];
  const errors  = ERROR_LOGS[connector.id] ?? [];
  const isQB    = connector.id === 'cn-007';
  const isLinkedIn = connector.id === 'cn-014';

  const uptime =
    connector.status === 'error' ? '87.2' :
    connector.status === 'rate-limited' ? '99.1' : '99.9';

  return (
    <div className="space-y-5">
      {/* QuickBooks prominent warning */}
      {isQB && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">14 errors in last 2 hours</p>
            <p className="text-xs text-red-600 mt-1">503 Service Unavailable. QuickBooks may be experiencing an outage. Consider reconnecting or checking <span className="underline cursor-pointer">QuickBooks status page</span>.</p>
          </div>
        </div>
      )}

      {/* LinkedIn rate limit warning */}
      {isLinkedIn && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-amber-700">Rate Limit: 94% of daily limit used</p>
            <p className="text-xs text-amber-600 mt-1">180 / 200 daily API calls consumed. Resets at midnight UTC. Marketing may be throttled after ~2:30 PM.</p>
          </div>
        </div>
      )}

      {/* Uptime badge + latency history */}
      <div className="bg-background border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Latency — Last 6 Hours</h4>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${parseFloat(uptime) >= 99 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {uptime}% uptime
          </span>
        </div>
        {history.length > 0 ? (
          <div className="flex items-end gap-2">
            {history.map((h, i) => {
              const val = parseInt(h.value);
              const maxVal = isQB ? 900 : 300;
              const heightPct = Math.min(100, Math.round((val / maxVal) * 100));
              const barColor = isQB && i >= 3 ? '#EF4444' : '#5C5FEF';
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{h.value}</span>
                  <div className="w-full rounded-sm" style={{ height: 48, backgroundColor: '#F1F5F9', position: 'relative' }}>
                    <div className="absolute bottom-0 left-0 right-0 rounded-sm transition-all"
                      style={{ height: `${heightPct}%`, backgroundColor: barColor, opacity: 0.85 }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{h.hour}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No latency data available.</p>
        )}
      </div>

      {/* Error log */}
      <div className="bg-background border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-gray-50 flex items-center justify-between">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide">Recent Errors</h4>
          {errors.length > 0 && (
            <span className="text-xs font-medium text-red-600">{errors.length} event{errors.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        {errors.length > 0 ? (
          <div className="divide-y divide-border">
            {errors.map((err, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5">
                <span className="text-xs text-muted-foreground flex-shrink-0 w-16">{err.time}</span>
                <code className="text-xs font-mono text-red-600 bg-red-50 px-1.5 py-0.5 rounded flex-shrink-0">{err.code}</code>
                <span className="text-xs text-muted-foreground">{err.description}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 py-4 text-center">
            <p className="text-sm text-green-600 font-medium">No errors recorded</p>
            <p className="text-xs text-muted-foreground mt-0.5">This connector is operating normally.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function SettingsTab({ connector }: { connector: Connector }) {
  const [alias, setAlias]         = useState(connector.name);
  const [webhook, setWebhook]     = useState('');
  const [autoRetry, setAutoRetry] = useState(true);
  const [alertErr, setAlertErr]   = useState(true);
  const [maxRetries, setMaxRetries] = useState(3);

  return (
    <div className="space-y-5">
      {/* Alias */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">Connector Alias</label>
        <input
          value={alias}
          onChange={e => setAlias(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="Alias name…"
        />
        <p className="text-xs text-muted-foreground mt-1">Custom display name for this connector.</p>
      </div>

      {/* Webhook URL */}
      {connector.authType === 'webhook' && (
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Webhook URL</label>
          <input
            value={webhook}
            onChange={e => setWebhook(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="https://…"
          />
        </div>
      )}

      {/* Toggles */}
      <div className="bg-background border border-border rounded-xl divide-y divide-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Auto-retry on Failure</p>
            <p className="text-xs text-muted-foreground">Automatically retry failed requests</p>
          </div>
          {/* using <button> instead of a kit Toggle: no Toggle component is available in this project */}
          <button onClick={() => setAutoRetry(v => !v)}
            className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${autoRetry ? 'bg-primary' : 'bg-gray-200'}`}>
            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${autoRetry ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">Alert on Error</p>
            <p className="text-xs text-muted-foreground">Send notification when errors are detected</p>
          </div>
          <button onClick={() => setAlertErr(v => !v)}
            className={`relative inline-flex items-center w-10 h-5 rounded-full transition-colors ${alertErr ? 'bg-primary' : 'bg-gray-200'}`}>
            <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${alertErr ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>
      </div>

      {/* HR retries */}
      <div>
        <label className="block text-xs font-semibold text-foreground mb-1.5">HR Retry Attempts</label>
        <input
          type="number"
          min={1} max={10}
          value={maxRetries}
          onChange={e => setMaxRetries(Number(e.target.value))}
          className="w-24 px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Save */}
      <button className="px-5 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
        Save Settings
      </button>

      {/* Disconnect */}
      <div className="pt-3 border-t border-border">
        <p className="text-xs font-semibold text-foreground mb-1">Danger Zone</p>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
          <WifiOff className="w-4 h-4" />
          Disconnect Connector
        </button>
        <p className="text-xs text-muted-foreground mt-1">This will revoke all tokens and disconnect all agents using this connector.</p>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────

function ConnectorDetailPanel({
  connector,
  onClose,
}: {
  connector: Connector;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<ConnectorTab>('overview');
  const tabs: { id: ConnectorTab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'scopes',   label: 'Scopes',   icon: Lock },
    { id: 'health',   label: 'Health',   icon: Zap },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isQB = connector.id === 'cn-007';

  return (
    <div className="flex flex-col h-full bg-white border-l border-border min-w-0">
      {/* Panel header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-border">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
              {connector.icon}
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-foreground truncate">{connector.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{connector.category}</span>
                <StatusBadge status={connector.status} />
                <AuthBadge authType={connector.authType} />
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 text-muted-foreground transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QuickBooks error banner at panel header level */}
        {isQB && (
          <div className="mt-3 flex items-center gap-2 p-2.5 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
            <p className="text-xs text-red-700">QuickBooks is experiencing issues. 14 errors in last 2 hours. Consider reconnecting or checking QuickBooks status.</p>
          </div>
        )}

        {/* Tab bar */}
        <div className="flex gap-1 mt-4">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                tab === t.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'overview' && <OverviewTab connector={connector} />}
        {tab === 'scopes'   && <ScopesTab   connector={connector} />}
        {tab === 'health'   && <HealthTab   connector={connector} />}
        {tab === 'settings' && <SettingsTab connector={connector} />}
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function BAConnectorsScreen({ onNavigate }: BAConnectorsScreenProps) {
  const [searchQuery,          setSearchQuery]          = useState('');
  const [filterCategory,       setFilterCategory]       = useState<string>('All');
  const [selectedConnectorId,  setSelectedConnectorId]  = useState<string | null>(null);

  const selectedConnector = connectors.find(c => c.id === selectedConnectorId) ?? null;

  const filtered = connectors.filter(c => {
    const matchSearch   = c.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCategory = filterCategory === 'All' || c.category === filterCategory;
    return matchSearch && matchCategory;
  });

  const connectedCount    = connectors.filter(c => c.status === 'connected').length;
  const errorCount        = connectors.filter(c => c.status === 'error').length;
  const rateLimitedCount  = connectors.filter(c => c.status === 'rate-limited').length;
  const disconnectedCount = connectors.filter(c => c.status === 'disconnected').length;

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* ─── Left Panel ─────────────────────────── */}
      <div
        className={`flex flex-col border-r border-border bg-white transition-all duration-200 ${
          selectedConnector ? 'w-[420px] flex-shrink-0' : 'flex-1'
        } overflow-hidden`}
      >
        {/* Top toolbar */}
        <div className="flex-shrink-0 px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search connectors…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            {/* using <select> instead of Radix Select: no Select component is configured in this project */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="pl-3 pr-8 py-2 text-sm border border-border rounded-lg bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex-shrink-0">
              <Plus className="w-4 h-4" />
              Add Connector
            </button>
          </div>

          {/* Status summary bar */}
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-green-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {connectedCount} Connected
            </span>
            {errorCount > 0 && (
              <span className="flex items-center gap-1.5 text-red-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {errorCount} Error
              </span>
            )}
            {rateLimitedCount > 0 && (
              <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {rateLimitedCount} Rate Limited
              </span>
            )}
            <span className="flex items-center gap-1.5 text-gray-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              {disconnectedCount} Disconnected
            </span>
          </div>
        </div>

        {/* Connector list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Search className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-muted-foreground">No connectors match your search.</p>
            </div>
          ) : (
            filtered.map(connector => {
              const isSelected = selectedConnector?.id === connector.id;
              return (
                <div
                  key={connector.id}
                  onClick={() => setSelectedConnectorId(isSelected ? null : connector.id)}
                  className={`flex items-center gap-3 px-5 py-3.5 cursor-pointer border-b border-border transition-colors ${
                    isSelected ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-gray-50'
                  }`}
                >
                  {/* Emoji icon */}
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {connector.icon}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">{connector.name}</span>
                      <span className="text-xs text-muted-foreground">{connector.category}</span>
                      <AuthBadge authType={connector.authType} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                      <StatusBadge status={connector.status} />
                      {connector.agentsUsing.length > 0 ? (
                        <span className="text-xs text-muted-foreground truncate">
                          {connector.agentsUsing.join(', ')}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>

                  {/* Right meta */}
                  <div className="flex-shrink-0 text-right space-y-1">
                    {connector.errors > 0 && (
                      <p className="text-xs font-semibold text-red-600">{connector.errors} err</p>
                    )}
                    {connector.latency && (
                      <p className="text-xs text-muted-foreground">{connector.latency}</p>
                    )}
                    {connector.lastSync && (
                      <p className="text-xs text-muted-foreground">{connector.lastSync}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ─── Right Panel ─────────────────────────── */}
      {selectedConnector && (
        <div className="flex-1 overflow-hidden flex flex-col">
          <ConnectorDetailPanel
            connector={selectedConnector}
            onClose={() => setSelectedConnectorId(null)}
          />
        </div>
      )}
    </div>
  );
}
