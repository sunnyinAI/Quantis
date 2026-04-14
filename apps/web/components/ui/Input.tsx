import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = '', prefix, suffix, ...props },
  ref,
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={`w-full bg-gray-50 dark:bg-gray-700 border ${
            error ? 'border-red-400' : 'border-gray-200 dark:border-gray-600'
          } rounded-xl px-4 py-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-400' : 'focus:ring-saffron-400'
          } transition-all ${prefix ? 'pl-9' : ''} ${suffix ? 'pr-9' : ''} ${className}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
