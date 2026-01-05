import { useState, useEffect } from 'react';
import type { Source } from '../types';
import { useUserStore } from '../store/userStore';
import { Trash2, FileCode } from 'lucide-react';
import toast from 'react-hot-toast';

interface SourceTableProps {
  sources: Source[];
  onCheck: (source: Source, userName: string) => void;
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

    if (source.useUser && source.useUser !== userName) {
      toast.error(`${source.useUser}님이 사용 중입니다`);
      return;
    }

    const isChecked = source.useUser === userName;
    onCheck(source, isChecked ? '' : userName);
  };

  return (
    <>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: '56px' }} aria-label="선택" />
            <th>Source</th>
            <th>Use user</th>
            <th>Last user</th>
            <th>Last update</th>
          </tr>
        </thead>
        <tbody>
          {sources.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <div className="empty-state">
                  <FileCode className="empty-state__icon" />
                  <p>아직 등록된 경로가 없습니다.</p>
                  <p>좌측 입력창에서 첫 번째 경로를 추가해 보세요.</p>
                </div>
              </td>
            </tr>
          ) : (
            sources.map((source) => {
              const isCheckedByMe = source.useUser === userName;
              const usageClass = source.useUser
                ? isCheckedByMe
                  ? 'usage-tag--mine'
                  : 'usage-tag--busy'
                : 'usage-tag--idle';

              return (
                <tr
                  key={source.id}
                  onContextMenu={(e) => handleContextMenu(e, source.id)}
                >
                  <td>
                      <input
                        type="checkbox"
                        checked={!!source.useUser}
                        onChange={() => handleCheckboxChange(source)}
                        disabled={!!source.useUser && source.useUser !== userName}
                        className="table-checkbox"
                      />
                  </td>
                  <td>
                    <span className="path-label">{source.path}</span>
                  </td>
                  <td>
                    <span className={`usage-tag ${usageClass}`}>
                      {source.useUser ? source.useUser : '대기 중'}
                    </span>
                  </td>
                  <td>{source.lastUser || '-'}</td>
                  <td>{source.lastUpdateDate || '-'}</td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          <button onClick={handleDelete}>
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
        </div>
      )}
    </>
  );
};
