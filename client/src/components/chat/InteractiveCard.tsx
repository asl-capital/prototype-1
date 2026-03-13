import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, CheckCircle2, FileText, Scale, Landmark,
  PartyPopper, Calendar, Shield, TrendingUp, Clock,
  MapPin, CreditCard, Wallet, BadgeCheck, AlertCircle,
  ChevronDown, ChevronUp, ExternalLink,
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

  const scoreLabel = score >= 70 ? 'ممتاز' : score >= 50 ? 'جيد' : 'يحتاج تحسين';

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      <div className="bg-gradient-to-l from-[#1B4965] to-[#2D5A7B] p-4 text-center">
        <TrendingUp className="w-8 h-8 text-white mx-auto mb-2" />
        <p className="text-white/80 text-xs">تقييمي الائتماني</p>
        <p className="text-4xl font-bold text-white mt-1">{score}</p>
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
// ACCORDION SECTION HELPER
// ============================================

function AccordionSection({
  title,
  children,
  defaultOpen = false,
  highlight = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  highlight?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`border-b border-border/40 last:border-0 ${highlight ? 'bg-[#FFF8F0]' : ''}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3"
        dir="rtl"
      >
        <span className={`font-bold text-sm ${highlight ? 'text-[#C4956A]' : 'text-foreground'}`}>{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed" dir="rtl">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// TERMS AND CONDITIONS CARD (Fix 2)
// Matches اصل-١.png reference
// ============================================

function TermsAndConditionsCard({
  payload,
  onAction,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const userName = (payload.userName as string) || 'العميل';
  const propertyTitle = (payload.propertyTitle as string) || '';
  const loanAmount = payload.loanAmount as number;
  const loanTenor = payload.loanTenor as number;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-4 text-center border-b border-border/40 bg-[#F8F5F0]">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FileText className="w-5 h-5 text-[#1B4965]" />
          <h3 className="font-bold text-foreground text-base">عقد تمويل مرابحة عقارية</h3>
        </div>
        <p className="text-xs text-muted-foreground">رقم العقد: ASL-2026-XXXXX</p>
      </div>

      {/* Quick summary */}
      <div className="grid grid-cols-3 gap-0 border-b border-border/40">
        <div className="p-3 text-center border-l border-border/40">
          <p className="text-[10px] text-muted-foreground mb-0.5">مبلغ التمويل</p>
          <p className="font-bold text-[#1B4965] text-sm">{formatCurrency(loanAmount)} ر.س</p>
        </div>
        <div className="p-3 text-center border-l border-border/40">
          <p className="text-[10px] text-muted-foreground mb-0.5">المدة</p>
          <p className="font-bold text-foreground text-sm">{loanTenor} سنوات</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-[10px] text-muted-foreground mb-0.5">العقار المرهون</p>
          <p className="font-bold text-foreground text-xs leading-tight">{propertyTitle}</p>
        </div>
      </div>

      {/* Accordion sections */}
      <AccordionSection title="أطراف العقد" defaultOpen={true}>
        <p className="mb-1">الطرف الأول (الممول): شركة أصل للتمويل، سجل تجاري رقم XXXXXXXXXX</p>
        <p>الطرف الثاني (العميل): {userName}، هوية رقم [رقم الهوية]</p>
      </AccordionSection>

      <AccordionSection title="موضوع العقد">
        <p>يوافق الطرف الأول على تقديم تمويل للطرف الثاني بموجب عقد مرابحة سلع متوافق مع أحكام الشريعة الإسلامية، مضموناً برهن عقاري على العقار المحدد أدناه.</p>
      </AccordionSection>

      <AccordionSection title="أحكام الرهن العقاري الإلكتروني">
        <ol className="space-y-2 list-none">
          <li><span className="font-semibold text-foreground">١.</span> يقر الطرف الثاني بموافقته على رهن العقار المملوك له لصالح الطرف الأول كضمان للتمويل.</li>
          <li><span className="font-semibold text-foreground">٢.</span> يتم توثيق الرهن إلكترونياً عبر منصة ناجز التابعة لوزارة العدل.</li>
          <li><span className="font-semibold text-foreground">٣.</span> يلتزم الطرف الثاني بالتوقيع على صك الرهن إلكترونياً عبر منصة ناجز خلال 48 ساعة من توقيع هذا العقد.</li>
          <li><span className="font-semibold text-foreground">٤.</span> يبقى الرهن سارياً حتى سداد كامل المبلغ المستحق.</li>
          <li><span className="font-semibold text-foreground">٥.</span> في حال التخلف عن السداد، يحق للطرف الأول اتخاذ الإجراءات النظامية لتحصيل مستحقاته.</li>
        </ol>
      </AccordionSection>

      <AccordionSection title="الهيكلة الشرعية">
        <p>يتم التمويل وفق آلية التورق/المرابحة المعتمدة من الهيئة الشرعية، حيث يقوم الممول بشراء سلعة (معادن ثمينة) نقداً ثم يبيعها للعميل بثمن مؤجل يتضمن هامش ربح معلوم، ثم يوكل العميل الممول لبيع السلعة نقداً وإيداع المبلغ في حسابه.</p>
      </AccordionSection>

      <AccordionSection title="شروط السداد">
        <p>يلتزم الطرف الثاني بسداد الأقساط الشهرية في مواعيدها المحددة. في حال التأخر، تطبق رسوم التأخير المعتمدة من البنك المركزي السعودي.</p>
      </AccordionSection>

      {/* Important note */}
      <div className="mx-4 my-3 p-3 bg-[#FFF8F0] border border-[#C4956A]/30 rounded-lg" dir="rtl">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#C4956A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#C4956A] mb-1">خطوة مهمة</p>
            <p className="text-xs text-[#C4956A]/80">بعد الموافقة على العقد، سيُطلب منك اعتماد/توقيع صك الرهن عبر منصة ناجز</p>
          </div>
        </div>
      </div>

      {/* Checkbox agreement */}
      <div className="px-4 pb-3" dir="rtl">
        <button
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 w-full text-right"
        >
          <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
            agreed ? 'bg-[#1B4965] border-[#1B4965]' : 'border-gray-300 bg-white'
          }`}>
            {agreed && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">أقر بأنني قرأت وفهمت جميع بنود العقد</p>
            <p className="text-xs text-muted-foreground mt-0.5">وأوافق على الشروط والأحكام المذكورة أعلاه</p>
          </div>
        </button>
      </div>

      {/* CTA */}
      <div className="p-3 border-t border-border/40">
        <button
          onClick={() => agreed && onAction?.('accept_disclosures')}
          disabled={!agreed}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-2 ${
            agreed
              ? 'bg-[#1B4965] text-white shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>الموافقة والمتابعة</span>
          <span className="text-lg">←</span>
        </button>
      </div>
    </div>
  );
}


// ============================================
// FULL CONTRACT CARD (Fix 3)
// Formal contract document - matches اصل-١.png
// ============================================

function FullContractCard({
  payload,
  onAction,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const userName = (payload.userName as string) || 'العميل';
  const propertyTitle = (payload.propertyTitle as string) || '';
  const loanAmount = payload.loanAmount as number;
  const loanTenor = payload.loanTenor as number;
  const monthlyPayment = payload.monthlyPayment as number;

  return (
    <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden" dir="rtl">
      {/* Header with back arrow */}
      <div className="p-3 flex items-center justify-between border-b border-border/40">
        <span className="text-sm font-bold text-foreground">مراجعة العقد</span>
        <button className="text-muted-foreground">
          <span className="text-lg">→</span>
        </button>
      </div>

      {/* Contract title card */}
      <div className="m-3 p-4 bg-[#F8F5F0] rounded-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-[#1B4965]/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#1B4965]" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-base">عقد تمويل مرابحة</h3>
            <p className="text-xs text-muted-foreground">رقم العقد: ASL-2026-XXXXX</p>
          </div>
        </div>

        {/* Quick summary grid */}
        <div className="bg-white/80 rounded-lg p-3 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground">مبلغ التمويل</p>
              <p className="font-bold text-[#1B4965] text-sm">{formatCurrency(loanAmount)} ر.س</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">المدة</p>
              <p className="font-bold text-foreground text-sm">{loanTenor} سنوات</p>
            </div>
          </div>
          <div className="text-center pt-1 border-t border-border/30">
            <p className="text-[10px] text-muted-foreground">العقار المرهون</p>
            <p className="font-bold text-foreground text-sm">{propertyTitle}</p>
          </div>
        </div>
      </div>

      {/* Accordion sections */}
      <AccordionSection title="أطراف العقد">
        <p className="mb-1">الطرف الأول (الممول): شركة أصل للتمويل، سجل تجاري رقم XXXXXXXXXX</p>
        <p>الطرف الثاني (العميل): {userName}، هوية رقم [رقم الهوية]</p>
      </AccordionSection>

      <AccordionSection title="موضوع العقد">
        <p>يوافق الطرف الأول على تقديم تمويل للطرف الثاني بموجب عقد مرابحة سلع متوافق مع أحكام الشريعة الإسلامية، مضموناً برهن عقاري على العقار المحدد أدناه.</p>
      </AccordionSection>

      <AccordionSection title="أحكام الرهن العقاري الإلكتروني" highlight={true} defaultOpen={true}>
        <ol className="space-y-2 list-none">
          <li><span className="font-semibold text-foreground">١.</span> يقر الطرف الثاني بموافقته على رهن العقار المملوك له لصالح الطرف الأول كضمان للتمويل.</li>
          <li><span className="font-semibold text-foreground">٢.</span> يتم توثيق الرهن إلكترونياً عبر منصة ناجز التابعة لوزارة العدل.</li>
          <li><span className="font-semibold text-foreground">٣.</span> يلتزم الطرف الثاني بالتوقيع على صك الرهن إلكترونياً عبر منصة ناجز خلال 48 ساعة من توقيع هذا العقد.</li>
          <li><span className="font-semibold text-foreground">٤.</span> يبقى الرهن سارياً حتى سداد كامل المبلغ المستحق.</li>
          <li><span className="font-semibold text-foreground">٥.</span> في حال التخلف عن السداد، يحق للطرف الأول اتخاذ الإجراءات النظامية لتحصيل مستحقاته.</li>
        </ol>
      </AccordionSection>

      <AccordionSection title="الهيكلة الشرعية">
        <p>يتم التمويل وفق آلية التورق/المرابحة المعتمدة من الهيئة الشرعية، حيث يقوم الممول بشراء سلعة (معادن ثمينة) نقداً ثم يبيعها للعميل بثمن مؤجل يتضمن هامش ربح معلوم، ثم يوكل العميل الممول لبيع السلعة نقداً وإيداع المبلغ في حسابه.</p>
      </AccordionSection>

      <AccordionSection title="شروط السداد">
        <p>يلتزم الطرف الثاني بسداد الأقساط الشهرية في مواعيدها المحددة. في حال التأخر، تطبق رسوم التأخير المعتمدة من البنك المركزي السعودي.</p>
      </AccordionSection>

      {/* Important note */}
      <div className="mx-4 my-3 p-3 bg-[#FFF8F0] border border-[#C4956A]/30 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-[#C4956A] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-[#C4956A] mb-1">خطوة مهمة</p>
            <p className="text-xs text-[#C4956A]/80">بعد الموافقة على العقد، سيُطلب منك اعتماد/توقيع صك الرهن عبر منصة ناجز</p>
          </div>
        </div>
      </div>

      {/* Checkbox */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setAgreed(!agreed)}
          className="flex items-start gap-3 w-full text-right"
        >
          <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
            agreed ? 'bg-[#1B4965] border-[#1B4965]' : 'border-gray-300 bg-white'
          }`}>
            {agreed && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">أقر بأنني قرأت وفهمت جميع بنود العقد</p>
            <p className="text-xs text-muted-foreground mt-0.5">وأوافق على الشروط والأحكام المذكورة أعلاه</p>
          </div>
        </button>
      </div>

      {/* CTA */}
      <div className="p-3 border-t border-border/40">
        <button
          onClick={() => agreed && onAction?.('start_najiz')}
          disabled={!agreed}
          className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.97] flex items-center justify-center gap-2 ${
            agreed
              ? 'bg-[#1B4965] text-white shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <span>الموافقة والمتابعة</span>
          <span className="text-lg">←</span>
        </button>
      </div>
    </div>
  );
}


// ============================================
// NAJIZ SIGNING FLOW CARD (Fix 5)
// 2-screen dark teal modal matching reference screenshots
// Screen 1: Steps + "فتح ناجز" button
// Screen 2: Countdown timer + "تمت الموافقة في ناجز؟ اضغط هنا"
// ============================================

function NajizSigningFlowCard({
  onAction,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  const [screen, setScreen] = useState<1 | 2>(1);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start countdown when screen 2 is shown
  useEffect(() => {
    if (screen === 2) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // Auto-complete when timer runs out
            onAction?.('najiz_completed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen, onAction]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  // Circular timer progress
  const timerSize = 100;
  const timerStroke = 4;
  const timerRadius = (timerSize - timerStroke) / 2;
  const timerCircumference = 2 * Math.PI * timerRadius;
  const timerProgress = (timeLeft / 300) * timerCircumference;

  const handleOpenNajiz = () => {
    setScreen(2);
  };

  const handleNajizApproved = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onAction?.('najiz_completed');
  };

  const handleCancel = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    // Just close / do nothing
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg" dir="rtl">
      <AnimatePresence mode="wait">
        {screen === 1 ? (
          <motion.div
            key="screen1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-[#1B4965] to-[#2D5A7B] p-6"
          >
            {/* Najiz logo */}
            <div className="flex justify-center mb-5">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl px-6 py-3">
                <span className="text-white font-bold text-xl">ناجز</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-xl text-center mb-2">
              توقيع صك الرهن
            </h3>
            <p className="text-white/70 text-sm text-center mb-6 leading-relaxed">
              سيُطلب منك اعتماد/توقيع صك الرهن عبر منصة ناجز لإتمام عملية التمويل
            </p>

            {/* Steps box */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <p className="text-white/90 font-bold text-sm mb-3">الخطوات:</p>
              <div className="space-y-3">
                {[
                  'اضغط على "فتح ناجز" أدناه',
                  'سجل الدخول عبر النفاذ الوطني',
                  'راجع تفاصيل صك الرهن',
                  'وافق على الصك وأكمل التوقيع',
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                    <span className="text-white/80 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Open Najiz button */}
            <button
              onClick={handleOpenNajiz}
              className="w-full bg-white text-[#1B4965] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform mb-2"
            >
              <span>فتح ناجز</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <p className="text-white/50 text-xs text-center mb-3">
              سيتم فتح منصة ناجز في نافذة جديدة
            </p>

            {/* Cancel */}
            <button
              onClick={handleCancel}
              className="w-full bg-white/10 text-white/80 font-medium py-3 rounded-xl active:scale-[0.97] transition-transform"
            >
              إلغاء
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="screen2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-b from-[#1B4965] to-[#2D5A7B] p-6"
          >
            {/* Circular countdown */}
            <div className="flex justify-center mb-5">
              <div className="relative" style={{ width: timerSize, height: timerSize }}>
                <svg width={timerSize} height={timerSize} className="transform -rotate-90">
                  <circle
                    cx={timerSize / 2}
                    cy={timerSize / 2}
                    r={timerRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={timerStroke}
                  />
                  <circle
                    cx={timerSize / 2}
                    cy={timerSize / 2}
                    r={timerRadius}
                    fill="none"
                    stroke="white"
                    strokeWidth={timerStroke}
                    strokeLinecap="round"
                    strokeDasharray={timerCircumference}
                    strokeDashoffset={timerCircumference - timerProgress}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-bold text-xl text-center mb-2">
              في انتظار التوقيع
            </h3>
            <p className="text-white/70 text-sm text-center mb-6">
              يرجى إكمال التوقيع في منصة ناجز
            </p>

            {/* Timer display */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-5 text-center">
              <p className="text-white/60 text-xs mb-2">الوقت المتبقي</p>
              <p className="text-white font-bold text-4xl tracking-wider font-mono">
                {timeStr}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-white/60" />
              <span className="text-white/60 text-sm">جاري التحقق من حالة التوقيع...</span>
            </div>

            {/* Approved link */}
            <button
              onClick={handleNajizApproved}
              className="w-full text-center mb-5"
            >
              <span className="text-white/90 text-sm underline underline-offset-4 decoration-white/40">
                تمت الموافقة في ناجز؟ اضغط هنا
              </span>
            </button>

            {/* Cancel */}
            <button
              onClick={handleCancel}
              className="w-full bg-white/10 text-white/80 font-medium py-3 rounded-xl active:scale-[0.97] transition-transform"
            >
              إلغاء
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ============================================
// SHARIA VISUALIZATION CARD (Fix 4)
// Corrected Tawarruq/Murabaha steps matching اصل-2.png
// Dark teal header with logo, 5 steps on vertical timeline
// ============================================

interface ShariaStep {
  titleAr: string;
  subtitleAr: string;
}

const TAWARRUQ_STEPS: ShariaStep[] = [
  { titleAr: 'الطلب والإفصاحات الشرعية', subtitleAr: 'تم تقديم الطلب والموافقة على الإفصاحات' },
  { titleAr: 'شراء السلعة نقداً بواسطة الجهة الممولة', subtitleAr: 'شراء ذهب عبر مزود معتمد' },
  { titleAr: 'بيع مرابحة للعميل بثمن مؤجل', subtitleAr: 'يتضمن الربح بوضوح' },
  { titleAr: 'تسييل السلعة نقداً', subtitleAr: 'قد يتم عبر وكالة' },
  { titleAr: 'صرف السيولة للعميل', subtitleAr: 'إيداع المبلغ في حسابك' },
];

function ShariaVisualizationCard({
  payload,
  onAction,
}: {
  payload: Record<string, unknown>;
  onAction?: (action: string, payload?: Record<string, unknown>) => void;
}) {
  const steps = (payload.steps as ShariaStep[]) || TAWARRUQ_STEPS;
  const [completedSteps, setCompletedSteps] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    // Animate steps one by one, 1 second apart
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, index) => {
      const timer = setTimeout(() => {
        setCompletedSteps(index + 1);
        if (index === steps.length - 1) {
          // All steps done, show success after a short delay
          const doneTimer = setTimeout(() => setAllDone(true), 800);
          timers.push(doneTimer);
        }
      }, (index + 1) * 1000);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, [steps]);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg" dir="rtl">
      {/* Dark teal header with logo */}
      <div className="bg-gradient-to-b from-[#1B4965] to-[#2D5A7B] p-5 text-center">
        {/* Logo placeholder */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
          <Scale className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-white font-bold text-lg mb-1">
          تنفيذ التمويل المتوافق مع الشريعة
        </h3>
        <p className="text-white/60 text-sm">
          آلية التورق/المرابحة المعتمدة
        </p>
      </div>

      {/* Steps timeline */}
      <div className="bg-white p-5">
        <div className="space-y-0">
          {steps.map((step, index) => {
            const isCompleted = index < completedSteps;
            const isActive = index === completedSteps;
            const isLast = index === steps.length - 1;

            return (
              <div key={index} className="flex gap-3">
                {/* Timeline column */}
                <div className="flex flex-col items-center">
                  {/* Circle */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={
                      isCompleted
                        ? { scale: 1, opacity: 1 }
                        : isActive
                        ? { scale: 1, opacity: 0.5 }
                        : { scale: 0.8, opacity: 0.3 }
                    }
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 ${
                      isCompleted
                        ? 'bg-green-50 border-green-500'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </motion.div>
                  {/* Connecting line */}
                  {!isLast && (
                    <div className={`w-0.5 h-8 my-1 transition-colors duration-500 ${
                      isCompleted ? 'bg-green-400' : 'bg-gray-200'
                    }`} />
                  )}
                </div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={isCompleted ? { opacity: 1, x: 0 } : { opacity: 0.4, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.15 }}
                  className="flex-1 pb-4"
                >
                  <p className={`font-bold text-sm ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.titleAr}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.subtitleAr}
                  </p>
                  {isCompleted && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      تم
                    </motion.p>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.4 }}
          >
            <div className="mx-4 mb-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <div className="text-center">
                <p className="text-sm font-bold text-green-700">تم تنفيذ التمويل بنجاح</p>
                <p className="text-xs text-green-600">جاهز لصرف السيولة</p>
              </div>
            </div>

            <div className="p-3">
              <button
                onClick={() => onAction?.('confirm_disbursement')}
                className="w-full bg-[#1B4965] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-transform shadow-md"
              >
                <span>متابعة لصرف السيولة</span>
                <span className="text-lg">←</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


