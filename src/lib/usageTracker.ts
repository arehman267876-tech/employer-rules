import { supabase } from './supabaseClient';

export async function trackCalculatorUsage(
  calculator: string,
  stateCode?: string
) {
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    await supabase.from('calculator_usage').insert({
      user_id: user?.id ?? null,
      calculator,
      state_code: stateCode ?? null,
    });
  } catch (error) {
    console.error('Usage tracking failed:', error);
  }
}