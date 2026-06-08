import React, { useState } from 'react';
import { Zap, ArrowRight, Eye, EyeOff, Shield, Activity, ArrowLeft, Mail, CheckCircle2, User, Building2, Lock, RefreshCw } from 'lucide-react';
import { sampleUsers } from '../sampleData';

interface LoginScreenProps {
  onLogin: (userId: string) => void;
}

type View = 'signin' | 'signup' | 'signup-success' | 'forgot-password' | 'forgot-success';

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

const Logo = () => (
  <div className="flex items-center gap-2.5 mb-10">
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
      <Zap className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-semibold text-foreground tracking-tight">Teams</span>
  </div>
);

const RightHero = ({ onLogin, selectedUserId }: { onLogin: (id: string) => void; selectedUserId: string }) => (
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
);

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [view, setView] = useState<View>('signin');
  const [selectedUserId, setSelectedUserId] = useState('user-001');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sign up fields
  const [signupName, setSignupName] = useState('Jane Smith');
  const [signupEmail, setSignupEmail] = useState('jane@acmecorp.com');
  const [signupCompany, setSignupCompany] = useState('Acme Corp');
  const [signupRole, setSignupRole] = useState('employee');
  const [signupPassword, setSignupPassword] = useState('Password123');
  const [signupConfirm, setSignupConfirm] = useState('Password123');
  const [signupError, setSignupError] = useState('');

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('');

  const selectedUser = sampleUsers.find(u => u.id === selectedUserId)!;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(selectedUserId); }, 1000);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setSignupError('Please fill in all required fields.');
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setView('signup-success'); }, 1200);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setView('forgot-success'); }, 1000);
  };

  // ── Sign In ────────────────────────────────────────────────────────────────
  if (view === 'signin') return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FA' }}>
      <div className="w-[480px] flex-shrink-0 bg-white flex flex-col px-12 py-10 shadow-sm">
        <Logo />
        <div className="flex-1 flex flex-col justify-center max-w-[340px]">
          <h1 className="text-2xl font-semibold text-foreground mb-1.5">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-7">Sign in to your workspace to continue</p>

          <form onSubmit={handleSignIn} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-foreground">Work email</label>
                <span className="flex items-center gap-1.5">
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: roleColors[selectedUser.role] + '18', color: roleColors[selectedUser.role] }}>
                    {roleLabels[selectedUser.role]}
                  </span>
                  <button type="button"
                    title="Switch demo user"
                    onClick={() => {
                      const idx = demoUsers.findIndex(u => u.id === selectedUserId);
                      setSelectedUserId(demoUsers[(idx + 1) % demoUsers.length].id);
                    }}
                    className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </span>
              </div>
              <div className="relative">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold absolute left-2.5 top-1/2 -translate-y-1/2 flex-shrink-0"
                  style={{ background: roleColors[selectedUser.role] }}>
                  {selectedUser.avatar}
                </div>
                <input type="email" value={selectedUser.email} readOnly
                  className="w-full pl-11 pr-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none text-muted-foreground cursor-default" />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-foreground">Password</label>
                <button type="button" onClick={() => setView('forgot-password')}
                  className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value="Password123" readOnly
                  className="w-full px-3.5 py-2.5 text-sm bg-muted/60 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 focus:bg-white transition-all pr-10"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
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
              <button key={sso} onClick={() => onLogin(selectedUserId)}
                className="py-2.5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
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
          Don't have an account?{' '}
          <button onClick={() => setView('signup')} className="text-primary hover:underline font-medium">Create account</button>
        </p>
      </div>
      <RightHero onLogin={onLogin} selectedUserId={selectedUserId} />
    </div>
  );

  // ── Sign Up ────────────────────────────────────────────────────────────────
  if (view === 'signup') return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FA' }}>
      <div className="w-[520px] flex-shrink-0 bg-white flex flex-col px-12 py-10 shadow-sm overflow-y-auto">
        <Logo />
        <div className="flex-1 flex flex-col justify-center max-w-[380px]">
          <button onClick={() => setView('signin')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </button>

          <h1 className="text-2xl font-semibold text-foreground mb-1.5">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-7">Start your free trial — no credit card required</p>

          {signupError && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">{signupError}</div>
          )}

          <form onSubmit={handleSignUp} className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Full name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="text" value={signupName} onChange={e => setSignupName(e.target.value)}
                    placeholder="Jane Smith" required
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Company</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input type="text" value={signupCompany} onChange={e => setSignupCompany(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Work email <span className="text-red-400">*</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                  placeholder="jane@company.com" required
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Role</label>
              <select value={signupRole} onChange={e => setSignupRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all bg-white text-foreground">
                <option value="employee">Employee</option>
                <option value="manager">Business Manager</option>
                <option value="business-admin">Business Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Password <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                  placeholder="Min. 8 characters" required
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Confirm password <span className="text-red-400">*</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input type={showConfirmPassword ? 'text' : 'password'} value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)}
                  placeholder="Repeat password" required
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
                <button type="button" onClick={() => setShowConfirmPassword(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70 mt-1">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating account...</>
              ) : (
                <>Create account <ArrowRight className="w-4 h-4" /></>
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
              <button key={sso} onClick={() => onLogin('user-001')}
                className="py-2.5 border border-border rounded-lg text-xs font-medium text-foreground hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                {sso === 'Microsoft SSO' ? (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="9" height="9" fill="#F25022"/><rect x="13" y="2" width="9" height="9" fill="#7FBA00"/><rect x="2" y="13" width="9" height="9" fill="#00A4EF"/><rect x="13" y="13" width="9" height="9" fill="#FFB900"/></svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                )}
                {sso}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground text-center mt-5">
            Already have an account?{' '}
            <button onClick={() => setView('signin')} className="text-primary hover:underline font-medium">Sign in</button>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-3 leading-relaxed">
            By creating an account, you agree to our{' '}
            <button className="text-primary hover:underline">Terms of Service</button> and{' '}
            <button className="text-primary hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
      <RightHero onLogin={onLogin} selectedUserId="user-001" />
    </div>
  );

  // ── Sign Up Success ────────────────────────────────────────────────────────
  if (view === 'signup-success') return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FA' }}>
      <div className="w-[480px] flex-shrink-0 bg-white flex flex-col px-12 py-10 shadow-sm">
        <Logo />
        <div className="flex-1 flex flex-col justify-center max-w-[340px]">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-1.5">Account created!</h1>
          <p className="text-sm text-muted-foreground mb-2">
            We've sent a verification email to
          </p>
          <p className="text-sm font-medium text-foreground mb-7">{signupEmail}</p>

          <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-xs font-medium text-foreground">Next steps</p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Check your inbox and click the verification link</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Your workspace will be ready once verified</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Sign in with your new credentials</li>
            </ul>
          </div>

          <button onClick={() => setView('signin')}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <ArrowLeft className="w-4 h-4" /> Go to sign in
          </button>
        </div>
      </div>
      <RightHero onLogin={onLogin} selectedUserId="user-001" />
    </div>
  );

  // ── Forgot Password ────────────────────────────────────────────────────────
  if (view === 'forgot-password') return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FA' }}>
      <div className="w-[480px] flex-shrink-0 bg-white flex flex-col px-12 py-10 shadow-sm">
        <Logo />
        <div className="flex-1 flex flex-col justify-center max-w-[340px]">
          <button onClick={() => setView('signin')} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors w-fit">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </button>

          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-1.5">Forgot your password?</h1>
          <p className="text-sm text-muted-foreground mb-7">No worries — enter your work email and we'll send you a reset link.</p>

          <form onSubmit={handleForgotPassword} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">Work email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                  placeholder="you@company.com" required
                  className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all" />
              </div>
            </div>
            <button type="submit" disabled={loading || !forgotEmail.trim()}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
              ) : (
                <>Send reset link <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Remember your password?{' '}
            <button onClick={() => setView('signin')} className="text-primary hover:underline font-medium">Sign in</button>
          </p>
        </div>
      </div>
      <RightHero onLogin={onLogin} selectedUserId="user-001" />
    </div>
  );

  // ── Forgot Password Success ────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ background: '#F7F8FA' }}>
      <div className="w-[480px] flex-shrink-0 bg-white flex flex-col px-12 py-10 shadow-sm">
        <Logo />
        <div className="flex-1 flex flex-col justify-center max-w-[340px]">
          <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>

          <h1 className="text-2xl font-semibold text-foreground mb-1.5">Check your email</h1>
          <p className="text-sm text-muted-foreground mb-2">
            We've sent a password reset link to
          </p>
          <p className="text-sm font-medium text-foreground mb-7">{forgotEmail}</p>

          <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2">
            <p className="text-xs text-muted-foreground">Didn't receive the email?</p>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure the email address is correct</li>
              <li>Wait a few minutes for delivery</li>
            </ul>
          </div>

          <button onClick={() => setView('forgot-password')}
            className="w-full py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors mb-3">
            Resend email
          </button>
          <button onClick={() => setView('signin')}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to sign in
          </button>
        </div>
      </div>
      <RightHero onLogin={onLogin} selectedUserId="user-001" />
    </div>
  );
}
