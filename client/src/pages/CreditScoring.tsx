import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Brain, Landmark, BarChart3, Shield, Calculator } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';

/* Fix 6: Credit Scoring Splash Screen
 * - Animated multi-step progress sequence
 * - Shows instant credit scoring via open banking + AI
 * - Appears after PropertySync, before Chat
 * - Desert Minimalism design
 */

interface ScoringStep {
  id: number;
  labelAr: string;
  labelEn: string;
  icon: typeof Brain;
  completed: boolean;
  active: boolean;
}

const initialSteps: ScoringStep[] = [
  { id: 1, labelAr: 'ربط حسابك البنكي عبر البنك المفتوح', labelEn: 'Open Banking', icon: Landmark, completed: false, active: false },
  { id: 2, labelAr: 'تحليل التدفقات النقدية والالتزامات', labelEn: 'AI Cash Flow Analysis', icon: BarChart3, completed: false, active: false },
  { id: 3, labelAr: 'مراجعة السجل الائتماني — SIMAH', labelEn: 'Credit Bureau Check', icon: Shield, completed: false, active: false },
  { id: 4, labelAr: 'تقييم القدرة على السداد بالذكاء الاصطناعي', labelEn: 'AI Repayment Scoring', icon: Brain, completed: false, active: false },
  { id: 5, labelAr: 'احتساب نقاط الجدارة الائتمانية', labelEn: 'Final Score Calculation', icon: Calculator, completed: false, active: false },
];

function CircularProgress({ score, size = 140, strokeWidth = 8 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#4ADE80"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      {/* Score text in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-4xl font-bold text-white"
        >
          {score}
        </motion.span>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-green-400 text-sm font-semibold mt-1"
        >
          ممتاز
        </motion.span>
      </div>
    </div>
  );
}

export default function CreditScoring() {
  const [, navigate] = useLocation();
  const { setIsAuthenticated, setCurrentFlow } = useAppState();
  const [steps, setSteps] = useState<ScoringStep[]>(initialSteps);
  const [showResult, setShowResult] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const currentStepRef = useRef(0);

  // Animate steps one by one
  useEffect(() => {
    const stepDelay = 800; // ms between steps

    const animateStep = (index: number) => {
      if (index >= initialSteps.length) {
        // All steps done, show result after a brief pause
        setTimeout(() => setShowResult(true), 400);
        setTimeout(() => setShowCTA(true), 1800);
        return;
      }

      // Mark current step as active
      setSteps(prev => prev.map((s, i) => ({
        ...s,
        active: i === index,
        completed: i < index,
      })));

      // After a delay, mark it completed and move to next
      setTimeout(() => {
        setSteps(prev => prev.map((s, i) => ({
          ...s,
          completed: i <= index,
          active: i === index + 1,
        })));
        currentStepRef.current = index + 1;
        animateStep(index + 1);
      }, stepDelay);
    };

    // Start after a brief initial delay
    const timer = setTimeout(() => animateStep(0), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    setIsAuthenticated(true);
    setCurrentFlow('main');
    navigate('/chat');
  };

  return (
    <div className="app-shell bg-gradient-to-b from-[#1A1A2E] to-[#2A2A3E] min-h-screen relative overflow-hidden">
      {/* Geometric pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'url(/images/geometric-pattern.png)',
          backgroundSize: '150px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="steps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-sm"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-5"
                >
                  <Brain className="w-10 h-10 text-white" />
                </motion.div>
                <h1 className="text-xl font-bold text-white mb-2">
                  جاري تقييم جدارتك الائتمانية
                </h1>
                <p className="text-white/60 text-sm">
                  Instant AI Credit Scoring
                </p>
              </motion.div>

              {/* Steps list */}
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                        step.completed
                          ? 'bg-white/10'
                          : step.active
                          ? 'bg-white/15 ring-1 ring-white/30'
                          : 'bg-white/5'
                      }`}
                      dir="rtl"
                    >
                      {/* Icon/check */}
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        step.completed
                          ? 'bg-green-500/20'
                          : step.active
                          ? 'bg-[#D4A64A]/20'
                          : 'bg-white/10'
                      }`}>
                        {step.completed ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <CheckCircle2 className="w-5 h-5 text-green-400" />
                          </motion.div>
                        ) : step.active ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          >
                            <Icon className="w-5 h-5 text-[#D4A64A]" />
                          </motion.div>
                        ) : (
                          <Icon className="w-5 h-5 text-white/30" />
                        )}
                      </div>

                      {/* Labels */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          step.completed ? 'text-white' : step.active ? 'text-white' : 'text-white/40'
                        }`}>
                          {step.labelAr}
                        </p>
                        <p className={`text-[11px] ${
                          step.completed ? 'text-white/60' : step.active ? 'text-white/50' : 'text-white/25'
                        }`}>
                          {step.labelEn}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm text-center"
            >
              {/* Score ring */}
              <div className="flex justify-center mb-6">
                <CircularProgress score={78} />
              </div>

              {/* Result details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-3 mb-6"
              >
                <div className="bg-white/10 rounded-xl p-4 space-y-2" dir="rtl">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">الدخل الشهري المقدر</span>
                    <span className="text-white font-bold">٢٢,٠٠٠ ر.س</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">نسبة الالتزامات</span>
                    <span className="text-white font-bold">٣٢٪</span>
                  </div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-white font-semibold text-base"
                >
                  تهانينا! أنت مؤهل للتمويل العقاري
                </motion.p>
              </motion.div>

              {/* CTA Button */}
              <AnimatePresence>
                {showCTA && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    onClick={handleContinue}
                    className="w-full bg-[#D4A64A] text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-[#C9952F] transition-colors active:scale-[0.97]"
                  >
                    ابدأ رحلة التمويل مع أصيل
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
