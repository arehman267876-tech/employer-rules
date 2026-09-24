import React from 'react';
import { ShieldCheck, Clock, Calendar, FileText, TableProperties, Scale, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer id="app-footer" className="mt-20 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
      {/* Top Disclaimer Notice Banner */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-start gap-3 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#FF6200] shrink-0 mt-0.5" />
          <p>
            <strong className="text-neutral-900 dark:text-white font-bold">General Information & Compliance Notice: </strong>
            This suite provides computational estimates and statutory legal citations for educational and operational planning purposes under US employment laws. It does not constitute formal legal or tax counsel. For formal representation or dispute resolution, consult a licensed employment attorney in your state.
          </p>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6200] to-[#E55800] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-neutral-900 dark:text-white">
                EmployerRules<span className="text-[#FF6200]">.</span>
              </span>
            </div>

            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed text-xs">
              Accurate, verified overtime & employment compliance calculators for US small employers, payroll managers, and HR teams across all 50 states.
            </p>

            <div className="pt-1">
              <div className="flex items-center gap-1.5 text-neutral-500 text-[11px]">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Server Data Logging · 100% Client-Side & Private</span>
              </div>
            </div>
          </div>

          {/* Calculators Column */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
              US Compliance Calculators
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 font-medium">
              <li>
                <button
                  onClick={() => onNavigate('overtime')}
                  className="hover:text-[#FF6200] transition-colors flex items-center gap-1.5 text-left"
                >
                  <Clock className="w-3.5 h-3.5 text-[#FF6200]" />
                  <span>Overtime Pay Calculator</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('final-paycheck')}
                  className="hover:text-[#FF6200] transition-colors flex items-center gap-1.5 text-left"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#FF6200]" />
                  <span>Final Paycheck Deadline Finder</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('1099')}
                  className="hover:text-[#FF6200] transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-[#FF6200]" />
                  <span>1099-NEC & 1099-MISC Checker</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-[#FF6200] transition-colors flex items-center gap-1.5 text-left"
                >
                  <TableProperties className="w-3.5 h-3.5 text-[#FF6200]" />
                  <span>50-State Labor Matrix</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Jurisdictions & Rules */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
              Covered US Jurisdictions
            </h4>
            <ul className="space-y-1.5 text-neutral-600 dark:text-neutral-400 font-medium">
              <li>🇺🇸 US Federal FLSA (29 U.S.C. § 207)</li>
              <li>🇺🇸 California Labor Code § 510 & § 201-203</li>
              <li>🇺🇸 Nevada NRS 608.018 (Wage Threshold Rule)</li>
              <li>🇺🇸 Texas Labor Code § 61.014 (6-Day Discharge)</li>
              <li>🇺🇸 Colorado COMPS Order #39 (12-Hour Rule)</li>
              <li>🇺🇸 New York & Pennsylvania Payday Ties</li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-900 dark:text-white">
              Editorial & Counsel SLA
            </h4>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 font-medium">
              <li>
                <button
                  onClick={() => onNavigate('trust')}
                  className="hover:text-[#FF6200] transition-colors text-left"
                >
                  Statutory Verification Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trust')}
                  className="hover:text-[#FF6200] transition-colors text-left"
                >
                  7-Day Error Correction SLA
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('trust')}
                  className="hover:text-[#FF6200] transition-colors text-left"
                >
                  Statutory Audit Governance
                </button>
              </li>
              <li className="pt-2 text-[11px] text-neutral-400">
                Verified for 2026 US statutory amendments.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div>
            © {new Date().getFullYear()} EmployerRules. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('trust')} className="hover:text-[#FF6200]">
              Terms of Use
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('trust')} className="hover:text-[#FF6200]">
              Privacy Notice
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('trust')} className="hover:text-[#FF6200]">
              State Disclaimer
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
