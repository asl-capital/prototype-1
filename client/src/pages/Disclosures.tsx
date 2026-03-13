import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, FileText, Clock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Disclosures Screen
 * - Fee disclosure section
 * - Data usage timeline
 * - Expandable sections
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

interface FeeItem {
  name: string;
  amount: number | string;
  description?: string;
}

const fees: FeeItem[] = [
  { name: 'رسوم إدارية', amount: 5000, description: 'تُخصم من مبلغ التمويل' },
  { name: 'رسوم التقييم', amount: 2500, description: 'في حال طلب إعادة تقييم' },
  { name: 'رسوم توثيق الرهن', amount: 1500, description: 'رسوم ناجز' },
  { name: 'تأمين العقار', amount: 'حسب القيمة', description: 'سنوياً' },
  { name: 'رسوم السداد المبكر', amount: '3 أشهر ربح', description: 'في حال السداد قبل المدة' },
];

interface DataTimelineItem {
  period: string;
  usage: string;
  retention: string;
}

const dataTimeline: DataTimelineItem[] = [
  { 
    period: 'أثناء الطلب', 
    usage: 'التحقق من الهوية والأهلية', 
    retention: 'طوال فترة التمويل' 
  },
  { 
    period: 'عند الموافقة', 
    usage: 'توثيق العقد والرهن', 
    retention: '10 سنوات بعد إغلاق التمويل' 
  },
  { 
    period: 'خلال التمويل', 
    usage: 'متابعة السداد والتواصل', 
    retention: 'طوال فترة التمويل' 
  },
  { 
    period: 'بعد الإغلاق', 
    usage: 'الأرشفة القانونية', 
    retention: 'حسب متطلبات البنك المركزي' 
  },
];

export default function Disclosures() {
  const [, navigate] = useLocation();
  const { loanAmount } = useAppState();
  const [expandedFees, setExpandedFees] = useState(true);
  const [expandedTimeline, setExpandedTimeline] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);
  
  const handleContinue = () => {
    // Randomly select an outcome for demo purposes
    const outcomes = ['approved', 'pending', 'rejected'];
    const randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];
    navigate(`/decision/${randomOutcome}`);
  };
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen">
        {/* Header */}
        <div className="safe-area-top px-5 pt-4 pb-2 flex items-center gap-4">
          <button 
            onClick={() => window.history.back()}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">الإفصاحات</h1>
        </div>
        
        <div className="px-5 pt-4 pb-40">
          {/* Loan summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-primary mb-1">مبلغ التمويل المطلوب</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(loanAmount)} ر.س
            </p>
          </motion.div>
          
          {/* Fee disclosure */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-floating mb-4"
          >
            <button
              onClick={() => setExpandedFees(!expandedFees)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-semibold text-foreground">الإفصاح عن الرسوم</h2>
              </div>
              {expandedFees ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            {expandedFees && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="space-y-4">
                  {fees.map((fee, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-foreground">{fee.name}</p>
                        {fee.description && (
                          <p className="text-xs text-muted-foreground">{fee.description}</p>
                        )}
                      </div>
                      <p className="font-semibold text-foreground">
                        {typeof fee.amount === 'number' 
                          ? `${formatCurrency(fee.amount)} ر.س`
                          : fee.amount
                        }
                      </p>
                    </div>
                  ))}
                </div>
                
                <p className="text-xs text-muted-foreground mt-4 bg-muted/50 rounded-lg p-3">
                  * جميع الرسوم شاملة ضريبة القيمة المضافة (15%)
                </p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Data usage timeline */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-floating mb-6"
          >
            <button
              onClick={() => setExpandedTimeline(!expandedTimeline)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-semibold text-foreground">الجدول الزمني لاستخدام البيانات</h2>
              </div>
              {expandedTimeline ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            {expandedTimeline && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-border"
              >
                <div className="space-y-4">
                  {dataTimeline.map((item, index) => (
                    <div key={index} className="bg-secondary/50 rounded-xl p-4">
                      <p className="font-semibold text-foreground mb-2">{item.period}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">الاستخدام</p>
                          <p className="text-foreground">{item.usage}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">مدة الاحتفاظ</p>
                          <p className="text-foreground">{item.retention}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Acknowledgment checkbox */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setAcknowledged(!acknowledged)}
            className={`card-premium cursor-pointer transition-all ${
              acknowledged ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                acknowledged 
                  ? 'bg-primary border-primary' 
                  : 'border-border'
              }`}>
                {acknowledged && (
                  <Check className="w-4 h-4 text-primary-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground mb-1">
                  أقر بأنني قرأت وفهمت جميع الإفصاحات
                </p>
                <p className="text-sm text-muted-foreground">
                  بما في ذلك الرسوم والجدول الزمني لاستخدام البيانات
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
          <button
            onClick={handleContinue}
            disabled={!acknowledged}
            className={`w-full btn-primary flex items-center justify-center gap-2 ${
              !acknowledged ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span>تقديم الطلب</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
