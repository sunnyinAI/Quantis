import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as api from '../lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      sendOtp: async (phone) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.sendOtp(phone);
          set({ isLoading: false });
          return data;
        } catch (err) {
          set({ isLoading: false, error: err.message });
          throw err;
        }
      },

      verifyOtp: async (phone, otp) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.verifyOtp(phone, otp);
          localStorage.setItem('hundi_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (err) {
          set({ isLoading: false, error: err.message });
          throw err;
        }
      },

      logout: async () => {
        try { await api.logout(); } catch { /* no-op */ }
        localStorage.removeItem('hundi_token');
        set({ user: null, token: null });
      },

      updateProfile: async (data) => {
        const res = await api.updateProfile(data);
        set({ user: res.user });
        return res;
      },

      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'hundi-auth',
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) localStorage.setItem('hundi_token', state.token);
      },
    }
  )
);
