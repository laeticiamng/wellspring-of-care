import { supabase } from '@/integrations/supabase/client';
import { AssessClient } from '@/services/assessClient';
import type {
  AssessStartInput,
  AssessStartOutput,
  AssessSubmitInput,
  AssessSubmitOutput,
  AssessAggregateInput,
  AssessAggregateOutput,
} from '@/types/assessment';

export function useAssess() {
  const api = new AssessClient(supabase);

  const start = async <TIn extends AssessStartInput = AssessStartInput, TOut extends AssessStartOutput = AssessStartOutput>(
    body: TIn
  ) => {
    return api.start<TIn, TOut>(body);
  };

  const submit = async <
    TIn extends AssessSubmitInput = AssessSubmitInput,
    TOut extends AssessSubmitOutput = AssessSubmitOutput
  >(
    body: TIn
  ) => {
    return api.submit<TIn, TOut>(body);
  };

  const aggregate = async <
    TIn extends AssessAggregateInput = AssessAggregateInput,
    TOut extends AssessAggregateOutput = AssessAggregateOutput
  >(
    body: TIn
  ) => {
    return api.aggregate<TIn, TOut>(body);
  };

  return { start, submit, aggregate };
}
