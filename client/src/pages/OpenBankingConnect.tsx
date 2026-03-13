import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, CheckCircle2, AlertCircle, RefreshCw, ArrowRight, Shield, Lock, Building2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Open Banking Connect
 * - Single aggregator integration (Tarabut/Lean/etc)
 * - Connection simulation
 * - Success/error states
 */

type ConnectionStatus = 'intro' | 'connecting' | 'success' | 'error';

export default function OpenBankingConnect() {
  const [, navigate] = useLocation();
  const { setCreditProfile, creditProfile } = useAppState();
  const [status, setStatus] = useState<ConnectionStatus>('intro');
  
  const handleConnect = async () => {
    setStatus('connecting');
    
    // Simulate connection to aggregator
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 90% success rate for demo
    if (Math.random() > 0.1) {
      setStatus('success');
      // Update credit profile to show bank is linked
      if (creditProfile) {
        setCreditProfile({
          ...creditProfile,
          bankLinked: true,
          lastUpdated: new Date().toISOString()
        });
      }
      // Navigate after showing success
      setTimeout(() => navigate('/credit'), 2000);
    } else {
      setStatus('error');
    }
  };
  
  const handleRetry = () => {
    setStatus('intro');
  };
  
  const handleBack = () => {
    navigate('/credit');
  };
  
  // List of supported banks (for display only)
  const supportedBanks = [
    'مصرف الراجحي',
    'البنك الأهلي السعودي',
    'بنك الرياض',
    'البنك السعودي البريطاني',
    'مصرف الإنماء',
    'بنك البلاد',
    'بنك الجزيرة',
    'البنك السعودي الفرنسي',
  ];
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-b from-[#D4A64A] to-[#B6831F] pt-4 pb-20 px-5 relative overflow-hidden safe-area-top">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'url(/images/geometric-pattern.png)',
              backgroundSize: '150px',
            }}
          />
          
          {/* Back button */}
          <button
            onClick={handleBack}
            className="relative z-10 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-6"
          >
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ربط الحساب البنكي
            </h1>
            <p className="text-white/80 text-sm">
              عبر الخدمات المصرفية المفتوحة
            </p>
          </div>
        </div>
        
        {/* Content */}
        <div className="px-5 -mt-12 relative z-10 pb-32">
          <AnimatePresence mode="wait">
            {/* Intro / Connect */}
            {status === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Main card */}
                <div className="card-floating mb-4">
                  <div className="text-center mb-6">
                    <h2 className="font-bold text-lg text-foreground mb-2">
                      اربط حسابك البنكي بأمان
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      نستخدم منصة معتمدة من البنك المركزي السعودي للوصول الآمن لبياناتك المالية
                    </p>
                  </div>
                  
                  {/* Security features */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-green-800 text-sm">معتمد من ساما</p>
                        <p className="text-xs text-green-600">مرخص من البنك المركزي السعودي</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-blue-800 text-sm">تشفير كامل</p>
                        <p className="text-xs text-blue-600">بياناتك محمية بأعلى معايير الأمان</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-amber-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-amber-800 text-sm">جميع البنوك</p>
                        <p className="text-xs text-amber-600">وصول لجميع البنوك السعودية</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connect button */}
                  <button
                    onClick={handleConnect}
                    className="w-full btn-primary"
                  >
                    ربط الحساب الآن
                  </button>
                </div>
                
                {/* Supported banks */}
                <div className="card-floating">
                  <h3 className="font-semibold text-foreground mb-3 text-sm">البنوك المدعومة</h3>
                  <div className="flex flex-wrap gap-2">
                    {supportedBanks.map((bank, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-secondary rounded-full text-xs text-muted-foreground"
                      >
                        {bank}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Privacy note */}
                <p className="text-xs text-muted-foreground text-center mt-4 px-4">
                  بالضغط على "ربط الحساب" أنت توافق على مشاركة بياناتك المالية وفقاً لسياسة الخصوصية
                </p>
              </motion.div>
            )}
            
            {/* Connecting */}
            {status === 'connecting' && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="card-floating text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-6"
                />
                <h2 className="text-xl font-bold text-foreground mb-2">
                  جاري الربط...
                </h2>
                <p className="text-muted-foreground text-sm mb-4">
                  يتم الاتصال بمنصة الخدمات المصرفية المفتوحة
                </p>
                <p className="text-xs text-muted-foreground">
                  قد يُطلب منك تأكيد الهوية عبر تطبيق البنك
                </p>
              </motion.div>
            )}
            
            {/* Success */}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-floating text-center py-12"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  تم الربط بنجاح!
                </h2>
                <p className="text-muted-foreground text-sm">
                  تم ربط حسابك البنكي بنجاح
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  جاري تحديث ملفك الائتماني...
                </p>
              </motion.div>
            )}
            
            {/* Error */}
            {status === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-floating text-center py-12"
              >
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  فشل الربط
                </h2>
                <p className="text-muted-foreground mb-6 text-sm">
                  تعذر الاتصال بالخدمات المصرفية. يرجى المحاولة مرة أخرى.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={handleRetry}
                    className="w-full btn-primary inline-flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-5 h-5" />
                    <span>إعادة المحاولة</span>
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full btn-secondary"
                  >
                    العودة
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}
