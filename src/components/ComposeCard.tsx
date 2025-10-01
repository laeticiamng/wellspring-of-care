import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { EmpathyChips } from './EmpathyChips';
import { EmpathyTemplate } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';

interface ComposeCardProps {
  empathyTemplates: EmpathyTemplate[];
  onPost: (content: string) => Promise<boolean>;
}

export const ComposeCard = ({ empathyTemplates, onPost }: ComposeCardProps) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handleEmpathySelect = (text: string) => {
    setContent(text);
  };

  const handlePost = async () => {
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    const success = await onPost(content);
    if (success) {
      setContent('');
    }
    setIsPosting(false);
  };

  const charCount = content.length;
  const maxChars = 280;

  if (!user) {
    return (
      <Card className="p-6 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-sm border-primary/20">
        <p className="text-center text-muted-foreground">
          Connecte-toi pour rejoindre le Village 🏘️
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-background/95 to-secondary/30 backdrop-blur-sm border-primary/20">
        <div className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
            placeholder="Une pensée en 1 phrase ?"
            className="min-h-[80px] resize-none bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
            maxLength={maxChars}
          />

          <div className="flex items-center justify-between">
            <span className={`text-sm ${charCount > maxChars * 0.9 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {charCount}/{maxChars}
            </span>
          </div>

          {empathyTemplates.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Réponses empathiques :</p>
              <EmpathyChips
                templates={empathyTemplates}
                onSelect={handleEmpathySelect}
                selectedText={content}
              />
            </div>
          )}

          <Button
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4 mr-2" />
            {isPosting ? 'Envoi...' : 'Allumer une lumière'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
