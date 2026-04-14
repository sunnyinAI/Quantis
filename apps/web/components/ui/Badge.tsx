interface BadgeProps {
  children: React.ReactNode;
  color?: 'gray' | 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'saffron';
  className?: string;
}

export default function Badge({ children, color = 'gray', className = '' }: BadgeProps) {
  const colors = {
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    saffron: 'bg-saffron-100 text-saffron-800 dark:bg-saffron-900/30 dark:text-saffron-300',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
