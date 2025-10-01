import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Bibliothèque de pensées avec système de rareté
const THOUGHT_LIBRARY = {
  defusion: {
    common: [
      { text: "Observe, laisse passer ☁️", emoji: "☁️" },
      { text: "Ce n'est qu'une pensée", emoji: "💭" },
      { text: "Reviens à ta respiration 🌬️", emoji: "🌬️" },
      { text: "Laisse flotter", emoji: "🎈" },
      { text: "Tu n'es pas tes pensées", emoji: "🦋" }
    ],
    rare: [
      { text: "L'orage passe toujours ⛈️", emoji: "⛈️" },
      { text: "Chaque vague retourne à l'océan", emoji: "🌊" },
      { text: "Le ciel accueille tous les nuages", emoji: "🌈" },
      { text: "Les feuilles tombent naturellement", emoji: "🍂" }
    ],
    legendary: [
      { text: "Dans le silence, tout s'apaise ✨", emoji: "✨" },
      { text: "L'instant présent est ton refuge 🌟", emoji: "🌟" },
      { text: "Tu es l'espace, pas le contenu 🌌", emoji: "🌌" }
    ]
  },
  acceptance: {
    common: [
      { text: "Accueille ce qui est", emoji: "🤲" },
      { text: "C'est là, et c'est ok", emoji: "💚" },
      { text: "Respire avec ce qui vient", emoji: "🫁" },
      { text: "Fais de la place", emoji: "🪷" }
    ],
    rare: [
      { text: "La résistance crée la douleur", emoji: "🌱" },
      { text: "Dans l'acceptation naît la paix", emoji: "🕊️" },
      { text: "Le lotus pousse dans la boue", emoji: "🪷" }
    ],
    legendary: [
      { text: "Tout est parfait dans l'imperfection 🌸", emoji: "🌸" },
      { text: "La vie t'enseigne en douceur 🦋", emoji: "🦋" }
    ]
  },
  presence: {
    common: [
      { text: "Ici, maintenant", emoji: "🎯" },
      { text: "Sens tes pieds au sol", emoji: "👣" },
      { text: "Écoute le silence", emoji: "🔇" },
      { text: "Reviens ici", emoji: "🧭" }
    ],
    rare: [
      { text: "Le présent est un cadeau", emoji: "🎁" },
      { text: "Là où tu es, c'est parfait", emoji: "📍" },
      { text: "Dans le maintenant, tout va bien", emoji: "⏱️" }
    ],
    legendary: [
      { text: "L'éternité vit dans l'instant 🌅", emoji: "🌅" },
      { text: "Le temps s'arrête quand tu t'arrêtes ⏸️", emoji: "⏸️" }
    ]
  },
  values: {
    common: [
      { text: "Qu'est-ce qui compte vraiment?", emoji: "❤️" },
      { text: "Dirige-toi vers ce qui t'importe", emoji: "🧭" },
      { text: "Choisis ta direction", emoji: "🎯" }
    ],
    rare: [
      { text: "Tes valeurs sont ta boussole", emoji: "🧭" },
      { text: "La cohérence libère l'âme", emoji: "🗝️" },
      { text: "Vis selon ton cœur", emoji: "💖" }
    ],
    legendary: [
      { text: "Ton chemin unique t'appelle 🌟", emoji: "🌟" },
      { text: "Dans l'alignement, tout coule 🌊", emoji: "🌊" }
    ]
  }
};

// Cartes d'ancrage selon le niveau de flexibilité
const ANCHOR_CARDS = {
  low: [
    { title: "1 min — Pensées comme nuages", duration: 60, category: "defusion" },
    { title: "2 min — Laisse flotter", duration: 120, category: "defusion" },
    { title: "1 min — Observe sans juger", duration: 60, category: "presence" },
    { title: "2 min — Respiration ancre", duration: 120, category: "presence" }
  ],
  moderate: [
    { title: "1 min — Retour au présent", duration: 60, category: "presence" },
    { title: "2 min — Accueillir l'émotion", duration: 120, category: "acceptance" },
    { title: "1 min — Espace intérieur", duration: 60, category: "defusion" }
  ],
  high: [
    { title: "1 min — Gratitude simple", duration: 60, category: "values" },
    { title: "2 min — Intention du jour", duration: 120, category: "values" },
    { title: "1 min — Connexion au cœur", duration: 60, category: "acceptance" }
  ]
};

