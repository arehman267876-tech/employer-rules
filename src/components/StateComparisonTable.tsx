import React from 'react';
import { FINAL_PAYCHECK_RULES } from '../data/rules/finalPaycheckRules';
import { ShieldCheck, ArrowRight, Scale } from 'lucide-react';

interface StateComparisonTableProps {
  onSelectState: (stateCode: string) => void;
  onOpenStateDeepDive: (stateCode: string) => void;
}

export const StateComparisonTable: React.FC<StateComparisonTableProps> = ({
  onSelectState,
  onOpenStateDeepDive
}) => {
  const priorityRules = Object.values(FINAL_PAYCHECK_RULES);

  return (
    <div id="state-comparison-table-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
            <Scale className="w-6 h-6 text-[#FF6200]" />
            National 10-State Final Paycheck Comparison
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Statutory deadlines and late payment penalties across the top 10 small-employer jurisdictions.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span>All 10 Records Attorney-Verified</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 font-bold uppercase tracking-wider text-neutral-500 text-[11px]">
              <th className="py-3.5 px-4 font-bold">State & Citation</th>
              <th className="py-3.5 px-4 font-bold">Discharge (Fired / Laid Off)</th>
              <th className="py-3.5 px-4 font-bold">Resignation (Quit)</th>
              <th className="py-3.5 px-4 font-bold hidden md:table-cell">Late Penalty</th>
              <th className="py-3.5 px-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-sans">
            {priorityRules.map((rule) => {
              const mainCitation = rule.citations[0]?.code || 'State Statute';
              return (
                <tr
                  key={rule.stateCode}
                  className="hover:bg-orange-50/40 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  {/* State Name & Code */}
                  <td className="py-4 px-4 font-medium whitespace-nowrap">
                    <div className="font-extrabold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <span>{rule.stateName}</span>
                      <span className="text-xs font-bold text-[#FF6200]">
                        ({rule.stateCode})
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                      § {mainCitation}
                    </div>
                  </td>

                  {/* Discharge Deadline */}
                  <td className="py-4 px-4 text-neutral-700 dark:text-neutral-300 max-w-xs leading-snug">
                    <span className="font-bold block text-neutral-900 dark:text-white">
                      {rule.discharge.type === 'immediate' && 'Immediately (Day of termination)'}
                      {rule.discharge.type === 'days' && `Within ${rule.discharge.value} calendar days`}
                      {rule.discharge.type === 'next_payday' && 'Next regular payday'}
                      {rule.discharge.type === 'end_of_pay_period' && 'End of pay period'}
                      {rule.discharge.type === 'no_state_law' && 'Next regular payday (standard)'}
                    </span>
                    <span className="text-[11px] text-neutral-500 line-clamp-2">
                      {rule.discharge.description}
                    </span>
                  </td>

                  {/* Resignation Deadline */}
                  <td className="py-4 px-4 text-neutral-700 dark:text-neutral-300 max-w-xs leading-snug">
                    <span className="font-bold block text-neutral-900 dark:text-white">
                      {rule.resignation.requiresNoticeQuestion
                        ? '72 hours (no notice) / Last day (with notice)'
                        : rule.resignation.withoutNotice.type === 'next_payday'
                        ? 'Next regular payday'
                        : rule.resignation.withoutNotice.type === 'end_of_pay_period'
                        ? 'End of pay period'
                        : 'Customary regular payday'}
                    </span>
                    <span className="text-[11px] text-neutral-500 line-clamp-2">
                      {rule.resignation.withoutNotice.description}
                    </span>
                  </td>

                  {/* Late Penalty */}
                  <td className="py-4 px-4 text-neutral-500 text-[11px] max-w-xs hidden md:table-cell leading-snug">
                    {rule.penalties}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onSelectState(rule.stateCode)}
                        className="px-3 py-1.5 rounded-full bg-[#FF6200] text-white font-bold text-xs shadow-xs hover:bg-[#E55800] transition-colors"
                        title={`Calculate for ${rule.stateName}`}
                      >
                        Calculate
                      </button>
                      <button
                        onClick={() => onOpenStateDeepDive(rule.stateCode)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title={`View ${rule.stateName} statutory deep dive`}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
