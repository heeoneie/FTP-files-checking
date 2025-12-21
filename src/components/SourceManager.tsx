import { useState, useMemo } from 'react';
import { useUserStore } from '../store/userStore';
import { useSources } from '../hooks/useSources';
import { SourceTable } from './SourceTable';
import type { RootPath } from '../types';
import toast from 'react-hot-toast';
import { FileCheck2, LogOut, Search, Plus, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';

const ROOT_PATHS: RootPath[] = ['sysadmin', 'www', 'amp_set'];

export const SourceManager = () => {
  const userName = useUserStore((state) => state.userName);
  const logout = useUserStore((state) => state.logout);
  const { sources, loading, addSource, updateSource, deleteSource } = useSources();

  const [selectedRoot, setSelectedRoot] = useState<RootPath>('sysadmin');
  const [newSourcePath, setNewSourcePath] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sources based on search
  const filteredSources = useMemo(() => {
    if (!searchQuery.trim()) {
      return sources;
    }
    return sources.filter((source) =>
      source.path.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sources, searchQuery]);

  const handleAddSource = () => {
    if (!newSourcePath.trim()) {
      toast.error('경로를 입력해주세요');
      return;
    }

    // Remove leading and trailing slashes to prevent double slashes
    const sanitizedPath = newSourcePath.trim().replace(/^\/+|\/+$/g, '');
    const fullPath = `/${selectedRoot}/${sanitizedPath}`;
    addSource(fullPath);
    setNewSourcePath('');
  };

  const handleLogout = () => {
    logout();
    toast.success('로그아웃 되었습니다');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSource();
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="h-screen flex bg-white">
      {/* Sidebar - Notion Style */}
      <div className="w-60 bg-stone-100 border-r border-stone-200 flex flex-col flex-shrink-0">
        {/* Sidebar Header */}
        <div className="p-3 flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500">
              {getInitials(userName || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-stone-800 truncate">{userName}</div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-black/5 rounded">
                <svg className="w-4 h-4 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="w-4 h-4" />
                로그아웃
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 px-2 py-2 space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Workspace
          </div>
          <button className="w-full px-2 py-1.5 text-sm text-stone-800 hover:bg-black/5 rounded flex items-center gap-2">
            <FileCheck2 className="w-4 h-4" />
            FTP File Checking
          </button>
        </div>

        {/* Sidebar Footer - Stats */}
        <div className="p-3 border-t border-stone-200 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">Total Sources</span>
            <span className="font-semibold text-stone-800">{sources.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">My Tasks</span>
            <span className="font-semibold text-blue-600">{sources.filter((s) => s.useUser === userName).length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">Others</span>
            <span className="font-semibold text-stone-800">{sources.filter((s) => s.useUser && s.useUser !== userName).length}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {/* Top Bar - Notion Style */}
            <div className="h-12 flex items-center justify-between px-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <h1 className="text-base font-semibold text-stone-800">소스 목록</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="pl-9 pr-3 py-1.5 text-sm bg-stone-100 border-0 rounded outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 w-64 text-stone-800 placeholder:text-stone-400"
                  />
                </div>
              </div>
            </div>

            {/* Toolbar - Add Source */}
            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-stone-600">Root:</span>
                  <div className="flex gap-1">
                    {ROOT_PATHS.map((path) => (
                      <button
                        key={path}
                        onClick={() => setSelectedRoot(path)}
                        className={`px-3 py-1 text-sm rounded transition-all ${
                          selectedRoot === path
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-white text-stone-800 hover:bg-stone-100 border border-stone-200'
                        }`}
                      >
                        {path}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-white border border-stone-200 rounded overflow-hidden flex-1">
                    <span className="px-3 py-1.5 text-sm text-stone-500 bg-stone-50 border-r border-stone-200 font-mono">
                      /{selectedRoot}/
                    </span>
                    <input
                      type="text"
                      value={newSourcePath}
                      onChange={(e) => setNewSourcePath(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="path/to/file.php"
                      className="px-3 py-1.5 text-sm outline-none flex-1 font-mono text-stone-800"
                    />
                  </div>
                  <button
                    onClick={handleAddSource}
                    className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="px-6 py-4">
              <SourceTable
                sources={filteredSources}
                onCheck={updateSource}
                onDelete={deleteSource}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
