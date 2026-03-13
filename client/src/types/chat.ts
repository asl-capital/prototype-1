// Chat message types for Aseel conversational assistant

export type ChatRole = 'assistant' | 'user';

export type FlowStage =
  | 'welcome'
  | 'property_selection'
  | 'loan_design'
  | 'loan_design_tenor'
  | 'loan_summary'
  | 'disclosures'
  | 'decision'
  | 'contract_preview'
  | 'najiz_esign'
  | 'sharia_execution'
  | 'disbursement'
  | 'ongoing'
  // Revaluation flow stages
  | 'reval_display'
  | 'reval_explain'
  | 'reval_timeslot'
  | 'reval_confirm'
  | 'reval_complete';

export type CardType =
  | 'property_list'
  | 'loan_summary'
  | 'decision'
  | 'contract'
  | 'action_najiz'
  | 'action_sharia'
  | 'disbursement'
  | 'payment_schedule'
  // Revaluation card types
  | 'reval_current_value'
  | 'reval_timeslot_picker'
  | 'reval_booking_summary'
  | 'reval_booking_success'
  // Nav tab card types
  | 'properties_list'
  | 'loans_list'
  | 'credit_summary';

export interface CardData {
  type: CardType;
  payload: Record<string, unknown>;
}

// CTA button that appears at the bottom of a message
export interface CTAButton {
  id: string;
  label: string;
  action: string;
  payload?: Record<string, unknown>;
  variant?: 'primary' | 'secondary' | 'success';
  disabled?: boolean;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: Date;
  card?: CardData;
  cta?: CTAButton[];
  isStreaming?: boolean;
}

export interface ConversationState {
  stage: FlowStage;
  selectedPropertyId?: string;
  loanAmount?: number;
  loanTenor?: number;
  disclosuresAccepted?: boolean;
  decisionResult?: 'approved' | 'conditional';
  contractViewed?: boolean;
  najizCompleted?: boolean;
  shariaCompleted?: boolean;
  disbursementCompleted?: boolean;
  // Revaluation state
  revalPropertyId?: string;
  revalSelectedSlot?: TimeSlot;
}

// Time slot for revaluation appointments
export interface TimeSlot {
  id: string;
  date: string;       // e.g., "2026-03-16"
  dayLabel: string;    // e.g., "الأحد ١٦ مارس"
  time: string;        // e.g., "09:00 - 11:00"
  period: 'morning' | 'afternoon';
}

// Bottom navigation tab
export type NavTab = 'chat' | 'properties' | 'loans' | 'credit' | 'settings';
