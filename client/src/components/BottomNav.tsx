import { useLocation, Link } from 'wouter';
import { Home, Building2, Wallet, TrendingUp, MoreHorizontal } from 'lucide-react';

const navItems = [
  { path: '/home', label: 'الرئيسية', icon: Home },
  { path: '/properties', label: 'عقاراتي', icon: Building2 },
  { path: '/loans', label: 'التمويل', icon: Wallet },
  { path: '/credit', label: 'الملف الائتماني', icon: TrendingUp },
  { path: '/settings', label: 'المزيد', icon: MoreHorizontal },
];

export default function BottomNav() {
  const [location] = useLocation();
  
  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location === item.path || 
          (item.path === '/properties' && location.startsWith('/property')) ||
          (item.path === '/loans' && (
            location.startsWith('/loan-design') ||
            location.startsWith('/disclosures') ||
            location.startsWith('/decision') ||
            location.startsWith('/contract') ||
            location.startsWith('/najiz-sign') ||
            location.startsWith('/sharia-execution') ||
            location.startsWith('/disbursement')
          ));
        
        return (
          <Link key={item.path} href={item.path}>
            <div className={`bottom-nav-item ${isActive ? 'bottom-nav-item-active' : ''}`}>
              <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
