import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité - EmotionsCare</title>
        <meta name="description" content="Politique de confidentialité et protection des données personnelles EmotionsCare - RGPD" />
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
              <CardTitle className="text-3xl">Politique de Confidentialité</CardTitle>
              <p className="text-sm text-muted-foreground">Dernière mise à jour: 1er octobre 2025</p>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Collecte des Données</h2>
                <p>
                  EmotionsCare collecte les données suivantes dans le cadre de votre utilisation de la plateforme :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Données d'identification</strong> : email, nom, prénom</li>
                  <li><strong>Données de santé mentale</strong> : évaluations cliniques (WHO-5, PANAS, etc.), journaux d'humeur</li>
                  <li><strong>Données d'utilisation</strong> : sessions, modules utilisés, progression</li>
                  <li><strong>Données techniques</strong> : cookies de session, adresse IP (anonymisée)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Finalité du Traitement</h2>
                <p>Vos données sont traitées pour :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Fournir les services de bien-être émotionnel</li>
                  <li>Personnaliser votre expérience (recommandations IA)</li>
                  <li>Améliorer nos services et modules thérapeutiques</li>
                  <li>Assurer la sécurité de la plateforme</li>
                  <li>Respecter nos obligations légales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Base Légale (RGPD)</h2>
                <p>Le traitement de vos données repose sur :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Consentement</strong> : pour les évaluations cliniques et données sensibles</li>
                  <li><strong>Exécution du contrat</strong> : pour la fourniture des services</li>
                  <li><strong>Intérêt légitime</strong> : pour l'amélioration des services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Partage des Données</h2>
                <p>
                  Vos données <strong>ne sont jamais vendues</strong>. Elles peuvent être partagées uniquement avec :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Hébergeur</strong> : Supabase (UE, certifié RGPD)</li>
                  <li><strong>Services IA</strong> : OpenAI, Hume AI (données anonymisées)</li>
                  <li><strong>Entreprise cliente</strong> : si compte B2B, données agrégées anonymes uniquement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Sécurité des Données</h2>
                <p>Nous mettons en œuvre des mesures de sécurité avancées :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Chiffrement SSL/TLS en transit</li>
                  <li>Chiffrement des données au repos</li>
                  <li>Authentification sécurisée (JWT)</li>
                  <li>Row-Level Security (RLS) sur toutes les tables</li>
                  <li>Audits de sécurité réguliers</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Vos Droits (RGPD)</h2>
                <p>Vous disposez des droits suivants :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Droit d'accès</strong> : consulter vos données</li>
                  <li><strong>Droit de rectification</strong> : corriger vos données</li>
                  <li><strong>Droit à l'effacement</strong> : supprimer votre compte et données</li>
                  <li><strong>Droit à la portabilité</strong> : exporter vos données (JSON)</li>
                  <li><strong>Droit d'opposition</strong> : refuser certains traitements</li>
                  <li><strong>Droit de limitation</strong> : limiter le traitement</li>
                </ul>
                <p className="mt-4">
                  Pour exercer vos droits, rendez-vous dans{' '}
                  <Link to="/settings" className="text-primary hover:underline">
                    Paramètres → Confidentialité
                  </Link>
                  {' '}ou contactez-nous : <strong>privacy@emotionscare.com</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Durée de Conservation</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Compte actif</strong> : durée illimitée</li>
                  <li><strong>Compte inactif</strong> : 24 mois puis archivage</li>
                  <li><strong>Après suppression</strong> : 30 jours (backup), puis destruction définitive</li>
                  <li><strong>Données légales</strong> : 5 ans (obligations fiscales/juridiques)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
                <p>Nous utilisons uniquement des <strong>cookies essentiels</strong> :</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Session</strong> : authentification (JWT)</li>
                  <li><strong>Préférences</strong> : thème, langue</li>
                  <li><strong>Sécurité</strong> : protection CSRF</li>
                </ul>
                <p className="mt-4">
                  Aucun cookie de tracking publicitaire ou réseaux sociaux n'est utilisé.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">9. Transferts Internationaux</h2>
                <p>
                  Vos données sont hébergées dans l'<strong>Union Européenne</strong> (Supabase - région EU-West).
                  Les services IA (OpenAI, Hume) peuvent traiter des données aux USA, mais uniquement des 
                  données anonymisées/pseudonymisées, conformément aux clauses contractuelles types de la Commission Européenne.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">10. Modifications</h2>
                <p>
                  Cette politique peut être modifiée. Vous serez notifié par email de tout changement majeur 
                  30 jours avant son application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
                <p>
                  <strong>Responsable du traitement</strong> : EmotionsCare SAS<br />
                  <strong>DPO (Délégué à la Protection des Données)</strong> : dpo@emotionscare.com<br />
                  <strong>Support</strong> : support@emotionscare.com
                </p>
                <p className="mt-4">
                  Vous pouvez également déposer une réclamation auprès de la CNIL :{' '}
                  <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    www.cnil.fr
                  </a>
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
