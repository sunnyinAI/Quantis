import { motion } from 'framer-motion';

export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-saffron-500' : 'bg-gray-200 dark:bg-gray-600'}`}
      >
        <motion.span
          animate={{ x: checked ? 22 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </button>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
}
