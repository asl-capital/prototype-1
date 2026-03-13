import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

/* Desert Minimalism Design: Sharia Execution Flow
 * - 5-step stepper simulation
 * - Sequential animation on "بدء التنفيذ"
 * - "متابعة لصرف السيولة" enabled after completion
 */

interface ShariaStep {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'complete';
}

const initialSteps: ShariaStep[] = [
  { 
    id: 1, 
    title: 'الطلب والإفصاحات الشرعية', 
    description: 'تم تقديم الطلب والموافقة على الإفصاحات',
    status: 'pending' 
  },
  { 
    id: 2, 
    title: 'شراء السلعة نقداً بواسطة الجهة الممولة', 
    description: 'شراء ذهب عبر مزود معتمد',
    status: 'pending' 
  },
  { 
    id: 3, 
    title: 'بيع مرابحة للعميل بثمن مؤجل', 
    description: 'يتضمن الربح بوضوح',
    status: 'pending' 
  },
  { 
    id: 4, 
    title: 'تسييل السلعة نقداً', 
    description: 'قد يتم عبر وكالة',
    status: 'pending' 
  },
  { 
    id: 5, 
    title: 'صرف السيولة للعميل', 
    description: 'إيداع المبلغ في حسابك',
    status: 'pending' 
  },
];

export default function ShariaExecution() {
  const [, navigate] = useLocation();
  const [steps, setSteps] = useState<ShariaStep[]>(initialSteps);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleStartExecution = () => {
    setIsExecuting(true);
  };
  
  // Animate steps sequentially
  useEffect(() => {
    if (!isExecuting) return;
    
    let currentStep = 0;
    
    const animateStep = () => {
      if (currentStep >= steps.length) {
        setIsComplete(true);
        return;
      }
      
      // Set current step to active
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx === currentStep ? 'active' : idx < currentStep ? 'complete' : 'pending'
      })));
      
      // After delay, complete current step and move to next
      setTimeout(() => {
        setSteps(prev => prev.map((step, idx) => ({
          ...step,
          status: idx <= currentStep ? 'complete' : 'pending'
        })));
        currentStep++;
        setTimeout(animateStep, 500);
      }, 1500);
    };
    
    animateStep();
  }, [isExecuting]);
  
  const handleContinue = () => {
    navigate('/disbursement');
  };
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#D4A64A] to-[#B6831F] pt-12 pb-20 px-6 text-center relative overflow-hidden">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url(/images/geometric-pattern.png)',
              backgroundSize: '150px',
            }}
          />
          <div className="relative z-10">
            <motion.img
              src="/images/sharia-illustration.png"
              alt=""
              className="w-16 h-16 mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            />
            <h1 className="text-2xl font-bold text-white mb-2">
              تنفيذ التمويل المتوافق مع الشريعة
            </h1>
            <p className="text-white/80 text-sm">
              آلية التورق/المرابحة المعتمدة
            </p>
          </div>
        </div>
        
        {/* Steps */}
        <div className="px-5 -mt-12 relative z-10 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-floating"
          >
            <div className="space-y-0">
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{
                        scale: step.status === 'active' ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        repeat: step.status === 'active' ? Infinity : 0,
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        step.status === 'complete' 
                          ? 'bg-green-500' 
                          : step.status === 'active'
                          ? 'bg-primary'
                          : 'bg-muted'
                      }`}
                    >
                      {step.status === 'complete' ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : step.status === 'active' ? (
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      ) : (
                        <span className="text-sm font-medium text-muted-foreground">{step.id}</span>
                      )}
                    </motion.div>
                    {index < steps.length - 1 && (
                      <div className={`w-0.5 h-12 transition-colors duration-300 ${
                        step.status === 'complete' ? 'bg-green-500' : 'bg-muted'
                      }`} />
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className={`pb-6 ${index === steps.length - 1 ? 'pb-0' : ''}`}>
                    <h3 className={`font-semibold mb-1 transition-colors duration-300 ${
                      step.status === 'complete' 
                        ? 'text-green-700' 
                        : step.status === 'active'
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    
                    {step.status === 'active' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-primary mt-2"
                      >
                        جاري التنفيذ...
                      </motion.p>
                    )}
                    
                    {step.status === 'complete' && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs text-green-600 mt-2"
                      >
                        تم ✓
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* Completion message */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">تم تنفيذ التمويل بنجاح</p>
                    <p className="text-sm text-green-600">جاهز لصرف السيولة</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
          {!isExecuting ? (
            <div className="space-y-3">
              <button
                onClick={handleStartExecution}
                className="w-full btn-primary"
              >
                بدء التنفيذ
              </button>
              <button
                onClick={() => navigate('/najiz-sign')}
                className="w-full btn-secondary"
              >
                رجوع
              </button>
            </div>
          ) : (
            <button
              onClick={handleContinue}
              disabled={!isComplete}
              className={`w-full btn-primary flex items-center justify-center gap-2 ${
                !isComplete ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>متابعة لصرف السيولة</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
