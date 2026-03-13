import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Info, ChevronDown, Check } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Loan Design (تصميم التمويل)
 * - Amount input + slider
 * - Tenor slider 1-10 years
 * - Key estimates (monthly, APR, total)
 * - Sharia structure section with 5-step timeline
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

const shariaSteps = [
  { step: 1, title: 'الطلب والإفصاحات الشرعية', description: 'تقديم طلب التمويل والموافقة على الإفصاحات' },
  { step: 2, title: 'شراء السلعة نقداً', description: 'شراء السلعة (مثال: ذهب) بواسطة الجهة الممولة عبر مزود معتمد' },
  { step: 3, title: 'بيع مرابحة للعميل', description: 'بيع السلعة للعميل بثمن مؤجل يتضمن الربح بوضوح' },
  { step: 4, title: 'تسييل السلعة نقداً', description: 'تسييل السلعة نقداً (قد يتم عبر وكالة)' },
  { step: 5, title: 'صرف السيولة للعميل', description: 'إيداع المبلغ في حساب العميل' },
];

export default function LoanDesign() {
  const [, navigate] = useLocation();
  const params = useParams<{ propertyId: string }>();
  const { properties, loanAmount, setLoanAmount, loanTenor, setLoanTenor, setSelectedProperty } = useAppState();
  
  const property = properties.find(p => p.id === params.propertyId);
  const maxAmount = property?.eligibleAmount || 1000000;
  const minAmount = 50000;
  
  const [showShariaDetails, setShowShariaDetails] = useState(false);
  
  // Calculate loan estimates
  const APR = 7.5; // Annual Percentage Rate
  const monthlyRate = APR / 100 / 12;
  const totalMonths = loanTenor * 12;
  const monthlyPayment = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1)
  );
  const totalPayment = monthlyPayment * totalMonths;
  const totalProfit = totalPayment - loanAmount;
  
  useEffect(() => {
    if (property) {
      setSelectedProperty(property);
      // Set initial loan amount to 50% of eligible
      if (loanAmount === 500000) {
        setLoanAmount(Math.round(property.eligibleAmount * 0.5));
      }
    }
  }, [property, setSelectedProperty, loanAmount, setLoanAmount]);
  
  const handleAmountChange = (value: number) => {
    const clampedValue = Math.max(minAmount, Math.min(maxAmount, value));
    setLoanAmount(clampedValue);
  };
  
  const handleContinue = () => {
    navigate('/disclosures');
  };
  
  if (!property) {
    return (
      <AppLayout showNav={false}>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">العقار غير موجود</p>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout showNav={false}>
      <div className="min-h-screen">
        {/* Header */}
        <div className="safe-area-top px-5 pt-4 pb-2 flex items-center gap-4">
          <button 
            onClick={() => navigate(`/property/${params.propertyId}`)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">تصميم التمويل</h1>
        </div>
        
        <div className="px-5 pt-4 pb-40">
          {/* Property summary */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary/50 rounded-xl p-4 mb-6"
          >
            <p className="text-sm text-muted-foreground mb-1">العقار المرهون</p>
            <p className="font-semibold text-foreground">{property.title}</p>
            <p className="text-sm text-muted-foreground">
              الحد الأقصى للتمويل: {formatCurrency(maxAmount)} ر.س
            </p>
          </motion.div>
          
          {/* Amount selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-floating mb-6"
          >
            <h2 className="font-semibold text-foreground mb-4">مبلغ التمويل</h2>
            
            {/* Amount display */}
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-primary mb-1">
                <span className="currency-sar">{formatCurrency(loanAmount)}</span>
              </p>
              <p className="text-muted-foreground">ريال سعودي</p>
            </div>
            
            {/* Amount slider */}
            <div className="relative mb-4">
              <input
                type="range"
                min={minAmount}
                max={maxAmount}
                step={10000}
                value={loanAmount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-primary
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to left, var(--primary) ${((loanAmount - minAmount) / (maxAmount - minAmount)) * 100}%, var(--muted) ${((loanAmount - minAmount) / (maxAmount - minAmount)) * 100}%)`
                }}
              />
            </div>
            
            {/* Min/Max labels */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(maxAmount)} ر.س</span>
              <span>{formatCurrency(minAmount)} ر.س</span>
            </div>
          </motion.div>
          
          {/* Tenor selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card-floating mb-6"
          >
            <h2 className="font-semibold text-foreground mb-4">مدة السداد</h2>
            
            {/* Tenor display */}
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-primary mb-1">{loanTenor}</p>
              <p className="text-muted-foreground">سنوات</p>
            </div>
            
            {/* Tenor slider */}
            <div className="relative mb-4">
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={loanTenor}
                onChange={(e) => setLoanTenor(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-primary
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to left, var(--primary) ${((loanTenor - 1) / 9) * 100}%, var(--muted) ${((loanTenor - 1) / 9) * 100}%)`
                }}
              />
            </div>
            
            {/* Year markers */}
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>10 سنوات</span>
              <span>سنة واحدة</span>
            </div>
          </motion.div>
          
          {/* Loan estimates */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card-floating mb-6"
          >
            <h2 className="font-semibold text-foreground mb-4">تفاصيل التمويل التقديرية</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">القسط الشهري</span>
                <span className="font-bold text-foreground text-lg">
                  {formatCurrency(monthlyPayment)} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">معدل النسبة السنوي (APR)</span>
                <span className="font-bold text-foreground text-lg">{APR}%</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">إجمالي الربح</span>
                <span className="font-bold text-foreground text-lg">
                  {formatCurrency(totalProfit)} ر.س
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">إجمالي المبلغ المستحق</span>
                <span className="font-bold text-primary text-xl">
                  {formatCurrency(totalPayment)} ر.س
                </span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4 bg-muted/50 rounded-lg p-3">
              * هذه الأرقام تقديرية وقد تختلف في العرض النهائي
            </p>
          </motion.div>
          
          {/* Sharia structure card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card-floating bg-[#D4A64A]/5 border border-[#D4A64A]/20"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#D4A64A]/10 flex items-center justify-center flex-shrink-0">
                <img src="/images/sharia-illustration.png" alt="" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">الهيكلة الشرعية للتمويل</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  تورّق/مرابحة سلع لتوليد السيولة + رهن (رهن عقاري) كضمان
                </p>
              </div>
            </div>
            
            {/* Mini timeline */}
            <div className="space-y-3 mb-4">
              {shariaSteps.slice(0, 3).map((item, index) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#D4A64A] text-white text-xs flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <p className="text-sm text-foreground">{item.title}</p>
                </div>
              ))}
              {!showShariaDetails && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-muted text-xs flex items-center justify-center flex-shrink-0">
                    ...
                  </div>
                  <p className="text-sm">+2 خطوات أخرى</p>
                </div>
              )}
            </div>
            
            {/* Expand button */}
            <button
              onClick={() => setShowShariaDetails(true)}
              className="w-full flex items-center justify-center gap-2 text-[#D4A64A] font-medium py-2"
            >
              <span>تفاصيل الهيكلة الشرعية</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
        
        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
          <button
            onClick={handleContinue}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <span>متابعة</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        
        {/* Sharia details bottom sheet */}
        <AnimatePresence>
          {showShariaDetails && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowShariaDetails(false)}
                className="fixed inset-0 bg-black/50 z-40"
              />
              
              {/* Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl z-50 max-h-[85vh] overflow-y-auto"
                style={{ maxWidth: '430px', margin: '0 auto' }}
              >
                <div className="p-6">
                  {/* Handle */}
                  <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-6" />
                  
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    تفاصيل الهيكلة الشرعية
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    آلية التمويل المتوافقة مع أحكام الشريعة الإسلامية
                  </p>
                  
                  {/* Full timeline */}
                  <div className="space-y-6">
                    {shariaSteps.map((item, index) => (
                      <div key={item.step} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-[#D4A64A] text-white text-sm flex items-center justify-center flex-shrink-0">
                            {item.step}
                          </div>
                          {index < shariaSteps.length - 1 && (
                            <div className="w-0.5 h-full bg-[#D4A64A]/20 mt-2" />
                          )}
                        </div>
                        <div className="pb-6">
                          <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowShariaDetails(false)}
                    className="w-full btn-secondary mt-6"
                  >
                    إغلاق
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
