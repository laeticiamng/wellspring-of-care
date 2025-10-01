import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { sessionId, moodStatePost, duration, interactions } = await req.json();

    // Calculer badge verbal post-session (POMS-SF implicite)
    let badge = "Voyage complété 🎶";
    let fragmentUnlocked = false;
    let fragmentRarity = "common";

    const tensionDiff = (moodStatePost?.tension || 3) - 3;
    const fatigueDiff = (moodStatePost?.fatigue || 3) - 3;

    if (tensionDiff < -1) {
      badge = "Apaisement trouvé 🌿";
      fragmentUnlocked = true;
      fragmentRarity = Math.random() > 0.9 ? "rare" : "common";
    } else if (tensionDiff > 0) {
      badge = "Encore tendu, prolonge un peu 🌌";
    } else if (fatigueDiff < -1) {
      badge = "Fatigue transformée en douceur 🎶";
      fragmentUnlocked = true;
      fragmentRarity = Math.random() > 0.95 ? "legendary" : "common";
    } else {
      badge = "Sérénité retrouvée ✨";
      fragmentUnlocked = Math.random() > 0.7;
    }

    // Mettre à jour la session
    const { error: updateError } = await supabaseClient
      .from('music_therapy_sessions')
      .update({
        mood_state_post: moodStatePost || {},
        duration_seconds: duration,
        interactions_count: interactions,
        completed_at: new Date().toISOString(),
        badge_verbal: badge,
        fragment_unlocked: fragmentUnlocked,
        fragment_rarity: fragmentRarity,
      })
      .eq('id', sessionId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Session update error:', updateError);
      throw updateError;
    }

    // Si fragment débloqué, créer l'entrée
    let fragmentData = null;
    if (fragmentUnlocked) {
      const fragmentId = crypto.randomUUID();
      const { error: fragmentError } = await supabaseClient
        .from('music_fragments')
        .insert({
          id: fragmentId,
          user_id: user.id,
          session_id: sessionId,
          rarity: fragmentRarity,
          unlocked_at: new Date().toISOString(),
        });

      if (!fragmentError) {
        fragmentData = { id: fragmentId, rarity: fragmentRarity };
      }
    }

    return new Response(
      JSON.stringify({
        badge,
        fragmentUnlocked,
        fragment: fragmentData,
        suggestedAction: tensionDiff > 0 ? "breathwork" : fatigueDiff > 1 ? "meditation" : null,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in music-therapy-submit:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
