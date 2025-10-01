import { OpenAIAdapter } from '@/services/openaiAdapter';
import type { OpenAITone } from '@/types/assessment';

export function useBadgeVerbal() {
  // Read API key from environment (would be configured in .env)
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const ai = new OpenAIAdapter(apiKey);

  const makeBadge = async (
    locale: string,
    tone: OpenAITone,
    signals: Record<string, any>
  ): Promise<string> => {
    return await ai.badgeVerbal({ locale, tone, context: {} }, signals);
  };

  const makeMicroCopy = async (
    prompt: string,
    locale: string,
    sys?: string
  ): Promise<string> => {
    return await ai.microCopy({ prompt, locale, sys });
  };

  const makeEmpathyReplies = async (
    locale: string,
    topic: string
  ): Promise<string[]> => {
    return await ai.empathyReplies(locale, topic);
  };

  return {
    makeBadge,
    makeMicroCopy,
    makeEmpathyReplies,
  };
}
