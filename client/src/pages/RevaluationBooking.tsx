import { useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Clock, User, CreditCard, CheckCircle2 } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppState } from '@/contexts/AppStateContext';

/* Desert Minimalism Design: Revaluation Booking
 * - Slot selection (date/time)
 * - Cost display
 * - Contact person input
 */

interface TimeSlot {
  id: string;
  date: string;
  dateLabel: string;
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { id: '1', date: '2026-01-18', dateLabel: 'السبت 18 يناير', time: '09:00 - 11:00', available: true },
  { id: '2', date: '2026-01-18', dateLabel: 'السبت 18 يناير', time: '14:00 - 16:00', available: true },
  { id: '3', date: '2026-01-19', dateLabel: 'الأحد 19 يناير', time: '09:00 - 11:00', available: false },
  { id: '4', date: '2026-01-19', dateLabel: 'الأحد 19 يناير', time: '14:00 - 16:00', available: true },
  { id: '5', date: '2026-01-20', dateLabel: 'الإثنين 20 يناير', time: '09:00 - 11:00', available: true },
  { id: '6', date: '2026-01-20', dateLabel: 'الإثنين 20 يناير', time: '14:00 - 16:00', available: true },
];

const REVALUATION_COST = 2500;

export default function RevaluationBooking() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const { properties } = useAppState();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const property = properties.find(p => p.id === params.id);
  
  const handleSubmit = async () => {
    if (!selectedSlot || !contactName || !contactPhone) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSuccess(true);
    
    // Navigate back after showing success
    setTimeout(() => {
      navigate(`/property/${params.id}`);
    }, 2000);
  };
  
  const isFormValid = selectedSlot && contactName.length >= 2 && contactPhone.length >= 9;
  
  if (isSuccess) {
    return (
      <AppLayout showNav={false}>
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              تم حجز الموعد بنجاح
            </h1>
            <p className="text-muted-foreground">
              سيتم التواصل معك قبل الموعد للتأكيد
            </p>
          </motion.div>
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
            onClick={() => navigate(`/property/${params.id}`)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
          >
            <ArrowRight className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">طلب إعادة تقييم</h1>
        </div>
        
        <div className="px-5 pt-4 pb-32">
          {/* Property info */}
          {property && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-secondary/50 rounded-xl p-4 mb-6"
            >
              <p className="text-sm text-muted-foreground mb-1">العقار</p>
              <p className="font-semibold text-foreground">{property.title}</p>
              <p className="text-sm text-muted-foreground">{property.location}</p>
            </motion.div>
          )}
          
          {/* Cost info */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-premium mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">تكلفة إعادة التقييم</p>
                <p className="text-xl font-bold text-foreground">
                  {REVALUATION_COST.toLocaleString('ar-SA')} ر.س
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              * يتم الدفع عند زيارة المقيّم المعتمد
            </p>
          </motion.div>
          
          {/* Time slot selection */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              اختر موعد الزيارة
            </h2>
            
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => slot.available && setSelectedSlot(slot.id)}
                  disabled={!slot.available}
                  className={`w-full p-4 rounded-xl border-2 text-right transition-all ${
                    selectedSlot === slot.id
                      ? 'border-primary bg-primary/5'
                      : slot.available
                      ? 'border-border bg-white hover:border-primary/50'
                      : 'border-border bg-muted/50 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground" dir="ltr">{slot.time}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{slot.dateLabel}</p>
                    </div>
                  </div>
                  {!slot.available && (
                    <p className="text-xs text-destructive mt-2">غير متاح</p>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
          
          {/* Contact person */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              بيانات التواصل
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  اسم الشخص المسؤول عن استقبال المقيّم
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="الاسم الكامل"
                  className="input-field"
                />
              </div>
              
              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  رقم الجوال للتواصل
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="05XXXXXXXX"
                  className="input-field"
                  dir="ltr"
                  style={{ textAlign: 'right' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-5 safe-area-bottom" style={{ maxWidth: '430px', margin: '0 auto' }}>
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full btn-primary ${
              !isFormValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'جاري الحجز...' : 'تأكيد الحجز'}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
