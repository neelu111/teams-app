import React, { useState } from 'react';
import { FolderOpen, Search, Upload, Grid, List, FileText, Table, Presentation, Image, Bot, Share2, Download, MoreHorizontal, ChevronRight, File } from 'lucide-react';
import { EScreen, EFile, employeeFiles } from '../employeeData';

const fileIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  pdf:  { icon: FileText,     color: '#EF4444', bg: 'bg-red-50' },
  doc:  { icon: FileText,     color: '#2563EB', bg: 'bg-blue-50' },
  xlsx: { icon: Table,        color: '#16A34A', bg: 'bg-green-50' },
  ppt:  { icon: Presentation, color: '#D97706', bg: 'bg-amber-50' },
  img:  { icon: Image,        color: '#7C3AED', bg: 'bg-purple-50' },
  csv:  { icon: Table,        color: '#0891B2', bg: 'bg-cyan-50' },
};

const folders = ['All Files', 'Workflow Outputs', 'My Uploads', 'Shared with Me'];

interface EFilesScreenProps {
  onNavigate: (screen: EScreen) => void;
}

export function EFilesScreen({ onNavigate }: EFilesScreenProps) {
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState('All Files');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDragging, setIsDragging] = useState(false);

  const filtered = employeeFiles.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchFolder = activeFolder === 'All Files' || f.folder === activeFolder;
    return matchSearch && matchFolder;
  });

  const recent = employeeFiles.slice(0, 4);

  function FileCard({ file }: { file: EFile }) {
    const ic = fileIcons[file.type] || { icon: File, color: '#9CA3AF', bg: 'bg-muted' };
    const Icon = ic.icon;
    if (viewMode === 'list') {
      return (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 border-b border-border transition-colors group">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${ic.bg}`}>
            <Icon className="w-4 h-4" style={{ color: ic.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
              <span>{file.folder}</span>
              {file.generatedBy && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Bot className="w-3 h-3" />via {file.generatedBy}</span>
                </>
              )}
            </div>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">{file.size}</span>
          <span className="text-xs text-muted-foreground flex-shrink-0 w-20 text-right">{file.modifiedLabel}</span>
          {file.shared && <Share2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 rounded hover:bg-muted transition-colors"><Download className="w-3.5 h-3.5 text-muted-foreground" /></button>
            <button className="p-1.5 rounded hover:bg-muted transition-colors"><MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" /></button>
          </div>
        </div>
      );
    }
    return (
      <div className="bg-white border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ic.bg}`}>
            <Icon className="w-5 h-5" style={{ color: ic.color }} />
          </div>
          <button className="p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted">
            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </div>
        <p className="text-xs font-medium text-foreground mb-1 line-clamp-2 leading-snug">{file.name}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{file.size}</span>
          <span className="text-xs text-muted-foreground">{file.modifiedLabel}</span>
        </div>
        {file.generatedBy && (
          <div className="flex items-center gap-1 mt-2 text-xs text-primary">
            <Bot className="w-3 h-3" />
            <span>by {file.generatedBy}</span>
          </div>
        )}
        {file.shared && (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Share2 className="w-3 h-3" />
            <span>Shared</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 flex-shrink-0 bg-white border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <button
            onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={() => setIsDragging(false)}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed text-xs font-medium transition-all ${isDragging ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-primary'}`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload files
          </button>
        </div>
        <nav className="flex-1 p-2">
          {folders.map(folder => (
            <button key={folder} onClick={() => setActiveFolder(folder)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors ${activeFolder === folder ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              <FolderOpen className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{folder}</span>
              <span className="ml-auto text-xs">
                {folder === 'All Files' ? employeeFiles.length : employeeFiles.filter(f => f.folder === folder).length}
              </span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden mb-1">
            <div className="h-full bg-primary rounded-full" style={{ width: '34%' }} />
          </div>
          <p className="text-xs text-muted-foreground">3.4 GB of 10 GB used</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-5 py-4 bg-white border-b border-border flex items-center gap-3 flex-shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}>
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-muted text-muted-foreground'}`}>
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Recent (only on All Files) */}
          {activeFolder === 'All Files' && !search && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent</h2>
              <div className="grid grid-cols-4 gap-3">
                {recent.map(f => <FileCard key={f.id} file={f} />)}
              </div>
            </div>
          )}

          {/* All files */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {activeFolder} <span className="ml-1 font-normal">({filtered.length})</span>
              </h2>
            </div>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">No files found</p>
                <p className="text-xs text-muted-foreground">Upload files or ask Command to generate documents for you.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-4 gap-3">
                {filtered.map(f => <FileCard key={f.id} file={f} />)}
              </div>
            ) : (
              <div className="bg-white border border-border rounded-xl overflow-hidden">
                {filtered.map(f => <FileCard key={f.id} file={f} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
