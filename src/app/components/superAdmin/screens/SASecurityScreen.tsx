import React, { useState } from 'react';
import {
  ShieldCheck, ShieldAlert, Shield, Users, XCircle,
  Clock, ExternalLink, CheckCircle2, AlertTriangle, Globe, Lock
} from 'lucide-react';
import { SAScreen, securityEvents, tenants } from '../superAdminData';

export function SASecurityScreen({ onNavigate }: { onNavigate: (screen: SAScreen, id?: string) => void }) {
  const [mfaAdmins, setMfaAdmins] = useState(true);
  const [mfaAll, setMfaAll] = useState(false);

  const activeTenants = tenants.filter(t => t.status === 'active' || t.status === 'trial');
  const sortedByMfa = [...activeTenants].sort((a, b) => a.mfaCoverage - b.mfaCoverage);

  const mfaColor = (pct: number) =>
    pct >= 90 ? 'bg-green-500' : pct >= 70 ? 'bg-amber-500' : 'bg-red-500';

  const severityConfig = {
    critical: {
      dot: 'bg-red-500 animate-pulse',
      border: 'border-l-red-400',
      rowBg: 'bg-red-50/60',
    },
    warning: {
      dot: 'bg-amber-500',
      border: 'border-l-amber-400',
      rowBg: '',
    },
    info: {
      dot: 'bg-green-500',
      border: 'border-l-transparent',
      rowBg: '',
    },
  } as const;

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* LEFT COLUMN */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active Threats', value: '0', cls: 'text-green-600', icon: <ShieldCheck className="w-5 h-5 text-green-600" />, bg: 'bg-green-50' },
            { label: 'Critical Events Today', value: '2', cls: 'text-red-600', icon: <ShieldAlert className="w-5 h-5 text-red-600" />, bg: 'bg-red-50' },
            { label: 'Avg MFA Coverage', value: '78%', cls: 'text-amber-600', icon: <Shield className="w-5 h-5 text-amber-600" />, bg: 'bg-amber-50' },
            { label: 'Suspended Accounts', value: '4', cls: 'text-red-600', icon: <XCircle className="w-5 h-5 text-red-600" />, bg: 'bg-red-50' },
          ].map(c => (
            <div key={c.label} className="bg-white border border-border rounded-2xl p-5">
              <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center mb-3`}>{c.icon}</div>
              <p className={`text-3xl font-bold ${c.cls}`}>{c.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Recent security events */}
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Recent Security Events</h3>
            <button
              onClick={() => onNavigate('audit')}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              View full audit log <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-border">
            {securityEvents.map(evt => {
              const cfg = severityConfig[evt.severity as keyof typeof severityConfig];
              return (
                <div
                  key={evt.id}
                  className={`px-5 py-3.5 flex items-start gap-3 border-l-[3px] ${cfg.border} ${cfg.rowBg} transition-colors`}
                >
                  <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{evt.tenant}</span>
                      <span className="text-sm text-foreground">{evt.event}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{evt.actor}</span>
                      {evt.ip !== 'n/a' && <span className="font-mono">{evt.ip}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {evt.time}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MFA coverage by tenant */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">MFA Coverage by Tenant</h3>
          <div className="space-y-3">
            {sortedByMfa.map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-36 flex-shrink-0 truncate">{t.name}</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${mfaColor(t.mfaCoverage)}`}
                    style={{ width: `${t.mfaCoverage}%` }}
                  />
                </div>
                <span className={`text-xs font-medium w-10 text-right flex-shrink-0 ${
                  t.mfaCoverage >= 90 ? 'text-green-600' : t.mfaCoverage >= 70 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {t.mfaCoverage}%
                </span>
                {t.mfaCoverage < 70 && (
                  <span className="flex items-center gap-1 text-xs text-red-600 flex-shrink-0">
                    <AlertTriangle className="w-3 h-3" /> Low
                  </span>
                )}
              </div>
            ))}
          </div>
          <button className="mt-5 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
            <Shield className="w-4 h-4" />
            Enforce MFA Platform-Wide
          </button>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="w-[280px] flex-shrink-0 border-l border-border bg-white overflow-y-auto p-4 space-y-4">
        {/* Security Policies */}
        <div className="border border-border rounded-2xl p-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Security Policies</h3>

          {/* MFA for Admins */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">MFA for Admins</p>
              <p className="text-xs text-muted-foreground">Required for all admin roles</p>
            </div>
            <button
              onClick={() => setMfaAdmins(p => !p)}
              className={`relative w-10 h-5.5 rounded-full flex-shrink-0 mt-0.5 transition-colors ${mfaAdmins ? 'bg-primary' : 'bg-muted'}`}
              style={{ height: '22px', width: '40px' }}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${mfaAdmins ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* MFA for All Users */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-foreground">MFA for All Users</p>
              <p className="text-xs text-muted-foreground">64 accounts without MFA</p>
            </div>
            <button
              onClick={() => setMfaAll(p => !p)}
              className={`relative flex-shrink-0 mt-0.5 rounded-full transition-colors ${mfaAll ? 'bg-primary' : 'bg-muted'}`}
              style={{ height: '22px', width: '40px' }}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${mfaAll ? 'left-5' : 'left-0.5'}`} />
            </button>
          </div>

          <div className="pt-2 border-t border-border space-y-2">
            {[
              { label: 'Session Timeout', value: '8 hours' },
              { label: 'HR Login Attempts', value: '5' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className="font-medium text-foreground">{row.value}</span>
              </div>
            ))}
          </div>

          <button className="w-full px-3 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Edit Policies
          </button>
        </div>

        {/* Active Incidents */}
        <div className="border border-border rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Active Incidents</h3>
          {[
            { id: 'inc-1', label: 'swapna@manexa.ai', detail: 'Account locked', severity: 'critical' },
            { id: 'inc-2', label: 'Frontier Labs', detail: 'Tenant suspended', severity: 'critical' },
          ].map(inc => (
            <div key={inc.id} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
              <span className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0 animate-pulse" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{inc.label}</p>
                <p className="text-xs text-muted-foreground">{inc.detail}</p>
              </div>
              <button className="flex-shrink-0 text-xs px-2 py-1 border border-red-300 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                Resolve
              </button>
            </div>
          ))}
        </div>

        {/* SSO Status */}
        <div className="border border-border rounded-2xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">SSO Status</h3>
          {[
            { label: 'Google SSO', status: 'Active', detail: '8 tenants', dot: 'bg-green-500', icon: <Globe className="w-3.5 h-3.5 text-muted-foreground" /> },
            { label: 'SAML', status: 'Active', detail: '3 tenants', dot: 'bg-green-500', icon: <Lock className="w-3.5 h-3.5 text-muted-foreground" /> },
            { label: 'Password Auth', status: 'Active', detail: '3 tenants, fallback', dot: 'bg-amber-500', icon: <Users className="w-3.5 h-3.5 text-muted-foreground" /> },
          ].map(sso => (
            <div key={sso.label} className="flex items-center gap-3">
              {sso.icon}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground">{sso.label}</p>
                <p className="text-xs text-muted-foreground">{sso.detail}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`w-2 h-2 rounded-full ${sso.dot}`} />
                <span className="text-xs text-muted-foreground">{sso.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
