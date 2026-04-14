'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePantryStore } from '@/store/usePantryStore';
import { useUIStore } from '@/store/useUIStore';
import Sheet from '@/components/ui/Sheet';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EmptyState from '@/components/ui/EmptyState';
import Chip from '@/components/ui/Chip';
import { GROCERY_CATEGORIES, UNITS } from '@/config/constants';
import { getExpiryStatus, formatDate } from '@/lib/formatters';

const ZONES = [
  { id: 'all', label: 'All' },
  { id: 'shelf', label: '🏠 Shelf' },
  { id: 'fridge', label: '❄️ Fridge' },
  { id: 'freezer', label: '🧊 Freezer' },
];

const EXPIRY_COLORS: Record<string, string> = {
  expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  today: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  ok: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
};

export default function PantryPage() {
  const { items, fetchItems, addItem, deleteItem } = usePantryStore();
  const { addToast } = useUIStore();
  const [zone, setZone] = useState('all');
  const [showSheet, setShowSheet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', quantity: '1', unit: 'piece', category: 'household',
    storage_zone: 'shelf', expiry_date: '', purchase_date: '', purchase_price: '',
  });

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = zone === 'all' ? items : items.filter((i) => i.storage_zone === zone);
  const expiringCount = items.filter((i) => {
    const s = getExpiryStatus(i.expiry_date);
    return s && ['expired', 'today', 'critical', 'warning'].includes(s.status);
  }).length;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      await addItem({
        ...form,
        quantity: parseFloat(form.quantity) || 1,
        purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
      });
      setForm({ name: '', quantity: '1', unit: 'piece', category: 'household', storage_zone: 'shelf', expiry_date: '', purchase_date: '', purchase_price: '' });
      setShowSheet(false);
      addToast('Item added to pantry', 'success');
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {expiringCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">{expiringCount} item{expiringCount > 1 ? 's' : ''} expiring soon</p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500">Use them before they go bad</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {ZONES.map((z) => <Chip key={z.id} active={zone === z.id} onClick={() => setZone(z.id)}>{z.label}</Chip>)}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon="🗄️" title="Pantry is empty" description="Track your grocery stock and expiry dates"
          action={<Button onClick={() => setShowSheet(true)}>Add Item</Button>} />
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((item) => {
              const cat = GROCERY_CATEGORIES.find((c) => c.id === item.category);
              const expiry = getExpiryStatus(item.expiry_date);
              return (
                <motion.div key={item.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-800 dark:text-gray-100">{item.name}</span>
                        {cat && <span className={`text-xs px-2 py-0.5 rounded-full ${cat.colorClass}`}>{cat.icon} {cat.label}</span>}
                        {expiry && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${EXPIRY_COLORS[expiry.status]}`}>{expiry.label}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span>{item.quantity} {item.unit}</span>
                        <span className="capitalize">{item.storage_zone === 'shelf' ? '🏠' : item.storage_zone === 'fridge' ? '❄️' : '🧊'} {item.storage_zone}</span>
                        {item.expiry_date && <span>Exp: {formatDate(item.expiry_date)}</span>}
                        {item.purchase_price && <span>₹{item.purchase_price}</span>}
                      </div>
                    </div>
                    <button onClick={() => deleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowSheet(true)}
        className="fixed bottom-24 right-4 w-14 h-14 bg-saffron-500 text-white rounded-full shadow-lg flex items-center justify-center z-20">
        <Plus size={24} />
      </motion.button>

      <Sheet isOpen={showSheet} onClose={() => setShowSheet(false)} title="Add to Pantry">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input label="Item Name *" placeholder="e.g. Basmati Rice, Cooking Oil..." value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} autoFocus />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Quantity" type="number" min="0" step="0.1" value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Unit</label>
              <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-400 text-gray-900 dark:text-gray-100">
                {UNITS.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage Zone</label>
            <div className="flex gap-2">
              {['shelf', 'fridge', 'freezer'].map((z) => (
                <button key={z} type="button" onClick={() => setForm({ ...form, storage_zone: z })}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${form.storage_zone === z ? 'bg-saffron-500 text-white border-saffron-500' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                  {z === 'shelf' ? '🏠' : z === 'fridge' ? '❄️' : '🧊'} {z}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Expiry Date" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
            <Input label="Purchase Price (₹)" type="number" min="0" prefix="₹" value={form.purchase_price} onChange={(e) => setForm({ ...form, purchase_price: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowSheet(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={loading} className="flex-1">Add to Pantry</Button>
          </div>
        </form>
      </Sheet>
    </div>
  );
}
