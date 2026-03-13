import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import AppLayout from '@/components/AppLayout';

/* Desert Minimalism Design: Najiz E-Sign Screen
 * - Instructions for Najiz deed approval
 * - "فتح ناجز" CTA (simulated)
 * - Status tracking with pending/error states
 */

type SignStatus = 'instructions' | 'waiting' | 'verifying' | 'success' | 'error';

export default function NajizESign() {
  const [, navigate] = useLocation();
  const [status, setStatus] = useState<SignStatus>('instructions');
  const [countdown, setCountdown] = useState(300); // 5 minutes
  
  // Countdown timer for waiting state
  useEffect(() => {
    if (status === 'waiting' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, status]);
  
  // Simulate Najiz approval after opening
  useEffect(() => {
    if (status === 'waiting') {
      const timer = setTimeout(() => {
        setStatus('verifying');
        // Then success after verification
        setTimeout(() => {
          setStatus('success');
          // Navigate after showing success
          setTimeout(() => navigate('/sharia-execution'), 1500);
        }, 2000);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);
  
  const handleOpenNajiz = () => {
    setStatus('waiting');
    // In real app, would open Najiz app/website
  };
  
  const handleRetry = () => {
    setStatus('instructions');
    setCountdown(300);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen bg-gradient-to-b from-[#1B4965] to-[#2D5A7B] relative overflow-hidden">
        {/* Geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'url(/images/geometric-pattern.png)',
            backgroundSize: '150px',
          }}
        />
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <AnimatePresence mode="wait">
            {/* Instructions state */}
            {status === 'instructions' && (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center w-full max-w-sm"
              >
                {/* Najiz logo placeholder */}
                <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">ناجز</span>
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-3">
                  توقيع صك الرهن
                </h1>
                <p className="text-white/80 text-base mb-8 leading-relaxed">
                  سيُطلب منك اعتماد/توقيع صك الرهن عبر منصة ناجز لإتمام عملية التمويل
                </p>
                
                {/* Instructions card */}
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 mb-8 text-right">
                  <h3 className="font-semibold text-white mb-3">الخطوات:</h3>
                  <ol className="space-y-3 text-white/80 text-sm">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs">1</span>
                      <span>اضغط على "فتح ناجز" أدناه</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs">2</span>
                      <span>سجل الدخول عبر النفاذ الوطني</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs">3</span>
                      <span>راجع تفاصيل صك الرهن</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-xs">4</span>
                      <span>وافق على الصك وأكمل التوقيع</span>
                    </li>
                  </ol>
                </div>
                
                {/* CTA */}
                <button
                  onClick={handleOpenNajiz}
                  className="w-full bg-white text-[#1B4965] font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2"
                >
                  <span>فتح ناجز</span>
                  <ExternalLink className="w-5 h-5" />
                </button>
                
                <p className="text-white/50 text-xs mt-4">
                  سيتم فتح منصة ناجز في نافذة جديدة
                </p>
                
                {/* Cancel button */}
                <button
                  onClick={() => navigate('/contract')}
                  className="w-full mt-4 bg-white/10 text-white font-medium py-3 px-6 rounded-xl"
                >
                  إلغاء
                </button>
              </motion.div>
            )}
            
            {/* Waiting state */}
            {status === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center w-full max-w-sm"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-20 h-20 rounded-full border-4 border-white/30 border-t-white mx-auto mb-6"
                />
                
                <h1 className="text-2xl font-bold text-white mb-3">
                  في انتظار التوقيع
                </h1>
                <p className="text-white/80 text-base mb-6">
                  يرجى إكمال التوقيع في منصة ناجز
                </p>
                
                {/* Timer */}
                <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
                  <p className="text-white/60 text-sm mb-1">الوقت المتبقي</p>
                  <p className="text-3xl font-bold text-white">{formatTime(countdown)}</p>
                </div>
                
                {/* Status indicator */}
                <div className="flex items-center justify-center gap-2 text-white/70">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">جاري التحقق من حالة التوقيع...</span>
                </div>
                
                {/* Manual confirmation button */}
                <button
                  onClick={() => setStatus('verifying')}
                  className="mt-6 text-white/80 underline text-sm"
                >
                  تمت الموافقة في ناجز؟ اضغط هنا
                </button>
                
                {/* Cancel button */}
                <button
                  onClick={() => navigate('/contract')}
                  className="w-full mt-4 bg-white/10 text-white font-medium py-3 px-6 rounded-xl"
                >
                  إلغاء
                </button>
              </motion.div>
            )}
            
            {/* Verifying state */}
            {status === 'verifying' && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center w-full max-w-sm"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6"
                >
                  <RefreshCw className="w-10 h-10 text-white animate-spin" />
                </motion.div>
                
                <h1 className="text-2xl font-bold text-white mb-3">
                  جاري التحقق
                </h1>
                <p className="text-white/80 text-base">
                  نتحقق من حالة صك الرهن في ناجز...
                </p>
              </motion.div>
            )}
            
            {/* Success state */}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center w-full max-w-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </motion.div>
                
                <h1 className="text-2xl font-bold text-white mb-3">
                  تمت الموافقة
                </h1>
                <p className="text-white/80 text-base">
                  تم توثيق صك الرهن بنجاح
                </p>
              </motion.div>
            )}
            
            {/* Error state */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full max-w-sm"
              >
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-12 h-12 text-red-400" />
                </div>
                
                <h1 className="text-2xl font-bold text-white mb-3">
                  لم يتم التحقق
                </h1>
                <p className="text-white/80 text-base mb-6">
                  تعذر التحقق من حالة صك الرهن. قد يكون التوقيع لا يزال قيد المعالجة.
                </p>
                
                <button
                  onClick={handleRetry}
                  className="w-full bg-white text-[#1B4965] font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>إعادة المحاولة</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
