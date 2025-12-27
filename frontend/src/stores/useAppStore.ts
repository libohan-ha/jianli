import { create } from 'zustand';
import type { UserInfo } from '../types';

interface AppState {
  // 用户信息
  user: {
    isLoggedIn: boolean;
    userInfo: UserInfo | null;
  };

  // 加载状态
  loading: {
    global: boolean;
    upload: boolean;
    analysis: boolean;
  };

  // Actions
  setUser: (userInfo: UserInfo | null) => void;
  setLoading: (key: keyof AppState['loading'], value: boolean) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    isLoggedIn: false,
    userInfo: null,
  },

  loading: {
    global: false,
    upload: false,
    analysis: false,
  },

  setUser: (userInfo) =>
    set({
      user: {
        isLoggedIn: !!userInfo,
        userInfo,
      },
    }),

  setLoading: (key, value) =>
    set((state) => ({
      loading: {
        ...state.loading,
        [key]: value,
      },
    })),

  logout: () =>
    set({
      user: {
        isLoggedIn: false,
        userInfo: null,
      },
    }),
}));

export default useAppStore;