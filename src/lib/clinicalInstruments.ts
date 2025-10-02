// Clinical Instruments Library - Additional Instruments
export type InstrumentCode = 
  | 'WHO5' | 'STAI6' | 'STAI_Trait' | 'SAM' | 'POMS' 
  | 'POMS_TensionFatigue' | 'POMS_Vigor' | 'AAQII' | 'PANAS' 
  | 'PANAS_PA' | 'SSQ' | 'SUDS' | 'ISI' | 'PSS10' 
  | 'GritBRS' | 'GAS' | 'GEW' | 'UCLA3' | 'MSPSS' 
  | 'SCS' | 'SWEMWBS' | 'WEMWBS' | 'CBI' | 'UWES'
  | 'GAD7' | 'PHQ9' | 'PCL5' | 'DERS' | 'FFMQ'
  | 'MAAS' | 'SOCS' | 'RSES';

interface QuestionItem {
  id: string;
  text: string;
  reverseScore?: boolean;
}

interface InstrumentDefinition {
  code: InstrumentCode;
  name: string;
  description: string;
  questions: QuestionItem[];
  scoringRules: {
    min: number;
    max: number;
    interpretation: Record<string, string>;
  };
}

// GAD-7: Generalized Anxiety Disorder 7-item scale
export const GAD7: InstrumentDefinition = {
  code: 'GAD7',
  name: 'GAD-7 - Échelle d\'Anxiété Généralisée',
  description: 'Mesure la sévérité des symptômes d\'anxiété généralisée',
  questions: [
    { id: 'gad7_1', text: 'Se sentir nerveux(se), anxieux(se) ou très tendu(e)' },
    { id: 'gad7_2', text: 'Ne pas être capable d\'arrêter de s\'inquiéter ou de contrôler ses inquiétudes' },
    { id: 'gad7_3', text: 'S\'inquiéter de trop de choses différentes' },
    { id: 'gad7_4', text: 'Avoir du mal à se détendre' },
    { id: 'gad7_5', text: 'Être si agité(e) qu\'il est difficile de tenir en place' },
    { id: 'gad7_6', text: 'Devenir facilement contrarié(e) ou irritable' },
    { id: 'gad7_7', text: 'Se sentir effrayé(e) comme si quelque chose d\'horrible allait arriver' },
  ],
  scoringRules: {
    min: 0,
    max: 21,
    interpretation: {
      '0-4': 'Anxiété minimale',
      '5-9': 'Anxiété légère',
      '10-14': 'Anxiété modérée',
      '15-21': 'Anxiété sévère',
    },
  },
};

// PHQ-9: Patient Health Questionnaire-9
export const PHQ9: InstrumentDefinition = {
  code: 'PHQ9',
  name: 'PHQ-9 - Questionnaire de Santé du Patient',
  description: 'Évalue la sévérité de la dépression',
  questions: [
    { id: 'phq9_1', text: 'Peu d\'intérêt ou de plaisir à faire les choses' },
    { id: 'phq9_2', text: 'Se sentir triste, déprimé(e) ou désespéré(e)' },
    { id: 'phq9_3', text: 'Difficulté à s\'endormir, sommeil interrompu ou dormir trop' },
    { id: 'phq9_4', text: 'Se sentir fatigué(e) ou avoir peu d\'énergie' },
    { id: 'phq9_5', text: 'Peu d\'appétit ou manger trop' },
    { id: 'phq9_6', text: 'Avoir une mauvaise opinion de soi ou se sentir nul(le)' },
    { id: 'phq9_7', text: 'Difficultés de concentration' },
    { id: 'phq9_8', text: 'Bouger ou parler lentement, ou être agité(e)' },
    { id: 'phq9_9', text: 'Penser qu\'il vaudrait mieux être mort(e)' },
  ],
  scoringRules: {
    min: 0,
    max: 27,
    interpretation: {
      '0-4': 'Dépression minimale',
      '5-9': 'Dépression légère',
      '10-14': 'Dépression modérée',
      '15-19': 'Dépression modérément sévère',
      '20-27': 'Dépression sévère',
    },
  },
};

