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

    console.log('Generating recommendations for user:', user.id);

    // Get user activities from last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const { data: activities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', thirtyDaysAgo)
      .order('created_at', { ascending: false });

    // Get emotional scans from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: scans } = await supabase
      .from('emotional_scans')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false });

    // Analyze user behavior patterns
    const activityTypes = activities?.reduce((acc: Record<string, number>, act) => {
      acc[act.activity_type] = (acc[act.activity_type] || 0) + 1;
      return acc;
    }, {}) || {};

    const recommendations: any[] = [];

    // Meditation recommendations
    const meditationCount = activityTypes['meditation_session'] || 0;
    if (meditationCount < 3) {
      recommendations.push({
        user_id: user.id,
        recommendation_type: 'activity',
        content_type: 'meditation',
        content_id: 'meditation',
        priority_level: 'high',
        confidence_score: 0.85,
        reason: 'Vous n\'avez pas médité récemment. Une session de méditation pourrait améliorer votre bien-être.',
        estimated_time: 10,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Journaling recommendations
    const journalCount = activityTypes['journal_entry'] || 0;
    if (journalCount < 5) {
      recommendations.push({
        user_id: user.id,
        recommendation_type: 'activity',
        content_type: 'journal',
        content_id: 'journal-new',
        priority_level: 'medium',
        confidence_score: 0.78,
        reason: 'Tenir un journal régulièrement aide à mieux comprendre vos émotions.',
        estimated_time: 15,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Music therapy recommendations based on emotions
    if (scans && scans.length > 0) {
      const dominantEmotions = scans
        .map(s => s.top_emotion)
        .reduce((acc: Record<string, number>, emotion) => {
          acc[emotion] = (acc[emotion] || 0) + 1;
          return acc;
        }, {});

      const topEmotion = Object.entries(dominantEmotions)
        .sort(([, a], [, b]) => (b as number) - (a as number))[0];

      if (topEmotion) {
        const [emotion, count] = topEmotion;
        recommendations.push({
          user_id: user.id,
          recommendation_type: 'therapy',
          content_type: 'music_therapy',
          content_id: 'music-therapy',
          priority_level: 'high',
          confidence_score: 0.82,
          reason: `Votre émotion dominante est "${emotion}". La musicothérapie peut vous aider à équilibrer votre état émotionnel.`,
          estimated_time: 20,
          expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        });
      }
    }

    // Breathwork recommendations for stress
    const hasStressActivities = activities?.some(a => 
      a.activity_data?.stress_level === 'high' || 
      a.activity_data?.anxiety === true
    );

    if (hasStressActivities) {
      recommendations.push({
        user_id: user.id,
        recommendation_type: 'exercise',
        content_type: 'breathwork',
        content_id: 'breathwork',
        priority_level: 'high',
        confidence_score: 0.88,
        reason: 'Des signes de stress ont été détectés. Des exercices de respiration peuvent vous aider à vous détendre.',
        estimated_time: 5,
        expires_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Community engagement
    const communityCount = activityTypes['community_post'] || 0;
    if (communityCount === 0) {
      recommendations.push({
        user_id: user.id,
        recommendation_type: 'social',
        content_type: 'community',
        content_id: 'social',
        priority_level: 'medium',
        confidence_score: 0.70,
        reason: 'Rejoignez la communauté pour partager votre expérience et trouver du soutien.',
        estimated_time: 10,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // AI Coach recommendation
    const chatCount = activityTypes['chat_message'] || 0;
    if (chatCount < 2) {
      recommendations.push({
        user_id: user.id,
        recommendation_type: 'coaching',
        content_type: 'ai_chat',
        content_id: 'ai-chat',
        priority_level: 'medium',
        confidence_score: 0.75,
        reason: 'Notre coach IA peut vous accompagner dans votre parcours de bien-être.',
        estimated_time: 15,
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // Delete old expired recommendations
    await supabase
      .from('ai_recommendations')
      .delete()
      .eq('user_id', user.id)
      .lt('expires_at', new Date().toISOString());

    // Insert new recommendations
    if (recommendations.length > 0) {
      const { error: insertError } = await supabase
        .from('ai_recommendations')
        .upsert(recommendations, {
          onConflict: 'user_id,content_id',
        });

      if (insertError) {
        console.error('Error inserting recommendations:', insertError);
      }
    }

    console.log(`Generated ${recommendations.length} recommendations for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        recommendations_count: recommendations.length,
        recommendations: recommendations,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in generate-recommendations:', error);
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
