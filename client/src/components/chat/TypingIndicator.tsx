import { motion } from 'framer-motion';
import AseelAvatar from './AseelAvatar';

export default function TypingIndicator() {
  return (
    <div className="flex gap-2 mb-4 justify-start">
      <div className="flex-shrink-0 mt-1">
        <AseelAvatar size="sm" />
      </div>
      <div className="bg-white rounded-2xl rounded-tr-md px-4 py-3 shadow-sm border border-border/50">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-[#D4A64A]/40"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
