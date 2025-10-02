import { useEffect } from 'react';
import { monitoring } from '@/lib/monitoring';
import { alertSystem } from '@/lib/alerts';

export const useMonitoring = () => {
  useEffect(() => {
    // Measure initial page load
    monitoring.measurePageLoad();

    // Track route changes for performance
    const handleRouteChange = () => {
      monitoring.trackPerformance({
        name: 'route_change',
        value: performance.now(),
        unit: 'ms',
        timestamp: Date.now(),
      });
    };

    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const trackAPICall = async <T,>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await apiCall();
      const duration = performance.now() - startTime;
      
      monitoring.measureAPICall(endpoint, duration, true);
      
      // Check for slow responses
      await alertSystem.checkRules({ endpoint, duration });
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      monitoring.measureAPICall(endpoint, duration, false);
      monitoring.logError({
        message: `API call failed: ${endpoint}`,
        severity: 'high',
        metadata: { endpoint, error },
      });
      
      throw error;
    }
  };

  const logError = (error: Error, component?: string) => {
    monitoring.logError({
      message: error.message,
      stack: error.stack,
      component,
      severity: 'medium',
    });
  };

  return {
    trackAPICall,
    logError,
    monitoring,
    alertSystem,
  };
};
