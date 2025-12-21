import { useState, useEffect } from 'react';
import type { Source } from '../types';
import { useUserStore } from '../store/userStore';
import { Trash2, FileCode } from 'lucide-react';

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
      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-stone-200">
              <th className="w-12 py-2 px-4 text-left bg-stone-50">
                <div className="w-4 h-4 rounded border border-stone-300 bg-white" />
              </th>
              <th className="py-2 px-3 text-left text-xs font-semibold text-stone-600 bg-stone-50">
                Source
              </th>
              <th className="w-40 py-2 px-3 text-left text-xs font-semibold text-stone-600 bg-stone-50">
                Use user
              </th>
              <th className="w-40 py-2 px-3 text-left text-xs font-semibold text-stone-600 bg-stone-50">
                Last user
              </th>
              <th className="w-48 py-2 px-3 text-left text-xs font-semibold text-stone-600 bg-stone-50">
                Last update
              </th>
            </tr>
          </thead>
          <tbody>
            {sources.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-32 text-center">
                  <div className="flex flex-col items-center gap-3 text-stone-400">
                    <FileCode className="w-12 h-12" />
                    <p className="text-sm">No sources yet</p>
                    <p className="text-xs">Add your first source to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              sources.map((source) => {
                const isCheckedByMe = source.useUser === userName;

                return (
                  <tr
                    key={source.id}
                    className={`border-b border-stone-200 ${
                      isCheckedByMe ? 'bg-blue-50/30' : ''
                    } hover:bg-stone-50 transition-colors`}
                    onContextMenu={(e) => handleContextMenu(e, source.id)}
                  >
                    <td className="py-2 px-3">
                      <input
                        type="checkbox"
                        checked={!!source.useUser}
                        onChange={() => handleCheckboxChange(source)}
                        className="w-4 h-4 cursor-pointer rounded border-stone-300 text-blue-600 focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <span className="font-mono text-sm text-stone-900">{source.path}</span>
                    </td>
                    <td className="py-2 px-3">
                      {source.useUser ? (
                        <span className="text-sm text-stone-900">{source.useUser}</span>
                      ) : (
                        <span className="text-sm text-stone-400">-</span>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-sm text-stone-600">
                        {source.lastUser || '-'}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className="text-sm text-stone-500">
                        {source.lastUpdateDate || '-'}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {contextMenu.visible && (
        <div
          className="fixed bg-white border border-stone-200 rounded-md shadow-xl z-50 py-1"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </>
  );
};
