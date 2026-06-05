import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, ChevronDown, Mail, Calendar, Activity } from 'lucide-react';
import { Screen } from '../types';
import { sampleUsers } from '../sampleData';
import { StatusBadge } from '../shared/StatusBadge';
import { UserAvatar } from '../shared/AgentAvatar';

interface UsersScreenProps {
  onNavigate: (screen: Screen) => void;
}

const roleLabels: Record<string, string> = {
  'super-admin': 'Super Admin', 'business-admin': 'Business Admin', 'manager': 'Business Manager', 'employee': 'Employee',
};
const roleColors: Record<string, string> = {
  'super-admin': 'bg-purple-50 text-purple-700', 'business-admin': 'bg-indigo-50 text-indigo-700',
  'manager': 'bg-blue-50 text-blue-700', 'employee': 'bg-gray-100 text-gray-600',
};

export function UsersScreen({ onNavigate }: UsersScreenProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const filters = ['All', 'Super Admin', 'Business Admin', 'Business Manager', 'Employee'];
  const filtered = sampleUsers.filter(u => {
    const matchRole = roleFilter === 'All' || roleLabels[u.role] === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Sub-header */}
      <div className="px-6 py-4 bg-white border-b border-border flex items-center gap-3">
        <div className="flex gap-1">
          {filters.map(f => (
            <button key={f} onClick={() => setRoleFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${roleFilter === f ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/60'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="relative ml-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg focus:outline-none w-48" />
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{filtered.length} users</span>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:opacity-90">
            <Plus className="w-3.5 h-3.5" /> Invite User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr className="bg-muted/40 border-b border-border">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Department</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Workflows</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Last Seen</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">Joined</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-muted/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar initials={user.avatar} name={user.name} size="md" />
                    <div>
                      <div className="text-sm font-medium text-foreground">{user.name}</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColors[user.role]}`}>
                    {roleLabels[user.role]}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-foreground">{user.department}</td>
                <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-medium text-foreground">{user.workflowsCreated}</span>
                    <span className="text-muted-foreground">created</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-muted-foreground">
                  {user.lastSeen === 'Never' ? 'Never' : new Date(user.lastSeen).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </td>
                <td className="px-4 py-4 text-xs text-muted-foreground">{user.joinedAt}</td>
                <td className="px-4 py-4">
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
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
