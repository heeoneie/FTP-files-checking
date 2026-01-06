import { useEffect, useState, useMemo } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Source, SourceData } from '../types';
import toast from 'react-hot-toast';
import { useUserStore } from '../store/userStore';

export const useSources = () => {
  const [rawSources, setRawSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useUserStore((state) => state.userName);

  useEffect(() => {
    const sourcesRef = ref(database, 'sources');

    const unsubscribe = onValue(
      sourcesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const sourcesArray: Source[] = Object.entries(data).map(
            ([id, value]) => ({
              id,
              ...(value as SourceData),
            })
          );

          setRawSources(sourcesArray);
        } else {
          setRawSources([]);
        }
        setLoading(false);
      },
      (error: any) => {
        console.error('Error fetching sources:', error?.code || error?.message || 'Unknown error');
        toast.error('데이터를 불러오는데 실패했습니다');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const sources = useMemo(() => {
    return [...rawSources].sort((a, b) => {
      const aOwned = a.useUser === currentUser;
      const bOwned = b.useUser === currentUser;

      if (aOwned && !bOwned) return -1;
      if (!aOwned && bOwned) return 1;

      return a.path.localeCompare(b.path, undefined, {
        sensitivity: 'base',
        numeric: true,
      });
    });
  }, [rawSources, currentUser]);

  const addSource = async (path: string) => {
    try {
      const sourcesRef = ref(database, 'sources');
      const newSource: SourceData = {
        path,
        useUser: '',
        lastUser: '',
        lastUpdateDate: '',
        timestamp: Date.now(),
      };
      await push(sourcesRef, newSource);
      toast.success('소스가 추가되었습니다');
    } catch (error: any) {
      console.error('Error adding source:', error?.code || error?.message || 'Unknown error');
      toast.error('소스 추가에 실패했습니다');
    }
  };

  const updateSource = async (source: Source, nextUserName: string) => {
    try {
      const sourceRef = ref(database, `sources/${source.id}`);
      const today = new Date().toISOString().split('T')[0];
      const previousUser = source.useUser || source.lastUser;

      if (nextUserName) {
        await update(sourceRef, {
          useUser: nextUserName,
          lastUser: previousUser || '',
          lastUpdateDate: today,
          timestamp: Date.now(),
        });
        toast.success(`${nextUserName}님이 파일을 체크했습니다`);
      } else {
        await update(sourceRef, {
          useUser: '',
          lastUser: previousUser || '',
          lastUpdateDate: today,
          timestamp: Date.now(),
        });
        toast.success('체크를 해제했습니다');
      }
    } catch (error: any) {
      console.error('Error updating source:', error?.code || error?.message || 'Unknown error');
      toast.error('체크 업데이트에 실패했습니다');
    }
  };

  const deleteSource = async (id: string) => {
    try {
      const sourceRef = ref(database, `sources/${id}`);
      await remove(sourceRef);
      toast.success('소스가 삭제되었습니다');
    } catch (error: any) {
      console.error('Error deleting source:', error?.code || error?.message || 'Unknown error');
      toast.error('소스 삭제에 실패했습니다');
    }
  };

  return {
    sources,
    loading,
    addSource,
    updateSource,
    deleteSource,
  };
};
