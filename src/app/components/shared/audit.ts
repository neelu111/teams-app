export interface AuditEvent { id: string; time: string; title: string; meta?: string; color?: string; connectorId?: string }

const GLOBAL_KEY = 'employeeAudit_v1';
const CONNECTOR_PREFIX = 'employeeAudit_connector_'; // full key: employeeAudit_connector_<id>_v1

function connectorKey(connectorId: string) {
  return `${CONNECTOR_PREFIX}${connectorId}_v1`;
}

function loadKey(key: string): AuditEvent[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AuditEvent[];
    // Normalize meta to string to avoid objects being passed into JSX
    return parsed.map(p => ({
      ...p,
      meta: typeof p.meta === 'string' || typeof p.meta === 'number' ? String(p.meta) : (p.meta ? JSON.stringify(p.meta) : undefined),
    }));
  } catch (e) { return []; }
}

function persistKey(key: string, events: AuditEvent[]) {
  try { localStorage.setItem(key, JSON.stringify(events)); } catch (e) {}
}

export function listAuditEvents(connectorId?: string): AuditEvent[] {
  if (connectorId) return loadKey(connectorKey(connectorId));
  return loadKey(GLOBAL_KEY);
}

export function addAuditEvent(e: { title: string; meta?: any; color?: string; connectorId?: string }) {
  // Ensure meta is a string to avoid rendering objects directly into JSX elsewhere
  const metaStr = typeof e.meta === 'string' || typeof e.meta === 'number' ? String(e.meta) : (e.meta ? JSON.stringify(e.meta) : undefined);
  const ev: AuditEvent = { id: `ae-${Date.now()}`, time: new Date().toISOString(), title: e.title, meta: metaStr, color: e.color || 'bg-blue-500', connectorId: e.connectorId };
  // write to global
  const global = loadKey(GLOBAL_KEY);
  global.unshift(ev);
  persistKey(GLOBAL_KEY, global.slice(0, 200));
  // also write to connector-specific log when provided
  if (e.connectorId) {
    const key = connectorKey(e.connectorId);
    const conn = loadKey(key);
    conn.unshift(ev);
    persistKey(key, conn.slice(0, 200));
  }
  return ev;
}

export function clearAuditEvents(connectorId?: string) {
  if (connectorId) {
    try { localStorage.removeItem(connectorKey(connectorId)); } catch (e) {}
  } else {
    try { localStorage.removeItem(GLOBAL_KEY); } catch (e) {}
  }
}
