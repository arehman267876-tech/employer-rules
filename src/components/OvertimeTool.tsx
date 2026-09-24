import React, { useState } from 'react';
import { trackCalculatorUsage } from '../lib/usageTracker';
import { ClockEmptyState } from './ClockEmptyState';
import { calculateOvertimePay } from '../lib/calculatorLogic';
import { supabase } from '../lib/supabaseClient';
import { OvertimeDayEntry } from '../types';
import {
  Clock,
  RotateCcw,
  Copy,
  Check,
  Printer,
  ChevronDown,
  Info,
  Scale,
  ShieldCheck,
  Calculator,
  CalendarDays
} from 'lucide-react';

type PayRateType = 'hourly' | 'daily' | 'weekly' | 'monthly';

interface CurrencyOption {
  code: string;
  symbol: string;
  label: string;
  locale: string;
}

const CURRENCIES: CurrencyOption[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)', locale: 'en-US' }
];

interface JurisdictionRule {
  id: string;
  name: string;
  country: string;
  stateCode?: string;
  defaultMultiplier: number;
  defaultMultiplierLabel: string;
  standardWeeklyHours: number;
  statutorySummary: string;
  statuteCitation: string;
}

const JURISDICTIONS: JurisdictionRule[] = [
  {
    id: 'US-FED',
    name: 'US Federal (FLSA 40-Hour Rule)',
    country: 'United States (Federal)',
    stateCode: 'FED',
    defaultMultiplier: 1.5,
    defaultMultiplierLabel: 'Time and a Half (x1.5)',
    standardWeeklyHours: 40,
    statutorySummary:
      'Under the federal Fair Labor Standards Act (FLSA), covered non-exempt employees must receive overtime pay for hours worked over 40 in a single workweek at not less than 1.5x regular pay.',
    statuteCitation: 'FLSA 29 U.S.C. § 207(a)(1)'
  },
  {
    id: 'US-CA',
    name: 'California (Cal. Lab. Code § 510)',
    country: 'United States - California',
    stateCode: 'CA',
    defaultMultiplier: 1.5,
    defaultMultiplierLabel: 'Daily & Weekly Multi-Tier',
    standardWeeklyHours: 40,
    statutorySummary:
      'California requires 1.5x for hours over 8 up to 12 in a workday and the first 8 hours on the 7th consecutive day; 2.0x (double time) applies for hours over 12 in a workday and hours over 8 on the 7th consecutive day.',
    statuteCitation: 'Cal. Lab. Code § 510 / IWC Orders'
  },
  {
    id: 'US-NV',
    name: 'Nevada (NRS § 608.018 Wage Rule)',
    country: 'United States - Nevada',
    stateCode: 'NV',
    defaultMultiplier: 1.5,
    defaultMultiplierLabel: 'Daily & Weekly Tier (<1.5x Min Wage)',
    standardWeeklyHours: 40,
    statutorySummary:
      'In Nevada, non-exempt employees earning less than 1.5x the state minimum wage receive daily overtime for work over 8 hours/day (or 10 hours/day for an agreed 4x10 schedule), plus weekly overtime over 40 hours.',
    statuteCitation: 'Nev. Rev. Stat. § 608.018'
  },
  {
    id: 'US-CO',
    name: 'Colorado (COMPS Order #39)',
    country: 'United States - Colorado',
    stateCode: 'CO',
    defaultMultiplier: 1.5,
    defaultMultiplierLabel: 'Daily & Consecutive Hours (x1.5)',
    standardWeeklyHours: 40,
    statutorySummary:
      'Colorado requires overtime at 1.5x regular rate for work over 40 hours per workweek, over 12 hours per workday, or over 12 consecutive hours without regard to the start/end time of the workday.',
    statuteCitation: '7 CCR 1103-1 (COMPS Order #39)'
  },
  {
    id: 'US-AK',
    name: 'Alaska (Alaska Stat. § 23.10.060)',
    country: 'United States - Alaska',
    stateCode: 'AK',
    defaultMultiplier: 1.5,
    defaultMultiplierLabel: 'Daily (8 hrs) & Weekly (40 hrs)',
    standardWeeklyHours: 40,
    statutorySummary:
      'Alaska mandates overtime pay at 1.5x for any hours worked beyond 8 hours in a single day, as well as beyond 40 hours in a workweek, for employers with 4 or more employees.',
    statuteCitation: 'Alaska Stat. § 23.10.060'
  },
  {
    id: 'US-CUSTOM',
    name: 'Custom US Employer Agreement',
    country: 'United States',
    stateCode: 'FED',
    defaultMultiplier: 1.5,
    defaultMultiplierLabel: 'Time and a Half (x1.5)',
    standardWeeklyHours: 40,
    statutorySummary:
      'Customizable overtime multiplier and standard hours based on your company handbook, collective bargaining agreement, or state rules.',
    statuteCitation: 'Company Policy / CBA'
  }
];

