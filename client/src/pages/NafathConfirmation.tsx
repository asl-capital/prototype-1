import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

/* Desert Minimalism Design: Nafath Confirmation
 * - Nafath number display
 * - Loading/waiting state
 * - Error/timeout handling with retry
 */

type NafathState = 'waiting' | 'success' | 'timeout' | 'error';

export default function NafathConfirmation() {
  const [, navigate] = useLocation();
  const [state, setState] = useState<NafathState>('waiting');
  const [nafathNumber] = useState(() => Math.floor(10 + Math.random() * 90)); // 2-digit number
  const [countdown, setCountdown] = useState(120); // 2 minutes
  
  // Countdown timer
  useEffect(() => {
    if (state === 'waiting' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && state === 'waiting') {
      setState('timeout');
    }
  }, [countdown, state]);
  
  // Simulate Nafath confirmation (auto-success after 5 seconds for demo)
  useEffect(() => {
    if (state === 'waiting') {
      const timer = setTimeout(() => {
        setState('success');
        // Navigate after showing success
        setTimeout(() => navigate('/sync'), 1500);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [state, navigate]);
  
  const handleRetry = () => {
    setState('waiting');
    setCountdown(120);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="app-shell bg-background min-h-screen">
      {/* Header */}
      <div className="safe-area-top px-5 pt-4 pb-2">
        <button 
          onClick={() => navigate('/otp')}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="px-5 pt-2">
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-primary" />
        </div>
      </div>
      
      {/* Content */}
      <div className="px-5 pt-8 pb-8 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {state === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full"
            >
              {/* Nafath logo placeholder */}
              <div className="w-20 h-20 rounded-2xl bg-[#1B4965] flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-bold">نفاذ</span>
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                تأكيد الهوية عبر نفاذ
              </h1>
              <p className="text-muted-foreground text-base mb-8">
                افتح تطبيق نفاذ واختر الرقم التالي
              </p>
              
              {/* Nafath number */}
              <div className="bg-primary/10 rounded-2xl py-8 px-6 mb-6">
                <p className="text-muted-foreground text-sm mb-2">اختر هذا الرقم في تطبيق نفاذ</p>
                <p className="text-6xl font-bold text-primary">{nafathNumber}</p>
              </div>
              
              {/* Waiting indicator */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  <RefreshCw className="w-5 h-5 text-primary" />
                </motion.div>
                <span className="text-muted-foreground">في انتظار التأكيد...</span>
              </div>
              
              {/* Countdown */}
              <p className="text-sm text-muted-foreground mb-6">
                الوقت المتبقي: <span className="font-medium text-foreground">{formatTime(countdown)}</span>
              </p>
              
              {/* Cancel button */}
              <button
                onClick={() => navigate('/phone')}
                className="btn-secondary w-full"
              >
                إلغاء
              </button>
            </motion.div>
          )}
          
          {state === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                تم التحقق بنجاح
              </h1>
              <p className="text-muted-foreground text-base">
                جاري تحميل بياناتك...
              </p>
            </motion.div>
          )}
          
          {(state === 'timeout' || state === 'error') && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-destructive" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {state === 'timeout' ? 'انتهت المهلة' : 'حدث خطأ'}
              </h1>
              <p className="text-muted-foreground text-base mb-8">
                {state === 'timeout' 
                  ? 'لم يتم تأكيد الهوية خلال الوقت المحدد'
                  : 'تعذر الاتصال بخدمة نفاذ، يرجى المحاولة مرة أخرى'
                }
              </p>
              
              <button
                onClick={handleRetry}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>إعادة المحاولة</span>
              </button>
              
              <button
                onClick={() => navigate('/phone')}
                className="btn-ghost w-full mt-3"
              >
                تغيير رقم الجوال
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
