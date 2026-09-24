export interface USStateInfo {
  code: string;
  name: string;
  isPriority: boolean;
  hasRuleRecord: boolean;
}

export const US_STATES: USStateInfo[] = [
  { code: 'AL', name: 'Alabama', isPriority: false, hasRuleRecord: false },
  { code: 'AK', name: 'Alaska', isPriority: false, hasRuleRecord: true }, // Has OT record
  { code: 'AZ', name: 'Arizona', isPriority: false, hasRuleRecord: false },
  { code: 'AR', name: 'Arkansas', isPriority: false, hasRuleRecord: false },
  { code: 'CA', name: 'California', isPriority: true, hasRuleRecord: true },
  { code: 'CO', name: 'Colorado', isPriority: true, hasRuleRecord: true },
  { code: 'CT', name: 'Connecticut', isPriority: false, hasRuleRecord: false },
  { code: 'DE', name: 'Delaware', isPriority: false, hasRuleRecord: false },
  { code: 'DC', name: 'District of Columbia', isPriority: false, hasRuleRecord: false },
  { code: 'FL', name: 'Florida', isPriority: true, hasRuleRecord: true },
  { code: 'GA', name: 'Georgia', isPriority: false, hasRuleRecord: false },
  { code: 'HI', name: 'Hawaii', isPriority: false, hasRuleRecord: false },
  { code: 'ID', name: 'Idaho', isPriority: false, hasRuleRecord: false },
  { code: 'IL', name: 'Illinois', isPriority: true, hasRuleRecord: true },
  { code: 'IN', name: 'Indiana', isPriority: false, hasRuleRecord: false },
  { code: 'IA', name: 'Iowa', isPriority: false, hasRuleRecord: false },
  { code: 'KS', name: 'Kansas', isPriority: false, hasRuleRecord: false },
  { code: 'KY', name: 'Kentucky', isPriority: false, hasRuleRecord: false },
  { code: 'LA', name: 'Louisiana', isPriority: false, hasRuleRecord: false },
  { code: 'ME', name: 'Maine', isPriority: false, hasRuleRecord: false },
  { code: 'MD', name: 'Maryland', isPriority: false, hasRuleRecord: false },
  { code: 'MA', name: 'Massachusetts', isPriority: true, hasRuleRecord: true },
  { code: 'MI', name: 'Michigan', isPriority: false, hasRuleRecord: false },
  { code: 'MN', name: 'Minnesota', isPriority: false, hasRuleRecord: false },
  { code: 'MS', name: 'Mississippi', isPriority: false, hasRuleRecord: false },
  { code: 'MO', name: 'Missouri', isPriority: false, hasRuleRecord: false },
  { code: 'MT', name: 'Montana', isPriority: false, hasRuleRecord: false },
  { code: 'NE', name: 'Nebraska', isPriority: false, hasRuleRecord: false },
  { code: 'NV', name: 'Nevada', isPriority: false, hasRuleRecord: true }, // Has OT record
  { code: 'NH', name: 'New Hampshire', isPriority: false, hasRuleRecord: false },
  { code: 'NJ', name: 'New Jersey', isPriority: true, hasRuleRecord: true },
  { code: 'NM', name: 'New Mexico', isPriority: false, hasRuleRecord: false },
  { code: 'NY', name: 'New York', isPriority: true, hasRuleRecord: true },
  { code: 'NC', name: 'North Carolina', isPriority: false, hasRuleRecord: false },
  { code: 'ND', name: 'North Dakota', isPriority: false, hasRuleRecord: false },
  { code: 'OH', name: 'Ohio', isPriority: false, hasRuleRecord: false },
  { code: 'OK', name: 'Oklahoma', isPriority: false, hasRuleRecord: false },
  { code: 'OR', name: 'Oregon', isPriority: false, hasRuleRecord: false },
  { code: 'PA', name: 'Pennsylvania', isPriority: true, hasRuleRecord: true },
  { code: 'RI', name: 'Rhode Island', isPriority: false, hasRuleRecord: false },
  { code: 'SC', name: 'South Carolina', isPriority: false, hasRuleRecord: false },
  { code: 'SD', name: 'South Dakota', isPriority: false, hasRuleRecord: false },
  { code: 'TN', name: 'Tennessee', isPriority: false, hasRuleRecord: false },
  { code: 'TX', name: 'Texas', isPriority: true, hasRuleRecord: true },
  { code: 'UT', name: 'Utah', isPriority: false, hasRuleRecord: false },
  { code: 'VT', name: 'Vermont', isPriority: false, hasRuleRecord: false },
  { code: 'VA', name: 'Virginia', isPriority: false, hasRuleRecord: false },
  { code: 'WA', name: 'Washington', isPriority: true, hasRuleRecord: true },
  { code: 'WV', name: 'West Virginia', isPriority: false, hasRuleRecord: false },
  { code: 'WI', name: 'Wisconsin', isPriority: false, hasRuleRecord: false },
  { code: 'WY', name: 'Wyoming', isPriority: false, hasRuleRecord: false }
];
