import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  userName: string | null;
  setUserName: (name: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,
      setUserName: (name: string) => set({ userName: name }),
      logout: () => set({ userName: null }),
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          sessionStorage.removeItem(name);
        },
      },
    }
  )
);
