import React, { useState } from 'react';
import {
  Settings, Shield, Plug, CreditCard, Save, Copy, Eye, EyeOff, RotateCcw,
  Plus, Trash2, Upload, CheckCircle2, ChevronDown, Download,
} from 'lucide-react';
import { BAScreen } from '../businessAdminData';

interface BASettingsProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

type SettingsSection = 'general' | 'security' | 'integrations' | 'billing';

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-6 first:mt-0">{children}</p>;
}

function FieldRow({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-start gap-4 py-3 border-b border-border last:border-0">
      <div className="w-44 shrink-0 pt-1">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => onChange(!on)}
        className={`w-10 h-6 rounded-full transition-colors relative ${on ? 'bg-primary' : 'bg-slate-300'}`}
      >
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
      {label && <span className="text-xs text-foreground">{label}</span>}
    </div>
  );
}

function StyledInput({ value, onChange, readOnly, className }: {
  value: string; onChange?: (v: string) => void; readOnly?: boolean; className?: string;
}) {
  return (
    <input
      value={value}
      onChange={e => onChange?.(e.target.value)}
      readOnly={readOnly}
      className={`w-full px-3 py-2 text-xs border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 ${readOnly ? 'bg-slate-50 text-muted-foreground' : ''} ${className ?? ''}`}
    />
  );
}

function StyledSelect({ value, onChange, options }: {
  value: string; onChange?: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full appearance-none px-3 py-2 text-xs border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 pr-7"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
    </div>
  );
}

function SaveButton({ label = 'Save Changes' }: { label?: string }) {
  return (
    <button className="mt-5 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
      <Save className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// ── General ─────────────────────────────────────────────────────────────────

function GeneralSection() {
  const [companyName, setCompanyName]   = useState('Manexa AI Labs');
  const [platformName, setPlatformName] = useState('Teams AI Workforce');
  const [timezone, setTimezone]         = useState('America/New_York');
  const [dateFormat, setDateFormat]     = useState('MM/DD/YYYY');
  const [language, setLanguage]         = useState('en');

  return (
    <div>
      <SectionLabel>Company</SectionLabel>
      <FieldRow label="Company Name">
        <StyledInput value={companyName} onChange={setCompanyName} />
      </FieldRow>
      <FieldRow label="Platform Name">
        <StyledInput value={platformName} onChange={setPlatformName} />
      </FieldRow>
      <FieldRow label="Company Logo">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-slate-50">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors flex items-center gap-1.5">
              <Upload className="w-3 h-3" />
              Upload Logo
            </button>
            <p className="text-[11px] text-muted-foreground mt-1">PNG, SVG — max 1 MB</p>
          </div>
        </div>
      </FieldRow>

      <SectionLabel>Localization</SectionLabel>
      <FieldRow label="Time Zone">
        <StyledSelect value={timezone} onChange={setTimezone} options={[
          { value: 'America/New_York',   label: '(UTC-5) America/New_York' },
          { value: 'America/Chicago',    label: '(UTC-6) America/Chicago' },
          { value: 'America/Los_Angeles',label: '(UTC-8) America/Los_Angeles' },
          { value: 'Europe/London',      label: '(UTC+0) Europe/London' },
          { value: 'Asia/Tokyo',         label: '(UTC+9) Asia/Tokyo' },
        ]} />
      </FieldRow>
      <FieldRow label="Date Format">
        <StyledSelect value={dateFormat} onChange={setDateFormat} options={[
          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
        ]} />
      </FieldRow>
      <FieldRow label="Language">
        <StyledSelect value={language} onChange={setLanguage} options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
        ]} />
      </FieldRow>

      <SaveButton />
    </div>
  );
}

// ── Security ─────────────────────────────────────────────────────────────────

