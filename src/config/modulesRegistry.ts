import type { InstrumentCode } from '@/types/assessment';

export interface ModuleConfig {
  id: number;
  slug: string;
  route: string;
  instrument?: InstrumentCode;
  uses: {
    openai?: string[];
    suno?: string[];
    hume?: string[];
  };
  triggers: {
    start?: 'weekly' | 'post' | 'pre' | 'instant' | 'monthly' | 'on_demand';
    submit: 'end' | 'checkpoint';
  };
  hints?: Record<string, any>;
}

export const MODULES_REGISTRY: ModuleConfig[] = [
  {
    id: 1,
    slug: 'dashboard',
    route: '/app/home',
    instrument: 'WHO5',
    uses: { openai: ['badge', 'micro-copy'], suno: [], hume: ['tone-baseline'] },
    triggers: { start: 'weekly', submit: 'end' },
  },
  {
    id: 2,
    slug: 'nyvee',
    route: '/app/nyvee',
    instrument: 'STAI6',
    uses: { openai: ['nudges', 'badge'], suno: ['ambient_soft'], hume: ['voice-stress', 'arousal'] },
    triggers: { start: 'pre', submit: 'end' },
    hints: { fallback: '5-4-3-2-1' },
  },
  {
    id: 3,
    slug: 'scan',
    route: '/app/scan',
    instrument: 'SAM',
    uses: { openai: ['labels'], suno: [], hume: ['face-valence', 'voice-arousal'] },
    triggers: { start: 'instant', submit: 'end' },
  },
  {
    id: 4,
    slug: 'music',
    route: '/app/music',
    instrument: 'POMS',
    uses: { openai: ['badge', 'titles'], suno: ['calm_low', 'ambient_soft'], hume: ['arousal-trend'] },
    triggers: { start: 'pre', submit: 'end' },
  },
  {
    id: 5,
    slug: 'coach',
    route: '/app/coach',
    instrument: 'AAQII',
    uses: { openai: ['micro-haikus'], suno: [], hume: ['prosody-hints'] },
    triggers: { start: 'weekly', submit: 'end' },
  },
  {
    id: 6,
    slug: 'journal',
    route: '/app/journal',
    instrument: 'PANAS',
    uses: { openai: ['badge', 'suggestions'], suno: ['ambient_soft'], hume: ['text-affect', 'voice-affect'] },
    triggers: { start: 'on_demand', submit: 'end' },
  },
  {
    id: 7,
    slug: 'vr-breath',
    route: '/app/vr-breath',
    instrument: 'SSQ',
    uses: { openai: ['badge'], suno: ['space_pad'], hume: ['voice-breath'] },
    triggers: { start: 'post', submit: 'end' },
  },
  {
    id: 8,
    slug: 'vr-galaxy',
    route: '/app/vr-galaxy',
    instrument: 'POMS',
    uses: { openai: ['badge', 'legend'], suno: ['space_pad'], hume: ['tension'] },
    triggers: { start: 'post', submit: 'end' },
  },
  {
    id: 9,
    slug: 'flash-glow',
    route: '/app/flash-glow',
    instrument: 'SUDS',
    uses: { openai: ['badge'], suno: ['retro_jingle'], hume: ['stress-trend'] },
    triggers: { start: 'pre', submit: 'end' },
  },
  {
    id: 10,
    slug: 'breath',
    route: '/app/breath',
    instrument: 'STAI6',
    uses: { openai: ['badge'], suno: ['sleep_drone', 'ambient_soft'], hume: ['breath-tempo'] },
    triggers: { start: 'on_demand', submit: 'end' },
    hints: { weeklyInstrument: 'ISI' },
  },
  {
    id: 11,
    slug: 'face-ar',
    route: '/app/face-ar',
    instrument: 'PANAS_PA',
    uses: { openai: ['mantras', 'badge'], suno: ['jingles'], hume: ['face-smile-valence'] },
    triggers: { start: 'on_demand', submit: 'end' },
  },
  {
    id: 12,
    slug: 'bubble-beat',
    route: '/app/bubble-beat',
    instrument: 'PSS10',
    uses: { openai: ['badge'], suno: ['retro_jingle'], hume: ['stress'] },
    triggers: { start: 'weekly', submit: 'end' },
  },
  {
    id: 13,
    slug: 'boss-grit',
    route: '/app/boss-grit',
    instrument: 'GritBRS',
    uses: { openai: ['challenge-text', 'badge'], suno: ['stings'], hume: ['energy-guard'] },
    triggers: { start: 'monthly', submit: 'end' },
  },
  {
    id: 14,
    slug: 'mood-mixer',
    route: '/app/mood-mixer',
    instrument: 'SAM',
    uses: { openai: ['names', 'badge'], suno: ['live-mix'], hume: ['arousal-guard'] },
    triggers: { start: 'instant', submit: 'end' },
  },
  {
    id: 15,
    slug: 'community',
    route: '/app/community',
    instrument: 'UCLA3',
    uses: { openai: ['empathy-replies'], suno: ['ambient_soft'], hume: ['sentiment-post'] },
    triggers: { start: 'monthly', submit: 'end' },
    hints: { also: 'MSPSS' },
  },
  {
    id: 16,
    slug: 'leaderboard',
    route: '/app/leaderboard',
    instrument: 'WHO5',
    uses: { openai: ['badge'], suno: ['space_pad'], hume: [] },
    triggers: { start: 'weekly', submit: 'end' },
  },
  {
    id: 17,
    slug: 'ambition-arcade',
    route: '/app/ambition-arcade',
    instrument: 'GAS',
    uses: { openai: ['goal->lever', 'badge'], suno: ['retro_jingle'], hume: ['engagement-signal'] },
    triggers: { start: 'weekly', submit: 'end' },
  },
  {
    id: 18,
    slug: 'story-synth',
    route: '/app/story-synth',
    instrument: 'POMS_TensionFatigue',
    uses: { openai: ['narration', 'badge'], suno: ['act-textures'], hume: ['fatigue-guard', 'prosody'] },
    triggers: { start: 'pre', submit: 'end' },
  },
  {
    id: 19,
    slug: 'activity',
    route: '/app/activity',
    instrument: 'WHO5',
    uses: { openai: ['3-helps'], suno: ['stings'], hume: ['cohort-trend'] },
    triggers: { start: 'weekly', submit: 'end' },
  },
  {
    id: 20,
    slug: 'weekly-bars',
    route: '/app/weekly-bars',
    instrument: 'WHO5',
    uses: { openai: ['bars-copy'], suno: [], hume: [] },
    triggers: { start: 'weekly', submit: 'end' },
  },
  {
    id: 21,
    slug: 'heatmap-vibes',
    route: '/app/rh',
    instrument: 'SWEMWBS',
    uses: { openai: ['phrases', 'actions'], suno: [], hume: ['macro-trend'] },
    triggers: { start: 'monthly', submit: 'end' },
    hints: { also: ['CBI', 'UWES'], min_n: 5 },
  },
  {
    id: 22,
    slug: 'screen-silk',
    route: '/app/screen-silk',
    instrument: 'CVSQ',
    uses: { openai: ['micro-guidance', 'badge'], suno: ['ambient_soft'], hume: ['strain-guard'] },
    triggers: { start: 'monthly', submit: 'end' },
  },
];

// Helper to get module config by slug or route
export function getModuleConfig(slugOrRoute: string): ModuleConfig | undefined {
  return MODULES_REGISTRY.find(
    (m) => m.slug === slugOrRoute || m.route === slugOrRoute
  );
}

// Helper to get all modules using a specific API
export function getModulesUsingAPI(api: 'openai' | 'suno' | 'hume'): ModuleConfig[] {
  return MODULES_REGISTRY.filter((m) => m.uses[api] && m.uses[api]!.length > 0);
}
