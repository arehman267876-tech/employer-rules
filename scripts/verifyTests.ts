import {
  calculateFinalPaycheckDeadline,
  calculateOvertimePay,
  check1099Requirement
} from '../src/lib/calculatorLogic';

console.log('--- RUNNING EMPLOYERRULES COMPLIANCE ACCEPTANCE TESTS ---');

let passed = 0;
let total = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  total++;
  if (condition) {
    passed++;
    console.log(`✅ PASS: ${testName}`);
  } else {
    console.error(`❌ FAIL: ${testName}`, detail || '');
  }
}

// 1. Final Paycheck CA Quit No Notice
const caNoNotice = calculateFinalPaycheckDeadline({
  stateCode: 'CA',
  reason: 'resignation',
  hasGivenNotice72h: false,
  lastDayOfWorkStr: '2026-10-09'
});
assert(
  caNoNotice.computedDate?.includes('October 12, 2026') === true,
  'CA quit, no notice -> Due Mon Oct 12, 2026',
  caNoNotice.computedDate || undefined
);

// 2. Final Paycheck CA Quit With Notice
const caWithNotice = calculateFinalPaycheckDeadline({
  stateCode: 'CA',
  reason: 'resignation',
  hasGivenNotice72h: true,
  lastDayOfWorkStr: '2026-10-09'
});
assert(
  caWithNotice.computedDate?.includes('October 9, 2026') === true,
  'CA quit with notice -> Due on last day: Fri Oct 9, 2026',
  caWithNotice.computedDate || undefined
);

// 3. Final Paycheck TX Fired
const txFired = calculateFinalPaycheckDeadline({
  stateCode: 'TX',
  reason: 'discharge',
  lastDayOfWorkStr: '2026-10-09'
});
assert(
  txFired.computedDate?.includes('October 15, 2026') === true,
  'TX fired -> Within 6 calendar days: Thu Oct 15, 2026',
  txFired.computedDate || undefined
);

// 4. Payday warning test
const nyInvalidPayday = calculateFinalPaycheckDeadline({
  stateCode: 'NY',
  reason: 'resignation',
  lastDayOfWorkStr: '2026-10-09',
  nextPaydayStr: '2026-10-02'
});
assert(
  nyInvalidPayday.warningMessage !== null && nyInvalidPayday.computedDate === null,
  'NY quit with earlier payday -> Warning and no computed date',
  nyInvalidPayday.warningMessage || undefined
);

// 5. Overtime California Acceptance: $22/hr, 9, 8, 10, 8, 13, 0, 0
const caOtTest = calculateOvertimePay({
  stateCode: 'CA',
  regularHourlyRate: 22,
  days: [
    { dayName: 'Mon', hours: 9 },
    { dayName: 'Tue', hours: 8 },
    { dayName: 'Wed', hours: 10 },
    { dayName: 'Thu', hours: 8 },
    { dayName: 'Fri', hours: 13 },
    { dayName: 'Sat', hours: 0 },
    { dayName: 'Sun', hours: 0 }
  ]
});
assert(
  caOtTest.regularHours === 40 &&
  caOtTest.overtimeHours === 7 &&
  caOtTest.doubleTimeHours === 1 &&
  caOtTest.grossWeeklyPay === 1155.00,
  'CA OT: 40 reg + 7 OT + 1 DT = $1,155.00',
  `Got reg: ${caOtTest.regularHours}, OT: ${caOtTest.overtimeHours}, DT: ${caOtTest.doubleTimeHours}, Gross: ${caOtTest.grossWeeklyPay}`
);

// 6. Federal Overtime for same week: 40 reg + 8 OT = $1,144.00
const fedOtTest = calculateOvertimePay({
  stateCode: 'FEDERAL',
  regularHourlyRate: 22,
  days: [
    { dayName: 'Mon', hours: 9 },
    { dayName: 'Tue', hours: 8 },
    { dayName: 'Wed', hours: 10 },
    { dayName: 'Thu', hours: 8 },
    { dayName: 'Fri', hours: 13 },
    { dayName: 'Sat', hours: 0 },
    { dayName: 'Sun', hours: 0 }
  ]
});
assert(
  fedOtTest.regularHours === 40 &&
  fedOtTest.overtimeHours === 8 &&
  fedOtTest.doubleTimeHours === 0 &&
  fedOtTest.grossWeeklyPay === 1144.00,
  'Federal rule: 40 reg + 8 OT = $1,144.00',
  `Got reg: ${fedOtTest.regularHours}, OT: ${fedOtTest.overtimeHours}, Gross: ${fedOtTest.grossWeeklyPay}`
);

// 7. CA 7th consecutive day: $10/hr, 8h days 1-6, 10h day 7
const ca7thDayTest = calculateOvertimePay({
  stateCode: 'CA',
  regularHourlyRate: 10,
  days: [
    { dayName: 'Day 1', hours: 8 },
    { dayName: 'Day 2', hours: 8 },
    { dayName: 'Day 3', hours: 8 },
    { dayName: 'Day 4', hours: 8 },
    { dayName: 'Day 5', hours: 8 },
    { dayName: 'Day 6', hours: 8 },
    { dayName: 'Day 7', hours: 10 }
  ]
});
assert(
  ca7thDayTest.regularHours === 40 &&
  ca7thDayTest.overtimeHours === 16 &&
  ca7thDayTest.doubleTimeHours === 2,
  'CA 7th day: 40 regular + 16 overtime + 2 double time',
  `Got reg: ${ca7thDayTest.regularHours}, OT: ${ca7thDayTest.overtimeHours}, DT: ${ca7thDayTest.doubleTimeHours}`
);

