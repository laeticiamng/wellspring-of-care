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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const jwt = authHeader.replace('Bearer ', '');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(jwt);
    
    if (userError) {
      console.error('Auth error:', userError);
      throw new Error(`Auth error: ${userError.message}`);
    }
    
    if (!user) {
      console.error('No user found');
      throw new Error('User not authenticated');
    }

    console.log('User authenticated:', user.id);

    const { moodState } = await req.json();
    
    // Déterminer le prompt Suno selon l'état implicite (POMS-SF)
    let prompt = "ambient, calming, forest sounds, gentle piano";
    let tags = ["relaxing", "nature"];
    let visualTheme: 'calming' | 'energizing' | 'expansive' = 'expansive';
    
    if (moodState) {
      const tension = moodState.tension || 3;
      const fatigue = moodState.fatigue || 3;
      const energy = moodState.energy || 3;
      
      if (tension > 3) {
        prompt = "deep ambient, slow tempo, minimal instrumentation, calming waves, soft pads";
        tags = ["calming", "tension-release", "minimal"];
        visualTheme = 'calming';
      } else if (fatigue > 3) {
        prompt = "uplifting, gentle energy, warm acoustic, soft drums, motivating melody";
        tags = ["energizing", "uplifting", "gentle"];
        visualTheme = 'energizing';
      } else if (energy > 4) {
        prompt = "ethereal soundscape, expansive textures, warm harmonics, meditative";
        tags = ["expansive", "meditative", "warm"];
        visualTheme = 'expansive';
      }
    }

    // Appel Suno API avec fallback
    let musicUrl = null;
    let musicMetadata = { fallback: true };
    
    const sunoApiKey = Deno.env.get('SUNO_API_KEY');
    
    // Musiques d'ambiance de fallback selon le thème
    const fallbackMusic = {
      calming: 'https://cdn.pixabay.com/audio/2022/03/10/audio_2c87ba15c3.mp3',
      energizing: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3',
      expansive: 'https://cdn.pixabay.com/audio/2022/03/22/audio_5bac687fe3.mp3'
    };

    if (sunoApiKey) {
      try {
        const sunoResponse = await fetch('https://api.suno.ai/v1/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sunoApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            tags,
            duration: 180,
            instrumental: true,
          }),
        });

        if (sunoResponse.ok) {
          const sunoData = await sunoResponse.json();
          musicUrl = sunoData.audio_url;
          musicMetadata = sunoData;
          console.log('Suno API success');
        } else {
          const errorText = await sunoResponse.text();
          console.warn('Suno API unavailable, using fallback:', errorText);
          musicUrl = fallbackMusic[visualTheme];
        }
      } catch (error) {
        console.warn('Suno API error, using fallback:', error);
        musicUrl = fallbackMusic[visualTheme];
      }
    } else {
      console.log('No Suno API key, using fallback music');
      musicUrl = fallbackMusic[visualTheme];
    }

    // Créer session de thérapie musicale
    const sessionId = crypto.randomUUID();
    const { error: sessionError } = await supabaseClient
      .from('music_therapy_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        music_url: musicUrl,
        music_metadata: musicMetadata,
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
        musicUrl,
        visualTheme,
        duration: 180,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in music-therapy-start:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
