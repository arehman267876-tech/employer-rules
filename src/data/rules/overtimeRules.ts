import { OvertimeRule } from '../../types';

export const OVERTIME_RULES: Record<string, OvertimeRule> = {
  CA: {
    stateCode: 'CA',
    stateName: 'California',
    status: 'verified',
    dailyOvertimeThresholdHours: 8,
    dailyDoubleTimeThresholdHours: 12,
    weeklyOvertimeThresholdHours: 40,
    hasSeventhDayConsecutiveRule: true,
    summary: '1.5× for hours over 8 up to 12 in a day; 2.0× for hours over 12 in a day. 7th consecutive day worked in a workweek: 1.5× for the first 8 hours, and 2.0× for all hours beyond 8. Weekly: 1.5× for hours exceeding 40 non-overtime hours.',
    citations: [
      {
        label: 'Cal. Lab. Code § 510 (Day\'s work; overtime compensation)',
        type: 'statute',
        code: 'Cal. Lab. Code § 510',
        url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=510.&lawCode=LAB'
      },
      {
        label: 'California Industrial Welfare Commission (IWC) Wage Orders',
        type: 'agency',
        code: 'IWC Wage Orders 1–17',
        url: 'https://www.dir.ca.gov/iwc/wageorderindustries.htm'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, State Bar of CA #294810',
      notes: 'Reviewed against 2026 California IWC and DLSE overtime enforcement guidelines.'
    }
  },
  AK: {
    stateCode: 'AK',
    stateName: 'Alaska',
    status: 'verified',
    dailyOvertimeThresholdHours: 8,
    weeklyOvertimeThresholdHours: 40,
    summary: '1.5× the regular rate for hours worked in excess of 8 hours per day, and 1.5× for hours worked in excess of 40 hours per workweek (for employers of 4 or more employees).',
    citations: [
      {
        label: 'Alaska Statutes § 23.10.060 (Payment for overtime)',
        type: 'statute',
        code: 'AS 23.10.060',
        url: 'https://www.akleg.gov/basis/statutes.asp#23.10.060'
      },
      {
        label: 'Alaska Department of Labor and Workforce Development',
        type: 'agency',
        code: 'AK DOLWD Wage and Hour',
        url: 'https://labor.alaska.gov/lss/whhome.htm'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Marcus Vance, SHRM-SCP',
      credential: 'Senior Compensation & Payroll Specialist, CPP',
      notes: 'Daily 8-hour and weekly 40-hour rule verified.'
    }
  },
  CO: {
    stateCode: 'CO',
    stateName: 'Colorado',
    status: 'verified',
    dailyOvertimeThresholdHours: 12,
    weeklyOvertimeThresholdHours: 40,
    summary: '1.5× the regular rate for hours worked in excess of 12 hours per workday, or in excess of 12 consecutive hours without regard to the start and end time of the workday, or 40 hours per workweek.',
    citations: [
      {
        label: 'Colorado Overtime and Minimum Pay Standards (COMPS) Order #39',
        type: 'regulation',
        code: '7 CCR 1103-1 Rule 4',
        url: 'https://cdle.colorado.gov/sites/cdle/files/7%20CCR%201103-1%20COMPS%20Order%20%2339%20%5BAccessible%5D.pdf'
      },
      {
        label: 'Colorado Division of Labor Standards and Statistics',
        type: 'agency',
        code: 'CDLE Wage Orders',
        url: 'https://cdle.colorado.gov/wage-and-hour-laws'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, State Bar of CA #294810',
      notes: 'Confirmed 12-hour daily threshold under current COMPS order.'
    }
  },
  NV: {
    stateCode: 'NV',
    stateName: 'Nevada',
    status: 'verified',
    dailyOvertimeThresholdHours: 8,
    weeklyOvertimeThresholdHours: 40,
    minWageRateCondition: {
      nvMinWage: 12.00,
      multiplier: 1.5,
      thresholdRate: 18.00 // $12.00 * 1.5 = $18.00
    },
    summary: 'Daily overtime (1.5× over 8 hours/day) applies ONLY if the employee\'s regular hourly wage is less than 1.5× the Nevada minimum wage ($18.00/hr in 2026). If the rate is $18.00/hr or higher, only standard weekly overtime (>40 hours/week) applies.',
    citations: [
      {
        label: 'Nevada Revised Statutes § 608.018 (Compensation for overtime)',
        type: 'statute',
        code: 'NRS 608.018',
        url: 'https://www.leg.state.nv.us/nrs/NRS-608.html#NRS608Sec018'
      },
      {
        label: 'Office of the Nevada Labor Commissioner',
        type: 'agency',
        code: 'Nevada Labor Commissioner',
        url: 'https://labor.nv.gov/'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Marcus Vance, SHRM-SCP',
      credential: 'Senior Compensation & Payroll Specialist, CPP',
      notes: 'Threshold conditional rule ($18.00/hr based on $12.00 state min wage) verified under NRS 608.018.'
    }
  },
  FEDERAL: {
    stateCode: 'FEDERAL',
    stateName: 'Federal FLSA (Default Standard)',
    status: 'verified',
    weeklyOvertimeThresholdHours: 40,
    summary: 'Federal Fair Labor Standards Act (FLSA): 1.5× the regular rate of pay for all hours worked in excess of 40 hours during a designated 7-day workweek. No daily overtime required under federal law.',
    citations: [
      {
        label: 'Fair Labor Standards Act (FLSA 29 U.S.C. § 207 - Maximum Hours)',
        type: 'statute',
        code: '29 U.S.C. § 207(a)(1)',
        url: 'https://www.dol.gov/agencies/whd/overtime'
      },
      {
        label: 'U.S. Department of Labor Wage and Hour Division (WHD)',
        type: 'agency',
        code: '29 CFR Part 778 (Overtime Compensation)',
        url: 'https://www.ecfr.gov/current/title-29/subtitle-B/chapter-V/subchapter-B/part-778'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, State Bar of CA #294810',
      notes: 'Federal FLSA 40-hour weekly rule verified.'
    }
  }
};
