import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/* Desert Minimalism Design: Welcome Screen
 * - Full-bleed hero image with geometric overlay
 * - Warm color palette with oasis blue accents
 * - Generous spacing, premium typography
 */

export default function Welcome() {
  const [, navigate] = useLocation();
  
  return (
    <div className="app-shell bg-gradient-to-b from-[#1B4965] to-[#2D5A7B] min-h-screen relative overflow-hidden">
      {/* Geometric pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url(/images/geometric-pattern.png)',
          backgroundSize: '150px',
        }}
      />
      
      {/* Hero image section */}
      <div className="relative h-[55vh] flex items-end justify-center">
        <motion.img
          src="/images/hero-welcome.png"
          alt="أصل"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B4965] via-transparent to-transparent" />
      </div>
      
      {/* Content section */}
      <div className="relative z-10 px-6 pt-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          {/* Logo/Brand */}
          <h1 className="text-5xl font-bold text-white mb-3">أصل</h1>
          <p className="text-[#E8DCC4] text-lg mb-2">Asl</p>
          
          {/* Tagline */}
          <p className="text-white/90 text-xl leading-relaxed mt-6 mb-2">
            سيولة نقدية بضمان عقارك
          </p>
          <p className="text-white/70 text-base leading-relaxed">
            تمويل متوافق مع الشريعة الإسلامية
          </p>
        </motion.div>
        
        {/* Features highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center gap-8 mt-8 mb-10"
        >
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-[#C4956A] text-lg">٢٤</span>
            </div>
            <p className="text-white/80 text-xs">موافقة خلال ساعة</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-[#C4956A] text-lg">%٧٠</span>
            </div>
            <p className="text-white/80 text-xs">من قيمة العقار</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
              <span className="text-[#C4956A] text-lg">١٠</span>
            </div>
            <p className="text-white/80 text-xs">سنوات سداد</p>
          </div>
        </motion.div>
        
        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={() => navigate('/consent')}
          className="w-full bg-[#C4956A] text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-[#B38559] transition-colors"
        >
          <span>ابدأ الآن</span>
          <ArrowLeft className="w-5 h-5" />
        </motion.button>
        
        {/* Regulatory note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="text-white/50 text-xs text-center mt-6"
        >
          مرخص من البنك المركزي السعودي
        </motion.p>
      </div>
    </div>
  );
}
