import { useState } from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { EmpathyChips } from './EmpathyChips';
import { CommunityPost, EmpathyTemplate } from '@/hooks/useCommunity';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VillageFeedProps {
  posts: CommunityPost[];
  empathyTemplates: EmpathyTemplate[];
  onReply: (postId: string, content: string, isEmpathy: boolean) => Promise<boolean>;
}

export const VillageFeed = ({ posts, empathyTemplates, onReply }: VillageFeedProps) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleEmpathySelect = (text: string) => {
    setReplyContent(text);
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim() || isReplying) return;

    setIsReplying(true);
    const isEmpathyTemplate = empathyTemplates.some(t => t.text_fr === replyContent);
    const success = await onReply(postId, replyContent, isEmpathyTemplate);
    
    if (success) {
      setReplyContent('');
      setReplyingTo(null);
    }
    setIsReplying(false);
  };

  const sortedPosts = [...posts].sort((a, b) => {
    // Prioriser les posts sans réponse
    if (a.reply_count === 0 && b.reply_count! > 0) return -1;
    if (a.reply_count! > 0 && b.reply_count === 0) return 1;
    // Puis par date décroissante
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg mb-2">Le village est calme.</p>
        <p className="text-muted-foreground">Une lumière ? ✨</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {sortedPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card 
              className="p-6 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all"
              style={{
                boxShadow: post.mood_halo 
                  ? `0 0 20px ${post.mood_halo}20` 
                  : undefined
              }}
            >
              <div className="space-y-4">
                {/* Header avec halo mood */}
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border-2 border-primary/30"
                    style={{
                      borderColor: post.mood_halo || 'hsla(var(--primary), 0.3)',
                      boxShadow: post.mood_halo 
                        ? `0 0 15px ${post.mood_halo}40` 
                        : '0 0 15px hsla(var(--primary), 0.2)'
                    }}
                  >
                    <span className="text-lg">✨</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                </div>

                {/* Contenu */}
                <div className="space-y-2">
                  {post.title && (
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                  )}
                  <p className="text-foreground/90 leading-relaxed">{post.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {post.reply_count || 0}
                  </Button>
                  
                  {post.has_empathy_response && (
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <Heart className="w-4 h-4 fill-current" />
                      <span>Écoute reçue</span>
                    </div>
                  )}
                </div>

                {/* Zone de réponse */}
                <AnimatePresence>
                  {replyingTo === post.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 pt-4 border-t border-border/50"
                    >
                      <EmpathyChips
                        templates={empathyTemplates}
                        onSelect={handleEmpathySelect}
                        selectedText={replyContent}
                      />

                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Ton écoute bienveillante..."
                        className="min-h-[60px] bg-background/50 border-border/50"
                      />

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleReply(post.id)}
                          disabled={!replyContent.trim() || isReplying}
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                        >
                          {isReplying ? 'Envoi...' : 'Répondre avec douceur'}
                        </Button>
                        <Button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent('');
                          }}
                          variant="ghost"
                          size="sm"
                        >
                          Annuler
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
