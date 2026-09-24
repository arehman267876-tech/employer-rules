import React, { useState, useId } from 'react';
import { US_STATES } from '../data/states';
import { FINAL_PAYCHECK_RULES } from '../data/rules/finalPaycheckRules';
import { calculateFinalPaycheckDeadline } from '../lib/calculatorLogic';
import { SeparationReason } from '../types';
import { trackCalculatorUsage } from '../lib/usageTracker';
import { supabase } from '../lib/supabaseClient';
import { ClockEmptyState } from './ClockEmptyState';
import {
  Calendar,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ChevronDown,
  ExternalLink,
  BookOpen,
  Info,
  Clock,
  RotateCcw,
  Copy,
  Check,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface FinalPaycheckToolProps {
  selectedStateCode?: string;
  initialState?: string;
  onStateSelect?: (code: string) => void;
  onOpenStateDeepDive?: (code: string) => void;
  onOpenStateComparison?: () => void;
}

export const FinalPaycheckTool: React.FC<FinalPaycheckToolProps> = ({
  selectedStateCode,
  initialState = 'CA',
  onStateSelect,
  onOpenStateDeepDive,
  onOpenStateComparison
}) => {
  const effectiveState = selectedStateCode || initialState;

  // Safe default: today's date in local ISO format YYYY-MM-DD
  const getTodayISO = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDefaultPaydayISO = () => {
    const d = new Date();
    d.setDate(d.getDate() + 10);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const stateSelectId = useId();
  const lastDayInputId = useId();
  const nextPaydayInputId = useId();

  const [stateCode, setStateCode] = useState<string>(effectiveState);
  const [remoteRule, setRemoteRule] = useState<any | null>(null);
  const [reason, setReason] = useState<SeparationReason>('discharge');
  const [hasGivenNotice72h, setHasGivenNotice72h] = useState<boolean>(false);
  const [lastDayOfWorkStr, setLastDayOfWorkStr] = useState<string>(getTodayISO());
  const [nextPaydayStr, setNextPaydayStr] = useState<string>(getDefaultPaydayISO());
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Sync if effectiveState prop changes
 React.useEffect(() => {
  let cancelled = false;

  const loadRule = async () => {
    const { data, error } = await supabase
      .from('final_paycheck_rules')
      .select('rule_data')
      .eq('state_code', stateCode)
      .maybeSingle();

    if (error) {
      console.error('Failed to load final paycheck rule:', error);
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
}, [stateCode]);

  const currentRule =
  remoteRule ||
  FINAL_PAYCHECK_RULES[stateCode] ||
  FINAL_PAYCHECK_RULES['CA'];
  const needsNoticeQuestion = reason === 'resignation' && currentRule.resignation.requiresNoticeQuestion;
  const isPaydayDependentState = ['NY', 'PA', 'NJ', 'FL', 'IL', 'TX'].includes(stateCode);

 const result = calculateFinalPaycheckDeadline({
  stateCode,
  reason,
  hasGivenNotice72h,
  lastDayOfWorkStr,
  nextPaydayStr,
  ruleOverride: remoteRule || undefined
});

  const handleStateChange = (code: string) => {
    setStateCode(code);
    setHasCalculated(true);
    if (onStateSelect) onStateSelect(code);
  };

  const handleReset = () => {
    setLastDayOfWorkStr('');
    setNextPaydayStr('');
    setHasCalculated(false);
  };

  const handleCopy = () => {
    const text = `=== Final Paycheck Legal Deadline ===
State: ${currentRule.stateName} (${stateCode})
Separation: ${reason === 'discharge' ? 'Involuntary Dismissal (Fired / Laid off)' : 'Voluntary Resignation (Quit)'}
Last Day of Work: ${lastDayOfWorkStr}
MANDATORY DEADLINE: ${result.computedDate || result.deadlinePlainLanguage}
Rule: ${result.deadlinePlainLanguage}
Statute Citation: ${result.ruleRecord.citations[0]?.code || currentRule.citations[0]?.code || 'State Labor Code'}
Late Penalty: ${result.ruleRecord.penalties || currentRule.penalties}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="final-paycheck-tool-container" className="space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-2 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
          FREE Final Paycheck Deadline Finder
        </h1>
        <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-medium">
          Accurately calculate mandatory statutory payment deadlines, waiting time penalties, and legal citations for employers in{' '}
          <span className="text-[#FF6200] font-semibold">{currentRule.stateName}</span> and across all 50 states.
        </p>

        {/* Quick State Selector Pills */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {['CA', 'TX', 'NY', 'FL', 'IL', 'PA', 'MA', 'CO', 'WA', 'NJ'].map((code) => {
            const st = US_STATES.find((s) => s.code === code);
            return (
              <button
                key={code}
                onClick={() => handleStateChange(code)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all flex items-center gap-1.5 ${
                  stateCode === code
                    ? 'bg-[#FF6200] text-white shadow-sm shadow-orange-500/20 scale-105'
                    : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 hover:border-[#FF6200]'
                }`}
              >
                <span>{st?.name || code}</span>
                <span className="opacity-80">({code})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Calculator Box */}
      <div
        id="employerrules-final-paycheck-card"
        className="w-full max-w-5xl mx-auto rounded-2xl border-2 border-[#FF6200] bg-white dark:bg-neutral-900 shadow-xl shadow-orange-500/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* LEFT COLUMN: Inputs */}
        <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* 1. State Selector Dropdown */}
            <div>
              <label htmlFor={stateSelectId} className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Jurisdiction / State:
              </label>
              <div className="relative">
                <select
                  id={stateSelectId}
                  value={stateCode}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                >
                  <optgroup label="Priority States (Verified 2026 Statutes)">
                    {US_STATES.filter((s) => s.isPriority).map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.code}) — Verified
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All Other States">
                    {US_STATES.filter((s) => !s.isPriority).map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 2. Separation Reason Segmented Control */}
            <div>
              <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                How Did Employment End?
              </label>
              <div className="grid grid-cols-2 border border-neutral-300 dark:border-neutral-700 rounded-lg p-1 bg-neutral-100/70 dark:bg-neutral-800/80 gap-1 text-center">
                <button
                  type="button"
                  id="btn-reason-discharge"
                  onClick={() => {
                    setReason('discharge');
                    setHasCalculated(true);
                  }}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                    reason === 'discharge'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold border border-neutral-200 dark:border-neutral-700'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Fired / Laid Off
                </button>
                <button
                  type="button"
                  id="btn-reason-resignation"
                  onClick={() => {
                    setReason('resignation');
                    setHasCalculated(true);
                  }}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                    reason === 'resignation'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold border border-neutral-200 dark:border-neutral-700'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  Employee Quit
                </button>
              </div>
            </div>

            {/* 3. Conditional 72h notice question for California */}
            {needsNoticeQuestion && (
              <div className="p-3.5 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6200]">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>California 72-Hour Notice Rule (Cal. Lab. Code § 202)</span>
                </div>
                <p className="text-xs text-neutral-700 dark:text-neutral-300">
                  Did the employee provide at least 72 hours advance notice before resigning?
                </p>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-neutral-800 dark:text-neutral-200">
                    <input
                      type="radio"
                      name="notice72h"
                      checked={hasGivenNotice72h === true}
                      onChange={() => {
                        setHasGivenNotice72h(true);
                        setHasCalculated(true);
                      }}
                      className="text-[#FF6200] focus:ring-[#FF6200]"
                    />
                    <span>Yes (72+ hours notice given)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold cursor-pointer text-neutral-800 dark:text-neutral-200">
                    <input
                      type="radio"
                      name="notice72h"
                      checked={hasGivenNotice72h === false}
                      onChange={() => {
                        setHasGivenNotice72h(false);
                        setHasCalculated(true);
                      }}
                      className="text-[#FF6200] focus:ring-[#FF6200]"
                    />
                    <span>No (Quit without notice)</span>
                  </label>
                </div>
              </div>
            )}

            {/* 4. Last Day of Work */}
            <div>
              <label htmlFor={lastDayInputId} className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Last Day of Work:
              </label>
              <input
                id={lastDayInputId}
                type="date"
                value={lastDayOfWorkStr}
                onChange={(e) => {
                  setLastDayOfWorkStr(e.target.value);
                  setHasCalculated(true);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
              />
            </div>

            {/* 5. Next Regular Payday Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor={nextPaydayInputId} className="block text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Next Scheduled Payday:
                </label>
                {isPaydayDependentState && (
                  <span className="text-[11px] font-bold text-[#FF6200]">
                    Required for {stateCode}
                  </span>
                )}
              </div>
              <input
                id={nextPaydayInputId}
                type="date"
                value={nextPaydayStr}
                onChange={(e) => {
                  setNextPaydayStr(e.target.value);
                  setHasCalculated(true);
                }}
                className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
              />
              <p className="mt-1 text-[11px] text-neutral-500">
                Crucial for states that tie final wages to regular payroll (NY, PA, NJ, TX quit, FL, IL).
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-calculate-final-paycheck"
              type="button"
              onClick={async () => {
  setHasCalculated(true);
  await trackCalculatorUsage('final-paycheck', stateCode);
}}
              className="w-full sm:flex-1 py-3 px-6 rounded-full bg-[#FF6200] hover:bg-[#E55800] text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Calculate Final Paycheck Deadline</span>
            </button>

            <button
              id="btn-reset-final-paycheck"
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto py-3 px-6 rounded-full border-2 border-[#FF6200] text-[#FF6200] hover:bg-orange-50 dark:hover:bg-orange-950/30 font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Results or Empty Clock Illustration */}
        <div className="border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/30 p-6 sm:p-8 flex flex-col justify-center">
          {!hasCalculated || !lastDayOfWorkStr ? (
            <ClockEmptyState
              message="No Results yet"
              submessage="Select the state and last day of work on the left to compute the exact calendar payment deadline."
            />
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Warning if payday discrepancy */}
              {result.warningMessage && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Payday Date Discrepancy</div>
                    <div>{result.warningMessage}</div>
                  </div>
                </div>
              )}

              {/* Big Hero Deadline Card */}
              <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm text-center">
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
                  Mandatory Statutory Deadline
                </span>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FF6200] tracking-tight mt-1">
                  {result.computedDate || result.deadlinePlainLanguage}
                </div>
                <div className="mt-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  {result.deadlinePlainLanguage}
                </div>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Jurisdiction</span>
                  <div className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                    {currentRule.stateName}
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    {reason === 'discharge' ? 'Involuntary' : 'Voluntary'}
                  </span>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Statutory Grace</span>
                  <div className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                    {result.computedDate ? 'Calculated' : 'Payday Linked'}
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Weekend shifts included
                  </span>
                </div>

                <div className="col-span-2 bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-[#FF6200] uppercase tracking-wider">Legal Citation</span>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
                    {result.ruleRecord.citations[0]?.code || currentRule.citations[0]?.code || 'State Labor Code'}
                  </div>
                </div>
              </div>

              {/* Penalty Card */}
              <div className="bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#FF6200]">
                  <Scale className="w-4 h-4 shrink-0" />
                  <span>Late Payment Penalty ({currentRule.stateName}):</span>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {result.ruleRecord.penalties || currentRule.penalties}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex-1 py-2 px-4 rounded-lg bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>

                {onOpenStateComparison && (
                  <button
                    type="button"
                    onClick={onOpenStateComparison}
                    className="py-2 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Compare States</span>
                  </button>
                )}

                {onOpenStateDeepDive && (
                  <button
                    type="button"
                    onClick={() => onOpenStateDeepDive(stateCode)}
                    className="py-2 px-4 rounded-lg border border-[#FF6200] text-[#FF6200] hover:bg-orange-50 dark:hover:bg-orange-950/30 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Statute Deep Dive</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto space-y-4 pt-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white text-center">
          Frequently Asked Questions About Final Paychecks
        </h2>

        <div className="space-y-3 pt-3">
          {[
            {
              q: 'When must a terminated employee be paid in California?',
              a: 'Under California Labor Code Section 201, an employee who is discharged (fired or laid off) must be paid all earned and unpaid wages immediately at the time and place of termination. If the employer willfully fails to pay immediately, waiting time penalties under Section 203 accrue at the employee daily rate of pay for up to 30 calendar days.'
            },
            {
              q: 'What is the rule in Texas for fired vs quit employees?',
              a: 'Under Texas Labor Code Section 61.014, an employee discharged by the employer must be paid in full within 6 calendar days of discharge. An employee who resigns must be paid on the next regularly scheduled payday.'
            },
            {
              q: 'Can employers deduct money from a final paycheck for unreturned equipment?',
              a: 'In many states like California, Massachusetts, and New York, employers are strictly prohibited from making self-help deductions from a final paycheck for unreturned laptops, keys, or damages unless authorized by law or a valid pre-existing written agreement that does not reduce pay below minimum wage.'
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