// 8. Nevada $25/hr one 10-hour day
const nv25 = calculateOvertimePay({
  stateCode: 'NV',
  regularHourlyRate: 25,
  days: [
    { dayName: 'Mon', hours: 10 },
    { dayName: 'Tue', hours: 0 },
    { dayName: 'Wed', hours: 0 },
    { dayName: 'Thu', hours: 0 },
    { dayName: 'Fri', hours: 0 },
    { dayName: 'Sat', hours: 0 },
    { dayName: 'Sun', hours: 0 }
  ]
});
assert(
  nv25.overtimeHours === 0 && nv25.regularHours === 10,
  'NV $25/hr, 10h day -> No overtime (daily rule doesn\'t apply at $25/hr)',
  `Got OT: ${nv25.overtimeHours}`
);

// 9. Nevada $15/hr one 10-hour day
const nv15 = calculateOvertimePay({
  stateCode: 'NV',
  regularHourlyRate: 15,
  days: [
    { dayName: 'Mon', hours: 10 },
    { dayName: 'Tue', hours: 0 },
    { dayName: 'Wed', hours: 0 },
    { dayName: 'Thu', hours: 0 },
    { dayName: 'Fri', hours: 0 },
    { dayName: 'Sat', hours: 0 },
    { dayName: 'Sun', hours: 0 }
  ]
});
assert(
  nv15.overtimeHours === 2 && nv15.regularHours === 8,
  'NV $15/hr, 10h day -> 2 overtime hours',
  `Got OT: ${nv15.overtimeHours}`
);

// 10. 1099: 2026, individual, services, check, $2,400
const t1099_2026_req = check1099Requirement({
  taxYear: 2026,
  isBusinessPayment: true,
  payeeType: 'individual',
  paymentPurpose: 'services',
  paymentMethod: 'direct',
  totalPaid: 2400
});
assert(
  t1099_2026_req.isRequired &&
  t1099_2026_req.formName === 'Form 1099-NEC' &&
  t1099_2026_req.dueDateRecipient.includes('February 1, 2027'),
  '1099 2026 $2,400 services -> Required: Form 1099-NEC Box 1, due Mon Feb 1, 2027',
  `Got form: ${t1099_2026_req.formName}, due: ${t1099_2026_req.dueDateRecipient}`
);

// 11. 1099: 2026, individual, services, check, $1,500
const t1099_2026_under = check1099Requirement({
  taxYear: 2026,
  isBusinessPayment: true,
  payeeType: 'individual',
  paymentPurpose: 'services',
  paymentMethod: 'direct',
  totalPaid: 1500
});
assert(
  !t1099_2026_under.isRequired,
  '1099 2026 $1,500 services -> Not required (under $2,000 threshold)',
  `Got isRequired: ${t1099_2026_under.isRequired}`
);

// 12. 1099: 2025, individual, services, $1,500
const t1099_2025_req = check1099Requirement({
  taxYear: 2025,
  isBusinessPayment: true,
  payeeType: 'individual',
  paymentPurpose: 'services',
  paymentMethod: 'direct',
  totalPaid: 1500
});
assert(
  t1099_2025_req.isRequired,
  '1099 2025 $1,500 services -> Required (the 2025 threshold is $600)',
  `Got isRequired: ${t1099_2025_req.isRequired}`
);

// 13. Card / payment app
const t1099_card = check1099Requirement({
  taxYear: 2026,
  isBusinessPayment: true,
  payeeType: 'individual',
  paymentPurpose: 'services',
  paymentMethod: 'card_processor',
  totalPaid: 5000
});
assert(
  !t1099_card.isRequired && t1099_card.formName.includes('1099-K'),
  'Paid by card/app -> No 1099 from payer; explains 1099-K',
  `Got form: ${t1099_card.formName}`
);

// 14. Corporation services -> Not required
const t1099_corp = check1099Requirement({
  taxYear: 2026,
  isBusinessPayment: true,
  payeeType: 'corporation',
  paymentPurpose: 'services',
  paymentMethod: 'direct',
  totalPaid: 10000
});
assert(
  !t1099_corp.isRequired,
  'Corporation services -> Not required',
  `Got isRequired: ${t1099_corp.isRequired}`
);

// 15. Corporation legal services -> Required
const t1099_legal = check1099Requirement({
  taxYear: 2026,
  isBusinessPayment: true,
  payeeType: 'corporation',
  paymentPurpose: 'legal',
  paymentMethod: 'direct',
  totalPaid: 5000
});
assert(
  t1099_legal.isRequired && t1099_legal.formName === 'Form 1099-NEC',
  'Corporation legal services -> Required: 1099-NEC',
  `Got form: ${t1099_legal.formName}`
);

// 16. Corporation medical -> Required: 1099-MISC Box 6
const t1099_med = check1099Requirement({
  taxYear: 2026,
  isBusinessPayment: true,
  payeeType: 'corporation',
  paymentPurpose: 'medical',
  paymentMethod: 'direct',
  totalPaid: 5000
});
assert(
  t1099_med.isRequired && t1099_med.formName === 'Form 1099-MISC',
  'Corporation medical -> Required: 1099-MISC Box 6',
  `Got form: ${t1099_med.formName}`
);

console.log(`\nTEST RESULTS: ${passed}/${total} tests passed!`);
if (passed === total) {
  console.log('🌟 ALL ACCEPTANCE CRITERIA PASSED EXACTLY!');
} else {
  process.exit(1);
}
