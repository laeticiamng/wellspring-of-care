import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { session_id, answers = {}, duration_seconds, metadata = {} } = await req.json();

    if (!session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing session_id parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single();

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: 'Session not found or already submitted' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update session with results
    const { error: updateError } = await supabase
      .from('assessment_sessions')
      .update({
        answers,
        duration_seconds,
        metadata,
        completed_at: new Date().toISOString(),
      })
      .eq('id', session_id);

    if (updateError) {
      console.error('Error updating session:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate badge using OpenAI (optional, depends on API key)
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    let badge = 'Merci pour ta participation 🌱';

    if (openaiKey) {
      try {
        const prompt = `Génère un badge émotionnel court (≤6 mots) pour un utilisateur qui vient de compléter ${session.instrument}. Ton doux et encourageant.`;
        
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: 'Tu génères des badges émotionnels courts. Jamais de diagnostic, jamais de chiffres.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: 20,
            temperature: 0.8,
          }),
        });

        if (openaiResponse.ok) {
          const data = await openaiResponse.json();
          badge = data.choices?.[0]?.message?.content?.trim() || badge;
        }
      } catch (error) {
        console.warn('OpenAI badge generation failed:', error);
      }
    }

    return new Response(
      JSON.stringify({
        badge,
        hints: [],
        helps: [],
        can_show: true,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in assess-submit:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
