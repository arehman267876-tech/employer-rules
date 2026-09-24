import React, { useState } from 'react';
import { check1099Requirement } from '../lib/calculatorLogic';
import { PayeeEntityType, PaymentPurpose, PaymentMethod } from '../types';
import { ClockEmptyState } from './ClockEmptyState';
import { trackCalculatorUsage } from '../lib/usageTracker';
import { supabase } from '../lib/supabaseClient';
import {
  FileText,
  DollarSign,
  ShieldCheck,
  Scale,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Info,
  CreditCard,
  Building,
  RotateCcw,
  Copy,
  Check,
  Printer
} from 'lucide-react';

export const Form1099Tool: React.FC = () => {
  const [taxYear, setTaxYear] = useState<number>(2026);
  const [isBusinessPayment, setIsBusinessPayment] = useState<boolean>(true);
  const [payeeType, setPayeeType] = useState<PayeeEntityType>('individual');
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose>('services');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('direct');
  const [totalPaidStr, setTotalPaidStr] = useState<string>('2400');
  const [hasCalculated, setHasCalculated] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [remoteRule, setRemoteRule] = useState<any | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
React.useEffect(() => {
  let cancelled = false;

  const loadRule = async () => {
    const { data, error } = await supabase
      .from('form_1099_rules')
      .select('rule_data')
      .eq('tax_year', taxYear)
      .maybeSingle();

    if (error) {
      console.error('Failed to load 1099 rule:', error);
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
}, [taxYear]);
  const totalPaid = parseFloat(totalPaidStr) || 0;

 const result = check1099Requirement({
  taxYear,
  isBusinessPayment,
  payeeType,
  paymentPurpose,
  paymentMethod,
  totalPaid,
  ruleOverride: remoteRule || undefined
});

  const handleReset = () => {
    setTotalPaidStr('');
    setHasCalculated(false);
  };

  const handleCopy = () => {
    const text = `=== IRS 1099 Filing Requirement Check ===
Tax Year: ${taxYear}
Total Amount Paid: $${totalPaid.toLocaleString()}
Payee Type: ${payeeType}
Purpose: ${paymentPurpose}
Payment Method: ${paymentMethod === 'direct' ? 'Check / ACH / Cash' : 'Credit Card / Payment App'}
-----------------------------------------
FILING REQUIRED: ${result.isRequired ? `YES - ${result.formName}` : 'NO'}
Box: ${result.boxNumber || 'N/A'}
Threshold Applicable: $${result.thresholdApplied.toLocaleString()}
Recipient Deadline: ${result.dueDateRecipient || 'N/A'}
IRS Deadline: ${result.dueDateIRS || 'N/A'}
Statutory Reason: ${result.primaryReason}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="form-1099-tool-container" className="space-y-10">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto pt-2 pb-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
          FREE 1099 Filing Requirement Checker
        </h1>
        <p className="mt-3 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 font-medium">
          Determine whether your small business must file Form 1099-NEC vs 1099-MISC, the exact form box, the $2,000 threshold for 2026 ($600 for 2025), and credit card processor exemptions.
        </p>
      </div>

      {/* Main 2-Column Calculator Card */}
      <div
        id="employerrules-1099-card"
        className="w-full max-w-5xl mx-auto rounded-2xl border-2 border-[#FF6200] bg-white dark:bg-neutral-900 shadow-xl shadow-orange-500/5 overflow-hidden grid grid-cols-1 lg:grid-cols-2"
      >
        {/* LEFT COLUMN: Inputs */}
        <div className="p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* 1. Tax Year Segmented Control */}
            <div>
              <label className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-2">
                Tax Year & Statutory Threshold:
              </label>
              <div className="grid grid-cols-2 border border-neutral-300 dark:border-neutral-700 rounded-lg p-1 bg-neutral-100/70 dark:bg-neutral-800/80 gap-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setTaxYear(2026);
                    setHasCalculated(true);
                  }}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                    taxYear === 2026
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold border border-neutral-200 dark:border-neutral-700'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div>2026 Tax Year</div>
                  <div className="text-[10px] text-[#FF6200] font-bold">$2,000 Threshold</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTaxYear(2025);
                    setHasCalculated(true);
                  }}
                  className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-md transition-all ${
                    taxYear === 2025
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs font-bold border border-neutral-200 dark:border-neutral-700'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <div>2025 Tax Year</div>
                  <div className="text-[10px] text-neutral-500 font-bold">$600 Threshold</div>
                </button>
              </div>
            </div>

            {/* 2. Total Paid Amount */}
            <div>
              <label htmlFor="total-paid-input" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Total Calendar Year Amount Paid:
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-neutral-400 font-medium text-sm">$</span>
                <input
                  id="total-paid-input"
                  type="number"
                  step="any"
                  value={totalPaidStr}
                  onChange={(e) => {
                    setTotalPaidStr(e.target.value);
                    setHasCalculated(true);
                  }}
                  placeholder="Enter dollar amount"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                />
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">
                Statutory threshold for {taxYear} is{' '}
                <strong className="text-neutral-900 dark:text-white font-bold">
                  ${result.thresholdApplied.toLocaleString()}
                </strong>
                .
              </p>
            </div>

            {/* 3. Payee Entity Structure */}
            <div>
              <label htmlFor="payee-type-select" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Payee Legal Entity Structure:
              </label>
              <div className="relative">
                <select
                  id="payee-type-select"
                  value={payeeType}
                  onChange={(e) => {
                    setPayeeType(e.target.value as PayeeEntityType);
                    setHasCalculated(true);
                  }}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                >
                  <option value="individual">Individual / Sole Proprietorship / Single-Member LLC</option>
                  <option value="corporation">Corporation (C-Corp or S-Corp - Generally Exempt)</option>
                  <option value="partnership">Partnership / Multi-Member LLC</option>
                  <option value="employee">W-2 Employee (Reports on Form W-2, not 1099)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 4. Purpose of Payment */}
            <div>
              <label htmlFor="payment-purpose-select" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Purpose of Payment:
              </label>
              <div className="relative">
                <select
                  id="payment-purpose-select"
                  value={paymentPurpose}
                  onChange={(e) => {
                    setPaymentPurpose(e.target.value as PaymentPurpose);
                    setHasCalculated(true);
                  }}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                >
                  <option value="services">Services / Labor / Nonemployee Compensation</option>
                  <option value="legal">Attorney / Legal Services (IRC § 6045(f) - No Corp Exemption)</option>
                  <option value="medical">Medical & Health Care Payments (Form 1099-MISC Box 6)</option>
                  <option value="rent">Office / Real Estate Rent (Form 1099-MISC Box 1)</option>
                  <option value="goods">Purchase of Physical Goods / Merchandise Only (Exempt)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* 5. Payment Method */}
            <div>
              <label htmlFor="payment-method-select" className="block text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-1.5">
                Payment Method Used:
              </label>
              <div className="relative">
                <select
                  id="payment-method-select"
                  value={paymentMethod}
                  onChange={(e) => {
                    setPaymentMethod(e.target.value as PaymentMethod);
                    setHasCalculated(true);
                  }}
                  className="w-full appearance-none px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-[#FF6200] focus:border-transparent outline-none transition-colors"
                >
                  <option value="direct">Direct Pay: Check, ACH, Bank Wire, or Cash</option>
                  <option value="card_processor">Payment Card / App: Credit Card, PayPal, Stripe (IRC § 6050W)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-neutral-500 absolute right-3 top-3.5 pointer-events-none" />
              </div>
              <p className="mt-1 text-[11px] text-neutral-500">
                Payments via credit card or third-party networks are reported by the processor on Form 1099-K, exempting the payer!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="btn-calculate-1099"
              type="button"
              onClick={async () => {
  setHasCalculated(true);
  await trackCalculatorUsage('1099');
}}
              className="w-full sm:flex-1 py-3 px-6 rounded-full bg-[#FF6200] hover:bg-[#E55800] text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Check 1099 Filing Requirement</span>
            </button>

            <button
              id="btn-reset-1099"
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto py-3 px-6 rounded-full border-2 border-[#FF6200] text-[#FF6200] hover:bg-orange-50 dark:hover:bg-orange-950/30 font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Results or Empty Clock */}
        <div className="border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-950/30 p-6 sm:p-8 flex flex-col justify-center">
          {!hasCalculated || !totalPaidStr ? (
            <ClockEmptyState
              message="No Results yet"
              submessage="Enter the payment amount and payee details on the left to determine whether an IRS Form 1099 is required."
            />
          ) : (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Big Status Badge Card */}
              <div
                className={`p-6 rounded-xl border shadow-sm text-center ${
                  result.isRequired
                    ? 'bg-white dark:bg-neutral-800 border-orange-200 dark:border-orange-950/60'
                    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700'
                }`}
              >
                <span className="text-xs uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
                  IRS Determination for {taxYear}
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-extrabold tracking-tight mt-1 ${
                    result.isRequired ? 'text-[#FF6200]' : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {result.isRequired ? `Filing Required: ${result.formName}` : 'No 1099 Filing Required'}
                </div>
                <div className="mt-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                  {result.boxNumber ? `Report in ${result.boxNumber}` : 'Payer is exempt from filing Form 1099'}
                </div>
              </div>

              {/* 2x2 Metric Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Applicable Threshold</span>
                  <div className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                    ${result.thresholdApplied.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Paid: ${totalPaid.toLocaleString()}
                  </span>
                </div>

                <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Recipient Deadline</span>
                  <div className="text-base font-bold text-neutral-900 dark:text-white mt-1">
                    {result.dueDateRecipient || 'Not Required'}
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    Copies to payee
                  </span>
                </div>

                <div className="col-span-2 bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  <span className="text-[11px] font-bold text-[#FF6200] uppercase tracking-wider">IRS Filing Deadline</span>
                  <div className="text-sm font-bold text-neutral-900 dark:text-white mt-1">
                    {result.dueDateIRS || 'Not Applicable'}
                  </div>
                </div>
              </div>

              {/* Statutory Note Card */}
              <div className="bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800/40 rounded-xl p-4 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#FF6200]">
                  <Scale className="w-4 h-4 shrink-0" />
                  <span>Statutory Legal Basis:</span>
                </div>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {result.primaryReason}
                </p>
                {result.citations && result.citations[0] && (
                  <div className="font-mono text-[11px] text-neutral-500 pt-1">
                    Citation: {result.citations[0].code}
                  </div>
                )}
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

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="py-2 px-4 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-5xl mx-auto space-y-4 pt-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white text-center">
          Frequently Asked Questions About 1099 Compliance
        </h2>

        <div className="space-y-3 pt-3">
          {[
            {
              q: 'What is the new 1099-NEC reporting threshold for 2026?',
              a: 'Under recent federal tax legislation, the nonemployee compensation reporting threshold increases to $2,000 for payments made in the 2026 tax year (due in early 2027), compared to the historic $600 threshold applicable for 2025 and earlier years.'
            },
            {
              q: 'Why does paying an attorney require a 1099 even if incorporated?',
              a: 'Under Internal Revenue Code Section 6045(f), payments made to attorneys in connection with legal services are strictly exempt from the general corporate exemption. Even if the law firm is a C-Corp or S-Corp, payers must issue Form 1099-NEC (Box 1) for legal fees or Form 1099-MISC (Box 10) for gross settlement proceeds.'
            },
            {
              q: 'Do I have to send a 1099 if I paid a contractor via PayPal or credit card?',
              a: 'No. Under IRC Section 6050W, payments made via credit card, debit card, or third-party payment networks (such as PayPal, Stripe, Venmo for Business) are exempt from Form 1099-NEC/MISC filing by the payer. The payment processor is responsible for reporting these amounts on Form 1099-K if criteria are met.'
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
