import { create } from 'zustand';
import * as api from '@/lib/api';

interface PantryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  storage_zone: string;
  expiry_date: string | null;
  purchase_date: string | null;
  purchase_price: number | null;
}

interface PantryState {
  items: PantryItem[];
  isLoading: boolean;
  fetchItems: () => Promise<void>;
  addItem: (item: unknown) => Promise<PantryItem>;
  updateItem: (id: number, data: unknown) => Promise<PantryItem>;
  deleteItem: (id: number) => Promise<void>;
}

export const usePantryStore = create<PantryState>((set) => ({
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
    set((s) => ({ items: s.items.map((i) => (i.id === id ? updated : i)) }));
    return updated;
  },

  deleteItem: async (id) => {
    await api.deletePantryItem(id);
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },
}));
