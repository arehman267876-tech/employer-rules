import {
  SeparationReason,
  StateFinalPaycheckRule,
  OvertimeDayEntry,
  OvertimeCalculationResult,
  PayeeEntityType,
  PaymentPurpose,
  PaymentMethod,
  Form1099RequirementResult
} from '../types';
import { FINAL_PAYCHECK_RULES } from '../data/rules/finalPaycheckRules';
import { OVERTIME_RULES } from '../data/rules/overtimeRules';
import { FORM_1099_YEAR_CONFIGS, FORM_1099_CITATIONS, FORM_1099_VERIFICATION } from '../data/rules/form1099Rules';

// Safe date parser to avoid timezone shifts
export function parseISODate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0); // midday avoids DST shift
}

export function formatHumanDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addHours(date: Date, hours: number): Date {
  const result = new Date(date);
  result.setTime(result.getTime() + hours * 60 * 60 * 1000);
  return result;
}

export interface FinalPaycheckCalculationInput {
  stateCode: string;
  reason: SeparationReason;
  hasGivenNotice72h?: boolean;
  lastDayOfWorkStr: string; // YYYY-MM-DD
  nextPaydayStr?: string; // YYYY-MM-DD
  ruleOverride?: StateFinalPaycheckRule;
}

export interface FinalPaycheckCalculationOutput {
  stateCode: string;
  stateName: string;
  deadlinePlainLanguage: string;
  computedDate: string | null;
  warningMessage: string | null;
  ruleRecord: StateFinalPaycheckRule;
  highlightedScenarioKey: 'discharge' | 'quitWithNotice' | 'quitWithoutNotice';
}

export function calculateFinalPaycheckDeadline(input: FinalPaycheckCalculationInput): FinalPaycheckCalculationOutput {
  const rule =
  input.ruleOverride ||
  FINAL_PAYCHECK_RULES[input.stateCode];
  if (!rule) {
    throw new Error(`Rule record not found for state ${input.stateCode}`);
  }

  const lastDay = parseISODate(input.lastDayOfWorkStr);
  let computedDate: string | null = null;
  let warningMessage: string | null = null;
  let deadlinePlainLanguage = '';
  let highlightedScenarioKey: 'discharge' | 'quitWithNotice' | 'quitWithoutNotice' = 'discharge';

  // Check payday warning if entered
  let nextPaydayDate: Date | null = null;
  if (input.nextPaydayStr) {
    nextPaydayDate = parseISODate(input.nextPaydayStr);
    if (nextPaydayDate < lastDay) {
      warningMessage = 'Warning: The entered regular payday is prior to the employee\'s last day of work. Please check the pay schedule date.';
    }
  }

  if (input.reason === 'discharge') {
    highlightedScenarioKey = 'discharge';
    const dRule = rule.discharge;
    if (dRule.type === 'immediate') {
      computedDate = formatHumanDate(lastDay);
      deadlinePlainLanguage = `Immediately on the day of discharge: ${computedDate}`;
    } else if (dRule.type === 'days' && dRule.value) {
      const targetDate = addDays(lastDay, dRule.value);
      computedDate = formatHumanDate(targetDate);
      deadlinePlainLanguage = `Within ${dRule.value} calendar days of discharge: ${computedDate}`;
    } else if (dRule.type === 'next_payday') {
      if (nextPaydayDate && !warningMessage) {
        computedDate = formatHumanDate(nextPaydayDate);
        deadlinePlainLanguage = `On or before the next regular payday: ${computedDate}`;
      } else {
        deadlinePlainLanguage = 'On or before the next regularly scheduled payday';
      }
    } else if (dRule.type === 'end_of_pay_period') {
      if (nextPaydayDate && !warningMessage) {
        computedDate = formatHumanDate(nextPaydayDate);
        deadlinePlainLanguage = `On or before the next regular payday for the pay period: ${computedDate}`;
      } else {
        deadlinePlainLanguage = 'On or before the end of the established pay period (regular payday)';
      }
    } else if (dRule.type === 'no_state_law') {
      if (nextPaydayDate && !warningMessage) {
        computedDate = formatHumanDate(nextPaydayDate);
        deadlinePlainLanguage = `No state statutory deadline; customary on regular payday: ${computedDate}`;
      } else {
        deadlinePlainLanguage = 'No state statutory deadline; payment by regular payday is standard under federal guidelines';
      }
    }
  } else {
    // Resignation
    const rRule = rule.resignation;
    if (rRule.requiresNoticeQuestion && input.hasGivenNotice72h && rRule.withNotice) {
      highlightedScenarioKey = 'quitWithNotice';
      computedDate = formatHumanDate(lastDay);
      deadlinePlainLanguage = `Due on the last day of work (at least 72 hours advance notice given): ${computedDate}`;
    } else if (rRule.requiresNoticeQuestion && !input.hasGivenNotice72h && rRule.withoutNotice.type === 'hours') {
      highlightedScenarioKey = 'quitWithoutNotice';
      // 72 hours later. e.g. Friday Oct 9 -> Monday Oct 12
      const targetDate = addHours(lastDay, 72);
      computedDate = formatHumanDate(targetDate);
      deadlinePlainLanguage = `Within 72 hours of quitting: ${computedDate}`;
    } else {
      highlightedScenarioKey = 'quitWithoutNotice';
      const woNotice = rRule.withoutNotice;
      if (woNotice.type === 'next_payday') {
        if (nextPaydayDate && !warningMessage) {
          computedDate = formatHumanDate(nextPaydayDate);
          deadlinePlainLanguage = `On or before the next regular scheduled payday: ${computedDate}`;
        } else {
          deadlinePlainLanguage = 'On or before the next regular scheduled payday';
        }
      } else if (woNotice.type === 'no_state_law') {
        if (nextPaydayDate && !warningMessage) {
          computedDate = formatHumanDate(nextPaydayDate);
          deadlinePlainLanguage = `No state statutory deadline; customary on regular payday: ${computedDate}`;
        } else {
          deadlinePlainLanguage = 'No state statutory deadline; payment on next regular payday is standard';
        }
      } else if (woNotice.type === 'immediate') {
        computedDate = formatHumanDate(lastDay);
        deadlinePlainLanguage = `Due immediately on the last day: ${computedDate}`;
      } else {
        deadlinePlainLanguage = woNotice.description;
      }
    }
  }

  return {
    stateCode: rule.stateCode,
    stateName: rule.stateName,
    deadlinePlainLanguage,
    computedDate: warningMessage ? null : computedDate,
    warningMessage,
    ruleRecord: rule,
    highlightedScenarioKey
  };
}

