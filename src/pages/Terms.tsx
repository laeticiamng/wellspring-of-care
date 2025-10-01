import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Conditions d'Utilisation - EmotionsCare</title>
        <meta name="description" content="Conditions générales d'utilisation de la plateforme EmotionsCare" />
      </Helmet>

      <div className="min-h-screen bg-gradient-calm py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">Conditions Générales d'Utilisation</CardTitle>
              <p className="text-sm text-muted-foreground">Dernière mise à jour: 1er octobre 2025</p>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptation des Conditions</h2>
                <p>
                  En accédant et en utilisant EmotionsCare, vous acceptez d'être lié par ces conditions générales 
                  d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description du Service</h2>
                <p>
                  EmotionsCare est une plateforme de bien-être émotionnel proposant :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>19 modules thérapeutiques (méditation, VR, musicothérapie, etc.)</li>
                  <li>Évaluations cliniques validées (WHO-5, PANAS, etc.)</li>
                  <li>Coach IA et assistant virtuel Nyvée</li>
                  <li>Suivi de progression et gamification</li>
                  <li>Version B2B pour entreprises</li>
                </ul>
                <p className="mt-4 font-semibold text-amber-600">
                  ⚠️ EmotionsCare <strong>ne remplace pas</strong> un suivi médical ou thérapeutique professionnel. 
                  En cas de crise, contactez le 15 (urgences) ou le 3114 (ligne de prévention du suicide).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Inscription et Compte</h2>
                <h3 className="text-xl font-semibold mt-4 mb-2">3.1 Éligibilité</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Vous devez avoir au moins 18 ans</li>
                  <li>Pour les mineurs (13-17 ans), consentement parental obligatoire</li>
                  <li>Interdiction d'utiliser de fausses informations</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Sécurité du Compte</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Vous êtes responsable de la confidentialité de votre mot de passe</li>
                  <li>Notifiez-nous immédiatement en cas d'utilisation non autorisée</li>
                  <li>Un seul compte par personne</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Utilisation Acceptable</h2>
                <p>Vous vous engagez à <strong>NE PAS</strong> :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Utiliser la plateforme à des fins illégales</li>
                  <li>Harceler, menacer ou diffamer d'autres utilisateurs</li>
                  <li>Partager du contenu violent, pornographique ou haineux</li>
                  <li>Tenter de contourner les mesures de sécurité</li>
                  <li>Utiliser des bots ou scripts automatisés sans autorisation</li>
                  <li>Revendre ou commercialiser les contenus de la plateforme</li>
                </ul>
                <p className="mt-4">
                  <strong>Sanction</strong> : Suspension ou suppression du compte sans préavis ni remboursement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Propriété Intellectuelle</h2>
                <h3 className="text-xl font-semibold mt-4 mb-2">5.1 Contenus EmotionsCare</h3>
                <p>
                  Tous les contenus (textes, vidéos, musiques, images, code source) sont protégés par le droit d'auteur 
                  et appartiennent à EmotionsCare ou ses partenaires. Toute reproduction non autorisée est interdite.
                </p>

                <h3 className="text-xl font-semibold mt-4 mb-2">5.2 Contenus Utilisateur</h3>
                <p>
                  Vous conservez la propriété de vos contenus (journaux, notes, créations). En les publiant sur 
                  la plateforme, vous nous accordez une licence mondiale, non-exclusive, pour les traiter et les afficher 
                  uniquement dans le cadre du service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Abonnements et Paiements</h2>
                <h3 className="text-xl font-semibold mt-4 mb-2">6.1 Offre Gratuite</h3>
                <p>
                  L'offre gratuite donne accès aux fonctionnalités de base. Limites : 5 évaluations/mois, 
                  25 générations QCM, 50 interactions IA.
                </p>

                <h3 className="text-xl font-semibold mt-4 mb-2">6.2 Offre Premium</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Prix</strong> : 9,99€/mois ou 99€/an</li>
                  <li><strong>Avantages</strong> : Accès illimité, modules exclusifs, exports PDF</li>
                  <li><strong>Renouvellement</strong> : Automatique sauf résiliation</li>
                  <li><strong>Résiliation</strong> : Possible à tout moment, effet fin de période</li>
                </ul>

                <h3 className="text-xl font-semibold mt-4 mb-2">6.3 Remboursement</h3>
                <p>
                  Droit de rétractation de 14 jours (sauf si services déjà consommés). 
                  Aucun remboursement en cas de suspension pour violation des CGU.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Limitation de Responsabilité</h2>
                <h3 className="text-xl font-semibold mt-4 mb-2">7.1 Service "tel quel"</h3>
                <p>
                  EmotionsCare est fourni "en l'état", sans garantie de disponibilité 24/7. 
                  Nous ne garantissons pas que le service sera exempt d'erreurs ou d'interruptions.
                </p>

                <h3 className="text-xl font-semibold mt-4 mb-2">7.2 Contenus Tiers</h3>
                <p>
                  Les contenus générés par IA (OpenAI, Hume, Suno) sont fournis à titre informatif. 
                  Nous déclinons toute responsabilité quant à leur exactitude.
                </p>

                <h3 className="text-xl font-semibold mt-4 mb-2">7.3 Exclusions</h3>
                <p>
                  EmotionsCare ne saurait être tenu responsable de :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Dommages indirects (perte de profits, de données, etc.)</li>
                  <li>Décisions prises sur la base des recommandations IA</li>
                  <li>Accès non autorisé dû à un mot de passe compromis</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Résiliation</h2>
                <h3 className="text-xl font-semibold mt-4 mb-2">8.1 Par Vous</h3>
                <p>
                  Vous pouvez supprimer votre compte à tout moment depuis{' '}
                  <Link to="/settings" className="text-primary hover:underline">
                    Paramètres → Compte
                  </Link>. 
                  Les données seront supprimées sous 30 jours.
                </p>

                <h3 className="text-xl font-semibold mt-4 mb-2">8.2 Par EmotionsCare</h3>
                <p>
                  Nous pouvons suspendre ou supprimer votre compte en cas de :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violation des CGU</li>
                  <li>Activité frauduleuse ou illégale</li>
                  <li>Impayés (comptes B2B)</li>
                  <li>Inactivité prolongée (3 ans)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Modifications des CGU</h2>
                <p>
                  Nous nous réservons le droit de modifier ces conditions à tout moment. 
                  Vous serez notifié par email 30 jours avant l'entrée en vigueur des modifications majeures. 
                  L'utilisation continue du service après notification vaut acceptation.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Droit Applicable</h2>
                <p>
                  Ces CGU sont régies par le droit français. Tout litige relève de la compétence exclusive 
                  des tribunaux de Paris, France.
                </p>
                <p className="mt-4">
                  <strong>Médiation</strong> : En cas de litige, vous pouvez saisir le médiateur de la consommation 
                  avant toute action judiciaire : <a href="https://www.economie.gouv.fr/mediation-conso" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mediation-conso.fr</a>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                <p>
                  <strong>EmotionsCare SAS</strong><br />
                  Adresse : 123 Avenue des Champs-Élysées, 75008 Paris<br />
                  Email : <a href="mailto:legal@emotionscare.com" className="text-primary hover:underline">legal@emotionscare.com</a><br />
                  Support : <a href="mailto:support@emotionscare.com" className="text-primary hover:underline">support@emotionscare.com</a>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
