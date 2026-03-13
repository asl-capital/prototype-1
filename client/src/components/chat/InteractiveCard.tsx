import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, CheckCircle2, FileText, Scale, Landmark,
  PartyPopper, Calendar, Shield, TrendingUp, Clock,
  MapPin, CreditCard, Wallet, BadgeCheck, AlertCircle,
} from 'lucide-react';
import type { CardData, TimeSlot } from '@/types/chat';

interface InteractiveCardProps {
  card: CardData;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('ar-SA').format(amount);
};

// ============================================
// PROPERTY LIST CARD
// ============================================

function PropertyListCard({
  payload,
  onAction,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  const properties = payload.properties as Array<{
    id: string;
    title: string;
    type: string;
    location: string;
    estimatedValue: number;
    eligibleAmount: number;
    qualificationStatus: string;
    imageUrl?: string;
  }>;

  return (
    <div className="space-y-3">
      {properties
        .filter((p) => p.qualificationStatus !== 'not_qualified')
        .map((property) => (
          <motion.div
            key={property.id}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden"
          >
            <div className="h-28 bg-gradient-to-bl from-[#1B4965]/10 to-[#C4956A]/10 flex items-center justify-center relative">
              <Building2 className="w-10 h-10 text-[#1B4965]/30" />
              {property.qualificationStatus === 'qualified_24h' && (
                <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  مؤهل ٢٤ ساعة
                </span>
              )}
              {property.qualificationStatus === 'qualified_48h' && (
                <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  مؤهل ٤٨ ساعة
                </span>
              )}
            </div>

            <div className="p-3" dir="rtl">
              <h4 className="font-bold text-foreground text-sm">{property.title}</h4>
              <p className="text-xs text-muted-foreground mb-2">{property.location}</p>

              <div className="flex justify-between items-center text-xs mb-3">
                <div>
                  <span className="text-muted-foreground">القيمة: </span>
                  <span className="font-semibold">{formatCurrency(property.estimatedValue)} ر.س</span>
                </div>
                <div>
                  <span className="text-muted-foreground">مؤهل حتى: </span>
                  <span className="font-semibold text-[#1B4965]">{formatCurrency(property.eligibleAmount)} ر.س</span>
                </div>
              </div>

              <button
                onClick={() => onAction?.('select_property', { propertyId: property.id })}
                className="w-full bg-[#1B4965] text-white text-sm font-medium py-2.5 rounded-lg active:scale-[0.98] transition-transform"
              >
                اختر هذا العقار
              </button>
            </div>
          </motion.div>
        ))}
    </div>
  );
}

// ============================================
// LOAN SUMMARY CARD
// ============================================

function LoanSummaryCard({ payload }: { payload: Record<string, unknown> }) {
  const amount = payload.amount as number;
  const tenor = payload.tenor as number;
  const monthlyPayment = payload.monthlyPayment as number;
  const apr = payload.apr as number;
  const totalPayment = payload.totalPayment as number;
  const totalProfit = payload.totalProfit as number;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#1B4965] to-[#2D5A7B] p-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-white/80" />
          <span className="text-white/80 text-xs">ملخص التمويل</span>
        </div>
        <p className="text-2xl font-bold text-white">
          {formatCurrency(amount)} <span className="text-sm font-normal">ر.س</span>
        </p>
        <p className="text-white/70 text-xs mt-1">لمدة {tenor} سنوات</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">القسط الشهري</span>
          <span className="font-bold text-foreground">{formatCurrency(monthlyPayment)} ر.س</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">معدل النسبة السنوي</span>
          <span className="font-bold text-foreground">{apr}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">إجمالي الربح</span>
          <span className="font-bold text-foreground">{formatCurrency(totalProfit)} ر.س</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="text-muted-foreground text-sm">إجمالي المبلغ المستحق</span>
          <span className="font-bold text-[#1B4965] text-lg">{formatCurrency(totalPayment)} ر.س</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// DECISION CARD
// ============================================

function DecisionCard({ payload }: { payload: Record<string, unknown> }) {
  const result = payload.result as string;
  const amount = payload.amount as number;
  const tenor = payload.tenor as number;
  const monthlyPayment = payload.monthlyPayment as number;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div
        className={`p-4 text-center ${
          result === 'approved'
            ? 'bg-gradient-to-l from-green-500 to-green-600'
            : 'bg-gradient-to-l from-amber-500 to-amber-600'
        }`}
      >
        <CheckCircle2 className="w-10 h-10 text-white mx-auto mb-2" />
        <h3 className="text-white font-bold text-lg">
          {result === 'approved' ? 'تمت الموافقة!' : 'موافقة مشروطة'}
        </h3>
        <p className="text-white/80 text-sm mt-1">
          {result === 'approved'
            ? 'تهانينا! تمت الموافقة على طلب التمويل'
            : 'تمت الموافقة المبدئية مع بعض الشروط'}
        </p>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">مبلغ التمويل</span>
          <span className="font-bold">{formatCurrency(amount)} ر.س</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">المدة</span>
          <span className="font-bold">{tenor} سنوات</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">القسط الشهري</span>
          <span className="font-bold text-[#1B4965]">{formatCurrency(monthlyPayment)} ر.س</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// CONTRACT CARD
// ============================================

function ContractCard({
  payload,
  onAction,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="p-4 bg-[#F8F5F0]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#1B4965]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#1B4965]" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">عقد التمويل</h4>
            <p className="text-xs text-muted-foreground">عقد مرابحة سلع</p>
          </div>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• مبلغ التمويل: {formatCurrency(payload.amount as number)} ر.س</p>
          <p>• مدة السداد: {payload.tenor as number} سنوات</p>
          <p>• القسط الشهري: {formatCurrency(payload.monthlyPayment as number)} ر.س</p>
        </div>
      </div>
      <div className="p-3">
        <button
          onClick={() => onAction?.('view_contract')}
          className="w-full bg-[#1B4965] text-white text-sm font-medium py-2.5 rounded-lg active:scale-[0.98] transition-transform"
        >
          عرض العقد الكامل
        </button>
      </div>
    </div>
  );
}

// ============================================
// ACTION CARD (Najiz / Sharia)
// ============================================

function ActionCard({
  payload,
  onAction,
  icon: Icon,
  title,
  description,
  buttonText,
  actionName,
  completed,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
  icon: typeof Scale;
  title: string;
  description: string;
  buttonText: string;
  actionName: string;
  completed?: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              completed ? 'bg-green-100' : 'bg-[#1B4965]/10'
            }`}
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Icon className="w-5 h-5 text-[#1B4965]" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        {!completed && (
          <button
            onClick={() => onAction?.(actionName)}
            className="w-full bg-[#1B4965] text-white text-sm font-medium py-2.5 rounded-lg active:scale-[0.98] transition-transform"
          >
            {buttonText}
          </button>
        )}
        {completed && (
          <div className="text-center text-green-600 text-sm font-medium py-2">
            <CheckCircle2 className="w-4 h-4 inline-block ml-1" />
            تم بنجاح
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// DISBURSEMENT CARD
// ============================================

function DisbursementCard({ payload }: { payload: Record<string, unknown> }) {
  const amount = payload.amount as number;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-5 text-center">
        <PartyPopper className="w-12 h-12 text-white mx-auto mb-3" />
        <h3 className="text-white font-bold text-lg mb-1">تم صرف التمويل!</h3>
        <p className="text-3xl font-bold text-white">{formatCurrency(amount)} ر.س</p>
        <p className="text-white/80 text-sm mt-2">تم إيداع المبلغ في حسابك البنكي</p>
      </div>
      <div className="p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-600">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">متوافق مع الشريعة الإسلامية</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAYMENT SCHEDULE CARD
// ============================================

function PaymentScheduleCard({ payload }: { payload: Record<string, unknown> }) {
  const monthlyPayment = payload.monthlyPayment as number;
  const tenor = payload.tenor as number;
  const nextPaymentDate = payload.nextPaymentDate as string;
  const remainingBalance = payload.remainingBalance as number;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="p-4 bg-[#F8F5F0]">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-[#1B4965]" />
          <span className="font-bold text-foreground text-sm">جدول السداد</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">القسط الشهري</span>
          <span className="font-bold">{formatCurrency(monthlyPayment)} ر.س</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">المدة المتبقية</span>
          <span className="font-bold">{tenor} سنوات</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground text-sm">القسط القادم</span>
          <span className="font-bold">{nextPaymentDate}</span>
        </div>
        <div className="flex justify-between border-t border-border pt-3">
          <span className="text-muted-foreground text-sm">الرصيد المتبقي</span>
          <span className="font-bold text-[#1B4965]">{formatCurrency(remainingBalance)} ر.س</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REVALUATION: CURRENT VALUE CARD
// ============================================

function RevalCurrentValueCard({ payload }: { payload: Record<string, unknown> }) {
  const propertyTitle = payload.propertyTitle as string;
  const currentValue = payload.currentValue as number;
  const lastValued = payload.lastValued as string;
  const location = payload.location as string;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#C4956A]/20 to-[#C4956A]/5 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#C4956A]/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-[#C4956A]" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm">التقييم الحالي</h4>
            <p className="text-xs text-muted-foreground">{propertyTitle}</p>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">القيمة التقديرية</span>
          <span className="font-bold text-[#1B4965] text-lg">{formatCurrency(currentValue)} ر.س</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" /> الموقع
          </span>
          <span className="font-medium text-foreground text-sm">{location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <Clock className="w-3 h-3" /> آخر تقييم
          </span>
          <span className="font-medium text-foreground text-sm">{lastValued}</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REVALUATION: TIME SLOT PICKER CARD
// ============================================

function RevalTimeSlotPickerCard({
  payload,
  onAction,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  const slots = payload.slots as TimeSlot[];
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // Group slots by date
  const grouped: Record<string, TimeSlot[]> = {};
  for (const slot of slots) {
    if (!grouped[slot.dayLabel]) grouped[slot.dayLabel] = [];
    grouped[slot.dayLabel].push(slot);
  }

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#1B4965]/10 to-[#1B4965]/5 p-4">
        <div className="flex items-center gap-2 mb-1">
          <Calendar className="w-4 h-4 text-[#1B4965]" />
          <span className="font-bold text-foreground text-sm">اختر موعد الزيارة</span>
        </div>
        <p className="text-xs text-muted-foreground">اختر الموعد المناسب لزيارة المقيّم المعتمد</p>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(grouped).map(([dayLabel, daySlots]) => (
          <div key={dayLabel}>
            <p className="text-xs font-semibold text-muted-foreground mb-2">{dayLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {daySlots.map((slot) => {
                const isSelected = selectedSlotId === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`py-2.5 px-3 rounded-lg text-xs font-medium border-2 transition-all ${
                      isSelected
                        ? 'border-[#1B4965] bg-[#1B4965]/10 text-[#1B4965]'
                        : 'border-border/60 bg-white text-foreground hover:border-[#1B4965]/30'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{slot.time}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-0.5 block">
                      {slot.period === 'morning' ? 'صباحي' : 'مسائي'}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border/50">
        <button
          onClick={() => {
            if (selectedSlotId) {
              const slot = slots.find((s) => s.id === selectedSlotId);
              onAction?.('confirm_reval_slot', { slot });
            }
          }}
          disabled={!selectedSlotId}
          className={`w-full text-sm font-bold py-3 rounded-xl transition-all active:scale-[0.97] ${
            selectedSlotId
              ? 'bg-[#1B4965] text-white shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          تأكيد الموعد
        </button>
      </div>
    </div>
  );
}

// ============================================
// REVALUATION: BOOKING SUMMARY CARD
// ============================================

function RevalBookingSummaryCard({ payload }: { payload: Record<string, unknown> }) {
  const propertyTitle = payload.propertyTitle as string;
  const slotDay = payload.slotDay as string;
  const slotTime = payload.slotTime as string;
  const fee = payload.fee as number;
  const valuatorName = payload.valuatorName as string;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#C4956A] to-[#D4A574] p-4 text-center">
        <Calendar className="w-8 h-8 text-white mx-auto mb-2" />
        <h3 className="text-white font-bold text-base">تأكيد موعد التقييم</h3>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">العقار</span>
          <span className="font-bold text-foreground text-sm">{propertyTitle}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">التاريخ</span>
          <span className="font-bold text-foreground text-sm">{slotDay}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">الوقت</span>
          <span className="font-bold text-foreground text-sm">{slotTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">المقيّم المعتمد</span>
          <span className="font-bold text-foreground text-sm">{valuatorName}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <span className="text-muted-foreground text-sm flex items-center gap-1">
            <CreditCard className="w-3 h-3" /> رسوم التقييم
          </span>
          <span className="font-bold text-[#C4956A] text-lg">{formatCurrency(fee)} ر.س</span>
        </div>
      </div>
    </div>
  );
}

// ============================================
// REVALUATION: BOOKING SUCCESS CARD
// ============================================

function RevalBookingSuccessCard({ payload }: { payload: Record<string, unknown> }) {
  const referenceNumber = payload.referenceNumber as string;
  const slotDay = payload.slotDay as string;
  const slotTime = payload.slotTime as string;
  const propertyTitle = payload.propertyTitle as string;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-green-500 to-emerald-600 p-5 text-center">
        <BadgeCheck className="w-12 h-12 text-white mx-auto mb-2" />
        <h3 className="text-white font-bold text-lg mb-1">تم الحجز بنجاح!</h3>
        <p className="text-white/80 text-sm">سيتم زيارة العقار في الموعد المحدد</p>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">رقم المرجع</span>
          <span className="font-bold text-[#1B4965] font-mono">{referenceNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">العقار</span>
          <span className="font-bold text-foreground text-sm">{propertyTitle}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">الموعد</span>
          <span className="font-bold text-foreground text-sm">{slotDay} - {slotTime}</span>
        </div>
      </div>
      <div className="p-3 bg-green-50 border-t border-green-100">
        <p className="text-xs text-green-700 text-center flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3" />
          سيتم إرسال تأكيد عبر SMS ورسالة على التطبيق
        </p>
      </div>
    </div>
  );
}

// ============================================
// NAV TAB: PROPERTIES LIST CARD
// ============================================

function PropertiesListCard({ payload }: { payload: Record<string, unknown> }) {
  const properties = payload.properties as Array<{
    id: string;
    title: string;
    type: string;
    location: string;
    estimatedValue: number;
    qualificationStatus: string;
  }>;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#1B4965]/10 to-[#1B4965]/5 p-4">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#1B4965]" />
          <span className="font-bold text-foreground text-sm">عقاراتي</span>
        </div>
      </div>
      <div className="divide-y divide-border/50">
        {properties.map((p) => (
          <div key={p.id} className="p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1B4965]/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-[#1B4965]/50" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-sm truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.location}</p>
            </div>
            <div className="text-left flex-shrink-0">
              <p className="font-bold text-[#1B4965] text-sm">{formatCurrency(p.estimatedValue)}</p>
              <p className="text-[10px] text-muted-foreground">ر.س</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// NAV TAB: LOANS LIST CARD
// ============================================

function LoansListCard({ payload }: { payload: Record<string, unknown> }) {
  const loans = payload.loans as Array<{
    id: string;
    propertyTitle: string;
    amount: number;
    monthlyPayment: number;
    status: string;
    remainingBalance?: number;
    nextPaymentDate?: string;
  }>;

  const statusLabels: Record<string, { label: string; color: string }> = {
    active: { label: 'نشط', color: 'bg-green-100 text-green-700' },
    processing: { label: 'قيد المعالجة', color: 'bg-amber-100 text-amber-700' },
    closed: { label: 'مغلق', color: 'bg-gray-100 text-gray-500' },
  };

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#1B4965]/10 to-[#1B4965]/5 p-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-[#1B4965]" />
          <span className="font-bold text-foreground text-sm">تمويلاتي</span>
        </div>
      </div>
      {loans.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-sm">
          لا توجد تمويلات حالياً
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {loans.map((loan) => {
            const st = statusLabels[loan.status] || statusLabels.active;
            return (
              <div key={loan.id} className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-foreground text-sm">{loan.propertyTitle}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${st.color}`}>
                    {st.label}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">مبلغ التمويل</span>
                  <span className="font-semibold">{formatCurrency(loan.amount)} ر.س</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-muted-foreground">القسط الشهري</span>
                  <span className="font-semibold">{formatCurrency(loan.monthlyPayment)} ر.س</span>
                </div>
                {loan.nextPaymentDate && (
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">القسط القادم</span>
                    <span className="font-semibold">{loan.nextPaymentDate}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// NAV TAB: CREDIT SUMMARY CARD
// ============================================

function CreditSummaryCard({ payload }: { payload: Record<string, unknown> }) {
  const score = payload.eligibilityScore as number;
  const income = payload.averageIncome as number;
  const stability = payload.flowStability as number;
  const obligations = payload.estimatedObligations as number;
  const safetyMargin = payload.cashSafetyMargin as number;
  const lastUpdated = payload.lastUpdated as string;

  const scoreColor = score >= 70 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-500';
  const scoreLabel = score >= 70 ? 'ممتاز' : score >= 50 ? 'جيد' : 'يحتاج تحسين';

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#1B4965] to-[#2D5A7B] p-4 text-center">
        <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
        <p className="text-white/80 text-xs">تقييمي الائتماني</p>
        <p className={`text-4xl font-bold text-white mt-1`}>{score}</p>
        <span className={`text-sm font-medium ${score >= 70 ? 'text-green-300' : score >= 50 ? 'text-amber-300' : 'text-red-300'}`}>
          {scoreLabel}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">متوسط الدخل</span>
          <span className="font-bold">{formatCurrency(income)} ر.س</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">استقرار التدفق</span>
          <span className="font-bold">{stability}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">الالتزامات المقدرة</span>
          <span className="font-bold">{formatCurrency(obligations)} ر.س</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground text-sm">هامش الأمان النقدي</span>
          <span className="font-bold">{safetyMargin}%</span>
        </div>
        <div className="border-t border-border pt-2 text-center">
          <p className="text-[10px] text-muted-foreground">آخر تحديث: {lastUpdated}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN SWITCH
// ============================================

export default function InteractiveCard({ card, onAction }: InteractiveCardProps) {
  const { type, payload } = card;

  switch (type) {
    case 'property_list':
      return <PropertyListCard payload={payload} onAction={onAction} />;
    case 'loan_summary':
      return <LoanSummaryCard payload={payload} />;
    case 'decision':
      return <DecisionCard payload={payload} />;
    case 'contract':
      return <ContractCard payload={payload} onAction={onAction} />;
    case 'action_najiz':
      return (
        <ActionCard
          payload={payload}
          onAction={onAction}
          icon={Landmark}
          title="التوقيع الإلكتروني عبر ناجز"
          description="توثيق العقد عبر منصة ناجز"
          buttonText="بدء التوقيع الإلكتروني"
          actionName="start_najiz"
          completed={payload.completed as boolean}
        />
      );
    case 'action_sharia':
      return (
        <ActionCard
          payload={payload}
          onAction={onAction}
          icon={Scale}
          title="التنفيذ الشرعي"
          description="تنفيذ عملية المرابحة الشرعية"
          buttonText="بدء التنفيذ الشرعي"
          actionName="start_sharia"
          completed={payload.completed as boolean}
        />
      );
    case 'disbursement':
      return <DisbursementCard payload={payload} />;
    case 'payment_schedule':
      return <PaymentScheduleCard payload={payload} />;
    // Revaluation cards
    case 'reval_current_value':
      return <RevalCurrentValueCard payload={payload} />;
    case 'reval_timeslot_picker':
      return <RevalTimeSlotPickerCard payload={payload} onAction={onAction} />;
    case 'reval_booking_summary':
      return <RevalBookingSummaryCard payload={payload} />;
    case 'reval_booking_success':
      return <RevalBookingSuccessCard payload={payload} />;
    // Nav tab cards
    case 'properties_list':
      return <PropertiesListCard payload={payload} />;
    case 'loans_list':
      return <LoansListCard payload={payload} />;
    case 'credit_summary':
      return <CreditSummaryCard payload={payload} />;
    default:
      return null;
  }
}
