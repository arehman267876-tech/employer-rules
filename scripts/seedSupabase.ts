import { createClient } from '@supabase/supabase-js';
import { FINAL_PAYCHECK_RULES } from '../src/data/rules/finalPaycheckRules';
import { OVERTIME_RULES } from '../src/data/rules/overtimeRules';
import { FORM_1099_YEAR_CONFIGS } from '../src/data/rules/form1099Rules';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding EmployerRules data...');

  const states = Object.values(FINAL_PAYCHECK_RULES).map((rule) => ({
    code: rule.stateCode,
    name: rule.stateName,
  }));

  const { error: statesError } = await supabase
    .from('states')
    .upsert(states, { onConflict: 'code' });

  if (statesError) throw statesError;

  const finalPaycheckRules = Object.values(FINAL_PAYCHECK_RULES).map((rule) => ({
    state_code: rule.stateCode,
    rule_data: rule,
  }));

  const { error: finalError } = await supabase
    .from('final_paycheck_rules')
    .upsert(finalPaycheckRules);

  if (finalError) throw finalError;

  const overtimeRules = Object.entries(OVERTIME_RULES).map(
    ([stateCode, rule]) => ({
      state_code: stateCode,
      rule_data: rule,
    })
  );

  const { error: overtimeError } = await supabase
    .from('overtime_rules')
    .upsert(overtimeRules);

  if (overtimeError) throw overtimeError;

  const form1099Rules = Object.values(FORM_1099_YEAR_CONFIGS).map((rule) => ({
    tax_year: rule.taxYear,
    rule_data: rule,
  }));

  const { error: formError } = await supabase
    .from('form_1099_rules')
    .upsert(form1099Rules, { onConflict: 'tax_year' });

  if (formError) throw formError;

  console.log('✅ EmployerRules data seeded successfully.');
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});