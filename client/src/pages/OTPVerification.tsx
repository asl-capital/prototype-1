import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: OTP Verification
 * - Auto-advance segmented input
 * - Smooth transitions between digits
 * - Resend timer functionality
 */

export default function OTPVerification() {
  const [, navigate] = useLocation();
  const { phoneNumber } = useAppState();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);
  
  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);
  
  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);
    
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError('');
    
    // Auto-advance to next input
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit when all digits entered
    if (digit && index === 3 && newOtp.every(d => d)) {
      handleVerify(newOtp.join(''));
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pastedData.length === 4) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[3]?.focus();
      handleVerify(pastedData);
    }
  };
  
  const handleVerify = async (code: string) => {
    setIsVerifying(true);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demo, accept any 4-digit code
    if (code.length === 4) {
      navigate('/nafath');
    } else {
      setError('رمز التحقق غير صحيح');
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
    
    setIsVerifying(false);
  };
  
  const handleResend = () => {
    if (resendTimer === 0) {
      setResendTimer(60);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
      // Show success toast
    }
  };
  
  const maskedPhone = phoneNumber 
    ? `${phoneNumber.slice(0, 4)}****${phoneNumber.slice(-3)}`
    : '+966 5** *** **';
  
  return (
    <div className="app-shell bg-background min-h-screen">
      {/* Header */}
      <div className="safe-area-top px-5 pt-4 pb-2">
        <button 
          onClick={() => navigate('/phone')}
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
          <h1 className="text-2xl font-bold text-foreground mb-2">
            رمز التحقق
          </h1>
          <p className="text-muted-foreground text-base mb-2">
            أدخل الرمز المرسل إلى
          </p>
          <p className="text-foreground font-medium text-lg mb-8" dir="ltr">
            {maskedPhone}
          </p>
        </motion.div>
        
        {/* OTP Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center gap-3 mb-6"
          dir="ltr"
        >
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => { inputRefs.current[index] = el; }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              disabled={isVerifying}
              className={`otp-input ${
                digit ? 'border-primary bg-primary/5' : ''
              } ${error ? 'border-destructive' : ''} ${
                isVerifying ? 'opacity-50' : ''
              }`}
            />
          ))}
        </motion.div>
        
        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm text-center mb-4"
          >
            {error}
          </motion.p>
        )}
        
        {/* Verifying state */}
        {isVerifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-primary mb-4"
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">جاري التحقق...</span>
          </motion.div>
        )}
        
        {/* Resend option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          {resendTimer > 0 ? (
            <p className="text-muted-foreground text-sm">
              إعادة الإرسال خلال <span className="font-medium text-foreground">{resendTimer}</span> ثانية
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-primary font-medium text-sm"
            >
              إعادة إرسال الرمز
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
