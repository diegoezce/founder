import { supabase } from './supabase';

export async function saveProgress(userId, caseId, { totalScore, tier, accuracy }) {
  if (!supabase) return;
  await supabase.from('case_progress').upsert(
    { user_id: userId, case_id: caseId, total_score: totalScore, profile: tier, accuracy },
    { onConflict: 'user_id,case_id' }
  );
}

export async function loadAllProgress(userId) {
  if (!supabase) return {};
  const { data } = await supabase
    .from('case_progress')
    .select('case_id, total_score, profile, accuracy')
    .eq('user_id', userId);
  if (!data) return {};
  return Object.fromEntries(
    data.map(r => [r.case_id, { totalScore: r.total_score, tier: r.profile, accuracy: r.accuracy }])
  );
}
