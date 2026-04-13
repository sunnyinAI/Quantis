import { create } from 'zustand';
import * as api from '../lib/api';

export const usePantryStore = create((set) => ({
  items: [],
  isLoading: false,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const items = await api.getPantryItems();
      set({ items, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    const newItem = await api.addPantryItem(item);
    set((s) => ({ items: [newItem, ...s.items] }));
    return newItem;
  },

  updateItem: async (id, data) => {
    const updated = await api.updatePantryItem(id, data);
    set((s) => ({ items: s.items.map((i) => i.id === id ? updated : i) }));
    return updated;
  },

  deleteItem: async (id) => {
    await api.deletePantryItem(id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },
}));
