import { useState } from 'react';
import { ref, get, push } from 'firebase/database';
import { database } from '../lib/firebase';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';
import type { UserData } from '../types';

export const LoginForm = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const setUserName = useUserStore((state) => state.setUserName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('이름을 입력해주세요');
      return;
    }

    setLoading(true);

    try {
      // Check for duplicate name
      const usersRef = ref(database, 'users');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const users = snapshot.val();
        const isDuplicate = Object.values(users).some(
          (user: any) => user.name === name.trim()
        );

        if (isDuplicate) {
          toast.error('이미 사용 중인 이름입니다');
          setLoading(false);
          return;
        }
      }

      // Add new user
      const newUser: UserData = {
        name: name.trim(),
        isActive: true,
        loginAt: Date.now(),
      };

      await push(usersRef, newUser);
      setUserName(name.trim());
      toast.success(`${name.trim()}님 환영합니다!`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          FTP File Checking
        </h1>
        <p className="text-center text-gray-600 mb-8">
          실시간 협업 체킹 시스템
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '입장하기'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Firebase 기반 실시간 협업 체킹 시스템
        </p>
      </div>
    </div>
  );
};