export interface OvertimeCalculationInput {
  stateCode: string;
  regularHourlyRate: number;
  days: OvertimeDayEntry[]; // Array of 7 days
  ruleOverride?: any;
}

export function calculateOvertimePay(input: OvertimeCalculationInput): OvertimeCalculationResult {
  const rate = Math.max(0, input.regularHourlyRate);
  const days = input.days;
  const stateCode = input.stateCode;
  const isFederalFallback = !['CA', 'AK', 'CO', 'NV'].includes(stateCode);
  const rule = input.ruleOverride || (
  isFederalFallback
    ? OVERTIME_RULES.FEDERAL
    : (OVERTIME_RULES[stateCode] || OVERTIME_RULES.FEDERAL)
);

  const rulesApplied: string[] = [];
  const dayBreakdown: Array<{
    day: string;
    hours: number;
    regular: number;
    overtime: number;
    doubleTime: number;
  }> = [];

  let dailyRegularHoursTotal = 0;
  let dailyOvertimeHoursTotal = 0;
  let dailyDoubleTimeHoursTotal = 0;

  // Check 7th consecutive day condition (California rule)
  // Employee must work all 7 days with hours > 0 on every single day
  const workedAll7Days = days.length === 7 && days.every(d => d.hours > 0);

  days.forEach((entry, index) => {
    const dayHours = Math.max(0, entry.hours);
    let reg = 0;
    let ot = 0;
    let dt = 0;

    if (stateCode === 'CA') {
      if (index === 6 && workedAll7Days) {
        // 7th consecutive day in California
        rulesApplied.push('California 7th Consecutive Day: First 8 hours at 1.5×, all hours beyond 8 at 2.0×');
        ot = Math.min(dayHours, 8);
        dt = Math.max(0, dayHours - 8);
        reg = 0; // all hours are premium
      } else {
        // Standard CA daily rule: >8 OT, >12 DT
        reg = Math.min(dayHours, 8);
        ot = Math.min(Math.max(0, dayHours - 8), 4);
        dt = Math.max(0, dayHours - 12);
        if (dayHours > 8) rulesApplied.push(`Day ${index + 1} (${entry.dayName}): Daily overtime (>8h) applied`);
        if (dayHours > 12) rulesApplied.push(`Day ${index + 1} (${entry.dayName}): Daily double time (>12h) applied`);
      }
    } else if (stateCode === 'AK') {
      // Alaska: >8 OT
      reg = Math.min(dayHours, 8);
      ot = Math.max(0, dayHours - 8);
      dt = 0;
      if (dayHours > 8) rulesApplied.push(`Day ${index + 1}: Alaska daily overtime (>8h) applied`);
    } else if (stateCode === 'CO') {
      // Colorado: >12 OT
      reg = Math.min(dayHours, 12);
      ot = Math.max(0, dayHours - 12);
      dt = 0;
      if (dayHours > 12) rulesApplied.push(`Day ${index + 1}: Colorado daily overtime (>12h) applied`);
    } else if (stateCode === 'NV') {
      // Nevada: >8 OT ONLY IF regular rate < 1.5x minimum wage ($18.00/hr in 2026)
      const nvThreshold = rule.minWageRateCondition?.thresholdRate ?? 18.00;
      if (rate < nvThreshold) {
        reg = Math.min(dayHours, 8);
        ot = Math.max(0, dayHours - 8);
        dt = 0;
        if (dayHours > 8) {
          rulesApplied.push(`Nevada daily overtime (>8h applied because hourly rate $${rate.toFixed(2)} is under $${nvThreshold.toFixed(2)})`);
        }
      } else {
        // Rate is >= $18/hr, daily overtime does not apply
        reg = dayHours;
        ot = 0;
        dt = 0;
      }
    } else {
      // Federal standard / other states: No daily overtime
      reg = dayHours;
      ot = 0;
      dt = 0;
    }

    dailyRegularHoursTotal += reg;
    dailyOvertimeHoursTotal += ot;
    dailyDoubleTimeHoursTotal += dt;

    dayBreakdown.push({
      day: entry.dayName,
      hours: dayHours,
      regular: reg,
      overtime: ot,
      doubleTime: dt
    });
  });

  // Anti-pyramiding Weekly Calculation:
  // Weekly overtime (1.5x) applies to remaining regular hours exceeding 40.
  let finalRegularHours = dailyRegularHoursTotal;
  let weeklyOvertimeHours = 0;

  if (dailyRegularHoursTotal > 40) {
    weeklyOvertimeHours = dailyRegularHoursTotal - 40;
    finalRegularHours = 40;
    rulesApplied.push(`Weekly overtime: ${weeklyOvertimeHours.toFixed(2)} hours over 40 regular hours in the workweek paid at 1.5×`);
  }

  const finalOvertimeHours = dailyOvertimeHoursTotal + weeklyOvertimeHours;
  const finalDoubleTimeHours = dailyDoubleTimeHoursTotal;
  const totalHours = finalRegularHours + finalOvertimeHours + finalDoubleTimeHours;

  const overtimeRate = rate * 1.5;
  const doubleTimeRate = rate * 2.0;

  const regularPay = Math.round(finalRegularHours * rate * 100) / 100;
  const overtimePay = Math.round(finalOvertimeHours * overtimeRate * 100) / 100;
  const doubleTimePay = Math.round(finalDoubleTimeHours * doubleTimeRate * 100) / 100;
  const grossWeeklyPay = Math.round((regularPay + overtimePay + doubleTimePay) * 100) / 100;

  // Deduplicate rules applied messages
  const uniqueRules = Array.from(new Set(rulesApplied));
  if (uniqueRules.length === 0) {
    uniqueRules.push('Standard straight time (under 40 regular hours and daily thresholds)');
  }

  return {
    regularHours: finalRegularHours,
    overtimeHours: finalOvertimeHours,
    doubleTimeHours: finalDoubleTimeHours,
    totalHours,
    regularRate: rate,
    overtimeRate,
    doubleTimeRate,
    regularPay,
    overtimePay,
    doubleTimePay,
    grossWeeklyPay,
    rulesApplied: uniqueRules,
    dayBreakdown,
    citations: rule.citations,
    verification: rule.verification,
    isFederalFallback
  };
}

