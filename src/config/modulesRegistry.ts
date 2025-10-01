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
    uses: { openai: ['weekly-insights', 'badge', 'micro-copy'], suno: [], hume: ['tone-baseline'] },
    triggers: { start: 'weekly', submit: 'end' },
    hints: { identity: 'central-hub', visual: 'garden-ecosystem' },
  },
  {
    id: 2,
    slug: 'nyvee',
    route: '/app/nyvee',
    instrument: 'STAI6',
    uses: { openai: ['ai-companion', 'empathy-nudges'], suno: ['binaural_calm'], hume: ['voice-stress', 'micro-tremor'] },
    triggers: { start: 'pre', submit: 'end' },
    hints: { identity: 'ai-soothing-friend', visual: 'floating-orb', fallback: '5-4-3-2-1-grounding' },
  },
  {
    id: 3,
    slug: 'scan',
    route: '/app/scan',
    instrument: 'SAM',
    uses: { openai: ['instant-labels'], suno: [], hume: ['face-valence', 'voice-pitch'] },
    triggers: { start: 'instant', submit: 'end' },
    hints: { identity: 'emotion-snapshot', visual: 'camera-flash', duration: '30s' },
  },
  {
    id: 4,
    slug: 'music',
    route: '/app/music',
    instrument: 'POMS',
    uses: { openai: ['playlist-curation', 'badge'], suno: ['adaptive_therapy'], hume: ['arousal-curve'] },
    triggers: { start: 'pre', submit: 'end' },
    hints: { identity: 'sonic-healer', visual: 'waveform-ocean', subscales: 6 },
  },
  {
    id: 5,
    slug: 'coach',
    route: '/app/coach',
    instrument: 'AAQII',
    uses: { openai: ['acceptance-haikus', 'action-prompts'], suno: [], hume: ['commitment-tone'] },
    triggers: { start: 'weekly', submit: 'end' },
    hints: { identity: 'zen-acceptance-coach', visual: 'bamboo-scroll', framework: 'ACT' },
  },
  {
    id: 6,
    slug: 'journal',
    route: '/app/journal',
    instrument: 'PANAS',
    uses: { openai: ['affect-insights', 'prompt-suggestions'], suno: ['paper_rustle'], hume: ['text-sentiment', 'writing-flow'] },
    triggers: { start: 'on_demand', submit: 'end' },
    hints: { identity: 'emotional-diary', visual: 'ink-bloom', dual: 'PA+NA' },
  },
  {
    id: 7,
    slug: 'vr-breath',
    route: '/app/vr-breath',
    instrument: 'SSQ',
    uses: { openai: ['comfort-badge'], suno: ['spatial_ambient'], hume: ['nausea-signals'] },
    triggers: { start: 'post', submit: 'end' },
    hints: { identity: 'vr-safety-check', visual: 'void-recovery', post_vr: true },
  },
  {
    id: 8,
    slug: 'vr-galaxy',
    route: '/app/vr-galaxy',
    instrument: 'POMS_Vigor',
    uses: { openai: ['energy-constellation', 'legend'], suno: ['cosmic_pulse'], hume: ['vitality-detect'] },
    triggers: { start: 'post', submit: 'end' },
    hints: { identity: 'cosmic-energizer', visual: 'star-forge', focus: 'vigor-fatigue' },
  },
  {
    id: 9,
    slug: 'flash-glow',
    route: '/app/flash-glow',
    instrument: 'SUDS',
    uses: { openai: ['distress-scale-badge'], suno: ['quick_sting'], hume: ['anxiety-spike'] },
    triggers: { start: 'pre', submit: 'end' },
    hints: { identity: 'instant-distress-meter', visual: 'lightning-bolt', range: '0-100' },
  },
  {
    id: 10,
    slug: 'breath',
    route: '/app/breath',
    instrument: 'STAI_Trait',
    uses: { openai: ['trait-insight'], suno: ['breath_guide', 'ocean_waves'], hume: ['breath-coherence'] },
    triggers: { start: 'on_demand', submit: 'end' },
    hints: { identity: 'breath-sanctuary', visual: 'expanding-sphere', weeklyInstrument: 'ISI', trait_vs_state: true },
  },
  {
    id: 11,
    slug: 'face-ar',
    route: '/app/face-ar',
    instrument: 'PANAS_PA',
    uses: { openai: ['joy-mantras', 'smile-badge'], suno: ['uplifting_jingles'], hume: ['face-smile-intensity'] },
    triggers: { start: 'on_demand', submit: 'end' },
    hints: { identity: 'joy-mirror', visual: 'emoji-masks', positive_only: true },
  },
  {
    id: 12,
    slug: 'bubble-beat',
    route: '/app/bubble-beat',
    instrument: 'PSS10',
    uses: { openai: ['stress-release-badge'], suno: ['pop_rhythm'], hume: ['tension-rhythm'] },
    triggers: { start: 'weekly', submit: 'end' },
    hints: { identity: 'stress-popper', visual: 'bubble-explosion', gamified: true },
  },
  {
    id: 13,
    slug: 'boss-grit',
    route: '/app/boss-grit',
    instrument: 'GritBRS',
    uses: { openai: ['resilience-challenge', 'boss-dialogue'], suno: ['epic_stings'], hume: ['determination-voice'] },
    triggers: { start: 'monthly', submit: 'end' },
    hints: { identity: 'resilience-arena', visual: 'boss-battle', progressive: true },
  },
  {
    id: 14,
    slug: 'mood-mixer',
    route: '/app/mood-mixer',
    instrument: 'GEW',
    uses: { openai: ['emotion-blend-names', 'dj-badge'], suno: ['live-synth'], hume: ['emotion-complexity'] },
    triggers: { start: 'instant', submit: 'end' },
    hints: { identity: 'emotion-dj', visual: 'turntable-lab', wheel: '20-emotions', creative: true },
  },
  {
    id: 15,
    slug: 'community',
    route: '/app/community',
    instrument: 'UCLA3',
    uses: { openai: ['empathy-replies', 'connection-prompts'], suno: ['warm_pad'], hume: ['isolation-detect'] },
    triggers: { start: 'monthly', submit: 'end' },
    hints: { identity: 'empathy-village', visual: 'connection-web', also: 'MSPSS', social: true },
  },
  {
    id: 16,
    slug: 'leaderboard',
    route: '/app/leaderboard',
    instrument: 'SCS',
    uses: { openai: ['rank-motivation', 'house-lore'], suno: ['victory_fanfare'], hume: ['competition-tone'] },
    triggers: { start: 'weekly', submit: 'end' },
    hints: { identity: 'friendly-competition', visual: 'house-podium', social_comparison: true },
  },
  {
    id: 17,
    slug: 'ambition-arcade',
    route: '/app/ambition-arcade',
    instrument: 'GAS',
    uses: { openai: ['goal-lever-mapping', 'achievement-badge'], suno: ['retro_coins'], hume: ['motivation-signal'] },
    triggers: { start: 'weekly', submit: 'end' },
    hints: { identity: 'goal-machine', visual: 'arcade-cabinet', scaling: '0-100', gamified: true },
  },
  {
    id: 18,
    slug: 'story-synth',
    route: '/app/story-synth',
    instrument: 'POMS_TensionFatigue',
    uses: { openai: ['narrative-generation', 'soundscape-badge'], suno: ['story-textures', 'cinematic'], hume: ['fatigue-voice', 'story-engagement'] },
    triggers: { start: 'pre', submit: 'end' },
    hints: { identity: 'emotional-theatre', visual: 'stage-curtain', immersive: true, subscales: 2 },
  },
  {
    id: 19,
    slug: 'activity',
    route: '/app/activity',
    instrument: 'ThreeGoodThings',
    uses: { openai: ['gratitude-prompts', 'helps-3'], suno: ['gentle_bells'], hume: ['appreciation-tone'] },
    triggers: { start: 'weekly', submit: 'end' },
    hints: { identity: 'gratitude-ritual', visual: 'treasure-chest', positive_psych: true },
  },
  {
    id: 20,
    slug: 'weekly-bars',
    route: '/app/weekly-bars',
    instrument: 'WeeklyReflection',
    uses: { openai: ['week-narrative', 'bar-insights'], suno: [], hume: ['week-sentiment'] },
    triggers: { start: 'weekly', submit: 'end' },
    hints: { identity: 'week-storyteller', visual: 'bar-chart-story', retrospective: true },
  },
  {
    id: 21,
    slug: 'heatmap-vibes',
    route: '/app/rh',
    instrument: 'SWEMWBS',
    uses: { openai: ['team-phrases', 'manager-actions'], suno: [], hume: ['collective-mood'] },
    triggers: { start: 'monthly', submit: 'end' },
    hints: { identity: 'team-pulse-map', visual: 'thermal-grid', also: ['CBI', 'UWES'], min_n: 5, b2b: true },
  },
  {
    id: 22,
    slug: 'screen-silk',
    route: '/app/screen-silk',
    instrument: 'CVSQ',
    uses: { openai: ['eye-care-tips', 'silk-badge'], suno: ['soft_chime'], hume: ['screen-strain'] },
    triggers: { start: 'monthly', submit: 'end' },
    hints: { identity: 'digital-wellness', visual: 'silk-filter', preventive: true },
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
