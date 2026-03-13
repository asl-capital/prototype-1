import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle2, Wallet, Calendar, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Disbursement Confirmation
 * - Success celebration
 * - Disbursement details
 * - Next steps
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

export default function DisbursementConfirmation() {
  const [, navigate] = useLocation();
  const { loanAmount, loanTenor, selectedProperty } = useAppState();
  const [showConfetti, setShowConfetti] = useState(true);
  
  // Calculate estimates
  const APR = 7.5;
  const monthlyRate = APR / 100 / 12;
  const totalMonths = loanTenor * 12;
  const monthlyPayment = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  
  // First payment date (next month)
  const firstPaymentDate = new Date();
  firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
  const formattedDate = firstPaymentDate.toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Success header with celebration */}
        <div className="bg-gradient-to-b from-green-500 to-green-600 pt-16 pb-28 px-6 text-center relative">
          {/* Confetti/celebration background */}
          {showConfetti && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 2, duration: 1 }}
              className="absolute inset-0"
              style={{
                backgroundImage: 'url(/images/success-celebration.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.3,
              }}
            />
          )}
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="relative z-10"
          >
            <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">مبروك!</h1>
            <p className="text-white/90 text-lg">تم صرف التمويل بنجاح</p>
          </motion.div>
        </div>
        
        {/* Disbursement details */}
        <div className="px-5 -mt-16 relative z-10 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-floating mb-4"
          >
            {/* Amount */}
            <div className="text-center py-6 mb-4 bg-green-50 rounded-xl border border-green-200">
              <p className="text-sm text-green-700 mb-1">المبلغ المودع في حسابك</p>
              <p className="text-4xl font-bold text-green-700">
                {formatCurrency(loanAmount)} <span className="text-lg">ر.س</span>
              </p>
            </div>
            
            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Wallet className="w-4 h-4" />
                  <span>رقم المرجع</span>
                </div>
                <span className="font-mono font-medium text-foreground">ASL-2026-78542</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">العقار المرهون</span>
                <span className="font-medium text-foreground">{selectedProperty?.title || 'فيلا الياسمين'}</span>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-border">
                <span className="text-muted-foreground">مدة التمويل</span>
                <span className="font-medium text-foreground">{loanTenor} سنوات</span>
              </div>
              
              <div className="flex items-center justify-between py-3">
                <span className="text-muted-foreground">القسط الشهري</span>
                <span className="font-bold text-primary text-lg">{formatCurrency(monthlyPayment)} ر.س</span>
              </div>
            </div>
          </motion.div>
          
          {/* First payment info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-premium bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">موعد أول قسط</p>
                <p className="font-bold text-foreground">{formattedDate}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Payment methods note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 bg-muted/50 rounded-xl"
          >
            <p className="text-sm text-muted-foreground mb-2">طرق السداد المتاحة:</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-foreground">سداد</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-foreground">الخصم المباشر</span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-foreground">تحويل بنكي</span>
            </div>
          </motion.div>
        </div>
        
        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
          <button
            onClick={() => navigate('/loans')}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>عرض تمويلاتي</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
