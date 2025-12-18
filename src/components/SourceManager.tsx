import { useState, useMemo } from 'react';
import { useUserStore } from '../store/userStore';
import { useSources } from '../hooks/useSources';
import { SourceTable } from './SourceTable';
import type { RootPath } from '../types';
import toast from 'react-hot-toast';

const ROOT_PATHS: RootPath[] = ['sysadmin', 'www', 'amp_set'];

export const SourceManager = () => {
  const userName = useUserStore((state) => state.userName);
  const logout = useUserStore((state) => state.logout);
  const { sources, loading, addSource, updateSource, deleteSource } = useSources();

  const [selectedRoot, setSelectedRoot] = useState<RootPath>('sysadmin');
  const [subPath, setSubPath] = useState('');

  // Filter sources based on search
  const filteredSources = useMemo(() => {
    if (!subPath.trim()) {
      return sources;
    }
    return sources.filter((source) =>
      source.path.toLowerCase().includes(subPath.toLowerCase())
    );
  }, [sources, subPath]);

  const handleAddSource = () => {
    if (!subPath.trim()) {
      toast.error('경로를 입력해주세요');
      return;
    }

    const fullPath = `/${selectedRoot}/${subPath.trim()}`;
    addSource(fullPath);
    setSubPath('');
  };

  const handleLogout = () => {
    logout();
    toast.success('로그아웃 되었습니다');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSource();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#1e3a5f] text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FTP File Checking System</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              <span className="text-gray-300">사용자:</span>{' '}
              <span className="font-medium">{userName}</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            소스 추가
          </h2>

          <div className="space-y-4">
            {/* Root Path Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                루트 경로
              </label>
              <div className="flex gap-2">
                {ROOT_PATHS.map((path) => (
                  <button
                    key={path}
                    onClick={() => setSelectedRoot(path)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedRoot === path
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {path}
                  </button>
                ))}
              </div>
            </div>

            {/* Path Input */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  htmlFor="subpath"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  하위 경로
                </label>
                <div className="flex gap-2">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                    /{selectedRoot}/
                  </span>
                  <input
                    id="subpath"
                    type="text"
                    value={subPath}
                    onChange={(e) => setSubPath(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="예: test.php 또는 검색어 입력"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddSource}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Add Source
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sources Table */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            소스 목록 ({filteredSources.length})
          </h2>
          <SourceTable
            sources={filteredSources}
            onCheck={updateSource}
            onDelete={deleteSource}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          Firebase 기반 실시간 협업 체킹 시스템
        </div>
      </footer>
    </div>
  );
};
