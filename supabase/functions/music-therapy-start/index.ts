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

    const { moodState } = await req.json();
    
    // Déterminer le prompt Suno selon l'état implicite (POMS-SF)
    let prompt = "ambient, calming, forest sounds, gentle piano";
    let tags = ["relaxing", "nature"];
    
    if (moodState) {
      const { tension, fatigue, energy } = moodState;
      
      if (tension > 3) {
        prompt = "deep ambient, slow tempo, minimal instrumentation, calming waves, soft pads";
        tags = ["calming", "tension-release", "minimal"];
      } else if (fatigue > 3) {
        prompt = "uplifting, gentle energy, warm acoustic, soft drums, motivating melody";
        tags = ["energizing", "uplifting", "gentle"];
      } else if (energy > 4) {
        prompt = "ethereal soundscape, expansive textures, warm harmonics, meditative";
        tags = ["expansive", "meditative", "warm"];
      }
    }

    // Appel Suno API
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    if (!sunoApiKey) {
      throw new Error('SUNO_API_KEY not configured');
    }

    const sunoResponse = await fetch('https://api.suno.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${sunoApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        tags,
        duration: 180, // 3 minutes
        instrumental: true,
      }),
    });

    if (!sunoResponse.ok) {
      const errorText = await sunoResponse.text();
      console.error('Suno API error:', errorText);
      throw new Error('Failed to generate music');
    }

    const sunoData = await sunoResponse.json();

    // Créer session de thérapie musicale
    const sessionId = crypto.randomUUID();
    const { error: sessionError } = await supabaseClient
      .from('music_therapy_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        music_url: sunoData.audio_url || null,
        music_metadata: sunoData,
        mood_state_pre: moodState || {},
        started_at: new Date().toISOString(),
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    return new Response(
      JSON.stringify({
        sessionId,
        musicUrl: sunoData.audio_url,
        visualTheme: tension > 3 ? 'calming' : fatigue > 3 ? 'energizing' : 'expansive',
        duration: 180,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in music-therapy-start:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
