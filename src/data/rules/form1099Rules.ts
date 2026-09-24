import { Citation, VerificationStamp } from '../../types';

export interface Form1099YearConfig {
  taxYear: number;
  reportingThreshold: number;
  recipientDueDateNec: string; // Formatted date
  irsDueDateNec: string;
  recipientDueDateMisc: string;
  irsDueDateMiscPaper: string;
  irsDueDateMiscElectronic: string;
  notes: string;
}

export const FORM_1099_YEAR_CONFIGS: Record<number, Form1099YearConfig> = {
  2025: {
    taxYear: 2025,
    reportingThreshold: 600,
    recipientDueDateNec: 'Monday, February 2, 2026', // Jan 31, 2026 is Saturday -> Feb 2, 2026
    irsDueDateNec: 'Monday, February 2, 2026',
    recipientDueDateMisc: 'Monday, February 2, 2026',
    irsDueDateMiscPaper: 'Monday, March 2, 2026', // Feb 28 is Saturday
    irsDueDateMiscElectronic: 'Tuesday, March 31, 2026',
    notes: 'Standard $600 threshold under Internal Revenue Code Section 6041 applies for tax year 2025.'
  },
  2026: {
    taxYear: 2026,
    reportingThreshold: 2000,
    recipientDueDateNec: 'Monday, February 1, 2027', // Jan 31, 2027 is Sunday -> Feb 1, 2027
    irsDueDateNec: 'Monday, February 1, 2027',
    recipientDueDateMisc: 'Monday, February 1, 2027',
    irsDueDateMiscPaper: 'Monday, March 1, 2027', // Feb 28 is Sunday
    irsDueDateMiscElectronic: 'Wednesday, March 31, 2027',
    notes: 'Statutory $2,000 reporting threshold applies for payments made in tax year 2026.'
  }
};

export const FORM_1099_CITATIONS: Citation[] = [
  {
    label: 'IRS Instructions for Forms 1099-MISC and 1099-NEC',
    type: 'agency',
    code: 'IRS Cat. No. 64424A',
    url: 'https://www.irs.gov/instructions/i1099mec'
  },
  {
    label: 'Internal Revenue Code § 6041 (Information at source)',
    type: 'statute',
    code: '26 U.S.C. § 6041',
    url: 'https://www.law.cornell.edu/uscode/text/26/6041'
  },
  {
    label: 'Internal Revenue Code § 6045(f) (Payments to attorneys)',
    type: 'statute',
    code: '26 U.S.C. § 6045(f)',
    url: 'https://www.law.cornell.edu/uscode/text/26/6045'
  },
  {
    label: 'Internal Revenue Code § 6050W (Returns relating to payment card transactions / 1099-K exemption)',
    type: 'statute',
    code: '26 U.S.C. § 6050W',
    url: 'https://www.law.cornell.edu/uscode/text/26/6050W'
  }
];

export const FORM_1099_VERIFICATION: VerificationStamp = {
  status: 'verified',
  lastVerified: '2026-09-18',
  verifiedBy: 'Marcus Vance, SHRM-SCP',
  credential: 'Senior Compensation & Payroll Specialist, Certified Payroll Professional (CPP)',
  notes: 'Checked against IRS Publication 1220 and current 2025/2026 1099-NEC & 1099-MISC reporting schedules.'
};
