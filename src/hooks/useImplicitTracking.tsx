import { useEffect, useCallback } from 'react';
import { trackImplicitAssess, forceFlushImplicitAssess } from '@/lib/implicitAssess';

export function useImplicitTracking() {
  // Flush on unmount
  useEffect(() => {
    return () => {
      forceFlushImplicitAssess();
    };
  }, []);

  const track = useCallback((signal: {
    instrument: string;
    item_id: string;
    proxy: string;
    value: string | number;
    weight?: number;
    context?: Record<string, string>;
  }) => {
    trackImplicitAssess(signal);
  }, []);

  return { track };
}
