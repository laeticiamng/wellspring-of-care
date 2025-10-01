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
    const SUNO_API_KEY = Deno.env.get('SUNO_API_KEY');
    if (!SUNO_API_KEY) {
      throw new Error('SUNO_API_KEY not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { emotion, duration, style } = await req.json();

    console.log('Generating music:', { emotion, duration, style, userId: user.id });

    // Check quota
    const currentMonth = new Date().toISOString().slice(0, 7);
    const { data: usage, error: usageError } = await supabase
      .from('music_generation_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('month_year', currentMonth)
      .maybeSingle();

    if (usageError) {
      console.error('Usage check error:', usageError);
    }

    // Create usage record if doesn't exist
    if (!usage) {
      await supabase.from('music_generation_usage').insert({
        user_id: user.id,
        month_year: currentMonth,
        generated_count: 0,
        quota_limit: 10,
      });
    }

    // Check if quota exceeded
    if (usage && usage.generated_count >= usage.quota_limit) {
      return new Response(
        JSON.stringify({ error: 'Monthly quota exceeded' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 429,
        }
      );
    }

    // For now, simulate Suno API response with placeholder audio
    // In production, this would call Suno AI API
    const mockAudioUrl = `https://example.com/audio/${emotion}-${style}-${duration}.mp3`;
    
    // Store generated song
    const { data: song, error: insertError } = await supabase
      .from('generated_songs')
      .insert({
        user_id: user.id,
        emotion_input: emotion,
        style,
        duration,
        audio_url: mockAudioUrl,
        metadata: {
          bpm: Math.floor(Math.random() * 40) + 60,
          key: ['C', 'D', 'E', 'F', 'G', 'A', 'B'][Math.floor(Math.random() * 7)],
          instruments: ['piano', 'ambient pad', 'strings'],
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Song insert error:', insertError);
      throw insertError;
    }

    // Increment usage counter
    await supabase
      .from('music_generation_usage')
      .update({ 
        generated_count: (usage?.generated_count || 0) + 1 
      })
      .eq('user_id', user.id)
      .eq('month_year', currentMonth);

    console.log('Song generated successfully:', song.id);

    return new Response(
      JSON.stringify({
        song_id: song.id,
        audio_url: song.audio_url,
        duration: song.duration,
        metadata: song.metadata,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in suno-music-generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
