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
    const HUME_API_KEY = Deno.env.get('HUME_API_KEY');
    if (!HUME_API_KEY) {
      throw new Error('HUME_API_KEY not configured');
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

    const { audioData, scanType, textContent } = await req.json();

    console.log('Processing emotional scan:', { scanType, userId: user.id });

    // For now, simulate Hume API response (will be replaced with actual API call)
    // In production, this would call Hume AI API
    const mockEmotions = {
      joy: Math.random() * 0.3 + 0.1,
      sadness: Math.random() * 0.2,
      anger: Math.random() * 0.15,
      fear: Math.random() * 0.15,
      surprise: Math.random() * 0.2,
      disgust: Math.random() * 0.1,
      contempt: Math.random() * 0.1,
      anxiety: Math.random() * 0.25,
      calmness: Math.random() * 0.4 + 0.2,
    };

    const topEmotion = Object.entries(mockEmotions)
      .sort(([, a], [, b]) => b - a)[0];

    // Store scan result in database
    const { data: scan, error: insertError } = await supabase
      .from('emotional_scans')
      .insert({
        user_id: user.id,
        scan_type: scanType,
        text_content: textContent,
        emotions: mockEmotions,
        top_emotion: topEmotion[0],
        confidence: topEmotion[1],
        duration_seconds: 0,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw insertError;
    }

    console.log('Scan created successfully:', scan.id);

    return new Response(
      JSON.stringify({
        scan_id: scan.id,
        emotions: mockEmotions,
        top_emotion: topEmotion[0],
        confidence: topEmotion[1],
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in hume-emotion-detect:', error);
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
