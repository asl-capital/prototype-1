import { motion } from 'framer-motion';
import { MessageCircle, Building2, FileText, TrendingUp, Settings } from 'lucide-react';
import type { NavTab } from '@/types/chat';

interface ChatBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const navItems: { tab: NavTab; label: string; icon: typeof MessageCircle }[] = [
  { tab: 'chat', label: 'أصيل', icon: MessageCircle },
  { tab: 'properties', label: 'عقاراتي', icon: Building2 },
  { tab: 'loans', label: 'تمويلاتي', icon: FileText },
  { tab: 'credit', label: 'تقييمي', icon: TrendingUp },
  { tab: 'settings', label: 'الإعدادات', icon: Settings },
];

export default function ChatBottomNav({ activeTab, onTabChange }: ChatBottomNavProps) {
  return (
    <nav
      className="bg-white border-t border-border/50 flex items-center justify-around px-2"
      dir="rtl"
      style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.tab;
        const Icon = item.icon;

        return (
          <button
            key={item.tab}
            onClick={() => onTabChange(item.tab)}
            className="relative flex flex-col items-center gap-0.5 py-2 px-3 min-w-[56px] transition-colors duration-200"
          >
            {/* Active indicator dot */}
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-[#D4A64A]"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}

            <Icon
              className={`w-5 h-5 transition-colors duration-200 ${
                isActive ? 'text-[#D4A64A]' : 'text-muted-foreground'
              }`}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span
              className={`text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-[#D4A64A]' : 'text-muted-foreground'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