function calculateAAQScore(responses: Record<string, number>): number {
  return Object.values(responses).reduce((sum, val) => sum + val, 0);
}

function getFlexibilityLevel(score: number): 'low' | 'moderate' | 'high' {
  if (score <= 17) return 'high'; // Haute flexibilité
  if (score <= 24) return 'moderate';
  return 'low'; // Basse flexibilité (rigidité)
}

function selectThoughts(level: 'low' | 'moderate' | 'high'): Array<{ text: string; emoji: string; rarity: string; category: string }> {
  const thoughts: Array<{ text: string; emoji: string; rarity: string; category: string }> = [];
  
  // Déterminer la catégorie prioritaire selon le niveau
  const priorityCategory = level === 'low' ? 'defusion' : level === 'moderate' ? 'presence' : 'values';
  const categoryPool = THOUGHT_LIBRARY[priorityCategory];
  
  // Système de rareté: 70% common, 25% rare, 5% legendary
  const rarityRoll = Math.random();
  let rarity: 'common' | 'rare' | 'legendary';
  
  if (rarityRoll < 0.05) {
    rarity = 'legendary';
  } else if (rarityRoll < 0.30) {
    rarity = 'rare';
  } else {
    rarity = 'common';
  }
  
  // Sélectionner 3 pensées dont une rare si disponible
  const rarityPool = categoryPool[rarity];
  if (rarityPool && rarityPool.length > 0) {
    const thought = rarityPool[Math.floor(Math.random() * rarityPool.length)];
    thoughts.push({ ...thought, rarity, category: priorityCategory });
  }
  
  // Ajouter 2 pensées communes d'autres catégories
  const otherCategories = Object.keys(THOUGHT_LIBRARY).filter(c => c !== priorityCategory);
  for (let i = 0; i < 2 && i < otherCategories.length; i++) {
    const cat = otherCategories[i];
    const commonPool = THOUGHT_LIBRARY[cat as keyof typeof THOUGHT_LIBRARY].common;
    const thought = commonPool[Math.floor(Math.random() * commonPool.length)];
    thoughts.push({ ...thought, rarity: 'common', category: cat });
  }
  
  return thoughts;
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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No auth header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);

    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { sessionId, responses, sessionDuration } = await req.json();

    if (!sessionId || !responses) {
      throw new Error('Missing sessionId or responses');
    }

    // Calculer le score AAQ-II
    const aaqScore = calculateAAQScore(responses);
    const flexibilityLevel = getFlexibilityLevel(aaqScore);
    
    // Sélectionner les pensées selon le niveau et la rareté
    const thoughts = selectThoughts(flexibilityLevel);
    
    // Sélectionner les cartes d'ancrage appropriées
    const anchorCards = ANCHOR_CARDS[flexibilityLevel];
    
    // Stocker l'assessment dans clinical_responses
    await supabaseClient
      .from('clinical_responses')
      .insert({
        user_id: user.id,
        instrument_code: 'AAQ2',
        responses,
        internal_score: aaqScore,
        internal_level: flexibilityLevel === 'high' ? 0 : flexibilityLevel === 'moderate' ? 2 : 4,
        cadence: 'weekly',
        context_data: { session_id: sessionId }
      });
    
    // Mettre à jour la session coach
    await supabaseClient
      .from('coach_sessions')
      .update({
        aaq_score: aaqScore,
        flexibility_level: flexibilityLevel,
        thoughts_shown: thoughts,
        session_duration: sessionDuration || 0,
        completed_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    // Badge verbal selon le niveau
    let badge = '';
    if (flexibilityLevel === 'low') {
      badge = 'Rigidité ↑ : renforcer défusion';
    } else if (flexibilityLevel === 'moderate') {
      badge = 'Équilibre en construction 🌿';
    } else {
      badge = 'Flexibilité en hausse 🌟';
    }

    return new Response(
      JSON.stringify({
        sessionId,
        aaqScore,
        flexibilityLevel,
        badge,
        thoughts,
        anchorCards,
        message: badge
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in coach-assess-submit:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});