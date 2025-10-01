import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImplicitData {
  dwellTime?: number;
  interactionCount?: number;
  cardDrawChoice?: boolean;
  emotionalState?: number;
}

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

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Non authentifié');
    }

    const { implicitData }: { implicitData: ImplicitData } = await req.json();

    console.log('Données implicites reçues:', implicitData);

    // Calculer le score WHO-5 implicite
    let who5Score = 50; // Score neutre par défaut
    
    // Ajuster selon le temps passé (dwell time)
    if (implicitData.dwellTime) {
      if (implicitData.dwellTime > 180) { // Plus de 3 min = engagement positif
        who5Score += 15;
      } else if (implicitData.dwellTime < 30) { // Moins de 30s = potentiel détresse
        who5Score -= 15;
      }
    }

    // Ajuster selon les interactions
    if (implicitData.interactionCount) {
      if (implicitData.interactionCount > 5) {
        who5Score += 10;
      } else if (implicitData.interactionCount === 0) {
        who5Score -= 10;
      }
    }

    // Ajuster selon le tirage de carte
    if (implicitData.cardDrawChoice === true) {
      who5Score += 5; // Proactif = positif
    }

    // Normaliser le score entre 0-100
    who5Score = Math.max(0, Math.min(100, who5Score));

    console.log('Score WHO-5 calculé:', who5Score);

    // Enregistrer l'évaluation WHO-5
    const { error: insertError } = await supabaseClient
      .from('who5_assessments')
      .insert({
        user_id: user.id,
        score: who5Score,
        responses: implicitData,
        is_implicit: true,
      });

    if (insertError) {
      console.error('Erreur insertion WHO-5:', insertError);
    }

    // Déterminer le niveau émotionnel
    let emotionalLevel: 'low' | 'moderate' | 'high';
    if (who5Score < 40) {
      emotionalLevel = 'low';
    } else if (who5Score < 70) {
      emotionalLevel = 'moderate';
    } else {
      emotionalLevel = 'high';
    }

    // Récupérer toutes les cartes disponibles
    const { data: allCards, error: cardsError } = await supabaseClient
      .from('emotion_cards')
      .select('*');

    if (cardsError) throw cardsError;

    // Logique de recommandation basée sur le niveau émotionnel
    let recommendedCard;
    
    if (emotionalLevel === 'low') {
      // Privilégier les cartes apaisantes et réconfortantes
      recommendedCard = allCards?.find(c => 
        ['douceur', 'paix', 'espoir'].includes(c.code)
      ) || allCards?.[0];
    } else if (emotionalLevel === 'moderate') {
      // Équilibre et croissance
      recommendedCard = allCards?.find(c => 
        ['equilibre', 'force', 'joie'].includes(c.code)
      ) || allCards?.[1];
    } else {
      // Célébration et expansion
      recommendedCard = allCards?.find(c => 
        ['gratitude', 'lumiere', 'energie'].includes(c.code)
      ) || allCards?.[2];
    }

    // Message personnalisé
    const personalizedMessage = getPersonalizedMessage(emotionalLevel, who5Score);

    return new Response(
      JSON.stringify({
        who5Score,
        emotionalLevel,
        recommendedCard,
        personalizedMessage,
        insights: {
          dwellTimeAnalysis: implicitData.dwellTime ? 
            `Temps passé: ${implicitData.dwellTime}s` : null,
          interactionAnalysis: implicitData.interactionCount ?
            `${implicitData.interactionCount} interactions` : null,
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Erreur calculate-who5-card:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

function getPersonalizedMessage(level: string, score: number): string {
  if (level === 'low') {
    return "Je sens que tu traverses un moment délicat. Cette carte est là pour t'accompagner avec douceur. 🌙";
  } else if (level === 'moderate') {
    return `Tu es sur un bon chemin (${score}/100). Continue à prendre soin de toi, une étape à la fois. 🌱`;
  } else {
    return `Tu rayonnes aujourd'hui (${score}/100) ! Cette carte va amplifier ton énergie positive. ✨`;
  }
}
