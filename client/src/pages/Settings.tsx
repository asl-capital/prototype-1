import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, HelpCircle, FileText, LogOut, 
  ChevronLeft, Moon, Sun, Globe, Phone, Mail, Building2 
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Settings Screen
 * - Profile section
 * - Security settings
 * - Notifications
 * - Support & legal
 * - Logout
 */

interface SettingItem {
  id: string;
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: () => void;
  toggle?: boolean;
  value?: boolean;
  danger?: boolean;
}

export default function Settings() {
  const [, navigate] = useLocation();
  const { phoneNumber, setIsAuthenticated } = useAppState();
  const [notifications, setNotifications] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };
  
  const profileSettings: SettingItem[] = [
    {
      id: 'profile',
      icon: User,
      label: 'الملف الشخصي',
      description: 'تعديل بياناتك الشخصية',
      action: () => {}
    },
    {
      id: 'security',
      icon: Shield,
      label: 'الأمان والخصوصية',
      description: 'إدارة كلمة المرور والتحقق',
      action: () => {}
    },
  ];
  
  const appSettings: SettingItem[] = [
    {
      id: 'notifications',
      icon: Bell,
      label: 'الإشعارات',
      description: 'تنبيهات الأقساط والعروض',
      toggle: true,
      value: notifications,
      action: () => setNotifications(!notifications)
    },
  ];
  
  const supportSettings: SettingItem[] = [
    {
      id: 'help',
      icon: HelpCircle,
      label: 'المساعدة والدعم',
      description: 'الأسئلة الشائعة والتواصل',
      action: () => {}
    },
    {
      id: 'terms',
      icon: FileText,
      label: 'الشروط والأحكام',
      action: () => {}
    },
    {
      id: 'privacy',
      icon: Shield,
      label: 'سياسة الخصوصية',
      action: () => {}
    },
  ];
  
  const renderSettingItem = (item: SettingItem) => (
    <motion.button
      key={item.id}
      whileTap={{ scale: 0.98 }}
      onClick={item.action}
      className={`w-full flex items-center justify-between p-4 bg-white rounded-xl border border-border ${
        item.danger ? 'hover:bg-red-50' : 'hover:bg-secondary/50'
      } transition-colors`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          item.danger ? 'bg-red-100' : 'bg-primary/10'
        }`}>
          <item.icon className={`w-5 h-5 ${item.danger ? 'text-red-600' : 'text-primary'}`} />
        </div>
        <div className="text-right">
          <p className={`font-medium ${item.danger ? 'text-red-600' : 'text-foreground'}`}>
            {item.label}
          </p>
          {item.description && (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          )}
        </div>
      </div>
      
      {item.toggle ? (
        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
          item.value ? 'bg-primary' : 'bg-muted'
        }`}>
          <motion.div
            className="w-5 h-5 rounded-full bg-white shadow"
            animate={{ x: item.value ? 0 : 20 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      ) : (
        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
      )}
    </motion.button>
  );
  
  return (
    <AppLayout>
      <div className="safe-area-top px-5 pt-4 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة حسابك وتفضيلاتك</p>
        </motion.div>
        
        {/* User card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-floating mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">محمد أحمد</p>
              <p className="text-sm text-muted-foreground" dir="ltr">+966 {phoneNumber || '5XX XXX XXX'}</p>
            </div>
          </div>
        </motion.div>
        
        {/* Profile settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">الحساب</h2>
          <div className="space-y-2">
            {profileSettings.map(renderSettingItem)}
          </div>
        </motion.div>
        
        {/* App settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">التطبيق</h2>
          <div className="space-y-2">
            {appSettings.map(renderSettingItem)}
          </div>
        </motion.div>
        
        {/* Support settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">الدعم والقانونية</h2>
          <div className="space-y-2">
            {supportSettings.map(renderSettingItem)}
          </div>
        </motion.div>
        
        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {renderSettingItem({
            id: 'logout',
            icon: LogOut,
            label: 'تسجيل الخروج',
            danger: true,
            action: () => setShowLogoutConfirm(true)
          })}
        </motion.div>
        
        {/* App version */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          أصل للتمويل - الإصدار 1.0.0
        </motion.p>
      </div>
      
      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-background rounded-2xl p-6 z-50"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <LogOut className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">تسجيل الخروج</h3>
                <p className="text-muted-foreground mb-6">
                  هل أنت متأكد من رغبتك في تسجيل الخروج؟
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 btn-secondary"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 bg-red-600 text-white font-semibold py-3 px-6 rounded-xl"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
