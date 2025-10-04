import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Share2, Download, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareProgressProps {
  moduleName: string;
  level: number;
  totalXP: number;
  unlockedItemsCount: number;
}

export const ShareProgress = ({ moduleName, level, totalXP, unlockedItemsCount }: ShareProgressProps) => {
  const { toast } = useToast();

  const handleShare = async (platform: 'twitter' | 'linkedin') => {
    const text = `🎉 Niveau ${level} atteint dans ${moduleName}! ${totalXP} XP gagnés et ${unlockedItemsCount} items débloqués sur EmotionsCare!`;
    const url = window.location.origin;

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    
    toast({
      title: 'Partage ouvert',
      description: 'Fenêtre de partage ouverte!',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Partager ma progression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <h4 className="font-bold text-lg">Niveau {level}</h4>
              <p className="text-sm text-muted-foreground">{moduleName}</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <span>{totalXP} XP</span>
            <span>•</span>
            <span>{unlockedItemsCount} items</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => handleShare('twitter')} variant="outline" className="flex-1">
            Twitter
          </Button>
          <Button onClick={() => handleShare('linkedin')} variant="outline" className="flex-1">
            LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
