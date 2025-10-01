import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No auth header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Récupérer l'instrument AAQ-II
    const { data: instrument, error: instrumentError } = await supabaseClient
      .from('clinical_instruments')
      .select('*')
      .eq('code', 'AAQ2')
      .single();

    if (instrumentError || !instrument) {
      throw new Error('AAQ-II instrument not found');
    }

    // Créer une session coach
    const sessionId = crypto.randomUUID();
    const { error: sessionError } = await supabaseClient
      .from('coach_sessions')
      .insert({
        id: sessionId,
        user_id: user.id
      });

    if (sessionError) {
      console.error('Session creation error:', sessionError);
      throw sessionError;
    }

    // Retourner les questions AAQ-II
    return new Response(
      JSON.stringify({
        sessionId,
        instrument: {
          code: instrument.code,
          name: instrument.name,
          questions: instrument.questions
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in coach-assess-start:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});