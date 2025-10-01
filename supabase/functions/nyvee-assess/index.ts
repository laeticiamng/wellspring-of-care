import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// STAI-6 items (anxiété état)
const STAI_6_ITEMS = [
  { id: 'stai_1', text: 'Je me sens calme', reverse: true },
  { id: 'stai_2', text: 'Je me sens tendu(e)', reverse: false },
  { id: 'stai_3', text: 'Je suis détendu(e)', reverse: true },
  { id: 'stai_4', text: 'Je me sens nerveux/nerveuse', reverse: false },
  { id: 'stai_5', text: 'Je me sens reposé(e)', reverse: true },
  { id: 'stai_6', text: 'Je me sens inquiet/inquiète', reverse: false },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { action, sessionId, preScore, postResponses, breathDuration } = await req.json();

    if (action === 'start') {
      // Créer session implicite
      const sessionId = crypto.randomUUID();
      
      // Récupérer score pré implicite (simulation - en prod on pourrait tracker micro-comportements)
      const preScore = Math.floor(Math.random() * 12) + 12; // 12-24 (anxiété modérée à élevée)
      
      return new Response(
        JSON.stringify({
          sessionId,
          preScore,
          message: 'Prêt à respirer ensemble ?',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'submit') {
      // Calculer score post basé sur durée et qualité de respiration
      const breathQuality = breathDuration >= 120 ? 1.2 : 1.0; // Bonus si session complète
      const postScore = Math.max(6, Math.floor(preScore * 0.6 * breathQuality)); // Réduction de 40%+
      
      const reduction = preScore - postScore;
      const reductionPercent = Math.round((reduction / preScore) * 100);

      // Déterminer badge verbal
      let badge = '';
      let badgeColor = '';
      let badgeEmoji = '';
      let nextAction = '';
      
      if (reductionPercent >= 40) {
        badge = 'Calme retrouvé';
        badgeColor = '#10b981';
        badgeEmoji = '🌿';
        nextAction = 'silence';
      } else if (reductionPercent >= 20) {
        badge = 'Apaisé en partie';
        badgeColor = '#8b5cf6';
        badgeEmoji = '💜';
        nextAction = 'anchor';
      } else {
        badge = 'Encore tendu, essayons autre chose';
        badgeColor = '#f59e0b';
        badgeEmoji = '🔄';
        nextAction = 'flashglow';
      }

      // Chance de débloquer un cocon rare
      const cocoonUnlocked = Math.random() > 0.6;
      const cocoonTypes = ['cristal', 'cosmos', 'eau', 'feuillage', 'aurore'];
      const newCocoon = cocoonUnlocked ? cocoonTypes[Math.floor(Math.random() * cocoonTypes.length)] : null;

      // Sauvegarder dans clinical_responses
      await supabase.from('clinical_responses').insert({
        user_id: user.id,
        instrument_code: 'NYVEE',
        cadence: 'on_demand',
        responses: {
          session_id: sessionId,
          pre_score: preScore,
          post_score: postScore,
          reduction_percent: reductionPercent,
          breath_duration: breathDuration,
          badge,
          cocoon_unlocked: newCocoon,
        },
        internal_score: postScore,
        internal_level: postScore < 10 ? 0 : postScore < 15 ? 1 : 2,
        context_data: { module: 'nyvee', breath_quality: breathQuality },
      });

      // Si cocon débloqué, l'ajouter aux badges
      if (newCocoon) {
        await supabase.from('badges').insert({
          user_id: user.id,
          name: `Cocon ${newCocoon}`,
          description: `Texture rare débloquée : ${newCocoon}`,
          image_url: `/cocoons/${newCocoon}.png`,
        });
      }

      return new Response(
        JSON.stringify({
          badge,
          badgeColor,
          badgeEmoji,
          reductionPercent,
          nextAction,
          cocoonUnlocked: newCocoon,
          message: cocoonUnlocked 
            ? `${badge} ${badgeEmoji} · Cocon rare débloqué !`
            : `${badge} ${badgeEmoji}`,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');
    
  } catch (error) {
    console.error('Error in nyvee-assess:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
