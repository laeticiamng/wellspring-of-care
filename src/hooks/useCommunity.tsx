import { useState, useEffect } from 'react';
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
  likes_count: number;
  created_at: string;
}

export const useCommunity = () => {
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchGroups();
    fetchPosts();
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

  const createPost = async (title: string, content: string, groupId?: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour publier');
      return;
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

      toast.success('Publication créée !');
      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const joinGroup = async (groupId: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour rejoindre un groupe');
      return;
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

      toast.success('Vous avez rejoint le groupe !');
      await fetchGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      toast.error('Erreur lors de l\'inscription');
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) {
      toast.error('Vous devez être connecté pour commenter');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
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

      toast.success('Commentaire ajouté !');
      await fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Erreur lors de l\'ajout du commentaire');
    }
  };

  return {
    groups,
    posts,
    loading,
    createPost,
    joinGroup,
    addComment,
    refetchGroups: fetchGroups,
    refetchPosts: fetchPosts,
  };
};
