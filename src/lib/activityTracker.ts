import { supabase } from './supabaseClient';

export async function trackUserActivity(
  activity: string,
  metadata?: Record<string, unknown>
) {
  try {
    const {
      data: { user }
    } = await supabase.auth.getUser();

   await supabase.from('user_activity').insert({
  user_id: user?.id ?? null,
  activity_type: activity,
  metadata: metadata ?? {},
});
  } catch (error) {
    console.error('User activity tracking failed:', error);
  }
}