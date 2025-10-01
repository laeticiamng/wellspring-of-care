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

    const { actCode, tensionLevel, fatigueLevel } = await req.json();
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');

    // Determine music parameters based on POMS levels
    let prompt = "ambient storytelling music";
    let tags = ["storytelling", "ambient"];
    
    if (tensionLevel === 'high') {
      prompt += ", warm calming tones, slow tempo";
      tags.push("calming", "warm");
    } else if (fatigueLevel === 'high') {
      prompt += ", gentle sustained notes, low stimulation";
      tags.push("gentle", "minimal");
    } else {
      prompt += ", balanced emotional journey";
      tags.push("balanced");
    }

    let musicUrl = '';
    let fallbackUsed = false;

    if (SUNO_API_KEY) {
      try {
        const sunoResponse = await fetch('https://api.suno.ai/v1/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SUNO_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            tags: tags.join(', '),
            duration: 180,
          }),
        });

        if (sunoResponse.ok) {
          const sunoData = await sunoResponse.json();
          musicUrl = sunoData.audio_url || sunoData.url;
        } else {
          console.log('Suno API unavailable, using fallback');
          fallbackUsed = true;
        }
      } catch (error) {
        console.error('Suno generation error:', error);
        fallbackUsed = true;
      }
    } else {
      fallbackUsed = true;
    }

    // Fallback music URLs
    if (fallbackUsed) {
      const fallbackUrls = [
        'https://example.com/story-ambient-1.mp3',
        'https://example.com/story-ambient-2.mp3',
        'https://example.com/story-ambient-3.mp3',
      ];
      musicUrl = fallbackUrls[Math.floor(Math.random() * fallbackUrls.length)];
    }

    // Save session to database
    const { data: session, error: dbError } = await supabase
      .from('story_sessions')
      .insert({
        user_id: user.id,
        act_code: actCode,
        music_url: musicUrl,
        tension_level: tensionLevel,
        fatigue_level: fatigueLevel,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return new Response(JSON.stringify({
      sessionId: session.id,
      musicUrl,
      fallbackUsed,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Story music generation error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Erreur inconnue" 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
