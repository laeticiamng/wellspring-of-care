import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SupportGroup {
  id: string;
  name: string;
  description: string;
  group_type: string;
  is_private: boolean;
  created_by: string;
  member_count: number;
  created_at: string;
  is_member?: boolean;
}

export function useSupportGroups() {
  const [groups, setGroups] = useState<SupportGroup[]>([]);
  const [myGroups, setMyGroups] = useState<SupportGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all available groups
  const fetchGroups = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('support_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Check membership for each group
      if (user) {
        const { data: memberships } = await supabase
          .from('group_memberships')
          .select('group_id')
          .eq('user_id', user.id);

        const memberGroupIds = new Set(memberships?.map(m => m.group_id) || []);
        
        const groupsWithMembership = (data || []).map(group => ({
          ...group,
          is_member: memberGroupIds.has(group.id),
        }));

        setGroups(groupsWithMembership);
        setMyGroups(groupsWithMembership.filter(g => g.is_member));
      } else {
        setGroups(data || []);
      }
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les groupes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new support group
  const createGroup = async (
    name: string,
    description: string,
    groupType: string,
    isPrivate: boolean = false
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('support_groups')
        .insert({
          name,
          description,
          group_type: groupType,
          is_private: isPrivate,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      // Auto-join the creator to the group
      await supabase
        .from('group_memberships')
        .insert({
          group_id: data.id,
          user_id: user.id,
          role: 'admin',
        });

      toast({
        title: 'Succès',
        description: 'Groupe créé avec succès',
      });

      await fetchGroups();
      return data;
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le groupe',
        variant: 'destructive',
      });
    }
  };

  // Join a support group
  const joinGroup = async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('group_memberships')
        .insert({
          group_id: groupId,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Vous avez rejoint le groupe',
      });

      await fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de rejoindre le groupe',
        variant: 'destructive',
      });
    }
  };

  // Leave a support group
  const leaveGroup = async (groupId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('group_memberships')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Vous avez quitté le groupe',
      });

      await fetchGroups();
    } catch (error) {
      console.error('Error leaving group:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de quitter le groupe',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    myGroups,
    loading,
    fetchGroups,
    createGroup,
    joinGroup,
    leaveGroup,
  };
}
