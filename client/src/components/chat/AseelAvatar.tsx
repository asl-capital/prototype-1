import { motion } from 'framer-motion';

interface AseelAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export default function AseelAvatar({ size = 'md', animate = false }: AseelAvatarProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const Wrapper = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { scale: 0.8, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }
    : {};

  return (
    <Wrapper
      {...(animationProps as any)}
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-[#D4A64A] to-[#B6831F] flex items-center justify-center flex-shrink-0 shadow-md`}
    >
      <span className="text-white font-bold" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        أ
      </span>
    </Wrapper>
  );
}
