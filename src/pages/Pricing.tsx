import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import { useStripeCheckout } from '@/hooks/useStripeCheckout';

export default function Pricing() {
  const { createCheckoutSession, loading } = useStripeCheckout();

  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      priceId: null,
      features: [
        '5 scans émotionnels / mois',
        '5 générations musicales / mois',
        'Accès aux exercices de base',
        'Journal personnel',
      ],
    },
    {
      name: 'Premium',
      price: '9.99€',
      priceId: 'price_premium_monthly',
      features: [
        'Scans émotionnels illimités',
        'Générations musicales illimitées',
        'Tous les exercices et méditations',
        'Journal avancé avec IA',
        'Analyses approfondies',
        'Support prioritaire',
      ],
      popular: true,
    },
    {
      name: 'Entreprise',
      price: 'Sur mesure',
      priceId: null,
      features: [
        'Toutes les fonctionnalités Premium',
        'Tableau de bord équipe',
        'Analytics avancés',
        'API personnalisée',
        'Support dédié',
        'Formation sur mesure',
      ],
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choisissez votre plan</h1>
        <p className="text-muted-foreground text-lg">
          Développez votre bien-être émotionnel avec nos outils d'IA
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={plan.popular ? 'border-primary shadow-lg scale-105' : ''}
          >
            {plan.popular && (
              <div className="bg-primary text-primary-foreground text-center py-2 rounded-t-lg font-semibold">
                Populaire
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.priceId && <span className="text-muted-foreground">/mois</span>}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {plan.priceId ? (
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => createCheckoutSession(plan.priceId!)}
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Commencer'}
                </Button>
              ) : plan.name === 'Gratuit' ? (
                <Button className="w-full" size="lg" variant="outline" asChild>
                  <a href="/auth">Commencer gratuitement</a>
                </Button>
              ) : (
                <Button className="w-full" size="lg" variant="outline" asChild>
                  <a href="mailto:contact@emotionscare.com">Nous contacter</a>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
