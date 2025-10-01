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

    console.log('Exporting data for user:', user.id);

    // Gather all user data
    const userData: any = {
      user_id: user.id,
      email: user.email,
      exported_at: new Date().toISOString(),
    };

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    userData.profile = profile;

    // Get assessments
    const { data: assessments } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id);
    userData.assessments = assessments;

    // Get assessment sessions
    const { data: sessions } = await supabase
      .from('assessment_sessions')
      .select('*')
      .eq('user_id', user.id);
    userData.assessment_sessions = sessions;

    // Get user activities
    const { data: activities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id);
    userData.activities = activities;

    // Get emotional scans
    const { data: scans } = await supabase
      .from('emotional_scans')
      .select('*')
      .eq('user_id', user.id);
    userData.emotional_scans = scans;

    // Get journal entries
    const { data: journals } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', user.id);
    userData.journal_entries = journals;

    // Get user insights
    const { data: insights } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', user.id);
    userData.insights = insights;

    // Get privacy preferences
    const { data: privacy } = await supabase
      .from('user_privacy_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    userData.privacy_preferences = privacy;

    console.log('Data export completed for user:', user.id);

    return new Response(
      JSON.stringify(userData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in export-user-data:', error);
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
