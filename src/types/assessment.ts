// Assessment types for all modules
export type InstrumentCode = 
  | 'WHO5' 
  | 'STAI6' 
  | 'SAM' 
  | 'POMS' 
  | 'POMS_TensionFatigue'
  | 'AAQII' 
  | 'PANAS' 
  | 'PANAS_PA'
  | 'SSQ' 
  | 'SUDS' 
  | 'ISI' 
  | 'PSS10' 
  | 'GritBRS' 
  | 'GAS'
  | 'UCLA3' 
  | 'MSPSS' 
  | 'SWEMWBS' 
  | 'WEMWBS' 
  | 'CBI' 
  | 'UWES' 
  | 'CVSQ';

export interface AssessStartInput {
  instrument: InstrumentCode;
  locale?: string;
  context?: Record<string, any>;
}

export interface AssessStartOutput {
  session_id: string;
  instrument: InstrumentCode;
  created_at: string;
}

export interface AssessSubmitInput {
  session_id: string;
  answers?: Record<string, any>;
  duration_seconds?: number;
  metadata?: Record<string, any>;
}

export interface AssessSubmitOutput {
  badge?: string;
  hints?: string[];
  helps?: string[];
  can_show?: boolean;
  level?: number;
}

export interface AssessAggregateInput {
  instrument: InstrumentCode;
  period: 'last_week' | 'last_month' | 'custom';
  locale?: string;
  start_date?: string;
  end_date?: string;
}

export interface AssessAggregateOutput {
  verbal_week?: string[];
  helps?: string[];
  can_show?: boolean;
  summary?: string;
}

export type SunoTexture = 
  | 'ambient_soft'
  | 'calm_low'
  | 'sleep_drone'
  | 'space_pad'
  | 'retro_jingle';

export type SunoTempo = 'very_low' | 'low' | 'mid';

export interface HumeSignals {
  valence?: number;
  arousal?: number;
  tension?: number;
  fatigue?: number;
  stress?: number;
}

export type OpenAITone = 'soft' | 'warm' | 'neutral';

export interface OpenAIBadgeParams {
  tone: OpenAITone;
  locale: string;
  context?: Record<string, any>;
}

export interface OpenAITextParams {
  prompt: string;
  sys?: string;
  locale: string;
  maxTokens?: number;
}

export type AppEvent =
  | { type: 'mood.updated'; payload: { valence?: number; arousal?: number } }
  | { type: 'badge.emitted'; payload: { module: string; badge: string } }
  | { type: 'session.completed'; payload: { module: string; durationBucket: '<1' | '1-3' | '>3' } };
