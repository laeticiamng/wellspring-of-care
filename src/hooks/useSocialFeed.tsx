import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  media_urls: string[];
  likes_count: number;
  comments_count: number;
  is_anonymous: boolean;
  tags: string[];
  created_at: string;
  profiles?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface SocialComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  is_anonymous: boolean;
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
  const fetchPosts = async (postType?: string) => {
    try {
      let query = (supabase as any)
        .from('community_posts')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (postType) {
        query = query.eq('post_type', postType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts((data as any) || []);
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
    content: string,
    postType: string = 'general',
    isAnonymous: boolean = false,
    tags: string[] = []
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await (supabase as any)
        .from('community_posts')
        .insert({
          user_id: user.id,
          content,
          post_type: postType,
          is_anonymous: isAnonymous,
          tags,
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

  // Toggle reaction on a post
  const toggleReaction = async (postId: string, reactionType: string = 'like') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check if reaction exists
      const { data: existing } = await (supabase as any)
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        // Remove reaction
        await (supabase as any)
          .from('post_reactions')
          .delete()
          .eq('id', existing.id);
      } else {
        // Add reaction
        await (supabase as any)
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: user.id,
            reaction_type: reactionType,
          });
      }

      await fetchPosts();
    } catch (error) {
      console.error('Error toggling reaction:', error);
    }
  };

  // Fetch comments for a post
  const fetchComments = async (postId: string): Promise<SocialComment[]> => {
    try {
      const { data, error } = await (supabase as any)
        .from('post_comments')
        .select(`
          *,
          profiles:user_id (
            full_name,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data as any) || [];
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  };

  // Add a comment to a post
  const addComment = async (
    postId: string,
    content: string,
    isAnonymous: boolean = false
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await (supabase as any)
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
          is_anonymous: isAnonymous,
        });

      if (error) throw error;

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
