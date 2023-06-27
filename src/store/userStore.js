import { create } from 'zustand';
import { persist } from 'zustand/middleware';
const useUserStore = create(
  persist(
    (set, get) => ({
      username: '',
      password: '',
      avatar: '',
      setUsername: (username) => set({ username: username }),
      setPassword: (pass) => set({ password: pass }),
      setAvatar: (path) => set({ avatar: path }),
    }),
    {
      name: 'user-storage',
      getStorage: () => sessionStorage,
    },
  ),
);

export default useUserStore;
