import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface CommunityGroup {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  member_count: number;
  is_private: boolean;
  created_by: string | null;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  group_id: string | null;
  author_id: string;
  title: string;
  content: string;
  mood_halo?: string;
  reply_count?: number;
  has_empathy_response?: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_empathy_template?: boolean;
  likes_count: number;
  created_at: string;
}

export interface HouseState {
  id: string;
  user_id: string;
  light_intensity: number;
  acts_of_care: number;
  last_activity_at: string;
}

export interface EmpathyTemplate {
  id: string;
  text_fr: string;
  text_en: string;
  emoji: string;
  category: string;
}

export const useCommunity = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [houseState, setHouseState] = useState<HouseState | null>(null);
  const [empathyTemplates, setEmpathyTemplates] = useState<EmpathyTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchGroups();
    fetchPosts();
    fetchHouseState();
    fetchEmpathyTemplates();
  }, [user]);

  const fetchGroups = async () => {
    try {
      const { data, error } = await supabase
        .from('community_groups')
        .select('*')
        .order('member_count', { ascending: false });

      if (error) throw error;
      setGroups(data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Erreur lors du chargement des groupes');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const createPost = async (title: string, content: string, groupId?: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          author_id: user.id,
          title,
          content,
          group_id: groupId || null,
        });

      if (error) throw error;

      await fetchPosts();
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      return false;
    }
  };

  const joinGroup = async (groupId: string): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('group_memberships')
        .insert({
          user_id: user.id,
          group_id: groupId,
          role: 'member',
        });

      if (error) throw error;

      await fetchGroups();
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  };

  const addComment = async (postId: string, content: string, isEmpathy = false): Promise<boolean> => {
    if (!user) {
      return false;
    }

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
          is_empathy_template: isEmpathy,
        });

      if (error) throw error;

      // Update comment count on the post
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from('community_posts')
          .update({ comments_count: post.comments_count + 1 })
          .eq('id', postId);
      }

      await fetchPosts();
      await fetchHouseState(); // Refresh house state after comment
      toast.success('Maison illuminée +2 ✨', {
        description: 'Merci pour ton écoute bienveillante',
        duration: 2000,
      });
      return true;
    } catch (error) {
      console.error('Error adding comment:', error);
      return false;
    }
  };

  const fetchHouseState = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('community_house_state')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHouseState(data);
    } catch (error) {
      console.error('Error fetching house state:', error);
    }
  }, [user]);

  const fetchEmpathyTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('empathy_templates')
        .select('*')
        .order('category');

      if (error) throw error;
      setEmpathyTemplates(data || []);
    } catch (error) {
      console.error('Error fetching empathy templates:', error);
    }
  };

  return {
    groups,
    posts,
    houseState,
    empathyTemplates,
    loading,
    createPost,
    joinGroup,
    addComment,
    refetchGroups: fetchGroups,
    refetchPosts: fetchPosts,
    refetchHouseState: fetchHouseState,
  };
};
