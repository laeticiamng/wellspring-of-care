import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { instrument, period = 'last_week', locale = 'fr' } = await req.json();

    if (instrument !== 'WHO5') {
      throw new Error('Only WHO5 instrument is supported for aggregation');
    }

    // Calculate week ISO
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const weekISO = getWeekISO(period === 'this_week' ? now : weekStart);

    // Check if we already have a summary
    const { data: existingSummary } = await supabase
      .from('weekly_summary')
      .select('*')
      .eq('user_id', user.id)
      .eq('week_iso', weekISO)
      .single();

    if (existingSummary) {
      return new Response(JSON.stringify({
        can_show: true,
        verbal_week: existingSummary.verbal_week || [],
        hints: existingSummary.hints || {},
        helps: existingSummary.helps || [],
        season: existingSummary.season,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Aggregate week signals
    const signals = await aggregateWeekSignals(supabase, user.id, weekStart, now);
    const { verbal_week, hints, helps, season } = computeWeeklyInsights(signals);

    // Save summary
    const { error: saveError } = await supabase
      .from('weekly_summary')
      .insert({
        user_id: user.id,
        week_iso: weekISO,
        verbal_week,
        helps,
        season,
        hints,
      });

    if (saveError) {
      console.error('Error saving summary:', saveError);
    }

    // Create garden state
    const plantState = computePlantState(signals);
    const skyState = computeSkyState(signals, verbal_week);
    const rarity = await computeRarity(supabase, user.id, signals);

    await supabase
      .from('weekly_garden')
      .insert({
        user_id: user.id,
        week_iso: weekISO,
        plant_state: plantState,
        sky_state: skyState,
        rarity,
      });

    return new Response(JSON.stringify({
      can_show: true,
      verbal_week,
      hints,
      helps,
      season,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Aggregate error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erreur inconnue" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function getWeekISO(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

async function aggregateWeekSignals(supabase: any, userId: string, start: Date, end: Date) {
  // Fetch badges from assessments
  const { data: badges } = await supabase
    .from('badges')
    .select('name, awarded_at')
    .eq('user_id', userId)
    .gte('awarded_at', start.toISOString())
    .lte('awarded_at', end.toISOString());

  // Fetch mood entries
  const { data: moods } = await supabase
    .from('mood_entries')
    .select('valence, arousal, created_at')
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  // Fetch module sessions (simplified)
  const { data: sessions } = await supabase
    .from('breathwork_sessions')
    .select('duration, created_at')
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  return {
    badges: badges || [],
    moods: moods || [],
    sessions: sessions || [],
  };
}

function computeWeeklyInsights(signals: any) {
  const verbal_week: string[] = [];
  const hints: any = {};
  const helps: string[] = [];
  let season = 'spring';

  // Analyze badges
  const tensionBadges = signals.badges.filter((b: any) => 
    b.name.includes('tension') || b.name.includes('calme')
  );
  const fatigueBadges = signals.badges.filter((b: any) => 
    b.name.includes('fatigue') || b.name.includes('repos')
  );

  // Analyze moods
  const avgValence = signals.moods.length > 0
    ? signals.moods.reduce((sum: number, m: any) => sum + (m.valence || 0), 0) / signals.moods.length
    : 0;
  const avgArousal = signals.moods.length > 0
    ? signals.moods.reduce((sum: number, m: any) => sum + (m.arousal || 0), 0) / signals.moods.length
    : 0;

  // Compute verbal tags
  if (tensionBadges.length > 2 || avgArousal < -1) {
    verbal_week.push('posé');
    hints.tensionEased = true;
    helps.push('Respiration 60s quand ça monte');
    season = 'autumn';
  }

  if (fatigueBadges.length > 1 || avgValence < -0.5) {
    verbal_week.push('nuit');
    hints.sleepFragile = true;
    helps.push('Musique ambient 2 min après 22h');
    season = 'winter';
  }

  if (avgValence > 0.5 && avgArousal > 0) {
    verbal_week.push('clair');
    helps.push('Journal 1 phrase post-repas');
    season = 'spring';
  }

  if (signals.sessions.length > 3) {
    verbal_week.push('actif');
    season = 'summer';
  }

  // Default if empty
  if (verbal_week.length === 0) {
    verbal_week.push('doux');
    helps.push('Respiration 60s ce soir');
  }

  // Keep max 3 verbal tags
  verbal_week.splice(3);
  helps.splice(3);

  return { verbal_week, hints, helps, season };
}

function computePlantState(signals: any) {
  const growth = Math.min(signals.sessions.length * 10 + signals.badges.length * 5, 100);
  return {
    growth,
    type: growth > 70 ? 'tree' : growth > 40 ? 'bush' : 'sprout',
    flowers: signals.moods.filter((m: any) => m.valence > 0.5).length,
  };
}

function computeSkyState(signals: any, verbal_week: string[]) {
  const time = verbal_week.includes('nuit') ? 'night' 
    : verbal_week.includes('clair') ? 'day'
    : verbal_week.includes('posé') ? 'dusk'
    : 'dawn';
  
  const weather = verbal_week.includes('nuit') ? 'stars'
    : verbal_week.includes('posé') ? 'calm'
    : 'clear';

  return { time, weather, particles: signals.badges.length > 5 };
}

async function computeRarity(supabase: any, userId: string, signals: any) {
  // Check week streak
  const { data: recentWeeks } = await supabase
    .from('weekly_summary')
    .select('week_iso, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5);

  let streak = 0;
  if (recentWeeks && recentWeeks.length > 0) {
    // Count consecutive weeks
    const now = new Date();
    for (let i = 0; i < recentWeeks.length; i++) {
      const weekDate = new Date(recentWeeks[i].created_at);
      const daysDiff = Math.floor((now.getTime() - weekDate.getTime()) / (1000 * 60 * 60 * 24));
      const weeksDiff = Math.floor(daysDiff / 7);
      
      if (weeksDiff === i) {
        streak++;
      } else {
        break;
      }
    }
  }

  // Calculate rarity based on engagement and streak
  const engagementScore = signals.sessions.length * 2 + signals.badges.length;
  
  // Legendary: 3+ week streak + high engagement
  if (streak >= 3 && engagementScore >= 15) {
    return Math.random() < 0.05 ? 4 : 3; // 5% chance of legendary
  }
  
  // Rare: 2+ week streak or good engagement
  if (streak >= 2 || engagementScore >= 10) {
    return Math.random() < 0.15 ? 3 : 2; // 15% chance of rare
  }
  
  // Common
  return signals.sessions.length > 3 ? 2 : 1;
}
