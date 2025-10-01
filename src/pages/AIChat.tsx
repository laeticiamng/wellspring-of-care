import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Brain, 
  Send, 
  Mic, 
  Paperclip,
  Heart,
  Smile,
  MessageCircle,
  User,
  Bot
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAIChat } from "@/hooks/useAIChat";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AIChat = () => {
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const { messages, sendMessage, isLoading } = useAIChat(conversationId);

  useEffect(() => {
    // Create or get conversation on mount
    const initConversation = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({ 
          user_id: userData.user.id,
          title: 'Nouvelle conversation avec Emma'
        })
        .select()
        .single();
      
      if (data && !error) {
        setConversationId(data.id);
      } else {
        toast.error("Erreur lors de l'initialisation de la conversation");
      }
    };
    
    initConversation();
  }, []);

  const handleSend = async () => {
    if (!message.trim() || !conversationId) return;
    
    const messageToSend = message;
    setMessage("");
    await sendMessage(messageToSend);
  };

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
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-12 w-12 text-primary animate-float" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Le Jardin des Pensées
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Des bulles translucides portent des phrases-haïkus. Emma vous guide dans votre exploration intérieure.
          </p>
          <div className="inline-block animate-pulse-soft">
            <p className="text-lg italic text-primary">☁️ "Observe, laisse passer..." ☁️</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-20rem)]">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* AI Info */}
            <Card className="border-0 shadow-soft">
              <CardContent className="p-4 text-center space-y-3">
                <div className="relative mx-auto w-16 h-16">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
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
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                    <Brain className="h-16 w-16 text-primary animate-pulse-soft" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Bonjour ! Je suis Emma 👋</h3>
                      <p className="text-muted-foreground">
                        Votre assistante IA bien-être. Comment puis-je vous aider aujourd'hui ?
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex max-w-[80%] space-x-2 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <Avatar className="w-8 h-8">
                          {msg.role === 'user' ? (
                            <AvatarFallback className="bg-gradient-secondary text-secondary-foreground">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          ) : (
                            <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <div className={`space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`p-3 rounded-lg ${
                            msg.role === 'user' 
                              ? 'bg-gradient-primary text-primary-foreground' 
                              : 'bg-muted/50 border border-border/50'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted/50 border border-border/50 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>

              {/* Input Area */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Partagez vos pensées, émotions, ou posez une question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                      className="pr-20 border-border/50 focus:border-primary"
                      disabled={isLoading}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Mic className="h-3 w-3 text-muted-foreground" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Paperclip className="h-3 w-3 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="bg-gradient-primary text-primary-foreground border-0 shadow-glow"
                    disabled={!message.trim() || isLoading}
                    onClick={handleSend}
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