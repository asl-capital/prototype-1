import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Building2, Calendar, AlertCircle, ChevronLeft, Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState, Loan } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Loan Dashboard (Portfolio)
 * - Tabs: نشط | قيد المعالجة | مغلق
 * - Loan cards with details
 * - "إجراء مطلوب" indicator
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

type TabType = 'active' | 'processing' | 'closed';

const tabs: { id: TabType; label: string }[] = [
  { id: 'active', label: 'نشط' },
  { id: 'processing', label: 'قيد المعالجة' },
  { id: 'closed', label: 'مغلق' },
];

// Additional mock data for demo
const mockProcessingLoan: Loan = {
  id: 'L002',
  propertyId: '2',
  propertyTitle: 'شقة النرجس',
  amount: 300000,
  tenor: 3,
  monthlyPayment: 9167,
  apr: 7.5,
  totalPayment: 330000,
  status: 'processing',
  actionRequired: 'إكمال توقيع صك الرهن في ناجز'
};

const mockClosedLoan: Loan = {
  id: 'L003',
  propertyId: '4',
  propertyTitle: 'فيلا الورود',
  amount: 800000,
  tenor: 7,
  monthlyPayment: 0,
  apr: 7.0,
  totalPayment: 952000,
  status: 'closed'
};

export default function LoanDashboard() {
  const [, navigate] = useLocation();
  const { loans } = useAppState();
  const [activeTab, setActiveTab] = useState<TabType>('active');
  
  // Combine real and mock data for demo
  const allLoans = [
    ...loans,
    mockProcessingLoan,
    mockClosedLoan
  ];
  
  const filteredLoans = allLoans.filter(loan => loan.status === activeTab);
  
  const getStatusBadge = (loan: Loan) => {
    if (loan.actionRequired) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          <span>إجراء مطلوب</span>
        </div>
      );
    }
    return null;
  };
  
  const handleLoanClick = (loan: Loan) => {
    // Navigate to loan details page
    navigate(`/loan/${loan.id}`);
  };
  
  return (
    <AppLayout>
      <div className="safe-area-top">
        {/* Header */}
        <div className="px-5 pt-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-2"
          >
            <h1 className="text-2xl font-bold text-foreground">التمويل</h1>
            <button
              onClick={() => navigate('/properties')}
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
            >
              <Plus className="w-5 h-5 text-primary-foreground" />
            </button>
          </motion.div>
          <p className="text-muted-foreground">إدارة تمويلاتك العقارية</p>
        </div>
        
        {/* Tabs */}
        <div className="px-5 mb-4">
          <div className="flex bg-secondary rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Loans list */}
        <div className="px-5 pb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan, index) => (
                  <motion.div
                    key={loan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleLoanClick(loan)}
                    className="card-floating cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    {/* Header with action badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Wallet className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">تمويل عقاري</p>
                          <p className="text-sm text-muted-foreground">#{loan.id}</p>
                        </div>
                      </div>
                      {getStatusBadge(loan)}
                    </div>
                    
                    {/* Property info */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Building2 className="w-4 h-4" />
                      <span>{loan.propertyTitle}</span>
                    </div>
                    
                    {/* Loan details */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-xl mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">مبلغ التمويل</p>
                        <p className="font-bold text-foreground">{formatCurrency(loan.amount)} ر.س</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">المدة</p>
                        <p className="font-bold text-foreground">{loan.tenor} سنوات</p>
                      </div>
                      {loan.status === 'active' && (
                        <>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">القسط الشهري</p>
                            <p className="font-bold text-primary">{formatCurrency(loan.monthlyPayment)} ر.س</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">المتبقي</p>
                            <p className="font-bold text-foreground">{formatCurrency(loan.remainingBalance || 0)} ر.س</p>
                          </div>
                        </>
                      )}
                    </div>
                    
                    {/* Action required message */}
                    {loan.actionRequired && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <p className="text-sm text-amber-700">{loan.actionRequired}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Next payment for active loans */}
                    {loan.status === 'active' && loan.nextPaymentDate && (
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>القسط القادم: {new Date(loan.nextPaymentDate).toLocaleDateString('ar-SA')}</span>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    
                    {/* Closed loan info */}
                    {loan.status === 'closed' && (
                      <div className="flex items-center gap-2 pt-4 border-t border-border">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <p className="text-sm text-green-600">تم السداد بالكامل</p>
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {activeTab === 'active' && 'لا توجد تمويلات نشطة'}
                    {activeTab === 'processing' && 'لا توجد طلبات قيد المعالجة'}
                    {activeTab === 'closed' && 'لا توجد تمويلات مغلقة'}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    {activeTab === 'active' && 'ابدأ بطلب تمويل جديد'}
                    {activeTab === 'processing' && 'ستظهر طلباتك هنا'}
                    {activeTab === 'closed' && 'التمويلات المسددة ستظهر هنا'}
                  </p>
                  {activeTab === 'active' && (
                    <button
                      onClick={() => navigate('/properties')}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>طلب تمويل جديد</span>
                    </button>
                  )}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
