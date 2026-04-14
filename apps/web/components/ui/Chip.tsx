'use client';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Chip({ children, active, onClick, className = '' }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`chip px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
        active
          ? 'bg-saffron-500 text-white border-saffron-500'
          : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-saffron-300'
      } ${className}`}
    >
      {children}
    </button>
  );
}
