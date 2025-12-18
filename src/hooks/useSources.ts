import { useEffect, useState } from 'react';
import { ref, onValue, push, update, remove } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Source, SourceData } from '../types';
import toast from 'react-hot-toast';

export const useSources = () => {
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);

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
          // Sort by timestamp descending (newest first)
          sourcesArray.sort((a, b) => b.timestamp - a.timestamp);
          setSources(sourcesArray);
        } else {
          setSources([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching sources:', error);
        toast.error('데이터를 불러오는데 실패했습니다');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

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
    } catch (error) {
      console.error('Error adding source:', error);
      toast.error('소스 추가에 실패했습니다');
    }
  };

  const updateSource = async (id: string, userName: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const sourceRef = ref(database, `sources/${id}`);
      await update(sourceRef, {
        useUser: userName,
        lastUser: userName,
        lastUpdateDate: today,
        timestamp: Date.now(),
      });
      toast.success(`${userName}님이 파일을 체크했습니다`);
    } catch (error) {
      console.error('Error updating source:', error);
      toast.error('체크 업데이트에 실패했습니다');
    }
  };

  const deleteSource = async (id: string) => {
    try {
      const sourceRef = ref(database, `sources/${id}`);
      await remove(sourceRef);
      toast.success('소스가 삭제되었습니다');
    } catch (error) {
      console.error('Error deleting source:', error);
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
