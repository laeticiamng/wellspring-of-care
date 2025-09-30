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
import { useState, useEffect } from "react";
import { useMoodEntries } from "@/hooks/useMoodEntries";
import { useToast } from "@/hooks/use-toast";

const Journal = () => {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [journalText, setJournalText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { entries, loading, createEntry } = useMoodEntries();
  const { toast } = useToast();
  
  const moodOptions = [
    { emoji: "😊", name: "Joyeux", color: "bg-gradient-secondary", value: "happy" },
    { emoji: "😌", name: "Calme", color: "bg-gradient-primary", value: "calm" },
    { emoji: "😔", name: "Triste", color: "bg-muted", value: "sad" },
    { emoji: "😰", name: "Anxieux", color: "bg-destructive/20", value: "anxious" },
    { emoji: "😡", name: "Colère", color: "bg-destructive", value: "angry" },
    { emoji: "😴", name: "Fatigué", color: "bg-muted-foreground/20", value: "tired" },
  ];

  const handleSave = async () => {
    if (!selectedMood || !journalText) {
      toast({
        title: "Attention",
        description: "Veuillez sélectionner une humeur et écrire votre journal",
        variant: "destructive"
      });
      return;
    }

    const moodLevel = moodOptions.findIndex(m => m.value === selectedMood) + 1;
    await createEntry(moodLevel, selectedTags, journalText);
    
    setSelectedMood("");
    setJournalText("");
    setSelectedTags([]);
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
    mood: moodOptions[entry.mood_level - 1]?.emoji || "😊",
    title: entry.emotions.join(", ") || "Entrée de journal",
    excerpt: entry.notes || "",
    tags: entry.emotions
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

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <span>Mon Journal Émotionnel</span>
            </h1>
            <p className="text-muted-foreground">
              Explorez et comprenez vos émotions au quotidien
            </p>
          </div>
          
          <Button className="bg-gradient-primary text-primary-foreground border-0 shadow-glow">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle entrée
          </Button>
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
                        onClick={() => setSelectedMood(mood.value)}
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
          </div>
        </div>
      </main>
    </div>
  );
};

export default Journal;