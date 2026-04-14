import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import { useOffline } from '../../hooks/useOffline';
import ToastProvider from '../ui/ToastProvider';

const PAGE_TITLES = {
  '/': 'Kharcha',
  '/grocery': 'Grocery List',
  '/prices': 'Price Compare',
  '/pantry': 'Pantry',
  '/finance': 'Finance',
  '/mandi': 'Mandi Prices',
  '/meals': 'Meal Planner',
  '/assistant': 'Ask Kharcha',
  '/collaborate': 'Share List',
  '/settings': 'Settings',
};

export default function AppShell() {
  const location = useLocation();
  const isOffline = useOffline();
  const title = PAGE_TITLES[location.pathname] || 'Kharcha';

  return (
    <div className="flex flex-col min-h-screen min-h-dvh">
      <TopBar title={title} />
      {isOffline && (
        <div className="bg-amber-500 text-white text-xs text-center py-1 px-4">
          You're offline — some features may not be available
        </div>
      )}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <BottomNav />
      <ToastProvider />
    </div>
  );
}
