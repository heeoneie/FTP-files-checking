import { useState, useMemo } from 'react';
import { useUserStore } from '../store/userStore';
import { useSources } from '../hooks/useSources';
import { SourceTable } from './SourceTable';
import type { RootPath } from '../types';
import toast from 'react-hot-toast';
import { FileCheck2, LogOut, Search, Plus, Loader2 } from 'lucide-react';
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
      <div className="loading-screen" aria-live="polite">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p>워크스페이스를 준비하는 중입니다...</p>
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

  const totalSources = sources.length;
  const mySources = sources.filter((s) => s.useUser === userName).length;
  const busySources = sources.filter((s) => s.useUser && s.useUser !== userName).length;

  return (
    <div className="dashboard-shell">
      <aside className="workspace-panel">
        <div className="workspace-panel__profile">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="text-sm bg-blue-100 text-blue-700">
              {getInitials(userName || 'U')}
            </AvatarFallback>
          </Avatar>
          <div className="profile-meta">
            <div className="profile-name">{userName}</div>
            <div className="profile-role">Workspace member</div>
          </div>
          <button className="ghost-button" type="button" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <div className="workspace-panel__stats">
          <div className="stat-card">
            <div className="stat-label">전체</div>
            <div className="stat-value">{totalSources}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">내 작업</div>
            <div className="stat-value">{mySources}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">사용 중</div>
            <div className="stat-value">{busySources}</div>
          </div>
        </div>

        <div className="workspace-panel__list">
          <label>워크스페이스</label>
          <button type="button">
            <FileCheck2 className="w-4 h-4" />
            FTP File Checking
          </button>
        </div>
      </aside>

      <main className="content-panel">
        <header className="content-header">
          <div>
            <span>실시간 현황</span>
            <h2>소스 현황판</h2>
          </div>
          <div className="search-field">
            <Search aria-hidden="true" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="경로 또는 파일명을 검색하세요"
              aria-label="경로 검색"
            />
          </div>
        </header>

        <section className="toolbar">
          <div>
            <p className="form-label">루트 경로</p>
            <div className="pill-group">
              {ROOT_PATHS.map((path) => (
                <button
                  key={path}
                  type="button"
                  onClick={() => setSelectedRoot(path)}
                  className={`pill ${selectedRoot === path ? 'pill--active' : ''}`}
                  aria-pressed={selectedRoot === path}
                >
                  {path}
                </button>
              ))}
            </div>
          </div>

          <div className="path-builder">
            <span className="path-builder__prefix">/{selectedRoot}/</span>
            <input
              type="text"
              value={newSourcePath}
              onChange={(e) => setNewSourcePath(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="path/to/file.php"
              className="path-builder__input"
              aria-label="새 경로 입력"
            />
            <button
              type="button"
              onClick={handleAddSource}
              className="primary-button"
            >
              <Plus className="w-4 h-4" />
              경로 추가
            </button>
          </div>
        </section>

        <section className="content-table">
          <div className="table-card">
            <SourceTable
              sources={filteredSources}
              onCheck={updateSource}
              onDelete={deleteSource}
            />
          </div>
        </section>
      </main>
    </div>
  );
};
