// Alert System for Critical Events
import { supabase } from "@/integrations/supabase/client";

export type AlertSeverity = 'info' | 'warning' | 'error' | 'critical';
export type AlertCategory = 'security' | 'performance' | 'data' | 'user' | 'system';

interface Alert {
  title: string;
  message: string;
  severity: AlertSeverity;
  category: AlertCategory;
  metadata?: Record<string, any>;
  userId?: string;
}

interface AlertRule {
  id: string;
  condition: (data: any) => boolean;
  action: (data: any) => Promise<void>;
  cooldown: number; // milliseconds
  lastTriggered?: number;
}

class AlertSystem {
  private static instance: AlertSystem;
  private rules: Map<string, AlertRule> = new Map();

  private constructor() {
    this.initializeDefaultRules();
  }

  static getInstance(): AlertSystem {
    if (!AlertSystem.instance) {
      AlertSystem.instance = new AlertSystem();
    }
    return AlertSystem.instance;
  }

  private initializeDefaultRules() {
    // High error rate detection
    this.registerRule({
      id: 'high_error_rate',
      condition: (data) => data.errorCount > 10,
      action: async (data) => {
        await this.sendAlert({
          title: 'High Error Rate Detected',
          message: `${data.errorCount} errors in the last minute`,
          severity: 'critical',
          category: 'system',
          metadata: { errorCount: data.errorCount },
        });
      },
      cooldown: 300000, // 5 minutes
    });

    // Slow API response detection
    this.registerRule({
      id: 'slow_api_response',
      condition: (data) => data.duration > 5000,
      action: async (data) => {
        await this.sendAlert({
          title: 'Slow API Response',
          message: `API call took ${data.duration}ms`,
          severity: 'warning',
          category: 'performance',
          metadata: { endpoint: data.endpoint, duration: data.duration },
        });
      },
      cooldown: 60000, // 1 minute
    });

    // Failed authentication attempts
    this.registerRule({
      id: 'failed_auth_attempts',
      condition: (data) => data.failedAttempts > 5,
      action: async (data) => {
        await this.sendAlert({
          title: 'Multiple Failed Login Attempts',
          message: `${data.failedAttempts} failed attempts detected`,
          severity: 'error',
          category: 'security',
          metadata: { userId: data.userId, attempts: data.failedAttempts },
        });
      },
      cooldown: 600000, // 10 minutes
    });

    // Database connection issues
    this.registerRule({
      id: 'db_connection_error',
      condition: (data) => data.error?.message?.includes('connection'),
      action: async (data) => {
        await this.sendAlert({
          title: 'Database Connection Issue',
          message: 'Unable to connect to database',
          severity: 'critical',
          category: 'system',
          metadata: { error: data.error },
        });
      },
      cooldown: 120000, // 2 minutes
    });
  }

  registerRule(rule: AlertRule) {
    this.rules.set(rule.id, rule);
  }

  async checkRules(data: any) {
    for (const [id, rule] of this.rules.entries()) {
      try {
        const now = Date.now();
        const canTrigger = !rule.lastTriggered || (now - rule.lastTriggered) > rule.cooldown;

        if (canTrigger && rule.condition(data)) {
          rule.lastTriggered = now;
          await rule.action(data);
        }
      } catch (error) {
        console.error(`[Alert] Error checking rule ${id}:`, error);
      }
    }
  }

  async sendAlert(alert: Alert) {
    console.warn('[Alert]', alert);

    try {
      // Store alert in database (cast to any to bypass TS type generation issue)
      const { error } = await (supabase as any).from('system_alerts').insert({
        title: alert.title,
        message: alert.message,
        severity: alert.severity,
        category: alert.category,
        metadata: alert.metadata,
        user_id: alert.userId,
        created_at: new Date().toISOString(),
        resolved: false,
      });

      if (error) {
        console.error('[Alert] Failed to store alert:', error);
      }

      // For critical alerts, could integrate with external services
      if (alert.severity === 'critical') {
        this.notifyCriticalAlert(alert);
      }
    } catch (error) {
      console.error('[Alert] Failed to send alert:', error);
    }
  }

  private notifyCriticalAlert(alert: Alert) {
    // Could integrate with Slack, Discord, Email, SMS, etc.
    console.error('[CRITICAL ALERT]', {
      title: alert.title,
      message: alert.message,
      timestamp: new Date().toISOString(),
    });
  }

  async getRecentAlerts(limit: number = 50): Promise<any[]> {
    const { data, error } = await (supabase as any)
      .from('system_alerts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Alert] Failed to fetch alerts:', error);
      return [];
    }

    return data || [];
  }

  async resolveAlert(alertId: string) {
    const { error } = await (supabase as any)
      .from('system_alerts')
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq('id', alertId);

    if (error) {
      console.error('[Alert] Failed to resolve alert:', error);
    }
  }
}

export const alertSystem = AlertSystem.getInstance();
