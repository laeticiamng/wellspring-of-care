import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSocialFeed, SocialPost } from '@/hooks/useSocialFeed';
import { Heart, MessageCircle, Send, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export function CommunityFeed() {
  const { posts, loading, createPost, toggleReaction, fetchComments, addComment } = useSocialFeed();
  const [newPostContent, setNewPostContent] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, any[]>>({});
  const [commentText, setCommentText] = useState('');

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    await createPost(newPostContent, 'general', false, []);
    setNewPostContent('');
  };

  const handleToggleComments = async (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
    } else {
      setExpandedPost(postId);
      const postComments = await fetchComments(postId);
      setComments(prev => ({ ...prev, [postId]: postComments }));
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    await addComment(postId, commentText);
    setCommentText('');
    const postComments = await fetchComments(postId);
    setComments(prev => ({ ...prev, [postId]: postComments }));
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-500';
      case 'support': return 'bg-blue-500';
      case 'question': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="container mx-auto py-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Partager avec la communauté
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Partagez vos pensées, vos progrès ou demandez du soutien..."
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            rows={3}
          />
          <Button onClick={handleCreatePost} className="w-full">
            <Send className="mr-2 h-4 w-4" />
            Publier
          </Button>
        </CardContent>
      </Card>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post: SocialPost) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={post.profiles?.avatar_url} />
                    <AvatarFallback>
                      {post.is_anonymous ? '?' : post.profiles?.full_name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">
                      {post.is_anonymous ? 'Anonyme' : post.profiles?.full_name || 'Utilisateur'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { 
                        addSuffix: true,
                        locale: fr 
                      })}
                    </p>
                  </div>
                </div>
                <Badge className={getPostTypeColor(post.post_type)}>
                  {post.post_type}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-foreground">{post.content}</p>

              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReaction(post.id)}
                  className="gap-2"
                >
                  <Heart className="h-4 w-4" />
                  {post.likes_count}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleComments(post.id)}
                  className="gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  {post.comments_count}
                </Button>
              </div>

              {/* Comments Section */}
              {expandedPost === post.id && (
                <div className="space-y-3 pt-4 border-t">
                  {comments[post.id]?.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.profiles?.avatar_url} />
                        <AvatarFallback>
                          {comment.is_anonymous ? '?' : comment.profiles?.full_name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {comment.is_anonymous ? 'Anonyme' : comment.profiles?.full_name || 'Utilisateur'}
                        </p>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-2 pt-2">
                    <Textarea
                      placeholder="Ajouter un commentaire..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      rows={2}
                      className="flex-1"
                    />
                    <Button onClick={() => handleAddComment(post.id)} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {posts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun post pour le moment</h3>
              <p className="text-muted-foreground">
                Soyez le premier à partager avec la communauté !
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
