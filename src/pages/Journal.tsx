import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  PenTool, 
  Heart, 
  Smile, 
  Frown, 
  Meh,
  Calendar,
  TrendingUp,
  Plus,
  BookOpen,
  Star
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useToast } from "@/hooks/use-toast";
import { useImplicitTracking } from "@/hooks/useImplicitTracking";
import { useCollections } from "@/hooks/useCollections";

const Journal = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [journalText, setJournalText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { entries, loading, saveEntry } = useMoodEntries();
  const { toast } = useToast();
  const { track } = useImplicitTracking();
  const { collections, unlockItem } = useCollections();
  const [audioRecording, setAudioRecording] = useState(false);
  const audioStartTime = useRef<number>(0);
  const [userLevel, setUserLevel] = useState(1);
  const [totalXP, setTotalXP] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [unlockedChapters, setUnlockedChapters] = useState<string[]>([]);
  
  const chapters = [
    { id: 'ch1', name: '📖 Chapitre 1: L\'Éveil', unlockLevel: 1, xp: 50 },
    { id: 'ch2', name: '✨ Chapitre 2: La Clarté', unlockLevel: 3, xp: 100 },
    { id: 'ch3', name: '🌈 Chapitre 3: Les Couleurs', unlockLevel: 5, xp: 150 },
    { id: 'ch4', name: '💫 Chapitre 4: La Transformation', unlockLevel: 8, xp: 200 },
    { id: 'ch5', name: '🌟 Chapitre 5: L\'Illumination', unlockLevel: 12, xp: 300 },
  ];

  const moodOptions = [
    { emoji: "😊", name: "Joyeux", color: "bg-gradient-secondary", value: "happy", xp: 50 },
    { emoji: "😌", name: "Calme", color: "bg-gradient-primary", value: "calm", xp: 50 },
    { emoji: "😔", name: "Triste", color: "bg-muted", value: "sad", xp: 60 },
    { emoji: "😰", name: "Anxieux", color: "bg-destructive/20", value: "anxious", xp: 70 },
    { emoji: "😡", name: "Colère", color: "bg-destructive", value: "angry", xp: 70 },
    { emoji: "😴", name: "Fatigué", color: "bg-muted-foreground/20", value: "tired", xp: 50 },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('journal_progress');
    if (saved) {
      const { level, xp, entries: count, chapters: unlocked } = JSON.parse(saved);
      setUserLevel(level || 1);
      setTotalXP(xp || 0);
      setTotalEntries(count || 0);
      setUnlockedChapters(unlocked || []);
    }
  }, []);

  const handleSave = async () => {
    if (!selectedMood || !journalText) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner une humeur et écrire votre journal",
        variant: "destructive"
      });
      return;
    }

    await saveEntry(journalText);
    
    // Calculate XP gain
    const selectedMoodOption = moodOptions.find(m => m.value === selectedMood);
    const baseXP = selectedMoodOption?.xp || 50;
    const lengthBonus = Math.floor(journalText.length / 100) * 10;
    const tagsBonus = selectedTags.length * 5;
    const totalXPGain = baseXP + lengthBonus + tagsBonus;
    
    const newXP = totalXP + totalXPGain;
    const newLevel = Math.floor(newXP / 500) + 1;
    const newEntryCount = totalEntries + 1;
    const leveledUp = newLevel > userLevel;

    // Check for chapter unlocks
    const newUnlocks = chapters.filter(ch => 
      ch.unlockLevel <= newLevel && !unlockedChapters.includes(ch.id)
    ).map(ch => ch.id);

    if (leveledUp) {
      setUserLevel(newLevel);
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
      
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    }

    if (newUnlocks.length > 0) {
      setUnlockedChapters([...unlockedChapters, ...newUnlocks]);
      toast({
        title: "📖 Nouveau chapitre débloqué!",
        description: chapters.find(ch => ch.id === newUnlocks[0])?.name,
      });
    }

    setTotalXP(newXP);
    setTotalEntries(newEntryCount);

    localStorage.setItem('journal_progress', JSON.stringify({
      level: newLevel,
      xp: newXP,
      entries: newEntryCount,
      chapters: [...unlockedChapters, ...newUnlocks]
    }));
    
    // Track journal completion with PANAS proxy
    const hasPositiveMood = ['happy', 'calm'].includes(selectedMood);
    track({
      instrument: "PANAS",
      item_id: hasPositiveMood ? "pa_calm" : "na_mark",
      proxy: "duration",
      value: journalText.length * 10,
      context: { mood: selectedMood, tags: selectedTags.join(','), xp: String(totalXPGain) }
    });
    
    // Unlock pages collection
    const entriesCount = entries.length + 1;
    if (entriesCount >= 3 && collections.pages?.items[0]) {
      unlockItem('pages', collections.pages.items[0].id);
    }

    toast({
      title: "Page sauvegardée! 📝",
      description: `+${totalXPGain} XP`,
    });
    
    setSelectedMood("");
    setJournalText("");
    setSelectedTags([]);
  };
  
  const handleAudioNote = () => {
    if (!audioRecording) {
      audioStartTime.current = Date.now();
      setAudioRecording(true);
    } else {
      const duration = Date.now() - audioStartTime.current;
      track({
        instrument: "PANAS",
        item_id: "pa_calm",
        proxy: "duration",
        value: duration,
        context: { type: "voice" }
      });
      setAudioRecording(false);
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
    if (date.toDateString() === yesterday.toDateString()) return "Hier";
    return date.toLocaleDateString('fr-FR');
  };

  const recentEntries = entries.map(entry => ({
    date: formatDate(entry.created_at),
    time: new Date(entry.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    mood: selectedMood ? moodOptions.find(m => m.value === selectedMood)?.emoji : "😊",
    title: entry.tags?.slice(0, 2).join(", ") || "Entrée de journal",
    excerpt: entry.content.substring(0, 100) + "...",
    tags: entry.tags || []
  })).slice(0, 5);

  const oldRecentEntries = [
    {
      date: "Aujourd'hui",
      time: "14:30",
      mood: "😊",
      title: "Journée productive",
      excerpt: "J'ai réussi à terminer tous mes projets et je me sens accompli...",
      tags: ["Travail", "Accomplissement"]
    },
    {
      date: "Hier",
      time: "19:45",
      mood: "😌",
      title: "Soirée méditation",
      excerpt: "Une belle séance de méditation m'a aidé à me détendre après une journée chargée...",
      tags: ["Méditation", "Détente"]
    },
    {
      date: "Avant-hier",
      time: "12:15",
      mood: "😰",
      title: "Stress au travail",
      excerpt: "Présentation importante aujourd'hui, je ressens de l'anxiété mais je sais que ça va bien se passer...",
      tags: ["Travail", "Anxiété", "Défi"]
    }
  ];

  const xpToNextLevel = (userLevel * 500) - totalXP;
  const progressPercent = (totalXP % 500) / 5;

  return (
    <div className="min-h-screen bg-gradient-calm relative">
      <Header />
      
      {/* Level up animation */}
      {showLevelUp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
          <Card className="max-w-md bg-gradient-primary border-primary/50 shadow-glow animate-scale-in">
            <div className="p-8 text-center space-y-4">
              <div className="text-6xl animate-bounce">📖</div>
              <h2 className="text-4xl font-bold">Niveau {userLevel}!</h2>
              <p className="text-muted-foreground">Nouveau chapitre à explorer</p>
            </div>
          </Card>
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <BookOpen className="h-12 w-12 text-primary animate-float" />
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  La Bibliothèque des Émotions
                </h1>
                <div className="px-3 py-1 bg-primary/20 rounded-full">
                  <span className="text-sm font-bold text-primary">Niv.{userLevel}</span>
                </div>
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{totalEntries} entrées</span>
                  <span className="text-primary">{totalXP} XP ({xpToNextLevel} vers niv.{userLevel + 1})</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-primary transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des pages colorées volent autour de vous. Chaque mot devient une page brillante dans votre livre vivant.
          </p>
          <div className="flex justify-center space-x-2">
            {['📖', '✨', '🌈', '💫'].map((emoji, i) => (
              <span key={i} className="text-2xl animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                {emoji}
              </span>
            ))}
          </div>
          
          {/* Chapitres débloqués */}
          <div className="flex justify-center gap-2 flex-wrap mt-4">
            {chapters.map(chapter => (
              <div
                key={chapter.id}
                className={`px-4 py-2 rounded-full text-sm ${
                  unlockedChapters.includes(chapter.id)
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : userLevel >= chapter.unlockLevel
                    ? 'bg-accent/20 text-accent border border-accent/40 animate-pulse'
                    : 'bg-muted/50 text-muted-foreground opacity-50'
                }`}
              >
                {chapter.name}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - New Entry */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PenTool className="h-5 w-5 text-primary" />
                  <span>Comment vous sentez-vous aujourd'hui ?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Selector */}
                <div className="space-y-3">
                  <h3 className="font-medium">Sélectionnez votre humeur</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => {
                          setSelectedMood(mood.value);
                          track({
                            instrument: "PANAS",
                            item_id: "pa_theme",
                            proxy: "choice",
                            value: mood.value
                          });
                        }}
                        className={`p-4 rounded-lg border transition-all hover:scale-105 ${
                          selectedMood === mood.value 
                            ? `${mood.color} border-primary shadow-glow` 
                            : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <div className="text-center space-y-1">
                          <div className="text-2xl">{mood.emoji}</div>
                          <p className="text-xs font-medium">{mood.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Journal Text Area */}
                <div className="space-y-3">
                  <h3 className="font-medium">Racontez votre journée</h3>
                  <Textarea 
                    placeholder="Décrivez vos émotions, vos pensées, ce qui vous a marqué aujourd'hui..."
                    className="min-h-[200px] resize-none border-border/50 focus:border-primary"
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                  />
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <h3 className="font-medium">Tags (optionnel)</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Travail", "Famille", "Amis", "Sport", "Méditation", "Stress", "Joie", "Accomplissement"].map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className={`cursor-pointer transition-colors ${
                          selectedTags.includes(tag) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-primary hover:text-primary-foreground'
                        }`}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3 pt-4">
                  <Button 
                    className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                    onClick={handleSave}
                    disabled={!selectedMood || !journalText}
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleAudioNote}
                    className={audioRecording ? "border-primary" : ""}
                  >
                    {audioRecording ? "⏹️ Arrêter" : "🎤 Note vocale"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedMood("");
                      setJournalText("");
                      setSelectedTags([]);
                    }}
                  >
                    Réinitialiser
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Entries */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Entrées récentes</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <p className="text-center text-muted-foreground">Chargement...</p>
                ) : recentEntries.length === 0 ? (
                  <p className="text-center text-muted-foreground">Aucune entrée pour le moment</p>
                ) : null}
                {recentEntries.map((entry, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/50 hover:border-primary/20 transition-colors group">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl group-hover:scale-110 transition-transform">
                        {entry.mood}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{entry.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            {entry.date} • {entry.time}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mood Statistics */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Analyse émotionnelle</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">87%</div>
                  <p className="text-sm text-muted-foreground">Bien-être moyen</p>
                  <Badge className="bg-gradient-secondary text-secondary-foreground">
                    Tendance positive
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {[
                    { mood: "😊", name: "Joie", percentage: 45 },
                    { mood: "😌", name: "Calme", percentage: 30 },
                    { mood: "😰", name: "Stress", percentage: 15 },
                    { mood: "😔", name: "Tristesse", percentage: 10 },
                  ].map((stat, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{stat.mood}</span>
                        <span className="text-sm">{stat.name}</span>
                      </div>
                      <span className="text-sm font-medium">{stat.percentage}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Streak Counter */}
            <Card className="border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
              <CardContent className="p-6 text-center space-y-3">
                <Star className="h-12 w-12 text-accent mx-auto" />
                <div>
                  <div className="text-3xl font-bold text-accent">15</div>
                  <p className="text-sm text-muted-foreground">jours consécutifs</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Continuez ainsi ! L'écriture quotidienne améliore votre bien-être.
                </p>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle className="text-lg">💡 Conseil du jour</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Essayez d'écrire pendant au moins 5 minutes. L'expression de vos émotions 
                  aide à mieux les comprendre et les gérer.
                </p>
              </CardContent>
            </Card>
            
            {/* Pages Collection */}
            {collections.pages && collections.pages.unlockedCount > 0 && (
              <Card className="border-0 shadow-soft bg-gradient-primary/10 border border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm">📖 Pages brillantes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {collections.pages.items.filter(item => item.unlocked).map(item => (
                    <div key={item.id} className="flex items-center space-x-2 text-sm">
                      <span className="text-lg">{item.emoji}</span>
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                  <div className="text-xs text-center text-primary mt-2">
                    {collections.pages.unlockedCount}/{collections.pages.totalItems} pages débloquées
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journal;