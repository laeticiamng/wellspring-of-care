import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CONSENT_KEY = 'emotionscare_cookie_consent';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Delay showing banner by 1 second for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-5">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg border-2">
        <div className="flex items-start gap-4">
          <Cookie className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          
          <div className="flex-1 space-y-3">
            <h3 className="font-semibold text-lg">🍪 Utilisation des cookies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nous utilisons des cookies essentiels pour assurer le bon fonctionnement de notre plateforme 
              (authentification, sessions). Aucun cookie de tracking publicitaire n'est utilisé. 
              En continuant, vous acceptez notre{' '}
              <Link to="/privacy" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
              {' '}et nos{' '}
              <Link to="/terms" className="text-primary hover:underline">
                conditions d'utilisation
              </Link>.
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAccept} size="sm">
                Accepter
              </Button>
              <Button onClick={handleDecline} size="sm" variant="outline">
                Refuser les cookies non-essentiels
              </Button>
            </div>
          </div>

          <Button
            onClick={handleDecline}
            size="icon"
            variant="ghost"
            className="flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
