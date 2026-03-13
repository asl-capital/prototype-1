import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, FileText, Shield, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Contract Preview
 * - Contract sections preview
 * - "أحكام الرهن العقاري الإلكتروني" section
 * - Najiz deed approval instructions
 */

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

interface ContractSection {
  id: string;
  title: string;
  content: string;
  expanded?: boolean;
}

const contractSections: ContractSection[] = [
  {
    id: 'parties',
    title: 'أطراف العقد',
    content: 'الطرف الأول (الممول): شركة أصل للتمويل، سجل تجاري رقم XXXXXXXXXX\nالطرف الثاني (العميل): [اسم العميل]، هوية رقم [رقم الهوية]'
  },
  {
    id: 'subject',
    title: 'موضوع العقد',
    content: 'يوافق الطرف الأول على تقديم تمويل للطرف الثاني بموجب عقد مرابحة سلع متوافق مع أحكام الشريعة الإسلامية، مضموناً برهن عقاري على العقار المحدد أدناه.'
  },
  {
    id: 'mortgage',
    title: 'أحكام الرهن العقاري الإلكتروني',
    content: '1. يقر الطرف الثاني بموافقته على رهن العقار المملوك له لصالح الطرف الأول كضمان للتمويل.\n\n2. يتم توثيق الرهن إلكترونياً عبر منصة ناجز التابعة لوزارة العدل.\n\n3. يلتزم الطرف الثاني بالتوقيع على صك الرهن إلكترونياً عبر منصة ناجز خلال 48 ساعة من توقيع هذا العقد.\n\n4. يبقى الرهن سارياً حتى سداد كامل المبلغ المستحق.\n\n5. في حال التخلف عن السداد، يحق للطرف الأول اتخاذ الإجراءات النظامية لتحصيل مستحقاته.'
  },
  {
    id: 'sharia',
    title: 'الهيكلة الشرعية',
    content: 'يتم التمويل وفق آلية التورق/المرابحة المعتمدة من الهيئة الشرعية، حيث يقوم الممول بشراء سلعة (معادن ثمينة) نقداً ثم بيعها للعميل بثمن مؤجل يتضمن هامش ربح معلوم، ثم يقوم العميل بتوكيل الممول لبيع السلعة نقداً وإيداع المبلغ في حسابه.'
  },
  {
    id: 'payment',
    title: 'شروط السداد',
    content: 'يلتزم الطرف الثاني بسداد الأقساط الشهرية في موعدها المحدد. في حال التأخر، تُطبق رسوم التأخير المعتمدة من البنك المركزي السعودي.'
  },
];

export default function ContractPreview() {
  const [, navigate] = useLocation();
  const { loanAmount, loanTenor, selectedProperty } = useAppState();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    mortgage: true // Default expanded
  });
  const [acknowledged, setAcknowledged] = useState(false);
  
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleContinue = () => {
    navigate('/najiz-sign');
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
          <h1 className="text-xl font-bold text-foreground">مراجعة العقد</h1>
        </div>
        
        <div className="px-5 pt-4 pb-40">
          {/* Contract header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-floating mb-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">عقد تمويل مرابحة</h2>
                <p className="text-sm text-muted-foreground">رقم العقد: ASL-2026-XXXXX</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/50 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground">مبلغ التمويل</p>
                <p className="font-bold text-foreground">{formatCurrency(loanAmount)} ر.س</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المدة</p>
                <p className="font-bold text-foreground">{loanTenor} سنوات</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">العقار المرهون</p>
                <p className="font-bold text-foreground">{selectedProperty?.title || 'فيلا الياسمين'}</p>
              </div>
            </div>
          </motion.div>
          
          {/* Contract sections */}
          <div className="space-y-3">
            {contractSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className={`card-premium ${
                  section.id === 'mortgage' ? 'border-2 border-primary/30 bg-primary/5' : ''
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {section.id === 'mortgage' && (
                      <Shield className="w-5 h-5 text-primary" />
                    )}
                    <h3 className={`font-semibold ${
                      section.id === 'mortgage' ? 'text-primary' : 'text-foreground'
                    }`}>
                      {section.title}
                    </h3>
                  </div>
                  {expandedSections[section.id] ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
                
                {expandedSections[section.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                      {section.content}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Najiz instruction */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800 mb-1">خطوة مهمة</p>
                <p className="text-sm text-amber-700">
                  بعد الموافقة على العقد، سيُطلب منك اعتماد/توقيع صك الرهن عبر منصة ناجز
                </p>
              </div>
            </div>
          </motion.div>
          
          {/* Acknowledgment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={() => setAcknowledged(!acknowledged)}
            className={`mt-4 card-premium cursor-pointer transition-all ${
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
                  أقر بأنني قرأت وفهمت جميع بنود العقد
                </p>
                <p className="text-sm text-muted-foreground">
                  وأوافق على الشروط والأحكام المذكورة أعلاه
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
            <span>الموافقة والمتابعة</span>
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
