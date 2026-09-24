import React from 'react';
import { FINAL_PAYCHECK_RULES } from '../data/rules/finalPaycheckRules';
import { X, ShieldCheck, Scale, ExternalLink, AlertTriangle, Building2, HelpCircle } from 'lucide-react';

interface StateDetailModalProps {
  stateCode: string | null;
  onClose: () => void;
  onSelectForCalculator: (stateCode: string) => void;
}

export const StateDetailModal: React.FC<StateDetailModalProps> = ({
  stateCode,
  onClose,
  onSelectForCalculator
}) => {
  if (!stateCode) return null;
  const rule = FINAL_PAYCHECK_RULES[stateCode];
  if (!rule) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-state-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
    >
      <div
        className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 relative space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with Close */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6200] bg-orange-100 dark:bg-orange-950/40 px-2.5 py-0.5 rounded-full">
                Verified State Statutory Record
              </span>
              <span className="text-xs font-mono font-bold text-neutral-400">
                {rule.stateCode}
              </span>
            </div>
            <h2 id="modal-state-title" className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
              {rule.stateName} Final Paycheck Law
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Discharge vs Resignation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1.5">
            <span className="text-[11px] font-bold uppercase text-neutral-500 tracking-wider">Discharge / Fired</span>
            <div className="text-sm font-extrabold text-neutral-900 dark:text-white">
              {rule.discharge.type === 'immediate' && 'Immediately at time of firing'}
              {rule.discharge.type === 'days' && `Within ${rule.discharge.value} calendar days`}
              {rule.discharge.type === 'next_payday' && 'On or before next regular payday'}
              {rule.discharge.type === 'end_of_pay_period' && 'On next regular pay period'}
              {rule.discharge.type === 'no_state_law' && 'Customary next regular payday'}
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
              {rule.discharge.description}
            </p>
          </div>

          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1.5">
            <span className="text-[11px] font-bold uppercase text-neutral-500 tracking-wider">Resignation / Quit</span>
            <div className="text-sm font-extrabold text-neutral-900 dark:text-white">
              {rule.resignation.requiresNoticeQuestion
                ? 'Within 72 Hours (or on last day if 72h notice given)'
                : rule.resignation.withoutNotice.type === 'next_payday'
                ? 'On or before next regular payday'
                : 'Customary on next regular payday'}
            </div>
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-[11px]">
              {rule.resignation.withoutNotice.description}
            </p>
          </div>
        </div>

        {/* Penalties Callout */}
        <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-800/50 bg-orange-50/60 dark:bg-orange-950/20 space-y-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#FF6200]">
            <AlertTriangle className="w-4 h-4" />
            <span>Statutory Waiting-Time Penalties:</span>
          </div>
          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
            {rule.penalties}
          </p>
        </div>

        {/* Citations list */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-500">
            Primary Legal Citations
          </div>
          <div className="space-y-1.5">
            {rule.citations.map((cite, i) => (
              <div
                key={i}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/30 flex items-center justify-between text-xs"
              >
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{cite.code}</span>
                {cite.url ? (
                  <a
                    href={cite.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FF6200] hover:underline font-bold text-xs flex items-center gap-1"
                  >
                    <span>{cite.label}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-neutral-500 font-medium text-xs">
                    {cite.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-3 text-xs">
          <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#FF6200]" />
            Frequently Asked Questions
          </div>
          <div className="space-y-2">
            {rule.faqs.map((faq, i) => (
              <div key={i} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-800">
                <div className="font-bold text-neutral-900 dark:text-white mb-1">{faq.question}</div>
                <div className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full text-xs font-bold border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Close Window
          </button>
          <button
            onClick={() => {
              onSelectForCalculator(rule.stateCode);
              onClose();
            }}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-[#FF6200] hover:bg-[#E55800] text-white shadow-md shadow-orange-500/25 transition-all"
          >
            Open in Deadline Calculator →
          </button>
        </div>
      </div>
    </div>
  );
};
