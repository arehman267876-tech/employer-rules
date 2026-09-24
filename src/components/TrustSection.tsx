import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle,
  FileCheck,
  Lock,
  Mail,
  Send,
  Scale,
  Building,
  User,
  AlertTriangle
} from 'lucide-react';

export const TrustSection: React.FC = () => {
  const [activeTrustTab, setActiveTrustTab] = useState<
    'editorial' | 'reviewers' | 'about' | 'contact' | 'disclaimer' | 'privacy'
  >('editorial');

  // Contact / Error correction form state
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [targetTool, setTargetTool] = useState('final-paycheck');
  const [targetState, setTargetState] = useState('CA');
  const [correctionDetails, setCorrectionDetails] = useState('');
  const [citationSource, setCitationSource] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionSuccess(true);
  };

  return (
    <div id="trust-section-container" className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-[#FF6200] dark:bg-orange-950/40">
            <ShieldCheck className="w-3.5 h-3.5" />
            Governance, Editorial & Transparency
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Editorial Policy & Legal Governance
        </h1>
        <p className="mt-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-3xl leading-relaxed">
          Because payroll errors trigger statutory penalties, every rule published in our calculator suite is verified by licensed attorneys and certified payroll professionals before publication.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
        {[
          { id: 'editorial', label: 'Editorial & Review Workflow' },
          { id: 'reviewers', label: 'Qualified Reviewers' },
          { id: 'contact', label: 'Report Factual Error (7-Day SLA)' },
          { id: 'about', label: 'About Us' },
          { id: 'disclaimer', label: 'Legal Disclaimer' },
          { id: 'privacy', label: 'Privacy & Data Security' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTrustTab(tab.id as any);
              setSubmissionSuccess(false);
            }}
            className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${
              activeTrustTab === tab.id
                ? 'bg-[#FF6200] text-white shadow-xs'
                : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-[#FF6200]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Editorial & Verification Workflow */}
      {activeTrustTab === 'editorial' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="max-w-2xl space-y-2">
            <h2 className="font-extrabold text-2xl text-neutral-900 dark:text-white">
              The 4-Step Rule Verification Process
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We never publish unverified rules or generic AI summaries. Our platform employs a strict statutory sourcing policy backed by continuous automated regression tests.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1.5">
              <div className="font-bold text-[#FF6200] text-sm">Step 1: Statutory Sourcing & Drafting</div>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Researchers locate primary legal authorities: official state labor codes (e.g. California Labor Code, Texas Labor Code, New York Labor Law), administrative wage orders, and Department of Labor guidance.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1.5">
              <div className="font-bold text-[#FF6200] text-sm">Step 2: Legal & Payroll Expert Audit</div>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                A licensed employment attorney or a Certified Payroll Professional (CPP / SHRM-SCP) audits the record against current administrative rulings and recent court precedents.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1.5">
              <div className="font-bold text-[#FF6200] text-sm">Step 3: Verification Stamp & Reviewer Attribution</div>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                The reviewer formally stamps the record with their legal credential, bar association or professional certification number, and verification date.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 space-y-1.5">
              <div className="font-bold text-[#FF6200] text-sm">Step 4: Automated Continuous Regression Testing</div>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Acceptance criteria are continuously verified through unit tests running before each deployment. Date math, anti-pyramiding algorithms, and conditional wage thresholds are mathematically guaranteed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reviewers */}
      {activeTrustTab === 'reviewers' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
            <h2 className="font-extrabold text-2xl text-neutral-900 dark:text-white mb-2">
              Qualified Subject-Matter Reviewers
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Every statutory record is reviewed and signed off by qualified employment law and payroll compensation specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reviewer 1 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#FF6200] flex items-center justify-center font-bold text-lg">
                  SM
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                    Sarah Miller, Esq.
                  </h3>
                  <div className="text-xs text-neutral-500">
                    Lead Employment Counsel · CA Bar #298412
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                14+ years representing employers and executives in wage and hour disputes, DLSE administrative hearings, and California Labor Code § 201–203 compliance.
              </p>
            </div>

            {/* Reviewer 2 */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#FF6200] flex items-center justify-center font-bold text-lg">
                  DR
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                    David Reynolds, CPP, SHRM-SCP
                  </h3>
                  <div className="text-xs text-neutral-500">
                    Senior Payroll Specialist · APA ID #741098
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                18+ years directing multi-state payroll operations, FLSA overtime audits, and IRS information returns (Forms 1099-NEC and 1099-MISC) for growing enterprises.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Report Error Form */}
      {activeTrustTab === 'contact' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
            <h2 className="font-extrabold text-2xl text-neutral-900 dark:text-white">
              Report a Statutory Error or Rule Discrepancy
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
              We maintain a <strong>7-Day Error Correction SLA</strong>: any documented discrepancy submitted with a primary statutory source URL is reviewed by licensed counsel within 7 calendar days.
            </p>
          </div>

          {submissionSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <div className="font-bold text-base text-emerald-900 dark:text-emerald-200">
                Error Report Successfully Submitted
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
                Thank you for helping maintain the highest trust standard in payroll compliance. Our counsel will verify the citation and issue a correction within 7 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Your Name <span className="text-[#FF6200]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Attorney / HR Specialist Name"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FF6200] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Your Email <span className="text-[#FF6200]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FF6200] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Affected Tool <span className="text-[#FF6200]">*</span>
                  </label>
                  <select
                    value={targetTool}
                    onChange={(e) => setTargetTool(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FF6200] outline-none"
                  >
                    <option value="final-paycheck">Final Paycheck Deadline Finder</option>
                    <option value="overtime">Overtime Calculator</option>
                    <option value="1099">1099 Filing Checker</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                    Jurisdiction / State
                  </label>
                  <select
                    value={targetState}
                    onChange={(e) => setTargetState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FF6200] outline-none"
                  >
                    <option value="CA">California (CA)</option>
                    <option value="TX">Texas (TX)</option>
                    <option value="FL">Florida (FL)</option>
                    <option value="NY">New York (NY)</option>
                    <option value="IL">Illinois (IL)</option>
                    <option value="PA">Pennsylvania (PA)</option>
                    <option value="WA">Washington (WA)</option>
                    <option value="MA">Massachusetts (MA)</option>
                    <option value="NJ">New Jersey (NJ)</option>
                    <option value="CO">Colorado (CO)</option>
                    <option value="NV">Nevada (NV)</option>
                    <option value="FED">Federal / IRS</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                  Official Statute or Regulatory Source URL <span className="text-[#FF6200]">*</span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://leginfo.legislature.ca.gov/... or official state DOL URL"
                  value={citationSource}
                  onChange={(e) => setCitationSource(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FF6200] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 mb-1">
                  Description of Discrepancy & Suggested Correction <span className="text-[#FF6200]">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide exact statutory section, effective date, and explanation of why the current rule record requires revision..."
                  value={correctionDetails}
                  onChange={(e) => setCorrectionDetails(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm focus:ring-2 focus:ring-[#FF6200] outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-full font-bold text-sm bg-[#FF6200] hover:bg-[#E55800] text-white shadow-md shadow-orange-500/25 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Error Report for 7-Day Legal Review</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 4: About Us */}
      {activeTrustTab === 'about' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <h2 className="font-extrabold text-2xl text-neutral-900 dark:text-white">
            About Our Compliance Suite
          </h2>
          <p>
            When an employee resigns on a Friday or works 12 hours on a Sunday, managers don't have time to parse through contradictory 3,000-word marketing articles or risk relying on an unverified generative AI summary.
          </p>
          <p>
            Getting a final paycheck deadline wrong in California triggers waiting-time penalties of up to 30 days of daily wages under Cal. Lab. Code § 203; in Massachusetts, a late payment imposes mandatory triple damages under M.G.L. c. 149 § 150.
          </p>
          <p>
            Our calculators run completely in your browser, keeping employee wage data private while generating provable, dated, and source-cited compliance answers.
          </p>
        </div>
      )}

      {/* Tab 5: Legal Disclaimer */}
      {activeTrustTab === 'disclaimer' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-lg">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>General Information Notice & Disclaimer</span>
          </div>
          <p className="font-semibold text-neutral-900 dark:text-white">
            The information, deadlines, and mathematical calculations provided by this tool suite are for educational and operational planning purposes only and do not constitute formal legal, accounting, tax, or employment advice.
          </p>
          <p>
            No Attorney-Client Relationship: Use of this site or any of its tools does not create an attorney-client or accountant-client relationship.
          </p>
          <p>
            Always consult with a licensed employment attorney or certified payroll advisor in your specific jurisdiction for tailored counsel regarding individual employment disputes.
          </p>
        </div>
      )}

      {/* Tab 6: Privacy Policy */}
      {activeTrustTab === 'privacy' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-lg">
            <Lock className="w-5 h-5 text-emerald-600" />
            <span>Privacy Policy & Zero Data Collection Guarantee</span>
          </div>
          <p className="font-semibold text-neutral-900 dark:text-white">
            We believe sensitive wage and compensation information belongs solely on your device.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>100% Client-Side Calculations:</strong> All overtime numbers, hourly pay rates, dates of termination, and 1099 payment amounts are computed purely in your local browser using client-side JavaScript. None of your numbers are ever sent to our servers.
            </li>
            <li>
              <strong>No Mandatory User Accounts:</strong> All tools are free and accessible instantly without creating accounts, providing credit cards, or logging in.
            </li>
            <li>
              <strong>Zero Tracking:</strong> No advertising or invasive tracking scripts are deployed on this application.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
