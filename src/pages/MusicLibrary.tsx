import { useEffect, useState } from 'react';
import { useMusicGeneration } from '@/hooks/useMusicGeneration';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Music, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MusicLibrary() {
  const [library, setLibrary] = useState<any[]>([]);
  const [quota, setQuota] = useState({ generated_count: 0, quota_limit: 10 });
  const [emotion, setEmotion] = useState('calm');
  const [duration, setDuration] = useState(60);
  const [style, setStyle] = useState('ambient');
  const { isGenerating, generateMusic, getLibrary, getQuota } = useMusicGeneration();
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [songs, quotaData] = await Promise.all([getLibrary(), getQuota()]);
    setLibrary(songs);
    setQuota(quotaData);
  };

  const handleGenerate = async () => {
    const result = await generateMusic(emotion, duration, style);
    if (result) {
      await loadData();
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">Bibliothèque Musicale</h1>
        <p className="text-muted-foreground">
          Générez et écoutez votre musique thérapeutique personnalisée
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Générer une nouvelle piste
          </CardTitle>
          <CardDescription>
            Quota ce mois-ci: {quota.generated_count} / {quota.quota_limit}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Émotion</label>
              <Select value={emotion} onValueChange={setEmotion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anxious">Anxieux</SelectItem>
                  <SelectItem value="calm">Calme</SelectItem>
                  <SelectItem value="energized">Énergisé</SelectItem>
                  <SelectItem value="sad">Triste</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Durée</label>
              <Select value={duration.toString()} onValueChange={(v) => setDuration(Number(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 secondes</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                  <SelectItem value="120">2 minutes</SelectItem>
                  <SelectItem value="180">3 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Style</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="binaural">Binaural</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || quota.generated_count >= quota.quota_limit}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Music className="w-4 h-4 mr-2" />
                Générer la musique
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Ma bibliothèque</h2>
        {library.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucune musique générée pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {library.map((song) => (
              <MusicPlayer
                key={song.id}
                audioUrl={song.audio_url}
                title={`${song.emotion_input} - ${song.style}`}
                metadata={song.metadata}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
