'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, RefreshCw } from 'lucide-react';
import { GROCERY_CATEGORIES } from '@/config/constants';

interface GroceryItemData {
  id: number;
  name: string;
  name_hi?: string;
  quantity: number;
  unit: string;
  category: string;
  is_checked: number;
  is_recurring: number;
}

interface GroceryItemProps {
  item: GroceryItemData;
  onToggle: () => void;
  onDelete: () => void;
}

export default function GroceryItem({ item, onToggle, onDelete }: GroceryItemProps) {
  const [swiped, setSwiped] = useState(false);
  const startX = useRef<number | null>(null);
  const cat =
    GROCERY_CATEGORIES.find((c) => c.id === item.category) ||
    GROCERY_CATEGORIES[GROCERY_CATEGORIES.length - 1];

  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 60) setSwiped(true);
    else if (diff < -40) setSwiped(false);
    startX.current = null;
  };

  return (
    <div className="relative overflow-hidden rounded-xl mb-2">
      <div className="absolute inset-y-0 right-0 w-20 bg-red-500 flex items-center justify-center rounded-r-xl">
        <Trash2 size={20} className="text-white" />
      </div>

      <motion.div
        animate={{ x: swiped ? -80 : 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 flex items-center gap-3"
      >
        <button
          onClick={onToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            item.is_checked
              ? 'bg-kgreen-500 border-kgreen-500'
              : 'border-gray-300 dark:border-gray-500'
          }`}
        >
          {item.is_checked ? <span className="text-white text-xs font-bold">✓</span> : null}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`font-medium text-sm ${
                item.is_checked ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'
              }`}
            >
              {item.name}
            </span>
            {item.is_recurring ? <RefreshCw size={12} className="text-kgreen-500 flex-shrink-0" /> : null}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400">{item.quantity} {item.unit}</span>
            <span className={`text-xs ${cat.colorClass} px-1.5 py-0.5 rounded-full`}>
              {cat.icon} {cat.label}
            </span>
          </div>
          {item.name_hi && (
            <span className="text-xs text-gray-400 font-devanagari">{item.name_hi}</span>
          )}
        </div>

        {swiped && (
          <button onClick={onDelete} className="flex-shrink-0 p-1">
            <Trash2 size={18} className="text-red-500" />
          </button>
        )}
      </motion.div>
    </div>
  );
}
