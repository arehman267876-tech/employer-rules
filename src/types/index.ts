export type SeparationReason = 'discharge' | 'resignation';

export interface Citation {
  label: string;
  type: 'statute' | 'regulation' | 'agency';
  url: string | null;
  code: string;
}

export interface VerificationStamp {
  status: 'verified' | 'draft';
  lastVerified: string;
  verifiedBy: string;
  credential: string;
  notes?: string;
}

export interface StateFinalPaycheckRule {
  stateCode: string;
  stateName: string;
  status: 'verified' | 'draft';
  discharge: {
    type: 'immediate' | 'hours' | 'days' | 'next_payday' | 'no_state_law' | 'end_of_pay_period';
    value?: number;
    description: string;
  };
  resignation: {
    requiresNoticeQuestion: boolean;
    noticeThresholdHours?: number;
    withNotice?: {
      type: 'immediate' | 'hours' | 'days' | 'next_payday' | 'no_state_law' | 'end_of_pay_period';
      value?: number;
      description: string;
    };
    withoutNotice: {
      type: 'immediate' | 'hours' | 'days' | 'next_payday' | 'no_state_law' | 'end_of_pay_period';
      value?: number;
      description: string;
    };
  };
  penalties: string;
  exceptions: string[];
  notes: string;
  workedExample: {
    dischargeScenario: string;
    resignationScenario: string;
  };
  citations: Citation[];
  verification: VerificationStamp;
  faqs: Array<{ question: string; answer: string }>;
}

export interface OvertimeRule {
  stateCode: string;
  stateName: string;
  status: 'verified' | 'draft';
  dailyOvertimeThresholdHours?: number;
  dailyDoubleTimeThresholdHours?: number;
  weeklyOvertimeThresholdHours: number;
  hasSeventhDayConsecutiveRule?: boolean;
  minWageRateCondition?: {
    nvMinWage: number;
    multiplier: number;
    thresholdRate: number;
  };
  summary: string;
  citations: Citation[];
  verification: VerificationStamp;
}

export interface OvertimeDayEntry {
  dayName: string;
  hours: number;
}

export interface OvertimeCalculationResult {
  regularHours: number;
  overtimeHours: number;
  doubleTimeHours: number;
  totalHours: number;
  regularRate: number;
  overtimeRate: number;
  doubleTimeRate: number;
  regularPay: number;
  overtimePay: number;
  doubleTimePay: number;
  grossWeeklyPay: number;
  rulesApplied: string[];
  dayBreakdown: Array<{
    day: string;
    hours: number;
    regular: number;
    overtime: number;
    doubleTime: number;
  }>;
  citations: Citation[];
  verification: VerificationStamp;
  isFederalFallback: boolean;
}

export type PayeeEntityType = 'individual' | 'partnership' | 'corporation' | 'employee';
export type PaymentPurpose = 'services' | 'legal' | 'rent' | 'medical' | 'goods';
export type PaymentMethod = 'direct' | 'card_processor'; // direct = check, cash, ACH, wire; card_processor = credit card, PayPal, Stripe

export interface Form1099RequirementResult {
  isRequired: boolean;
  formName: 'Form 1099-NEC' | 'Form 1099-MISC' | 'Form W-2' | 'None (Form 1099-K by Processor)' | 'None';
  boxNumber?: string;
  primaryReason: string;
  thresholdApplied: number;
  taxYear: number;
  dueDateRecipient: string;
  dueDateIRS: string;
  isPastDue: boolean;
  citations: Citation[];
  verification: VerificationStamp;
  actionItems: string[];
}
