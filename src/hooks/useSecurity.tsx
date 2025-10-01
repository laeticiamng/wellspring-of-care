import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserSession {
  id: string;
  user_id: string;
  ip_address: unknown;
  user_agent: string;
  session_start: string;
  session_end: string;
  is_active: boolean;
  security_flags: any;
  created_at: string;
}

interface AuditLog {
  id: string;
  user_id: string;
  event_type: string;
  event_details: any;
  ip_address: unknown;
  user_agent: string;
  created_at: string;
}

export function useSecurity() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const { toast } = useToast();

  // Fetch user sessions
  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('is_active', true)
        .order('session_start', { ascending: false });

      if (error) throw error;
      setSessions((data as any) || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  // Fetch audit logs
  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAuditLogs((data as any) || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    }
  };

  // Check 2FA status
  const check2FAStatus = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      if (error) throw error;
      
      const hasTotp = data?.totp && data.totp.length > 0;
      setIs2FAEnabled(hasTotp);
    } catch (error) {
      console.error('Error checking 2FA status:', error);
    }
  };

  // Enable 2FA
  const enable2FA = async () => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authentification à deux facteurs'
      });

      if (error) throw error;

      toast({
        title: '2FA activé',
        description: 'Scannez le QR code avec votre application d\'authentification',
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return null;
    }
  };

  // Verify 2FA code
  const verify2FACode = async (factorId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId });
      if (error) throw error;

      const challengeId = data.id;
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code,
      });

      if (verifyError) throw verifyError;

      await check2FAStatus();
      
      toast({
        title: '2FA vérifié',
        description: 'L\'authentification à deux facteurs est maintenant active',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Erreur de vérification',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Disable 2FA
  const disable2FA = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      if (error) throw error;

      await check2FAStatus();

      toast({
        title: '2FA désactivé',
        description: 'L\'authentification à deux facteurs a été désactivée',
      });

      return true;
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    }
  };

  // Revoke session
  const revokeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      if (error) throw error;

      await fetchSessions();

      toast({
        title: 'Session révoquée',
        description: 'La session a été révoquée avec succès',
      });
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        fetchSessions(),
        fetchAuditLogs(),
        check2FAStatus(),
      ]);
      setLoading(false);
    };

    init();
  }, []);

  return {
    sessions,
    auditLogs,
    loading,
    is2FAEnabled,
    enable2FA,
    verify2FACode,
    disable2FA,
    revokeSession,
    fetchSessions,
    fetchAuditLogs,
  };
}
