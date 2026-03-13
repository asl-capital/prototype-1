import AseelAvatar from './AseelAvatar';

export default function ChatHeader() {
  return (
    <div className="safe-area-top bg-white/95 backdrop-blur-sm border-b border-border/50 px-4 py-3">
      <div className="flex items-center gap-3 max-w-[430px] mx-auto">
        <AseelAvatar size="md" />
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground text-base leading-tight">أصيل</h1>
          <p className="text-xs text-muted-foreground">مساعدك المالي الذكي</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-muted-foreground">متصل</span>
        </div>
      </div>
    </div>
  );
}
