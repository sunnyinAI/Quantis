interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 ${
        onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
