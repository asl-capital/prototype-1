import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, ArrowLeft, FileText, Building2, CreditCard, AlertTriangle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Instant Decision Screen
 * - 3 outcomes: Approved, Pending, Rejected
 * - Animated result reveal
 * - Next steps for each outcome
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

type DecisionOutcome = 'approved' | 'pending' | 'rejected';

interface PendingTask {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  completed: boolean;
}

const pendingTasks: PendingTask[] = [
  { 
    id: '1', 
    title: 'إثبات الدخل', 
    description: 'رفع كشف حساب بنكي لآخر 3 أشهر',
    icon: FileText,
    completed: false 
  },
  { 
    id: '2', 
    title: 'تأكيد ملكية العقار', 
    description: 'مراجعة وثائق الصك',
    icon: Building2,
    completed: true 
  },
  { 
    id: '3', 
    title: 'سداد التزام قائم', 
    description: 'سداد بطاقة ائتمانية متأخرة',
    icon: CreditCard,
    completed: false 
  },
];

export default function InstantDecision() {
  const [, navigate] = useLocation();
  const params = useParams<{ outcome: string }>();
  const { loanAmount, selectedProperty } = useAppState();
  const [isRevealing, setIsRevealing] = useState(true);
  
  const outcome = (params.outcome as DecisionOutcome) || 'approved';
  
  // Simulate decision reveal
  useEffect(() => {
    const timer = setTimeout(() => setIsRevealing(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const handleContinue = () => {
    if (outcome === 'approved') {
      navigate('/contract');
    } else if (outcome === 'pending') {
      // Stay on page or navigate to task completion
      navigate('/properties');
    } else {
      navigate('/properties');
    }
  };
  
  // Revealing animation
  if (isRevealing) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1B4965] to-[#2D5A7B]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full mx-auto mb-6"
            />
            <p className="text-white text-xl font-medium">جاري مراجعة طلبك...</p>
          </motion.div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen">
        <AnimatePresence mode="wait">
          {/* APPROVED */}
          {outcome === 'approved' && (
            <motion.div
              key="approved"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen"
            >
              {/* Success header */}
              <div className="bg-gradient-to-b from-green-500 to-green-600 pt-16 pb-24 px-6 text-center relative overflow-hidden">
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'url(/images/success-celebration.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="relative z-10"
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">تمت الموافقة على طلبك</h1>
                  <p className="text-white/80">مبروك! تم اعتماد تمويلك</p>
                </motion.div>
              </div>
              
              {/* Offer details */}
              <div className="px-5 -mt-16 relative z-10 pb-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card-floating"
                >
                  <h2 className="font-semibold text-foreground mb-4">تفاصيل العرض</h2>
                  
                  <div className="text-center py-4 mb-4 bg-primary/5 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-1">مبلغ التمويل المعتمد</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatCurrency(loanAmount)} ر.س
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">العقار</span>
                      <span className="font-medium text-foreground">{selectedProperty?.title || 'فيلا الياسمين'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">صلاحية العرض</span>
                      <span className="font-medium text-foreground">7 أيام</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4 bg-muted/50 rounded-lg p-3">
                    * العرض صالح لمدة 7 أيام من تاريخ الموافقة
                  </p>
                </motion.div>
              </div>
              
              {/* CTA */}
              <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
                <button
                  onClick={handleContinue}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  <span>متابعة للتعاقد</span>
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
          
          {/* PENDING */}
          {outcome === 'pending' && (
            <motion.div
              key="pending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen"
            >
              {/* Pending header */}
              <div className="bg-gradient-to-b from-amber-500 to-amber-600 pt-16 pb-24 px-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">طلبك قيد المراجعة</h1>
                  <p className="text-white/80">نحتاج بعض المعلومات الإضافية</p>
                </motion.div>
              </div>
              
              {/* Task checklist */}
              <div className="px-5 -mt-16 relative z-10 pb-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card-floating"
                >
                  <h2 className="font-semibold text-foreground mb-4">المهام المطلوبة</h2>
                  
                  <div className="space-y-4">
                    {pendingTasks.map((task, index) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className={`p-4 rounded-xl border-2 ${
                          task.completed 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-amber-200 bg-amber-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            task.completed ? 'bg-green-100' : 'bg-amber-100'
                          }`}>
                            {task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <task.icon className="w-5 h-5 text-amber-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${
                              task.completed ? 'text-green-800' : 'text-amber-800'
                            }`}>
                              {task.title}
                            </p>
                            <p className={`text-sm ${
                              task.completed ? 'text-green-600' : 'text-amber-600'
                            }`}>
                              {task.completed ? 'تم' : task.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
              
              {/* CTA */}
              <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
                <button
                  onClick={handleContinue}
                  className="w-full btn-primary"
                >
                  إكمال المهام
                </button>
              </div>
            </motion.div>
          )}
          
          {/* REJECTED */}
          {outcome === 'rejected' && (
            <motion.div
              key="rejected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen"
            >
              {/* Rejected header */}
              <div className="bg-gradient-to-b from-red-500 to-red-600 pt-16 pb-24 px-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">لم تتم الموافقة</h1>
                  <p className="text-white/80">نأسف، لم نتمكن من الموافقة على طلبك</p>
                </motion.div>
              </div>
              
              {/* Next steps */}
              <div className="px-5 -mt-16 relative z-10 pb-32">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="card-floating mb-4"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h2 className="font-semibold text-foreground mb-1">أسباب محتملة</h2>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• نسبة الالتزامات مرتفعة</li>
                        <li>• العقار المختار غير مؤهل</li>
                        <li>• المبلغ المطلوب يتجاوز الحد المسموح</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="card-floating"
                >
                  <h2 className="font-semibold text-foreground mb-4">الخطوات التالية</h2>
                  
                  <div className="space-y-3">
                    <button 
                      onClick={() => navigate('/properties')}
                      className="w-full p-4 rounded-xl border-2 border-border text-right hover:border-primary/50 transition-colors"
                    >
                      <p className="font-medium text-foreground">اختيار عقار آخر</p>
                      <p className="text-sm text-muted-foreground">جرب عقار بقيمة أعلى</p>
                    </button>
                    
                    <button 
                      onClick={() => window.history.back()}
                      className="w-full p-4 rounded-xl border-2 border-border text-right hover:border-primary/50 transition-colors"
                    >
                      <p className="font-medium text-foreground">تقليل مبلغ التمويل</p>
                      <p className="text-sm text-muted-foreground">طلب مبلغ أقل</p>
                    </button>
                    
                    <button className="w-full p-4 rounded-xl border-2 border-border text-right hover:border-primary/50 transition-colors">
                      <p className="font-medium text-foreground">التواصل مع الدعم</p>
                      <p className="text-sm text-muted-foreground">للاستفسار عن التفاصيل</p>
                    </button>
                  </div>
                </motion.div>
              </div>
              
              {/* CTA */}
              <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
                <button
                  onClick={handleContinue}
                  className="w-full btn-secondary"
                >
                  العودة للرئيسية
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
