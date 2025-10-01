import type { OpenAIBadgeParams, OpenAITextParams } from '@/types/assessment';

export class OpenAIAdapter {
  private fallbackBadges: Record<string, string> = {
    soft: 'Calme retrouvé 🌊',
    warm: 'Bien joué 🌟',
    neutral: 'Continue comme ça',
  };

  constructor(private apiKey?: string) {}

  async badgeVerbal(params: OpenAIBadgeParams, signals: Record<string, unknown>): Promise<string> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured, using fallback badge');
      return this.fallbackBadges[params.tone] || 'Belle énergie ✨';
    }

    try {
      const prompt = this.buildBadgePrompt(params, signals);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Tu génères des badges émotionnels courts (≤6 mots). Ton: ${params.tone}. Langue: ${params.locale}. JAMAIS de diagnostic, JAMAIS de chiffres. Doux, poétique, encourageant.`,
            },
            { role: 'user', content: prompt },
          ],
          max_tokens: 30,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || this.fallbackBadges[params.tone];
    } catch (error) {
      console.error('OpenAI badge error:', error);
      return this.fallbackBadges[params.tone];
    }
  }

  async microCopy(params: OpenAITextParams): Promise<string> {
    if (!this.apiKey) {
      return 'Respirer 2 min ?';
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: params.sys || 'Génère une micro-phrase courte et douce.' },
            { role: 'user', content: params.prompt },
          ],
          max_tokens: params.maxTokens || 20,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content?.trim() || 'Prends ton temps';
    } catch (error) {
      console.error('OpenAI microCopy error:', error);
      return 'Prends ton temps';
    }
  }

  async empathyReplies(locale: string, topic: string): Promise<string[]> {
    const fallbacks = ['Je te lis 🤍', 'Je suis là', 'Respirons 10 s ?'];
    
    if (!this.apiKey) {
      return fallbacks;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Génère 3 micro-réponses empathiques (≤8 mots chacune) pour un topic émotionnel. Langue: ${locale}. Ton: chaleureux, non-jugeant.`,
            },
            { role: 'user', content: `Topic: ${topic}` },
          ],
          max_tokens: 60,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content?.trim() || '';
      const replies = text.split('\n').filter((l: string) => l.trim()).slice(0, 3);
      
      return replies.length === 3 ? replies : fallbacks;
    } catch (error) {
      console.error('OpenAI empathyReplies error:', error);
      return fallbacks;
    }
  }

  private buildBadgePrompt(params: OpenAIBadgeParams, signals: Record<string, unknown>): string {
    const signalsStr = Object.entries(signals)
      .map(([k, v]) => `${k}: ${typeof v === 'number' ? v.toFixed(2) : v}`)
      .join(', ');
    return `Génère un badge émotionnel court basé sur: ${signalsStr}. Contexte: ${JSON.stringify(params.context || {})}`;
  }
}
