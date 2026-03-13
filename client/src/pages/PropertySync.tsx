import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Property Sync Splash
 * - 5-second loading animation
 * - Najiz integration simulation
 * - Error/retry state
 */

type SyncState = 'loading' | 'success' | 'error';

export default function PropertySync() {
  const [, navigate] = useLocation();
  const { } = useAppState();
  const [state, setState] = useState<SyncState>('loading');
  const [progress, setProgress] = useState(0);
  
  // Simulate property sync with progress
  useEffect(() => {
    if (state === 'loading') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setState('success');
            return 100;
          }
          return prev + 20;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [state]);
  
  // Navigate after success — go to credit scoring screen (Fix 6)
  useEffect(() => {
    if (state === 'success') {
      const timer = setTimeout(() => {
        navigate('/credit-scoring');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state, navigate]);
  
  const handleRetry = () => {
    setState('loading');
    setProgress(0);
  };
  
  // For demo: simulate error on demand
  const simulateError = () => {
    setState('error');
  };
  
  return (
    <div className="app-shell bg-gradient-to-b from-[#D4A64A] to-[#B6831F] min-h-screen relative overflow-hidden">
      {/* Geometric pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/images/geometric-pattern.png)',
          backgroundSize: '150px',
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <AnimatePresence mode="wait">
          {state === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full"
            >
              {/* Animated icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8"
              >
                <Building2 className="w-12 h-12 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white mb-3">
                جاري سحب معلومات عقاراتك المسجلة في ناجز
              </h1>
              <p className="text-white/70 text-base mb-8">
                يرجى الانتظار...
              </p>
              
              {/* Progress bar */}
              <div className="w-full max-w-xs mx-auto">
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#D4A64A] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-white/60 text-sm mt-3">{progress}%</p>
              </div>
              
              {/* Hidden button for demo error simulation */}
              <button 
                onClick={simulateError}
                className="opacity-0 absolute bottom-4 left-4 text-xs text-white/30"
              >
                Simulate Error
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
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-white mb-3">
                تم بنجاح
              </h1>
              <p className="text-white/70 text-base">
                تم استرجاع بيانات عقاراتك
              </p>
            </motion.div>
          )}
          
          {state === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center w-full"
            >
              <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-8">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </div>
              
              <h1 className="text-2xl font-bold text-white mb-3">
                تعذر الاتصال بناجز
              </h1>
              <p className="text-white/70 text-base mb-8">
                حدث خطأ أثناء استرجاع بيانات العقارات، يرجى المحاولة مرة أخرى
              </p>
              
              <button
                onClick={handleRetry}
                className="bg-white text-[#D4A64A] font-semibold py-4 px-8 rounded-xl flex items-center justify-center gap-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5" />
                <span>إعادة المحاولة</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
