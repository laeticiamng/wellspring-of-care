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

    console.log('Generating insights for user:', user.id);

    // Get user activities from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data: activities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false });

    // Get emotion scans from last 7 days
    const { data: scans } = await supabase
      .from('emotional_scans')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', sevenDaysAgo)
      .order('created_at', { ascending: false });

    const insights: any[] = [];

    // Analyze activity frequency
    const activityCount = activities?.length || 0;
    if (activityCount > 0) {
      const avgPerDay = activityCount / 7;
      
      if (avgPerDay > 3) {
        insights.push({
          user_id: user.id,
          insight_type: 'progress',
          title: 'Engagement exceptionnel! 🌟',
          description: `Vous avez été très actif cette semaine avec ${activityCount} activités. Continuez sur cette lancée!`,
          priority: 'high',
          action_items: [],
        });
      } else if (avgPerDay < 1) {
        insights.push({
          user_id: user.id,
          insight_type: 'recommendation',
          title: 'Prenez un moment pour vous',
          description: 'Nous avons remarqué une baisse d\'activité. Prenez quelques minutes aujourd\'hui pour une session de bien-être.',
          priority: 'medium',
          action_items: ['Faire une méditation de 5min', 'Écrire dans votre journal'],
        });
      }
    }

    // Analyze emotional patterns
    if (scans && scans.length > 0) {
      const emotionCounts: Record<string, number> = {};
      scans.forEach(scan => {
        const topEmotion = scan.top_emotion;
        emotionCounts[topEmotion] = (emotionCounts[topEmotion] || 0) + 1;
      });

      const dominantEmotion = Object.entries(emotionCounts)
        .sort(([, a], [, b]) => b - a)[0];

      if (dominantEmotion) {
        const [emotion, count] = dominantEmotion;
        const percentage = Math.round((count / scans.length) * 100);

        insights.push({
          user_id: user.id,
          insight_type: 'pattern',
          title: 'Pattern émotionnel détecté',
          description: `Votre émotion dominante cette semaine est "${emotion}" (${percentage}% du temps). Explorez des exercices adaptés.`,
          priority: 'medium',
          action_items: [`Essayer la méditation pour ${emotion}`, 'Générer une musique apaisante'],
        });
      }
    }

    // Check for streaks
    const journalEntries = activities?.filter(a => a.activity_type === 'journal_entry') || [];
    if (journalEntries.length >= 7) {
      insights.push({
        user_id: user.id,
        insight_type: 'achievement',
        title: 'Série impressionnante! 🔥',
        description: 'Vous avez écrit dans votre journal tous les jours cette semaine. Formidable régularité!',
        priority: 'high',
        action_items: [],
      });
    }

    // Store insights
    if (insights.length > 0) {
      const { error: insertError } = await supabase
        .from('user_insights')
        .insert(insights);

      if (insertError) {
        console.error('Error inserting insights:', insertError);
      }
    }

    console.log(`Generated ${insights.length} insights for user ${user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        insights_count: insights.length,
        insights: insights,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in generate-insights:', error);
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
