import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';

const TOP_LEVEL_PAGES = ['/', '/grocery', '/prices', '/pantry', '/finance'];

export default function TopBar({ title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTopLevel = TOP_LEVEL_PAGES.includes(location.pathname);

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
      {!isTopLevel && (
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 -ml-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
        </button>
      )}
      {isTopLevel && (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-saffron-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">ह</span>
          </div>
        </div>
      )}
      <h1 className="flex-1 text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
      <button
        onClick={() => navigate('/settings')}
        className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-gray-500 dark:text-gray-400" />
      </button>
    </header>
  );
}
