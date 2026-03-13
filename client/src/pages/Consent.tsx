import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Shield, FileText, Database } from 'lucide-react';

/* Desert Minimalism Design: Consent Screen
 * - Clean card layout with checkboxes
 * - Trust-building iconography
 * - Clear, compliant copy
 */

interface ConsentItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

const consentItems: ConsentItem[] = [
  {
    id: 'terms',
    icon: FileText,
    title: 'الشروط والأحكام',
    description: 'أوافق على شروط وأحكام استخدام منصة أصل للتمويل العقاري'
  },
  {
    id: 'privacy',
    icon: Shield,
    title: 'سياسة الخصوصية',
    description: 'أوافق على سياسة الخصوصية وحماية البيانات الشخصية'
  },
  {
    id: 'data',
    icon: Database,
    title: 'مشاركة البيانات',
    description: 'أوافق على مشاركة بياناتي مع الجهات الرسمية (نفاذ، ناجز، سمة) للتحقق من الهوية والعقارات'
  }
];

export default function Consent() {
  const [, navigate] = useLocation();
  const [consents, setConsents] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    data: false
  });
  
  const allConsented = Object.values(consents).every(Boolean);
  
  const toggleConsent = (id: string) => {
    setConsents(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const handleContinue = () => {
    if (allConsented) {
      navigate('/phone');
    }
  };
  
  return (
    <div className="app-shell bg-background min-h-screen">
      {/* Header */}
      <div className="safe-area-top px-5 pt-4 pb-2">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
      
      {/* Content */}
      <div className="px-5 pt-4 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-2">
            الموافقات المطلوبة
          </h1>
          <p className="text-muted-foreground text-base mb-8">
            نحتاج موافقتك على البنود التالية للمتابعة
          </p>
        </motion.div>
        
        {/* Consent items */}
        <div className="space-y-4">
          {consentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 1), duration: 0.4 }}
              onClick={() => toggleConsent(item.id)}
              className={`card-premium cursor-pointer transition-all duration-200 ${
                consents[item.id] ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                  consents[item.id] 
                    ? 'bg-primary border-primary' 
                    : 'border-border'
                }`}>
                  {consents[item.id] && (
                    <Check className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Select all */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={() => {
            const newValue = !allConsented;
            setConsents({
              terms: newValue,
              privacy: newValue,
              data: newValue
            });
          }}
          className="w-full text-center text-primary font-medium py-4 mt-4"
        >
          {allConsented ? 'إلغاء تحديد الكل' : 'الموافقة على الكل'}
        </motion.button>
      </div>
      
      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleContinue}
          disabled={!allConsented}
          className={`w-full btn-primary flex items-center justify-center gap-3 ${
            !allConsented ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>متابعة</span>
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
