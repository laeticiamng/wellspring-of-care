import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Brain, 
  Send, 
  Mic, 
  Paperclip,
  Heart,
  Smile,
  MessageCircle,
  Star,
  User,
  Bot
} from "lucide-react";
import { useState } from "react";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const messages = [
    {
      id: 1,
      sender: "ai",
      content: "Bonjour Sophie ! 👋 Je suis Emma, votre assistante bien-être IA. Comment vous sentez-vous aujourd'hui ?",
      timestamp: "14:30",
      type: "text"
    },
    {
      id: 2,
      sender: "user",
      content: "Salut Emma ! Je me sens un peu stressée aujourd'hui. J'ai une présentation importante demain.",
      timestamp: "14:32",
      type: "text"
    },
    {
      id: 3,
      sender: "ai",
      content: "Je comprends votre stress concernant cette présentation. C'est tout à fait normal de ressentir de l'anxiété avant un événement important. Voulez-vous qu'on explore ensemble quelques techniques pour vous aider à vous sentir plus sereine ?",
      timestamp: "14:33",
      type: "text",
      suggestions: [
        "Exercices de respiration",
        "Techniques de visualisation", 
        "Conseils de préparation"
      ]
    },
    {
      id: 4,
      sender: "user",
      content: "Oui, j'aimerais bien essayer les exercices de respiration.",
      timestamp: "14:35",
      type: "text"
    },
    {
      id: 5,
      sender: "ai",
      content: "Parfait ! Je vais vous guider dans un exercice de respiration 4-7-8, très efficace pour réduire l'anxiété. Êtes-vous dans un endroit calme où vous pouvez vous concentrer ?",
      timestamp: "14:36",
      type: "breathing_exercise",
      exerciseData: {
        name: "Respiration 4-7-8",
        steps: ["Inspirez 4 secondes", "Retenez 7 secondes", "Expirez 8 secondes"],
        duration: "3 minutes"
      }
    }
  ];

  const quickSuggestions = [
    "Comment gérer mon stress ?",
    "J'ai du mal à dormir",
    "Je me sens triste",
    "Exercice de méditation",
    "Boost de motivation",
    "Technique de relaxation"
  ];

  const aiCapabilities = [
    { icon: Heart, title: "Écoute empathique", desc: "Analyse émotionnelle avancée" },
    { icon: Brain, title: "Recommandations IA", desc: "Conseils personnalisés" },
    { icon: Smile, title: "Support 24/7", desc: "Toujours disponible pour vous" }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Info */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-4 text-center space-y-3">
                <div className="relative mx-auto w-16 h-16">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarImage src="/api/placeholder/64/64" alt="Emma AI" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
                      <Brain className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-gradient-secondary rounded-full border-2 border-background flex items-center justify-center">
                    <div className="h-2 w-2 bg-secondary-foreground rounded-full animate-pulse-soft"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold">Emma</h3>
                  <p className="text-sm text-muted-foreground">Assistante bien-être IA</p>
                  <Badge className="mt-1 bg-gradient-primary text-primary-foreground">
                    En ligne
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Capacités d'Emma</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {aiCapabilities.map((capability, index) => {
                  const Icon = capability.icon;
                  return (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{capability.title}</p>
                        <p className="text-xs text-muted-foreground">{capability.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Suggestions */}
            <Card className="border-0 shadow-soft">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Suggestions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickSuggestions.slice(0, 4).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start text-xs h-auto p-2"
                    onClick={() => setMessage(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-soft h-full flex flex-col">
              {/* Chat Header */}
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Brain className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">Conversation avec Emma</CardTitle>
                      <p className="text-sm text-muted-foreground">Votre space sécurisé de bien-être</p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-secondary text-secondary-foreground">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Privé & Confidentiel
                  </Badge>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-[80%] space-x-2 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {/* Avatar */}
                      <Avatar className="w-8 h-8">
                        {msg.sender === 'user' ? (
                          <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        ) : (
                          <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>

                      {/* Message Content */}
                      <div className={`space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                        <div className={`p-3 rounded-lg ${
                          msg.sender === 'user' 
                            ? 'bg-gradient-primary text-primary-foreground' 
                            : 'bg-muted/50 border border-border/50'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          
                          {/* Breathing Exercise */}
                          {msg.type === 'breathing_exercise' && msg.exerciseData && (
                            <div className="mt-3 p-3 bg-background/20 rounded-lg space-y-2">
                              <h4 className="font-medium text-sm">{msg.exerciseData.name}</h4>
                              <div className="space-y-1">
                                {msg.exerciseData.steps.map((step, index) => (
                                  <p key={index} className="text-xs opacity-90">• {step}</p>
                                ))}
                              </div>
                              <Button size="sm" variant="secondary" className="mt-2">
                                <Heart className="h-3 w-3 mr-1" />
                                Commencer ({msg.exerciseData.duration})
                              </Button>
                            </div>
                          )}
                        </div>
                        
                        {/* Suggestions */}
                        {msg.suggestions && (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {msg.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                size="sm"
                                variant="outline"
                                className="text-xs h-6"
                                onClick={() => setMessage(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Partagez vos pensées, émotions, ou posez une question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="pr-20 border-border/50 focus:border-primary"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => setIsRecording(!isRecording)}
                      >
                        <Mic className={`h-3 w-3 ${isRecording ? 'text-destructive' : 'text-muted-foreground'}`} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Quick Suggestions Row */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant="outline"
                      className="text-xs h-6"
                      onClick={() => setMessage(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIChat;