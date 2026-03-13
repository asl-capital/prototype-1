import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

/* ASL Brand Design System: Welcome Screen
 * - Full-bleed golden Riyadh cityscape background (Asl-bkgd01.png)
 * - Primary Gold #D4A64A for buttons
 * - Navy/dark text for readability on gold background
 * - Premium, calm, Saudi-contextual
 */

export default function Welcome() {
  const [, navigate] = useLocation();
  
  return (
    <div className="app-shell min-h-screen relative overflow-hidden">
      {/* Full-screen background image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <img
          src="/images/Asl-bkgd01.png"
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Subtle overlay for text readability - light warm tint at top */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EE]/60 via-transparent to-[#F4E6CF]/40" />
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col min-h-screen px-6 pt-16 pb-10">
        {/* Top section - Logo & Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center"
        >
          {/* Logo */}
          <h1 className="text-6xl font-bold text-[#2A2A2A] mb-2">أصل</h1>
          <p className="text-[#6B6256] text-lg font-medium tracking-widest">ASL</p>
        </motion.div>
        
        {/* Spacer to push content down */}
        <div className="flex-1" />
        
        {/* Bottom section - Tagline, features, CTA */}
        <div>
          {/* Tagline - Updated slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center mb-8"
          >
            <p className="text-[#2A2A2A] text-xl font-semibold leading-relaxed mb-2">
              سيولة نقدية بضمان عقارك
            </p>
            <p className="text-[#6B6256] text-base leading-relaxed">
              قوة الذكاء الاصطناعي، بأمان الشريعة الإسلامية
            </p>
          </motion.div>
          
          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-center gap-6 mb-10"
          >
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#D4A64A]/15 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <span className="text-[#B6831F] text-lg font-bold">٢٤</span>
              </div>
              <p className="text-[#6B6256] text-xs font-medium">موافقة خلال ساعة</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#D4A64A]/15 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <span className="text-[#B6831F] text-lg font-bold">%٧٠</span>
              </div>
              <p className="text-[#6B6256] text-xs font-medium">من قيمة العقار</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#D4A64A]/15 flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                <span className="text-[#B6831F] text-lg font-bold">١٠</span>
              </div>
              <p className="text-[#6B6256] text-xs font-medium">سنوات سداد</p>
            </div>
          </motion.div>
          
          {/* CTA Button - Primary Gold per design system */}
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={() => navigate('/consent')}
            className="w-full bg-[#D4A64A] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all shadow-lg shadow-[#D4A64A]/30 hover:bg-[#C9952F]"
          >
            <span>ابدأ الآن</span>
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          {/* Regulatory note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-[#B9AD96] text-xs text-center mt-6"
          >
            مرخص من البنك المركزي السعودي
          </motion.p>
        </div>
      </div>
    </div>
  );
}
