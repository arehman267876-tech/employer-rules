import React from 'react';
import {
  Calendar,
  Clock,
  FileText,
  ShieldCheck,
  Scale,
  ArrowRight,
  Sparkles,
  Lock,
  Building,
  Briefcase,
  AlertCircle,
  Search,
  CheckCircle2
} from 'lucide-react';
import { US_STATES } from '../data/states';

interface ToolHubProps {
  onSelectTool: (toolKey: string) => void;
  onSelectState: (stateCode: string) => void;
}

export const ToolHub: React.FC<ToolHubProps> = ({ onSelectTool, onSelectState }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const priorityStates = US_STATES.filter((s) => s.isPriority);

  return (
    <div id="tool-hub-container" className="space-y-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-4 pb-2 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 text-[#FF6200] font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>STATUTORY PAYROLL COMPLIANCE SUITE</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-tight">
          Definite payroll & wage answers from statutory law — <span className="text-[#FF6200]">not generic AI summaries.</span>
        </h1>
        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          Overtime rules, final paycheck deadlines, and 1099 thresholds computed in real-time in your browser. Vetted by licensed attorneys and certified payroll specialists.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-3 text-xs font-bold text-neutral-600 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Attorney & CPP Verified
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-500" />
            Zero Data Stored · Completely Private
          </span>
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#FF6200]" />
            Direct Primary Citations
          </span>
        </div>
      </section>

      {/* 3 Core SaaS Tool Cards */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
            Free Interactive Calculators
          </h2>
          <p className="text-sm text-neutral-500">
            Select a compliance engine below to get started immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tool 1: Overtime */}
          <div
            onClick={() => onSelectTool('overtime')}
            className="group relative bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-[#FF6200] dark:hover:border-[#FF6200] rounded-2xl p-7 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-[#FF6200] flex items-center justify-center shadow-xs">
                  <Clock className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-[#FF6200] text-white px-2.5 py-1 rounded-full shadow-xs">
                  Most Popular
                </span>
              </div>
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white group-hover:text-[#FF6200] transition-colors">
                Overtime Pay Calculator
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Compute lawful overtime and double-time without pyramiding. Supports US Federal FLSA 40-hour rule, California daily & 7th day rules, and state statutory mandates.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-[#FF6200]">
              <span>Launch Overtime Calculator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Tool 2: Final Paycheck */}
          <div
            onClick={() => onSelectTool('final-paycheck')}
            className="group relative bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-[#FF6200] dark:hover:border-[#FF6200] rounded-2xl p-7 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-[#FF6200] flex items-center justify-center shadow-xs">
                  <Calendar className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full">
                  All 50 States
                </span>
              </div>
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white group-hover:text-[#FF6200] transition-colors">
                Final Paycheck Deadline Finder
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Calculate the exact calendar due date when an employee is discharged or resigns. Prevents severe statutory waiting-time penalties under Cal. Lab. Code § 203, Mass. Wage Act, and Texas Payday Law.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-[#FF6200]">
              <span>Calculate Payment Due Date</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>

          {/* Tool 3: 1099 */}
          <div
            onClick={() => onSelectTool('1099')}
            className="group relative bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 hover:border-[#FF6200] dark:hover:border-[#FF6200] rounded-2xl p-7 shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-950/50 text-[#FF6200] flex items-center justify-center shadow-xs">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 px-2.5 py-1 rounded-full">
                  2026 Updated
                </span>
              </div>
              <h3 className="font-extrabold text-xl text-neutral-900 dark:text-white group-hover:text-[#FF6200] transition-colors">
                1099 Filing Requirement Checker
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Determine Form 1099-NEC vs 1099-MISC requirements. Understand the $2,000 threshold for 2026 vs $600 for 2025, corporate legal exceptions, credit card 1099-K exemptions, and recipient/IRS deadlines.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-[#FF6200]">
              <span>Check 1099 Requirements</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Priority States Fast Launcher */}
      <section className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-[#FF6200]" />
              Priority US State Wage Statutes
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Instant rule lookup for the 10 highest-volume employer jurisdictions.
            </p>
          </div>
          <button
            onClick={() => onSelectTool('compare')}
            className="text-xs font-bold text-[#FF6200] hover:underline flex items-center gap-1"
          >
            <span>View Full 50-State Comparison Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {priorityStates.map((state) => (
            <button
              key={state.code}
              onClick={() => {
                onSelectState(state.code);
                onSelectTool('final-paycheck');
              }}
              className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/60 hover:border-[#FF6200] hover:bg-white dark:hover:bg-neutral-800 transition-all text-left group"
            >
              <div className="text-xs font-extrabold text-[#FF6200]">
                {state.code}
              </div>
              <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate mt-0.5">
                {state.name}
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
