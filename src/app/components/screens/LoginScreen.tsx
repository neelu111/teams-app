import React, { useState } from 'react';
import { Zap, ArrowRight, Eye, EyeOff, Shield, Activity, ChevronDown } from 'lucide-react';
import { sampleUsers } from '../sampleData';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
}

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin',
  'business-admin': 'Business Admin',
  'manager': 'Business Manager',
  'employee': 'Employee',
};

const roleColors: Record<string, string> = {
  'super-admin': '#5C5FEF',
  'business-admin': '#8B5CF6',
  'manager': '#0EA5E9',
  'employee': '#10B981',
};

const demoUsers = sampleUsers.filter(u => ['user-001', 'user-002', 'user-003', 'user-004'].includes(u.id));

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedUserId, setSelectedUserId] = useState('user-001');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedUser = sampleUsers.find(u => u.id === selectedUserId)!;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(selectedUserId); }, 1000);
  };

  const handleQuickLogin = (userId: string) => {
    setSelectedUserId(userId);
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(userId); }, 800);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FA' }}>
      {/* Left panel */}
      <div className="w-[480px] flex-shrink-0 bg-white flex flex-col px-12 py-10 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-foreground tracking-tight">Manexa AI Labs</span>
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-[340px]">
          <h1 className="text-2xl font-semibold text-foreground mb-1.5">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-8">Sign in to your workspace to continue</p>

          {/* Demo user selector */}
          <div className="mb-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Sign in as</p>
            <div className="grid grid-cols-2 gap-2">
              {demoUsers.map(user => {
                const isSelected = user.id === selectedUserId;
                const color = roleColors[user.role];
                return (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => setSelectedUserId(user.id)}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border text-left transition-all"
                    style={{
                      borderColor: isSelected ? color : 'var(--border)',
                      background: isSelected ? color + '0D' : 'transparent',
                    }}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      style={{ background: color }}>
                      {user.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-foreground truncate">{user.name}</div>
                      <div className="text-xs truncate" style={{ color }}>{roleLabels[user.role]}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Work email</label>
              <input
                type="email"
                value={selectedUser.email}
                readOnly
                className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none text-muted-foreground cursor-default"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="••••••••"
                  className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-white transition-all pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>Sign in as {selectedUser.name.split(' ')[0]} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['Microsoft SSO', 'Google SSO'].map(sso => (
              <button key={sso} onClick={() => onLogin(selectedUserId)} className="py-2.5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                {sso === 'Microsoft SSO' ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="9" height="9" fill="#F25022"/><rect x="13" y="2" width="9" height="9" fill="#7FBA00"/><rect x="2" y="13" width="9" height="9" fill="#00A4EF"/><rect x="13" y="13" width="9" height="9" fill="#FFB900"/></svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                )}
                {sso}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Don't have an account? <button className="text-primary hover:underline">Contact your admin</button>
        </p>
      </div>

      {/* Right panel - Hero */}
      <div className="flex-1 flex flex-col justify-center items-center px-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #5C5FEF, transparent)' }} />
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />
        </div>

        <div className="max-w-md text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-border shadow-sm text-xs text-muted-foreground mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            AI Agents Active · 23 workflows running
          </div>
          <h2 className="text-4xl font-semibold text-foreground leading-tight mb-4">Your AI workforce,<br /><span style={{ color: '#5C5FEF' }}>ready to work</span></h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">Teams brings together AI agents that understand your business and automate complex workflows — from sales and HR to finance and operations.</p>

          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Activity, label: 'Workflows Today', value: '23' },
              { icon: Shield, label: 'Success Rate', value: '97.3%' },
              { icon: Zap, label: 'Time Saved', value: '14h' },
            ].map(stat => (
              <div key={stat.label} className="bg-white rounded-xl border border-border p-4 text-center shadow-sm">
                <stat.icon className="w-5 h-5 mx-auto mb-2" style={{ color: '#5C5FEF' }} />
                <div className="text-xl font-semibold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