export interface Form1099CheckInput {
  taxYear: number; // 2025 or 2026
  isBusinessPayment: boolean;
  payeeType: PayeeEntityType;
  paymentPurpose: PaymentPurpose;
  paymentMethod: PaymentMethod;
  totalPaid: number;
  ruleOverride?: any;
}

export function check1099Requirement(input: Form1099CheckInput): Form1099RequirementResult {
  const config =
  input.ruleOverride ||
  FORM_1099_YEAR_CONFIGS[input.taxYear] ||
  FORM_1099_YEAR_CONFIGS[2026];
  const threshold = config.reportingThreshold;
  const isPastDue = input.taxYear === 2025; // 2025 deadlines have passed

  // Rule 1: Personal payment -> No 1099
  if (!input.isBusinessPayment) {
    return {
      isRequired: false,
      formName: 'None',
      primaryReason: 'Payments made for personal, household, or family purposes are not reportable under IRS rules. Form 1099 applies solely to payments made in the course of your trade or business (IRC § 6041).',
      thresholdApplied: threshold,
      taxYear: input.taxYear,
      dueDateRecipient: 'N/A',
      dueDateIRS: 'N/A',
      isPastDue: false,
      citations: FORM_1099_CITATIONS,
      verification: FORM_1099_VERIFICATION,
      actionItems: ['No IRS information return filing is required for personal payments.']
    };
  }

  // Rule 2: Employee -> Form W-2
  if (input.payeeType === 'employee') {
    return {
      isRequired: true,
      formName: 'Form W-2',
      primaryReason: 'Wages and compensation paid to an employee are reported on Form W-2 (Wage and Tax Statement), not on Form 1099. Employers must withhold federal income tax, Social Security, and Medicare taxes.',
      thresholdApplied: 0,
      taxYear: input.taxYear,
      dueDateRecipient: input.taxYear === 2026 ? 'Monday, February 1, 2027' : 'Monday, February 2, 2026',
      dueDateIRS: input.taxYear === 2026 ? 'Monday, February 1, 2027' : 'Monday, February 2, 2026',
      isPastDue,
      citations: FORM_1099_CITATIONS,
      verification: FORM_1099_VERIFICATION,
      actionItems: [
        'File Form W-2 with the Social Security Administration (SSA).',
        'Provide Copy B to the employee by the end of January.',
        'Ensure proper payroll tax withholding was submitted on Form 941.'
      ]
    };
  }

  // Rule 3: Goods/merchandise only -> No 1099
  if (input.paymentPurpose === 'goods') {
    return {
      isRequired: false,
      formName: 'None',
      primaryReason: 'Payments made exclusively for merchandise, freight, storage, telephone, and similar physical goods are exempt from Form 1099 reporting under IRS Treasury Regulation § 1.6041-3(c).',
      thresholdApplied: threshold,
      taxYear: input.taxYear,
      dueDateRecipient: 'N/A',
      dueDateIRS: 'N/A',
      isPastDue: false,
      citations: FORM_1099_CITATIONS,
      verification: FORM_1099_VERIFICATION,
      actionItems: ['Retain invoices and vendor receipts in your business records for expense documentation.']
    };
  }

  // Rule 4: Paid by card or payment app -> No 1099 from payer (1099-K by processor)
  if (input.paymentMethod === 'card_processor') {
    return {
      isRequired: false,
      formName: 'None (Form 1099-K by Processor)',
      primaryReason: 'Under Internal Revenue Code § 6050W, payments made by credit card, debit card, PayPal, Stripe, Venmo, or other third-party payment networks are reported by the payment settlement entity on Form 1099-K. The paying business must NOT file Form 1099-NEC or 1099-MISC for these transactions.',
      thresholdApplied: threshold,
      taxYear: input.taxYear,
      dueDateRecipient: 'Reported by processor',
      dueDateIRS: 'Reported by processor',
      isPastDue: false,
      citations: FORM_1099_CITATIONS,
      verification: FORM_1099_VERIFICATION,
      actionItems: [
        'Do not issue Form 1099-NEC or 1099-MISC (issuing one results in double-reporting vendor income).',
        'Retain electronic merchant receipts matching the expense.'
      ]
    };
  }

  // Rule 5: Corporation exemption (with legal & medical exceptions)
  if (input.payeeType === 'corporation') {
    if (input.paymentPurpose === 'services' || input.paymentPurpose === 'rent') {
      return {
        isRequired: false,
        formName: 'None',
        primaryReason: 'Payments made to incorporated entities (C-Corporations and S-Corporations) are generally exempt from Form 1099 reporting under IRS regulations, provided the vendor is verified via Form W-9.',
        thresholdApplied: threshold,
        taxYear: input.taxYear,
        dueDateRecipient: 'N/A',
        dueDateIRS: 'N/A',
        isPastDue: false,
        citations: FORM_1099_CITATIONS,
        verification: FORM_1099_VERIFICATION,
        actionItems: [
          'Ensure you have a signed Form W-9 on file confirming corporate tax classification (Box 3 C-Corp or S-Corp).'
        ]
      };
    }
  }

  // Form selection & box:
  let formName: 'Form 1099-NEC' | 'Form 1099-MISC' = 'Form 1099-NEC';
  let boxNumber = 'Box 1 (Nonemployee Compensation)';
  let recipientDueDate = config.recipientDueDateNec;
  let irsDueDate = config.irsDueDateNec;

  if (input.paymentPurpose === 'services') {
    formName = 'Form 1099-NEC';
    boxNumber = 'Box 1 (Nonemployee compensation)';
    recipientDueDate = config.recipientDueDateNec;
    irsDueDate = config.irsDueDateNec;
  } else if (input.paymentPurpose === 'legal') {
    formName = 'Form 1099-NEC';
    boxNumber = 'Box 1 (Fees paid to attorneys)';
    recipientDueDate = config.recipientDueDateNec;
    irsDueDate = config.irsDueDateNec;
  } else if (input.paymentPurpose === 'rent') {
    formName = 'Form 1099-MISC';
    boxNumber = 'Box 1 (Rents)';
    recipientDueDate = config.recipientDueDateMisc;
    irsDueDate = config.irsDueDateMiscElectronic;
  } else if (input.paymentPurpose === 'medical') {
    formName = 'Form 1099-MISC';
    boxNumber = 'Box 6 (Medical and health care payments)';
    recipientDueDate = config.recipientDueDateMisc;
    irsDueDate = config.irsDueDateMiscElectronic;
  }

  // Rule 6: Check threshold
  if (input.totalPaid < threshold) {
    return {
      isRequired: false,
      formName,
      boxNumber,
      primaryReason: `Total payments of $${input.totalPaid.toLocaleString()} are below the statutory threshold of $${threshold.toLocaleString()} for tax year ${input.taxYear}. No Form ${formName} is required.`,
      thresholdApplied: threshold,
      taxYear: input.taxYear,
      dueDateRecipient: recipientDueDate,
      dueDateIRS: irsDueDate,
      isPastDue: false,
      citations: FORM_1099_CITATIONS,
      verification: FORM_1099_VERIFICATION,
      actionItems: [
        `No filing required unless cumulative annual payments to this payee reach $${threshold.toLocaleString()} before December 31, ${input.taxYear}.`
      ]
    };
  }

  // Required!
  let specialLegalNote = '';
  if (input.payeeType === 'corporation' && input.paymentPurpose === 'legal') {
    specialLegalNote = ' Payments to law firms or attorneys must be reported on Form 1099-NEC even if the law firm is a corporation (IRC § 6045(f)).';
  } else if (input.payeeType === 'corporation' && input.paymentPurpose === 'medical') {
    specialLegalNote = ' Medical and healthcare payments exceeding threshold are reportable on Form 1099-MISC even if paid to a corporation (IRC § 6041).';
  }

  return {
    isRequired: true,
    formName,
    boxNumber,
    primaryReason: `Filing is REQUIRED: Total payments of $${input.totalPaid.toLocaleString()} equal or exceed the $${threshold.toLocaleString()} threshold for tax year ${input.taxYear}.${specialLegalNote}`,
    thresholdApplied: threshold,
    taxYear: input.taxYear,
    dueDateRecipient: recipientDueDate,
    dueDateIRS: irsDueDate,
    isPastDue,
    citations: FORM_1099_CITATIONS,
    verification: FORM_1099_VERIFICATION,
    actionItems: [
      `Obtain a completed and signed Form W-9 from the payee before making further disbursements.`,
      `Deliver Copy B of ${formName} to the recipient by ${recipientDueDate}.`,
      `File Copy A of ${formName} with the IRS by ${irsDueDate} (e-filing required if filing 10 or more total information returns).`
    ]
  };
}
