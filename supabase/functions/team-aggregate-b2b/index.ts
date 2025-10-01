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
    if (!authHeader) throw new Error('No authorization header');

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) throw new Error('Unauthorized');

    const { org_id, team_name, period_start, period_end, instruments = ['SWEMWBS', 'CBI', 'UWES'] } = await req.json();

    // Verify user is manager or admin
    const { data: membership } = await supabase
      .from('org_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('org_id', org_id)
      .single();

    if (!membership || !['manager', 'admin'].includes(membership.role)) {
      throw new Error('Unauthorized: manager role required');
    }

    // Get team members
    const { data: teamMembers } = await supabase
      .from('org_memberships')
      .select('user_id')
      .eq('org_id', org_id)
      .eq('team_name', team_name);

    if (!teamMembers || teamMembers.length < 5) {
      return new Response(JSON.stringify({
        can_show: false,
        message: 'Données insuffisantes (minimum 5 réponses)',
        response_count: teamMembers?.length || 0
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userIds = teamMembers.map(m => m.user_id);

    // Aggregate signals from multiple sources
    const signals = await aggregateTeamSignals(
      supabase,
      userIds,
      new Date(period_start),
      new Date(period_end)
    );

    // Generate verbal phrases
    const { phrases, hints, color_mood } = generateTeamInsights(signals);

    // Save aggregated data
    const { error: saveError } = await supabase
      .from('team_assessments')
      .upsert({
        org_id,
        team_name,
        period_start,
        period_end,
        phrases,
        hints,
        response_count: teamMembers.length,
        can_show: true,
        color_mood
      });

    if (saveError) console.error('Error saving team assessment:', saveError);

    return new Response(JSON.stringify({
      can_show: true,
      phrases,
      hints,
      color_mood,
      response_count: teamMembers.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Team aggregate error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function aggregateTeamSignals(supabase: any, userIds: string[], start: Date, end: Date) {
  // Fetch mood entries
  const { data: moods } = await supabase
    .from('mood_entries')
    .select('valence, arousal, created_at')
    .in('user_id', userIds)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  // Fetch sessions (breathwork, meditation, etc.)
  const { data: sessions } = await supabase
    .from('breathwork_sessions')
    .select('duration, created_at')
    .in('user_id', userIds)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  // Fetch badges
  const { data: badges } = await supabase
    .from('badges')
    .select('name, awarded_at')
    .in('user_id', userIds)
    .gte('awarded_at', start.toISOString())
    .lte('awarded_at', end.toISOString());

  return {
    moods: moods || [],
    sessions: sessions || [],
    badges: badges || []
  };
}

function generateTeamInsights(signals: any) {
  const phrases: string[] = [];
  const hints: any = {};
  let color_mood = 'hsl(var(--accent))';

  // Analyze moods
  const avgValence = signals.moods.length > 0
    ? signals.moods.reduce((sum: number, m: any) => sum + (m.valence || 0), 0) / signals.moods.length
    : 0;
  
  const avgArousal = signals.moods.length > 0
    ? signals.moods.reduce((sum: number, m: any) => sum + (m.arousal || 0), 0) / signals.moods.length
    : 0;

  // Analyze badges for burnout/stress indicators
  const burnoutSignals = signals.badges.filter((b: any) => 
    b.name.toLowerCase().includes('fatigue') || 
    b.name.toLowerCase().includes('tension')
  ).length;

  const engagementSignals = signals.sessions.length;

  // Generate phrases based on signals
  if (avgValence > 0.5 && avgArousal > 0) {
    phrases.push('Bien-être stable dans l\'équipe');
    color_mood = 'hsl(140, 60%, 60%)'; // Green
  } else if (avgValence < -0.5) {
    phrases.push('Période plus délicate exprimée');
    color_mood = 'hsl(250, 40%, 70%)'; // Lavender
    hints.wellbeingFragile = true;
  }

  if (burnoutSignals > 3) {
    phrases.push('Fatigue exprimée → prévoir relâche');
    color_mood = 'hsl(250, 40%, 70%)'; // Lavender
    hints.burnout = true;
  }

  if (engagementSignals > 10) {
    phrases.push('Engagement fort à maintenir');
    color_mood = 'hsl(45, 80%, 60%)'; // Yellow
    hints.engagementHigh = true;
  } else if (engagementSignals < 3) {
    phrases.push('Équipe moins active cette période');
    hints.engagementLow = true;
  }

  // Default phrase if no signals
  if (phrases.length === 0) {
    phrases.push('Période neutre, équipe stable');
  }

  return { phrases: phrases.slice(0, 3), hints, color_mood };
}