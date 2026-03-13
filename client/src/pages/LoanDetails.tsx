import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, Calendar, Building2, FileText, Clock, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Loan Details
 * - Full loan information
 * - Payment schedule
 * - Property collateral info
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export default function LoanDetails() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const { loans, properties } = useAppState();
  const [showSchedule, setShowSchedule] = useState(false);
  
  const loan = loans.find(l => l.id === params.id);
  const property = properties.find(p => p.title === loan?.propertyTitle);
  
  if (!loan) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">التمويل غير موجود</p>
        </div>
      </AppLayout>
    );
  }
  
  const handleBack = () => {
    navigate('/loans');
  };
  
  // Mock payment schedule
  const paymentSchedule = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    date: new Date(2026, i + 1, 15),
    amount: loan.monthlyPayment,
    status: i === 0 ? 'upcoming' : 'pending'
  }));
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'نشط', className: 'bg-green-50 text-green-700' };
      case 'processing':
        return { label: 'قيد المعالجة', className: 'bg-amber-50 text-amber-700' };
      case 'closed':
        return { label: 'مغلق', className: 'bg-gray-100 text-gray-600' };
      default:
        return { label: status, className: 'bg-gray-100 text-gray-600' };
    }
  };
  
  const statusBadge = getStatusBadge(loan.status);
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#D4A64A] to-[#C9952F] text-white px-5 pt-4 pb-8 safe-area-top">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">تفاصيل التمويل</h1>
          </div>
          
          {/* Loan summary */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium mb-4 ${statusBadge.className}`}>
              <span>{statusBadge.label}</span>
            </div>
            <p className="text-white/70 text-sm mb-2">مبلغ التمويل</p>
            <p className="text-4xl font-bold mb-1">{formatCurrency(loan.amount)}</p>
            <p className="text-white/70">ريال سعودي</p>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-5 -mt-4 pb-8">
          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-floating mb-4"
          >
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">القسط الشهري</p>
                <p className="font-bold text-primary">{formatCurrency(loan.monthlyPayment)}</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-xs text-muted-foreground mb-1">المتبقي</p>
                <p className="font-bold text-foreground">{formatCurrency(loan.remainingBalance || 0)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">المدة</p>
                <p className="font-bold text-foreground">{loan.tenor} سنوات</p>
              </div>
            </div>
          </motion.div>
          
          {/* Loan details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-floating mb-4"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>تفاصيل العقد</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">رقم العقد</span>
                <span className="font-medium text-foreground">ASL-2026-{loan.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">تاريخ البدء</span>
                <span className="font-medium text-foreground">{formatDate(new Date(2026, 0, 15))}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border">
                <span className="text-muted-foreground">تاريخ الانتهاء</span>
                <span className="font-medium text-foreground">{formatDate(new Date(2026 + loan.tenor, 0, 15))}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">نوع التمويل</span>
                <span className="font-medium text-foreground">مرابحة</span>
              </div>
            </div>
          </motion.div>
          
          {/* Collateral property */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-floating mb-4"
          >
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <span>العقار المرهون</span>
            </h3>
            
            <div className="flex items-center gap-4 p-3 bg-secondary/50 rounded-xl">
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{loan.propertyTitle}</p>
                <p className="text-sm text-muted-foreground">{property?.location || 'الرياض'}</p>
                {property && (
                  <p className="text-xs text-muted-foreground mt-1">
                    القيمة التقديرية: {formatCurrency(property.estimatedValue)} ر.س
                  </p>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Payment schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-floating mb-4"
          >
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <span>جدول السداد</span>
              </h3>
              {showSchedule ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            {showSchedule && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-3"
              >
                {paymentSchedule.map((payment) => (
                  <div
                    key={payment.id}
                    className={`flex items-center justify-between p-3 rounded-xl ${
                      payment.status === 'upcoming' ? 'bg-primary/10' : 'bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        payment.status === 'upcoming' ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                      }`}>
                        {payment.status === 'upcoming' ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{payment.id}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {formatDate(payment.date)}
                        </p>
                        {payment.status === 'upcoming' && (
                          <p className="text-xs text-primary">القسط القادم</p>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-foreground">{formatCurrency(payment.amount)}</p>
                  </div>
                ))}
                
                <p className="text-xs text-muted-foreground text-center pt-2">
                  عرض أول 6 أقساط فقط
                </p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <button className="w-full btn-primary">
              سداد القسط القادم
            </button>
            <button className="w-full btn-secondary">
              طلب سداد مبكر
            </button>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
