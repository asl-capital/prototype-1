import { ReactNode } from 'react';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  showNav?: boolean;
  className?: string;
}

export default function AppLayout({ children, showNav = true, className = '' }: AppLayoutProps) {
  return (
    <div className="app-shell">
      <main className={`flex-1 ${showNav ? 'pb-20' : ''} ${className}`}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
