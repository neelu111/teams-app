import React, { useState, useEffect } from 'react';
import { Plug, Mail, Calendar, FileText, Settings, CheckCircle, XCircle } from 'lucide-react';
import { EScreen } from '../employeeData';
import { listConnectors, setConnectorConnected, setConnectorCredentials, getConnectorCredentials, hasConnectorCredentials } from '../../shared/connectors';
import { addAuditEvent, listAuditEvents } from '../../shared/audit';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '../../ui/dialog';
import gcLogo from '../../../../assets/logos/google-calendar.svg';
import gmailLogo from '../../../../assets/logos/gmail.svg';
import driveLogo from '../../../../assets/logos/google-drive.svg';
import outlookLogo from '../../../../assets/logos/outlook.svg';

interface EConnectorsProps {
  onNavigate: (screen: EScreen, id?: string) => void;
}

export function EConnectorsScreen({ onNavigate }: EConnectorsProps) {
  const initialMap = listConnectors();
  const initial = [
    { id: 'google-calendar', name: 'Google Calendar', desc: 'Access your calendar events and availability', scopes: ['calendar.events.read', 'calendar.events.write'], icon: gcLogo, connected: !!initialMap['google-calendar'] },
    { id: 'gmail', name: 'Gmail', desc: 'Read and send emails on your behalf', scopes: ['gmail.readonly', 'gmail.send'], icon: gmailLogo, connected: !!initialMap['gmail'] },
    { id: 'google-drive', name: 'Google Drive', desc: 'Access files and attachments', scopes: ['drive.readonly', 'drive.file'], icon: driveLogo, connected: !!initialMap['google-drive'] },
    { id: 'outlook', name: 'Outlook / Microsoft 365', desc: 'Calendar, mail and contacts via Microsoft Graph', scopes: ['calendars.read', 'mail.send'], icon: outlookLogo, connected: !!initialMap['outlook'] },
  ];

  const [connectors, setConnectors] = useState(initial);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [credsInput, setCredsInput] = useState('');

  function toggleConnect(id: string) {
    const next = connectors.map(c => c.id === id ? { ...c, connected: !c.connected } : c);
    setConnectors(next);
    const now = next.find(n => n.id === id)?.connected ?? false;
    setConnectorConnected(id, now);
    addAuditEvent({ title: `Connector ${now ? 'connected' : 'disconnected'}`, meta: `${id} — ${now ? 'user connected' : 'user disconnected'}`, connectorId: id });
  }

  function seedDemoEvents(id: string) {
    const now = Date.now();
    addAuditEvent({ title: 'Demo: permission granted', time: now - 1000 * 60 * 60 * 24, meta: { demo: true }, color: 'green', connectorId: id });
    addAuditEvent({ title: 'Demo: first sync', time: now - 1000 * 60 * 60 * 2, meta: { demo: true }, color: 'blue', connectorId: id });
    addAuditEvent({ title: 'Demo: scheduled sync', time: now - 1000 * 60 * 10, meta: { demo: true }, color: 'purple', connectorId: id });
    setConnectors(c => c.map(x => x));
  }

  function handleConnect(typeId: string) {
    if (credsInput.trim()) {
      setConnectorCredentials(typeId, credsInput.trim());
    }
    setConnectorConnected(typeId, true);
    addAuditEvent({ title: 'Connector configured', meta: { manual: true }, connectorId: typeId });
    setDialogOpen(false);
    setConnectors(c => c.map(x => x.id === typeId ? { ...x, connected: true } : x));
  }

    function openConfigure(id: string) {
      setSelectedType(id);
      setCredsInput(getConnectorCredentials(id) || '');
      setDialogOpen(true);
    }

    function openNewConnector() {
      setSelectedType(null);
      setCredsInput('');
      setDialogOpen(true);
    }

    useEffect(() => {
      try {
        if (!localStorage.getItem('employeeAudit_seeded_v1')) {
          connectors.forEach(c => seedDemoEvents(c.id));
          localStorage.setItem('employeeAudit_seeded_v1', '1');
        }
      } catch (e) {}
    }, []);

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Connectors</h1>
          <p className="text-xs text-muted-foreground">Authorize data sources so agents can act on your behalf.</p>
        </div>
        <div className="text-xs text-muted-foreground">Configured per user · OAuth required for real integrations</div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-muted-foreground">Available connectors</div>
        <div className="flex items-center gap-2">
          <button onClick={() => { listConnectors(); setConnectors(s => s.map(x => ({ ...x }))); }} className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground border border-border hover:bg-muted/50">Refresh</button>
          <button onClick={() => connectors.forEach(c => seedDemoEvents(c.id))} className="px-3 py-1.5 rounded-lg text-sm bg-accent text-accent-foreground">Seed demo events</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {connectors.map(conn => {
          const Icon = conn.icon as any;
          const recent = listAuditEvents(conn.id).slice(0, 3);
          return (
            <div key={conn.id} className="bg-white border border-border rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-foreground/90">
                    <img src={Icon} alt={`${conn.name} logo`} className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-foreground">{conn.name}</div>
                        <div className="text-xs text-muted-foreground">{conn.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-[12px] font-medium ${conn.connected ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-muted-foreground'}`}>
                          {conn.connected ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          <span>{conn.connected ? 'Connected' : 'Not connected'}</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground mt-1">{recent.length > 0 ? `Last: ${new Date(recent[0].time).toLocaleString()}` : 'Never synced'}</div>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {conn.scopes.map(s => <span key={s} className="px-2 py-1 bg-slate-50 border border-border rounded text-[11px] text-muted-foreground font-mono">{s}</span>)}
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      {hasConnectorCredentials(conn.id) ? (
                        <div className="text-sm">
                          <div className="text-xs text-muted-foreground">Account</div>
                          <div className="text-sm font-medium">{(getConnectorCredentials(conn.id) || '').slice(0, 6)}••••</div>
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">No account configured</div>
                      )}

                      <div className="ml-auto flex items-center gap-2">
                        <button onClick={() => seedDemoEvents(conn.id)} className="px-2 py-1 rounded-lg text-xs bg-muted hover:bg-muted/60">Seed</button>
                        <button onClick={() => toggleConnect(conn.id)} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${conn.connected ? 'border border-border text-foreground bg-white hover:bg-muted/40' : 'bg-primary text-primary-foreground'}`}>
                          {conn.connected ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="font-semibold text-[12px] text-foreground mb-2">Recent events</div>
                  {recent.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No events yet — use "Seed" to create demo events.</div>
                  ) : (
                    <div className="space-y-2">
                      {recent.map(r => (
                        <div key={r.id} className="flex items-center justify-between text-sm">
                          <div className="truncate mr-2">{r.title}</div>
                          <div className="text-[11px] text-muted-foreground">{new Date(r.time).toLocaleTimeString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">Scopes shown; real integrations require OAuth</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openConfigure(conn.id)} className="px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground">Configure</button>
                  <button onClick={() => { localStorage.setItem('audit_selected_connector', conn.id); onNavigate('audit'); }} className="px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground">View events</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 max-w-2xl text-xs text-muted-foreground">
                          <button onClick={openNewConnector} className="px-3 py-1.5 rounded-lg text-sm bg-primary text-primary-foreground">New connector</button>
        <p className="mb-2">Notes:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Real connectors require server-side OAuth token exchange and secure storage.</li>

                      <Dialog open={dialogOpen} onOpenChange={(v: boolean) => setDialogOpen(v)}>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Connector</DialogTitle>
                            <DialogDescription>Select a connector type and enter credentials to connect.</DialogDescription>
                          </DialogHeader>
                          <div className="grid grid-cols-2 gap-3 mt-3">
                            {initial.map(t => (
                              <div key={t.id} onClick={() => setSelectedType(t.id)} className={`p-3 border rounded cursor-pointer ${selectedType === t.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-white flex items-center justify-center shadow-sm"><t.icon className="w-5 h-5" /></div>
                                  <div>
                                    <div className="font-medium text-sm">{t.name}</div>
                                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {selectedType && (
                            <div className="mt-4">
                              <label className="text-xs text-muted-foreground">Account identifier</label>
                              <input value={credsInput} onChange={e => setCredsInput(e.target.value)} placeholder="email@example.com or token" className="w-full mt-1 p-2 border rounded" />
                            </div>
                          )}
                          <DialogFooter>
                            <div className="flex gap-2 w-full justify-end">
                              <button className="px-3 py-1 rounded" onClick={() => setDialogOpen(false)}>Cancel</button>
                              <button disabled={!selectedType} onClick={() => selectedType && handleConnect(selectedType)} className="px-3 py-1 rounded bg-primary text-primary-foreground">Connect</button>
                            </div>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
          <li>Agents will act only with your explicit consent; scopes requested are shown above.</li>
          <li>Revoke access anytime from this screen or from account Settings.</li>
        </ul>
      </div>
    </div>
  );
}
