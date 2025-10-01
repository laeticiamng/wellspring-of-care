import { SupabaseClient } from '@supabase/supabase-js';
import type {
  AssessStartInput,
  AssessStartOutput,
  AssessSubmitInput,
  AssessSubmitOutput,
  AssessAggregateInput,
  AssessAggregateOutput,
} from '@/types/assessment';

export class AssessClient {
  constructor(private sb: SupabaseClient) {}

  async start<TIn extends AssessStartInput = AssessStartInput, TOut extends AssessStartOutput = AssessStartOutput>(
    body: TIn
  ): Promise<{ data: TOut | null; error: Error | null }> {
    try {
      const { data, error } = await this.sb.functions.invoke<TOut>('assess-start', { body });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('AssessClient.start error:', error);
      return { data: null, error: error as Error };
    }
  }

  async submit<TIn extends AssessSubmitInput = AssessSubmitInput, TOut extends AssessSubmitOutput = AssessSubmitOutput>(
    body: TIn
  ): Promise<{ data: TOut | null; error: Error | null }> {
    try {
      const { data, error } = await this.sb.functions.invoke<TOut>('assess-submit', { body });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('AssessClient.submit error:', error);
      return { data: null, error: error as Error };
    }
  }

  async aggregate<
    TIn extends AssessAggregateInput = AssessAggregateInput,
    TOut extends AssessAggregateOutput = AssessAggregateOutput
  >(body: TIn): Promise<{ data: TOut | null; error: Error | null }> {
    try {
      const { data, error } = await this.sb.functions.invoke<TOut>('assess-aggregate', { body });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('AssessClient.aggregate error:', error);
      return { data: null, error: error as Error };
    }
  }
}
