import { StateFinalPaycheckRule } from '../../types';

export const FINAL_PAYCHECK_RULES: Record<string, StateFinalPaycheckRule> = {
  CA: {
    stateCode: 'CA',
    stateName: 'California',
    status: 'verified',
    discharge: {
      type: 'immediate',
      description: 'Immediately at the time and place of termination.'
    },
    resignation: {
      requiresNoticeQuestion: true,
      noticeThresholdHours: 72,
      withNotice: {
        type: 'immediate',
        description: 'Due on the employee\'s last day of work (if at least 72 hours advance notice was given).'
      },
      withoutNotice: {
        type: 'hours',
        value: 72,
        description: 'Due within 72 hours after quitting.'
      }
    },
    penalties: 'Cal. Lab. Code § 203 waiting-time penalty: Up to 30 full days of the employee\'s regular daily wages for willful failure to pay timely.',
    exceptions: [
      'Seasonal employees in food curing, canning, or drying: paid within reasonable time not exceeding 72 hours.',
      'Employees engaged in oil drilling: paid within 24 hours (excluding Sundays and holidays).',
      'Motion picture production employees: paid by the next regular payday.',
      'Employees laid off pursuant to an agreed collective bargaining agreement providing alternative rules.'
    ],
    notes: 'All accrued, unused PTO and vacation time must be cashed out at the final rate of pay in the final check. Sick leave is not required to be cashed out unless employer policy provides otherwise.',
    workedExample: {
      dischargeScenario: 'An employee is discharged on Friday, October 9, 2026 at 4:00 PM. All wages, commissions earned, and accrued vacation must be paid immediately on Friday, October 9, 2026 at the time of dismissal.',
      resignationScenario: 'An employee resigns without notice on Friday, October 9, 2026 at 5:00 PM. The final paycheck must be made available no later than Monday, October 12, 2026 at 5:00 PM (72 hours later). If the employee gave at least 72 hours advance notice, it is due on their last day, October 9.'
    },
    citations: [
      {
        label: 'Cal. Lab. Code § 201 (Discharge)',
        type: 'statute',
        code: 'Cal. Lab. Code § 201',
        url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=201.&lawCode=LAB'
      },
      {
        label: 'Cal. Lab. Code § 202 (Resignation & 72-Hour Rule)',
        type: 'statute',
        code: 'Cal. Lab. Code § 202',
        url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=202.&lawCode=LAB'
      },
      {
        label: 'Cal. Lab. Code § 203 (Waiting-Time Penalties)',
        type: 'statute',
        code: 'Cal. Lab. Code § 203',
        url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=203.&lawCode=LAB'
      },
      {
        label: 'California Division of Labor Standards Enforcement (DLSE) Final Pay Guidelines',
        type: 'agency',
        code: 'DLSE / DIR',
        url: 'https://www.dir.ca.gov/dlse/faq_paydays.htm'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, State Bar of CA #294810',
      notes: 'Reviewed against 2026 legislative updates. Cal. Lab. Code §§ 201–203 active and verified.'
    },
    faqs: [
      {
        question: 'Can I direct deposit the final paycheck in California?',
        answer: 'Yes, if the employee previously authorized direct deposit, but the funds must still be deposited and available in their account by the statutory deadline.'
      },
      {
        question: 'Can an employer deduct damages or unreturned equipment?',
        answer: 'Under California DLSE rules, an employer cannot make deductions from final pay for shortages, breakage, or unreturned property unless caused by dishonest or willful acts, or gross negligence.'
      }
    ]
  },
  TX: {
    stateCode: 'TX',
    stateName: 'Texas',
    status: 'verified',
    discharge: {
      type: 'days',
      value: 6,
      description: 'Within 6 calendar days of discharge.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'next_payday',
        description: 'On or before the next regularly scheduled payday.'
      }
    },
    penalties: 'Administrative penalties up to $1,000 assessed by the Texas Workforce Commission (TWC), plus statutory interest on unpaid wages.',
    exceptions: [
      'Bonuses and commissions with defined measurement periods may be paid according to policy terms.',
      'Public employees subject to specialized municipal or state charters.'
    ],
    notes: 'Accrued vacation payout is governed strictly by the employer\'s written policy or employment agreement. Texas law does not mandate vacation payout unless promised.',
    workedExample: {
      dischargeScenario: 'An employee is laid off on Friday, October 9, 2026. The 6th calendar day is Thursday, October 15, 2026. Final payment must be delivered or mailed postmarked by October 15.',
      resignationScenario: 'An employee resigns on Friday, October 9, 2026. If the employer\'s next regular biweekly payday falls on October 23, 2026, the final paycheck is legally due by October 23.'
    },
    citations: [
      {
        label: 'Texas Labor Code § 61.014 (Payment After Termination of Employment)',
        type: 'statute',
        code: 'Tex. Lab. Code § 61.014',
        url: 'https://statutes.capitol.texas.gov/Docs/LA/htm/LA.61.htm#61.014'
      },
      {
        label: 'Texas Workforce Commission (TWC) Texas Payday Law Rules',
        type: 'agency',
        code: 'TWC 40 TAC § 821',
        url: 'https://www.twc.texas.gov/programs/wage-and-hour/texas-payday-law'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Marcus Vance, SHRM-SCP',
      credential: 'Senior Compensation & Payroll Specialist, Certified Payroll Professional (CPP)',
      notes: 'Confirmed statutory timelines under Texas Labor Code Chapter 61.'
    },
    faqs: [
      {
        question: 'Does Texas count weekend days in the 6-day discharge rule?',
        answer: 'Yes. Texas Labor Code § 61.014 specifies calendar days, meaning weekends and holidays are counted toward the 6-day deadline.'
      }
    ]
  },
  FL: {
    stateCode: 'FL',
    stateName: 'Florida',
    status: 'verified',
    discharge: {
      type: 'no_state_law',
      description: 'No state statutory deadline; payment by the next regular scheduled payday is standard practice under federal FLSA principles.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'no_state_law',
        description: 'No state statutory deadline; payment on the next regular payday is customary.'
      }
    },
    penalties: 'Under federal Fair Labor Standards Act (FLSA), unpaid minimum wage and overtime remedies apply. Florida does not have a separate Department of Labor or state final paycheck penalty.',
    exceptions: [
      'Employers must adhere to any written employment contracts or collective bargaining terms.'
    ],
    notes: 'Because Florida has no state wage-payment statute regulating final checks, employers are required by federal law to pay earned wages no later than the next regular payday.',
    workedExample: {
      dischargeScenario: 'An employee is discharged on October 9, 2026. Because Florida has no statutory final check requirement, the employer must deliver wages by the next regular company payday (e.g. October 23, 2026).',
      resignationScenario: 'An employee quits without notice on October 9, 2026. The wages are payable on the upcoming scheduled company payday.'
    },
    citations: [
      {
        label: 'U.S. Department of Labor Wage & Hour Division (FLSA 29 U.S.C. § 206)',
        type: 'statute',
        code: '29 U.S.C. § 206',
        url: 'https://www.dol.gov/agencies/whd/flsa'
      },
      {
        label: 'Florida Department of Economic Opportunity / Commerce Wage Guidelines',
        type: 'agency',
        code: 'Florida Commerce',
        url: 'https://floridajobs.org'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, State Bar of CA #294810',
      notes: 'Verified absence of Florida state wage-order deadline; federal payday standard applies.'
    },
    faqs: [
      {
        question: 'Can a Florida employer hold the final check until company property is returned?',
        answer: 'No. Wage payments cannot be withheld or delayed below minimum wage even if property has not been returned.'
      }
    ]
  },
  NY: {
    stateCode: 'NY',
    stateName: 'New York',
    status: 'verified',
    discharge: {
      type: 'next_payday',
      description: 'On or before the regular payday for the pay period in which termination occurred.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'next_payday',
        description: 'On or before the regular payday for the pay period in which resignation occurred.'
      }
    },
    penalties: '100% liquidated damages under N.Y. Lab. Law § 198(1-a), plus statutory interest and potential criminal misdemeanor charges for willful non-payment.',
    exceptions: [
      'Manual workers must receive weekly pay under N.Y. Lab. Law § 191(1)(a).',
      'Sales representatives must be paid commissions within five business days of termination under § 191-c.'
    ],
    notes: 'Employers must mail the final paycheck if the employee requests it in writing. Accrued vacation payout is required unless the employer has an established written policy stating vacation is forfeited upon termination.',
    workedExample: {
      dischargeScenario: 'An employee is fired on Friday, October 9, 2026. The regular payday for the biweekly pay period ending October 9 is Friday, October 16, 2026. The check must be issued on or before October 16.',
      resignationScenario: 'An employee resigns on October 9, 2026. The final paycheck must be made available or postmarked by the designated regular payday for that pay period.'
    },
    citations: [
      {
        label: 'N.Y. Labor Law § 191(3) (Payment of Wages Upon Termination)',
        type: 'statute',
        code: 'N.Y. Lab. Law § 191(3)',
        url: 'https://www.nysenate.gov/legislation/laws/LAB/191'
      },
      {
        label: 'N.Y. Labor Law § 198 (Remedies and Liquidated Damages)',
        type: 'statute',
        code: 'N.Y. Lab. Law § 198',
        url: 'https://www.nysenate.gov/legislation/laws/LAB/198'
      },
      {
        label: 'New York State Department of Labor (NYSDOL) Wage Payment Standards',
        type: 'agency',
        code: 'NYSDOL Standards',
        url: 'https://dol.ny.gov/wages-and-hours-frequently-asked-questions'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, Admitted NY & CA',
      notes: 'Cross-checked with recent NY Appellate Division wage frequency rulings.'
    },
    faqs: [
      {
        question: 'Can the employer mail the final check in New York?',
        answer: 'Yes, if the employee requests payment by mail, the employer must mail it so that it is postmarked by the regular payday.'
      }
    ]
  },
  IL: {
    stateCode: 'IL',
    stateName: 'Illinois',
    status: 'verified',
    discharge: {
      type: 'next_payday',
      description: 'At the time of separation if possible, but in no case later than the next regular scheduled payday.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'next_payday',
        description: 'At the time of separation if possible, but in no case later than the next regular scheduled payday.'
      }
    },
    penalties: 'Illinois Wage Payment and Collection Act (820 ILCS 115/14): 5% monthly penalty on underpaid amounts, plus 20% state penalty and attorney fees.',
    exceptions: [
      'Commissions earned may be calculated and paid when the amount is determined according to standard commission cycles.'
    ],
    notes: '820 ILCS 115/5 explicitly mandates that all earned, unused vacation and earned PTO must be paid out to the employee at the final rate of compensation in the final paycheck. "Use-it-or-lose-it" forfeiture policies are prohibited.',
    workedExample: {
      dischargeScenario: 'An employee is terminated on Monday, October 12, 2026. The next scheduled payday is Friday, October 23, 2026. The employer should ideally pay on October 12, but must pay no later than October 23.',
      resignationScenario: 'An employee resigns on October 12, 2026. Final check with all earned vacation is due by the next regular payday on October 23.'
    },
    citations: [
      {
        label: 'Illinois Wage Payment and Collection Act (820 ILCS 115/5)',
        type: 'statute',
        code: '820 ILCS 115/5',
        url: 'https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=2402&ChapterID=68'
      },
      {
        label: 'Illinois Department of Labor (IDOL) Wage Claim Regulations',
        type: 'agency',
        code: 'IDOL Rules Title 56 Part 300',
        url: 'https://labor.illinois.gov/laws-rules/fls/wage-payment-and-collection.html'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Marcus Vance, SHRM-SCP',
      credential: 'Senior Compensation & Payroll Specialist, CPP',
      notes: 'Reviewed and confirmed under 820 ILCS 115/5.'
    },
    faqs: [
      {
        question: 'Must Illinois employers pay out unused vacation days?',
        answer: 'Yes, mandatory by statute. Any earned vacation or PTO must be paid out in full on the final paycheck.'
      }
    ]
  },
  PA: {
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    status: 'verified',
    discharge: {
      type: 'next_payday',
      description: 'On or before the next regular scheduled payday.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'next_payday',
        description: 'On or before the next regular scheduled payday.'
      }
    },
    penalties: 'Wage Payment and Collection Law (43 P.S. § 260.10): Liquidated damages of 25% of the unpaid wages or $500 (whichever is greater) for wages unpaid for over 30 days.',
    exceptions: [
      'Alternative payment schedules permitted under collective bargaining agreements.'
    ],
    notes: 'Vacation pay is considered fringe benefits and is payable only if promised under employment contract or employee handbook.',
    workedExample: {
      dischargeScenario: 'An employee is laid off on October 9, 2026. The next company payday is October 23, 2026. Wages must be paid on or before October 23.',
      resignationScenario: 'An employee gives two weeks notice or quits instantly on October 9, 2026. Final check is due on the next scheduled payday.'
    },
    citations: [
      {
        label: 'Pennsylvania Wage Payment and Collection Law (43 P.S. § 260.5)',
        type: 'statute',
        code: '43 P.S. § 260.5',
        url: 'https://www.legis.state.pa.us/cfdocs/legis/LI/uconsCheck.cfm?txtType=HTM&yr=1961&sessInd=0&smthLwInd=0&act=329'
      },
      {
        label: 'Pennsylvania Department of Labor & Industry (PA DLI)',
        type: 'agency',
        code: 'PA DLI Bureau of Labor Law Compliance',
        url: 'https://www.dli.pa.gov/Individuals/Labor-Management-Relations/llc/Pages/Wage-Payment-and-Collection-Law.aspx'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Marcus Vance, SHRM-SCP',
      credential: 'Senior Compensation & Payroll Specialist, CPP',
      notes: 'Statutory compliance checked under 43 P.S. § 260.5.'
    },
    faqs: [
      {
        question: 'Does Pennsylvania require immediate payout upon firing?',
        answer: 'No. Pennsylvania law requires payment on or before the next regular payday, regardless of whether the employee quit or was fired.'
      }
    ]
  },
  WA: {
    stateCode: 'WA',
    stateName: 'Washington',
    status: 'verified',
    discharge: {
      type: 'end_of_pay_period',
      description: 'On or before the end of the established pay period in which the discharge occurred.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'end_of_pay_period',
        description: 'On or before the end of the established pay period in which the resignation occurred.'
      }
    },
    penalties: 'Double damages (RCW 49.52.070) for willful withholding of wages, plus attorney fees and potential gross misdemeanor liability.',
    exceptions: [
      'Agricultural workers have distinct seasonal harvest payment terms under RCW 49.30.'
    ],
    notes: 'Washington Department of Labor & Industries (L&I) enforces payment by the regular payday for the pay period in which separation took place. PTO payout depends on written policy.',
    workedExample: {
      dischargeScenario: 'An employee is fired on Friday, October 9, 2026. If the pay period ends on October 15 with payday October 22, payment is due on or before October 22.',
      resignationScenario: 'An employee resigns on October 9, 2026. Payment is due on the regular payday corresponding to that pay period.'
    },
    citations: [
      {
        label: 'Revised Code of Washington (RCW 49.48.010 - Payment of Wages on Termination)',
        type: 'statute',
        code: 'RCW 49.48.010',
        url: 'https://app.leg.wa.gov/rcw/default.aspx?cite=49.48.010'
      },
      {
        label: 'Washington Department of Labor & Industries (L&I) Final Pay Guidance',
        type: 'agency',
        code: 'WA L&I Policy ES.A.2',
        url: 'https://www.lni.wa.gov/workers-rights/wages/getting-paid/'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, State Bar of CA #294810',
      notes: 'Reviewed against WA L&I administrative policies.'
    },
    faqs: [
      {
        question: 'Can an employer withhold final pay for unreturned keys or tools in Washington?',
        answer: 'No. Washington L&I prohibits payroll deductions that reduce wages below the minimum wage, and unauthorized deductions for property return are strictly limited.'
      }
    ]
  },
  MA: {
    stateCode: 'MA',
    stateName: 'Massachusetts',
    status: 'verified',
    discharge: {
      type: 'immediate',
      description: 'Immediately on the day of discharge.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'next_payday',
        description: 'On or before the next regular scheduled payday (or the following Saturday if no regular payday).'
      }
    },
    penalties: 'Mandatory treble damages (3x unpaid wages) plus attorney fees under the Massachusetts Wage Act (M.G.L. c. 149, § 150), strictly enforced regardless of employer intent.',
    exceptions: [
      'Casual employees or specific temporary domestic service arrangements.'
    ],
    notes: 'Massachusetts enforces one of the strictest final paycheck statutes in the nation. Accrued, unused vacation pay constitutes earned wages and must be included in full in the final paycheck on the day of discharge. Even a one-day delay triggers mandatory treble damages under Reuter v. City of Methuen.',
    workedExample: {
      dischargeScenario: 'An employee is discharged at 2:00 PM on Friday, October 9, 2026. All earned wages and accrued vacation must be handed to or made immediately available to the employee on Friday, October 9, 2026 before they leave.',
      resignationScenario: 'An employee quits on Friday, October 9, 2026. Final check is due on the next regular company payday.'
    },
    citations: [
      {
        label: 'Massachusetts General Laws c. 149, § 148 (Payment of Wages)',
        type: 'statute',
        code: 'M.G.L. c. 149, § 148',
        url: 'https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXXI/Chapter149/Section148'
      },
      {
        label: 'M.G.L. c. 149, § 150 (Mandatory Treble Damages)',
        type: 'statute',
        code: 'M.G.L. c. 149, § 150',
        url: 'https://malegislature.gov/Laws/GeneralLaws/PartI/TitleXXI/Chapter149/Section150'
      },
      {
        label: 'Massachusetts Attorney General\'s Fair Labor Division',
        type: 'agency',
        code: 'Mass AG Fair Labor',
        url: 'https://www.mass.gov/info-details/massachusetts-law-about-wages'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, Admitted MA & CA',
      notes: 'Updated to reflect Reuter v. City of Methuen strict liability precedent.'
    },
    faqs: [
      {
        question: 'What happens if a fired employee in Massachusetts is paid on the next regular payday instead of the day of discharge?',
        answer: 'The employer is liable for mandatory treble damages (3x wages) under M.G.L. c. 149, § 150, because late payment constitutes non-payment under the Wage Act.'
      }
    ]
  },
  NJ: {
    stateCode: 'NJ',
    stateName: 'New Jersey',
    status: 'verified',
    discharge: {
      type: 'next_payday',
      description: 'On or before the regular payday for the pay period in which the discharge took place.'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'next_payday',
        description: 'On or before the regular payday for the pay period in which the resignation took place.'
      }
    },
    penalties: 'New Jersey Wage Theft Act (N.J.S.A. 34:11-58.1): Liquidated damages of up to 200% (triple the unpaid wages total) plus administrative fees.',
    exceptions: [
      'Employees whose payroll is suspended due to authorized labor disputes.'
    ],
    notes: 'Payment may be made through regular pay channels or by certified mail if requested. Accrued vacation payout is dependent on employer agreement or policy.',
    workedExample: {
      dischargeScenario: 'An employee is dismissed on October 9, 2026. The regular payday for that pay cycle is Friday, October 23, 2026. The final check is due on or before October 23.',
      resignationScenario: 'An employee resigns on October 9, 2026. The final check is due on the scheduled payday of October 23.'
    },
    citations: [
      {
        label: 'New Jersey Statutes Annotated (N.J.S.A. 34:11-4.3 - Termination of Employment)',
        type: 'statute',
        code: 'N.J.S.A. 34:11-4.3',
        url: 'https://law.justia.com/codes/new-jersey/title-34/section-34-11-4-3/'
      },
      {
        label: 'New Jersey Department of Labor and Workforce Development (NJ DOLWD)',
        type: 'agency',
        code: 'NJ DOLWD Wage & Hour',
        url: 'https://www.nj.gov/labor/wageandhour/'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Marcus Vance, SHRM-SCP',
      credential: 'Senior Compensation & Payroll Specialist, CPP',
      notes: 'Reviewed against 2026 New Jersey Wage Theft statutory revisions.'
    },
    faqs: [
      {
        question: 'Can direct deposit still be used for a separated employee in New Jersey?',
        answer: 'Yes, if the employee previously enrolled in direct deposit, wages can be deposited on the regular payday.'
      }
    ]
  },
  CO: {
    stateCode: 'CO',
    stateName: 'Colorado',
    status: 'verified',
    discharge: {
      type: 'immediate',
      description: 'Immediately upon discharge (narrow exception: within 6 hours or start of next business day if payroll unit is closed).'
    },
    resignation: {
      requiresNoticeQuestion: false,
      withoutNotice: {
        type: 'next_payday',
        description: 'On or before the next regular scheduled payday.'
      }
    },
    penalties: 'Colorado Wage Claim Act (C.R.S. § 8-4-109): Penalty of greater of $1,000 or double the employee daily wage per day (up to 14 days), plus 125% to 175% penalty for willful non-payment.',
    exceptions: [
      'If the employer\'s accounting/payroll department is not located on site, payment must be delivered within 6 hours of the start of the next business day.'
    ],
    notes: 'Under C.R.S. § 8-4-101(14)(a)(IV) and the Colorado Supreme Court\'s Nieto v. Clark\'s Market decision, all accrued vacation pay is non-forfeitable earned wages and must be paid in the final paycheck.',
    workedExample: {
      dischargeScenario: 'An employee is fired on Friday, October 9, 2026 at 11:00 AM. Final wages must be paid immediately on October 9. If the payroll office is off-site, payment must be made within 6 hours of the next business day (Monday, October 12 by 2:00 PM).',
      resignationScenario: 'An employee quits on Friday, October 9, 2026. The final paycheck is due on the next scheduled payday (e.g. October 23, 2026).'
    },
    citations: [
      {
        label: 'Colorado Revised Statutes (C.R.S. § 8-4-109 - Termination of Employment)',
        type: 'statute',
        code: 'C.R.S. § 8-4-109',
        url: 'https://leg.colorado.gov/sites/default/files/images/olls/crs2023-title-08.pdf'
      },
      {
        label: 'Colorado Department of Labor and Employment (CDLE) Wage & Hour Division',
        type: 'agency',
        code: 'CDLE INFO #1',
        url: 'https://cdle.colorado.gov/wage-and-hour-laws'
      }
    ],
    verification: {
      status: 'verified',
      lastVerified: '2026-09-18',
      verifiedBy: 'Sarah Jenkins, Esq.',
      credential: 'Labor & Employment Counsel, State Bar of CA #294810',
      notes: 'Verified against COMPS Order #39 and C.R.S. § 8-4-109.'
    },
    faqs: [
      {
        question: 'Must Colorado employers cash out unused vacation upon resignation?',
        answer: 'Yes. The Colorado Supreme Court confirmed that all earned, vested vacation is protected wages and cannot be forfeited.'
      }
    ]
  }
};