// PCL-5: PTSD Checklist for DSM-5
export const PCL5: InstrumentDefinition = {
  code: 'PCL5',
  name: 'PCL-5 - Liste de Vérification PTSD',
  description: 'Évalue les symptômes de stress post-traumatique',
  questions: [
    { id: 'pcl5_1', text: 'Souvenirs répétés et perturbants de l\'expérience stressante' },
    { id: 'pcl5_2', text: 'Rêves répétés et perturbants de l\'expérience stressante' },
    { id: 'pcl5_3', text: 'Revivre soudainement l\'expérience stressante' },
    { id: 'pcl5_4', text: 'Se sentir très contrarié(e) quand quelque chose rappelle l\'expérience' },
    { id: 'pcl5_5', text: 'Réactions physiques intenses face aux rappels' },
    { id: 'pcl5_6', text: 'Éviter les souvenirs, pensées ou sentiments liés à l\'expérience' },
    { id: 'pcl5_7', text: 'Éviter les rappels externes de l\'expérience' },
    { id: 'pcl5_8', text: 'Difficulté à se souvenir de parties importantes de l\'expérience' },
    { id: 'pcl5_9', text: 'Croyances négatives fortes sur soi, les autres ou le monde' },
    { id: 'pcl5_10', text: 'Se blâmer soi-même ou blâmer les autres pour l\'expérience' },
  ],
  scoringRules: {
    min: 0,
    max: 80,
    interpretation: {
      '0-30': 'Symptômes PTSD minimes',
      '31-40': 'Symptômes PTSD légers',
      '41-50': 'Symptômes PTSD modérés',
      '51-80': 'Symptômes PTSD sévères',
    },
  },
};

// DERS: Difficulties in Emotion Regulation Scale (short version)
export const DERS: InstrumentDefinition = {
  code: 'DERS',
  name: 'DERS - Échelle de Difficultés de Régulation Émotionnelle',
  description: 'Évalue les difficultés dans la régulation émotionnelle',
  questions: [
    { id: 'ders_1', text: 'Je suis clair(e) sur ce que je ressens' },
    { id: 'ders_2', text: 'Je prête attention à mes sentiments' },
    { id: 'ders_3', text: 'Je vis mes émotions comme écrasantes et incontrôlables' },
    { id: 'ders_4', text: 'Je n\'ai aucune idée de ce que je ressens' },
    { id: 'ders_5', text: 'J\'ai du mal à comprendre mes sentiments' },
    { id: 'ders_6', text: 'Quand je suis contrarié(e), j\'accepte mes émotions', reverseScore: true },
    { id: 'ders_7', text: 'Quand je suis contrarié(e), je deviens en colère contre moi' },
    { id: 'ders_8', text: 'Quand je suis contrarié(e), je crois que je resterai ainsi longtemps' },
  ],
  scoringRules: {
    min: 8,
    max: 40,
    interpretation: {
      '8-15': 'Régulation émotionnelle efficace',
      '16-24': 'Difficultés légères de régulation',
      '25-32': 'Difficultés modérées de régulation',
      '33-40': 'Difficultés importantes de régulation',
    },
  },
};