const DEFAULT_DAYS_EXAMPLE: OvertimeDayEntry[] = [
  { dayName: 'Mon', hours: 9 },
  { dayName: 'Tue', hours: 8 },
  { dayName: 'Wed', hours: 10 },
  { dayName: 'Thu', hours: 8 },
  { dayName: 'Fri', hours: 12 },
  { dayName: 'Sat', hours: 0 },
  { dayName: 'Sun', hours: 0 }
];

export const OvertimeTool: React.FC = () => {
  // Main form fields for US overtime
  const [payRateType, setPayRateType] = useState<PayRateType>('hourly');
  const [selectedCurrencyCode] = useState<string>('USD');
  const [selectedJurisdictionId, setSelectedJurisdictionId] = useState<string>('US-FED');
  const [payRateInput, setPayRateInput] = useState<string>('25.00');
  const [regularHoursInput, setRegularHoursInput] = useState<string>('40');
  const [multiplier, setMultiplier] = useState<number>(1.5);
  const [overtimeHoursInput, setOvertimeHoursInput] = useState<string>('6');
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [remoteRule, setRemoteRule] = useState<any | null>(null);

  // Advanced Day-by-Day Punch Matrix (for California / Nevada / Federal statutory audits)
  const [showDayByDayTimesheet, setShowDayByDayTimesheet] = useState<boolean>(false);
  const [timesheetDays, setTimesheetDays] = useState<OvertimeDayEntry[]>(DEFAULT_DAYS_EXAMPLE);
  React.useEffect(() => {
  let cancelled = false;

  const loadRule = async () => {
    const stateCode =
      selectedJurisdictionId === 'US-CA'
        ? 'CA'
        : selectedJurisdictionId === 'US-NV'
          ? 'NV'
          : selectedJurisdictionId === 'US-CO'
            ? 'CO'
            : selectedJurisdictionId === 'US-AK'
              ? 'AK'
              : 'FED';

    const { data, error } = await supabase
      .from('overtime_rules')
      .select('rule_data')
      .eq('state_code', stateCode)
      .maybeSingle();

    if (error) {
      console.error('Failed to load overtime rule:', error);
      return;
    }

    if (!cancelled) {
      setRemoteRule(data?.rule_data ?? null);
    }
  };

  loadRule();

  return () => {
    cancelled = true;
  };
}, [selectedJurisdictionId]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const selectedCurrency = CURRENCIES.find((c) => c.code === selectedCurrencyCode) || CURRENCIES[0];
  const selectedJurisdiction =
    JURISDICTIONS.find((j) => j.id === selectedJurisdictionId) || JURISDICTIONS[0];

  // Derive base hourly rate from payRateType
  const enteredPayNum = parseFloat(payRateInput) || 0;
  let effectiveHourlyRate = enteredPayNum;
  if (payRateType === 'daily') {
    effectiveHourlyRate = enteredPayNum / 8;
  } else if (payRateType === 'weekly') {
    effectiveHourlyRate = enteredPayNum / (parseFloat(regularHoursInput) || 40);
  } else if (payRateType === 'monthly') {
    effectiveHourlyRate = enteredPayNum / 173.333;
  }

  const enteredRegularHours = parseFloat(regularHoursInput) || 0;
  const enteredOvertimeHours = parseFloat(overtimeHoursInput) || 0;

  // Calculated Overtime Pay Rate
  const computedOvertimeRate = effectiveHourlyRate > 0 ? effectiveHourlyRate * multiplier : 0;

  // Total results
  const regularPayTotal = effectiveHourlyRate * enteredRegularHours;
  const overtimePayTotal = computedOvertimeRate * enteredOvertimeHours;
  const totalGrossPay = regularPayTotal + overtimePayTotal;
  const totalHoursWorked = enteredRegularHours + enteredOvertimeHours;
  const overtimePremiumOnly = (computedOvertimeRate - effectiveHourlyRate) * enteredOvertimeHours;

  // Day-by-Day punch results (uses the tested engine from calculatorLogic)
 const dayByDayResult = calculateOvertimePay({
  stateCode:
    selectedJurisdictionId === 'US-CA'
      ? 'CA'
      : selectedJurisdictionId === 'US-NV'
        ? 'NV'
        : selectedJurisdictionId === 'US-CO'
          ? 'CO'
          : selectedJurisdictionId === 'US-AK'
            ? 'AK'
            : 'FED',
  regularHourlyRate: effectiveHourlyRate > 0 ? effectiveHourlyRate : 25,
  days: timesheetDays,
  ruleOverride: remoteRule || undefined,
});
  // Handle Jurisdiction change
  const handleJurisdictionChange = (jurisdictionId: string) => {
    setSelectedJurisdictionId(jurisdictionId);
    const rule = JURISDICTIONS.find((j) => j.id === jurisdictionId);
    if (rule) {
      setMultiplier(rule.defaultMultiplier);
      setRegularHoursInput(String(rule.standardWeeklyHours));
    }
  };

 const handleCalculate = async () => {
  setHasCalculated(true);

  const stateCode =
    selectedJurisdictionId === 'US-CA'
      ? 'CA'
      : selectedJurisdictionId === 'US-NV'
        ? 'NV'
        : selectedJurisdictionId === 'US-CO'
          ? 'CO'
          : selectedJurisdictionId === 'US-AK'
            ? 'AK'
            : 'FED';

  await trackCalculatorUsage('overtime', stateCode);
};

  const handleReset = () => {
    setPayRateInput('');
    setRegularHoursInput('');
    setOvertimeHoursInput('');
    setHasCalculated(false);
  };

  const formatMoney = (val: number): string => {
    if (isNaN(val)) return `${selectedCurrency.symbol} 0.00`;
    return `${selectedCurrency.symbol} ${val.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleCopySummary = () => {
    const text = `=== US Overtime Pay Calculation ===
Tool: EmployerRules Overtime Calculator
Jurisdiction: ${selectedJurisdiction.name}
Base Pay Rate: ${formatMoney(effectiveHourlyRate)}/hr (${payRateType})
Regular Hours: ${enteredRegularHours} hrs -> ${formatMoney(regularPayTotal)}
Overtime Multiplier: ${multiplier}x (${formatMoney(computedOvertimeRate)}/hr)
Overtime Hours: ${enteredOvertimeHours} hrs -> ${formatMoney(overtimePayTotal)}
------------------------------
TOTAL GROSS PAY: ${formatMoney(totalGrossPay)}
Total Hours Worked: ${totalHoursWorked} hrs
Statutory Citation: ${selectedJurisdiction.statuteCitation}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="overtime-tool-container" className="space-y-10">
      {/* Hero Section: US Overtime Calculator */}
      <div className="text-center max-w-3xl mx-auto pt-2 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
          FREE US Overtime Calculator
        </h1>
        <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-medium">
          Accurately calculate regular pay, overtime, and double-time under US Federal FLSA and state labor codes for{' '}
          <span className="text-[#FF6200] font-semibold">{selectedJurisdiction.name}</span>.
        </p>

        {/* Quick Jurisdiction Selector Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {JURISDICTIONS.map((jur) => (
            <button
              key={jur.id}
              onClick={() => handleJurisdictionChange(jur.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                selectedJurisdictionId === jur.id
                  ? 'bg-[#FF6200] text-white shadow-sm shadow-orange-500/20 scale-105'
                  : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-[#FF6200]'
              }`}
            >
              <span>{jur.name.split('(')[0].trim()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Calculator Box */}
      <div
        id="employerrules-calculator-card"
        className="w-full max-w-5xl mx-auto rounded-2xl border-2 border-[#FF6200] bg-white dark:bg-neutral-900 shadow-xl shadow-orange-500/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* LEFT COLUMN: Input Form */}
        <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* 1. Pay Rate Segmented Control */}
            <div>
              <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                Pay Rate:
              </label>
              <div className="grid grid-cols-4 border border-neutral-300 dark:border-neutral-700 rounded-lg p-1 bg-neutral-100/70 dark:bg-neutral-800/80 gap-1 text-center">
                {(['hourly', 'daily', 'weekly', 'monthly'] as PayRateType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setPayRateType(type);
                      setHasCalculated(true);
                    }}
                    className={`py-1.5 text-xs font-bold rounded-md capitalize transition-all ${
                      payRateType === type
                        ? 'bg-white dark:bg-neutral-900 text-[#FF6200] shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. US Jurisdiction Selector */}
            <div>
              <label htmlFor="jurisdiction-select" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                US Jurisdiction & Statutory Rule:
              </label>
              <div className="relative">
                <select
                  id="jurisdiction-select"
                  value={selectedJurisdictionId}
                  onChange={(e) => handleJurisdictionChange(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                >
                  {JURISDICTIONS.map((jur) => (
                    <option key={jur.id} value={jur.id}>
                      {jur.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                {selectedJurisdiction.statutorySummary}
              </p>
            </div>

            {/* 3. Base Pay Amount Field */}
            <div>
              <label htmlFor="base-pay-input" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Base Pay Amount ({selectedCurrency.symbol}):
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400 font-bold text-sm">
                  {selectedCurrency.symbol}
                </div>
                <input
                  id="base-pay-input"
                  type="number"
                  step="any"
                  value={payRateInput}
                  onChange={(e) => {
                    setPayRateInput(e.target.value);
                    setHasCalculated(true);
                  }}
                  placeholder="e.g. 25.00"
                  className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder-neutral-400 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                />
              </div>
              {payRateType !== 'hourly' && effectiveHourlyRate > 0 && (
                <p className="mt-1 text-[11px] text-[#FF6200] font-semibold">
                  Equivalent Base Hourly Rate: {formatMoney(effectiveHourlyRate)}/hr
                </p>
              )}
            </div>

            {/* 4. Regular Hours Field */}
            <div>
              <label htmlFor="regular-hours-input" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Regular Hours Worked:
              </label>
              <input
                id="regular-hours-input"
                type="number"
                step="any"
                value={regularHoursInput}
                onChange={(e) => {
                  setRegularHoursInput(e.target.value);
                  setHasCalculated(true);
                }}
                placeholder="Standard 40 hours"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder-neutral-400 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Standard FLSA statutory threshold: 40 hours/week
              </p>
            </div>

            {/* 5. Overtime Multiplier Selector */}
            <div>
              <label htmlFor="multiplier-select" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Overtime Multiplier:
              </label>
              <div className="relative">
                <select
                  id="multiplier-select"
                  value={multiplier}
                  onChange={(e) => {
                    setMultiplier(parseFloat(e.target.value));
                    setHasCalculated(true);
                  }}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                >
                  <option value={1.5}>Time and a Half (x1.5) — Standard US FLSA</option>
                  <option value={2.0}>Double Time (x2.0) — California 12+ hrs or 7th day</option>
                  <option value={2.5}>Double Time & Half (x2.5) — Premium Holiday</option>
                  <option value={3.0}>Triple Time (x3.0) — CBA Special Rate</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">
                {multiplier === 2.0
                  ? 'Double-time rate (California 12+ hour workday or 7th consecutive day over 8 hrs)'
                  : multiplier === 1.5
                  ? 'Standard US Federal overtime rate under FLSA 29 U.S.C. § 207'
                  : 'Premium contractual / holiday overtime multiplier'}
              </p>
            </div>

            {/* 6. Overtime Pay Rate (Calculated Read-only Preview) */}
            <div>
              <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Overtime Pay Rate :
              </label>
              <div className="w-full px-4 py-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium select-none">
                {effectiveHourlyRate > 0 ? (
                  <span className="font-bold text-[#FF6200]">
                    {formatMoney(computedOvertimeRate)} / hr{' '}
                    <span className="font-normal text-xs text-neutral-500 dark:text-neutral-400">
                      ({multiplier}x of base rate)
                    </span>
                  </span>
                ) : (
                  <span className="text-neutral-400 dark:text-neutral-500 italic">
                    (enter pay rate to preview)
                  </span>
                )}
              </div>
            </div>

            {/* 7. Overtime Hours Field */}
            <div>
              <label htmlFor="overtime-hours-input" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Overtime Hours:
              </label>
              <input
                id="overtime-hours-input"
                type="number"
                step="any"
                value={overtimeHoursInput}
                onChange={(e) => {
                  setOvertimeHoursInput(e.target.value);
                  setHasCalculated(true);
                }}
                placeholder="Enter overtime hours"
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium placeholder-neutral-400 focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-calculate-overtime"
              type="button"
              onClick={handleCalculate}
              className="w-full sm:flex-1 py-3 px-6 rounded-full bg-[#FF6200] hover:bg-[#E55800] text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calculate Overtime Pay</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto py-3 px-5 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4 text-neutral-500" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Results Display */}
        <div className="bg-[#FFF9F5] dark:bg-neutral-950/60 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800">
          {!hasCalculated || (enteredPayNum === 0 && enteredOvertimeHours === 0) ? (
            <ClockEmptyState />
          ) : (
            <div className="space-y-6 flex flex-col justify-between h-full animate-in fade-in duration-200">
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF6200] bg-orange-100 dark:bg-orange-950/50 px-2.5 py-1 rounded-full">
                    Calculation Results
                  </span>
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <button
                      onClick={handleCopySummary}
                      className="hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                      title="Copy breakdown"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => window.print()}
                      className="hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 font-semibold"
                      title="Print breakdown"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                {/* Primary Hero Metric: Total Gross Pay */}
                <div className="mt-4 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Total Gross Pay (Regular + Overtime)
                  </div>
                  <div className="text-4xl sm:text-5xl font-black text-neutral-900 dark:text-white tracking-tight mt-1 text-[#FF6200]">
                    {formatMoney(totalGrossPay)}
                  </div>
                  <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 font-medium">
                    <span>{totalHoursWorked} total hours worked</span>
                    <span>•</span>
                    <span>{enteredOvertimeHours} OT hours @ {multiplier}x</span>
                  </div>
                </div>

                {/* Detailed Breakdown Card */}
                <div className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 space-y-3.5 shadow-xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Pay Component Breakdown
                  </div>

                  {/* Regular Pay Row */}
                  <div className="flex items-center justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">Regular Pay</div>
                      <div className="text-xs text-neutral-500">
                        {enteredRegularHours} hrs × {formatMoney(effectiveHourlyRate)}/hr
                      </div>
                    </div>
                    <div className="text-right font-bold text-neutral-900 dark:text-white">
                      {formatMoney(regularPayTotal)}
                    </div>
                  </div>

                  {/* Overtime Pay Row */}
                  <div className="flex items-center justify-between text-sm py-1 border-b border-neutral-100 dark:border-neutral-800">
                    <div>
                      <div className="font-semibold text-[#FF6200] flex items-center gap-1.5">
                        <span>Overtime Pay ({multiplier}x)</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {enteredOvertimeHours} hrs × {formatMoney(computedOvertimeRate)}/hr
                      </div>
                    </div>
                    <div className="text-right font-bold text-[#FF6200]">
                      {formatMoney(overtimePayTotal)}
                    </div>
                  </div>

                  {/* Overtime Premium Component (Extra 0.5x) */}
                  <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400 pt-1">
                    <span>Overtime Premium Component ({multiplier - 1}x incremental):</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      +{formatMoney(overtimePremiumOnly)}
                    </span>
                  </div>
                </div>

                {/* Statutory Citation Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/30 border border-orange-200/80 dark:border-orange-900/40 text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#FF6200] shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-neutral-900 dark:text-white">
                      {selectedJurisdiction.statuteCitation}
                    </strong>
                    <p className="mt-0.5 text-neutral-600 dark:text-neutral-400 text-[11px] leading-relaxed">
                      {selectedJurisdiction.statutorySummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Notice: Counsel-Verified Formulas */}
              <div className="pt-4 border-t border-neutral-200/70 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
                <span>Verified under 2026 US statutory guidelines</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Free & Private</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advanced Day-by-Day Punch Card Timesheet (Expandable Section) */}
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#FF6200]" />
                <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900 dark:text-white">
                  Multi-Day Timesheet Overtime Auditor (7-Day Schedule)
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                Audits daily overtime, double-time, and 7th consecutive day overtime under California Lab. Code § 510 or Federal rules without pyramiding.
              </p>
            </div>

            <button
              onClick={() => setShowDayByDayTimesheet(!showDayByDayTimesheet)}
              className="self-start sm:self-auto px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:border-[#FF6200] transition-colors flex items-center gap-1.5"
            >
              <span>{showDayByDayTimesheet ? 'Hide Schedule' : 'Audit 7-Day Schedule'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDayByDayTimesheet ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showDayByDayTimesheet && (
            <div className="space-y-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in duration-200">
              {/* Daily Hours Inputs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                {timesheetDays.map((day, idx) => (
                  <div key={day.dayName} className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-center space-y-1.5">
                    <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase">
                      {day.dayName}
                    </span>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="24"
                      value={day.hours}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        const copy = [...timesheetDays];
                        copy[idx] = { ...copy[idx], hours: val };
                        setTimesheetDays(copy);
                      }}
                      className="w-full py-1 text-center font-bold text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md focus:ring-1 focus:ring-[#FF6200] outline-none"
                    />
                    <span className="text-[10px] text-neutral-400">hours</span>
                  </div>
                ))}
              </div>

              {/* Day-by-Day Statutory Result Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30">
                <div>
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">Regular Hours</span>
                  <div className="text-xl font-extrabold text-neutral-900 dark:text-white mt-0.5">
                    {dayByDayResult.regularHours} hrs
                  </div>
                  <span className="text-xs text-neutral-500">
                    {formatMoney(dayByDayResult.regularPay)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">1.5x Overtime</span>
                  <div className="text-xl font-extrabold text-[#FF6200] mt-0.5">
                    {dayByDayResult.overtimeHours} hrs
                  </div>
                  <span className="text-xs text-neutral-500">
                    {formatMoney(dayByDayResult.overtimePay)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">2.0x Double Time</span>
                  <div className="text-xl font-extrabold text-red-600 dark:text-red-400 mt-0.5">
                    {dayByDayResult.doubleTimeHours} hrs
                  </div>
                  <span className="text-xs text-neutral-500">
                    {formatMoney(dayByDayResult.doubleTimePay)}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-bold text-neutral-500 uppercase">Total Gross Pay</span>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {formatMoney(dayByDayResult.grossWeeklyPay)}
                  </div>
                  <span className="text-xs text-neutral-500">{dayByDayResult.totalHours} total hrs</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto space-y-4 pt-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white text-center">
          Frequently Asked Questions About US Overtime
        </h2>

        <div className="space-y-3 pt-3">
          {[
            {
              q: 'How does US Federal law (FLSA) calculate overtime pay?',
              a: 'Under the Fair Labor Standards Act (FLSA), covered non-exempt employees must receive overtime pay for hours worked over 40 in a workweek at a rate not less than one and one-half times (1.5x) their regular rate of pay. Federal law does not require daily overtime pay or weekend premium pay unless weekly hours exceed 40.'
            },
            {
              q: 'When does Double Time (2.0x) apply in California?',
              a: 'California Labor Code Section 510 mandates double time (2.0x the regular rate of pay) for all hours worked beyond 12 hours in any single workday, and for all hours worked beyond 8 hours on the seventh consecutive day of work in a single workweek.'
            },
            {
              q: 'What is the "regular rate of pay" used for overtime calculations?',
              a: 'The regular rate of pay under the FLSA includes all remuneration for employment paid to the employee (such as hourly wages, non-discretionary bonuses, shift differentials, and commissions), divided by total hours worked in that workweek. Expense reimbursements and discretionary gifts are excluded.'
            },
            {
              q: 'Can salaried employees in the US receive overtime pay?',
              a: 'Yes. Salaried employees who are non-exempt (meaning they earn below the federal/state salary threshold or do not perform qualifying executive, administrative, or professional duties) are legally entitled to overtime pay whenever they work more than 40 hours in a workweek.'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900 dark:text-white hover:text-[#FF6200] transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    openFaqIndex === idx ? 'rotate-180 text-[#FF6200]' : 'text-neutral-400'
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
