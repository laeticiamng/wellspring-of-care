import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'user_b2c' | 'user_b2b' | 'manager_b2b' | 'admin';

interface UserProfile {
  id: string;
  role: UserRole;
  org_id: string | null;
  team_id: string | null;
}

export function useUserRole() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, org_id, team_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as UserProfile;
    },
  });

  const isB2BManager = profile?.role === 'manager_b2b' || profile?.role === 'admin';

  return {
    profile,
    role: profile?.role || 'user_b2c',
    isB2C: profile?.role === 'user_b2c',
    isB2BEmployee: profile?.role === 'user_b2b',
    isB2BManager,
    isManager: isB2BManager, // Alias for convenience
    isAdmin: profile?.role === 'admin',
    orgId: profile?.org_id || null,
    teamId: profile?.team_id || null,
    isLoading,
  };
}