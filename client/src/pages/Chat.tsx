import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Bell, Shield, HelpCircle, LogOut, ChevronLeft } from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';
import { useAseel } from '@/hooks/useAseel';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import TypingIndicator from '@/components/chat/TypingIndicator';
import ChatBottomNav from '@/components/chat/ChatBottomNav';
import type { NavTab } from '@/types/chat';

// ============================================
// SETTINGS BOTTOM SHEET
// ============================================

function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const settingsItems = [
    { icon: User, label: 'الملف الشخصي', sublabel: 'الاسم، الهوية، معلومات الاتصال' },
    { icon: Bell, label: 'الإشعارات', sublabel: 'إدارة التنبيهات والرسائل' },
    { icon: Shield, label: 'الأمان والخصوصية', sublabel: 'كلمة المرور، المصادقة الثنائية' },
    { icon: HelpCircle, label: 'المساعدة والدعم', sublabel: 'الأسئلة الشائعة، تواصل معنا' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-w-[430px] mx-auto"
            style={{ maxHeight: '80vh' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50" dir="rtl">
              <h2 className="font-bold text-foreground text-lg">الإعدادات</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Settings list */}
            <div className="px-5 py-3 overflow-y-auto" dir="rtl">
              {settingsItems.map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 py-4 border-b border-border/30 last:border-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#D4A64A]/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#D4A64A]" />
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}

              {/* Logout */}
              <button className="w-full flex items-center gap-3 py-4 mt-2">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 text-right">
                  <p className="font-semibold text-red-500 text-sm">تسجيل الخروج</p>
                </div>
              </button>
            </div>

            {/* Version */}
            <div className="px-5 py-3 text-center border-t border-border/30">
              <p className="text-[10px] text-muted-foreground">أصل v2.0.0 — أصيل AI</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ============================================
// MAIN CHAT PAGE
// ============================================

export default function Chat() {
  const { properties, loans, creditProfile } = useAppState();
  const scrollRef = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const [activeTab, setActiveTab] = useState<NavTab>('chat');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const {
    messages,
    isLoading,
    initConversation,
    handleUserMessage,
    handleCTAAction,
  } = useAseel({
    properties,
    loans,
    creditProfile,
    userName: 'سارة',
  });

  // Initialize conversation on mount
  useEffect(() => {
    if (!initRef.current) {
      initRef.current = true;
      initConversation();
    }
  }, [initConversation]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      requestAnimationFrame(() => {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      });
    }
  }, [messages, isLoading]);

  // Handle tab changes
  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);

    if (tab === 'settings') {
      setSettingsOpen(true);
      // Keep the active tab as chat visually, settings opens as sheet
      setActiveTab('settings');
      return;
    }

    // For non-chat tabs, inject content into the chat via CTA actions
    if (tab === 'properties') {
      handleCTAAction('show_properties');
    } else if (tab === 'loans') {
      handleCTAAction('show_loans');
    } else if (tab === 'credit') {
      handleCTAAction('show_credit');
    }

    // Always return to chat tab visually (content appears in chat)
    if (tab !== 'chat' && tab !== 'settings') {
      // Brief highlight then return
      setTimeout(() => setActiveTab('chat'), 300);
    }
  };

  return (
    <div className="app-shell h-screen flex flex-col bg-[#F8F5F0]">
      {/* Header */}
      <ChatHeader />

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 hide-scrollbar"
      >
        {/* Welcome date badge */}
        <div className="text-center mb-4">
          <span className="inline-block bg-white/80 text-muted-foreground text-xs px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('ar-SA', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>

        {/* Chat messages */}
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            onCardAction={handleCTAAction}
            onCTAAction={handleCTAAction}
          />
        ))}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <TypingIndicator />
        )}
      </div>

      {/* Input bar */}
      <ChatInput
        onSend={handleUserMessage}
        disabled={isLoading}
        placeholder="اكتب رسالتك..."
      />

      {/* Bottom Navigation */}
      <ChatBottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Settings Bottom Sheet */}
      <SettingsSheet open={settingsOpen} onClose={() => { setSettingsOpen(false); setActiveTab('chat'); }} />
    </div>
  );
}
