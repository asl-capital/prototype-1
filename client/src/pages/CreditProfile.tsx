import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Wallet, ArrowUpDown, Shield, Lightbulb, RefreshCw, Link2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Credit Profile Screen
 * - Eligibility indicator (مؤشر الأهلية)
 * - Open Banking insights
 * - Improvement tips
 * - Bank linking management
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

interface InsightItem {
  id: string;
  icon: React.ElementType;
  label: string;
  value: string | number;
  unit?: string;
  score: number; // 0-100
  tip?: string;
}

export default function CreditProfile() {
  const [, navigate] = useLocation();
  const { creditProfile } = useAppState();
  const [expandedTip, setExpandedTip] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // If bank not linked, show empty state
  if (!creditProfile?.bankLinked) {
    return (
      <AppLayout>
        <div className="safe-area-top px-5 pt-4 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <h1 className="text-2xl font-bold text-foreground mb-1">الملف الائتماني</h1>
            <p className="text-muted-foreground">تحليل وضعك المالي</p>
          </motion.div>
          
          {/* Empty state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Link2 className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              اربط حسابك البنكي
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
              لعرض تحليل وضعك المالي ومؤشر الأهلية، يرجى ربط حسابك البنكي عبر الخدمات المصرفية المفتوحة
            </p>
            <button 
              onClick={() => navigate('/open-banking')}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Link2 className="w-5 h-5" />
              <span>ربط الحساب البنكي</span>
            </button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }
  
  const insights: InsightItem[] = [
    {
      id: 'income',
      icon: Wallet,
      label: 'متوسط الدخل',
      value: formatCurrency(creditProfile.averageIncome),
      unit: 'ر.س/شهر',
      score: 85,
      tip: 'دخل مستقر يعزز فرص الموافقة. حافظ على استمرارية مصادر الدخل.'
    },
    {
      id: 'stability',
      icon: ArrowUpDown,
      label: 'استقرار التدفق',
      value: creditProfile.flowStability,
      unit: '%',
      score: creditProfile.flowStability,
      tip: 'تدفق نقدي مستقر. تجنب السحوبات الكبيرة المفاجئة للحفاظ على هذا المستوى.'
    },
    {
      id: 'obligations',
      icon: TrendingUp,
      label: 'تقدير الالتزامات',
      value: formatCurrency(creditProfile.estimatedObligations),
      unit: 'ر.س/شهر',
      score: 70,
      tip: 'التزاماتك ضمن الحدود المقبولة. سداد بعض الالتزامات قد يحسن أهليتك.'
    },
    {
      id: 'safety',
      icon: Shield,
      label: 'هامش الأمان النقدي',
      value: creditProfile.cashSafetyMargin,
      unit: '%',
      score: creditProfile.cashSafetyMargin,
      tip: 'هامش أمان جيد. حاول الحفاظ على 3-6 أشهر من المصاريف كاحتياطي.'
    },
  ];
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };
  
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  return (
    <AppLayout>
      <div className="safe-area-top px-5 pt-4 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">الملف الائتماني</h1>
            <p className="text-muted-foreground text-sm">
              آخر تحديث: {creditProfile.lastUpdated ? new Date(creditProfile.lastUpdated).toLocaleDateString('ar-SA') : 'غير متاح'}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <RefreshCw className={`w-5 h-5 text-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </motion.div>
        
        {/* Eligibility score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-floating mb-6"
        >
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">مؤشر الأهلية</p>
            
            {/* Circular progress */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted"
                />
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeLinecap="round"
                  className={creditProfile.eligibilityScore >= 70 ? 'text-green-500' : 'text-amber-500'}
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 56 * (1 - creditProfile.eligibilityScore / 100) 
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold text-foreground">{creditProfile.eligibilityScore}</span>
              </div>
            </div>
            
            <p className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
              creditProfile.eligibilityScore >= 70 
                ? 'bg-green-100 text-green-700' 
                : 'bg-amber-100 text-amber-700'
            }`}>
              {creditProfile.eligibilityScore >= 70 ? 'أهلية جيدة' : 'أهلية متوسطة'}
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground text-center mt-4 bg-muted/50 rounded-lg p-3">
            * هذا مؤشر تقديري وليس درجة ائتمانية رسمية
          </p>
        </motion.div>
        
        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="font-semibold text-foreground mb-4">تحليل الوضع المالي</h2>
          
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card-premium"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <insight.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{insight.label}</p>
                      <p className="font-bold text-foreground">
                        {insight.value} {insight.unit && <span className="text-sm font-normal text-muted-foreground">{insight.unit}</span>}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <motion.div
                    className={`h-full rounded-full ${getProgressColor(insight.score)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${insight.score}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                  />
                </div>
                
                {/* Tip toggle */}
                {insight.tip && (
                  <>
                    <button
                      onClick={() => setExpandedTip(expandedTip === insight.id ? null : insight.id)}
                      className="flex items-center gap-2 text-primary text-sm font-medium"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>كيف نحسّنه؟</span>
                      {expandedTip === insight.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedTip === insight.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-primary/5 rounded-lg"
                        >
                          <p className="text-sm text-muted-foreground">{insight.tip}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Bank management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          <button 
            onClick={handleRefresh}
            className="w-full card-premium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">تحديث البيانات</span>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
          </button>
          
          <button 
            onClick={() => navigate('/open-banking')}
            className="w-full card-premium flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Link2 className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">إدارة الربط البنكي</span>
            </div>
            <ChevronDown className="w-5 h-5 text-muted-foreground -rotate-90" />
          </button>
        </motion.div>
      </div>
    </AppLayout>
  );
}
