// Production Monitoring & Error Tracking
import { supabase } from "@/integrations/supabase/client";

interface ErrorLog {
  message: string;
  stack?: string;
  component?: string;
  userId?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

class MonitoringService {
  private static instance: MonitoringService;
  private errorQueue: ErrorLog[] = [];
  private metricsQueue: PerformanceMetric[] = [];
  private flushInterval: number = 30000; // 30 seconds

  private constructor() {
    this.startFlushInterval();
    this.setupGlobalErrorHandler();
  }

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private setupGlobalErrorHandler() {
    // Capture unhandled errors
    window.addEventListener('error', (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        severity: 'high',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        severity: 'high',
      });
    });
  }

  logError(error: ErrorLog) {
    console.error('[Monitoring]', error);
    this.errorQueue.push({
      ...error,
      userId: error.userId || this.getCurrentUserId(),
    });

    // Immediate flush for critical errors
    if (error.severity === 'critical') {
      this.flush();
    }
  }

  trackPerformance(metric: PerformanceMetric) {
    this.metricsQueue.push(metric);
  }

  private async flush() {
    if (this.errorQueue.length === 0 && this.metricsQueue.length === 0) {
      return;
    }

    const errors = [...this.errorQueue];
    const metrics = [...this.metricsQueue];
    
    this.errorQueue = [];
    this.metricsQueue = [];

    try {
      // Log errors to Supabase
      if (errors.length > 0) {
        await supabase.from('error_logs').insert(
          errors.map(err => ({
            error_message: err.message,
            error_stack: err.stack,
            component: err.component,
            user_id: err.userId,
            severity: err.severity,
            metadata: err.metadata,
            created_at: new Date().toISOString(),
          }))
        );
      }

      // Log performance metrics
      if (metrics.length > 0) {
        await supabase.from('performance_metrics').insert(
          metrics.map(metric => ({
            metric_name: metric.name,
            metric_value: metric.value,
            metric_unit: metric.unit,
            metric_type: 'performance',
            session_id: crypto.randomUUID(),
            timestamp: new Date(metric.timestamp).toISOString(),
          }))
        );
      }
    } catch (error) {
      console.error('[Monitoring] Failed to flush logs:', error);
    }
  }

  private startFlushInterval() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private getCurrentUserId(): string | undefined {
    // Return undefined for now, will be set by caller if needed
    return undefined;
  }

  // Performance monitoring utilities
  measurePageLoad() {
    if (typeof window !== 'undefined' && window.performance) {
      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
      
      this.trackPerformance({
        name: 'page_load',
        value: pageLoadTime,
        unit: 'ms',
        timestamp: Date.now(),
      });
    }
  }

  measureAPICall(endpoint: string, duration: number, success: boolean) {
    this.trackPerformance({
      name: `api_${success ? 'success' : 'error'}_${endpoint}`,
      value: duration,
      unit: 'ms',
      timestamp: Date.now(),
    });
  }
}

export const monitoring = MonitoringService.getInstance();

// React Error Boundary helper
export const logComponentError = (error: Error, errorInfo: React.ErrorInfo, componentName: string) => {
  monitoring.logError({
    message: error.message,
    stack: error.stack,
    component: componentName,
    severity: 'high',
    metadata: {
      componentStack: errorInfo.componentStack,
    },
  });
};
