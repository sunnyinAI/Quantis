'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useUIStore } from '@/store/useUIStore';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertCircle,
};

const COLORS = {
  success: 'bg-kgreen-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-gray-800 text-white dark:bg-gray-700',
  warning: 'bg-amber-500 text-white',
};

export default function ToastProvider() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-4 z-[100] pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-3 p-4 rounded-2xl shadow-lg mb-2 pointer-events-auto ${COLORS[toast.type] || COLORS.info}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1 text-sm font-medium">{toast.message}</span>
              <button onClick={() => removeToast(toast.id)}>
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
