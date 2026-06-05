import React, { useState } from 'react';
import { Lock, Plus, Check, X, Info } from 'lucide-react';
import { Screen } from '../types';

interface RolesScreenProps {
  onNavigate: (screen: Screen) => void;
}

const roles = [
  { id: 'super-admin', label: 'Super Admin', color: 'bg-purple-100 text-purple-700', desc: 'Full system access. Can configure all agents, manage users, view all audits.', count: 1 },
  { id: 'business-admin', label: 'Business Admin', color: 'bg-indigo-100 text-indigo-700', desc: 'Manage users, configure agents, view reports. Cannot access system settings.', count: 2 },
  { id: 'manager', label: 'Manager', color: 'bg-blue-100 text-blue-700', desc: 'View and approve workflows for their team. Can assign tasks and view team reports.', count: 12 },
  { id: 'employee', label: 'Employee', color: 'bg-gray-100 text-gray-700', desc: 'Create and view own workflows. Receive and complete assigned tasks.', count: 112 },
];

const permissions = [
  { group: 'Workflows', items: [
    { id: 'create_workflow', label: 'Create Workflows', roles: { 'super-admin': true, 'business-admin': true, 'manager': true, 'employee': true } },
    { id: 'view_all_workflows', label: 'View All Workflows', roles: { 'super-admin': true, 'business-admin': true, 'manager': true, 'employee': false } },
    { id: 'delete_workflow', label: 'Delete Workflows', roles: { 'super-admin': true, 'business-admin': true, 'manager': false, 'employee': false } },
    { id: 'approve_workflow', label: 'Approve Workflows', roles: { 'super-admin': true, 'business-admin': true, 'manager': true, 'employee': false } },
  ]},
  { group: 'Agents', items: [
    { id: 'configure_agents', label: 'Configure Agents', roles: { 'super-admin': true, 'business-admin': true, 'manager': false, 'employee': false } },
    { id: 'add_connectors', label: 'Add Connectors', roles: { 'super-admin': true, 'business-admin': true, 'manager': false, 'employee': false } },
    { id: 'view_agent_logs', label: 'View Agent Logs', roles: { 'super-admin': true, 'business-admin': true, 'manager': true, 'employee': false } },
  ]},
  { group: 'Users & Admin', items: [
    { id: 'manage_users', label: 'Manage Users', roles: { 'super-admin': true, 'business-admin': true, 'manager': false, 'employee': false } },
    { id: 'manage_roles', label: 'Manage Roles', roles: { 'super-admin': true, 'business-admin': false, 'manager': false, 'employee': false } },
    { id: 'view_audit', label: 'View Audit Logs', roles: { 'super-admin': true, 'business-admin': true, 'manager': false, 'employee': false } },
    { id: 'access_rules', label: 'Manage Access Rules', roles: { 'super-admin': true, 'business-admin': false, 'manager': false, 'employee': false } },
  ]},
  { group: 'Reports', items: [
    { id: 'view_reports', label: 'View Reports', roles: { 'super-admin': true, 'business-admin': true, 'manager': true, 'employee': false } },
    { id: 'export_data', label: 'Export Data', roles: { 'super-admin': true, 'business-admin': true, 'manager': false, 'employee': false } },
  ]},
];

export function RolesScreen({ onNavigate }: RolesScreenProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  return (
    <div className="h-full flex overflow-hidden">
      {/* Role List */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground">Roles</span>
          <button className="p-1 rounded hover:bg-muted transition-colors">
            <Plus className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {roles.map(role => (
            <button key={role.id} onClick={() => setSelectedRole(role.id === selectedRole ? null : role.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all ${selectedRole === role.id ? 'border-primary bg-accent' : 'border-border hover:border-primary/30 hover:bg-muted/30'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.color}`}>{role.label}</span>
                <span className="text-xs text-muted-foreground">{role.count} users</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-border px-6 py-4 sticky top-0 z-10">
          <h3 className="text-sm font-semibold text-foreground mb-0.5">Permission Matrix</h3>
          <p className="text-xs text-muted-foreground">Configure what each role can do. Changes take effect immediately.</p>
        </div>
        <div className="p-6">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left py-3 text-xs font-semibold text-muted-foreground w-[40%]">Permission</th>
                {roles.map(role => (
                  <th key={role.id} className="text-center py-3 px-4 w-[15%]">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.color}`}>{role.label}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map(group => (
                <React.Fragment key={group.group}>
                  <tr>
                    <td colSpan={5} className="pt-5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{group.group}</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                    </td>
                  </tr>
                  {group.items.map(item => (
                    <tr key={item.id} className="hover:bg-muted/20 rounded-lg">
                      <td className="py-3 pr-4">
                        <span className="text-sm text-foreground">{item.label}</span>
                      </td>
                      {roles.map(role => (
                        <td key={role.id} className="text-center py-3 px-4">
                          <div className="flex items-center justify-center">
                            {item.roles[role.id as keyof typeof item.roles] ? (
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                <X className="w-3 h-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
