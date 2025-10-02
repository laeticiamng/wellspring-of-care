import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SocialPost {
  id: string;
  author_id: string;
  content: string;
  title?: string;
  group_id?: string;
  mood_halo?: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface SocialComment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  is_empathy_template?: boolean;
  created_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export function useSocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch community posts
  const fetchPosts = async (groupId?: string) => {
    try {
      let query = supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les posts',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new post
  const createPost = async (
    title: string,
    content: string,
    groupId?: string
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('community_posts')
        .insert({
          author_id: user.id,
          title,
          content,
          group_id: groupId || null,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Succès',
        description: 'Post publié avec succès',
      });

      await fetchPosts();
      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de publier le post',
        variant: 'destructive',
      });
    }
  };

  // Toggle like on a post (increment/decrement likes_count)
  const toggleReaction = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // For now, just increment the count
      // TODO: Add proper reaction tracking table
      const post = posts.find(p => p.id === postId);
      if (post) {
        const { error } = await supabase
          .from('community_posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId);

        if (error) throw error;
        await fetchPosts();
      }
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string): Promise<SocialComment[]> => {
    try {
      const { data, error } = await supabase
        .from('community_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  // Add a comment to a post
  const addComment = async (
    postId: string,
    content: string,
    isEmpathy: boolean = false
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('community_comments')
        .insert({
          post_id: postId,
          author_id: user.id,
          content,
          is_empathy_template: isEmpathy,
        });

      if (error) throw error;

      // Update comment count
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from('community_posts')
          .update({ comments_count: post.comments_count + 1 })
          .eq('id', postId);
      }

      toast({
        title: 'Succès',
        description: 'Commentaire ajouté',
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le commentaire',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    fetchPosts,
    createPost,
    toggleReaction,
    fetchComments,
    addComment,
  };
}
