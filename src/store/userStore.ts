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
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;

            const parsed = JSON.parse(str);
            return parsed;
          } catch (error) {
            console.error(
              `Failed to parse localStorage item "${name}":`,
              error
            );
            // Remove corrupted data
            try {
              localStorage.removeItem(name);
            } catch {
              // Silently fail if removeItem also fails
            }
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error(
              `Failed to save to localStorage "${name}":`,
              error
            );
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error(
              `Failed to remove localStorage item "${name}":`,
              error
            );
          }
        },
      },
    }
  )
);
