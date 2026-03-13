import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ onSend, disabled = false, placeholder }: ChatInputProps) {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [text]);

  return (
    <div className="border-t border-border/50 bg-white/95 backdrop-blur-sm px-3 py-3 safe-area-bottom">
      <div className="flex items-end gap-2 max-w-[430px] mx-auto">
        {/* Mic button (decorative) */}
        <button
          className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground"
          aria-label="Voice input"
        >
          <Mic className="w-5 h-5" />
        </button>

        {/* Text input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={placeholder || 'اكتب رسالتك...'}
            rows={1}
            dir="auto"
            className="w-full resize-none rounded-2xl border border-border/60 bg-[#F8F5F0] px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#D4A64A]/20 focus:border-[#D4A64A] transition-all disabled:opacity-50"
            style={{ maxHeight: '120px' }}
          />
        </div>

        {/* Send button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim() || disabled}
          className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4A64A] flex items-center justify-center text-white disabled:opacity-40 transition-opacity"
          aria-label="Send"
        >
          <Send className="w-5 h-5 -rotate-45" style={{ transform: 'scaleX(-1) rotate(-45deg)' }} />
        </motion.button>
      </div>
    </div>
  );
}
