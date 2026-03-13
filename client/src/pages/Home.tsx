import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Building2, Wallet, TrendingUp, ArrowLeft, Plus, ChevronLeft, Clock, AlertCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Home Dashboard
 * - Welcome greeting
 * - Quick stats
 * - Quick actions
 * - Recent activity
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

export default function Home() {
  const [, navigate] = useLocation();
  const { properties, loans, creditProfile } = useAppState();
  
  // Calculate stats
  const qualifiedProperties = properties.filter(p => p.qualificationStatus !== 'not_qualified');
  const activeLoans = loans.filter(l => l.status === 'active');
  const totalFinanced = activeLoans.reduce((sum, l) => sum + l.amount, 0);
  const nextPayment = activeLoans[0]?.monthlyPayment || 0;
  
  const quickActions = [
    {
      id: 'new-loan',
      icon: Plus,
      label: 'طلب تمويل جديد',
      description: 'استخدم عقاراتك كضمان',
      color: 'bg-primary',
      action: () => navigate('/properties')
    },
    {
      id: 'properties',
      icon: Building2,
      label: 'عقاراتي',
      description: `${properties.length} عقارات مسجلة`,
      color: 'bg-[#1B4965]',
      action: () => navigate('/properties')
    },
    {
      id: 'credit',
      icon: TrendingUp,
      label: 'الملف الائتماني',
      description: creditProfile?.bankLinked ? `مؤشر الأهلية: ${creditProfile.eligibilityScore}` : 'اربط حسابك البنكي',
      color: 'bg-green-600',
      action: () => navigate('/credit')
    },
  ];
  
  return (
    <AppLayout>
      <div className="safe-area-top">
        {/* Header */}
        <div className="px-5 pt-4 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-muted-foreground mb-1">مرحباً بك في</p>
            <h1 className="text-3xl font-bold text-foreground">أصل</h1>
          </motion.div>
        </div>
        
        {/* Stats cards */}
        <div className="px-5 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {/* Total financed */}
            <div className="card-floating">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Wallet className="w-4 h-4" />
                <span className="text-xs">إجمالي التمويل</span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(totalFinanced)} <span className="text-sm font-normal">ر.س</span>
              </p>
            </div>
            
            {/* Next payment */}
            <div className="card-floating">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Clock className="w-4 h-4" />
                <span className="text-xs">القسط القادم</span>
              </div>
              <p className="text-xl font-bold text-primary">
                {formatCurrency(nextPayment)} <span className="text-sm font-normal">ر.س</span>
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Quick actions */}
        <div className="px-5 mb-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-semibold text-foreground mb-4"
          >
            الإجراءات السريعة
          </motion.h2>
          
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={action.action}
                className="w-full card-premium flex items-center gap-4 text-right"
              >
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{action.label}</p>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Active loans summary */}
        {activeLoans.length > 0 && (
          <div className="px-5 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">التمويلات النشطة</h2>
                <button 
                  onClick={() => navigate('/loans')}
                  className="text-primary text-sm font-medium flex items-center gap-1"
                >
                  <span>عرض الكل</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
              
              {activeLoans.map((loan) => (
                <button
                  key={loan.id}
                  onClick={() => navigate(`/loan/${loan.id}`)}
                  className="card-floating w-full text-right">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{loan.propertyTitle}</p>
                        <p className="text-xs text-muted-foreground">#{loan.id}</p>
                      </div>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 p-3 bg-secondary/50 rounded-xl">
                    <div>
                      <p className="text-xs text-muted-foreground">المبلغ</p>
                      <p className="font-bold text-foreground">{formatCurrency(loan.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">القسط</p>
                      <p className="font-bold text-primary">{formatCurrency(loan.monthlyPayment)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">المتبقي</p>
                      <p className="font-bold text-foreground">{formatCurrency(loan.remainingBalance || 0)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          </div>
        )}
        
        {/* Empty state for new users */}
        {activeLoans.length === 0 && (
          <div className="px-5 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-floating text-center py-8"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">ابدأ رحلتك التمويلية</h3>
              <p className="text-sm text-muted-foreground mb-4">
                استخدم عقاراتك للحصول على سيولة فورية
              </p>
              <button
                onClick={() => navigate('/properties')}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span>طلب تمويل جديد</span>
              </button>
            </motion.div>
          </div>
        )}
        
        {/* Qualified properties banner */}
        {qualifiedProperties.length > 0 && (
          <div className="px-5 pb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              onClick={() => navigate('/properties')}
              className="p-4 bg-green-50 border border-green-200 rounded-xl cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-green-800">
                    لديك {qualifiedProperties.length} عقارات مؤهلة للتمويل
                  </p>
                  <p className="text-sm text-green-600">اضغط للاطلاع على التفاصيل</p>
                </div>
                <ArrowLeft className="w-5 h-5 text-green-600" />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
