import { useState, useEffect } from 'react';
import type { Source } from '../types';
import { useUserStore } from '../store/userStore';

interface SourceTableProps {
  sources: Source[];
  onCheck: (id: string, userName: string) => void;
  onDelete: (id: string) => void;
}

export const SourceTable = ({ sources, onCheck, onDelete }: SourceTableProps) => {
  const userName = useUserStore((state) => state.userName);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    sourceId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    sourceId: null,
  });

  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ visible: false, x: 0, y: 0, sourceId: null });
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const handleContextMenu = (e: React.MouseEvent, sourceId: string) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      sourceId,
    });
  };

  const handleDelete = () => {
    if (contextMenu.sourceId) {
      onDelete(contextMenu.sourceId);
      setContextMenu({ visible: false, x: 0, y: 0, sourceId: null });
    }
  };

  const handleCheckboxChange = (source: Source) => {
    if (!userName) return;

    // Toggle: if already checked by current user, uncheck; otherwise check
    const isChecked = source.useUser === userName;
    onCheck(source.id, isChecked ? '' : userName);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-[#1e3a5f] text-white">
            <tr>
              <th className="py-3 px-4 text-left w-20">체크</th>
              <th className="py-3 px-4 text-left">Source</th>
              <th className="py-3 px-4 text-left w-40">Use user</th>
              <th className="py-3 px-4 text-left w-40">Last user</th>
              <th className="py-3 px-4 text-left w-40">Last update date</th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
                  등록된 소스가 없습니다
                </td>
              </tr>
            ) : (
              sources.map((source) => {
                const isCheckedByMe = source.useUser === userName;
                return (
                  <tr
                    key={source.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      isCheckedByMe ? 'bg-[#fff3e0]' : ''
                    }`}
                    onContextMenu={(e) => handleContextMenu(e, source.id)}
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={!!source.useUser}
                        onChange={() => handleCheckboxChange(source)}
                        className="w-5 h-5 cursor-pointer accent-orange-500"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">
                      {source.path}
                    </td>
                    <td className="py-3 px-4">{source.useUser}</td>
                    <td className="py-3 px-4">{source.lastUser}</td>
                    <td className="py-3 px-4">{source.lastUpdateDate}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-gray-300 rounded shadow-lg z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            onClick={handleDelete}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 whitespace-nowrap"
          >
            삭제
          </button>
        </div>
      )}
    </>
  );
};
