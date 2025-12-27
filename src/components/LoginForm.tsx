import { useState } from 'react';
import { ref, runTransaction } from 'firebase/database';
import { database } from '../lib/firebase';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';
import type { UserData } from '../types';
import { Loader2 } from 'lucide-react';

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
    <div className="auth-hero">
      <div className="auth-panel">
        <div>
          <p className="auth-panel__eyebrow">Live workspace</p>
          <h1 className="auth-panel__title">FTP File Checking</h1>
          <p className="auth-panel__description">
            팀원이 동시에 같은 파일을 만지지 않도록 출입 명부를 남겨주세요.
            이름은 한 세션 동안 고유하게 유지됩니다.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div>
            <label htmlFor="name" className="form-label">
              작업자 이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: heeeione"
              maxLength={MAX_NAME_LENGTH}
              disabled={loading}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              '워크스페이스 입장'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
