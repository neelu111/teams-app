import { useState } from 'react';
import {
  Cpu, CreditCard, ToggleRight, Save, AlertTriangle, Lock
} from 'lucide-react';
import { SAScreen, modelPolicies as initialModelPolicies, planLimits as initialPlanLimits, featureFlags as initialFeatureFlags } from '../superAdminData';

type Section = 'models' | 'plans' | 'flags';

const planColors: Record<string, string> = {
  starter: '#94A3B8',
  business: '#10B981',
  enterprise: '#0EA5E9',
  'enterprise-plus': '#5C5FEF',
};

const planLabels: Record<string, string> = {
  starter: 'Starter',
  business: 'Business',
  enterprise: 'Enterprise',
  'enterprise-plus': 'Enterprise+',
};

function ModelBadge({ plan }: { plan: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
      style={{ backgroundColor: planColors[plan] ?? '#94A3B8' }}
    >
      {planLabels[plan] ?? plan}
    </span>
  );
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors flex-shrink-0 ${
        enabled ? 'bg-indigo-600' : 'bg-muted-foreground/30'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function formatLimit(val: number) {
  if (val === -1) return 'Unlimited';
  return val.toLocaleString();
}

export function SAPlatformConfigScreen({ onNavigate }: { onNavigate: (screen: SAScreen, id?: string) => void }) {
  const [activeSection, setActiveSection] = useState<Section>('models');
  const [models, setModels] = useState(initialModelPolicies.map((m) => ({ ...m })));
  const [plans, setPlans] = useState(initialPlanLimits.map((p) => ({ ...p })));
  const [flags, setFlags] = useState(initialFeatureFlags.map((f) => ({ ...f })));

  const navItems: { key: Section; label: string; icon: React.ReactNode }[] = [
    { key: 'models', label: 'Models & AI',    icon: <Cpu size={16} /> },
    { key: 'plans',  label: 'Plans & Limits', icon: <CreditCard size={16} /> },
    { key: 'flags',  label: 'Feature Flags',  icon: <ToggleRight size={16} /> },
  ];

  function updateModel<K extends keyof typeof models[0]>(index: number, key: K, value: typeof models[0][K]) {
    setModels((prev) => prev.map((m, i) => i === index ? { ...m, [key]: value } : m));
  }

  function updatePlan<K extends keyof typeof plans[0]>(index: number, key: K, value: typeof plans[0][K]) {
    setPlans((prev) => prev.map((p, i) => i === index ? { ...p, [key]: value } : p));
  }

  function updateFlag(id: string, enabled: boolean) {
    setFlags((prev) => prev.map((f) => f.id === id ? { ...f, enabled } : f));
  }

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* LEFT NAV */}
      <div className="w-[180px] flex-shrink-0 bg-white border-r border-border p-3 flex flex-col gap-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Configuration</p>
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveSection(item.key)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left ${
              activeSection === item.key
                ? 'bg-indigo-50 text-indigo-700'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <span className={activeSection === item.key ? 'text-indigo-600' : 'text-muted-foreground'}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* MODELS & AI */}
        {activeSection === 'models' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">AI Model Configuration</h2>
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <Save size={14} />
                Save Model Policies
              </button>
            </div>

            <div className="space-y-4">
              {models.map((model, idx) => (
                <div key={model.modelId} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-foreground">{model.label}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">{model.modelId}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{model.enabled ? 'Enabled' : 'Disabled'}</span>
                      <Toggle
                        enabled={model.enabled}
                        onChange={(v) => updateModel(idx, 'enabled', v)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">HR Tokens</label>
                      <input
                        type="number"
                        defaultValue={model.maxTokens}
                        onChange={(e) => updateModel(idx, 'maxTokens', Number(e.target.value))}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">Rate Limit per Tenant (calls/hr)</label>
                      <input
                        type="number"
                        defaultValue={model.rateLimit}
                        onChange={(e) => updateModel(idx, 'rateLimit', Number(e.target.value))}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Cost per 1M tokens</p>
                        <p className="text-sm font-semibold text-foreground">
                          ${model.costPerMToken.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Usage this month</p>
                        <p className="text-sm text-foreground">
                          {model.calls.toLocaleString()} calls · <span className="font-semibold text-indigo-600">${model.cost.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Available on plans</p>
                      <div className="flex flex-wrap gap-1">
                        {model.plans.map((plan) => (
                          <ModelBadge key={plan} plan={plan} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PLANS & LIMITS */}
        {activeSection === 'plans' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Plan Configuration</h2>
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <Save size={14} />
                Save Plan Limits
              </button>
            </div>

            <div className="space-y-4">
              {plans.map((plan, idx) => (
                <div key={plan.plan} className="bg-white border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
                      <h3 className="font-bold text-foreground">{plan.label}</h3>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {plan.tenantCount} tenant{plan.tenantCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Monthly Price</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-sm text-muted-foreground">$</span>
                        <input
                          type="number"
                          defaultValue={plan.price}
                          onChange={(e) => updatePlan(idx, 'price', Number(e.target.value))}
                          className="w-24 border border-border rounded-lg px-2 py-1 text-sm bg-background font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 text-right"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">HR Users</label>
                      <input
                        type="number"
                        defaultValue={plan.users}
                        onChange={(e) => updatePlan(idx, 'users', Number(e.target.value))}
                        placeholder={plan.users === -1 ? 'Unlimited' : ''}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {plan.users === -1 && (
                        <p className="text-xs text-muted-foreground mt-0.5">Currently: Unlimited</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">HR Agents</label>
                      <input
                        type="number"
                        defaultValue={plan.agents}
                        onChange={(e) => updatePlan(idx, 'agents', Number(e.target.value))}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {plan.agents === -1 && (
                        <p className="text-xs text-muted-foreground mt-0.5">Currently: Unlimited</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground block mb-1">HR API Calls/MTD</label>
                      <input
                        type="number"
                        defaultValue={plan.apiCallsMTD}
                        onChange={(e) => updatePlan(idx, 'apiCallsMTD', Number(e.target.value))}
                        className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      {plan.apiCallsMTD === -1 && (
                        <p className="text-xs text-muted-foreground mt-0.5">Currently: Unlimited</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FEATURE FLAGS */}
        {activeSection === 'flags' && (
          <div className="max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Feature Flags</h2>
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <Save size={14} />
                Save Feature Flags
              </button>
            </div>

            <div className="bg-white border border-border rounded-2xl divide-y divide-border">
              {flags.map((flag) => (
                <div key={flag.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-sm text-foreground">{flag.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{flag.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {flag.plans.map((plan) => (
                          <ModelBadge key={plan} plan={plan} />
                        ))}
                      </div>
                      {/* Warning when disabling a flag that tenants are using */}
                      {flag.usingTenants > 0 && !flag.enabled && (
                        <div className="flex items-center gap-1.5 mt-2 text-amber-600">
                          <AlertTriangle size={13} />
                          <span className="text-xs font-medium">
                            {flag.usingTenants} tenant{flag.usingTenants !== 1 ? 's' : ''} {flag.usingTenants === 1 ? 'is' : 'are'} using this — disabling will affect them
                          </span>
                        </div>
                      )}
                    </div>
                    <Toggle
                      enabled={flag.enabled}
                      onChange={(v) => updateFlag(flag.id, v)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
