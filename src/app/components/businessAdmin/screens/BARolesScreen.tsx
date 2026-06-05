import React, { useState } from 'react';
import { Plus, Shield, Users, Edit, X, Check } from 'lucide-react';
import { BAScreen, roleDefinitions } from '../businessAdminData';

interface BARolesScreenProps {
  onNavigate: (screen: BAScreen, id?: string) => void;
}

const resources = [
  'Agent Configuration', 'User Management', 'Role Management',
  'Connector Management', 'Capability Management', 'Audit Logs',
  'Reports', 'Settings', 'Workflow Creation', 'Approval Override',
];

type PermValue = 'full' | 'read' | 'none';

const PermCell = ({ value }: { value: PermValue }) => {
  if (value === 'full') return (
    <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
      <Check className="w-3 h-3" /> Full
    </span>
  );
  if (value === 'read') return (
    <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
      Read
    </span>
  );
  return <span className="text-muted-foreground text-xs">—</span>;
};

export function BARolesScreen({ onNavigate }: BARolesScreenProps) {
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [newPerms, setNewPerms] = useState<Record<string, PermValue>>(
    Object.fromEntries(resources.map(r => [r, 'none' as PermValue]))
  );

  const permOrder = ['super-admin', 'business-admin', 'manager', 'employee', 'sales-ops'];

  const allRoles = roleDefinitions;

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Left: Role cards */}
      <div className="w-[380px] flex-shrink-0 border-r border-border bg-white flex flex-col overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Roles ({allRoles.length})</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Custom Role
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allRoles.map(role => (
            <div
              key={role.id}
              onClick={() => setSelectedRoleId(selectedRoleId === role.id ? null : role.id)}
              className={`p-4 rounded-xl border cursor-pointer hover:shadow-sm transition-all ${selectedRoleId === role.id ? 'border-primary bg-indigo-50' : 'border-border bg-white'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: role.color + '20' }}>
                    <Shield className="w-4 h-4" style={{ color: role.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{role.label}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{role.userCount} user{role.userCount !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.isSystem ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-700'}`}>
                    {role.isSystem ? 'System' : 'Custom'}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{role.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Permission Matrix */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-white flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Permission Matrix</h2>
        </div>

        {!showCreateForm ? (
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white border border-border rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground w-48">Resource</th>
                    {allRoles.map(role => (
                      <th key={role.id} className="text-center px-3 py-3 text-xs font-semibold" style={{ color: role.color }}>
                        {role.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {resources.map((resource, i) => (
                    <tr key={resource} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-4 py-3 text-xs font-medium text-foreground">{resource}</td>
                      {allRoles.map(role => (
                        <td key={role.id} className="px-3 py-3 text-center">
                          <PermCell value={(role.permissions[resource] as PermValue) || 'none'} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold"><Check className="w-3 h-3" />Full</span>
                <span>— create, read, update, delete</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold">Read</span>
                <span>— view only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-bold">—</span>
                <span>— no access</span>
              </div>
            </div>
          </div>
        ) : (
          /* Create Custom Role form */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="bg-white border border-border rounded-2xl p-6 max-w-2xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-foreground">Create Custom Role</h3>
                <button onClick={() => setShowCreateForm(false)} className="p-1.5 rounded-lg hover:bg-muted">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Role Name</label>
                  <input value={newRoleName} onChange={e => setNewRoleName(e.target.value)} placeholder="e.g. Finance Viewer"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-1">Description</label>
                  <textarea value={newRoleDesc} onChange={e => setNewRoleDesc(e.target.value)} rows={2}
                    placeholder="What can this role do?"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Permissions</label>
                  <div className="border border-border rounded-xl overflow-hidden">
                    {resources.map((resource, i) => (
                      <div key={resource} className={`flex items-center justify-between px-4 py-3 border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                        <span className="text-sm text-foreground">{resource}</span>
                        <select
                          value={newPerms[resource]}
                          onChange={e => setNewPerms(prev => ({ ...prev, [resource]: e.target.value as PermValue }))}
                          className="text-xs border border-border rounded-lg px-2 py-1 focus:outline-none bg-white"
                        >
                          <option value="none">None</option>
                          <option value="read">Read</option>
                          <option value="full">Full</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-muted">Cancel</button>
                  <button onClick={() => setShowCreateForm(false)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">Create Role</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
