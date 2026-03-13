import { motion } from 'framer-motion';
import type { ChatMessage, CTAButton } from '@/types/chat';
import AseelAvatar from './AseelAvatar';
import InteractiveCard from './InteractiveCard';

interface ChatBubbleProps {
  message: ChatMessage;
  onCardAction?: (action: string, payload?: Record<string, unknown>) => void;
  onCTAAction?: (action: string, payload?: Record<string, unknown>) => void;
}

function isArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
  const matches = text.match(arabicRegex);
  if (!matches) return false;
  const nonSpace = text.replace(/\s/g, '');
  return matches.length / nonSpace.length > 0.2;
}

function CTAButtons({
  buttons,
  onAction,
}: {
  buttons: CTAButton[];
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  return (
    <div className="flex flex-col gap-2 mt-3">
      {buttons.map((btn) => {
        const baseClasses =
          'w-full py-3 px-4 rounded-xl text-sm font-bold transition-all active:scale-[0.97]';

        let variantClasses = '';
        if (btn.disabled) {
          variantClasses = 'bg-gray-200 text-gray-400 cursor-not-allowed';
        } else if (btn.variant === 'success') {
          variantClasses =
            'bg-gradient-to-l from-green-500 to-green-600 text-white shadow-md shadow-green-500/25';
        } else if (btn.variant === 'secondary') {
          variantClasses =
            'bg-white border-2 border-[#1B4965] text-[#1B4965]';
        } else {
          // primary
          variantClasses =
            'bg-gradient-to-l from-[#1B4965] to-[#2D6A8A] text-white shadow-md shadow-[#1B4965]/25';
        }

        return (
          <motion.button
            key={btn.id}
            whileTap={btn.disabled ? {} : { scale: 0.97 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            disabled={btn.disabled}
            onClick={() => {
              if (!btn.disabled) {
                onAction?.(btn.action, btn.payload);
              }
            }}
            className={`${baseClasses} ${variantClasses}`}
          >
            {btn.label}
          </motion.button>
        );
      })}
    </div>
  );
}

export default function ChatBubble({ message, onCardAction, onCTAAction }: ChatBubbleProps) {
  const isAssistant = message.role === 'assistant';
  const rtl = isArabic(message.content);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-2 mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
    >
      {/* Avatar for assistant */}
      {isAssistant && (
        <div className="flex-shrink-0 mt-1">
          <AseelAvatar size="sm" />
        </div>
      )}

      <div className={`max-w-[85%]`}>
        {/* Text bubble */}
        {message.content && (
          <div
            dir={rtl ? 'rtl' : 'ltr'}
            className={`rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
              isAssistant
                ? 'bg-white text-foreground shadow-sm border border-border/50 rounded-tr-md'
                : 'bg-[#1B4965] text-white rounded-tl-md'
            }`}
            style={{ textAlign: rtl ? 'right' : 'left' }}
          >
            {message.content}
            {message.isStreaming && (
              <span className="inline-block w-1.5 h-4 bg-current opacity-60 animate-pulse mr-0.5 align-middle" />
            )}
          </div>
        )}

        {/* Interactive card */}
        {message.card && (
          <div className="mt-2">
            <InteractiveCard card={message.card} onAction={onCardAction} />
          </div>
        )}

        {/* CTA Buttons */}
        {message.cta && message.cta.length > 0 && (
          <CTAButtons buttons={message.cta} onAction={onCTAAction} />
        )}
      </div>
    </motion.div>
  );
}