// FFMQ: Five Facet Mindfulness Questionnaire (short version)
export const FFMQ: InstrumentDefinition = {
  code: 'FFMQ',
  name: 'FFMQ - Questionnaire de Pleine Conscience',
  description: 'Mesure cinq facettes de la pleine conscience',
  questions: [
    { id: 'ffmq_1', text: 'Je perçois mes sentiments et émotions sans y réagir' },
    { id: 'ffmq_2', text: 'Je fais attention aux sensations comme le vent dans mes cheveux' },
    { id: 'ffmq_3', text: 'J\'ai du mal à rester concentré(e) sur le présent', reverseScore: true },
    { id: 'ffmq_4', text: 'Je remarque des sons comme les oiseaux qui chantent' },
    { id: 'ffmq_5', text: 'Je me juge pour mes émotions', reverseScore: true },
    { id: 'ffmq_6', text: 'Je peux facilement mettre des mots sur mes expériences' },
    { id: 'ffmq_7', text: 'Je fais les activités en pilote automatique', reverseScore: true },
    { id: 'ffmq_8', text: 'Je dis à moi-même que je ne devrais pas ressentir ce que je ressens', reverseScore: true },
  ],
  scoringRules: {
    min: 8,
    max: 40,
    interpretation: {
      '8-15': 'Faible niveau de pleine conscience',
      '16-24': 'Niveau modéré de pleine conscience',
      '25-32': 'Bon niveau de pleine conscience',
      '33-40': 'Excellent niveau de pleine conscience',
    },
  },
};

// MAAS: Mindful Attention Awareness Scale (short)
export const MAAS: InstrumentDefinition = {
  code: 'MAAS',
  name: 'MAAS - Échelle d\'Attention et de Conscience',
  description: 'Mesure l\'attention et la conscience dans la vie quotidienne',
  questions: [
    { id: 'maas_1', text: 'Je casse ou renverse des choses par négligence', reverseScore: true },
    { id: 'maas_2', text: 'J\'ai du mal à rester concentré(e) sur le présent', reverseScore: true },
    { id: 'maas_3', text: 'Je me retrouve à faire les choses sans y prêter attention', reverseScore: true },
    { id: 'maas_4', text: 'Je mange automatiquement sans vraiment savoir ce que je mange', reverseScore: true },
    { id: 'maas_5', text: 'Mon esprit s\'égare et je ne fais pas attention à ce que je fais', reverseScore: true },
    { id: 'maas_6', text: 'J\'oublie le nom d\'une personne presque aussitôt après l\'avoir entendu', reverseScore: true },
  ],
  scoringRules: {
    min: 6,
    max: 36,
    interpretation: {
      '6-14': 'Faible attention consciente',
      '15-22': 'Attention consciente modérée',
      '23-29': 'Bonne attention consciente',
      '30-36': 'Excellente attention consciente',
    },
  },
};

export const CLINICAL_INSTRUMENTS: Record<InstrumentCode, InstrumentDefinition | null> = {
  WHO5: null, // Already implemented
  STAI6: null,
  STAI_Trait: null,
  SAM: null,
  POMS: null,
  POMS_TensionFatigue: null,
  POMS_Vigor: null,
  AAQII: null,
  PANAS: null,
  PANAS_PA: null,
  SSQ: null,
  SUDS: null,
  ISI: null,
  PSS10: null,
  GritBRS: null,
  GAS: null,
  GEW: null,
  UCLA3: null,
  MSPSS: null,
  SCS: null,
  SWEMWBS: null,
  WEMWBS: null,
  CBI: null,
  UWES: null,
  GAD7,
  PHQ9,
  PCL5,
  DERS,
  FFMQ,
  MAAS,
  SOCS: null,
  RSES: null,
};

export const getInstrument = (code: InstrumentCode): InstrumentDefinition | null => {
  return CLINICAL_INSTRUMENTS[code];
};

export const calculateScore = (
  instrument: InstrumentDefinition,
  answers: Record<string, number>
): number => {
  let total = 0;
  
  instrument.questions.forEach((question) => {
    const answer = answers[question.id] || 0;
    if (question.reverseScore) {
      const maxScore = instrument.scoringRules.max / instrument.questions.length;
      total += maxScore - answer;
    } else {
      total += answer;
    }
  });

  return total;
};

export const getInterpretation = (
  instrument: InstrumentDefinition,
  score: number
): string => {
  for (const [range, interpretation] of Object.entries(instrument.scoringRules.interpretation)) {
    const [min, max] = range.split('-').map(Number);
    if (score >= min && score <= max) {
      return interpretation;
    }
  }
  return 'Score non interprété';
};
