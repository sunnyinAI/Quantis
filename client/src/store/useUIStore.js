import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUIStore = create(
  persist(
    (set) => ({
      language: 'en',
      darkMode: false,
      toasts: [],
      setLanguage: (lang) => set({ language: lang }),
      toggleDarkMode: () => set((s) => {
        const next = !s.darkMode;
        if (next) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return { darkMode: next };
      }),
      setDarkMode: (val) => {
        if (val) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        set({ darkMode: val });
      },
      addToast: (message, type = 'info') => {
        const id = Date.now();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => {
          set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 3000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
    }),
    {
      name: 'kharcha-ui',
      partialize: (s) => ({ language: s.language, darkMode: s.darkMode }),
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode) document.documentElement.classList.add('dark');
      },
    }
  )
);