function SecuritySection() {
  const [enforceSSO,   setEnforceSSO]   = useState(true);
  const [allowPwFb,    setAllowPwFb]    = useState(false);
  const [mfaAdmins,    setMfaAdmins]    = useState(true);
  const [mfaAll,       setMfaAll]       = useState(false);
  const [mfaMethod,    setMfaMethod]    = useState<'app' | 'sms'>('app');
  const [sessionTtl,   setSessionTtl]   = useState('8h');
  const [concurrentSessions, setConcurrent] = useState('2');
  const [keyRotation,  setKeyRotation]  = useState('90');
  const [ipAllowlist,  setIpAllowlist]  = useState('');

  return (
    <div>
      <SectionLabel>SSO Configuration</SectionLabel>
      <FieldRow label="SSO Provider">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-xs font-semibold text-green-700">Google — Connected</span>
          </div>
          <button className="px-3 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors">
            Disconnect
          </button>
        </div>
      </FieldRow>
      <FieldRow label="Enforce SSO" hint="Block password logins">
        <Toggle on={enforceSSO} onChange={setEnforceSSO} label="Require SSO for all users" />
      </FieldRow>
      <FieldRow label="Password Fallback">
        <Toggle on={allowPwFb} onChange={setAllowPwFb} label="Allow password as fallback" />
      </FieldRow>

      <SectionLabel>MFA Policy</SectionLabel>
      <FieldRow label="Require for Admins">
        <Toggle on={mfaAdmins} onChange={setMfaAdmins} label="Admins must use MFA" />
      </FieldRow>
      <FieldRow label="Require for All Users" hint="Currently 64% coverage">
        <Toggle on={mfaAll} onChange={setMfaAll} label="Enforce MFA platform-wide" />
      </FieldRow>
      <FieldRow label="MFA Method">
        <div className="flex gap-3">
          {([{ key: 'app', label: 'Authenticator App' }, { key: 'sms', label: 'SMS' }] as const).map(m => (
            <label key={m.key} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="mfaMethod" value={m.key} checked={mfaMethod === m.key} onChange={() => setMfaMethod(m.key)} className="accent-primary" />
              <span className="text-xs text-foreground">{m.label}</span>
            </label>
          ))}
        </div>
      </FieldRow>

      <SectionLabel>Session Settings</SectionLabel>
      <FieldRow label="Session Timeout">
        <div className="w-44">
          <StyledSelect value={sessionTtl} onChange={setSessionTtl} options={[
            { value: '1h',  label: '1 hour' },
            { value: '4h',  label: '4 hours' },
            { value: '8h',  label: '8 hours' },
            { value: '24h', label: '24 hours' },
          ]} />
        </div>
      </FieldRow>
      <FieldRow label="Concurrent Sessions" hint="HR sessions per user">
        <div className="w-24">
          <StyledInput value={concurrentSessions} onChange={setConcurrent} />
        </div>
      </FieldRow>

      <SectionLabel>API Security</SectionLabel>
      <FieldRow label="Key Rotation">
        <div className="w-44">
          <StyledSelect value={keyRotation} onChange={setKeyRotation} options={[
            { value: '30',  label: 'Every 30 days' },
            { value: '60',  label: 'Every 60 days' },
            { value: '90',  label: 'Every 90 days' },
            { value: '180', label: 'Every 180 days' },
          ]} />
        </div>
      </FieldRow>
      <FieldRow label="IP Allowlist" hint="Comma-separated CIDRs">
        <textarea
          value={ipAllowlist}
          onChange={e => setIpAllowlist(e.target.value)}
          placeholder="e.g. 10.0.0.0/8, 192.168.1.1/32"
          rows={3}
          className="w-full px-3 py-2 text-xs border border-border rounded-lg bg-white text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none placeholder:text-muted-foreground"
        />
      </FieldRow>

      <SaveButton label="Save Security Settings" />
    </div>
  );
}

// ── Integrations ──────────────────────────────────────────────────────────────

