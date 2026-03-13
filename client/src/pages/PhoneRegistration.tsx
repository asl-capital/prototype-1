import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Phone } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Phone Registration
 * - Single input field with +966 prefix
 * - Smooth typing experience
 * - Clean validation feedback
 */

export default function PhoneRegistration() {
  const [, navigate] = useLocation();
  const { setPhoneNumber } = useAppState();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Auto-focus input on mount
    inputRef.current?.focus();
  }, []);
  
  const formatPhoneNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');
    // Limit to 9 digits (Saudi mobile without country code)
    return digits.slice(0, 9);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
    setError('');
  };
  
  const isValidPhone = phone.length === 9 && phone.startsWith('5');
  
  const handleContinue = () => {
    if (!isValidPhone) {
      setError('يرجى إدخال رقم جوال صحيح يبدأ بـ 5');
      return;
    }
    setPhoneNumber(`+966${phone}`);
    navigate('/otp');
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValidPhone) {
      handleContinue();
    }
  };
  
  return (
    <div className="app-shell bg-background min-h-screen">
      {/* Header */}
      <div className="safe-area-top px-5 pt-4 pb-2">
        <button 
          onClick={() => navigate('/consent')}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowRight className="w-5 h-5 text-foreground" />
        </button>
      </div>
      
      {/* Progress indicator */}
      <div className="px-5 pt-2">
        <div className="flex gap-2">
          <div className="h-1 flex-1 rounded-full bg-primary" />
          <div className="h-1 flex-1 rounded-full bg-muted" />
          <div className="h-1 flex-1 rounded-full bg-muted" />
        </div>
      </div>
      
      {/* Content */}
      <div className="px-5 pt-8 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Phone className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            رقم الجوال
          </h1>
          <p className="text-muted-foreground text-base mb-8">
            أدخل رقم جوالك المسجل في أبشر لإرسال رمز التحقق
          </p>
        </motion.div>
        
        {/* Phone input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className={`relative bg-white border-2 rounded-xl transition-colors ${
            error ? 'border-destructive' : phone ? 'border-primary' : 'border-border'
          }`}>
            {/* Country code prefix */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <span className="text-lg font-medium text-foreground">966+</span>
              <div className="w-px h-6 bg-border" />
            </div>
            
            <input
              ref={inputRef}
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={handlePhoneChange}
              onKeyPress={handleKeyPress}
              placeholder="5XXXXXXXX"
              className="w-full py-5 pr-24 pl-4 text-lg font-medium text-foreground bg-transparent focus:outline-none"
              style={{ direction: 'ltr', textAlign: 'left' }}
            />
          </div>
          
          {/* Error message */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-destructive text-sm mt-2"
            >
              {error}
            </motion.p>
          )}
          
          {/* Helper text */}
          <p className="text-muted-foreground text-sm mt-3">
            سيتم إرسال رمز تحقق مكون من 4 أرقام
          </p>
        </motion.div>
      </div>
      
      {/* Fixed bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleContinue}
          disabled={!isValidPhone}
          className={`w-full btn-primary flex items-center justify-center gap-3 ${
            !isValidPhone ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <span>إرسال رمز التحقق</span>
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
