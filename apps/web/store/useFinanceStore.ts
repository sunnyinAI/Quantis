import { create } from 'zustand';
import * as api from '@/lib/api';
import { getCurrentMonth } from '@/lib/formatters';

interface FinanceState {
  transactions: unknown[];
  bills: unknown[];
  subscriptions: unknown[];
  summary: Record<string, unknown> | null;
  currentMonth: string;
  isLoading: boolean;
  setMonth: (month: string) => void;
  fetchAll: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  addTransaction: (data: unknown) => Promise<unknown>;
  deleteTransaction: (id: number) => Promise<void>;
  addBill: (data: unknown) => Promise<unknown>;
  payBill: (id: number) => Promise<void>;
  deleteBill: (id: number) => Promise<void>;
  addSubscription: (data: unknown) => Promise<unknown>;
  toggleSubscription: (id: number) => Promise<void>;
  deleteSubscription: (id: number) => Promise<void>;
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  bills: [],
  subscriptions: [],
  summary: null,
  currentMonth: getCurrentMonth(),
  isLoading: false,

  setMonth: (month) => set({ currentMonth: month }),

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const month = get().currentMonth;
      const [transactions, bills, subscriptions, summary] = await Promise.all([
        api.getTransactions(month),
        api.getBills(),
        api.getSubscriptions(),
        api.getFinanceSummary(month),
      ]);
      set({ transactions, bills, subscriptions, summary, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    const month = get().currentMonth;
    const summary = await api.getFinanceSummary(month);
    set({ summary });
  },

  addTransaction: async (data) => {
    const tx = await api.addTransaction(data);
    set((s) => ({ transactions: [tx, ...s.transactions] }));
    get().fetchSummary();
    return tx;
  },

  deleteTransaction: async (id) => {
    await api.deleteTransaction(id);
    set((s) => ({
      transactions: (s.transactions as { id: number }[]).filter((t) => t.id !== id),
    }));
    get().fetchSummary();
  },

  addBill: async (data) => {
    const bill = await api.addBill(data);
    set((s) => ({ bills: [...s.bills, bill] }));
    return bill;
  },

  payBill: async (id) => {
    const bill = await api.payBill(id);
    set((s) => ({
      bills: (s.bills as { id: number }[]).map((b) => (b.id === id ? bill : b)),
    }));
  },

  deleteBill: async (id) => {
    await api.deleteBill(id);
    set((s) => ({
      bills: (s.bills as { id: number }[]).filter((b) => b.id !== id),
    }));
  },

  addSubscription: async (data) => {
    const sub = await api.addSubscription(data);
    set((s) => ({ subscriptions: [...s.subscriptions, sub] }));
    return sub;
  },

  toggleSubscription: async (id) => {
    const sub = await api.toggleSubscription(id);
    set((s) => ({
      subscriptions: (s.subscriptions as { id: number }[]).map((s2) =>
        s2.id === id ? sub : s2,
      ),
    }));
  },

  deleteSubscription: async (id) => {
    await api.deleteSubscription(id);
    set((s) => ({
      subscriptions: (s.subscriptions as { id: number }[]).filter((s2) => s2.id !== id),
    }));
  },
}));