// ============================================
// MAIN INTERACTIVE CARD COMPONENT
// ============================================

export default function InteractiveCard({ card, onAction }: InteractiveCardProps) {
  switch (card.type) {
    case 'property_list':
      return <PropertyListCard payload={card.payload} onAction={onAction} />;

    case 'loan_summary':
      return <LoanSummaryCard payload={card.payload} />;

    case 'decision':
      return <DecisionCard payload={card.payload} />;

    case 'contract':
      return <ContractCard payload={card.payload} onAction={onAction} />;

    case 'action_najiz':
      return (
        <ActionCard
          payload={card.payload}
          onAction={onAction}
          icon={Landmark}
          title="توقيع صك الرهن — ناجز"
          description="توقيع إلكتروني عبر منصة ناجز"
          buttonText="توقيع إلكتروني عبر ناجز"
          actionName="start_najiz"
          completed={card.payload.completed as boolean}
        />
      );

    case 'action_sharia':
      return (
        <ActionCard
          payload={card.payload}
          onAction={onAction}
          icon={Scale}
          title="تنفيذ العقد الشرعي"
          description="تنفيذ التورق/المرابحة المعتمدة"
          buttonText="تنفيذ العقد الشرعي"
          actionName="start_sharia"
          completed={card.payload.completed as boolean}
        />
      );

    case 'sharia_visualization':
      return <ShariaVisualizationCard payload={card.payload} onAction={onAction} />;

    case 'disbursement':
      return <DisbursementCard payload={card.payload} />;

    case 'payment_schedule':
      return <PaymentScheduleCard payload={card.payload} />;

    // Fix 2: T&C modal
    case 'terms_and_conditions':
      return <TermsAndConditionsCard payload={card.payload} onAction={onAction} />;

    // Fix 3: Full contract modal
    case 'full_contract':
      return <FullContractCard payload={card.payload} onAction={onAction} />;

    // Fix 5: Najiz signing flow
    case 'najiz_signing_flow':
      return <NajizSigningFlowCard payload={card.payload} onAction={onAction} />;

    // Revaluation cards
    case 'reval_current_value':
      return <RevalCurrentValueCard payload={card.payload} />;

    case 'reval_timeslot_picker':
      return <RevalTimeSlotPickerCard payload={card.payload} onAction={onAction} />;

    case 'reval_booking_summary':
      return <RevalBookingSummaryCard payload={card.payload} />;

    case 'reval_booking_success':
      return <RevalBookingSuccessCard payload={card.payload} />;

    // Nav tab cards
    case 'properties_list':
      return <PropertiesListCard payload={card.payload} />;

    case 'loans_list':
      return <LoansListCard payload={card.payload} />;

    case 'credit_summary':
      return <CreditSummaryCard payload={card.payload} />;

    default:
      return null;
  }
}
