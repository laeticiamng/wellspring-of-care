import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Shield, Sparkles, Heart, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Help = () => {
  const [expandedItem, setExpandedItem] = useState<string | undefined>();

  const faqItems = [
    {
      id: "scores",
      question: "Pourquoi je ne vois pas de scores ?",
      answer: "EmotionsCare utilise des échelles cliniques validées (OMS, PANAS, STAI...) mais jamais de manière chiffrée. Tu reçois des badges verbaux doux qui te guident sans te juger. C'est 100% implicite : l'app s'adapte à toi naturellement."
    },
    {
      id: "data",
      question: "Que faites-vous de mes données ?",
      answer: "Tes données sont totalement sécurisées et jamais revendues. L'agrégation est anonyme et tu gardes le contrôle total via tes consentements. Nous suivons les standards OMS pour garantir une approche scientifique et bienveillante."
    },
    {
      id: "implicit",
      question: "C'est quoi l'approche implicite ?",
      answer: "Au lieu de te demander 'Comment te sens-tu ?', l'app observe discrètement tes choix, durées d'usage, interactions. Cela crée une expérience fluide sans questionnaire anxiogène, tout en respectant la science clinique."
    },
    {
      id: "modules",
      question: "Comment choisir mon module ?",
      answer: "Laisse-toi guider par ton intuition. Chaque module (Nyvée, Journal, Breathwork...) est pensé pour un besoin spécifique. Le Dashboard te propose une carte hebdo qui t'oriente naturellement."
    },
    {
      id: "privacy",
      question: "Puis-je désactiver certaines échelles ?",
      answer: "Oui ! Dans Paramètres > Confidentialité, tu peux opt-out de n'importe quelle échelle (WHO-5, PANAS, etc.). Les modules concernés seront alors masqués. Tu gardes 100% du contrôle."
    },
    {
      id: "badges",
      question: "Que signifient les badges ?",
      answer: "Les badges sont des reflets verbaux de ton état émotionnel, générés par IA. Exemples : 'Reflet lumineux ✨', 'Cocon calme 🌱'. Jamais de jugement, toujours doux et contextualisé."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <HelpCircle className="h-16 w-16 mx-auto text-primary" />
          <h1 className="text-4xl font-light">Centre d'aide</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tout ce que tu dois savoir sur ton voyage émotionnel
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Engagement Card */}
          <Card className="border-0 shadow-elegant bg-gradient-to-br from-primary/10 via-accent/5 to-background">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <span>Notre engagement</span>
              </CardTitle>
              <CardDescription>
                La base de confiance de ton parcours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">100% implicite, science OMS</p>
                    <p className="text-sm text-muted-foreground">
                      Échelles cliniques validées (WHO-5, PANAS, STAI...) mais jamais de scores affichés
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Aucune donnée revendue</p>
                    <p className="text-sm text-muted-foreground">
                      Tes données sont sécurisées, anonymisées pour l'agrégation, et tu gardes le contrôle
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Heart className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Badges verbaux uniquement</p>
                    <p className="text-sm text-muted-foreground">
                      Pas de chiffres anxiogènes, juste des reflets doux générés par IA
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Questions fréquentes</CardTitle>
              <CardDescription>
                Les réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion 
                type="single" 
                collapsible 
                value={expandedItem}
                onValueChange={setExpandedItem}
                className="space-y-2"
              >
                {faqItems.map((item, index) => (
                  <AccordionItem 
                    key={item.id} 
                    value={item.id}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-left"
                      >
                        {item.question}
                      </motion.div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-muted-foreground leading-relaxed"
                      >
                        {item.answer}
                      </motion.p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Besoin d'aide supplémentaire ?</CardTitle>
              <CardDescription>
                Notre équipe est là pour toi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Si tu as une question qui ne figure pas dans notre FAQ, n'hésite pas à nous contacter directement.
              </p>
              <Button className="bg-gradient-primary">
                <Mail className="mr-2 h-4 w-4" />
                Parler à une vraie personne 🤝
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Help;
