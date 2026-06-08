import { employeeConnectors } from '../employee/employeeData';

const STORAGE_KEY = 'employeeConnectors_v1';
const CRED_KEY = 'employeeConnectorCreds_v1';

function persistConnectors() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(employeeConnectors));
  } catch (e) {
    // ignore
  }
}

function persistCreds(creds: Record<string, string>) {
  try {
    localStorage.setItem(CRED_KEY, JSON.stringify(creds));
  } catch (e) {}
}

// initialize from localStorage if available
try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const parsed = JSON.parse(raw);
    Object.assign(employeeConnectors, parsed);
  } else {
    persistConnectors();
  }
} catch (e) {
  // ignore
}

let connectorCreds: Record<string, string> = {};
try {
  const raw = localStorage.getItem(CRED_KEY);
  if (raw) connectorCreds = JSON.parse(raw);
} catch (e) {}

export function isConnectorConnected(connectorId: string) {
  return !!employeeConnectors[connectorId];
}

export function setConnectorConnected(connectorId: string, connected: boolean) {
  employeeConnectors[connectorId] = connected;
  persistConnectors();
}

export function listConnectors() {
  return { ...employeeConnectors };
}

export function setConnectorCredentials(connectorId: string, creds: string) {
  connectorCreds[connectorId] = creds;
  persistCreds(connectorCreds);
}

export function getConnectorCredentials(connectorId: string) {
  return connectorCreds[connectorId];
}

export function hasConnectorCredentials(connectorId: string) {
  return !!connectorCreds[connectorId];
}
