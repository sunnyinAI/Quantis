import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function Sheet({ isOpen, onClose, title, children, className = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white dark:bg-gray-800 rounded-t-3xl z-50 max-h-[90vh] flex flex-col ${className}`}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
              <div className="w-10 h-1 bg-gray-200 dark:bg-gray-600 rounded-full absolute top-3 left-1/2 -translate-x-1/2" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mt-2">{title}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mt-2"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-5 py-4 pb-8">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
