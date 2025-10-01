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

    const { instrument, period = 'last_week', locale = 'fr-FR', start_date, end_date } = await req.json();

    if (!instrument) {
      return new Response(
        JSON.stringify({ error: 'Missing instrument parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate date range
    let fromDate: Date;
    let toDate = new Date();

    if (period === 'custom' && start_date && end_date) {
      fromDate = new Date(start_date);
      toDate = new Date(end_date);
    } else if (period === 'last_month') {
      fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - 1);
    } else {
      // last_week
      fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 7);
    }

    // Get sessions for this period
    const { data: sessions, error: sessionsError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('instrument', instrument)
      .gte('completed_at', fromDate.toISOString())
      .lte('completed_at', toDate.toISOString())
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
    }

    const sessionCount = sessions?.length || 0;
    const canShow = sessionCount >= 2;

    if (!canShow) {
      return new Response(
        JSON.stringify({
          can_show: false,
          verbal_week: [],
          helps: [],
          summary: 'Pas encore assez de données',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate verbal summary using OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    let verbalWeek: string[] = [];
    let helps: string[] = [];

    if (openaiKey && sessions) {
      try {
        const prompt = `Génère 3 phrases courtes (≤10 mots) résumant l'évolution émotionnelle sur ${sessionCount} sessions de ${instrument}. Ton: doux, encourageant. Puis suggère 3 micro-actions concrètes.`;
        
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu génères des résumés émotionnels et suggestions. Format: 3 phrases de résumé, puis 3 suggestions séparées par "---".' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        });

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          const content = data.choices?.[0]?.message?.content?.trim() || '';
          const parts = content.split('---');
          verbalWeek = parts[0]?.split('\n').filter((l: string) => l.trim()).slice(0, 3) || [];
          helps = parts[1]?.split('\n').filter((l: string) => l.trim()).slice(0, 3) || [];
        }
      } catch (error) {
        console.warn('OpenAI aggregate generation failed:', error);
      }
    }

    // Fallbacks
    if (verbalWeek.length === 0) {
      verbalWeek = [
        'Belle régularité cette semaine ✨',
        `${sessionCount} sessions complétées`,
        'Continue sur cette lancée 🌱'
      ];
    }

    if (helps.length === 0) {
      helps = [
        '2 min de respiration par jour',
        'Noter 3 gratitudes le soir',
        'Pause écran toutes les heures'
      ];
    }

    // For WHO5 specifically, also maintain backward compatibility with weekly_summary
    if (instrument === 'WHO5') {

      const weekISO = getWeekISO(toDate);
      const signals = await aggregateWeekSignals(supabase, user.id, fromDate, toDate);
      const { hints, season } = computeWeeklyInsights(signals);

      // Save/update summary
      await supabase
        .from('weekly_summary')
        .upsert({
          user_id: user.id,
          week_iso: weekISO,
          verbal_week: verbalWeek,
          helps,
          season,
          hints,
        });

      // Create garden state
      const plantState = computePlantState(signals);
      const skyState = computeSkyState(signals, verbalWeek);
      const rarity = await computeRarity(supabase, user.id, signals);

      await supabase
        .from('weekly_garden')
        .upsert({
          user_id: user.id,
          week_iso: weekISO,
          plant_state: plantState,
          sky_state: skyState,
          rarity,
        });
    }

    return new Response(JSON.stringify({
      verbal_week: verbalWeek,
      helps,
      can_show: true,
      summary: `${sessionCount} sessions sur ${period === 'last_week' ? '7 jours' : '30 jours'}`,
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