function IntegrationsSection() {
  const [showSecret,   setShowSecret]   = useState(false);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00000/B00000/XXXXXXXXXXXX');
  const [alertEmail,   setAlertEmail]   = useState('admin@manexa.ai');
  const [copied,       setCopied]       = useState(false);

  const webhookUrl = 'https://api.teams.ai/webhooks/manexa-ai-labs/inbound';

  function handleCopy() {
    navigator.clipboard.writeText(webhookUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const apiKeys = [
    { name: 'Production Key', created: 'Jan 15, 2026', lastUsed: '2 min ago',  scopes: ['read', 'write', 'admin'] },
    { name: 'Development Key', created: 'Mar 1, 2026',  lastUsed: '1 hr ago',   scopes: ['read', 'write'] },
  ];

  return (
    <div>
      <SectionLabel>Webhook Configuration</SectionLabel>
      <FieldRow label="Platform Webhook URL">
        <div className="flex items-center gap-2">
          <StyledInput value={webhookUrl} readOnly className="flex-1 font-mono" />
          <button
            onClick={handleCopy}
            className={`px-3 py-2 border border-border rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${copied ? 'bg-green-50 text-green-700 border-green-300' : 'text-foreground hover:bg-slate-50'}`}
          >
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </FieldRow>
      <FieldRow label="Signing Secret">
        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 text-xs border border-border rounded-lg bg-slate-50 text-muted-foreground font-mono">
            {showSecret ? 'sk_live_x9mKpT3nYqRv8wZ2aE6hJ1sL4bCdFg' : 'sk_live_••••••••••••••••••••••••••••••'}
          </div>
          <button
            onClick={() => setShowSecret(!showSecret)}
            className="px-3 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showSecret ? 'Hide' : 'Reveal'}
          </button>
          <button className="px-3 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors flex items-center gap-1.5">
            <RotateCcw className="w-3 h-3" />
            Rotate
          </button>
        </div>
      </FieldRow>

      <SectionLabel>API Keys</SectionLabel>
      <div className="space-y-2 mb-3">
        {apiKeys.map(key => (
          <div key={key.name} className="flex items-center justify-between gap-3 p-3 border border-border rounded-xl bg-white">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs font-semibold text-foreground">{key.name}</p>
                <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Created {key.created} · Last used {key.lastUsed}</p>
              <div className="flex gap-1 mt-1">
                {key.scopes.map(s => (
                  <span key={s} className="px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded-md capitalize">{s}</span>
                ))}
              </div>
            </div>
            <button className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors flex items-center gap-1.5">
              <Trash2 className="w-3 h-3" />
              Revoke
            </button>
          </div>
        ))}
      </div>
      <button className="flex items-center gap-1.5 px-4 py-2 border border-border rounded-xl text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors">
        <Plus className="w-3.5 h-3.5" />
        Generate New Key
      </button>

      <SectionLabel>Notification Webhooks</SectionLabel>
      <FieldRow label="Slack Webhook">
        <StyledInput value={slackWebhook} onChange={setSlackWebhook} className="font-mono" />
      </FieldRow>
      <FieldRow label="Alert Email">
        <StyledInput value={alertEmail} onChange={setAlertEmail} />
      </FieldRow>

      <SaveButton label="Save Integrations" />
    </div>
  );
}

// ── Billing ───────────────────────────────────────────────────────────────────

function BillingSection() {
  const usageItems = [
    { label: 'API Calls',     used: 18420,  limit: 100000, unit: '',    pct: 18.4 },
    { label: 'Users',         used: 47,     limit: 100,    unit: '',    pct: 47 },
    { label: 'Active Agents', used: 6,      limit: 10,     unit: '',    pct: 60 },
    { label: 'Storage',       used: 2.4,    limit: 50,     unit: ' GB', pct: 4.8 },
  ];

  const invoices = [
    { period: 'Jun 2026', amount: '$1,299', status: 'Paid' },
    { period: 'May 2026', amount: '$1,299', status: 'Paid' },
    { period: 'Apr 2026', amount: '$1,299', status: 'Paid' },
  ];

  const pctColor = (pct: number) => pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-400' : 'bg-primary';

  return (
    <div>
      <SectionLabel>Current Plan</SectionLabel>
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/5 to-purple-50 border border-primary/20 rounded-2xl mb-5">
        <div>
          <p className="text-sm font-bold text-foreground">Business Plan</p>
          <p className="text-xs text-muted-foreground mt-0.5">Next billing: July 2, 2026 · $1,299/month</p>
        </div>
        <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl hover:opacity-90 transition-opacity">
          Upgrade
        </button>
      </div>

      <SectionLabel>Usage This Month</SectionLabel>
      <div className="space-y-3 mb-5">
        {usageItems.map(item => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-foreground">{item.label}</span>
              <span className="text-muted-foreground">
                {typeof item.used === 'number' && item.used < 100 ? item.used : item.used.toLocaleString()}{item.unit} / {item.limit.toLocaleString()}{item.unit}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${pctColor(item.pct)}`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{item.pct}% used</p>
          </div>
        ))}
      </div>

      <SectionLabel>Payment Method</SectionLabel>
      <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-white mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-7 bg-slate-800 rounded-md flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">VISA</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Visa ending 4242</p>
            <p className="text-[11px] text-muted-foreground">Expires 12/2028</p>
          </div>
        </div>
        <button className="px-3 py-1.5 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-slate-50 transition-colors">
          Update
        </button>
      </div>

      <SectionLabel>Invoice History</SectionLabel>
      <div className="border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-border">
              {['Period', 'Amount', 'Status', ''].map(col => (
                <th key={col} className="px-4 py-2.5 text-left font-semibold text-muted-foreground">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {invoices.map(inv => (
              <tr key={inv.period} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground">{inv.period}</td>
                <td className="px-4 py-3 text-foreground">{inv.amount}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">{inv.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="flex items-center gap-1 text-primary hover:underline text-xs">
                    <Download className="w-3 h-3" />
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function BASettingsScreen({ onNavigate }: BASettingsProps) {
  const [section, setSection] = useState<SettingsSection>('general');

  const navItems: { key: SettingsSection; label: string; icon: React.ElementType }[] = [
    { key: 'general',      label: 'General',      icon: Settings },
    { key: 'security',     label: 'Security',     icon: Shield },
    { key: 'integrations', label: 'Integrations', icon: Plug },
    { key: 'billing',      label: 'Billing',      icon: CreditCard },
  ];

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Left nav */}
      <div className="w-52 shrink-0 border-r border-border bg-white flex flex-col">
        <div className="px-4 pt-5 pb-3 border-b border-border">
          <h1 className="text-sm font-bold text-foreground">Settings</h1>
        </div>
        <nav className="p-3 space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setSection(item.key)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-slate-50 hover:text-foreground'}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-2xl">
          {section === 'general'      && <GeneralSection />}
          {section === 'security'     && <SecuritySection />}
          {section === 'integrations' && <IntegrationsSection />}
          {section === 'billing'      && <BillingSection />}
        </div>
      </div>
    </div>
  );
}
