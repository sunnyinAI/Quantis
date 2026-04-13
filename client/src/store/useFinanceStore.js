import { create } from 'zustand';
import * as api from '../lib/api';
import { getCurrentMonth } from '../lib/formatters';

export const useFinanceStore = create((set, get) => ({
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

  addTransaction: async (data) => {
    const tx = await api.addTransaction(data);
    set((s) => ({ transactions: [tx, ...s.transactions] }));
    get().fetchSummary();
    return tx;
  },

  deleteTransaction: async (id) => {
    await api.deleteTransaction(id);
    set((s) => ({ transactions: s.transactions.filter((t) => t.id !== id) }));
    get().fetchSummary();
  },

  addBill: async (data) => {
    const bill = await api.addBill(data);
    set((s) => ({ bills: [...s.bills, bill] }));
    return bill;
  },

  payBill: async (id) => {
    const bill = await api.payBill(id);
    set((s) => ({ bills: s.bills.map((b) => b.id === id ? bill : b) }));
  },

  deleteBill: async (id) => {
    await api.deleteBill(id);
    set((s) => ({ bills: s.bills.filter((b) => b.id !== id) }));
  },

  addSubscription: async (data) => {
    const sub = await api.addSubscription(data);
    set((s) => ({ subscriptions: [...s.subscriptions, sub] }));
    return sub;
  },

  toggleSubscription: async (id) => {
    const sub = await api.toggleSubscription(id);
    set((s) => ({ subscriptions: s.subscriptions.map((s2) => s2.id === id ? sub : s2) }));
  },

  deleteSubscription: async (id) => {
    await api.deleteSubscription(id);
    set((s) => ({ subscriptions: s.subscriptions.filter((s2) => s2.id !== id) }));
  },

  fetchSummary: async () => {
    const month = get().currentMonth;
    const summary = await api.getFinanceSummary(month);
    set({ summary });
  },
}));
