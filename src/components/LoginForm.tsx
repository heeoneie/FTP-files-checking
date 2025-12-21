import { useState } from 'react';
import { ref, runTransaction } from 'firebase/database';
import { database } from '../lib/firebase';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';
import type { UserData } from '../types';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const MIN_NAME_LENGTH = 2;
const MAX_NAME_LENGTH = 20;
// Firebase Realtime Database key constraints
const INVALID_CHARS = /[.$#[\]/]/;

export const LoginForm = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const setUserName = useUserStore((state) => state.setUserName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();

    // Validate input length
    if (!trimmedName) {
      toast.error('이름을 입력해주세요');
      return;
    }

    if (trimmedName.length < MIN_NAME_LENGTH) {
      toast.error(`이름은 최소 ${MIN_NAME_LENGTH}자 이상이어야 합니다`);
      return;
    }

    if (trimmedName.length > MAX_NAME_LENGTH) {
      toast.error(`이름은 최대 ${MAX_NAME_LENGTH}자까지 입력 가능합니다`);
      return;
    }

    // Validate Firebase key constraints
    if (INVALID_CHARS.test(trimmedName)) {
      toast.error('이름에 특수문자(. $ # [ ] /)를 사용할 수 없습니다');
      return;
    }

    setLoading(true);

    try {
      // Use transaction to atomically check and create user
      const userRef = ref(database, `users/${trimmedName}`);

      const result = await runTransaction(userRef, (currentData) => {
        // If user already exists, abort transaction
        if (currentData !== null) {
          return undefined;
        }

        // Create new user atomically
        return {
          name: trimmedName,
          isActive: true,
          loginAt: Date.now(),
        } as UserData;
      });

      if (!result.committed) {
        toast.error('이미 사용 중인 이름입니다');
        setLoading(false);
        return;
      }

      setUserName(trimmedName);
      toast.success(`${trimmedName}님 환영합니다!`);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            FTP File Checking
          </h1>
          <p className="text-sm text-gray-500">
            실시간 협업 체킹 시스템
          </p>
        </div>

        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1.5"
                >
                  이름
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름을 입력하세요"
                  maxLength={MAX_NAME_LENGTH}
                  disabled={loading}
                  className="h-10"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    로그인 중...
                  </>
                ) : (
                  '입장하기'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
